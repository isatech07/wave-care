"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import AdminProducts from "@/components/Admin/AdminProducts";
import { apiGetAllOrders, apiUpdateOrderStatus, apiDeleteOrder, apiGetAllUsers } from "@/lib/api";
import type { Order, OrderStatus, AdminUserListItem } from "@/lib/api";

// ============================================================
// TIPOS
// ============================================================

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

// ============================================================
// DADOS MOCK (BLOG, CHAT, PRODUTOS)
// ============================================================

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

// ============================================================
// CONFIGURAÇÃO DE STATUS DOS PEDIDOS
// ============================================================

const orderStatusMap: Record<OrderStatus, { label: string; bg: string; color: string; dot: string }> = {
  PENDING:   { label: "Aguardando",    bg: "#fef9ec", color: "#92400e", dot: "#f59e0b" },
  CONFIRMED: { label: "Confirmado",    bg: "#eff6ff", color: "#1e40af", dot: "#3b82f6" },
  SHIPPED:   { label: "Em transporte", bg: "#f5f3ff", color: "#5b21b6", dot: "#8b5cf6" },
  DELIVERED: { label: "Entregue",      bg: "#ecfdf5", color: "#065f46", dot: "#10b981" },
  CANCELLED: { label: "Cancelado",     bg: "#fef2f2", color: "#991b1b", dot: "#ef4444" },
};

// ============================================================
// UTILITÁRIOS
// ============================================================

const formatPrice = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("pt-BR");

// ============================================================
// ÍCONES SVG
// ============================================================

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
  AdminShield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  Refresh: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  ),
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function AdminPage() {
  const { user, isLoggedIn, logout } = useUser();
  const router = useRouter();

  // Navegação
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");

  // Pedidos (dados reais)
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "ALL">("ALL");

  // Usuários (dados reais)
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  // Dados mock
  const [products, setProducts] = useState<AdminProduct[]>(mockProducts);
  const [blogs, setBlogs] = useState<BlogPost[]>(mockBlogs);
  const [chats, setChats] = useState<ChatConversation[]>(mockChats);
  const [selectedChat, setSelectedChat] = useState<ChatConversation | null>(mockChats[0]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mapa de usuários para exibição nos pedidos
  const userMap = useMemo(() => {
    const map = new Map<number, { name: string; email: string }>();
    users.forEach(u => map.set(u.id, { name: u.name, email: u.email }));
    return map;
  }, [users]);

  // ============================================================
  // CARREGAMENTO DE DADOS
  // ============================================================

  async function loadOrders() {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const data = await apiGetAllOrders();
      setOrders(data);
    } catch (err: any) {
      setOrdersError(err.message || "Erro ao carregar pedidos");
    } finally {
      setOrdersLoading(false);
    }
  }

  async function loadUsers() {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const data = await apiGetAllUsers();
      setUsers(data);
    } catch (err: any) {
      setUsersError(err.message || "Erro ao carregar usuários");
    } finally {
      setUsersLoading(false);
    }
  }

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    } else {
      setIsLoading(false);
      loadOrders();
      loadUsers();
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages]);

  // ============================================================
  // AÇÕES DE PEDIDOS
  // ============================================================

  async function handleAdvanceOrder(orderId: number, next: OrderStatus) {
    try {
      const updated = await apiUpdateOrderStatus(orderId, next);
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
    } catch (err: any) {
      alert(err.message || "Erro ao atualizar pedido");
    }
  }

  async function handleCancelOrder(orderId: number) {
    if (!confirm("Tem certeza que deseja excluir este pedido? Essa ação não pode ser desfeita.")) return;
    try {
      await apiDeleteOrder(orderId);
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err: any) {
      alert(err.message || "Erro ao excluir pedido");
    }
  }

  // ============================================================
  // AÇÕES DE BLOG E CHAT (MOCK)
  // ============================================================

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
    const update = (c: ChatConversation) => c.id === selectedChat.id
      ? { ...c, messages: [...c.messages, msg], lastMessage: chatInput.trim(), unread: 0 }
      : c;
    setChats(prev => prev.map(update));
    setSelectedChat(prev => prev ? update(prev) : null);
    setChatInput("");
  }

  // ============================================================
  // ESTATÍSTICAS
  // ============================================================

  const filteredOrders = filterStatus === "ALL"
    ? orders
    : orders.filter(o => o.status === filterStatus);

  const totalRevenue = orders
    .filter(o => o.status !== "CANCELLED")
    .reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === "PENDING").length;
  const totalUnread = chats.reduce((s, c) => s + c.unread, 0);
  const openChats = chats.filter(c => c.status === "open").length;

  // ============================================================
  // NAVEGAÇÃO LATERAL
  // ============================================================

  const navItems: { id: AdminSection; label: string; Icon: () => JSX.Element; badge?: number }[] = [
    { id: "dashboard", label: "Dashboard", Icon: Icons.Dashboard },
    { id: "pedidos",   label: "Pedidos",   Icon: Icons.Package, badge: pendingOrders || undefined },
    { id: "produtos",  label: "Produtos",  Icon: Icons.Product },
    { id: "blog",      label: "Blog",      Icon: Icons.Blog },
    { id: "chat",      label: "Suporte",   Icon: Icons.Chat, badge: totalUnread || undefined },
    { id: "usuarios",  label: "Usuários",  Icon: Icons.Users },
  ];

  const sectionLabel: Record<AdminSection, string> = {
    dashboard: "Dashboard", pedidos: "Pedidos", produtos: "Produtos",
    blog: "Blog", chat: "Suporte ao Cliente", usuarios: "Usuários",
  };

  // ============================================================
  // RENDERIZAÇÃO
  // ============================================================

  if (isLoading) {
    return (
      <div className="loadingScreen">
        <div className="spinner" />
        <span>Carregando painel administrativo...</span>
      </div>
    );
  }

  return (
    <div className="adminContainer">
      {/* ============================================================ */}
      {/* SIDEBAR */}
      {/* ============================================================ */}
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

      {/* ============================================================ */}
      {/* CONTEÚDO PRINCIPAL */}
      {/* ============================================================ */}
      <main className="mainContent">
        {/* Cabeçalho */}
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

        <div className="contentArea">

          {/* ============================================================ */}
          {/* SEÇÃO: DASHBOARD */}
          {/* ============================================================ */}
          {activeSection === "dashboard" && (
            <div>
              <div className="statsGrid">
                <div className="statCard">
                  <div className="statCardHeader">
                    <span className="statLabel">Receita Total</span>
                    <div className="statIcon statIconGreen"><Icons.TrendingUp /></div>
                  </div>
                  <div className="statValue">{formatPrice(totalRevenue)}</div>
                </div>
                <div className="statCard">
                  <div className="statCardHeader">
                    <span className="statLabel">Pedidos Pendentes</span>
                    <div className="statIcon statIconOrange"><Icons.Package /></div>
                  </div>
                  <div className="statValue">{pendingOrders}</div>
                </div>
                <div className="statCard">
                  <div className="statCardHeader">
                    <span className="statLabel">Produtos Ativos</span>
                    <div className="statIcon statIconBlue"><Icons.Product /></div>
                  </div>
                  <div className="statValue">{products.filter(p => p.active).length}</div>
                </div>
                <div className="statCard">
                  <div className="statCardHeader">
                    <span className="statLabel">Chats Abertos</span>
                    <div className="statIcon statIconPurple"><Icons.Chat /></div>
                  </div>
                  <div className="statValue">{openChats}</div>
                </div>
              </div>

              <div className="dashboardGrid">
                {/* Pedidos Recentes */}
                <div className="recentCard">
                  <div className="cardHeader">
                    <h3>Pedidos Recentes</h3>
                    <button onClick={() => setActiveSection("pedidos")} className="linkButton">
                      Ver todos <Icons.ArrowRight />
                    </button>
                  </div>
                  <div className="recentList">
                    {ordersLoading ? (
                      <p style={{ padding: "1rem", color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
                        Carregando...
                      </p>
                    ) : orders.slice(0, 4).map(order => {
                      const st = orderStatusMap[order.status as OrderStatus] ?? orderStatusMap.PENDING;
                      const cliente = userMap.get(order.userId);
                      return (
                        <div key={order.id} className="recentItem">
                          <div className="recentItemInfo">
                            <div className="recentItemAvatar">
                              {cliente ? cliente.name.charAt(0).toUpperCase() : "?"}
                            </div>
                            <div>
                              <p className="recentItemName">
                                {cliente ? cliente.name : `Usuário #${order.userId}`}
                              </p>
                              <p className="recentItemDate">{formatDate(order.createdAt)}</p>
                            </div>
                          </div>
                          <div className="recentItemStatus">
                            <span className="statusBadge" style={{ background: st.bg, color: st.color }}>
                              <span className="statusDot" style={{ background: st.dot }} />
                              {st.label}
                            </span>
                            <p className="recentItemTotal">{formatPrice(order.total)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Suporte */}
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
                            {chat.unread > 0 && <span className="unreadBadge">{chat.unread}</span>}
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

          {/* ============================================================ */}
          {/* SEÇÃO: PEDIDOS */}
          {/* ============================================================ */}
          {activeSection === "pedidos" && (
            <div className="tableCard">
              <div className="tableHeader">
                <h3>Todos os Pedidos</h3>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value as OrderStatus | "ALL")}
                    className="filter-select"
                  >
                    <option value="ALL">Todos</option>
                    <option value="PENDING">Aguardando</option>
                    <option value="CONFIRMED">Confirmado</option>
                    <option value="SHIPPED">Enviado</option>
                    <option value="DELIVERED">Entregue</option>
                    <option value="CANCELLED">Cancelado</option>
                  </select>
                  <span className="tableCount">
                    {filteredOrders.length} pedido{filteredOrders.length !== 1 ? "s" : ""}
                    {filteredOrders.length !== orders.length && ` de ${orders.length}`}
                  </span>
                  <button onClick={loadOrders} className="actionBtnSecondary" title="Recarregar">
                    <Icons.Refresh />
                  </button>
                </div>
              </div>

              {ordersLoading ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                  Carregando pedidos...
                </div>
              ) : ordersError ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "#ef4444" }}>
                  {ordersError}
                  <br />
                  <button onClick={loadOrders} className="actionBtnPrimary" style={{ marginTop: "1rem" }}>
                    Tentar novamente
                  </button>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                  Nenhum pedido encontrado.
                </div>
              ) : (
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
                      {filteredOrders.map(order => {
                        const statusKey = order.status as OrderStatus;
                        const st = orderStatusMap[statusKey] ?? orderStatusMap.PENDING;
                        const cliente = userMap.get(order.userId);

                        return (
                          <tr key={order.id} className="tableRow">
                            <td className="orderId">
                              #{order.id}
                              <span className="orderDate">{formatDate(order.createdAt)}</span>
                            </td>
                            <td>
                              <div className="clientCell">
                                <div className="clientAvatar">
                                  {cliente
                                    ? cliente.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
                                    : "?"}
                                </div>
                                <div>
                                  <p className="clientName">
                                    {cliente ? cliente.name : `Usuário #${order.userId}`}
                                  </p>
                                  {cliente && (
                                    <p className="clientEmail">{cliente.email}</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="itemsCell">
                              <span className="itemsList">
                                {order.items.map(i => i.product?.name ?? `#${i.productId}`).join(", ")}
                              </span>
                            </td>
                            <td className="orderTotal">{formatPrice(order.total)}</td>
                            <td>
                              <select
                                value={statusKey}
                                onChange={async e => {
                                  const newStatus = e.target.value as OrderStatus;
                                  try {
                                    const updated = await apiUpdateOrderStatus(order.id, newStatus);
                                    setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
                                  } catch (err: any) {
                                    alert(err.message || "Erro ao atualizar status");
                                  }
                                }}
                                style={{
                                  background: st.bg,
                                  color: st.color,
                                  border: `1.5px solid ${st.dot}`,
                                  borderRadius: "20px",
                                  padding: "0.25rem 0.6rem",
                                  fontSize: "0.75rem",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                  outline: "none",
                                }}
                              >
                                <option value="PENDING">Aguardando</option>
                                <option value="CONFIRMED">Confirmado</option>
                                <option value="SHIPPED">Em transporte</option>
                                <option value="DELIVERED">Entregue</option>
                                <option value="CANCELLED">Cancelado</option>
                              </select>
                            </td>
                            <td>
                              <div className="actionButtons">
                                {statusKey !== "CANCELLED" && statusKey !== "DELIVERED" && (
                                  <button
                                    onClick={() => handleCancelOrder(order.id)}
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
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* SEÇÃO: PRODUTOS */}
          {/* ============================================================ */}
          {activeSection === "produtos" && <AdminProducts />}

          {/* ============================================================ */}
          {/* SEÇÃO: BLOG */}
          {/* ============================================================ */}
          {activeSection === "blog" && (
            <div>
              <div className="sectionHeader">
                <button className="primaryButton"><Icons.Plus /> Novo Artigo</button>
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
                        <span className="blogDate">{new Date(blog.date).toLocaleDateString("pt-BR")}</span>
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
                      <button className="actionBtnSecondary"><Icons.Edit /> Editar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SEÇÃO: CHAT / SUPORTE */}
          {/* ============================================================ */}
          {activeSection === "chat" && (
            <div className="chatContainer">
              <div className="chatSidebar">
                <div className="chatSidebarHeader"><h3>Conversas</h3></div>
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
                          {chat.unread > 0 && <span className="unreadBadgeSmall">{chat.unread}</span>}
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
                        <div className="chatWindowAvatar">{selectedChat.clientName[0]}</div>
                        <div>
                          <h4>{selectedChat.clientName}</h4>
                          <p>{selectedChat.clientEmail}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setChats(prev => prev.map(c =>
                          c.id === selectedChat.id ? { ...c, status: c.status === "open" ? "resolved" : "open" } : c
                        ))}
                        className={selectedChat.status === "open" ? "primaryButtonSmall" : "secondaryButtonSmall"}
                      >
                        {selectedChat.status === "open" ? <><Icons.Check /> Resolver</> : "Reabrir"}
                      </button>
                    </div>

                    <div className="chatMessages">
                      {selectedChat.messages.map(msg => (
                        <div key={msg.id} className={`message ${msg.from === "admin" ? "messageAdmin" : "messageClient"}`}>
                          {msg.from === "client" && (
                            <div className="messageAvatar">{selectedChat.clientName[0]}</div>
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
                  <div className="chatEmpty"><p>Selecione uma conversa para começar</p></div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* SEÇÃO: USUÁRIOS */}
          {/* ============================================================ */}
          {activeSection === "usuarios" && (
            <div className="tableCard">
              <div className="tableHeader">
                <h3>Todos os Usuários</h3>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <span className="tableCount">{users.length} usuário{users.length !== 1 ? "s" : ""}</span>
                  <button onClick={loadUsers} className="actionBtnSecondary" title="Recarregar">
                    <Icons.Refresh />
                  </button>
                </div>
              </div>

              {usersLoading ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                  Carregando usuários...
                </div>
              ) : usersError ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "#ef4444" }}>
                  {usersError}
                  <br />
                  <button onClick={loadUsers} className="actionBtnPrimary" style={{ marginTop: "1rem" }}>
                    Tentar novamente
                  </button>
                </div>
              ) : users.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                  Nenhum usuário encontrado.
                </div>
              ) : (
                <div className="tableWrapper">
                  <table className="dataTable">
                    <thead>
                      <tr>
                        <th>Usuário</th>
                        <th>E-mail</th>
                        <th>Telefone</th>
                        <th>Cidade</th>
                        <th>Função</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} className="tableRow">
                          <td>
                            <div className="clientCell">
                              <div className="clientAvatar">
                                {u.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="clientName">{u.name}</p>
                              </div>
                            </div>
                          </td>
                          <td>{u.email}</td>
                          <td>{u.telefone || "—"}</td>
                          <td>{u.cidade || "—"}</td>
                          <td>
                            <span
                              className="statusBadge"
                              style={
                                u.role === "admin"
                                  ? { background: "#fef3c7", color: "#92400e" }
                                  : { background: "#eff6ff", color: "#1e40af" }
                              }
                            >
                              {u.role === "admin" ? "Admin" : "Cliente"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}