import Link from "next/link";
import styles from "./Pagination.module.css";

function visiblePages(page: number, totalPages: number | null): number[] {
  if (totalPages === null || totalPages === 0) return [page];

  return [...new Set([1, page - 1, page, page + 1, totalPages])]
    .filter((value) => value >= 1 && (value <= totalPages || value === page))
    .sort((a, b) => a - b);
}

export function Pagination({
  page,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  hrefForPage,
}: {
  page: number;
  totalPages: number | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  hrefForPage: (page: number) => string;
}) {
  const pages = visiblePages(page, totalPages);

  return (
    <nav className={styles.pagination} aria-label="Сторінки галереї">
      {hasPreviousPage ? (
        <Link className={styles.direction} href={hrefForPage(page - 1)} prefetch={false}>← Назад</Link>
      ) : (
        <span className={`${styles.direction} ${styles.disabled}`} aria-disabled="true">← Назад</span>
      )}

      <div className={styles.pages}>
        {pages.map((value, index) => (
          <span className={styles.pageSlot} key={value}>
            {index > 0 && value - pages[index - 1] > 1 && <span className={styles.ellipsis} aria-hidden="true">…</span>}
            {value === page ? (
              <span className={styles.current} aria-current="page" aria-label={`Сторінка ${value}, поточна`}>{value}</span>
            ) : (
              <Link className={styles.pageLink} href={hrefForPage(value)} prefetch={false} aria-label={`Сторінка ${value}`}>{value}</Link>
            )}
          </span>
        ))}
      </div>

      {hasNextPage ? (
        <Link className={styles.direction} href={hrefForPage(page + 1)} prefetch={false}>Далі →</Link>
      ) : (
        <span className={`${styles.direction} ${styles.disabled}`} aria-disabled="true">Далі →</span>
      )}
    </nav>
  );
}
