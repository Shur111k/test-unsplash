import type { Photo, PhotoPage } from "./photos";

const palettes = [
  ["#c5b8a0", "#5b7159", "#e8d5b1"],
  ["#b8c6ce", "#49626d", "#eee9dc"],
  ["#dbb49e", "#8c5b4e", "#f1dfc4"],
  ["#b6bfa3", "#3b554c", "#e3cba1"],
  ["#e4d9cb", "#a38d71", "#5c665c"],
  ["#b8c3b9", "#617c79", "#e7e3d4"],
] as const;

const ratios = [
  [900, 1100],
  [1000, 720],
  [840, 1150],
  [900, 940],
  [1100, 750],
  [880, 1100],
] as const;

export const previewPhotos: Photo[] = Array.from({ length: 24 }, (_, index) => {
  const [width, height] = ratios[index % ratios.length];
  const [background, shape, light] = palettes[index % palettes.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="${background}"/><circle cx="${width * 0.7}" cy="${height * 0.3}" r="${width * 0.32}" fill="${light}"/><path d="M0 ${height * 0.65} Q${width * 0.3} ${height * 0.35} ${width * 0.6} ${height * 0.7} T${width} ${height * 0.6} V${height} H0Z" fill="${shape}"/><path d="M0 ${height * 0.88} Q${width * 0.45} ${height * 0.62} ${width} ${height * 0.87} V${height} H0Z" fill="${light}" opacity=".65"/></svg>`;
  const image = `data:image/svg+xml,${encodeURIComponent(svg)}`;

  return {
    id: `preview-${index + 1}`,
    width,
    height,
    alt: `Локальний макет фото ${index + 1}`,
    description:
      index % 3 === 0
        ? "Світло, колір і прості форми. Локальний приклад опису для перегляду сторінки фото."
        : null,
    color: background,
    blurHash: null,
    likes: index === 23 ? null : index * 17,
    tags: index === 23 ? [] : ["abstract", index % 2 === 0 ? "landscape" : "geometry"],
    urls: { thumb: image, small: image, regular: image, full: image },
    photoUrl: "https://unsplash.com/",
    author: {
      name: "Приклад автора",
      username: "preview",
      profileUrl: "https://unsplash.com/",
      avatarUrl: null,
    },
  };
});

export function getPreviewPhotoPage(page: number, tag?: string): PhotoPage {
  const photos =
    tag === undefined
      ? previewPhotos
      : previewPhotos.filter((photo) =>
          photo.tags.some((item) => item.toLowerCase() === tag.trim().toLowerCase()),
        );
  return paginatePreviewPhotos(photos, page);
}

export function getPreviewSearchPage(page: number, query: string): PhotoPage {
  const term = query.trim().toLowerCase();
  const photos = term
    ? previewPhotos.filter((photo) =>
        [photo.alt, photo.description ?? "", ...photo.tags].some((value) =>
          value.toLowerCase().includes(term),
        ),
      )
    : [];

  return paginatePreviewPhotos(photos, page);
}

function paginatePreviewPhotos(photos: Photo[], page: number): PhotoPage {
  const perPage = 12;
  const totalPages = Math.ceil(photos.length / perPage);

  return {
    photos: photos.slice((page - 1) * perPage, page * perPage),
    page,
    perPage,
    total: photos.length,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    rateLimitRemaining: null,
  };
}
