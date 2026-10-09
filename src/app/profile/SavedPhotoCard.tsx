"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { SavedPhoto } from "@/lib/saved-photos";
import { removePhotoAction } from "@/lib/saved-photos/actions";
import styles from "./SavedPhotoCard.module.css";

export function SavedPhotoCard({ photo, page }: { photo: SavedPhoto; page: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const detailHref = `/photos/${encodeURIComponent(photo.photo_id)}?from=${encodeURIComponent(`/profile?page=${page}#saved`)}`;

  function remove() {
    setError("");
    startTransition(async () => {
      const result = await removePhotoAction(photo.photo_id);
      if (result.ok) router.refresh();
      else setError(result.error);
    });
  }

  return (
    <article className={styles.card}>
      <Link
        href={detailHref}
        prefetch={false}
        className={styles.imageLink}
        aria-label={`Переглянути фото: ${photo.alt}`}
      >
        {/* Saved provider URLs remain directly hotlinked as in the gallery. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.image_url}
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          style={{ backgroundColor: photo.color ?? "#e3e6dd" }}
        />
      </Link>
      <div className={styles.meta}>
        <div>
          <a href={photo.author_profile_url} target="_blank" rel="noopener noreferrer">
            {photo.author_name} ↗
          </a>
          <span>{photo.alt}</span>
        </div>
        <button
          type="button"
          onClick={remove}
          disabled={pending}
          aria-label={`Видалити «${photo.alt}» з добірки`}
          title="Прибрати з добірки"
        >
          {pending ? "…" : "×"}
        </button>
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </article>
  );
}
