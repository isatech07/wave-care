"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { SeasonTheme } from "@/lib/seasonThemes";
import styles from "./SeasonHero.module.css";

type SeasonId = "verao" | "outono" | "inverno" | "primavera";

interface SeasonHeroProps {
  seasonId: SeasonId;
  theme: SeasonTheme;
  children: ReactNode;
}

/** Hero com gradiente sazonal, decoração SVG e entrada ao entrar na viewport */
export default function SeasonHero({ seasonId, theme, children }: SeasonHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.wrapper} ${styles.enter} ${visible ? styles.enterVisible : ""}`}
    >
      <div
        className={styles.bg}
        style={{
          background: `linear-gradient(160deg, ${theme.background} 0%, ${theme.primary}22 45%, ${theme.background} 100%)`,
        }}
        aria-hidden
      />

      {seasonId === "verao" && (
        <svg
          className={styles.waves}
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            className={styles.wavePath}
            d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
            fill={theme.primary}
            opacity="0.2"
          />
          <path
            className={styles.wavePath}
            d="M0,50 C300,20 600,70 900,45 C1100,30 1300,60 1440,50 L1440,80 L0,80 Z"
            fill={theme.primary}
            opacity="0.12"
            style={{ animationDelay: "1.5s" }}
          />
        </svg>
      )}

      <div className={styles.content}>{children}</div>
    </div>
  );
}
