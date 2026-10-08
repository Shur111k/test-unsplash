import { describe, expect, it } from "vitest";
import { getPhotoRows, getRowWidths } from "./photo-layout";

describe("justified photo layout", () => {
  it("keeps every photo in source order without mutating the input", () => {
    for (const count of [0, 1, 7, 12, 23, 24]) {
      const photos = Array.from({ length: count }, (_, index) => index);
      const original = [...photos];
      for (const columns of [1, 2, 3, 5]) {
        const rows = getPhotoRows(photos, columns);
        expect(rows.flat()).toEqual(original);
        expect(rows.every((row) => row.length <= columns)).toBe(true);
        expect(photos).toEqual(original);
      }
    }
  });

  it("balances a short last row instead of stretching one or two photographs", () => {
    const photos = Array.from({ length: 12 }, (_, index) => index);
    expect(getPhotoRows(photos, 5).map((row) => row.length)).toEqual([5, 4, 3]);
    expect(getPhotoRows(photos.slice(0, 7), 3).map((row) => row.length)).toEqual([3, 2, 2]);
  });

  it("uses aspect ratios so portrait and landscape photos share an image height", () => {
    const photos = [
      { width: 100, height: 200 },
      { width: 300, height: 200 },
    ];
    const widths = getRowWidths(photos, 2);
    expect(widths[0]).toContain("* 0.25");
    expect(widths[1]).toContain("* 0.75");
    expect(0.25 / (100 / 200)).toBe(0.75 / (300 / 200));
  });

  it("rejects invalid column counts", () => {
    expect(() => getPhotoRows([1], 0)).toThrow(RangeError);
    expect(() => getPhotoRows([1], 2.5)).toThrow(RangeError);
  });
});
