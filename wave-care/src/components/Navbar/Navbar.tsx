import "./navbar.css"
import { Search, ShoppingBag, User, Menu } from "lucide-react"

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-container">

        <div className="logo">
          Wave <span>Care</span>
        </div>

        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/estacao">Estações</a>
          <a href="/loja">Loja</a>
          <a href="/quiz">Quiz</a>
          <a href="/blog">Blog</a>
          <a href="/comunidade">Comunidade</a>
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