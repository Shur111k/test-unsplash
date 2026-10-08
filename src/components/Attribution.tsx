import type { Photo } from "@/lib/photos";
import styles from "./Attribution.module.css";

export function Attribution({ photo, compact = false }: { photo: Photo; compact?: boolean }) {
  if (compact) {
    return (
      <p className={styles.compact}>
        <a
          className={styles.author}
          href={photo.author.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`Фото: ${photo.author.name}`}
          aria-label={`Автор ${photo.author.name} на Unsplash, нова вкладка`}
        >
          {photo.author.name}
        </a>
        <a
          className={styles.source}
          href={photo.photoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Фото на Unsplash, нова вкладка"
        >
          Unsplash ↗
        </a>
      </p>
    );
  }

  return (
    <p className={styles.attribution}>
      Фото:{" "}
      <a
        href={photo.author.profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Автор ${photo.author.name} на Unsplash, нова вкладка`}
      >
        {photo.author.name}
      </a>
      <span aria-hidden="true"> / </span>
      <a
        href={photo.photoUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Фото на Unsplash, нова вкладка"
      >
        Unsplash ↗
      </a>
    </p>
  );
}
