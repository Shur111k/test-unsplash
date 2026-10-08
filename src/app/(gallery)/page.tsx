import { connection } from "next/server";
import { GalleryHero } from "@/components/GalleryHero";
import { GalleryResults } from "@/components/GalleryResults";
import { SiteShell } from "@/components/SiteShell";
import { parseGalleryColumns, parseGalleryPage } from "@/lib/gallery-navigation";
import type { PhotoPage } from "@/lib/photos";
import { getPreviewPhotoPage } from "@/lib/preview-photos";
import { photoErrorMessage } from "@/lib/unsplash/error-message";
import { listEditorialPhotos } from "@/lib/unsplash/server";
import styles from "./page.module.css";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    preview?: string | string[];
    page?: string | string[];
    cols?: string | string[];
  }>;
}) {
  await connection();
  const { preview, page: pageParam, cols: columnsParam } = await searchParams;
  const isPreview = process.env.NODE_ENV === "development" && preview === "1";
  const page = parseGalleryPage(pageParam);
  const columns = parseGalleryColumns(columnsParam);

  let photoPage: PhotoPage | null = null;
  let errorMessage: string | null = null;

  if (isPreview) {
    photoPage = getPreviewPhotoPage(page);
  } else {
    try {
      photoPage = await listEditorialPhotos(page);
    } catch (error) {
      errorMessage = photoErrorMessage(error);
    }
  }

  const photos = photoPage?.photos ?? [];

  return (
    <SiteShell preview={isPreview}>
      <main id="main-content" tabIndex={-1}>
        <GalleryHero photos={photos} />

        <section
          className={`site-container ${styles.gallerySection}`}
          id="gallery"
          aria-labelledby="gallery-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionKicker}>01 / Колекція</p>
              <h2 id="gallery-title">
                Свіже у фокусі<span className={styles.headingPeriod}>.</span>
              </h2>
            </div>
            <p className={styles.sectionAside}>
              Кожен кадр — <em>окрема історія.</em>
              <br />
              Знайдіть ту, що залишиться з вами.
            </p>
          </div>

          <GalleryResults
            photoPage={photoPage}
            errorMessage={errorMessage}
            page={page}
            columns={columns}
            preview={isPreview}
          />
        </section>
      </main>
    </SiteShell>
  );
}
