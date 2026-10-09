import type { Metadata } from "next";
import { AuthScene } from "@/components/auth/AuthScene";

export const metadata: Metadata = {
  title: "Реєстрація — MIRA",
  description: "Створіть особистий простір для улюблених фотографій у MIRA.",
};

export default function RegisterPage() {
  return <AuthScene mode="register" />;
}
