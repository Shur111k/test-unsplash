import type { CSSProperties } from "react";
import type { Photo } from "@/lib/photos";
import { getPhotoLayouts } from "@/lib/photo-layout";
import { PhotoCard } from "./PhotoCard";
import styles from "./PhotoGrid.module.css";

export function PhotoGrid({ photos }: { photos: Photo[] }) {
  const layouts = getPhotoLayouts(photos);

  return (
    <div className={styles.grid}>
      {photos.map((photo, index) => {
        const layout = layouts[index];
        const style = {
          "--photo-ratio": layout.aspectRatio,
          "--width-2": layout.widthInTwoColumns,
          "--width-3": layout.widthInThreeColumns,
          "--width-5": layout.widthInFiveColumns,
        } as CSSProperties;

        return (
          <div className={styles.item} key={photo.id} style={style}>
            <PhotoCard photo={photo} index={index} />
          </div>
        );
      })}
    </div>
  );
}
