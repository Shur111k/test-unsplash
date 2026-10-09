import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProfileDashboard } from "./ProfileDashboard";

export const metadata: Metadata = {
  title: "Мій профіль — MIRA",
  robots: { index: false },
};

export default async function ProfilePage() {
  await connection();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect("/login");

  const email = typeof data.claims.email === "string" ? data.claims.email : "Ваш акаунт";
  return <ProfileDashboard email={email} />;
}
