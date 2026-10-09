import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { logoutAction } from "@/lib/auth/actions";
import styles from "./page.module.css";

export function ProfileDashboard({ email }: { email: string }) {
  return (
    <SiteShell profileActive>
      <main id="main-content" tabIndex={-1} className={`site-container ${styles.main}`}>
        <div className={styles.breadcrumbs}>
          <span>Особистий простір / Профіль</span>
          <Link href="/" prefetch={false}>
            До галереї <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <header className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.kicker}>MIRA / Особистий кабінет</p>
            <h1>
              Мій профіль<span>.</span>
            </h1>
            <p className={styles.heroDescription}>
              Тут твій акаунт і добірка фотографій, до яких хочеться повертатися.
            </p>
            <div className={styles.identity}>
              <span className={styles.avatar} aria-hidden="true">
                ◎
              </span>
              <div>
                <strong>Мій акаунт</strong>
                <span>{email}</span>
              </div>
            </div>
          </div>
          <div className={styles.heroArtwork} aria-hidden="true">
            <div className={styles.artFrame}>
              <span>Моя перспектива</span>
              <strong>✳</strong>
              <span>MIRA / 001</span>
            </div>
          </div>
        </header>

        <nav className={styles.profileNav} aria-label="Навігація профілю">
          <a href="#account">01 / Акаунт</a>
          <a href="#saved">02 / Збережені фото</a>
          <Link href="/" prefetch={false}>
            03 / Відкрити галерею <span aria-hidden="true">↗</span>
          </Link>
        </nav>

        <div className={styles.dashboard}>
          <section id="account" className={styles.accountCard} aria-labelledby="account-title">
            <p className={styles.sectionKicker}>01 / Обліковий запис</p>
            <h2 id="account-title">Дані профілю</h2>
            <div className={styles.accountDetail}>
              <span>Електронна адреса</span>
              <strong>{email}</strong>
            </div>
            <form action={logoutAction}>
              <button className={styles.logout} type="submit">
                Вийти з акаунта <span aria-hidden="true">↗</span>
              </button>
            </form>
          </section>

          <section id="saved" className={styles.savedCard} aria-labelledby="saved-title">
            <div className={styles.savedHeading}>
              <div>
                <p className={styles.sectionKicker}>02 / Особиста добірка</p>
                <h2 id="saved-title">Збережені фото</h2>
              </div>
              <span className={styles.photoCount}>0 фото</span>
            </div>
            <div className={styles.empty}>
              <span className={styles.emptySymbol} aria-hidden="true">
                ◎
              </span>
              <h3>Тут поки немає фото</h3>
              <p>Переглянь галерею та знайди кадри, які захочеться зберегти для себе.</p>
              <Link href="/#gallery" prefetch={false}>
                Переглянути галерею <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </SiteShell>
  );
}
