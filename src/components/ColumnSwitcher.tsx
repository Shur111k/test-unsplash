import type { GalleryColumns } from "@/lib/gallery-navigation";
import styles from "./ColumnSwitcher.module.css";

export function ColumnSwitcher({
  columns,
  onChange,
}: {
  columns: GalleryColumns;
  onChange: (columns: GalleryColumns) => void;
}) {
  return (
    <div className={styles.switcher} role="group" aria-label="Кількість колонок">
      {([3, 5] as const).map((value) => (
        <button
          key={value}
          type="button"
          className={styles.option}
          aria-label={value === 3 ? "3 колонки" : "5 колонок"}
          aria-pressed={columns === value}
          onClick={() => onChange(value)}
        >
          <span className={styles.icon} aria-hidden="true">
            {Array.from({ length: value }, (_, index) => <span key={index} />)}
          </span>
          <span>{value}</span>
        </button>
      ))}
    </div>
  );
}
