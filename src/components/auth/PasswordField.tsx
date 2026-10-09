"use client";

import { useId, useState } from "react";
import styles from "./PasswordField.module.css";

type PasswordFieldProps = {
  mode: "register" | "login";
  error?: string;
  value: string;
  onChange: (value: string) => void;
};

export function PasswordField({ mode, error, value, onChange }: PasswordFieldProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const [visible, setVisible] = useState(false);
  const [exposure, setExposure] = useState(0);

  function toggleVisibility() {
    setVisible((current) => !current);
    setExposure((current) => current + 1);
  }

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label htmlFor={inputId}>Пароль</label>
        {mode === "register" && <span>Мінімум 8 символів</span>}
      </div>

      <div className={`${styles.film} ${visible ? styles.developed : ""}`}>
        <div className={styles.inputRow}>
          <input
            id={inputId}
            name="password"
            type={visible ? "text" : "password"}
            value={value}
            onChange={(event) => onChange(event.currentTarget.value)}
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            minLength={mode === "register" ? 8 : undefined}
            required
            aria-invalid={Boolean(error)}
            aria-describedby={`${hintId}${error ? ` ${errorId}` : ""}`}
            placeholder="Введіть пароль"
          />
          <button
            className={styles.revealButton}
            type="button"
            onClick={toggleVisibility}
            aria-label={visible ? "Сховати пароль" : "Показати пароль"}
            aria-pressed={visible}
          >
            <svg
              aria-hidden="true"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 8h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" />
              <path d="M7 8 8.5 5h7L17 8" />
              <circle cx="12" cy="14" r="3" />
              <path d="M18.5 11.5h.01" />
            </svg>
            <span>{visible ? "Сховати" : "Проявити"}</span>
          </button>
        </div>

        <div className={styles.filmCaption} aria-hidden="true">
          <span>MIRA / 400 ISO</span>
          <span>{visible ? "КАДР ПРОЯВЛЕНО" : "КАДР ПРИХОВАНО"}</span>
        </div>

        {exposure > 0 && <span key={exposure} className={styles.shutter} aria-hidden="true" />}
      </div>

      <p id={hintId} className={styles.hint}>
        Натисни на камеру, щоб {visible ? "знову приховати" : "проявити"} пароль.
      </p>
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
