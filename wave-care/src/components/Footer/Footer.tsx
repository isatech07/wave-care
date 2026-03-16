import "./footer.css"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-logo">Wave <em>Care</em></span>
          <p>Cuidado capilar com ciência e natureza.</p>
        </div>
        <div className="footer-links">
          <a href="/products">Produtos</a>
          <a href="/kits">Kits</a>
          <a href="/blog">Blog</a>
          <a href="/quiz">Quiz</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Wave Care. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}