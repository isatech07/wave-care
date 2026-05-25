"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";

type SeasonKey = "verao" | "outono" | "inverno" | "primavera" | null;

function getSeasonFromPath(path: string): SeasonKey {
  if (path.includes("/verao")) return "verao";
  if (path.includes("/outono")) return "outono";
  if (path.includes("/inverno")) return "inverno";
  if (path.includes("/primavera")) return "primavera";
  return null;
}

/** Transição de entrada por estação — classe .page-enter após mount */
export default function EstacoesLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const season = getSeasonFromPath(pathname);
  const [entered, setEntered] = useState(false);
  const [overlayDone, setOverlayDone] = useState(false);

  useEffect(() => {
    setEntered(false);
    setOverlayDone(false);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setEntered(true);
      setOverlayDone(true);
      return;
    }

    const enterTimer = window.setTimeout(() => setEntered(true), 10);
    const doneTimer = window.setTimeout(() => setOverlayDone(true), 620);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(doneTimer);
    };
  }, [pathname]);

  const shellClass =
    season === "verao"
      ? `${styles.pageShell} ${styles.enterVerao} ${entered ? styles.enterVeraoActive : ""}`
      : styles.pageShell;

  return (
    <div className={shellClass}>
      {season === "outono" && !overlayDone && (
        <div className={`${styles.curtain} ${entered ? styles.curtainDone : ""}`} aria-hidden />
      )}
      {season === "inverno" && !overlayDone && (
        <div className={`${styles.flash} ${entered ? styles.flashDone : ""}`} aria-hidden />
      )}
      {season === "primavera" && !overlayDone && (
        <div className={`${styles.circleReveal} ${entered ? styles.circleRevealDone : ""}`} aria-hidden />
      )}
      {children}
    </div>
  );
}
