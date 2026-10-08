"use client";

import * as m from "motion/react-m";
import { useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent } from "react";
import styles from "./HeroCollage.module.css";

interface CollagePhoto {
  id: string;
  imageUrl: string;
  color: string | null;
  width: number;
  height: number;
}

interface HeroCollageProps {
  photos: CollagePhoto[];
}

const spring = { stiffness: 110, damping: 22, mass: 0.8 };

export function HeroCollage({ photos }: HeroCollageProps) {
  const reducedMotion = useReducedMotion();
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);

  function resetTilt() {
    rotateX.set(0);
    rotateY.set(0);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion || event.pointerType !== "mouse") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;

    rotateX.set(vertical * -8);
    rotateY.set(horizontal * 10);
  }

  return (
    <div
      className={styles.collage}
      aria-hidden="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div className={styles.gridLines} />
      <span className={styles.coordinate}>48° 27′ N / A NEW PERSPECTIVE</span>
      <m.div
        className={styles.scene}
        style={{ rotateX: reducedMotion ? 0 : rotateX, rotateY: reducedMotion ? 0 : rotateY }}
      >
        <div className={styles.disc} />
        {photos.slice(0, 3).map((photo, index) => (
          <div className={styles.print} key={photo.id} data-position={index}>
            {/* Reuse the gallery's direct CDN URLs without another API request. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.imageUrl}
              width={photo.width}
              height={photo.height}
              alt=""
              decoding="async"
              style={{ backgroundColor: photo.color ?? "#dce2d1" }}
            />
            <div className={styles.printCaption}>
              <span>MIRA / STUDY {String(index + 1).padStart(2, "0")}</span>
              <span>↗</span>
            </div>
          </div>
        ))}
        <div className={styles.stamp}>
          <svg viewBox="0 0 80 80" fill="none">
            {Array.from({ length: 8 }, (_, index) => (
              <ellipse
                key={index}
                cx="40"
                cy="25"
                rx="8"
                ry="23"
                stroke="currentColor"
                transform={`rotate(${index * 45} 40 40)`}
              />
            ))}
          </svg>
          <span>stay curious.</span>
        </div>
      </m.div>
      <span className={styles.corner}>+</span>
      <span className={styles.footnote}>Світ вартий ще одного погляду.</span>
    </div>
  );
}
