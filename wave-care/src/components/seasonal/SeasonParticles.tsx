"use client";

import { useMemo } from "react";
import type { SeasonTheme } from "@/lib/seasonThemes";
import styles from "./SeasonParticles.module.css";

type SeasonId = "verao" | "outono" | "inverno" | "primavera";

interface SeasonParticlesProps {
  seasonId: SeasonId;
  theme: SeasonTheme;
}

const MAX = 10;

/** Gera estilos aleatórios por partícula (tamanho, X, delay, duração) */
function buildParticleStyle(index: number, seasonId: SeasonId) {
  const seed = index * 7919;
  const left = ((seed * 13) % 100);
  const size = 4 + ((seed * 7) % 10);
  const delay = ((seed * 3) % 80) / 10;
  const dur = 6 + ((seed * 5) % 10);

  const base: React.CSSProperties = {
    left: `${left}%`,
    width: size,
    height: size,
    ["--delay" as string]: `${delay}s`,
    ["--dur" as string]: `${dur}s`,
    ["--peak-opacity" as string]: String(0.35 + ((seed % 5) * 0.1)),
  };

  if (seasonId === "verao") return base;

  return base;
}

/** Partículas decorativas em CSS puro — máx. 10 para mobile */
export default function SeasonParticles({ seasonId }: SeasonParticlesProps) {
  const particles = useMemo(
    () => Array.from({ length: MAX }, (_, i) => buildParticleStyle(i, seasonId)),
    [seasonId]
  );

  if (seasonId !== "verao") return null;

  return (
    <div className={styles.layer} aria-hidden>
      {particles.map((style, i) => (
        <div key={i} className={`${styles.particle} ${styles.verao}`} style={style} />
      ))}
    </div>
  );
}
