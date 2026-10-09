"use server";

import { revalidatePath } from "next/cache";
import type { Photo } from "@/lib/photos";
import { previewPhotos } from "@/lib/preview-photos";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SaveResult = { ok: true } | { ok: false; error: string };

const ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;
const ERROR = "Не вдалося оновити добірку. Спробуйте ще раз.";

function validText(value: unknown, max: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}

function validUrl(value: unknown, hosts: string[]): value is string {
  if (!validText(value, 5000)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && hosts.includes(url.hostname);
  } catch {
    return false;
  }
}

function photoSnapshot(input: Photo) {
  if (!input || !ID_PATTERN.test(input.id)) return null;
  const isPreview = input.id.startsWith("preview-");
  const photo = isPreview ? previewPhotos.find((item) => item.id === input.id) : input;
  if (!photo) return null;

  const image = photo.urls?.regular;
  const previewImage =
    isPreview && typeof image === "string" && image.startsWith("data:image/svg+xml,");
  if (
    !validText(photo.alt, 500) ||
    !validText(photo.author?.name, 200) ||
    !validUrl(photo.photoUrl, ["unsplash.com", "www.unsplash.com"]) ||
    !validUrl(photo.author.profileUrl, ["unsplash.com", "www.unsplash.com"]) ||
    !(previewImage || validUrl(image, ["images.unsplash.com", "plus.unsplash.com"])) ||
    !Number.isInteger(photo.width) ||
    photo.width < 1 ||
    photo.width > 100000 ||
    !Number.isInteger(photo.height) ||
    photo.height < 1 ||
    photo.height > 100000 ||
    (photo.color !== null && !/^#[0-9a-fA-F]{6}$/.test(photo.color))
  )
    return null;

  return {
    photo_id: photo.id,
    alt: photo.alt.trim(),
    image_url: image,
    photo_url: photo.photoUrl,
    author_name: photo.author.name.trim(),
    author_profile_url: photo.author.profileUrl,
    width: photo.width,
    height: photo.height,
    color: photo.color,
  };
}

export async function savePhotoAction(photo: Photo): Promise<SaveResult> {
  const snapshot = photoSnapshot(photo);
  if (!snapshot) return { ok: false, error: "Некоректні дані фото." };

  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getClaims();
    if (!data?.claims?.sub) return { ok: false, error: "Увійдіть, щоб зберегти фото." };

    const { error } = await supabase
      .from("saved_photos")
      .upsert(
        { ...snapshot, user_id: data.claims.sub },
        { onConflict: "user_id,photo_id", ignoreDuplicates: true },
      );
    if (error) return { ok: false, error: ERROR };
    revalidatePath("/profile");
    return { ok: true };
  } catch {
    return { ok: false, error: ERROR };
  }
}

export async function removePhotoAction(photoId: string): Promise<SaveResult> {
  if (!ID_PATTERN.test(photoId)) return { ok: false, error: "Некоректний ідентифікатор фото." };

  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getClaims();
    if (!data?.claims?.sub) return { ok: false, error: "Увійдіть, щоб змінити добірку." };

    const { error } = await supabase
      .from("saved_photos")
      .delete()
      .eq("user_id", data.claims.sub)
      .eq("photo_id", photoId);
    if (error) return { ok: false, error: ERROR };
    revalidatePath("/profile");
    return { ok: true };
  } catch {
    return { ok: false, error: ERROR };
  }
}
