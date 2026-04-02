// components/Admin/AdminDashboard.tsx
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Users, 
  Package, 
  DollarSign,
  TrendingUp
} from 'lucide-react';

const stats = [
  { label: 'Total de Pedidos', value: '1.234', change: '+12%', icon: ShoppingCart, color: '#10B981' },
  { label: 'Usuários Ativos', value: '2.456', change: '+8%', icon: Users, color: '#3B82F6' },
  { label: 'Produtos', value: '45', change: '+3%', icon: Package, color: '#F59E0B' },
  { label: 'Receita', value: 'R$ 45.678', change: '+25%', icon: DollarSign, color: '#EF4444' },
];

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-stats">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="stat-icon" style={{ backgroundColor: stat.color + '20' }}>
              <stat.icon size={24} style={{ color: stat.color }} />
            </div>
            <div className="stat-content">
              <span className="stat-label">{stat.label}</span>
              <div className="stat-value-group">
                <span className="stat-value">{stat.value}</span>
                <span className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <h3>Vendas do Mês</h3>
          <div className="chart-placeholder">
            <TrendingUp size={48} />
            <span>Gráfico de vendas (implementar com Chart.js)</span>
          </div>
        </div>
      </div>
    </div>
  );
}