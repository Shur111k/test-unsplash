export type GalleryColumns = 3 | 5;

export type QueryValue = string | string[] | undefined;

export interface GallerySearchParams {
  page?: QueryValue;
  cols?: QueryValue;
  preview?: QueryValue;
  q?: QueryValue;
}

export function parseSearchTerm(value: QueryValue): string {
  return typeof value === "string" ? value.trim().slice(0, 120) : "";
}

export function parseGalleryPage(value: QueryValue): number {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) ? page : 1;
}

export function parseGalleryColumns(value: QueryValue): GalleryColumns {
  return value === "5" ? 5 : 3;
}

export function galleryPageHref(
  page: number,
  columns: GalleryColumns,
  preview: boolean,
  pathname = "/",
  searchQuery?: string,
): string {
  const params = new URLSearchParams({ page: String(page), cols: String(columns) });
  if (preview) params.set("preview", "1");
  if (pathname === "/search" && searchQuery) params.set("q", searchQuery);
  return `${pathname}?${params.toString()}#gallery`;
}

export function searchGalleryHref(
  query: string,
  page: number,
  columns: GalleryColumns,
  preview: boolean,
): string {
  return galleryPageHref(page, columns, preview, "/search", query);
}

export function tagGalleryPath(tag: string): string {
  return `/tags/${encodeURIComponent(tag.trim())}`;
}

/** Rebuild only known gallery routes; never navigate to a user-supplied origin. */
export function safeGalleryReturnHref(value: QueryValue, preview: boolean): string {
  const fallback = galleryPageHref(1, 3, preview);
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  try {
    const url = new URL(value, "https://mira.local");
    if (url.origin !== "https://mira.local" || value.includes("\\")) return fallback;
    const tagMatch = /^\/tags\/([^/]+)$/.exec(url.pathname);
    const isSearch = url.pathname === "/search";
    if (url.pathname !== "/" && !tagMatch && !isSearch) return fallback;
    const tag = tagMatch ? decodeURIComponent(tagMatch[1]).trim() : null;
    if (tagMatch && !tag) return fallback;
    const searchQuery = isSearch ? parseSearchTerm(url.searchParams.get("q") ?? undefined) : "";
    if (isSearch && !searchQuery) return fallback;

    return galleryPageHref(
      parseGalleryPage(url.searchParams.get("page") ?? undefined),
      parseGalleryColumns(url.searchParams.get("cols") ?? undefined),
      preview,
      tag ? tagGalleryPath(tag) : isSearch ? "/search" : "/",
      searchQuery,
    );
  } catch {
    return fallback;
  }
}
