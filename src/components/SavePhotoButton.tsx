"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { Photo } from "@/lib/photos";
import { removePhotoAction, savePhotoAction } from "@/lib/saved-photos/actions";
import styles from "./SavePhotoButton.module.css";

interface SavePhotoButtonProps {
  photo: Photo;
  signedIn: boolean;
  initiallySaved: boolean;
}

export function SavePhotoButton({ photo, signedIn, initiallySaved }: SavePhotoButtonProps) {
  const [saved, setSaved] = useState(initiallySaved);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  if (!signedIn) {
    return (
      <Link
        className={styles.button}
        href="/login"
        prefetch={false}
        aria-label={`Увійти, щоб зберегти: ${photo.alt}`}
      >
        <span aria-hidden="true">♡</span>
      </Link>
    );
  }

  function toggle() {
    setError("");
    startTransition(async () => {
      const result = saved ? await removePhotoAction(photo.id) : await savePhotoAction(photo);
      if (result.ok) {
        setSaved(!saved);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className={styles.control}>
      <button
        className={styles.button}
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-pressed={saved}
        aria-label={
          saved ? `Видалити з добірки: ${photo.alt}` : `Зберегти до добірки: ${photo.alt}`
        }
        title={saved ? "Прибрати з добірки" : "Зберегти до добірки"}
      >
        <span aria-hidden="true">{saved ? "♥" : "♡"}</span>
      </button>
      {error && (
        <span className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
