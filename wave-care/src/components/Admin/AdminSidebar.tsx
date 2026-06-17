"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  ShoppingCart, 
  Users, 
  Settings,
  BarChart3
} from 'lucide-react';

interface AdminSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '#dashboard' },
  { id: 'orders', label: 'Pedidos', icon: ShoppingCart, href: '#orders' },
  { id: 'products', label: 'Produtos', icon: Package, href: '#products' },
  { id: 'blogs', label: 'Blogs', icon: FileText, href: '#blogs' },
  { id: 'users', label: 'Usuários', icon: Users, href: '#users' },
  { id: 'analytics', label: 'Análises', icon: BarChart3, href: '#analytics' },
  { id: 'settings', label: 'Configurações', icon: Settings, href: '#settings' },
];

export default function AdminSidebar({ activeSection, setActiveSection }: AdminSidebarProps) {
  return (
    <motion.aside 
      className="admin-sidebar" 
      initial={{ x: -250 }} 
      animate={{ x: 0 }}
      style={{
        width: '250px',
        background: 'var(--loja-card-bg, #ffffff)',
        borderRight: '1px solid var(--loja-border, #ddd8d0)',
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 0',
        fontFamily: '"Poppins", "Jost", sans-serif',
      }}
    >
      <div 
        className="admin-sidebar-header"
        style={{
          padding: '0 1.5rem 1.5rem',
          borderBottom: '1px solid var(--loja-border, #ddd8d0)',
        }}
      >
        <h2 
          style={{
            fontFamily: '"Playfair Display", "Cormorant Garamond", serif',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--loja-text-primary, #1a1a1a)',
            margin: 0,
          }}
        >
          WaveCare Admin
        </h2>
      </div>
      
      <nav 
        className="admin-nav"
        style={{
          flex: 1,
          padding: '1rem 0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
        }}
      >
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            className={`admin-nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => setActiveSection(item.id as any)}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: activeSection === item.id ? 'var(--loja-accent-light, #e8f0ef)' : 'transparent',
              color: activeSection === item.id ? 'var(--loja-accent, #2c6e63)' : 'var(--loja-text-secondary, #5a5550)',
              cursor: 'pointer',
              width: '100%',
              fontFamily: '"Poppins", "Jost", sans-serif',
              fontSize: '0.875rem',
              fontWeight: activeSection === item.id ? 600 : 500,
              transition: 'all 0.2s ease',
            }}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </motion.button>
        ))}
      </nav>
    </motion.aside>
  );
}