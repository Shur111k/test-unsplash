import Link from "next/link";
import { galleryPageHref, tagGalleryPath, type GalleryColumns } from "@/lib/gallery-navigation";
import type { Photo } from "@/lib/photos";
import styles from "./PhotoDetails.module.css";

interface PhotoDetailsProps {
  photo: Photo;
  preview: boolean;
  columns: GalleryColumns;
}

export function PhotoDetails({ photo, preview, columns }: PhotoDetailsProps) {
  return (
    <section className={styles.details} aria-labelledby="photo-story">
      <div className={styles.story}>
        <p className={styles.kicker}>За межами кадру</p>
        <h2 id="photo-story">
          Маленька історія<span>.</span>
        </h2>
        <p className={styles.description}>{photo.description ?? photo.alt}</p>
        <a
          className={styles.original}
          href={photo.photoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Переглянути на Unsplash ↗
        </a>
      </div>
      <div className={styles.metadata}>
        <dl className={styles.facts}>
          <div>
            <dt>Фотограф</dt>
            <dd>
              <a href={photo.author.profileUrl} target="_blank" rel="noopener noreferrer">
                {photo.author.name} ↗
              </a>
            </dd>
          </div>
          <div>
            <dt>Розмір оригіналу</dt>
            <dd>
              {photo.width.toLocaleString("uk-UA")} × {photo.height.toLocaleString("uk-UA")} px
            </dd>
          </div>
          <div>
            <dt>Вподобання на Unsplash</dt>
            <dd>{photo.likes === null ? "Немає даних" : photo.likes.toLocaleString("uk-UA")}</dd>
          </div>
        </dl>
        <div className={styles.topics}>
          <h3>Продовжити дослідження</h3>
          {photo.tags.length > 0 ? (
            <ul className={styles.tags}>
              {photo.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={galleryPageHref(1, columns, preview, tagGalleryPath(tag))}
                    prefetch={false}
                  >
                    <span aria-hidden="true">#</span> {tag} <span aria-hidden="true">↗</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>Для цього фото теги не вказані.</p>
          )}
        </div>
      </div>
    </section>
  );
}
