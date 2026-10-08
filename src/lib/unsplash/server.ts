import "server-only";

import { cache } from "react";
import { createUnsplashClient } from "./client";

function getClient() {
  return createUnsplashClient(process.env.UNSPLASH_ACCESS_KEY ?? "");
}

export async function listEditorialPhotos(page = 1, perPage = 24) {
  return getClient().listPhotos(page, perPage);
}

export const getPhotoById = cache(async (id: string) => {
  return getClient().getPhoto(id);
});

export async function searchPhotosByQuery(query: string, page = 1, perPage = 24) {
  return getClient().searchPhotos(query, page, perPage);
}
