import type { UnsplashPhotoPayload } from "./unsplash/types";

export interface Photo {
  id: string;
  width: number;
  height: number;
  alt: string;
  description: string | null;
  color: string | null;
  blurHash: string | null;
  likes: number | null;
  tags: string[];
  urls: {
    thumb: string;
    small: string;
    regular: string;
    full: string;
  };
  photoUrl: string;
  author: {
    name: string;
    username: string;
    profileUrl: string;
    avatarUrl: string | null;
  };
}

export interface PhotoPage {
  photos: Photo[];
  page: number;
  perPage: number;
  total: number | null;
  totalPages: number | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  rateLimitRemaining: number | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function positiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function optionalUrl(value: unknown): string | null {
  const text = nonEmptyString(value);
  if (!text) return null;

  try {
    const url = new URL(text);
    return url.protocol === "https:" || url.protocol === "http:" ? text : null;
  } catch {
    return null;
  }
}

function withAttribution(url: string): string {
  const result = new URL(url);
  result.searchParams.set("utm_source", "photo_gallery_test");
  result.searchParams.set("utm_medium", "referral");
  return result.toString();
}

/** Convert an untrusted API object into the small shape used by the UI. */
export function normalizePhoto(value: unknown): Photo | null {
  if (!isRecord(value)) return null;

  const payload = value as unknown as UnsplashPhotoPayload;
  const id = nonEmptyString(payload.id);
  const urls = isRecord(payload.urls) ? payload.urls : null;
  const user = isRecord(payload.user) ? payload.user : null;
  const name = user ? nonEmptyString(user.name) : null;
  const username = user ? nonEmptyString(user.username) : null;

  if (!id || !positiveInteger(payload.width) || !positiveInteger(payload.height)) {
    return null;
  }

  const regular = urls ? optionalUrl(urls.regular) ?? optionalUrl(urls.small) : null;
  if (!regular || !name || !username) return null;

  const userLinks = isRecord(user?.links) ? user.links : null;
  const photoLinks = isRecord(payload.links) ? payload.links : null;
  const profileImage = isRecord(user?.profile_image) ? user.profile_image : null;
  const profileUrl = optionalUrl(userLinks?.html) ?? `https://unsplash.com/@${username}`;
  const photoUrl = optionalUrl(photoLinks?.html) ?? `https://unsplash.com/photos/${id}`;
  const description = nonEmptyString(payload.description);
  const alt = nonEmptyString(payload.alt_description) ?? description ?? `Фото автора ${name}`;
  const tags = Array.isArray(payload.tags)
    ? [...new Set(payload.tags.flatMap((tag) => {
        if (!isRecord(tag)) return [];
        const title = nonEmptyString(tag.title);
        return title ? [title] : [];
      }))]
    : [];

  return {
    id,
    width: payload.width,
    height: payload.height,
    alt,
    description,
    color: typeof payload.color === "string" && /^#[\da-f]{6}$/i.test(payload.color)
      ? payload.color
      : null,
    blurHash: nonEmptyString(payload.blur_hash),
    likes: typeof payload.likes === "number" && Number.isSafeInteger(payload.likes) && payload.likes >= 0
      ? payload.likes
      : null,
    tags,
    urls: {
      thumb: optionalUrl(urls?.thumb) ?? regular,
      small: optionalUrl(urls?.small) ?? regular,
      regular,
      full: optionalUrl(urls?.full) ?? regular,
    },
    photoUrl: withAttribution(photoUrl),
    author: {
      name,
      username,
      profileUrl: withAttribution(profileUrl),
      avatarUrl: optionalUrl(profileImage?.small),
    },
  };
}
