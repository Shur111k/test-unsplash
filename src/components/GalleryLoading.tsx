import { SiteShell } from "@/components/SiteShell";
import styles from "./GalleryLoading.module.css";

export function GalleryLoading() {
  const preview = process.env.NODE_ENV === "development";

  return (
    <SiteShell preview={preview}>
      <main id="main-content" tabIndex={-1} className={`site-container ${styles.main}`}>
        <div className={styles.heading} role="status" aria-label="Завантажуємо фотографії">
          <span className={styles.kicker}>MIRA / Мить очікування</span>
          <h1>
            Збираємо кадри для вас<span aria-hidden="true">.</span>
          </h1>
          <p>Завантажуємо фотографії…</p>
        </div>
        <div className={styles.grid} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </main>
    </SiteShell>
  );
}
