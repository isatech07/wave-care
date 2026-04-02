
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  Edit3
} from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  items: number;
  total: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

const orders: Order[] = [
  { id: '#1234', customer: 'Maria Silva', items: 3, total: 'R$ 189,90', status: 'pending', date: '2024-01-15' },
  { id: '#1235', customer: 'João Santos', items: 1, total: 'R$ 44,90', status: 'processing', date: '2024-01-14' },
  { id: '#1236', customer: 'Ana Costa', items: 5, total: 'R$ 299,90', status: 'shipped', date: '2024-01-13' },
];

const statusConfig = {
  pending: { label: 'Pendente', color: 'orange' },
  processing: { label: 'Processando', color: 'blue' },
  shipped: { label: 'Enviado', color: 'purple' },
  delivered: { label: 'Entregue', color: 'green' },
  cancelled: { label: 'Cancelado', color: 'red' },
};

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | Order['status']>('all');

  const filteredOrders = orders.filter(order => 
    filterStatus === 'all' || order.status === filterStatus
  );

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    // Simular update no backend
    console.log(`Atualizando pedido ${orderId} para ${newStatus}`);
  };

  return (
    <div className="admin-orders">
      <div className="orders-header">
        <h2>Gerenciar Pedidos</h2>
        <div className="orders-filters">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendente</option>
            <option value="processing">Processando</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregue</option>
            <option value="cancelled">Cancelado</option>
          </select>
        </div>
      </div>

      <div className="orders-grid">
        {filteredOrders.map((order) => (
          <motion.div
            key={order.id}
            className="order-card"
            whileHover={{ y: -2 }}
            onClick={() => setSelectedOrder(order)}
          >
            <div className="order-header">
              <span className="order-id">{order.id}</span>
              <span className={`order-status status-${order.status}`}>
                {statusConfig[order.status].label}
              </span>
            </div>
            <div className="order-details">
              <div>{order.customer}</div>
              <div>{order.items} itens - {order.total}</div>
              <div>{order.date}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal de detalhes do pedido */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="order-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              className="order-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Pedido {selectedOrder.id}</h3>
                <button onClick={() => setSelectedOrder(null)}>
                  <XCircle size={24} />
                </button>
              </div>
              
              <div className="modal-content">
                <div className="modal-section">
                  <h4>Cliente</h4>
                  <p>{selectedOrder.customer}</p>
                </div>
                
                <div className="modal-section">
                  <h4>Itens</h4>
                  <p>{selectedOrder.items} produtos</p>
                  <p><strong>Total: {selectedOrder.total}</strong></p>
                </div>
              </div>

              <div className="modal-actions">
                <select 
                  defaultValue={selectedOrder.status}
                  onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as any)}
                  className="status-select"
                >
                  <option value="pending">Pendente</option>
                  <option value="processing">Processando</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregue</option>
                  <option value="cancelled">Cancelado</option>
                </select>
                <button className="btn-save">Salvar Alterações</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}