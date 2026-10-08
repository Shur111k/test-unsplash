import { describe, expect, it, vi } from "vitest";

import { normalizePhoto } from "../photos";
import { createUnsplashClient, UnsplashApiError } from "./client";

const photoPayload = {
  id: "photo-1",
  width: 4000,
  height: 3000,
  alt_description: null,
  description: "A mountain at sunrise",
  color: "#aabbcc",
  blur_hash: "abc",
  likes: 12,
  urls: {
    thumb: "https://images.unsplash.com/thumb?ixid=one",
    small: "https://images.unsplash.com/small?ixid=one",
    regular: "https://images.unsplash.com/regular?ixid=one",
    full: "https://images.unsplash.com/full?ixid=one",
  },
  links: { html: "https://unsplash.com/photos/photo-1" },
  user: {
    name: "Ada Example",
    username: "ada",
    links: { html: "https://unsplash.com/@ada" },
    profile_image: { small: "https://images.unsplash.com/avatar" },
  },
  tags: [{ title: "Nature" }, { title: "Nature" }, { title: "Sunrise" }],
};

type TestFetcher = (
  input: string | URL,
  init?: RequestInit & { next?: { revalidate: number } },
) => Promise<Response>;

function mockFetch(response: Response) {
  return vi.fn<TestFetcher>(async () => response);
}

describe("photo normalization", () => {
  it("keeps API image URLs and prepares attribution links", () => {
    const photo = normalizePhoto(photoPayload);

    expect(photo?.urls).toEqual(photoPayload.urls);
    expect(photo?.alt).toBe(photoPayload.description);
    expect(photo?.tags).toEqual(["Nature", "Sunrise"]);
    expect(photo?.author.profileUrl).toContain("utm_source=photo_gallery_test");
    expect(photo?.photoUrl).toContain("utm_medium=referral");
  });

  it("drops records without an image or author and tolerates missing optional fields", () => {
    expect(normalizePhoto({ ...photoPayload, urls: {} })).toBeNull();
    expect(normalizePhoto({ ...photoPayload, user: null })).toBeNull();

    const photo = normalizePhoto({
      ...photoPayload,
      description: null,
      tags: null,
      likes: null,
      color: "invalid",
    });
    expect(photo).toMatchObject({
      alt: "Фото автора Ada Example",
      description: null,
      tags: [],
      likes: null,
      color: null,
    });
  });
});

describe("Unsplash client", () => {
  it("normalizes pagination, reads headers and sends the access key only in a header", async () => {
    const fetcher = mockFetch(
      new Response(JSON.stringify([photoPayload]), {
        headers: {
          "X-Total": "72",
          "X-Ratelimit-Remaining": "49",
          Link: '<https://api.unsplash.com/photos?page=3>; rel="last", <https://api.unsplash.com/photos?page=2>; rel="next"',
        },
      }),
    );

    const result = await createUnsplashClient("test-key", fetcher).listPhotos(0, 50);
    const [input, init] = fetcher.mock.calls[0];
    const url = new URL(input);

    expect(url.pathname).toBe("/photos");
    expect(url.searchParams.get("page")).toBe("1");
    expect(url.searchParams.get("per_page")).toBe("30");
    expect(url.href).not.toContain("test-key");
    expect(init?.headers).toMatchObject({
      Authorization: "Client-ID test-key",
      "Accept-Version": "v1",
    });
    expect(init?.next?.revalidate).toBe(300);
    expect(result).toMatchObject({
      page: 1,
      perPage: 30,
      total: 72,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: false,
      rateLimitRemaining: 49,
    });
    expect(result.photos).toHaveLength(1);
  });

  it("uses search totals and does not call the API for a blank query", async () => {
    const fetcher = mockFetch(
      new Response(
        JSON.stringify({
          total: 25,
          total_pages: 2,
          results: [photoPayload],
        }),
      ),
    );
    const client = createUnsplashClient("test-key", fetcher);

    const empty = await client.searchPhotos("   ");
    expect(empty).toMatchObject({ total: 0, totalPages: 0, hasNextPage: false });
    expect(fetcher).not.toHaveBeenCalled();

    const result = await client.searchPhotos("  mountain sky  ", 2);
    const url = new URL(fetcher.mock.calls[0][0]);
    expect(url.pathname).toBe("/search/photos");
    expect(url.searchParams.get("query")).toBe("mountain sky");
    expect(result).toMatchObject({
      page: 2,
      total: 25,
      totalPages: 2,
      hasNextPage: false,
      hasPreviousPage: true,
    });
  });

  it("returns null for a missing photo and maps detail fields", async () => {
    const missing = mockFetch(new Response(null, { status: 404 }));
    expect(await createUnsplashClient("test-key", missing).getPhoto("missing")).toBeNull();

    const found = mockFetch(new Response(JSON.stringify(photoPayload)));
    const photo = await createUnsplashClient("test-key", found).getPhoto("photo-1");
    expect(photo?.tags).toEqual(["Nature", "Sunrise"]);
    expect(found.mock.calls[0][1]?.next?.revalidate).toBe(3600);
  });

  it.each([
    [401, "unauthorized"],
    [403, "forbidden"],
    [429, "rate_limit"],
    [503, "upstream"],
  ] as const)("classifies HTTP %s", async (status, kind) => {
    const fetcher = mockFetch(new Response(null, { status, headers: { "Retry-After": "30" } }));
    await expect(createUnsplashClient("test-key", fetcher).listPhotos()).rejects.toMatchObject({
      kind,
      status,
      retryAfterSeconds: 30,
    });
  });

  it("keeps malformed responses and network failures distinct", async () => {
    const malformed = mockFetch(new Response(JSON.stringify({ results: [] })));
    await expect(createUnsplashClient("test-key", malformed).listPhotos()).rejects.toMatchObject({
      kind: "invalid_response",
    });

    const rejected = vi.fn<TestFetcher>(async () => {
      throw new Error("connection lost");
    });
    await expect(createUnsplashClient("test-key", rejected).listPhotos()).rejects.toMatchObject({
      kind: "network",
    });
    expect(() => createUnsplashClient(" ")).toThrow(UnsplashApiError);
  });
});
