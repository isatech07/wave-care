
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
    <motion.aside className="admin-sidebar" initial={{ x: -250 }} animate={{ x: 0 }}>
      <div className="admin-sidebar-header">
        <h2>WaveCare Admin</h2>
      </div>
      
      <nav className="admin-nav">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            className={`admin-nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => setActiveSection(item.id as any)}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </motion.button>
        ))}
      </nav>
    </motion.aside>
  );
}