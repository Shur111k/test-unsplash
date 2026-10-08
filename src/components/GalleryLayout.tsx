"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { galleryPageHref, type GalleryColumns } from "@/lib/gallery-navigation";
import { ColumnSwitcher } from "./ColumnSwitcher";
import { Pagination } from "./Pagination";
import { GalleryNavigationProvider } from "./PhotoLink";
import styles from "./GalleryLayout.module.css";

interface GalleryLayoutProps {
  children: ReactNode;
  initialColumns: GalleryColumns;
  page: number;
  photoCount: number;
  totalPages: number | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  preview: boolean;
  pathname?: string;
}

export function GalleryLayout({
  children,
  initialColumns,
  page,
  photoCount,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  preview,
  pathname = "/",
}: GalleryLayoutProps) {
  const [columns, setColumns] = useState<GalleryColumns>(initialColumns);

  function changeColumns(next: GalleryColumns) {
    if (next === columns) return;

    const url = new URL(window.location.href);
    url.searchParams.set("cols", String(next));
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    setColumns(next);
  }

  return (
    <div data-columns={columns}>
      <div className={styles.toolbar}>
        <p>
          Сторінка {String(page).padStart(2, "0")} <span aria-hidden="true">/</span> {photoCount}{" "}
          кадрів
        </p>
        <div className={styles.controls}>
          <span className={styles.controlLabel}>Кадрів у ряд</span>
          <ColumnSwitcher columns={columns} onChange={changeColumns} />
          <span className={styles.mobileMode}>Адаптивна сітка</span>
        </div>
      </div>
      <GalleryNavigationProvider returnHref={galleryPageHref(page, columns, preview, pathname)}>
        {children}
      </GalleryNavigationProvider>
      <div className={styles.collectionEnd}>
        <span aria-hidden="true">✳</span>
        <p>У кожного кадру — своя історія.</p>
        <span className={styles.endLabel}>Кінець добірки / {String(page).padStart(2, "0")}</span>
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        hrefForPage={(nextPage) => galleryPageHref(nextPage, columns, preview, pathname)}
      />
    </div>
  );
}
