import type { Photo } from "@/lib/photos";
import styles from "./Attribution.module.css";

export function Attribution({ photo }: { photo: Photo }) {
  return (
    <p className={styles.attribution}>
      Фото: <a href={photo.author.profileUrl} target="_blank" rel="noopener noreferrer">{photo.author.name}</a>
      <span aria-hidden="true"> / </span>
      <a href={photo.photoUrl} target="_blank" rel="noopener noreferrer">Unsplash ↗</a>
    </p>
  );
}
