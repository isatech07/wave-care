"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type AdminSection = "dashboard" | "pedidos" | "produtos" | "blog" | "chat" | "usuarios";

interface ChatMessage {
  id: string;
  from: "admin" | "client";
  text: string;
  time: string;
}

interface ChatConversation {
  id: string;
  clientName: string;
  clientEmail: string;
  lastMessage: string;
  unread: number;
  messages: ChatMessage[];
  status: "open" | "resolved";
}

interface AdminOrder {
  id: string;
  client: string;
  email: string;
  total: number;
  status: "aguardando" | "confirmado" | "enviado" | "entregue" | "cancelado";
  date: string;
  items: string[];
  address: string;
}

interface AdminProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  active: boolean;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  status: "rascunho" | "publicado";
  date: string;
  views: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockOrders: AdminOrder[] = [
  { id: "ord-001", client: "Ana Lima", email: "ana@email.com", total: 189.9, status: "aguardando", date: "2025-01-10", items: ["Shampoo Wave", "Condicionador Deep"], address: "Rua das Flores, 123 - SP" },
  { id: "ord-002", client: "Carlos Melo", email: "carlos@email.com", total: 95.0, status: "confirmado", date: "2025-01-09", items: ["Máscara Hidratante"], address: "Av. Paulista, 1000 - SP" },
  { id: "ord-003", client: "Beatriz Costa", email: "bia@email.com", total: 320.5, status: "enviado", date: "2025-01-08", items: ["Kit Verão", "Óleo Capilar"], address: "Rua do Comércio, 55 - RJ" },
  { id: "ord-004", client: "Diego Silva", email: "diego@email.com", total: 65.0, status: "entregue", date: "2025-01-05", items: ["Finalizador Wave"], address: "Rua Nova, 77 - MG" },
];

const mockProducts: AdminProduct[] = [
  { id: "p-001", name: "Shampoo Wave Care", price: 89.9, category: "Cabelos", stock: 42, active: true },
  { id: "p-002", name: "Condicionador Deep Moisture", price: 99.9, category: "Cabelos", stock: 5, active: true },
  { id: "p-003", name: "Máscara Hidratante Intensa", price: 149.9, category: "Tratamento", stock: 20, active: true },
  { id: "p-004", name: "Óleo Capilar Brilho", price: 75.0, category: "Finalizadores", stock: 0, active: false },
];

const mockBlogs: BlogPost[] = [
  { id: "b-001", title: "Como cuidar do cabelo no verão", excerpt: "Dicas essenciais para proteger os fios durante as estações mais quentes do ano.", status: "publicado", date: "2025-01-08", views: 1240 },
  { id: "b-002", title: "Rotina capilar para cabelos cacheados", excerpt: "Um guia completo para quem tem cachos e quer manter a definição e hidratação.", status: "publicado", date: "2025-01-03", views: 870 },
  { id: "b-003", title: "Novos produtos da linha Inverno", excerpt: "Conheça os lançamentos da coleção especial para os meses mais frios.", status: "rascunho", date: "2025-01-12", views: 0 },
];

const mockChats: ChatConversation[] = [
  {
    id: "chat-001", clientName: "Ana Lima", clientEmail: "ana@email.com",
    lastMessage: "Meu pedido está atrasado?", unread: 2, status: "open",
    messages: [
      { id: "m1", from: "client", text: "Olá! Fiz um pedido há 5 dias e ainda não recebi.", time: "10:30" },
      { id: "m2", from: "admin", text: "Olá Ana! Deixa eu verificar para você.", time: "10:35" },
      { id: "m3", from: "client", text: "Meu pedido está atrasado?", time: "10:40" },
    ],
  },
  {
    id: "chat-002", clientName: "Carlos Melo", clientEmail: "carlos@email.com",
    lastMessage: "Obrigado pelo suporte!", unread: 0, status: "resolved",
    messages: [
      { id: "m4", from: "client", text: "Gostaria de trocar um produto.", time: "09:00" },
      { id: "m5", from: "admin", text: "Claro! Me passa o número do pedido.", time: "09:05" },
      { id: "m6", from: "client", text: "Obrigado pelo suporte!", time: "09:20" },
    ],
  },
];

// ─── Configs ──────────────────────────────────────────────────────────────────

const orderStatusConfig = {
  aguardando: { label: "Aguardando", bg: "#fef9ec", color: "#92400e", dot: "#f59e0b" },
  confirmado: { label: "Confirmado", bg: "#eff6ff", color: "#1e40af", dot: "#3b82f6" },
  enviado:    { label: "Enviado",    bg: "#f5f3ff", color: "#5b21b6", dot: "#8b5cf6" },
  entregue:   { label: "Entregue",   bg: "#ecfdf5", color: "#065f46", dot: "#10b981" },
  cancelado:  { label: "Cancelado",  bg: "#fef2f2", color: "#991b1b", dot: "#ef4444" },
};

const nextStatus: Record<string, AdminOrder["status"]> = {
  aguardando: "confirmado",
  confirmado: "enviado",
  enviado:    "entregue",
};

// ─── Icons (SVG Components) ──────────────────────────────────────────────────

const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  Package: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
    </svg>
  ),
  Product: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  Blog: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  Chat: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Users: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Send: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Check: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Logout: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Eye: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  TrendingUp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Edit: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M17 3l4 4-7 7H10v-4l7-7z" />
      <path d="M4 20h16" />
    </svg>
  ),
  User: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),

  AdminBadge: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M12 2L3 7v7c0 5 9 8 9 8s9-3 9-8V7l-9-5z" />
      <path d="M12 8v4" />
      <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  
  AdminShield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  
  AdminCrown: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M2 19l2-12 4 4 4-6 4 6 4-4 2 12H2z" />
      <line x1="4" y1="19" x2="20" y2="19" />
    </svg>
  ),
};


// ─── Main Component ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const { user, isLoggedIn, logout } = useUser();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [orders, setOrders] = useState<AdminOrder[]>(mockOrders);
  const [products, setProducts] = useState<AdminProduct[]>(mockProducts);
  const [blogs, setBlogs] = useState<BlogPost[]>(mockBlogs);
  const [chats, setChats] = useState<ChatConversation[]>(mockChats);
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(mockChats[0]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages]);

  if (isLoading) {
    return (
      <div className="loadingScreen">
        <div className="spinner" />
        <span>Carregando painel administrativo...</span>
      </div>
    );
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  function advanceOrder(id: string) {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const next = nextStatus[o.status];
      return next ? { ...o, status: next } : o;
    }));
  }

  function cancelOrder(id: string) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "cancelado" } : o));
  }

  function toggleProduct(id: string) {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  }

  function toggleBlog(id: string) {
    setBlogs(prev => prev.map(b => b.id === id ? { ...b, status: b.status === "publicado" ? "rascunho" : "publicado" } : b));
  }

  function sendMessage() {
    if (!chatInput.trim() || !selectedChat) return;
    const msg: ChatMessage = {
      id: Date.now().toString(), from: "admin", text: chatInput.trim(),
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    const update = (c: ChatConversation) => c.id === selectedChat.id ? { ...c, messages: [...c.messages, msg], lastMessage: chatInput.trim(), unread: 0 } : c;
    setChats(prev => prev.map(update));
    setSelectedChat(prev => prev ? update(prev) : null);
    setChatInput("");
  }

  const totalRevenue = orders.filter(o => o.status !== "cancelado").reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === "aguardando").length;
  const totalUnread = chats.reduce((s, c) => s + c.unread, 0);
  const openChats = chats.filter(c => c.status === "open").length;

  // ── Nav items ─────────────────────────────────────────────────────────────
  const navItems: { id: AdminSection; label: string; Icon: () => JSX.Element; badge?: number }[] = [
    { id: "dashboard", label: "Dashboard",  Icon: Icons.Dashboard },
    { id: "pedidos",   label: "Pedidos",    Icon: Icons.Package,  badge: pendingOrders || undefined },
    { id: "produtos",  label: "Produtos",   Icon: Icons.Product },
    { id: "blog",      label: "Blog",       Icon: Icons.Blog },
    { id: "chat",      label: "Suporte",    Icon: Icons.Chat,     badge: totalUnread || undefined },
    { id: "usuarios",  label: "Usuários",   Icon: Icons.Users },
  ];

  const sectionLabel: Record<AdminSection, string> = {
    dashboard: "Dashboard", pedidos: "Pedidos", produtos: "Produtos",
    blog: "Blog", chat: "Suporte ao Cliente", usuarios: "Usuários",
  };

  return (
    <div className="adminContainer">
        {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebarHeader">
          <h1 className="logo">Wave Care</h1>
          <p className="logoSubtitle">Painel Administrativo</p>
        </div>

        <nav className="sidebarNav">
          {navItems.map(({ id, label, Icon, badge }) => {
            const active = activeSection === id;
            return (
              <button
                key={id}
                className={`navItem ${active ? "navItemActive" : ""}`}
                onClick={() => setActiveSection(id)}
              >
                <Icon />
                <span>{label}</span>
                {badge !== undefined && badge > 0 && (
                  <span className="navBadge">{badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebarFooter">
          <Link href="/perfil" className="footerLink">
            <Icons.User />
            <span>Meu Perfil</span>
          </Link>
          <button onClick={() => { logout(); router.push("/"); }} className="logoutButton">
            <Icons.Logout />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="mainContent">
        {/* Header */}
        <header className="header">
          <div className="headerTitle">
            <h1>{sectionLabel[activeSection]}</h1>
            <p>Wave Care · {user?.nome}</p>
          </div>
          <div className="headerActions">
            {totalUnread > 0 && (
              <button onClick={() => setActiveSection("chat")} className="unreadButton">
                <Icons.Chat />
                <span>{totalUnread} nova{totalUnread > 1 ? "s" : ""}</span>
              </button>
            )}
            <div className="userAvatar userAvatarAdmin">
              <Icons.AdminShield />
            </div>
          </div>
        </header>


        {/* Dynamic Content */}
        <div className="contentArea">
          {/* Dashboard */}
          {activeSection === "dashboard" && (
            <div>
              {/* Stats Grid */}
              <div className="statsGrid">
                <div className="statCard">
                  <div className="statCardHeader">
                    <span className="statLabel">Receita Total</span>
                    <div className="statIcon statIconGreen">
                      <Icons.TrendingUp />
                    </div>
                  </div>
                  <div className="statValue">
                    R$ {totalRevenue.toFixed(2).replace(".", ",")}
                  </div>
                </div>

                <div className="statCard">
                  <div className="statCardHeader">
                    <span className="statLabel">Pedidos Pendentes</span>
                    <div className="statIcon statIconOrange">
                      <Icons.Package />
                    </div>
                  </div>
                  <div className="statValue">{pendingOrders}</div>
                </div>

                <div className="statCard">
                  <div className="statCardHeader">
                    <span className="statLabel">Produtos Ativos</span>
                    <div className="statIcon statIconBlue">
                      <Icons.Product />
                    </div>
                  </div>
                  <div className="statValue">{products.filter(p => p.active).length}</div>
                </div>

                <div className="statCard">
                  <div className="statCardHeader">
                    <span className="statLabel">Chats Abertos</span>
                    <div className="statIcon statIconPurple">
                      <Icons.Chat />
                    </div>
                  </div>
                  <div className="statValue">{openChats}</div>
                </div>
              </div>

              {/* Recent Orders & Support */}
              <div className="dashboardGrid">
                <div className="recentCard">
                  <div className="cardHeader">
                    <h3>Pedidos Recentes</h3>
                    <button onClick={() => setActiveSection("pedidos")} className="linkButton">
                      Ver todos <Icons.ArrowRight />
                    </button>
                  </div>
                  <div className="recentList">
                    {orders.slice(0, 4).map(order => {
                      const st = orderStatusConfig[order.status];
                      return (
                        <div key={order.id} className="recentItem">
                          <div className="recentItemInfo">
                            <div className="recentItemAvatar">
                              {order.client.split(" ").map(w => w[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <p className="recentItemName">{order.client}</p>
                              <p className="recentItemDate">
                                {new Date(order.date).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                          </div>
                          <div className="recentItemStatus">
                            <span className="statusBadge" style={{ background: st.bg, color: st.color }}>
                              <span className="statusDot" style={{ background: st.dot }} />
                              {st.label}
                            </span>
                            <p className="recentItemTotal">
                              R$ {order.total.toFixed(2).replace(".", ",")}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="recentCard">
                  <div className="cardHeader">
                    <h3>Suporte ao Cliente</h3>
                    <button onClick={() => setActiveSection("chat")} className="linkButton">
                      Ver todos <Icons.ArrowRight />
                    </button>
                  </div>
                  <div className="recentList">
                    {chats.map(chat => (
                      <div
                        key={chat.id}
                        onClick={() => { setSelectedChat(chat); setActiveSection("chat"); }}
                        className="chatItem"
                      >
                        <div className={`chatAvatar ${chat.status === "open" ? "chatAvatarOpen" : ""}`}>
                          {chat.clientName[0]}
                        </div>
                        <div className="chatInfo">
                          <div className="chatHeader">
                            <span className="chatName">{chat.clientName}</span>
                            {chat.unread > 0 && (
                              <span className="unreadBadge">{chat.unread}</span>
                            )}
                          </div>
                          <p className="chatMessage">{chat.lastMessage}</p>
                          <span className={`chatStatus ${chat.status === "open" ? "chatStatusOpen" : "chatStatusResolved"}`}>
                            {chat.status === "open" ? "Aberto" : "Resolvido"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Section */}
          {activeSection === "pedidos" && (
            <div className="tableCard">
              <div className="tableHeader">
                <h3>Todos os Pedidos</h3>
                <span className="tableCount">{orders.length} pedidos</span>
              </div>
              <div className="tableWrapper">
                <table className="dataTable">
                  <thead>
                    <tr>
                      <th>Pedido</th>
                      <th>Cliente</th>
                      <th>Itens</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => {
                      const st = orderStatusConfig[order.status];
                      const can = nextStatus[order.status];
                      return (
                        <tr key={order.id} className="tableRow">
                          <td className="orderId">
                            #{order.id.slice(-4).toUpperCase()}
                            <span className="orderDate">
                              {new Date(order.date).toLocaleDateString("pt-BR")}
                            </span>
                          </td>
                          <td>
                            <div className="clientCell">
                              <div className="clientAvatar">
                                {order.client.split(" ").map(w => w[0]).join("").slice(0, 2)}
                              </div>
                              <div>
                                <p className="clientName">{order.client}</p>
                                <p className="clientEmail">{order.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="itemsCell">
                            <span className="itemsList">{order.items.join(", ")}</span>
                          </td>
                          <td className="orderTotal">
                            R$ {order.total.toFixed(2).replace(".", ",")}
                          </td>
                          <td>
                            <span className="statusBadge" style={{ background: st.bg, color: st.color }}>
                              <span className="statusDot" style={{ background: st.dot }} />
                              {st.label}
                            </span>
                          </td>
                          <td>
                            <div className="actionButtons">
                              {can && (
                                <button
                                  onClick={() => advanceOrder(order.id)}
                                  className="actionBtn actionBtnPrimary"
                                >
                                  <Icons.Check /> {orderStatusConfig[can].label}
                                </button>
                              )}
                              {order.status !== "cancelado" && order.status !== "entregue" && (
                                <button
                                  onClick={() => cancelOrder(order.id)}
                                  className="actionBtn actionBtnDanger"
                                >
                                  Cancelar
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Products Section */}
          {activeSection === "produtos" && (
            <div>
              <div className="sectionHeader">
                <button className="primaryButton">
                  <Icons.Plus /> Novo Produto
                </button>
              </div>
              <div className="tableCard">
                <div className="tableWrapper">
                  <table className="dataTable">
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th>Categoria</th>
                        <th>Preço</th>
                        <th>Estoque</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.id} className="tableRow">
                          <td className="productName">{p.name}</td>
                          <td>
                            <span className="categoryBadge">{p.category}</span>
                          </td>
                          <td className="productPrice">
                            R$ {p.price.toFixed(2).replace(".", ",")}
                          </td>
                          <td>
                            <span className={`stockValue ${p.stock === 0 ? "stockOut" : p.stock <= 10 ? "stockLow" : "stockOk"}`}>
                              {p.stock === 0 ? "Esgotado" : `${p.stock} un.`}
                            </span>
                          </td>
                          <td>
                            <span className={p.active ? "badgeActive" : "badgeInactive"}>
                              <span className="statusDot" style={{ background: p.active ? "#10b981" : "#ef4444" }} />
                              {p.active ? "Ativo" : "Inativo"}
                            </span>
                          </td>
                          <td>
                            <div className="actionButtons">
                              <button
                                onClick={() => toggleProduct(p.id)}
                                className={p.active ? "actionBtnDanger" : "actionBtnPrimary"}
                              >
                                {p.active ? "Desativar" : "Ativar"}
                              </button>
                              <button className="actionBtnSecondary">
                                <Icons.Edit /> Editar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Blog Section */}
          {activeSection === "blog" && (
            <div>
              <div className="sectionHeader">
                <button className="primaryButton">
                  <Icons.Plus /> Novo Artigo
                </button>
              </div>
              <div className="blogList">
                {blogs.map(blog => (
                  <div key={blog.id} className="blogCard">
                    <div className="blogIcon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 4h16v16H4z" />
                        <line x1="8" y1="8" x2="16" y2="8" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                        <line x1="8" y1="16" x2="12" y2="16" />
                      </svg>
                    </div>
                    <div className="blogContent">
                      <div className="blogMeta">
                        <span className={blog.status === "publicado" ? "badgePublished" : "badgeDraft"}>
                          {blog.status === "publicado" ? "Publicado" : "Rascunho"}
                        </span>
                        {blog.status === "publicado" && (
                          <span className="blogViews">
                            <Icons.Eye /> {blog.views.toLocaleString()} visualizações
                          </span>
                        )}
                        <span className="blogDate">
                          {new Date(blog.date).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <h4 className="blogTitle">{blog.title}</h4>
                      <p className="blogExcerpt">{blog.excerpt}</p>
                    </div>
                    <div className="blogActions">
                      <button
                        onClick={() => toggleBlog(blog.id)}
                        className={blog.status === "publicado" ? "actionBtnDanger" : "actionBtnPrimary"}
                      >
                        {blog.status === "publicado" ? "Despublicar" : "Publicar"}
                      </button>
                      <button className="actionBtnSecondary">
                        <Icons.Edit /> Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Section */}
          {activeSection === "chat" && (
            <div className="chatContainer">
              <div className="chatSidebar">
                <div className="chatSidebarHeader">
                  <h3>Conversas</h3>
                </div>
                <div className="chatList">
                  {chats.map(chat => (
                    <div
                      key={chat.id}
                      onClick={() => setSelectedChat(chat)}
                      className={`chatListItem ${selectedChat?.id === chat.id ? "chatListItemActive" : ""}`}
                    >
                      <div className={`chatListAvatar ${chat.status === "open" ? "chatAvatarOpen" : ""}`}>
                        {chat.clientName[0]}
                      </div>
                      <div className="chatListInfo">
                        <div className="chatListHeader">
                          <span className="chatListName">{chat.clientName}</span>
                          {chat.unread > 0 && (
                            <span className="unreadBadgeSmall">{chat.unread}</span>
                          )}
                        </div>
                        <p className="chatListMessage">{chat.lastMessage}</p>
                        <span className={`chatListStatus ${chat.status === "open" ? "chatStatusOpen" : "chatStatusResolved"}`}>
                          {chat.status === "open" ? "Aberto" : "Resolvido"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chatWindow">
                {selectedChat ? (
                  <>
                    <div className="chatWindowHeader">
                      <div className="chatWindowUser">
                        <div className="chatWindowAvatar">
                          {selectedChat.clientName[0]}
                        </div>
                        <div>
                          <h4>{selectedChat.clientName}</h4>
                          <p>{selectedChat.clientEmail}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setChats(prev => prev.map(c => c.id === selectedChat.id ? { ...c, status: c.status === "open" ? "resolved" : "open" } : c))}
                        className={selectedChat.status === "open" ? "primaryButtonSmall" : "secondaryButtonSmall"}
                      >
                        {selectedChat.status === "open" ? (
                          <><Icons.Check /> Resolver</>
                        ) : (
                          "Reabrir"
                        )}
                      </button>
                    </div>

                    <div className="chatMessages">
                      {selectedChat.messages.map(msg => (
                        <div
                          key={msg.id}
                          className={`message ${msg.from === "admin" ? "messageAdmin" : "messageClient"}`}
                        >
                          {msg.from === "client" && (
                            <div className="messageAvatar">
                              {selectedChat.clientName[0]}
                            </div>
                          )}
                          <div className="messageBubble">
                            <p>{msg.text}</p>
                            <span className="messageTime">{msg.time}</span>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    <div className="chatInputArea">
                      <input
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && sendMessage()}
                        placeholder="Digite sua mensagem..."
                        className="chatInput"
                      />
                      <button onClick={sendMessage} className="sendButton">
                        <Icons.Send /> Enviar
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="chatEmpty">
                    <p>Selecione uma conversa para começar</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Users Section */}
          {activeSection === "usuarios" && (
            <div className="emptyModule">
              <div className="emptyIcon">
                <Icons.Users />
              </div>
              <h3>Gestão de Usuários</h3>
              <p>Módulo em desenvolvimento</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}