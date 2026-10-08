import { PageStatus } from "@/components/PageStatus";

export default function NotFound() {
  const preview = process.env.NODE_ENV === "development";

  return (
    <PageStatus
      kicker="404"
      title="Цієї сторінки немає."
      description="Можливо, посилання застаріло або в адресі є помилка."
      href={preview ? "/?preview=1" : "/"}
      linkLabel="На головну"
      preview={preview}
    />
  );
}
