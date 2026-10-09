import "server-only";

import type { Photo } from "@/lib/photos";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface SavedPhoto {
  user_id: string;
  photo_id: string;
  alt: string;
  image_url: string;
  photo_url: string;
  author_name: string;
  author_profile_url: string;
  width: number;
  height: number;
  color: string | null;
  saved_at: string;
}

export const SAVED_PAGE_SIZE = 12;

export async function getSavedPhotoIds(photos: Photo[]) {
  if (photos.length === 0) return { signedIn: false, ids: [] as string[] };

  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub;
  if (!userId) return { signedIn: false, ids: [] as string[] };

  const { data, error } = await supabase
    .from("saved_photos")
    .select("photo_id")
    .eq("user_id", userId)
    .in(
      "photo_id",
      photos.map((photo) => photo.id),
    );

  if (error) return { signedIn: true, ids: [] as string[] };
  return { signedIn: true, ids: (data ?? []).map((row) => row.photo_id as string) };
}

export async function getSavedPhotos(userId: string, page: number) {
  const supabase = await createSupabaseServerClient();
  const start = (page - 1) * SAVED_PAGE_SIZE;
  const { data, error, count } = await supabase
    .from("saved_photos")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("saved_at", { ascending: false })
    .order("photo_id", { ascending: true })
    .range(start, start + SAVED_PAGE_SIZE - 1);

  if (error) throw new Error("Не вдалося завантажити особисту добірку.");
  return { photos: (data ?? []) as SavedPhoto[], total: count ?? 0 };
}
