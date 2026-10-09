import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { parseGalleryPage } from "@/lib/gallery-navigation";
import { getSavedPhotos } from "@/lib/saved-photos";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProfileDashboard } from "./ProfileDashboard";

export const metadata: Metadata = {
  title: "Мій профіль — MIRA",
  robots: { index: false },
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  await connection();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) redirect("/login");

  const email = typeof data.claims.email === "string" ? data.claims.email : "Ваш акаунт";
  const page = parseGalleryPage((await searchParams).page);
  const saved = await getSavedPhotos(data.claims.sub, page);
  return <ProfileDashboard email={email} saved={saved} page={page} />;
}
