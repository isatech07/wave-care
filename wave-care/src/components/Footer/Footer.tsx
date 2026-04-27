// Footer Component (Sem Ondas)
"use client";

import { useState } from "react";
import "./footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log("Inscrito com email:", email);
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-brand">
          <div className="footer-logo">
            Wave <em>Care</em>
          </div>
          <p>Cuidado capilar com ciência e natureza.</p>
        </div>

        {/* Links Section */}
        <div className="footer-links-section">
          <h3 className="footer-links-title">Explorar</h3>
          <div className="footer-links">
            <a href="/loja">Produtos</a>
            <a href="/loja">Kits</a>
            <a href="/blog">Blog</a>
            <a href="/quiz">Quiz Capilar</a>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="footer-newsletter">
          <h3 className="newsletter-title">Newsletter</h3>
          <p className="newsletter-text">
            Receba dicas exclusivas e ofertas especiais.
          </p>
          <form onSubmit={handleSubscribe} className="newsletter-form">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-button">
              {subscribed ? "✓ Inscrito!" : "Inscrever"}
            </button>
          </form>

          {/* Social Links */}
          <div className="footer-social">
            <a href="#" className="social-link" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
              </svg>
            </a>
            <a href="#" className="social-link" aria-label="TikTok">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="footer-divider"></div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>© 2025 Wave Care. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}