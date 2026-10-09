import { describe, expect, it } from "vitest";
import {
  galleryPageHref,
  parseGalleryColumns,
  parseGalleryPage,
  parseSearchTerm,
  safeGalleryReturnHref,
  searchGalleryHref,
  tagGalleryPath,
} from "./gallery-navigation";
import { getPreviewPhotoPage, getPreviewSearchPage } from "./preview-photos";

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

  it("normalizes a single search term", () => {
    expect(parseSearchTerm("  нічне місто  ")).toBe("нічне місто");
    expect(parseSearchTerm("a".repeat(121))).toHaveLength(120);
    expect(parseSearchTerm(["one", "two"])).toBe("");
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

  it("keeps encoded tags, pagination and layout in return links", () => {
    const pathname = tagGalleryPath("світло & тіні");
    const href = galleryPageHref(2, 5, true, pathname);
    expect(safeGalleryReturnHref(href, true)).toBe(href);
    expect(safeGalleryReturnHref(href, false)).toBe(galleryPageHref(2, 5, false, pathname));
  });

  it("preserves search context in result, pagination and photo return links", () => {
    const href = searchGalleryHref("світло & тіні", 2, 5, true);
    expect(href).toBe(
      "/search?page=2&cols=5&preview=1&q=%D1%81%D0%B2%D1%96%D1%82%D0%BB%D0%BE+%26+%D1%82%D1%96%D0%BD%D1%96#gallery",
    );
    expect(safeGalleryReturnHref(href, true)).toBe(href);
    expect(safeGalleryReturnHref(href, false)).toBe(
      searchGalleryHref("світло & тіні", 2, 5, false),
    );
    expect(safeGalleryReturnHref("/search?q=%20%20", true)).toBe(galleryPageHref(1, 3, true));
  });

  it("returns saved photos to the profile without accepting an external destination", () => {
    expect(safeGalleryReturnHref("/profile?page=2#saved", false)).toBe("/profile?page=2#saved");
    expect(safeGalleryReturnHref("//evil.test/profile", false)).toBe(galleryPageHref(1, 3, false));
  });

  it("rejects external, malformed and unrelated return destinations", () => {
    for (const href of [
      "https://evil.test",
      "//evil.test",
      "/\\evil.test",
      "/photos/id",
      "/tags/%",
      "/tags/%20",
      ["/", "/tags/a"],
    ]) {
      expect(safeGalleryReturnHref(href, true)).toBe(galleryPageHref(1, 3, true));
    }
    expect(safeGalleryReturnHref("/?page=-2&cols=7&unexpected=value", false)).toBe(
      galleryPageHref(1, 3, false),
    );
  });

  it("filters local tag results before paginating and handles missing tags", () => {
    const first = getPreviewPhotoPage(1, " ABSTRACT ");
    const second = getPreviewPhotoPage(2, "abstract");
    expect(first.total).toBe(23);
    expect(first.photos).toHaveLength(12);
    expect(second.photos).toHaveLength(11);
    expect(second.hasNextPage).toBe(false);
    expect(
      [...first.photos, ...second.photos].every((photo) => photo.tags.includes("abstract")),
    ).toBe(true);
    expect(getPreviewPhotoPage(1, "missing")).toMatchObject({
      photos: [],
      total: 0,
      hasNextPage: false,
    });
    expect(getPreviewPhotoPage(99, "abstract").photos).toEqual([]);
  });

  it("filters local search results before paginating", () => {
    const first = getPreviewSearchPage(1, " ABSTRACT ");
    const second = getPreviewSearchPage(2, "abstract");
    expect(first.total).toBe(23);
    expect(first.photos).toHaveLength(12);
    expect(second.photos).toHaveLength(11);
    expect(getPreviewSearchPage(1, "макет").total).toBe(24);
    expect(getPreviewSearchPage(1, "невідоме").photos).toEqual([]);
  });
});
