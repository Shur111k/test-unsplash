import type { Photo } from "@/lib/photos";
import { HeroCollage } from "./HeroCollage";
import styles from "./GalleryHero.module.css";

export function GalleryHero({ photos }: { photos: Photo[] }) {
  return (
    <section className={`site-container ${styles.hero}`} aria-labelledby="hero-title">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>
          <span className={styles.dot} />
          Незвичайне у звичайному
        </p>
        <h1 id="hero-title">
          Світ очима
          <br />
          <span>уважних.</span>
        </h1>
        <p className={styles.intro}>
          Світло, тіні й маленькі випадковості. Колекція кадрів, що перетворюють звичайний день на
          натхнення.
        </p>
        <a className={styles.explore} href="#gallery">
          Знайти свій кадр
          <span aria-hidden="true">↘</span>
        </a>
        <div className={styles.note}>
          <span aria-hidden="true">✳</span>
          <p>
            Менше поспіху.
            <br />
            Більше помічати.
          </p>
        </div>
      </div>
      <HeroCollage
        photos={photos.slice(0, 3).map(({ id, urls, color, width, height }) => ({
          id,
          imageUrl: urls.small,
          color,
          width,
          height,
        }))}
      />
      <div className={styles.baseline} aria-hidden="true">
        <span>AN INDEPENDENT VISUAL JOURNAL</span>
        <span>SCROLL TO EXPLORE ↓</span>
        <span>MIRA — VOL. 01</span>
      </div>
    </section>
  );
}
