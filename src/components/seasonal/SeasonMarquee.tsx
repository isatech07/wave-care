"use client";

import styles from "./SeasonMarquee.module.css";

interface SeasonMarqueeProps {
  words: string[];
  highlightColor: string;
  icon: React.ReactNode;
}

export default function SeasonMarquee({ words, highlightColor, icon }: SeasonMarqueeProps) {
  const loop = [...words, ...words];

  return (
    <div
      className={styles.marqueeWrapper}
      style={{ "--highlight-color": highlightColor } as React.CSSProperties}
    >
      <div className={styles.marqueeTrack}>
        {loop.map((word, i) => (
          <span key={`${word}-${i}`} className={styles.marqueeItem}>
            {word}
            <span className={styles.separator}>{icon}</span>
          </span>
        ))}
      </div>
    </div>
  );
}