import { describe, expect, it } from "vitest";
import { galleryPageHref, parseGalleryColumns, parseGalleryPage } from "./gallery-navigation";
import { getPreviewPhotoPage } from "./preview-photos";

describe("gallery URL state", () => {
  it("accepts only a single positive safe page number", () => {
    expect(parseGalleryPage("2")).toBe(2);
    for (const value of [undefined, "0", "-1", "2.5", "2abc", "9007199254740992", ["1", "2"]]) {
      expect(parseGalleryPage(value)).toBe(1);
    }
  });

  it("uses only supported column counts", () => {
    expect(parseGalleryColumns("5")).toBe(5);
    expect(parseGalleryColumns("3")).toBe(3);
    expect(parseGalleryColumns("7")).toBe(3);
  });

  it("keeps layout and preview state in page links", () => {
    expect(galleryPageHref(2, 5, true)).toBe("/?page=2&cols=5&preview=1#gallery");
    expect(galleryPageHref(1, 3, false)).toBe("/?page=1&cols=3#gallery");
  });

  it("provides two distinct local pages without an API call", () => {
    const first = getPreviewPhotoPage(1);
    const second = getPreviewPhotoPage(2);

    expect(first.photos).toHaveLength(12);
    expect(second.photos).toHaveLength(12);
    expect(first.photos[0].id).not.toBe(second.photos[0].id);
    expect(first.hasPreviousPage).toBe(false);
    expect(first.hasNextPage).toBe(true);
    expect(second.hasPreviousPage).toBe(true);
    expect(second.hasNextPage).toBe(false);
  });
});
