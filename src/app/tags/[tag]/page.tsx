import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { GalleryResults } from "@/components/GalleryResults";
import { SiteShell } from "@/components/SiteShell";
import {
  galleryPageHref,
  parseGalleryColumns,
  parseGalleryPage,
  tagGalleryPath,
  type GallerySearchParams,
} from "@/lib/gallery-navigation";
import type { PhotoPage } from "@/lib/photos";
import { getPreviewPhotoPage } from "@/lib/preview-photos";
import { photoErrorMessage } from "@/lib/unsplash/error-message";
import { searchPhotosByQuery } from "@/lib/unsplash/server";
import styles from "./page.module.css";

interface TagPageProps {
  params: Promise<{ tag: string }>;
  searchParams: Promise<GallerySearchParams>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `${tag.trim()} — MIRA`,
    description: `Фотографії за темою «${tag.trim()}» у галереї MIRA.`,
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  await connection();
  const [{ tag: rawTag }, query] = await Promise.all([params, searchParams]);
  const tag = rawTag.trim();
  if (!tag) notFound();
  const page = parseGalleryPage(query.page);
  const columns = parseGalleryColumns(query.cols);
  const preview = process.env.NODE_ENV === "development" && query.preview === "1";

  let photoPage: PhotoPage | null = null;
  let errorMessage: string | null = null;
  try {
    photoPage = preview ? getPreviewPhotoPage(page, tag) : await searchPhotosByQuery(tag, page);
  } catch (error) {
    errorMessage = photoErrorMessage(error);
  }

  return (
    <SiteShell preview={preview}>
      <main id="main-content" tabIndex={-1} className={`site-container ${styles.main}`}>
        <Link className={styles.back} href={galleryPageHref(1, columns, preview)} prefetch={false}>
          ← До колекції
        </Link>
        <header className={styles.heading}>
          <p className={styles.kicker}>MIRA / За темою</p>
          <h1>
            <span>#</span>
            {tag}
          </h1>
          <div className={styles.summary}>
            <p>Одна тема. Безліч поглядів.</p>
            {photoPage?.total != null && (
              <span>Знайдено фото: {photoPage.total.toLocaleString("uk-UA")}</span>
            )}
          </div>
        </header>
        <section id="gallery" aria-label={`Фото за тегом ${tag}`} className={styles.gallery}>
          <GalleryResults
            photoPage={photoPage}
            errorMessage={errorMessage}
            page={page}
            columns={columns}
            preview={preview}
            pathname={tagGalleryPath(tag)}
          />
        </section>
      </main>
    </SiteShell>
  );
}
