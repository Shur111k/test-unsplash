import Link from "next/link";
import { connection } from "next/server";
import { GalleryLayout } from "@/components/GalleryLayout";
import { Pagination } from "@/components/Pagination";
import { PhotoGrid } from "@/components/PhotoGrid";
import { SiteShell } from "@/components/SiteShell";
import { galleryPageHref, parseGalleryColumns, parseGalleryPage } from "@/lib/gallery-navigation";
import type { PhotoPage } from "@/lib/photos";
import { getPreviewPhotoPage } from "@/lib/preview-photos";
import { UnsplashApiError } from "@/lib/unsplash/client";
import { listEditorialPhotos } from "@/lib/unsplash/server";
import styles from "./page.module.css";

function galleryErrorMessage(error: unknown) {
  if (error instanceof UnsplashApiError) {
    if (error.kind === "configuration") return "Додайте UNSPLASH_ACCESS_KEY до .env.local, щоб завантажити галерею.";
    if (error.kind === "rate_limit") return "Ліміт запитів до Unsplash вичерпано. Спробуйте трохи пізніше.";
  }
  return "Не вдалося завантажити фотографії. Спробуйте оновити сторінку пізніше.";
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string | string[]; page?: string | string[]; cols?: string | string[] }>;
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
      errorMessage = galleryErrorMessage(error);
    }
  }

  const photos = photoPage?.photos ?? [];

  return (
    <SiteShell preview={isPreview}>
      <main id="main-content">
        <section className={`site-container ${styles.hero}`} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><span className={styles.eyebrowDot} /> Візуальний щоденник / 001</p>
            <h1 id="hero-title">Дивитися.<br /><span>Відчувати.</span><br />Зберігати.</h1>
            <p className={styles.intro}>Місце для кадрів, на яких хочеться затриматися. Щоденна добірка світлин від авторів з усього світу.</p>
            <a className={styles.explore} href="#gallery">Дослідити добірку <span aria-hidden="true">↘</span></a>
          </div>
          <div className={styles.heroArt} aria-hidden="true">
            <div className={styles.orbitOuter}><div className={styles.orbitMiddle}><div className={styles.orbitInner}><span>made to<br />look closer.</span></div></div></div>
            <span className={styles.artStar}>✳</span>
            <span className={styles.artIndex}>M/001 — PHOTO STUDIES</span>
          </div>
        </section>

        <section className={`site-container ${styles.gallerySection}`} id="gallery" aria-labelledby="gallery-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionKicker}>01 / Колекція</p>
              <h2 id="gallery-title">Свіже у фокусі<span className={styles.headingPeriod}>.</span></h2>
            </div>
            <p className={styles.sectionAside}>Кожен кадр — <em>окрема історія.</em><br />Знайдіть ту, що залишиться з вами.</p>
          </div>

          {errorMessage ? (
            <div className={styles.state} role="alert"><span className={styles.stateIcon} aria-hidden="true">✳</span><h3>Пауза у стрічці</h3><p>{errorMessage}</p></div>
          ) : photos.length === 0 ? (
            <div className={styles.state}>
              <span className={styles.stateIcon} aria-hidden="true">✳</span>
              <h3>{page > 1 ? "Ця сторінка порожня" : "Поки тут тихо"}</h3>
              <p>{page > 1 ? "Спробуйте повернутися до початку добірки." : "У добірці ще немає фотографій. Завітайте трохи пізніше."}</p>
              {page > 1 && <Link className={styles.stateLink} href={galleryPageHref(1, columns, isPreview)} prefetch={false}>До першої сторінки ↗</Link>}
            </div>
          ) : (
            <GalleryLayout
              key={page}
              initialColumns={columns}
              page={page}
              photoCount={photos.length}
              totalPages={photoPage?.totalPages ?? null}
              hasNextPage={photoPage?.hasNextPage ?? false}
              hasPreviousPage={photoPage?.hasPreviousPage ?? false}
              preview={isPreview}
            >
              <PhotoGrid photos={photos} />
            </GalleryLayout>
          )}

          {photoPage && photos.length === 0 && page > 1 && (
            <Pagination
              page={page}
              totalPages={photoPage.totalPages}
              hasNextPage={photoPage.hasNextPage}
              hasPreviousPage={photoPage.hasPreviousPage}
              hrefForPage={(nextPage) => galleryPageHref(nextPage, columns, isPreview)}
            />
          )}
        </section>
      </main>
    </SiteShell>
  );
}
