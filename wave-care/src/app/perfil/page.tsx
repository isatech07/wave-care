"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { apiUpdateUser } from "@/lib/api";
import { AvatarUpload } from "@/components/AvatarUpload/Avatarupload";

// ─── Paleta ───────────────────────────────────────────────────────
const C = {
  primary:      "#2d6a5a",
  primaryLight: "#3d8a74",
  primaryPale:  "#eef6f3",
  danger:       "#ef4444",
  dangerDark:   "#dc2626",
  dangerPale:   "#fef2f2",
  successPale:  "#d1fae5",
  successText:  "#065f46",
  text:         "#1a2e28",
  muted:        "#6b7280",
  border:       "#e5e7eb",
  borderLight:  "#f3f4f6",
  bg:           "#f5f5f0",
  card:         "#ffffff",
  radius:       "14px",
  radiusSm:     "9px",
  shadow:       "0 2px 12px rgba(0,0,0,0.07)",
  shadowMd:     "0 4px 20px rgba(0,0,0,0.12)",
} as const;

// ─── Tipos ────────────────────────────────────────────────────────
type Tab    = "dados" | "pedidos" | "favoritos" | "capilar";
type Theme  = "light" | "dark" | "system";
type SettingsSection = "main" | "appearance" | "notifications" | "privacy" | "language";

const STATUS_LABELS: Record<string, string> = {
  aguardando: "Aguardando", confirmado: "Confirmado",
  enviado: "Enviado", entregue: "Entregue",
};
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  aguardando: { bg: "#fef3c7", color: "#92400e" },
  confirmado: { bg: "#dbeafe", color: "#1e40af" },
  enviado:    { bg: "#ede9fe", color: "#5b21b6" },
  entregue:   { bg: "#d1fae5", color: "#065f46" },
};
const TRACK_STEPS = ["aguardando", "confirmado", "enviado", "entregue"];

// ─── Ícones ───────────────────────────────────────────────────────
const Icon = {
  User:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Package:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>,
  Heart:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Leaf:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>,
  LogOut:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Trash:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Edit:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Shield:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Alert:    () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  X:        () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Bell:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Lock:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Sun:      () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon:     () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Monitor:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  Globe:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Key:      () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>,
  Download: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Info:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  Mail:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Back:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>,
  Right:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
};

// ─── Toggle Switch ────────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} role="switch" aria-checked={on}
      style={{ width: 44, height: 24, borderRadius: 12, background: on ? C.primary : C.border, border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}
    >
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: on ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
    </button>
  );
}

// ─── Settings Row ─────────────────────────────────────────────────
function SettingsRow({ icon, label, description, right, danger, onClick }: {
  icon: React.ReactNode; label: string; description?: string;
  right?: React.ReactNode; danger?: boolean; onClick?: () => void;
}) {
  return (
    <div onClick={onClick}
      style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.75rem 1rem", borderRadius: C.radiusSm, cursor: onClick ? "pointer" : "default", transition: "background 0.15s" }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.background = danger ? C.dangerPale : C.primaryPale; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 9, background: danger ? C.dangerPale : C.primaryPale, color: danger ? C.danger : C.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: "0.875rem", color: danger ? C.danger : "var(--text-color, #1a2e28)" }}>{label}</div>
        {description && <div style={{ fontSize: "0.72rem", color: C.muted, marginTop: "0.1rem" }}>{description}</div>}
      </div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
      {onClick && !right && <div style={{ color: C.muted, flexShrink: 0 }}><Icon.Right /></div>}
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return <div style={{ fontSize: "0.67rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: C.muted, padding: "0.5rem 1rem 0.2rem", marginTop: "0.25rem" }}>{label}</div>;
}

// ─── Modal base ───────────────────────────────────────────────────
function Modal({ open, onClose, children, maxWidth = 520, zIndex = 1000 }: {
  open: boolean; onClose: () => void; children: React.ReactNode; maxWidth?: number; zIndex?: number;
}) {
  if (!open) return null;
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex, backdropFilter: "blur(2px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "var(--card-bg, #ffffff)", borderRadius: C.radius, width: "90%", maxWidth, maxHeight: "88vh", overflowY: "auto", boxShadow: C.shadowMd }}>
        {children}
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────
export default function PerfilPage() {
  const { user, isLoggedIn, isAdmin, logout, updateUser, updateAvatar, deleteAccount } = useUser();
  const router = useRouter();

  const [tab,          setTab]          = useState<Tab>("dados");
  const [editing,      setEditing]      = useState(false);
  const [saved,        setSaved]        = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Settings
  const [showSettings,      setShowSettings]      = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showChangePw,      setShowChangePw]      = useState(false);
  const [isDeleting,        setIsDeleting]        = useState(false);
  const [section,           setSection]           = useState<SettingsSection>("main");

  // Prefs (localStorage)
  const [theme,       setTheme]       = useState<Theme>("light");
  const [notifEmail,  setNotifEmail]  = useState(true);
  const [notifPedido, setNotifPedido] = useState(true);
  const [notifPromo,  setNotifPromo]  = useState(false);
  const [language,    setLanguage]    = useState("pt-BR");
  const [twoFactor,   setTwoFactor]   = useState(false);
  const [dataShare,   setDataShare]   = useState(false);

  // Senha
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwErr,  setPwErr]  = useState("");
  const [pwOk,   setPwOk]   = useState(false);

  // Form dados
  const [form, setForm] = useState({
    nome: user?.nome ?? "", email: user?.email ?? "",
    telefone: user?.telefone ?? "", cidade: user?.cidade ?? "",
  });
  useEffect(() => {
    if (user) setForm({ nome: user.nome, email: user.email, telefone: user.telefone ?? "", cidade: user.cidade ?? "" });
  }, [user]);

  // Carrega prefs
  useEffect(() => {
    const t = localStorage.getItem("wc_theme") as Theme | null;
    if (t) { setTheme(t); applyTheme(t); }
    setNotifEmail( localStorage.getItem("wc_notif_email")  !== "false");
    setNotifPedido(localStorage.getItem("wc_notif_pedido") !== "false");
    setNotifPromo( localStorage.getItem("wc_notif_promo")  === "true");
    const lang = localStorage.getItem("wc_language");
    if (lang) setLanguage(lang);
    setTwoFactor(localStorage.getItem("wc_2fa")       === "true");
    setDataShare(localStorage.getItem("wc_datashare") === "true");
  }, []);

  function applyTheme(t: Theme) {
    const dark = t === "dark" || (t === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.style.setProperty("--bg-color",   dark ? "#111b18" : "#f5f5f0");
    document.documentElement.style.setProperty("--text-color", dark ? "#e8f0ed" : "#1a2e28");
    document.documentElement.style.setProperty("--card-bg",    dark ? "#1e2d27" : "#ffffff");
  }
  function handleTheme(t: Theme) { setTheme(t); localStorage.setItem("wc_theme", t); applyTheme(t); }
  function handleLanguage(lang: string) { setLanguage(lang); localStorage.setItem("wc_language", lang); }

  function handleChangePw() {
    setPwErr("");
    if (!pwForm.current)       { setPwErr("Informe a senha atual."); return; }
    if (pwForm.next.length < 6){ setPwErr("Mínimo 6 caracteres."); return; }
    if (pwForm.next !== pwForm.confirm){ setPwErr("As senhas não coincidem."); return; }
    setPwOk(true);
    setPwForm({ current: "", next: "", confirm: "" });
    setTimeout(() => { setPwOk(false); setShowChangePw(false); }, 2000);
  }

  useEffect(() => {
    if (isLoggedIn && isAdmin && !isLoggingOut) router.push("/admin");
  }, [isLoggedIn, isAdmin, router, isLoggingOut]);

  const handleLogout = () => { setIsLoggingOut(true); logout(); router.push("/"); };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try { await deleteAccount(); router.push("/"); }
    catch { alert("Erro ao excluir conta. Tente novamente."); }
    finally { setIsDeleting(false); }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-color, #f5f5f0)" }}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ color: C.muted, marginBottom: "1rem" }}>Você precisa estar logado para ver seu perfil.</p>
          <Link href="/auth" style={{ background: C.primary, color: "#fff", padding: "0.65rem 1.5rem", borderRadius: "10px", textDecoration: "none", fontWeight: 600 }}>
            Entrar
          </Link>
        </div>
      </div>
    );
  }

  // ── handleSave com integração ao backend
  async function handleSave() {
    if (user?.id) {
      await apiUpdateUser(user.id, {
        name: form.nome,
        email: form.email,
        telefone: form.telefone,
        cidade: form.cidade,
      });
    }
    updateUser({ ...form });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  // ── estilos base
  const s = {
    wrapper:    { display: "flex" as const, minHeight: "100vh", background: "var(--bg-color, #f5f5f0)", fontFamily: "var(--font-inter), var(--font-jost), sans-serif", paddingTop: "80px" },
    sidebar:    { width: "260px", minWidth: "260px", background: "var(--card-bg, #ffffff)", borderRight: `1px solid ${C.border}`, display: "flex" as const, flexDirection: "column" as const, padding: "2rem 1.25rem", gap: "0.5rem", position: "sticky" as const, top: "80px", height: "calc(100vh - 80px)", overflowY: "auto" as const },
    main:       { flex: 1, padding: "2.5rem 2rem", maxWidth: "860px" },
    card:       { background: "var(--card-bg, #ffffff)", borderRadius: C.radius, padding: "1.75rem", boxShadow: C.shadow, border: `1px solid ${C.border}`, marginBottom: "1.25rem" },
    label:      { fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.5px", color: C.muted, marginBottom: "0.3rem", display: "block" as const },
    input:      { width: "100%", padding: "0.6rem 0.9rem", borderRadius: "9px", border: `1.5px solid ${C.border}`, fontSize: "0.875rem", color: "var(--text-color, #1a2e28)", background: "#fafafa", outline: "none", fontFamily: "inherit", boxSizing: "border-box" as const, transition: "border-color 0.15s" },
    btnPrimary: { padding: "0.6rem 1.5rem", borderRadius: "9px", border: "none", background: C.primary, color: "#fff", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
    btnOutline: { padding: "0.55rem 1.1rem", borderRadius: "9px", border: `1.5px solid ${C.primary}`, background: "transparent", color: C.primary, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex" as const, alignItems: "center" as const, gap: "0.35rem" },
    btnGhost:   { padding: "0.6rem 1.25rem", borderRadius: "9px", border: `1.5px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: "0.85rem", fontWeight: 500, cursor: "pointer", fontFamily: "inherit" },
    btnDanger:  { padding: "0.6rem 1.5rem", borderRadius: "9px", border: "none", background: C.danger, color: "#fff", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex" as const, alignItems: "center" as const, gap: "0.5rem" },
    mhdr:       { display: "flex" as const, justifyContent: "space-between" as const, alignItems: "center" as const, padding: "1rem 1.25rem", borderBottom: `1px solid ${C.border}` },
  };

  const navItems = [
    { id: "dados"     as Tab, label: "Meus Dados",    icon: <Icon.User />    },
    { id: "pedidos"   as Tab, label: "Pedidos",        icon: <Icon.Package /> },
    { id: "favoritos" as Tab, label: "Favoritos",      icon: <Icon.Heart />   },
    { id: "capilar"   as Tab, label: "Perfil Capilar", icon: <Icon.Leaf />    },
  ];

  const settingsTitle: Record<SettingsSection, string> = {
    main: "Configurações", appearance: "Aparência",
    notifications: "Notificações", privacy: "Privacidade & Segurança", language: "Idioma",
  };

  const openSettings = (sec: SettingsSection = "main") => { setSection(sec); setShowSettings(true); };

  return (
    <div style={s.wrapper}>

      {/* ══ Sidebar ══ */}
      <aside style={s.sidebar}>
        <div style={{ textAlign: "center", paddingBottom: "1.5rem", borderBottom: `1px solid ${C.border}`, marginBottom: "0.5rem", marginTop: "0.5rem" }}>
          <AvatarUpload size={72} />
          <p style={{ margin: "0.6rem 0 0.1rem", fontWeight: 600, fontSize: "0.95rem", color: "var(--text-color, #1a2e28)" }}>{user!.nome}</p>
          <p style={{ margin: "0 0 0.65rem", fontSize: "0.75rem", color: C.muted }}>{user!.email}</p>
          {isAdmin && (
            <Link href="/admin" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", background: "#fef3c7", color: "#92400e", fontSize: "0.7rem", fontWeight: 700, padding: "0.25rem 0.7rem", borderRadius: "20px", textDecoration: "none" }}>
              <Icon.Shield /> Admin
            </Link>
          )}
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.2rem", flex: 1 }}>
          {navItems.map(item => {
            const active = tab === item.id;
            return (
              <button key={item.id} onClick={() => setTab(item.id)} style={{ display: "flex", alignItems: "center", gap: "0.7rem", padding: "0.65rem 1rem", borderRadius: "10px", border: "none", cursor: "pointer", textAlign: "left", width: "100%", fontFamily: "inherit", background: active ? C.primaryPale : "transparent", color: active ? C.primary : C.muted, fontWeight: active ? 600 : 500, fontSize: "0.88rem", transition: "background 0.15s, color 0.15s" }}>
                {item.icon} {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "auto", paddingTop: "1rem", borderTop: `1px solid ${C.border}` }}>
          <button onClick={() => openSettings()}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1rem", borderRadius: "10px", border: `1.5px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: "inherit", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = C.primaryPale}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <Icon.Settings /> Configurações
          </button>
          <button onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1rem", borderRadius: "10px", border: `1.5px solid ${C.border}`, background: "transparent", color: C.danger, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: "inherit", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = C.dangerPale}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <Icon.LogOut /> Sair da conta
          </button>
        </div>
      </aside>

      {/* ══ Modal Configurações ══ */}
      <Modal open={showSettings} onClose={() => setShowSettings(false)}>
        <div style={s.mhdr}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {section !== "main" && (
              <button onClick={() => setSection("main")} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.muted, display: "flex", padding: "0.25rem", borderRadius: "6px" }}
                onMouseEnter={e => e.currentTarget.style.background = C.borderLight}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <Icon.Back />
              </button>
            )}
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-color, #1a2e28)" }}>{settingsTitle[section]}</h3>
          </div>
          <button onClick={() => setShowSettings(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.muted, display: "flex", borderRadius: "6px", padding: "0.25rem" }}
            onMouseEnter={e => e.currentTarget.style.background = C.borderLight}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <Icon.X />
          </button>
        </div>

        {/* MAIN */}
        {section === "main" && (
          <div style={{ padding: "0.5rem 0 1rem" }}>
            <SectionLabel label="Preferências" />
            <SettingsRow icon={<Icon.Sun />}  label="Aparência" description={theme === "light" ? "Tema claro" : theme === "dark" ? "Tema escuro" : "Sistema"} onClick={() => setSection("appearance")} />
            <SettingsRow icon={<Icon.Bell />} label="Notificações" description="E-mail e alertas de pedido" onClick={() => setSection("notifications")} />
            <SettingsRow icon={<Icon.Globe />} label="Idioma" description={language === "pt-BR" ? "Português (Brasil)" : language === "en" ? "English" : "Español"} onClick={() => setSection("language")} />
            <SectionLabel label="Conta" />
            <SettingsRow icon={<Icon.Key />}  label="Alterar senha" description="Atualize sua senha de acesso" onClick={() => { setShowSettings(false); setShowChangePw(true); }} />
            <SettingsRow icon={<Icon.Lock />} label="Privacidade & Segurança" description="2FA, dados pessoais" onClick={() => setSection("privacy")} />
            <SectionLabel label="Zona de perigo" />
            <SettingsRow icon={<Icon.Trash />} label="Excluir minha conta" description="Esta ação é permanente e irreversível" danger onClick={() => { setShowSettings(false); setShowDeleteConfirm(true); }} />
          </div>
        )}

        {/* APARÊNCIA */}
        {section === "appearance" && (
          <div style={{ padding: "1rem 1.25rem 1.5rem" }}>
            <p style={{ fontSize: "0.8rem", color: C.muted, margin: "0 0 1rem" }}>Escolha como a interface será exibida.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {([["light","Claro",<Icon.Sun />],["dark","Escuro",<Icon.Moon />],["system","Sistema",<Icon.Monitor />]] as const).map(([key, label, icon]) => (
                <button key={key} onClick={() => handleTheme(key as Theme)}
                  style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.85rem 1rem", borderRadius: C.radiusSm, border: `1.5px solid ${theme === key ? C.primary : C.border}`, background: theme === key ? C.primaryPale : "transparent", cursor: "pointer", fontFamily: "inherit", textAlign: "left", width: "100%", transition: "all 0.15s" }}
                >
                  <div style={{ color: theme === key ? C.primary : C.muted }}>{icon}</div>
                  <span style={{ fontWeight: 600, fontSize: "0.875rem", color: theme === key ? C.primary : "var(--text-color, #1a2e28)", flex: 1 }}>{label}</span>
                  {theme === key && <div style={{ color: C.primary }}><Icon.Check /></div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* NOTIFICAÇÕES */}
        {section === "notifications" && (
          <div style={{ padding: "0.5rem 0 1rem" }}>
            <SectionLabel label="E-mail" />
            <SettingsRow icon={<Icon.Mail />}    label="Promoções e novidades"   description="Ofertas e lançamentos"       right={<Toggle on={notifPromo}  onChange={() => { const v=!notifPromo;  setNotifPromo(v);  localStorage.setItem("wc_notif_promo", String(v));  }} />} />
            <SettingsRow icon={<Icon.Package />} label="Atualizações de pedidos" description="Status de envio e entrega"   right={<Toggle on={notifPedido} onChange={() => { const v=!notifPedido; setNotifPedido(v); localStorage.setItem("wc_notif_pedido",String(v)); }} />} />
            <SettingsRow icon={<Icon.Bell />}    label="E-mails gerais"          description="Comunicações da Wave Care"   right={<Toggle on={notifEmail}  onChange={() => { const v=!notifEmail;  setNotifEmail(v);  localStorage.setItem("wc_notif_email", String(v));  }} />} />
          </div>
        )}

        {/* IDIOMA */}
        {section === "language" && (
          <div style={{ padding: "1rem 1.25rem 1.5rem" }}>
            <p style={{ fontSize: "0.8rem", color: C.muted, margin: "0 0 1rem" }}>Idioma usado na interface.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {([["pt-BR","🇧🇷","Português (Brasil)"],["en","🇺🇸","English"],["es","🇪🇸","Español"]] as const).map(([key,flag,label]) => (
                <button key={key} onClick={() => handleLanguage(key)}
                  style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.85rem 1rem", borderRadius: C.radiusSm, border: `1.5px solid ${language === key ? C.primary : C.border}`, background: language === key ? C.primaryPale : "transparent", cursor: "pointer", fontFamily: "inherit", textAlign: "left", width: "100%" }}
                >
                  <span style={{ fontSize: "1.25rem" }}>{flag}</span>
                  <span style={{ fontWeight: 600, fontSize: "0.875rem", color: language === key ? C.primary : "var(--text-color, #1a2e28)", flex: 1 }}>{label}</span>
                  {language === key && <div style={{ color: C.primary }}><Icon.Check /></div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PRIVACIDADE */}
        {section === "privacy" && (
          <div style={{ padding: "0.5rem 0 1rem" }}>
            <SectionLabel label="Segurança" />
            <SettingsRow icon={<Icon.Shield />} label="Autenticação de dois fatores" description={twoFactor ? "Ativada" : "Desativada — recomendamos ativar"} right={<Toggle on={twoFactor} onChange={() => { const v=!twoFactor; setTwoFactor(v); localStorage.setItem("wc_2fa",String(v)); }} />} />
            <SectionLabel label="Dados" />
            <SettingsRow icon={<Icon.Info />} label="Compartilhamento de dados" description="Ajude a melhorar nossos produtos" right={<Toggle on={dataShare} onChange={() => { const v=!dataShare; setDataShare(v); localStorage.setItem("wc_datashare",String(v)); }} />} />
          </div>
        )}
      </Modal>

      {/* ══ Modal Alterar Senha ══ */}
      <Modal open={showChangePw} onClose={() => { setShowChangePw(false); setPwErr(""); setPwForm({ current:"",next:"",confirm:"" }); }}>
        <div style={s.mhdr}>
          <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-color, #1a2e28)", display: "flex", alignItems: "center", gap: "0.5rem" }}><Icon.Key /> Alterar senha</h3>
          <button onClick={() => setShowChangePw(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.muted, display: "flex" }}><Icon.X /></button>
        </div>
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {pwOk  && <div style={{ background: C.successPale, color: C.successText, borderRadius: C.radiusSm, padding: "0.65rem 1rem", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><Icon.Check /> Senha alterada!</div>}
          {pwErr && <div style={{ background: C.dangerPale, color: C.dangerDark, borderRadius: C.radiusSm, padding: "0.65rem 1rem", fontSize: "0.85rem" }}>{pwErr}</div>}
          {([["current","Senha atual","Digite sua senha atual"],["next","Nova senha","Mínimo 6 caracteres"],["confirm","Confirmar senha","Repita a nova senha"]] as const).map(([f,l,p]) => (
            <div key={f}>
              <label style={s.label}>{l}</label>
              <input type="password" placeholder={p} value={pwForm[f]} onChange={e => setPwForm(x => ({ ...x, [f]: e.target.value }))} style={s.input}
                onFocus={e => { e.currentTarget.style.borderColor = C.primary; }}
                onBlur={e  => { e.currentTarget.style.borderColor = C.border;  }}
              />
            </div>
          ))}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", paddingTop: "0.25rem" }}>
            <button style={s.btnGhost} onClick={() => setShowChangePw(false)}>Cancelar</button>
            <button style={s.btnPrimary} onClick={handleChangePw}>Salvar senha</button>
          </div>
        </div>
      </Modal>

      {/* ══ Modal Excluir Conta ══ */}
      <Modal open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} maxWidth={420} zIndex={1010}>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.dangerPale, color: C.danger, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}><Icon.Alert /></div>
          <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.1rem", fontWeight: 700, color: "var(--text-color, #1a2e28)" }}>Excluir conta permanentemente</h3>
          <p style={{ margin: "0 0 1.5rem", fontSize: "0.875rem", color: C.muted, lineHeight: 1.5 }}>
            Esta ação é <strong>irreversível</strong>. Todos os seus dados, pedidos e favoritos serão apagados.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button style={s.btnGhost} onClick={() => setShowDeleteConfirm(false)}>Cancelar</button>
            <button onClick={handleDeleteAccount} disabled={isDeleting}
              style={{ ...s.btnDanger, opacity: isDeleting ? 0.7 : 1, cursor: isDeleting ? "not-allowed" : "pointer" }}
            >
              <Icon.Trash /> {isDeleting ? "Excluindo..." : "Excluir conta"}
            </button>
          </div>
        </div>
      </Modal>

      {/* ══ Main ══ */}
      <main style={s.main}>

        {/* ═══ DADOS ═══ */}
        {tab === "dados" && (
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <div>
                <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "var(--text-color, #1a2e28)" }}>Meus Dados</h1>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.83rem", color: C.muted }}>Gerencie suas informações pessoais</p>
              </div>
              {!editing && <button style={s.btnOutline} onClick={() => setEditing(true)}><Icon.Edit /> Editar</button>}
            </div>

            {saved && (
              <div style={{ background: C.successPale, color: C.successText, borderRadius: "9px", padding: "0.75rem 1rem", fontSize: "0.85rem", fontWeight: 500, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Icon.Check /> Dados salvos com sucesso!
              </div>
            )}

            {/* Card foto */}
            <div style={{ ...s.card, display: "flex", alignItems: "center", gap: "1.5rem", background: `linear-gradient(135deg, ${C.primaryPale}, #f0faf6)` }}>
              <AvatarUpload size={80} />
              <div>
                <p style={{ margin: "0 0 0.2rem", fontWeight: 700, fontSize: "1.05rem", color: "var(--text-color, #1a2e28)" }}>{user!.nome}</p>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.8rem", color: C.muted }}>{user!.email}</p>
                <span style={{ fontSize: "0.7rem", color: C.primary, background: C.primaryPale, padding: "0.18rem 0.55rem", borderRadius: "20px", fontWeight: 600 }}>
                  Clique na foto para alterar
                </span>
              </div>
            </div>

            <div style={s.card}>
              {!editing ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  {([["Nome", user!.nome], ["E-mail", user!.email], ["Telefone", user!.telefone || "—"], ["Cidade", user!.cidade || "—"]] as const).map(([label, value]) => (
                    <div key={label}>
                      <span style={s.label}>{label}</span>
                      <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 500, color: "var(--text-color, #1a2e28)" }}>{value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.5rem" }}>
                    {(["nome","email","telefone","cidade"] as const).map(field => (
                      <div key={field}>
                        <label style={s.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input style={s.input} value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                          onFocus={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(45,106,90,0.1)"; }}
                          onBlur={e  => { e.currentTarget.style.borderColor = C.border;  e.currentTarget.style.boxShadow = "none"; }}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                    <button style={s.btnGhost} onClick={() => setEditing(false)}>Cancelar</button>
                    <button style={s.btnPrimary} onClick={handleSave}>Salvar alterações</button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ═══ PEDIDOS ═══ */}
        {tab === "pedidos" && (
          <section>
            <div style={{ marginBottom: "1.5rem" }}>
              <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "var(--text-color, #1a2e28)" }}>Meus Pedidos</h1>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.83rem", color: C.muted }}>Acompanhe seus pedidos</p>
            </div>
            {!user!.orders || user!.orders.length === 0 ? (
              <EmptyState icon="📦" title="Nenhum pedido ainda" text="Explore nossos produtos e faça seu primeiro pedido." />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {user!.orders.map(order => {
                  const sc = STATUS_COLORS[order.status] ?? { bg: "#f3f4f6", color: "#374151" };
                  const stepIdx = TRACK_STEPS.indexOf(order.status);
                  return (
                    <div key={order.id} style={s.card}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                        <div>
                          <span style={{ fontWeight: 700, color: "var(--text-color, #1a2e28)", fontSize: "0.95rem", display: "block" }}>Pedido #{order.id}</span>
                          <span style={{ fontSize: "0.78rem", color: C.muted, display: "block" }}>{order.date}</span>
                        </div>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.3rem 0.75rem", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.5px", background: sc.bg, color: sc.color }}>
                          {STATUS_LABELS[order.status]}
                        </span>
                      </div>
                      <div style={{ marginBottom: "0.75rem" }}>
                        {order.items.map(({ product, quantity }) => (
                          <div key={product.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--text-color, #1a2e28)", padding: "0.2rem 0" }}>
                            <span>{product.name} <span style={{ color: C.muted }}>x{quantity}</span></span>
                            <span>R$ {(product.price * quantity).toFixed(2).replace(".", ",")}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.75rem", borderTop: `1px solid ${C.border}`, marginBottom: "1rem" }}>
                        <span style={{ fontSize: "0.78rem", color: C.muted }}>{order.address}</span>
                        <span style={{ fontWeight: 700, color: C.primary, fontSize: "1rem" }}>R$ {order.total.toFixed(2).replace(".", ",")}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {TRACK_STEPS.map((step, i) => {
                          const done = i <= stepIdx, isLast = i === TRACK_STEPS.length - 1;
                          return (
                            <div key={step} style={{ display: "flex", flex: isLast ? 0 : 1, alignItems: "center", flexDirection: "column", position: "relative" }}>
                              <div style={{ width: 13, height: 13, borderRadius: "50%", zIndex: 1, background: done ? C.primary : C.border, border: `2px solid ${done ? C.primary : C.border}` }} />
                              <span style={{ fontSize: "0.62rem", marginTop: "0.3rem", whiteSpace: "nowrap", color: done ? C.primary : C.muted, fontWeight: done ? 600 : 400 }}>{STATUS_LABELS[step]}</span>
                              {!isLast && <div style={{ position: "absolute", top: 6, left: "50%", width: "100%", height: 2, background: done && i < stepIdx ? C.primary : C.border, zIndex: 0 }} />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ═══ FAVORITOS ═══ */}
        {tab === "favoritos" && (
          <section>
            <div style={{ marginBottom: "1.5rem" }}>
              <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "var(--text-color, #1a2e28)" }}>Favoritos</h1>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.83rem", color: C.muted }}>Produtos que você salvou</p>
            </div>
            {!user!.favorites || user!.favorites.length === 0 ? (
              <EmptyState icon="♡" title="Nenhum favorito ainda" text="Explore nossos produtos e salve os que você mais gostar." />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "1rem" }}>
                {user!.favorites.map(product => (
                  <div key={product.id} style={{ background: "var(--card-bg, #ffffff)", borderRadius: C.radius, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: C.shadow, transition: "transform 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-3px)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    <div style={{ height: 130, background: C.primaryPale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>🧴</div>
                    <div style={{ padding: "0.85rem 1rem" }}>
                      <p style={{ margin: "0 0 0.15rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-color, #1a2e28)" }}>{product.name}</p>
                      <p style={{ margin: "0 0 0.35rem", fontSize: "0.72rem", color: C.muted, textTransform: "capitalize" }}>{product.category}</p>
                      <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: C.primary }}>R$ {product.price.toFixed(2).replace(".", ",")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ═══ CAPILAR ═══ */}
        {tab === "capilar" && (
          <section>
            <div style={{ marginBottom: "1.5rem" }}>
              <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "var(--text-color, #1a2e28)" }}>Perfil Capilar</h1>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.83rem", color: C.muted }}>Suas preferências de cuidado com o cabelo</p>
            </div>
            {!user!.capilar ? (
              <EmptyState icon="🌿" title="Perfil capilar não preenchido" text="Faça nosso quiz para descobrir a rotina ideal para o seu cabelo." cta={{ href: "/quiz", label: "Fazer o quiz" }} />
            ) : (
              <div style={s.card}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  {([["Tipo de cabelo", user!.capilar.tipo], ["Preocupação", user!.capilar.preocupacao], ["Frequência de peia", user!.capilar.frequenciaPreia], ["Estação crítica", user!.capilar.estacaoCritica]] as const).map(([label, value]) => (
                    <div key={label}>
                      <span style={s.label}>{label}</span>
                      <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 500, color: "var(--text-color, #1a2e28)" }}>{value}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: `1px solid ${C.border}` }}>
                  <Link href="/quiz" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.55rem 1.1rem", borderRadius: "9px", border: `1.5px solid ${C.primary}`, background: "transparent", color: C.primary, fontSize: "0.82rem", fontWeight: 600, textDecoration: "none" }}>
                    <Icon.Edit /> Refazer quiz
                  </Link>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────
function EmptyState({ icon, title, text, cta }: { icon: string; title: string; text: string; cta?: { href: string; label: string } }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 2rem", textAlign: "center", background: "var(--card-bg, #ffffff)", borderRadius: C.radius, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
      <span style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.4 }}>{icon}</span>
      <h3 style={{ margin: "0 0 0.4rem", fontSize: "1.05rem", fontWeight: 600, color: "var(--text-color, #1a2e28)" }}>{title}</h3>
      <p style={{ margin: "0 0 1.5rem", fontSize: "0.875rem", color: C.muted }}>{text}</p>
      {cta && <Link href={cta.href} style={{ background: C.primary, color: "#fff", padding: "0.65rem 1.4rem", borderRadius: "9px", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem" }}>{cta.label}</Link>}
    </div>
  );
}