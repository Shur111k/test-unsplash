import { connection } from "next/server";
import { PhotoGrid } from "@/components/PhotoGrid";
import { SiteShell } from "@/components/SiteShell";
import { previewPhotos } from "@/lib/preview-photos";
import { UnsplashApiError } from "@/lib/unsplash/client";
import { listEditorialPhotos } from "@/lib/unsplash/server";
import styles from "./page.module.css";

function galleryErrorMessage(error: unknown) {
  if (error instanceof UnsplashApiError) {
    if (error.kind === "configuration") return "Додайте UNSPLASH_ACCESS_KEY до .env.local, щоб завантажити галерею.";
    if (error.kind === "rate_limit") return "Ліміт запитів до Unsplash вичерпано. Спробуйте трохи пізніше.";
  }
  return "Не вдалося завантажити фотографії. Спробуйте оновити сторінку пізніше.";
}

export default async function HomePage({ searchParams }: { searchParams: Promise<{ preview?: string }> }) {
  await connection();
  const { preview } = await searchParams;
  const isPreview = process.env.NODE_ENV === "development" && preview === "1";

  let photos: Awaited<ReturnType<typeof listEditorialPhotos>>["photos"] = [];
  let errorMessage: string | null = null;

  if (isPreview) {
    photos = previewPhotos;
  } else {
    try {
      photos = (await listEditorialPhotos()).photos;
    } catch (error) {
      errorMessage = galleryErrorMessage(error);
    }
  }

  return (
    <SiteShell preview={isPreview}>
      <main id="main-content">
        <section className={`site-container ${styles.hero}`} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}><span className={styles.eyebrowDot} /> Візуальний щоденник / 001</p>
            <h1 id="hero-title">Дивитися.<br /><span>Відчувати.</span><br />Зберігати.</h1>
            <p className={styles.intro}>Місце для кадрів, на яких хочеться затриматися. Щоденна добірка світлин від авторів з усього світу.</p>
            <a className={styles.explore} href="#gallery">Дослідити добірку <span aria-hidden="true">↘</span></a>
          </div>
          <div className={styles.heroArt} aria-hidden="true">
            <div className={styles.orbitOuter}><div className={styles.orbitMiddle}><div className={styles.orbitInner}><span>made to<br />look closer.</span></div></div></div>
            <span className={styles.artStar}>✳</span>
            <span className={styles.artIndex}>M/001 — PHOTO STUDIES</span>
          </div>
        </section>

        <section className={`site-container ${styles.gallerySection}`} id="gallery" aria-labelledby="gallery-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionKicker}>01 / Колекція</p>
              <h2 id="gallery-title">Свіже у фокусі<span className={styles.headingPeriod}>.</span></h2>
            </div>
            <p className={styles.sectionAside}>Кожен кадр — <em>окрема історія.</em><br />Знайдіть ту, що залишиться з вами.</p>
          </div>

          {errorMessage ? (
            <div className={styles.state} role="alert"><span className={styles.stateIcon} aria-hidden="true">✳</span><h3>Пауза у стрічці</h3><p>{errorMessage}</p></div>
          ) : photos.length === 0 ? (
            <div className={styles.state}><span className={styles.stateIcon} aria-hidden="true">✳</span><h3>Поки тут тихо</h3><p>У добірці ще немає фотографій. Завітайте трохи пізніше.</p></div>
          ) : (
            <PhotoGrid photos={photos} />
          )}
        </section>
      </main>
    </SiteShell>
  );
}
