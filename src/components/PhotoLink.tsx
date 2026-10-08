"use client";

import Link from "next/link";
import { createContext, useContext, type ReactNode } from "react";

const GalleryReturnContext = createContext("/");

export function GalleryNavigationProvider({
  returnHref,
  children,
}: {
  returnHref: string;
  children: ReactNode;
}) {
  return (
    <GalleryReturnContext.Provider value={returnHref}>{children}</GalleryReturnContext.Provider>
  );
}

export function PhotoLink({
  id,
  label,
  className,
  children,
}: {
  id: string;
  label: string;
  className: string;
  children: ReactNode;
}) {
  const returnHref = useContext(GalleryReturnContext);
  const query = new URLSearchParams({ from: returnHref });

  return (
    <Link
      className={className}
      href={`/photos/${encodeURIComponent(id)}?${query}`}
      prefetch={false}
      aria-label={label}
    >
      {children}
    </Link>
  );
}
