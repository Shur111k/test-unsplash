import { AuthForm } from "./AuthForm";
import { SiteShell } from "@/components/SiteShell";
import styles from "./AuthScene.module.css";

export function AuthScene({
  mode,
  confirmationFailed = false,
}: {
  mode: "register" | "login";
  confirmationFailed?: boolean;
}) {
  return (
    <SiteShell>
      <main id="main-content" tabIndex={-1} className={`site-container ${styles.main}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Особиста галерея / 01—∞</p>
          <p className={styles.statement}>
            Зберігай те,
            <br />
            що <em>відгукується.</em>
          </p>
          <div className={styles.viewfinder} aria-hidden="true">
            <div className={styles.filmFrame}>
              <div className={styles.landscape}>
                <span className={styles.sun} />
                <span className={styles.hillOne} />
                <span className={styles.hillTwo} />
              </div>
              <span className={styles.filmLabel}>MIRA / YOUR FRAME 001</span>
            </div>
            <span className={styles.orbit} />
            <span className={styles.crosshair}>✳</span>
          </div>
          <p className={styles.aside}>Кожен погляд вартий власного місця.</p>
        </div>
        <AuthForm mode={mode} confirmationFailed={confirmationFailed} />
      </main>
    </SiteShell>
  );
}
