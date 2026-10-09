import type { Metadata } from "next";
import { AuthScene } from "@/components/auth/AuthScene";

export const metadata: Metadata = {
  title: "Вхід — MIRA",
  description: "Увійдіть до особистого профілю MIRA.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ confirmation?: string }>;
}) {
  const { confirmation } = await searchParams;
  return <AuthScene mode="login" confirmationFailed={confirmation === "failed"} />;
}
