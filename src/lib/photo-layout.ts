import type { Photo } from "./photos";

export interface PhotoLayout {
  aspectRatio: number;
  widthInTwoColumns: string;
  widthInThreeColumns: string;
  widthInFiveColumns: string;
}

export function getPhotoRows<T>(photos: T[], columns: number): T[][] {
  if (!Number.isInteger(columns) || columns < 1) {
    throw new RangeError("The number of columns must be a positive integer.");
  }

  const rows: T[][] = [];
  for (let start = 0; start < photos.length; start += columns) {
    rows.push(photos.slice(start, start + columns));
  }

  const lastRow = rows.at(-1);
  const previousRow = rows.at(-2);

  // Avoid a tiny final row becoming much taller than the rest of the gallery.
  if (previousRow && lastRow && lastRow.length < Math.ceil(columns / 2)) {
    const transferCount = Math.floor((previousRow.length - lastRow.length) / 2);
    lastRow.unshift(...previousRow.splice(-transferCount, transferCount));
  }

  return rows;
}

/** Each row shares one image height; widths follow the original aspect ratios. */
export function getRowWidths(photos: Pick<Photo, "width" | "height">[], columns: number): string[] {
  const widths: string[] = [];

  for (const row of getPhotoRows(photos, columns)) {
    const ratios = row.map((photo) => photo.width / photo.height);
    const totalRatio = ratios.reduce((total, ratio) => total + ratio, 0);

    for (const ratio of ratios) {
      // Leave room for subpixel rounding; flex-grow distributes the remainder.
      widths.push(
        `calc((100% - ${row.length - 1} * var(--photo-gap)) * ${ratio / totalRatio} - 0.1px)`,
      );
    }
  }

  return widths;
}

export function getPhotoLayouts(photos: Photo[]): PhotoLayout[] {
  const twoColumns = getRowWidths(photos, 2);
  const threeColumns = getRowWidths(photos, 3);
  const fiveColumns = getRowWidths(photos, 5);

  return photos.map((photo, index) => ({
    aspectRatio: photo.width / photo.height,
    widthInTwoColumns: twoColumns[index],
    widthInThreeColumns: threeColumns[index],
    widthInFiveColumns: fiveColumns[index],
  }));
}
