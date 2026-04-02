// components/Admin/AdminProducts.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Tag, 
  Image as ImageIcon,
  DollarSign,
  Star
} from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  status: 'active' | 'inactive' | 'out-of-stock';
  rating: number;
  sales: number;
}

const products: Product[] = [
  {
    id: '1',
    name: 'SunShield Shampoo',
    description: 'Limpeza suave com proteção UV',
    price: 29.90,
    originalPrice: 39.90,
    image: '/products/verao-produtos/verão-shampoo.png',
    category: 'Shampoo',
    stock: 127,
    status: 'active',
    rating: 4.8,
    sales: 234
  },
  {
    id: '2',
    name: 'Autumn Repair Mask',
    description: 'Tratamento intensivo reparador',
    price: 44.90,
    image: '/products/outono-produtos/outono-mascara.png',
    category: 'Máscara',
    stock: 89,
    status: 'active',
    rating: 4.9,
    sales: 312
  },
  {
    id: '3',
    name: 'Winter Leave-in',
    description: 'Proteção contra frio e vento',
    price: 32.90,
    image: '/products/inverno-produtos/inverno-creme.png',
    category: 'Leave-in',
    stock: 0,
    status: 'out-of-stock',
    rating: 4.7,
    sales: 189
  },
  {
    id: '4',
    name: 'Primavera Gelatin',
    description: 'Modelagem natural para cachos',
    price: 38.90,
    image: '/products/primavera-produtos/primavera-gelatina.png',
    category: 'Gelatina',
    stock: 45,
    status: 'inactive',
    rating: 4.6,
    sales: 67
  }
];

const categories = ['Shampoo', 'Máscara', 'Leave-in', 'Gelatina', 'Óleo', 'Kit'];
const statusConfig = {
  active: { label: 'Ativo', color: 'green' },
  inactive: { label: 'Inativo', color: 'gray' },
  'out-of-stock': { label: 'Sem estoque', color: 'red' }
};

export default function AdminProducts() {
  const [productsList, setProductsList] = useState(products);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
    category: '',
    stock: ''
  });
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = productsList.filter(product => {
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleStatusChange = (productId: string, newStatus: Product['status']) => {
    setProductsList(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, status: newStatus }
          : product
      )
    );
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    setProductsList(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, stock: newStock, status: newStock > 0 ? 'active' : 'out-of-stock' }
          : product
      )
    );
  };

  const handleDelete = (productId: string) => {
    setProductsList(prev => prev.filter(product => product.id !== productId));
    setSelectedProduct(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : undefined,
      image: newProduct.image || '/default-product.jpg',
      category: newProduct.category,
      stock: parseInt(newProduct.stock),
      status: parseInt(newProduct.stock) > 0 ? 'active' : 'out-of-stock',
      rating: 0,
      sales: 0
    };
    
    setProductsList([product, ...productsList]);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      originalPrice: '',
      image: '',
      category: '',
      stock: ''
    });
    setIsCreating(false);
  };

  return (
    <div className="admin-products">
      <div className="products-header">
        <div>
          <h2>Gerenciar Produtos</h2>
          <p>{filteredProducts.length} produtos {filteredProducts.length !== productsList.length && `de ${productsList.length}`}</p>
        </div>
        
        <div className="header-actions">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todas categorias</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">Todos status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
            <option value="out-of-stock">Sem estoque</option>
          </select>
          
          <button 
            className="create-product-btn"
            onClick={() => setIsCreating(true)}
          >
            <Plus size={20} />
            Novo Produto
          </button>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            className="product-card-admin"
            whileHover={{ y: -4 }}
            onClick={() => setSelectedProduct(product)}
          >
            <div className="product-image-wrapper">
              <Image
                src={product.image}
                alt={product.name}
                width={120}
                height={120}
                className="product-image-admin"
              />
              <span className={`product-status status-${product.status}`}>
                {statusConfig[product.status].label}
              </span>
            </div>
            
            <div className="product-info-admin">
              <h3 className="product-name-admin">{product.name}</h3>
              <div className="product-category">
                <Tag size={14} />
                <span>{product.category}</span>
              </div>
              
              <div className="product-price-admin">
                <span className="price-current">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="price-original">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              
              <div className="product-stats">
                <div className="stat-item">
                  <span>Estoque: {product.stock}</span>
                </div>
                <div className="stat-item">
                  <Star size={14} fill="currentColor" />
                  <span>{product.rating}</span>
                </div>
                <div className="stat-item">
                  <span>{product.sales} vendas</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Novo Produto */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCreating(false)}
          >
            <motion.div
              className="modal-content create-modal"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3><Plus size={24} /> Novo Produto</h3>
                <button onClick={() => setIsCreating(false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="create-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nome *</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Categoria *</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      required
                    >
                      <option value="">Selecione...</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Descrição</label>
                  <textarea
                    rows={3}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Preço (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Preço Antigo (opcional)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.originalPrice}
                      onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Estoque *</label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Imagem (URL)</label>
                    <input
                      type="url"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                      placeholder="https://exemplo.com/produto.jpg"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary">
                  Criar Produto
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Detalhes Produto */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>{selectedProduct.name}</h3>
                <div className="modal-actions">
                  <select 
                    value={selectedProduct.status}
                    onChange={(e) => handleStatusChange(selectedProduct.id, e.target.value as any)}
                    className="status-select"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="out-of-stock">Sem estoque</option>
                  </select>
                  <input
                    type="number"
                    value={selectedProduct.stock}
                    onChange={(e) => handleStockUpdate(selectedProduct.id, parseInt(e.target.value))}
                    className="stock-input"
                    min="0"
                  />
                  <button className="btn-edit">
                    <Edit3 size={18} />
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(selectedProduct.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="modal-body">
                <div className="product-detail-image">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    width={400}
                    height={400}
                    className="product-detail-img"
                  />
                </div>
                
                <div className="product-detail-info">
                  <div className="product-prices">
                    <span className="price-current-large">{formatPrice(selectedProduct.price)}</span>
                    {selectedProduct.originalPrice && (
                      <span className="price-original-large">{formatPrice(selectedProduct.originalPrice)}</span>
                    )}
                  </div>
                  
                  <div className="product-stats-large">
                    <div className="stat-item">
                      <span>Categoria: {selectedProduct.category}</span>
                    </div>
                    <div className="stat-item">
                      <span>Estoque: {selectedProduct.stock}</span>
                    </div>
                    <div className="stat-item">
                      <Star size={18} fill="currentColor" />
                      <span>{selectedProduct.rating} ( {selectedProduct.sales} vendas )</span>
                    </div>
                  </div>
                  
                  <p className="product-description-large">{selectedProduct.description}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}