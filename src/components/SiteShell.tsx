import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./SiteShell.module.css";

export function SiteShell({
  children,
  preview = false,
  profileActive = false,
}: {
  children: ReactNode;
  preview?: boolean;
  profileActive?: boolean;
}) {
  const homeHref = preview ? "/?preview=1" : "/";
  const galleryHref = preview ? "/?preview=1#gallery" : "/#gallery";
  const searchHref = preview ? "/search?preview=1" : "/search";
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main-content">
        Перейти до вмісту
      </a>
      <header className={styles.header}>
        <div className={`site-container ${styles.headerInner}`}>
          <Link
            className={styles.logo}
            href={homeHref}
            prefetch={false}
            aria-label="MIRA — головна сторінка"
          >
            mira<span aria-hidden="true">✳</span>
          </Link>
          <span className={styles.headerCaption}>Галерея для уважного погляду</span>
          <nav className={styles.headerNav} aria-label="Основна навігація">
            <Link
              className={styles.searchLink}
              href={searchHref}
              prefetch={false}
              aria-label="Пошук фото"
            >
              <span className={styles.searchIcon} aria-hidden="true">
                ⌕
              </span>
              <span className={styles.searchText}>Пошук</span>
            </Link>
            <Link
              className={`${styles.headerLink} ${profileActive ? styles.galleryInactive : ""}`}
              href={galleryHref}
              prefetch={false}
            >
              Колекція <span aria-hidden="true">↗</span>
            </Link>
            <Link
              className={styles.profileLink}
              href="/profile"
              prefetch={false}
              aria-label="Профіль"
              aria-current={profileActive ? "page" : undefined}
            >
              <span aria-hidden="true">◎</span>
              <span className={styles.profileText}>Профіль</span>
            </Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className={styles.footer}>
        <div className={`site-container ${styles.footerInner}`}>
          <Link
            className={styles.footerLogo}
            href={homeHref}
            prefetch={false}
            aria-label="MIRA — головна сторінка"
          >
            mira✳
          </Link>
          <p>Зупиніться на мить. Подивіться ближче.</p>
          <span>Фотографії з Unsplash</span>
        </div>
      </footer>
    </div>
  );
}
