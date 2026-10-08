import Link from "next/link";
import { galleryPageHref, type GalleryColumns } from "@/lib/gallery-navigation";
import type { PhotoPage } from "@/lib/photos";
import { GalleryLayout } from "./GalleryLayout";
import { Pagination } from "./Pagination";
import { PhotoGrid } from "./PhotoGrid";
import styles from "./GalleryResults.module.css";

interface GalleryResultsProps {
  photoPage: PhotoPage | null;
  errorMessage: string | null;
  page: number;
  columns: GalleryColumns;
  preview: boolean;
  pathname?: string;
}

export function GalleryResults({
  photoPage,
  errorMessage,
  page,
  columns,
  preview,
  pathname = "/",
}: GalleryResultsProps) {
  if (errorMessage) {
    return (
      <div className={styles.state} role="alert">
        <span className={styles.icon} aria-hidden="true">
          ✳
        </span>
        <h3>Пауза у стрічці</h3>
        <p>{errorMessage}</p>
      </div>
    );
  }

  if (!photoPage || photoPage.photos.length === 0) {
    return (
      <>
        <div className={styles.state}>
          <span className={styles.icon} aria-hidden="true">
            ✳
          </span>
          <h3>{page > 1 ? "Ця сторінка порожня" : "Поки тут тихо"}</h3>
          <p>
            {page > 1
              ? "Поверніться до початку добірки."
              : "За цим запитом фотографій поки немає. Спробуйте інший тег або перегляньте головну колекцію."}
          </p>
          <Link
            href={galleryPageHref(1, columns, preview, page > 1 ? pathname : "/")}
            prefetch={false}
          >
            {page > 1 ? "До першої сторінки ↗" : "До колекції ↗"}
          </Link>
        </div>
        {photoPage && page > 1 && (
          <Pagination
            page={page}
            totalPages={photoPage.totalPages}
            hasNextPage={photoPage.hasNextPage}
            hasPreviousPage={photoPage.hasPreviousPage}
            hrefForPage={(nextPage) => galleryPageHref(nextPage, columns, preview, pathname)}
          />
        )}
      </>
    );
  }

  return (
    <GalleryLayout
      key={`${pathname}:${page}:${columns}`}
      initialColumns={columns}
      page={page}
      photoCount={photoPage.photos.length}
      totalPages={photoPage.totalPages}
      hasNextPage={photoPage.hasNextPage}
      hasPreviousPage={photoPage.hasPreviousPage}
      preview={preview}
      pathname={pathname}
    >
      <PhotoGrid photos={photoPage.photos} />
    </GalleryLayout>
  );
}
