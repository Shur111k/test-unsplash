export type GalleryColumns = 3 | 5;

type QueryValue = string | string[] | undefined;

export function parseGalleryPage(value: QueryValue): number {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) ? page : 1;
}

export function parseGalleryColumns(value: QueryValue): GalleryColumns {
  return value === "5" ? 5 : 3;
}

export function galleryPageHref(page: number, columns: GalleryColumns, preview: boolean): string {
  const params = new URLSearchParams({ page: String(page), cols: String(columns) });
  if (preview) params.set("preview", "1");
  return `/?${params.toString()}#gallery`;
}
