/** Cores sazonais já definidas nos page.module.css de cada estação */
export interface SeasonTheme {
  primary: string;
  background: string;
  foreground: string;
  muted: string;
  light?: string;
}

export const seasonThemes: Record<"verao" | "outono" | "inverno" | "primavera", SeasonTheme> = {
  verao: {
    primary: "#C2410C",
    background: "#FCFAF7",
    foreground: "#1C1917",
    muted: "#78716C",
  },
  outono: {
    primary: "#698609",
    background: "#F5F0E8",
    foreground: "#2C2016",
    muted: "#7A6A55",
  },
  inverno: {
    primary: "#00305f",
    background: "#F4F7FA",
    foreground: "#0C1A28",
    muted: "#4A6070",
  },
  primavera: {
    primary: "#9D1A52",
    background: "#FDF5F8",
    foreground: "#2D1220",
    muted: "#8C5A6E",
    light: "#F3D6E4",
  },
};
