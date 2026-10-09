import type { Metadata } from "next";
import { MotionProvider } from "@/components/MotionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "MIRA — Візуальний щоденник",
  description: "Авторська галерея фотографій. Щоденна добірка світлин від авторів з усього світу.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk" data-scroll-behavior="smooth">
      {/* Browser extensions can add attributes to body before React hydrates. */}
      <body suppressHydrationWarning>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
