import { normalizePhoto, type Photo, type PhotoPage } from "../photos";
import type { UnsplashSearchPayload } from "./types";

const API_ORIGIN = "https://api.unsplash.com";
const DEFAULT_PAGE_SIZE = 24;
const MAX_PAGE_SIZE = 30;

type FetchOptions = RequestInit & { next?: { revalidate: number } };
type Fetcher = (input: string | URL, init?: FetchOptions) => Promise<Response>;

export type UnsplashErrorKind =
  | "configuration"
  | "network"
  | "unauthorized"
  | "forbidden"
  | "rate_limit"
  | "upstream"
  | "request"
  | "invalid_response";

export class UnsplashApiError extends Error {
  constructor(
    public readonly kind: UnsplashErrorKind,
    public readonly status: number | null = null,
    public readonly retryAfterSeconds: number | null = null,
  ) {
    super(`Unsplash API error: ${kind}${status === null ? "" : ` (${status})`}`);
    this.name = "UnsplashApiError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nonNegativeInteger(value: unknown): number | null {
  if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0) return value;
  if (typeof value === "string" && /^\d+$/.test(value)) {
    const parsed = Number(value);
    return Number.isSafeInteger(parsed) ? parsed : null;
  }
  return null;
}

function pagination(page = 1, perPage = DEFAULT_PAGE_SIZE) {
  return {
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    perPage:
      Number.isSafeInteger(perPage) && perPage > 0
        ? Math.min(perPage, MAX_PAGE_SIZE)
        : DEFAULT_PAGE_SIZE,
  };
}

function lastPageFromLink(link: string | null): number | null {
  if (!link) return null;
  for (const match of link.matchAll(/<([^>]+)>;\s*rel="last"/g)) {
    try {
      return nonNegativeInteger(new URL(match[1]).searchParams.get("page"));
    } catch {
      return null;
    }
  }
  return null;
}

function hasNextLink(link: string | null): boolean {
  return link !== null && /<[^>]+>;\s*rel="next"/.test(link);
}

function errorKind(status: number): UnsplashErrorKind {
  if (status === 401) return "unauthorized";
  if (status === 403) return "forbidden";
  if (status === 429) return "rate_limit";
  if (status >= 500) return "upstream";
  return "request";
}

function normalizeResults(values: unknown[]): Photo[] {
  const photos = values.map(normalizePhoto).filter((photo): photo is Photo => photo !== null);
  if (values.length > 0 && photos.length === 0) {
    throw new UnsplashApiError("invalid_response");
  }
  return photos;
}

export function createUnsplashClient(accessKey: string, fetcher: Fetcher = fetch) {
  const key = accessKey.trim();
  if (!key) throw new UnsplashApiError("configuration");

  async function request(path: string, params: URLSearchParams, revalidate: number) {
    const url = new URL(path, API_ORIGIN);
    url.search = params.toString();

    let response: Response;
    try {
      response = await fetcher(url, {
        headers: {
          Authorization: `Client-ID ${key}`,
          "Accept-Version": "v1",
        },
        next: { revalidate },
      });
    } catch {
      throw new UnsplashApiError("network");
    }

    if (!response.ok) {
      throw new UnsplashApiError(
        errorKind(response.status),
        response.status,
        nonNegativeInteger(response.headers.get("Retry-After")),
      );
    }

    try {
      const data: unknown = await response.json();
      return { data, headers: response.headers };
    } catch {
      throw new UnsplashApiError("invalid_response", response.status);
    }
  }

  async function listPhotos(page = 1, perPage = DEFAULT_PAGE_SIZE): Promise<PhotoPage> {
    const options = pagination(page, perPage);
    const params = new URLSearchParams({
      page: String(options.page),
      per_page: String(options.perPage),
    });
    const { data, headers } = await request("/photos", params, 300);
    if (!Array.isArray(data)) throw new UnsplashApiError("invalid_response", 200);

    const photos = normalizeResults(data);
    const total = nonNegativeInteger(headers.get("X-Total"));
    const link = headers.get("Link");
    const totalPages =
      lastPageFromLink(link) ?? (total === null ? null : Math.ceil(total / options.perPage));

    return {
      photos,
      ...options,
      total,
      totalPages,
      hasNextPage:
        hasNextLink(link) ||
        (totalPages === null ? data.length === options.perPage : options.page < totalPages),
      hasPreviousPage: options.page > 1,
      rateLimitRemaining: nonNegativeInteger(headers.get("X-Ratelimit-Remaining")),
    };
  }

  async function getPhoto(id: string): Promise<Photo | null> {
    const photoId = id.trim();
    if (!photoId) return null;

    try {
      const { data } = await request(
        `/photos/${encodeURIComponent(photoId)}`,
        new URLSearchParams(),
        3600,
      );
      const photo = normalizePhoto(data);
      if (!photo) throw new UnsplashApiError("invalid_response", 200);
      return photo;
    } catch (error) {
      if (error instanceof UnsplashApiError && error.status === 404) return null;
      throw error;
    }
  }

  async function searchPhotos(
    query: string,
    page = 1,
    perPage = DEFAULT_PAGE_SIZE,
  ): Promise<PhotoPage> {
    const options = pagination(page, perPage);
    const term = query.trim();
    if (!term) {
      return {
        photos: [],
        ...options,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        rateLimitRemaining: null,
      };
    }

    const params = new URLSearchParams({
      query: term,
      page: String(options.page),
      per_page: String(options.perPage),
    });
    const { data, headers } = await request("/search/photos", params, 300);
    if (!isRecord(data) || !Array.isArray(data.results)) {
      throw new UnsplashApiError("invalid_response", 200);
    }

    const payload = data as unknown as UnsplashSearchPayload;
    const total = nonNegativeInteger(payload.total);
    const totalPages = nonNegativeInteger(payload.total_pages);
    if (total === null || totalPages === null) {
      throw new UnsplashApiError("invalid_response", 200);
    }

    return {
      photos: normalizeResults(payload.results),
      ...options,
      total,
      totalPages,
      hasNextPage: options.page < totalPages,
      hasPreviousPage: options.page > 1,
      rateLimitRemaining: nonNegativeInteger(headers.get("X-Ratelimit-Remaining")),
    };
  }

  return { listPhotos, getPhoto, searchPhotos };
}
