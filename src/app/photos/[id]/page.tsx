import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Attribution } from "@/components/Attribution";
import { SiteShell } from "@/components/SiteShell";
import { previewPhotos } from "@/lib/preview-photos";
import { getPhotoById } from "@/lib/unsplash/server";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Фото — MIRA" };

export default async function PhotoPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;
  const isPreview = process.env.NODE_ENV === "development" && id.startsWith("preview-");
  const backHref = isPreview ? "/?preview=1#gallery" : "/";

  let photo = isPreview
    ? previewPhotos.find((item) => item.id === id)
    : undefined;
  try {
    if (!photo && !isPreview) photo = await getPhotoById(id) ?? undefined;
  } catch {
    return (
      <SiteShell preview={isPreview}>
        <main id="main-content" className={`site-container ${styles.message}`}>
          <p className={styles.kicker}>MIRA / Фото</p>
          <h1>Не вдалося завантажити фото.</h1>
          <p>Спробуйте відкрити його пізніше.</p>
          <Link href={backHref} prefetch={false}>← До галереї</Link>
        </main>
      </SiteShell>
    );
  }

  if (!photo) notFound();

  return (
    <SiteShell preview={isPreview}>
      <main id="main-content" className={`site-container ${styles.detail}`}>
        <Link className={styles.back} href={backHref} prefetch={false}>← До галереї</Link>
        <div className={styles.heading}>
          <div>
            <p className={styles.kicker}>MIRA / Кадр</p>
            <h1>Погляньте ближче<span>.</span></h1>
          </div>
          <p>Один кадр. Цілий світ.</p>
        </div>
        <figure className={styles.figure}>
          {/* Keep the direct Unsplash image URL visible in the browser. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.urls.regular} width={photo.width} height={photo.height} alt={photo.alt} style={{ backgroundColor: photo.color ?? "#e3e6dd" }} />
          <figcaption>
            <Attribution photo={photo} />
            <span>{photo.width} × {photo.height} px</span>
          </figcaption>
        </figure>
        <div className={styles.caption}>
          <span>Про цей кадр</span>
          <p>{photo.description ?? photo.alt}</p>
        </div>
      </main>
    </SiteShell>
  );
}
