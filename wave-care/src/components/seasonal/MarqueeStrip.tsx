"use client";

import type { SeasonTheme } from "@/lib/seasonThemes";
import styles from "./MarqueeStrip.module.css";

interface MarqueeStripProps {
  words: string[];
  separator: string;
  theme: SeasonTheme;
}

/** Faixa com palavras em scroll horizontal infinito (array duplicado evita salto) */
export default function MarqueeStrip({ words, separator, theme }: MarqueeStripProps) {
  const loop = [...words, ...words];

  return (
    <div
      className={styles.track}
      style={
        {
          "--marquee-bg": theme.primary,
          "--marquee-fg": theme.background,
        } as React.CSSProperties
      }
      aria-hidden
    >
      <div className={styles.inner}>
        {loop.map((word, i) => (
          <span key={`${word}-${i}`} className={styles.item}>
            {word}
            <span className={styles.sep}>{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
