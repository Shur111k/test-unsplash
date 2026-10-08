import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Attribution } from "@/components/Attribution";
import { PhotoDetails } from "@/components/PhotoDetails";
import { SiteShell } from "@/components/SiteShell";
import {
  parseGalleryColumns,
  safeGalleryReturnHref,
  type QueryValue,
} from "@/lib/gallery-navigation";
import { previewPhotos } from "@/lib/preview-photos";
import { photoErrorMessage } from "@/lib/unsplash/error-message";
import { getPhotoById } from "@/lib/unsplash/server";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Фото — MIRA" };

export default async function PhotoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: QueryValue; preview?: QueryValue }>;
}) {
  await connection();
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const isPreview =
    process.env.NODE_ENV === "development" && (id.startsWith("preview-") || query.preview === "1");
  const backHref = safeGalleryReturnHref(query.from, isPreview);
  const columns = parseGalleryColumns(
    new URL(backHref, "https://mira.local").searchParams.get("cols") ?? undefined,
  );

  let photo = isPreview ? previewPhotos.find((item) => item.id === id) : undefined;
  try {
    if (!photo && !isPreview) photo = (await getPhotoById(id)) ?? undefined;
  } catch (error) {
    return (
      <SiteShell preview={isPreview}>
        <main id="main-content" className={`site-container ${styles.message}`}>
          <p className={styles.kicker}>MIRA / Фото</p>
          <h1>Не вдалося завантажити фото.</h1>
          <p role="alert">{photoErrorMessage(error)}</p>
          <Link href={backHref} prefetch={false}>
            ← До галереї
          </Link>
        </main>
      </SiteShell>
    );
  }

  if (!photo) notFound();

  return (
    <SiteShell preview={isPreview}>
      <main id="main-content" className={`site-container ${styles.detail}`}>
        <Link className={styles.back} href={backHref} prefetch={false}>
          ← До галереї
        </Link>
        <div className={styles.heading}>
          <div>
            <p className={styles.kicker}>MIRA / Кадр</p>
            <h1>
              Погляньте ближче<span>.</span>
            </h1>
          </div>
          <p>Один кадр. Цілий світ.</p>
        </div>
        <figure className={styles.figure}>
          {/* Keep the direct Unsplash image URL visible in the browser. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.urls.regular}
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            style={{ backgroundColor: photo.color ?? "#e3e6dd" }}
          />
          <figcaption>
            <Attribution photo={photo} />
            <span>
              {photo.width} × {photo.height} px
            </span>
          </figcaption>
        </figure>
        <PhotoDetails photo={photo} preview={isPreview} columns={columns} />
      </main>
    </SiteShell>
  );
}
