"use client";

import { useRef, useState } from "react";
import { useUser } from "@/contexts/UserContext";

const PRIMARY = "#2d6a5a";
const MUTED   = "#6b7280";
const DANGER  = "#ef4444";

function AvatarInitials({ size, initials, fontScale = 0.35 }: {
  size: number;
  initials: string;
  fontScale?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${PRIMARY}, #7aab9a)`,
        color: "#fff",
        fontSize: Math.round(size * fontScale),
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {initials}
    </div>
  );
}

export function AvatarDisplay({ size = 36 }: { size?: number }) {
  const { user } = useUser();

  const initials = user?.nome
    ? user.nome.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user?.nome ?? "Avatar"}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: `2px solid ${PRIMARY}`,
          flexShrink: 0,
          display: "block",
        }}
      />
    );
  }

  return <AvatarInitials size={size} initials={initials} />;
}

export function AvatarUpload({ size = 72 }: { size?: number }) {
  const { user, updateAvatar } = useUser();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const initials = user?.nome
    ? user.nome.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const processFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Apenas imagens são permitidas.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Imagem muito grande (máx. 5 MB).");
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      updateAvatar(reader.result as string);
      setLoading(false);
    };
    reader.onerror = () => {
      setError("Erro ao ler a imagem.");
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const cameraSize = Math.round(size * 0.33);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
        <div
          style={{ position: "relative", cursor: "pointer", display: "inline-block" }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          title="Clique ou arraste para trocar a foto"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Foto de perfil"
              style={{
                width: size,
                height: size,
                borderRadius: "50%",
                objectFit: "cover",
                display: "block",
                border: `3px solid ${dragging ? PRIMARY : "rgba(45,106,90,0.25)"}`,
                boxShadow: "0 4px 16px rgba(45,106,90,0.2)",
                transition: "border-color 0.2s, transform 0.2s",
                transform: dragging ? "scale(1.05)" : "scale(1)",
              }}
            />
          ) : (
            <div
              style={{
                width: size,
                height: size,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${PRIMARY}, #7aab9a)`,
                color: "#fff",
                fontSize: Math.round(size * 0.3),
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `3px solid ${dragging ? "white" : "rgba(45,106,90,0.25)"}`,
                boxShadow: "0 4px 16px rgba(45,106,90,0.2)",
                transition: "all 0.2s",
                transform: dragging ? "scale(1.05)" : "scale(1)",
                userSelect: "none",
              }}
            >
              {loading ? "..." : initials}
            </div>
          )}

          <div
            className="avatar-hover-overlay"
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.38)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              transition: "opacity 0.18s",
              color: "#fff",
              fontSize: "0.6rem",
              fontWeight: 600,
              gap: 3,
              pointerEvents: "none",
            }}
          >
            <svg width={cameraSize} height={cameraSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Trocar
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 1,
              right: 1,
              width: Math.round(size * 0.32),
              height: Math.round(size * 0.32),
              borderRadius: "50%",
              background: PRIMARY,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
              border: "2.5px solid white",
              pointerEvents: "none",
            }}
          >
            <svg width={Math.round(size * 0.15)} height={Math.round(size * 0.15)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        </div>

        <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} style={{ display: "none" }} />

        {user?.avatar && (
          <button
            type="button"
            onClick={() => updateAvatar("")}
            style={{
              background: "transparent",
              border: "none",
              color: MUTED,
              fontSize: "0.7rem",
              cursor: "pointer",
              padding: "0.1rem 0.3rem",
              fontFamily: "inherit",
              textDecoration: "underline",
            }}
          >
            Remover foto
          </button>
        )}

        {error && (
          <p style={{ color: DANGER, fontSize: "0.7rem", margin: 0, textAlign: "center" }}>{error}</p>
        )}

        <style>{`
          div:has(> .avatar-hover-overlay):hover .avatar-hover-overlay { opacity: 1 !important; }
        `}</style>
    </div>
  );
}
