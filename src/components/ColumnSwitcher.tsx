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
      <m.span
        className={styles.selection}
        aria-hidden="true"
        initial={false}
        animate={{ x: columns === 3 ? "0%" : "100%" }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
      />
      {([3, 5] as const).map((value) => (
        <button
          key={value}
          type="button"
          className={styles.option}
          aria-label={`${value} фото в ряд`}
          aria-pressed={columns === value}
          onClick={() => onChange(value)}
        >
          <span className={styles.icon} aria-hidden="true">
            {Array.from({ length: value }, (_, index) => (
              <span key={index} />
            ))}
          </span>
          <span>{value}</span>
        </button>
      ))}
    </div>
  );
}
import * as m from "motion/react-m";
