import type { Photo } from "@/lib/photos";
import { PhotoCard } from "./PhotoCard";
import styles from "./PhotoGrid.module.css";

export function PhotoGrid({ photos }: { photos: Photo[] }) {
  return (
    <div className={styles.grid}>
      {photos.map((photo, index) => <PhotoCard key={photo.id} photo={photo} index={index} />)}
    </div>
  );
}
