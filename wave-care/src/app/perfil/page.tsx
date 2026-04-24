"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { apiUpdateUser } from "@/lib/api";

// ─── Paleta Wave Care ────────────────────────────────────────────
const C = {
  primary:      "#2d6a5a",
  primaryLight: "#3d8a74",
  primaryPale:  "#eef6f3",
  danger:       "#ef4444",
  success:      "#10b981",
  text:         "#1a2e28",
  muted:        "#6b7280",
  border:       "#e5e7eb",
  bg:           "#f5f5f0",
  card:         "#ffffff",
  radius:       "14px",
  shadow:       "0 2px 12px rgba(0,0,0,0.07)",
} as const;

// ─── Tipos ────────────────────────────────────────────────────────
type Tab = "dados" | "pedidos" | "favoritos" | "capilar";

const STATUS_LABELS: Record<string, string> = {
  aguardando:  "Aguardando",
  confirmado:  "Confirmado",
  enviado:     "Enviado",
  entregue:    "Entregue",
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  aguardando: { bg: "#fef3c7", color: "#92400e" },
  confirmado: { bg: "#dbeafe", color: "#1e40af" },
  enviado:    { bg: "#ede9fe", color: "#5b21b6" },
  entregue:   { bg: "#d1fae5", color: "#065f46" },
};

const TRACK_STEPS = ["aguardando", "confirmado", "enviado", "entregue"];

// ─── Ícones SVG inline ────────────────────────────────────────────
const Icon = {
  User: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Package: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/>
    </svg>
  ),
  Heart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  Leaf: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  ),
  LogOut: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Edit: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Shield: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

// ─── Componente principal ─────────────────────────────────────────
export default function PerfilPage() {
  const { user, isLoggedIn, isAdmin, logout, updateUser } = useUser();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("dados");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [form, setForm] = useState({
    nome:     user?.nome     ?? "",
    email:    user?.email    ?? "",
    telefone: user?.telefone ?? "",
    cidade:   user?.cidade   ?? "",
  });

  useEffect(() => {
    if (isLoggedIn && isAdmin && !isLoggingOut) {
      router.push("/admin");
    }
  }, [isLoggedIn, isAdmin, router, isLoggingOut]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
    router.push("/");
  };


  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg }}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ color: C.muted, marginBottom: "1rem" }}>Você precisa estar logado para ver seu perfil.</p>
          <Link href="/auth" style={{ background: C.primary, color: "#fff", padding: "0.65rem 1.5rem", borderRadius: "10px", textDecoration: "none", fontWeight: 600 }}>
            Entrar
          </Link>
        </div>
      </div>
    );
  }

  const initials = user!.nome.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

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

  // ── estilos compartilhados
  const s = {
    // Layout
    wrapper: {
      display: "flex" as const,
      minHeight: "100vh",
      background: C.bg,
      fontFamily: "var(--font-inter), var(--font-jost), sans-serif",
    },
    // Sidebar
    sidebar: {
      width: "260px",
      minWidth: "260px",
      background: C.card,
      borderRight: `1px solid ${C.border}`,
      display: "flex" as const,
      flexDirection: "column" as const,
      padding: "2rem 1.25rem",
      gap: "0.5rem",
      position: "sticky" as const,
      top: 0,
      height: "100vh",
      overflowY: "auto" as const,
    },
    // Main
    main: {
      flex: 1,
      padding: "2.5rem 2rem",
      maxWidth: "860px",
    },
    // Card
    card: {
      background: C.card,
      borderRadius: C.radius,
      padding: "1.75rem",
      boxShadow: C.shadow,
      border: `1px solid ${C.border}`,
      marginBottom: "1.25rem",
    },
    // Label
    label: {
      fontSize: "0.72rem",
      fontWeight: 600,
      textTransform: "uppercase" as const,
      letterSpacing: "0.5px",
      color: C.muted,
      marginBottom: "0.3rem",
      display: "block" as const,
    },
    // Input
    input: {
      width: "100%",
      padding: "0.6rem 0.9rem",
      borderRadius: "9px",
      border: `1.5px solid ${C.border}`,
      fontSize: "0.875rem",
      color: C.text,
      background: "#fafafa",
      outline: "none",
      fontFamily: "inherit",
      boxSizing: "border-box" as const,
    },
    // Btn primário
    btnPrimary: {
      padding: "0.6rem 1.5rem",
      borderRadius: "9px",
      border: "none",
      background: C.primary,
      color: "#fff",
      fontSize: "0.85rem",
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "inherit",
    },
    // Btn outline
    btnOutline: {
      padding: "0.55rem 1.1rem",
      borderRadius: "9px",
      border: `1.5px solid ${C.primary}`,
      background: "transparent",
      color: C.primary,
      fontSize: "0.82rem",
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "inherit",
      display: "flex" as const,
      alignItems: "center" as const,
      gap: "0.35rem",
    },
    // Btn ghost
    btnGhost: {
      padding: "0.6rem 1.25rem",
      borderRadius: "9px",
      border: `1.5px solid ${C.border}`,
      background: "transparent",
      color: C.muted,
      fontSize: "0.85rem",
      fontWeight: 500,
      cursor: "pointer",
      fontFamily: "inherit",
    },
  };

  const navItems: { id: Tab; label: string; icon: JSX.Element }[] = [
    { id: "dados",     label: "Meus Dados",   icon: <Icon.User /> },
    { id: "pedidos",   label: "Pedidos",       icon: <Icon.Package /> },
    { id: "favoritos", label: "Favoritos",     icon: <Icon.Heart /> },
    { id: "capilar",   label: "Perfil Capilar",icon: <Icon.Leaf /> },
  ];

  return (
    <div style={s.wrapper}>

      {/* ── Sidebar ── */}
      <aside style={s.sidebar}>

        {/* Avatar */}
        <div style={{ textAlign: "center", paddingBottom: "1.5rem", borderBottom: `1px solid ${C.border}`, marginBottom: "0.5rem" }}>
          <div style={{
            width: 68, height: 68, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.primary}, #7aab9a)`,
            color: "#fff", fontSize: "1.4rem", fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 0.75rem",
            boxShadow: "0 4px 16px rgba(45,106,90,0.25)",
          }}>
            {initials}
          </div>
          <p style={{ margin: "0 0 0.15rem", fontWeight: 600, fontSize: "0.95rem", color: C.text }}>{user!.nome}</p>
          <p style={{ margin: "0 0 0.65rem", fontSize: "0.75rem", color: C.muted }}>{user!.email}</p>
          {isAdmin && (
            <Link href="/admin" style={{
              display: "inline-flex", alignItems: "center", gap: "0.3rem",
              background: "#fef3c7", color: "#92400e",
              fontSize: "0.7rem", fontWeight: 700,
              padding: "0.25rem 0.7rem", borderRadius: "20px",
              textDecoration: "none",
            }}>
              <Icon.Shield /> Admin
            </Link>
          )}
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.2rem", flex: 1 }}>
          {navItems.map(item => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.7rem",
                  padding: "0.65rem 1rem", borderRadius: "10px",
                  border: "none", cursor: "pointer", textAlign: "left",
                  width: "100%", fontFamily: "inherit",
                  background: active ? C.primaryPale : "transparent",
                  color:      active ? C.primary      : C.muted,
                  fontWeight: active ? 600             : 500,
                  fontSize: "0.88rem",
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
  onClick={handleLogout}
  style={{
    display: "flex", alignItems: "center", gap: "0.5rem",
    padding: "0.65rem 1rem", borderRadius: "10px",
    border: `1.5px solid ${C.border}`, background: "transparent",
    color: C.danger, fontSize: "0.85rem", fontWeight: 600,
    cursor: "pointer", width: "100%", fontFamily: "inherit",
    marginTop: "auto",
  }}
>
  <Icon.LogOut /> Sair da conta
</button>
      </aside>

      {/* ── Main ── */}
      <main style={s.main}>

        {/* ═══ ABA: DADOS ═══ */}
        {tab === "dados" && (
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
              <div>
                <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: C.text }}>Meus Dados</h1>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.83rem", color: C.muted }}>Gerencie suas informações pessoais</p>
              </div>
              {!editing && (
                <button style={s.btnOutline} onClick={() => setEditing(true)}>
                  <Icon.Edit /> Editar
                </button>
              )}
            </div>

            {saved && (
              <div style={{ background: "#d1fae5", color: "#065f46", borderRadius: "9px", padding: "0.75rem 1rem", fontSize: "0.85rem", fontWeight: 500, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Icon.Check /> Dados salvos com sucesso!
              </div>
            )}

            <div style={s.card}>
              {!editing ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  {[
                    ["Nome", user!.nome],
                    ["E-mail", user!.email],
                    ["Telefone", user!.telefone || "—"],
                    ["Cidade", user!.cidade || "—"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <span style={s.label}>{label}</span>
                      <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 500, color: C.text }}>{value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.5rem" }}>
                    {(["nome", "email", "telefone", "cidade"] as const).map(field => (
                      <div key={field}>
                        <label style={s.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <input
                          style={s.input}
                          value={form[field]}
                          onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                          onFocus={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(45,106,90,0.1)`; }}
                          onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}
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

        {/* ═══ ABA: PEDIDOS ═══ */}
        {tab === "pedidos" && (
          <section>
            <div style={{ marginBottom: "1.5rem" }}>
              <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: C.text }}>Meus Pedidos</h1>
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
                      {/* Header */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                        <div>
                          <span style={{ fontWeight: 700, color: C.text, fontSize: "0.95rem", display: "block" }}>Pedido #{order.id}</span>
                          <span style={{ fontSize: "0.78rem", color: C.muted, marginTop: "0.1rem", display: "block" }}>{order.date}</span>
                        </div>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.3rem 0.75rem", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.5px", background: sc.bg, color: sc.color }}>
                          {STATUS_LABELS[order.status]}
                        </span>
                      </div>

                      {/* Itens */}
                      <div style={{ marginBottom: "0.75rem" }}>
                        {order.items.map(({ product, quantity }) => (
                          <div key={product.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: C.text, padding: "0.2rem 0" }}>
                            <span>{product.name} <span style={{ color: C.muted }}>x{quantity}</span></span>
                            <span>R$ {(product.price * quantity).toFixed(2).replace(".", ",")}</span>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.75rem", borderTop: `1px solid ${C.border}`, marginBottom: "1rem" }}>
                        <span style={{ fontSize: "0.78rem", color: C.muted }}>{order.address}</span>
                        <span style={{ fontWeight: 700, color: C.primary, fontSize: "1rem" }}>
                          R$ {order.total.toFixed(2).replace(".", ",")}
                        </span>
                      </div>

                      {/* Tracking */}
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {TRACK_STEPS.map((step, i) => {
                          const done = i <= stepIdx;
                          const isLast = i === TRACK_STEPS.length - 1;
                          return (
                            <div key={step} style={{ display: "flex", flex: isLast ? 0 : 1, alignItems: "center", flexDirection: "column", position: "relative" }}>
                              <div style={{
                                width: 13, height: 13, borderRadius: "50%", zIndex: 1,
                                background: done ? C.primary : C.border,
                                border: `2px solid ${done ? C.primary : C.border}`,
                              }} />
                              <span style={{ fontSize: "0.62rem", marginTop: "0.3rem", whiteSpace: "nowrap", color: done ? C.primary : C.muted, fontWeight: done ? 600 : 400 }}>
                                {STATUS_LABELS[step]}
                              </span>
                              {!isLast && (
                                <div style={{
                                  position: "absolute", top: 6, left: "50%", width: "100%", height: 2,
                                  background: done && i < stepIdx ? C.primary : C.border,
                                  zIndex: 0,
                                }} />
                              )}
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

        {/* ═══ ABA: FAVORITOS ═══ */}
        {tab === "favoritos" && (
          <section>
            <div style={{ marginBottom: "1.5rem" }}>
              <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: C.text }}>Favoritos</h1>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.83rem", color: C.muted }}>Produtos que você salvou</p>
            </div>

            {!user!.favorites || user!.favorites.length === 0 ? (
              <EmptyState icon="♡" title="Nenhum favorito ainda" text="Explore nossos produtos e salve os que você mais gostar." />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "1rem" }}>
                {user!.favorites.map(product => (
                  <div key={product.id} style={{
                    background: C.card, borderRadius: C.radius,
                    border: `1px solid ${C.border}`, overflow: "hidden",
                    boxShadow: C.shadow,
                    transition: "transform 0.2s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-3px)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    <div style={{ height: 130, background: C.primaryPale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem" }}>
                      🧴
                    </div>
                    <div style={{ padding: "0.85rem 1rem" }}>
                      <p style={{ margin: "0 0 0.15rem", fontSize: "0.875rem", fontWeight: 600, color: C.text }}>{product.name}</p>
                      <p style={{ margin: "0 0 0.35rem", fontSize: "0.72rem", color: C.muted, textTransform: "capitalize" }}>{product.category}</p>
                      <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: C.primary }}>
                        R$ {product.price.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ═══ ABA: CAPILAR ═══ */}
        {tab === "capilar" && (
          <section>
            <div style={{ marginBottom: "1.5rem" }}>
              <h1 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: C.text }}>Perfil Capilar</h1>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.83rem", color: C.muted }}>Suas preferências de cuidado com o cabelo</p>
            </div>

            {!user!.capilar ? (
              <EmptyState icon="🌿" title="Perfil capilar não preenchido" text="Faça nosso quiz para descobrir a rotina ideal para o seu cabelo." cta={{ href: "/quiz", label: "Fazer o quiz" }} />
            ) : (
              <div style={s.card}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  {[
                    ["Tipo de cabelo",    user!.capilar.tipo],
                    ["Preocupação",       user!.capilar.preocupacao],
                    ["Frequência de peia", user!.capilar.frequenciaPreia],
                    ["Estação crítica",   user!.capilar.estacaoCritica],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <span style={s.label}>{label}</span>
                      <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 500, color: C.text }}>{value}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: `1px solid ${C.border}` }}>
                  <Link href="/quiz" style={{
                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                    padding: "0.55rem 1.1rem", borderRadius: "9px",
                    border: `1.5px solid ${C.primary}`, background: "transparent",
                    color: C.primary, fontSize: "0.82rem", fontWeight: 600,
                    textDecoration: "none",
                  }}>
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

// ─── Empty State helper ───────────────────────────────────────────
function EmptyState({
  icon, title, text, cta,
}: {
  icon: string;
  title: string;
  text: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "4rem 2rem", textAlign: "center",
      background: C.card, borderRadius: C.radius,
      border: `1px solid ${C.border}`, boxShadow: C.shadow,
    }}>
      <span style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.4 }}>{icon}</span>
      <h3 style={{ margin: "0 0 0.4rem", fontSize: "1.05rem", fontWeight: 600, color: C.text }}>{title}</h3>
      <p style={{ margin: "0 0 1.5rem", fontSize: "0.875rem", color: C.muted }}>{text}</p>
      {cta && (
        <Link href={cta.href} style={{
          background: C.primary, color: "#fff",
          padding: "0.65rem 1.4rem", borderRadius: "9px",
          textDecoration: "none", fontWeight: 600, fontSize: "0.875rem",
        }}>
          {cta.label}
        </Link>
      )}
    </div>
  );
}