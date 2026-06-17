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
    <div 
      className="admin-dashboard"
      style={{
        padding: '2rem',
        fontFamily: '"Poppins", "Jost", sans-serif',
      }}
    >
      <div 
        className="dashboard-stats"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            style={{
              background: 'var(--loja-card-bg, #ffffff)',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              border: '1px solid var(--loja-border, #ddd8d0)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div 
              className="stat-icon" 
              style={{ 
                backgroundColor: stat.color + '20',
                borderRadius: '10px',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <stat.icon size={24} style={{ color: stat.color }} />
            </div>
            <div className="stat-content">
              <span 
                className="stat-label"
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--loja-text-muted, #9c9087)',
                  fontWeight: 500,
                  display: 'block',
                }}
              >
                {stat.label}
              </span>
              <div 
                className="stat-value-group"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span 
                  className="stat-value"
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: 'var(--loja-text-primary, #1a1a1a)',
                    fontFamily: '"Playfair Display", "Cormorant Garamond", serif',
                  }}
                >
                  {stat.value}
                </span>
                <span 
                  className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: stat.change.startsWith('+') ? '#10B981' : '#EF4444',
                    background: stat.change.startsWith('+') ? '#10B98120' : '#EF444420',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '12px',
                  }}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="dashboard-charts">
        <div 
          className="chart-card"
          style={{
            background: 'var(--loja-card-bg, #ffffff)',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            border: '1px solid var(--loja-border, #ddd8d0)',
          }}
        >
          <h3 
            style={{
              fontFamily: '"Playfair Display", "Cormorant Garamond", serif',
              fontSize: '1.2rem',
              fontWeight: 600,
              color: 'var(--loja-text-primary, #1a1a1a)',
              margin: '0 0 1.5rem 0',
            }}
          >
            Vendas do Mês
          </h3>
          <div 
            className="chart-placeholder"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem 2rem',
              background: 'var(--loja-bg, #f7f5f2)',
              borderRadius: '8px',
              gap: '0.75rem',
              color: 'var(--loja-text-muted, #9c9087)',
            }}
          >
            <TrendingUp size={48} style={{ opacity: 0.4 }} />
            <span style={{ fontSize: '0.9rem', fontFamily: '"Poppins", "Jost", sans-serif' }}>
              Gráfico de vendas (implementar com Chart.js)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}