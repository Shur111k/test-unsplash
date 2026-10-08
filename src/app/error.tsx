"use client";

import { PageStatus } from "@/components/PageStatus";

export default function Error({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const preview = process.env.NODE_ENV === "development";

  return (
    <PageStatus
      kicker="Помилка"
      title="Щось пішло не так."
      description="Сторінка тимчасово недоступна. Спробуйте завантажити її ще раз."
      href={preview ? "/?preview=1" : "/"}
      linkLabel="На головну"
      preview={preview}
    >
      <button type="button" onClick={retry}>
        Спробувати ще раз
      </button>
    </PageStatus>
  );
}
