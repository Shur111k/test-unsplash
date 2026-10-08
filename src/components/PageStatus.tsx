import Link from "next/link";
import type { ReactNode } from "react";
import { SiteShell } from "./SiteShell";
import styles from "./PageStatus.module.css";

interface PageStatusProps {
  kicker: string;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  preview?: boolean;
  children?: ReactNode;
}

export function PageStatus({
  kicker,
  title,
  description,
  href,
  linkLabel,
  preview = false,
  children,
}: PageStatusProps) {
  return (
    <SiteShell preview={preview}>
      <main id="main-content" tabIndex={-1} className={`site-container ${styles.main}`}>
        <div className={styles.copy}>
          <p className={styles.kicker}>MIRA / {kicker}</p>
          <h1>{title}</h1>
          <p className={styles.description}>{description}</p>
          <div className={styles.actions}>
            {children}
            <Link href={href} prefetch={false}>
              {linkLabel} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <div className={styles.art} aria-hidden="true">
          ✳
        </div>
      </main>
    </SiteShell>
  );
}
