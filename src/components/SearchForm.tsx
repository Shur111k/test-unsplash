import Form from "next/form";
import styles from "./SearchForm.module.css";

export function SearchForm({ query, preview }: { query: string; preview: boolean }) {
  return (
    <Form action="/search" prefetch={false} role="search" className={styles.form}>
      <label htmlFor="photo-search" className={styles.label}>
        Пошук за словом або настроєм
      </label>
      <div className={styles.field}>
        <span className={styles.symbol} aria-hidden="true">
          ⌕
        </span>
        <input
          id="photo-search"
          name="q"
          type="search"
          maxLength={120}
          defaultValue={query}
          placeholder="Наприклад, світло, місто, море..."
          autoComplete="off"
        />
        {preview && <input type="hidden" name="preview" value="1" />}
        <button type="submit">
          Знайти <span aria-hidden="true">↗</span>
        </button>
      </div>
    </Form>
  );
}
