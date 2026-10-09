"use client";

import Link from "next/link";
import { useActionState, useId, useState } from "react";
import { loginAction, registerAction, type AuthActionState } from "@/lib/auth/actions";
import { PasswordField } from "./PasswordField";
import styles from "./AuthForm.module.css";

export function AuthForm({
  mode,
  confirmationFailed = false,
}: {
  mode: "register" | "login";
  confirmationFailed?: boolean;
}) {
  const isRegister = mode === "register";
  const [state, action, pending] = useActionState<AuthActionState, FormData>(
    isRegister ? registerAction : loginAction,
    undefined,
  );
  const emailId = useId();
  const emailErrorId = `${emailId}-error`;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={styles.card}>
      <p className={styles.kicker}>MIRA / {isRegister ? "Новий погляд" : "Повернення"}</p>
      <h1>
        {isRegister ? "Твоя колекція" : "Раді бачити"}
        <span>.</span>
      </h1>
      <p className={styles.intro}>
        {isRegister
          ? "Створи простір для кадрів, до яких захочеться повертатися."
          : "Увійди, щоб знову опинитися серед улюблених кадрів."}
      </p>

      {state?.success ? (
        <div className={styles.success} role="status">
          <span aria-hidden="true">✳</span>
          <h2>Лист уже в дорозі.</h2>
          <p>{state.success}</p>
          <Link href="/login" prefetch={false}>
            Перейти до входу ↗
          </Link>
        </div>
      ) : (
        <form action={action} className={styles.form}>
          {confirmationFailed && !state?.error && (
            <p className={styles.errorBanner} role="alert">
              Посилання для підтвердження не спрацювало або вже застаріло. Спробуй увійти або
              зареєструватися знову.
            </p>
          )}
          {state?.error && (
            <p className={styles.errorBanner} role="alert">
              {state.error}
            </p>
          )}
          <div className={styles.field}>
            <label htmlFor={emailId}>Електронна адреса</label>
            <input
              id={emailId}
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              autoComplete="email"
              inputMode="email"
              placeholder="hello@example.com"
              maxLength={254}
              required
              aria-invalid={Boolean(state?.fieldErrors?.email)}
              aria-describedby={state?.fieldErrors?.email ? emailErrorId : undefined}
            />
            {state?.fieldErrors?.email && (
              <p id={emailErrorId} className={styles.fieldError}>
                {state.fieldErrors.email}
              </p>
            )}
          </div>
          <PasswordField
            mode={mode}
            error={state?.fieldErrors?.password}
            value={password}
            onChange={setPassword}
          />
          <button className={styles.submit} type="submit" disabled={pending}>
            <span>{pending ? "Зачекайте…" : isRegister ? "Створити акаунт" : "Увійти"}</span>
            <span aria-hidden="true">↗</span>
          </button>
        </form>
      )}

      <p className={styles.switchMode}>
        {isRegister ? "Уже маєш акаунт?" : "Ще немає акаунта?"}{" "}
        <Link href={isRegister ? "/login" : "/register"} prefetch={false}>
          {isRegister ? "Увійти" : "Зареєструватися"}
        </Link>
      </p>
    </div>
  );
}
