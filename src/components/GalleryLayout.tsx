"use client";

import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import { galleryPageHref, type GalleryColumns } from "@/lib/gallery-navigation";
import { ColumnSwitcher } from "./ColumnSwitcher";
import { Pagination } from "./Pagination";
import styles from "./GalleryLayout.module.css";

export function GalleryLayout({
  children,
  initialColumns,
  page,
  photoCount,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  preview,
}: {
  children: ReactNode;
  initialColumns: GalleryColumns;
  page: number;
  photoCount: number;
  totalPages: number | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  preview: boolean;
}) {
  const [columns, setColumns] = useState<GalleryColumns>(initialColumns);

  function changeColumns(next: GalleryColumns) {
    if (next === columns) return;

    const url = new URL(window.location.href);
    url.searchParams.set("cols", String(next));
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    setColumns(next);
  }

  return (
    <div className={styles.layout} style={{ "--gallery-columns": columns } as CSSProperties}>
      <div className={styles.toolbar}>
        <p>Сторінка {String(page).padStart(2, "0")} <span aria-hidden="true">/</span> {photoCount} кадрів</p>
        <div className={styles.controls}>
          <span className={styles.controlLabel}>Сітка</span>
          <ColumnSwitcher columns={columns} onChange={changeColumns} />
          <span className={styles.mobileMode}>Адаптивна сітка</span>
        </div>
      </div>
      {children}
      <Pagination
        page={page}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        hrefForPage={(nextPage) => galleryPageHref(nextPage, columns, preview)}
      />
    </div>
  );
}
