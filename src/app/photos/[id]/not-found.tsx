import Link from "next/link";
import { PageStatus } from "@/components/PageStatus";

export default function PhotoNotFound() {
  const preview = process.env.NODE_ENV === "development";

  return (
    <PageStatus
      kicker="404 / Фото"
      title="Цей кадр не знайдено."
      description="Можливо, фото видалили або посилання містить помилку."
      href="/#gallery"
      linkLabel={preview ? "До звичайної галереї" : "До галереї"}
      preview={preview}
    >
      {preview && (
        <Link href="/?preview=1#gallery" prefetch={false}>
          До локальної галереї
        </Link>
      )}
    </PageStatus>
  );
}
