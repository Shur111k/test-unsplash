export type AuthMode = "register" | "login";

export interface AuthFieldErrors {
  email?: string;
  password?: string;
}

type ValidCredentials = { email: string; password: string };

export function validateCredentials(
  mode: AuthMode,
  formData: FormData,
): { data: ValidCredentials; errors?: never } | { data?: never; errors: AuthFieldErrors } {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");
  const email = typeof rawEmail === "string" ? rawEmail.trim() : "";
  const password = typeof rawPassword === "string" ? rawPassword : "";
  const errors: AuthFieldErrors = {};

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Вкажіть коректну електронну адресу.";
  }

  if (!password || password.length > 512) {
    errors.password = "Вкажіть пароль.";
  } else if (mode === "register" && password.length < 8) {
    errors.password = "Пароль має містити щонайменше 8 символів.";
  }

  if (Object.keys(errors).length) return { errors };
  return { data: { email, password } };
}
