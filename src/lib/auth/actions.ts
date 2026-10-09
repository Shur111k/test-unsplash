"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAppOrigin } from "@/lib/supabase/config";
import { validateCredentials, type AuthFieldErrors } from "./validation";

export type AuthActionState =
  { error?: string; fieldErrors?: AuthFieldErrors; success?: string } | undefined;

const UNAVAILABLE = "Авторизація тимчасово недоступна. Спробуйте трохи пізніше.";

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const result = validateCredentials("register", formData);
  if (result.errors) return { fieldErrors: result.errors };

  let hasSession = false;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      ...result.data,
      options: { emailRedirectTo: `${getAppOrigin()}/auth/callback` },
    });

    if (error) {
      return {
        error:
          error.status === 429
            ? "Забагато спроб. Зачекайте трохи й повторіть реєстрацію."
            : "Не вдалося створити акаунт. Перевірте адресу або спробуйте пізніше.",
      };
    }
    if (!data.user) return { error: UNAVAILABLE };
    hasSession = Boolean(data.session);
  } catch {
    return { error: UNAVAILABLE };
  }

  if (hasSession) redirect("/profile");
  return {
    success:
      "Перевірте пошту та підтвердьте адресу. Після цього відкрийте посилання з листа, щоб увійти.",
  };
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const result = validateCredentials("login", formData);
  if (result.errors) return { fieldErrors: result.errors };

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword(result.data);
    if (error) {
      return {
        error:
          error.status === 429
            ? "Забагато спроб. Зачекайте трохи й повторіть вхід."
            : "Не вдалося увійти. Перевірте email, пароль і підтвердження пошти.",
      };
    }
  } catch {
    return { error: UNAVAILABLE };
  }

  redirect("/profile");
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error("Не вдалося вийти з акаунта.");
  redirect("/");
}
