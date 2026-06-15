
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, RefreshCw, Loader2 } from 'lucide-react';
import { apiGetAllOrders, apiUpdateOrderStatus, apiDeleteOrder } from '@/lib/api';
import type { Order, OrderStatus } from '@/lib/api';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:   { label: 'Pendente',      color: '#92400e', bg: '#fef3c7' },
  CONFIRMED: { label: 'Confirmado',    color: '#065f46', bg: '#d1fae5' },
  SHIPPED:   { label: 'Em transporte', color: '#1e40af', bg: '#dbeafe' },
  DELIVERED: { label: 'Entregue',      color: '#3b0764', bg: '#f3e8ff' },
  CANCELLED: { label: 'Cancelado',     color: '#991b1b', bg: '#fee2e2' },
};

const formatPrice = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatDate = (d: string) =>
  new Date(d).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | OrderStatus>('all');
  const [newStatus, setNewStatus] = useState<OrderStatus>('PENDING');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function loadOrders() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGetAllOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders.filter(order =>
    filterStatus === 'all' || order.status === filterStatus
  );

  function openModal(order: Order) {
    setSelectedOrder(order);
    setNewStatus(order.status);
  }

  async function handleUpdateStatus() {
    if (!selectedOrder) return;
    setSaving(true);
    try {
      const updated = await apiUpdateOrderStatus(selectedOrder.id, newStatus);
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
      setSelectedOrder(updated);
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar status');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) return;
    setDeleting(true);
    try {
      await apiDeleteOrder(id);
      setOrders(prev => prev.filter(o => o.id !== id));
      setSelectedOrder(null);
    } catch (err: any) {
      alert(err.message || 'Erro ao deletar pedido');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="admin-orders">
      <div className="orders-header">
        <div>
          <h2>Gerenciar Pedidos</h2>
          <p>{filteredOrders.length} pedido{filteredOrders.length !== 1 ? 's' : ''}
            {filteredOrders.length !== orders.length && ` de ${orders.length}`}
          </p>
        </div>
        <div className="orders-filters">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">Todos</option>
            <option value="PENDING">Pendente</option>
            <option value="CONFIRMED">Confirmado</option>
            <option value="SHIPPED">Em transporte</option>
            <option value="DELIVERED">Entregue</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
          <button className="refresh-btn" onClick={loadOrders} title="Recarregar">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="orders-loading">
          <Loader2 size={32} className="spin" />
          <p>Carregando pedidos...</p>
        </div>
      ) : error ? (
        <div className="orders-error">
          <p>{error}</p>
          <button onClick={loadOrders} className="btn-primary">Tentar novamente</button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="orders-empty">
          <p>Nenhum pedido encontrado.</p>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => {
            const meta = statusConfig[order.status] ?? statusConfig.PENDING;
            return (
              <motion.div
                key={order.id}
                className="order-card"
                whileHover={{ y: -2 }}
                onClick={() => openModal(order)}
              >
                <div className="order-card-header">
                  <span className="order-id">Pedido #{order.id}</span>
                  <span
                    className="order-status-badge"
                    style={{ color: meta.color, background: meta.bg }}
                  >
                    {meta.label}
                  </span>
                </div>
                <div className="order-card-body">
                  <div className="order-info-row">
                    <span className="order-info-label">Usuário</span>
                    <span>#{order.userId}</span>
                  </div>
                  <div className="order-info-row">
                    <span className="order-info-label">Itens</span>
                    <span>{order.items.length} produto{order.items.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="order-info-row">
                    <span className="order-info-label">Total</span>
                    <span className="order-total">{formatPrice(order.total)}</span>
                  </div>
                  <div className="order-info-row">
                    <span className="order-info-label">Data</span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal de detalhes */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Pedido #{selectedOrder.id}</h3>
                <button onClick={() => setSelectedOrder(null)}>✕</button>
              </div>

              <div className="order-modal-body">
                {/* Info */}
                <div className="order-modal-info">
                  <div className="stat-item"><span>Usuário: #{selectedOrder.userId}</span></div>
                  <div className="stat-item"><span>Data: {formatDate(selectedOrder.createdAt)}</span></div>
                  <div className="stat-item">
                    <span>Status atual: </span>
                    <span style={{
                      color: statusConfig[selectedOrder.status]?.color,
                      fontWeight: 700,
                    }}>
                      {statusConfig[selectedOrder.status]?.label}
                    </span>
                  </div>
                </div>

                {/* Itens */}
                <div className="order-modal-items">
                  <h4>Itens do pedido</h4>
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="order-item-row">
                      <span className="order-item-name">
                        {item.product?.name ?? `Produto #${item.productId}`} x{item.quantity}
                      </span>
                      <span className="order-item-price">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="order-item-total">
                    <span>Total</span>
                    <span>{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>

                {/* Atualizar status */}
                <div className="order-modal-actions">
                  <label className="form-group">
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                      Atualizar status
                    </span>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                      className="filter-select"
                    >
                      <option value="PENDING">Pendente</option>
                      <option value="CONFIRMED">Confirmado</option>
                      <option value="SHIPPED">Em transporte</option>
                      <option value="DELIVERED">Entregue</option>
                      <option value="CANCELLED">Cancelado</option>
                    </select>
                  </label>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      className="btn-primary"
                      onClick={handleUpdateStatus}
                      disabled={saving || newStatus === selectedOrder.status}
                    >
                      {saving ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(selectedOrder.id)}
                      disabled={deleting}
                      style={{ padding: '0 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                      {deleting ? 'Deletando...' : 'Deletar pedido'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
