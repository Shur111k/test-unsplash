import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { GalleryResults } from "@/components/GalleryResults";
import { SearchForm } from "@/components/SearchForm";
import { SiteShell } from "@/components/SiteShell";
import {
  parseGalleryColumns,
  parseGalleryPage,
  parseSearchTerm,
  searchGalleryHref,
  type GallerySearchParams,
} from "@/lib/gallery-navigation";
import type { PhotoPage } from "@/lib/photos";
import { getPreviewSearchPage } from "@/lib/preview-photos";
import { photoErrorMessage } from "@/lib/unsplash/error-message";
import { searchPhotosByQuery } from "@/lib/unsplash/server";
import styles from "./page.module.css";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<GallerySearchParams>;
}): Promise<Metadata> {
  const query = parseSearchTerm((await searchParams).q);
  return {
    title: query ? `Пошук «${query}» — MIRA` : "Пошук фото — MIRA",
    description: query
      ? `Фотографії за запитом «${query}» у галереї MIRA.`
      : "Шукайте фотографії за словом, темою або настроєм у галереї MIRA.",
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<GallerySearchParams>;
}) {
  await connection();
  const params = await searchParams;
  const query = parseSearchTerm(params.q);
  const page = parseGalleryPage(params.page);
  const columns = parseGalleryColumns(params.cols);
  const preview = process.env.NODE_ENV === "development" && params.preview === "1";

  let photoPage: PhotoPage | null = null;
  let errorMessage: string | null = null;

  if (query) {
    try {
      photoPage = preview
        ? getPreviewSearchPage(page, query)
        : await searchPhotosByQuery(query, page);
    } catch (error) {
      errorMessage = photoErrorMessage(error);
    }
  }

  return (
    <SiteShell preview={preview}>
      <main id="main-content" tabIndex={-1} className={`site-container ${styles.main}`}>
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>MIRA / Пошук</p>
            <h1>
              Знайдіть свій <em>кадр.</em>
            </h1>
            <p className={styles.intro}>
              Від тихого ранку до галасливого міста — почніть з одного слова.
            </p>
            <SearchForm key={query} query={query} preview={preview} />
          </div>
          <div className={styles.art} aria-hidden="true">
            <div className={styles.orbit} />
            <div className={styles.disc}>
              <span>mira</span>
              <span>✳</span>
            </div>
            <span className={styles.artCaption}>Дивіться уважніше / 01—∞</span>
          </div>
        </header>

        <section id="gallery" aria-labelledby="results-title" className={styles.results}>
          <div className={styles.resultsHeading}>
            <div>
              <p className={styles.kicker}>01 / Результати</p>
              <h2 id="results-title">
                {query ? `«${query}»` : "Почніть з ідеї"}
                <span>.</span>
              </h2>
            </div>
            {photoPage?.total != null && (
              <p className={styles.count}>
                Знайдено фото: {photoPage.total.toLocaleString("uk-UA")}
              </p>
            )}
          </div>

          {query ? (
            <GalleryResults
              photoPage={photoPage}
              errorMessage={errorMessage}
              page={page}
              columns={columns}
              preview={preview}
              pathname="/search"
              searchQuery={query}
            />
          ) : (
            <div className={styles.suggestions}>
              <p>Не знаєте, що шукати? Спробуйте одну з тем:</p>
              <div>
                {["abstract", "landscape", "geometry"].map((topic) => (
                  <Link
                    key={topic}
                    href={searchGalleryHref(topic, 1, columns, preview)}
                    prefetch={false}
                  >
                    {topic} <span aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </SiteShell>
  );
}
