"use client"

import "./navbar.css"
import { Search, ShoppingBag, User, Menu, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"

const estacoes = [
  { label: "Verão",     param: "verao" },
  { label: "Inverno",   param: "inverno" },
  { label: "Outono",    param: "outono" },
  { label: "Primavera", param: "primavera" },
]

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  const activeEstacao = searchParams.get("estacao")

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleEstacaoClick(param: string) {
    setDropdownOpen(false)
    // Se clicar na estação que já está ativa, fecha (remove o query param)
    if (activeEstacao === param) {
      router.push("/")
    } else {
      router.push(`/?estacao=${param}`)
    }
  }

  return (
    <header className="navbar">
      <div className="nav-container">

        <div className="logo">
          Wave <span>Care</span>
        </div>

        <nav className="nav-links">
          <Link href="/">Home</Link>

          <div className="dropdown-wrapper" ref={dropdownRef}>
            <button
              className={`dropdown-trigger ${activeEstacao ? "active" : ""}`}
              onClick={() => setDropdownOpen(prev => !prev)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              {activeEstacao
                ? estacoes.find(e => e.param === activeEstacao)?.label ?? "Estações"
                : "Estações"}
              <ChevronDown
                size={13}
                className={`dropdown-chevron ${dropdownOpen ? "open" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu" role="menu">
                {estacoes.map(({ label, param }) => (
                  <button
                    key={param}
                    role="menuitem"
                    className={`dropdown-item ${activeEstacao === param ? "dropdown-item--active" : ""}`}
                    onClick={() => handleEstacaoClick(param)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link href="/loja">Loja</Link>
          <Link href="/quiz">Quiz</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/comunidade">Comunidade</Link>
        </nav>

        <div className="nav-actions">
          <button aria-label="Buscar"><Search size={18} /></button>
          <button aria-label="Carrinho" className="cart-btn">
            <ShoppingBag size={18} />
            <span className="cart-badge">0</span>
          </button>
          <button aria-label="Conta"><User size={18} /></button>
          <button aria-label="Menu"><Menu size={18} /></button>
        </div>

      </div>
    </header>
  )
}