"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, MoreVertical, ChevronDown } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
}

const mockOrders: Order[] = [
  { id: '#ORD-001', customer: 'Ana Silva', date: '15/06/2026', total: 189.90, status: 'delivered', items: 3 },
  { id: '#ORD-002', customer: 'Carlos Santos', date: '14/06/2026', total: 129.90, status: 'shipped', items: 2 },
  { id: '#ORD-003', customer: 'Mariana Costa', date: '13/06/2026', total: 89.90, status: 'processing', items: 1 },
  { id: '#ORD-004', customer: 'Pedro Oliveira', date: '12/06/2026', total: 249.90, status: 'pending', items: 4 },
  { id: '#ORD-005', customer: 'Julia Ferreira', date: '11/06/2026', total: 54.90, status: 'cancelled', items: 1 },
];

const statusColors = {
  pending: { bg: '#fef3c7', text: '#92400e' },
  processing: { bg: '#dbeafe', text: '#1e40af' },
  shipped: { bg: '#ede9fe', text: '#5b21b6' },
  delivered: { bg: '#d1fae5', text: '#065f46' },
  cancelled: { bg: '#fee2e2', text: '#991b1b' },
};

const statusLabels = {
  pending: 'Pendente',
  processing: 'Processando',
  shipped: 'Enviado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div 
      className="admin-orders"
      style={{
        padding: '2rem',
        fontFamily: '"Poppins", "Jost", sans-serif',
      }}
    >
      <div 
        className="orders-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2 
            style={{
              fontFamily: '"Playfair Display", "Cormorant Garamond", serif',
              fontSize: '1.5rem',
              fontWeight: 600,
              color: 'var(--loja-text-primary, #1a1a1a)',
              margin: 0,
            }}
          >
            Pedidos
          </h2>
          <p 
            style={{
              fontSize: '0.875rem',
              color: 'var(--loja-text-muted, #9c9087)',
              margin: '0.25rem 0 0',
            }}
          >
            {filteredOrders.length} pedidos encontrados
          </p>
        </div>
        <div 
          className="orders-actions"
          style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
          }}
        >
          <div 
            className="search-wrapper"
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--loja-card-bg, #ffffff)',
              border: '1px solid var(--loja-border, #ddd8d0)',
              borderRadius: '8px',
              padding: '0 0.75rem',
              transition: 'border-color 0.2s ease',
            }}
          >
            <Search size={18} style={{ color: 'var(--loja-text-muted, #9c9087)' }} />
            <input
              type="text"
              placeholder="Buscar pedidos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                padding: '0.6rem 0.75rem',
                fontSize: '0.875rem',
                background: 'transparent',
                fontFamily: '"Poppins", "Jost", sans-serif',
                width: '200px',
                color: 'var(--loja-text-primary, #1a1a1a)',
              }}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '0.6rem 2rem 0.6rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--loja-border, #ddd8d0)',
              fontSize: '0.875rem',
              background: 'var(--loja-card-bg, #ffffff)',
              fontFamily: '"Poppins", "Jost", sans-serif',
              color: 'var(--loja-text-primary, #1a1a1a)',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239c9087' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
            }}
          >
            <option value="all">Todos os status</option>
            <option value="pending">Pendente</option>
            <option value="processing">Processando</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregue</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
      </div>

      <div 
        className="orders-table-wrapper"
        style={{
          background: 'var(--loja-card-bg, #ffffff)',
          borderRadius: '12px',
          border: '1px solid var(--loja-border, #ddd8d0)',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        }}
      >
        <table 
          className="orders-table"
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: '"Poppins", "Jost", sans-serif',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid var(--loja-border, #ddd8d0)' }}>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--loja-text-muted, #9c9087)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pedido</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--loja-text-muted, #9c9087)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cliente</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--loja-text-muted, #9c9087)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Data</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--loja-text-muted, #9c9087)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Itens</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--loja-text-muted, #9c9087)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--loja-text-muted, #9c9087)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: 600, color: 'var(--loja-text-muted, #9c9087)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{ borderBottom: '1px solid var(--loja-border, #ddd8d0)', transition: 'background 0.2s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--loja-bg, #f7f5f2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--loja-text-primary, #1a1a1a)' }}>
                  {order.id}
                </td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--loja-text-primary, #1a1a1a)' }}>
                  {order.customer}
                </td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--loja-text-secondary, #5a5550)' }}>
                  {order.date}
                </td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: 'var(--loja-text-secondary, #5a5550)' }}>
                  {order.items}
                </td>
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--loja-accent, #2c6e63)' }}>
                  R$ {order.total.toFixed(2).replace('.', ',')}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{
                    padding: '0.2rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    background: statusColors[order.status].bg,
                    color: statusColors[order.status].text,
                    display: 'inline-block',
                    textTransform: 'capitalize',
                  }}>
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                  <button
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid var(--loja-border, #ddd8d0)',
                      background: 'transparent',
                      color: 'var(--loja-text-secondary, #5a5550)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontFamily: '"Poppins", "Jost", sans-serif',
                      transition: 'all 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--loja-accent, #2c6e63)';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = 'var(--loja-accent, #2c6e63)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--loja-text-secondary, #5a5550)';
                      e.currentTarget.style.borderColor = 'var(--loja-border, #ddd8d0)';
                    }}
                  >
                    <Eye size={14} /> Ver
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}