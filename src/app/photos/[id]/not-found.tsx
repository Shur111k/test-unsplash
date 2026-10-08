import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import styles from "./page.module.css";

export default function PhotoNotFound() {
  const preview = process.env.NODE_ENV === "development";
  return (
    <SiteShell preview={preview}>
      <main id="main-content" className={`site-container ${styles.message}`}>
        <p className={styles.kicker}>MIRA / 404</p>
        <h1>Цей кадр не знайдено.</h1>
        <p>Можливо, фото видалили або посилання містить помилку.</p>
        <Link href={preview ? "/?preview=1#gallery" : "/#gallery"} prefetch={false}>
          ← До галереї
        </Link>
      </main>
    </SiteShell>
  );
}
