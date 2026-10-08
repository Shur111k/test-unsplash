"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import styles from "./RetryButton.module.css";

export function RetryButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className={styles.button}
      disabled={pending}
      onClick={() => startTransition(() => router.refresh())}
    >
      {pending ? "Повторюємо…" : "Спробувати ще раз ↗"}
    </button>
  );
}
