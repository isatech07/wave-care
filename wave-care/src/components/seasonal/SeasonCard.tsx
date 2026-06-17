"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./SeasonCard.module.css";

type SeasonId = "verao" | "outono" | "inverno" | "primavera";

interface SeasonCardProps {
  seasonId: SeasonId;
  index: number;
  children: ReactNode;
  className?: string;
}


export default function SeasonCard({ seasonId, index, children, className = "" }: SeasonCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const delay = Math.min(index * 80, 400);

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
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.card} ${styles[seasonId]} ${styles.reveal} ${visible ? styles.revealVisible : ""} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
}
