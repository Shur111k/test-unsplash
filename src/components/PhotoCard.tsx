import * as m from "motion/react-m";
import type { Photo } from "@/lib/photos";
import { Attribution } from "./Attribution";
import { PhotoLink } from "./PhotoLink";
import styles from "./PhotoCard.module.css";

export function PhotoCard({ photo, index }: { photo: Photo; index: number }) {
  return (
    <m.article
      className={styles.card}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
    >
      <PhotoLink
        className={styles.imageLink}
        id={photo.id}
        label={`Переглянути фото: ${photo.alt}`}
      >
        {/* Direct Unsplash CDN URLs preserve the provider's image hotlink. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.urls.regular}
          srcSet={`${photo.urls.small} 400w, ${photo.urls.regular} 1080w`}
          sizes="(max-width: 620px) calc(100vw - 32px), (max-width: 1000px) 45vw, 30vw"
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          loading={index < 3 ? "eager" : "lazy"}
          decoding="async"
          style={{ backgroundColor: photo.color ?? "#e3e6dd" }}
        />
        <span className={styles.viewPhoto} aria-hidden="true">
          ↗
        </span>
      </PhotoLink>
      <div className={styles.cardMeta}>
        <Attribution photo={photo} compact />
        <span className={styles.cardNumber} aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </m.article>
  );
}
