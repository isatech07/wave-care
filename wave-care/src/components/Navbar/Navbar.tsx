"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Menu, X, ChevronDown } from "lucide-react";
import "./navbar.css";
import { useUser } from "@/contexts/UserContext";
import { AvatarDisplay } from "@/components/AvatarUpload/Avatarupload"; // 

const estacoes = [
  { label: "Verão",     param: "verao"     },
  { label: "Outono",    param: "outono"    },
  { label: "Inverno",   param: "inverno"   },
  { label: "Primavera", param: "primavera" },
];

const navLinks = [
  { href: "/",     label: "Home"         },
  { href: "/loja", label: "Loja"         },
  { href: "/quiz", label: "Quiz Capilar" },
  { href: "/blog", label: "Blog"         },
];

const searchData = [
  { id: "1", name: "Shampoo Brisa do Mar",       category: "Shampoo",  href: "/#produtos"        },
  { id: "2", name: "Máscara Nutri Oceano",        category: "Máscara",  href: "/#produtos"        },
  { id: "3", name: "Leave-in Proteção Litorânea", category: "Leave-in", href: "/#produtos"        },
  { id: "4", name: "Óleo Reparador Marítimo",     category: "Óleo",     href: "/#produtos"        },
  { id: "5", name: "Kit Verão Completo",          category: "Kit",      href: "/?estacao=verao"   },
  { id: "6", name: "Kit Inverno Nutritivo",       category: "Kit",      href: "/?estacao=inverno" },
  { id: "7", name: "Quiz Capilar",                category: "Página",   href: "/quiz"             },
];

export default function Navbar() {
  const { user, isLoggedIn } = useUser();

  // Fix de hydration — só renderiza estado real após montagem no cliente
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [isScrolled,       setIsScrolled]       = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeEstacao,    setActiveEstacao]    = useState<string | null>(null);
  const [dropdownOpen,     setDropdownOpen]     = useState(false);
  const [searchOpen,       setSearchOpen]       = useState(false);
  const [searchQuery,      setSearchQuery]      = useState("");
  const [searchResults,    setSearchResults]    = useState<typeof searchData>([]);

  const dropdownRef    = useRef<HTMLDivElement>(null);
  const searchRef      = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router         = useRouter();
  const pathname       = usePathname();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setActiveEstacao(params.get("estacao"));
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setSearchOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setDropdownOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  }, [pathname]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen((p) => !p); }
      if (e.key === "Escape") setSearchOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (!query.trim()) { setSearchResults([]); return; }
    setSearchResults(
      searchData.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, []);

  const handleSearchResultClick = (href: string) => {
    setSearchOpen(false); setSearchQuery(""); setSearchResults([]);
    router.push(href);
  };

  function handleEstacaoClick(param: string) {
    setDropdownOpen(false); setIsMobileMenuOpen(false);
    router.push(activeEstacao === param ? "/" : `/?estacao=${param}`);
  }

  function isActive(href: string) {
    if (href === "/") return pathname === href && !activeEstacao;
    return pathname.startsWith(href);
  }

  const loggedIn = mounted && isLoggedIn;

  function handleProfileClick() {
    router.push(loggedIn ? "/perfil" : "/auth");
  }

  return (
    <>
      <motion.header
        className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <nav className="navbar-container">

          {/* Logo */}
          <Link href="/" className="navbar-logo" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="navbar-logo-text">Wave<span>Care</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-desktop">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`navbar-link ${isActive(href) ? "navbar-link--active" : ""}`}
              >
                {label}
              </Link>
            ))}

            {/* Estações Dropdown */}
            <div className="navbar-dropdown" ref={dropdownRef}>
              <button
                className={`navbar-link navbar-dropdown-trigger ${activeEstacao ? "navbar-link--active" : ""}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span>Estações</span>
                <ChevronDown
                  size={14}
                  className={`dropdown-chevron ${dropdownOpen ? "dropdown-chevron--open" : ""}`}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    className="navbar-dropdown-menu"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {estacoes.map(({ label, param }) => (
                      <button
                        key={param}
                        className={`navbar-dropdown-item ${activeEstacao === param ? "navbar-dropdown-item--active" : ""}`}
                        onClick={() => handleEstacaoClick(param)}
                      >
                        {label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Actions */}
          <div className="navbar-actions">

            {/* Search */}
            <div className="navbar-search-wrapper" ref={searchRef}>
              <button
                className={`navbar-action ${searchOpen ? "navbar-action--active" : ""}`}
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Buscar"
              >
                <Search size={18} />
              </button>

              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    className="navbar-search-panel"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="navbar-search-input-wrapper">
                      <Search size={18} className="navbar-search-icon" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        className="navbar-search-input"
                        placeholder="Buscar produtos, kits..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                      <span className="navbar-search-shortcut">ESC</span>
                    </div>

                    {searchResults.length > 0 && (
                      <ul className="navbar-search-results">
                        {searchResults.map((result) => (
                          <li key={result.id}>
                            <button
                              className="navbar-search-result-item"
                              onClick={() => handleSearchResultClick(result.href)}
                            >
                              <Search size={14} className="result-icon" />
                              <div className="result-content">
                                <span className="result-name">{result.name}</span>
                                <span className="result-category">{result.category}</span>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    {searchQuery && searchResults.length === 0 && (
                      <div className="navbar-search-empty">
                        <p>Nenhum resultado encontrado</p>
                        <span>Tente buscar por outro termo</span>
                      </div>
                    )}

                    {!searchQuery && (
                      <div className="navbar-search-suggestions">
                        <span className="suggestions-title">Sugestões</span>
                        <div className="suggestions-tags">
                          <button onClick={() => handleSearch("shampoo")}>Shampoo</button>
                          <button onClick={() => handleSearch("máscara")}>Máscara</button>
                          <button onClick={() => handleSearch("kit")}>Kits</button>
                          <button onClick={() => handleSearch("óleo")}>Óleos</button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ─── Botão de perfil ──────────────────────────────────────
                Antes: mostrava letra inicial (userInitial)
                Agora: usa <AvatarDisplay> — foto ou initials automático  */}
            <button
              className="navbar-action navbar-profile-btn"
              onClick={handleProfileClick}
              aria-label={loggedIn ? "Minha conta" : "Entrar"}
              style={{ padding: loggedIn && mounted ? "2px" : undefined }}
            >
              {mounted && loggedIn ? (
                <AvatarDisplay size={30} />
              ) : (
                <User size={18} />
              )}
            </button>

            <button
              className="navbar-mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="navbar-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="navbar-mobile-backdrop" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              className="navbar-mobile-content"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30 }}
            >
              <div className="navbar-mobile-header">
                <span className="navbar-mobile-title">Menu</span>
                <button className="navbar-mobile-close" onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              {/* Avatar no mobile menu */}
              {mounted && loggedIn && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1.25rem", borderBottom: "1px solid #e5e7eb" }}>
                  <AvatarDisplay size={40} />
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem" }}>{user?.nome}</p>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280" }}>{user?.email}</p>
                  </div>
                </div>
              )}

              {/* Mobile Search */}
              <div className="navbar-mobile-search">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {searchResults.length > 0 && (
                <ul className="navbar-mobile-search-results">
                  {searchResults.map((result) => (
                    <li key={result.id}>
                      <button
                        className="navbar-mobile-search-result"
                        onClick={() => { handleSearchResultClick(result.href); setIsMobileMenuOpen(false); }}
                      >
                        <span>{result.name}</span>
                        <span className="result-cat">{result.category}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <nav className="navbar-mobile-nav">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`navbar-mobile-link ${isActive(href) ? "navbar-mobile-link--active" : ""}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))}

                <div className="navbar-mobile-divider" />
                <span className="navbar-mobile-section">Estações</span>

                {estacoes.map(({ label, param }) => (
                  <button
                    key={param}
                    className={`navbar-mobile-link ${activeEstacao === param ? "navbar-mobile-link--active" : ""}`}
                    onClick={() => handleEstacaoClick(param)}
                  >
                    {label}
                  </button>
                ))}

                <div className="navbar-mobile-divider" />

                <button
                  className="navbar-mobile-link"
                  onClick={() => { setIsMobileMenuOpen(false); router.push(loggedIn ? "/perfil" : "/auth"); }}
                >
                  {loggedIn ? "Minha conta" : "Entrar / Cadastrar"}
                </button>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}