import { connection } from "next/server";

export default async function HomePage() {
  await connection();

  return (
    <main className="site-container">
      <h1>Галерея фотографій</h1>
      <p>Каркас проєкту готовий. Фото та взаємодії з’являться на наступних етапах.</p>
    </main>
  );
}
