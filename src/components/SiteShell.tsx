import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./SiteShell.module.css";

export function SiteShell({ children, preview = false }: { children: ReactNode; preview?: boolean }) {
  const homeHref = preview ? "/?preview=1" : "/";
  const galleryHref = preview ? "/?preview=1#gallery" : "/#gallery";
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main-content">Перейти до вмісту</a>
      <header className={styles.header}>
        <div className={`site-container ${styles.headerInner}`}>
          <Link className={styles.logo} href={homeHref} prefetch={false} aria-label="MIRA — головна сторінка">mira<span aria-hidden="true">✳</span></Link>
          <span className={styles.headerCaption}>Галерея для уважного погляду</span>
          <Link className={styles.headerLink} href={galleryHref} prefetch={false}>Колекція <span aria-hidden="true">↗</span></Link>
        </div>
      </header>
      {children}
      <footer className={styles.footer}>
        <div className={`site-container ${styles.footerInner}`}>
          <Link className={styles.footerLogo} href={homeHref} prefetch={false}>mira✳</Link>
          <p>Зупиніться на мить. Подивіться ближче.</p>
          <span>Фотографії з Unsplash</span>
        </div>
      </footer>
    </div>
  );
}
