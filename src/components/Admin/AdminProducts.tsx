"use client";

import { useState, useEffect } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, Tag } from "lucide-react";
import Image from "next/image";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  season: string;
  stock: number;
}

type ProductForm = {
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  season: string;
  stock: string;
};

const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
  season: "",
  stock: "",
};

const categories = ["Shampoo", "Máscara", "Leave-in", "Gelatina", "Óleo", "Kit"];
const seasons = ["verão", "outono", "inverno", "primavera"];

interface FormFieldsProps {
  form: ProductForm;
  setForm: (f: ProductForm) => void;
  error: string | null;
}

function ProductFormFields({ form, setForm, error }: FormFieldsProps) {
  return (
    <>
      <div className="form-row">
        <div className="form-group">
          <label>Nome *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Categoria *</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          >
            <option value="">Selecione...</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Estação *</label>
          <select
            value={form.season}
            onChange={(e) => setForm({ ...form, season: e.target.value })}
            required
          >
            <option value="">Selecione...</option>
            {seasons.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Estoque *</label>
          <input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="form-group">
        <label>Descrição</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Preço (R$) *</label>
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Imagem</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onloadend = () => {
                setForm({ ...form, image: reader.result as string });
              };
              reader.readAsDataURL(file);
            }}
          />
          {form.image && (
            <div style={{
              width: 80,
              height: 80,
              borderRadius: 8,
              marginTop: 8,
              overflow: "hidden",
              position: "relative",
              background: "linear-gradient(145deg, #ede9e4 0%, #ddd8d0 100%)",
            }}>
              <img
                src={form.image}
                alt="preview"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          )}
        </div>
      </div>
      {error && (
        <p style={{ color: "var(--color-danger)", fontSize: "0.8rem" }}>{error}</p>
      )}
    </>
  );
}

export default function AdminProducts() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProductsList(data as Product[]);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    }
  }

  const filteredProducts = productsList.filter((p) => {
    const matchesCategory = filterCategory === "all" || p.category === filterCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const created = await createProduct({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        image: form.image || "/default-product.jpg",
        category: form.category,
        season: form.season,
        stock: parseInt(form.stock),
      });
      setProductsList([created as Product, ...productsList]);
      setForm(emptyForm);
      setIsCreating(false);
    } catch (err: any) {
      setError(err.message || "Erro ao criar produto");
    } finally {
      setLoading(false);
    }
  }

  function openEdit(product: Product) {
    setSelectedProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      image: product.image || "",
      category: product.category,
      season: product.season,
      stock: String(product.stock),
    });
    setIsEditing(true);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await updateProduct(selectedProduct.id, {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        image: form.image || "/default-product.jpg",
        category: form.category,
        season: form.season,
        stock: parseInt(form.stock),
      });
      setProductsList((prev) =>
        prev.map((p) => (p.id === selectedProduct.id ? (updated as Product) : p))
      );
      setIsEditing(false);
      setSelectedProduct(null);
      setForm(emptyForm);
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar produto");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await deleteProduct(id);
      setProductsList((prev) => prev.filter((p) => p.id !== id));
      setSelectedProduct(null);
    } catch (err: any) {
      alert(err.message || "Erro ao deletar produto");
    }
  }

  return (
    <div className="admin-products">
      <div className="products-header">
        <div>
          <h2>Gerenciar Produtos</h2>
          <p>
            {filteredProducts.length} produtos
            {filteredProducts.length !== productsList.length &&
              ` de ${productsList.length}`}
          </p>
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
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            className="create-product-btn"
            onClick={() => {
              setForm(emptyForm);
              setError(null);
              setIsCreating(true);
            }}
          >
            <Plus size={20} /> Novo Produto
          </button>
        </div>
      </div>

      {/* ── Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 20,
        }}
      >
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            onHoverStart={() => setHoveredId(product.id)}
            onHoverEnd={() => setHoveredId(null)}
            whileHover={{ y: -4 }}
            style={{
              background: "#ffffff",
              borderRadius: 12,
              overflow: "hidden",
              cursor: "pointer",
              boxShadow: hoveredId === product.id
                ? "0 12px 32px rgba(0,0,0,0.12)"
                : "0 2px 8px rgba(0,0,0,0.06)",
              transition: "box-shadow 0.3s ease",
            }}
          >
            {/* Área da imagem — ocupa o card inteiro, sem padding, cover */}
            <div
              style={{
                width: "100%",
                aspectRatio: "1",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Image
                src={product.image || "/default-product.jpg"}
                alt={product.name}
                fill
                style={{
                  objectFit: "cover",
                  transition: "transform 0.5s ease",
                  transform: hoveredId === product.id ? "scale(1.05)" : "scale(1)",
                }}
              />
              {/* Badge estação */}
              <span
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  fontSize: 9,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  background: "#2c6e63",
                  color: "#fff",
                  padding: "4px 10px",
                  borderRadius: 4,
                  fontWeight: 700,
                  zIndex: 2,
                }}
              >
                {product.season}
              </span>
            </div>

            {/* Info */}
            <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
              {/* Categoria */}
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Tag size={12} color="#2c6e63" />
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    color: "#2c6e63",
                  }}
                >
                  {product.category}
                </span>
              </div>

              {/* Nome */}
              <h3
                style={{
                  fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {product.name}
              </h3>

              {/* Rodapé: preço + estoque */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 8,
                  borderTop: "1px solid #ddd8d0",
                  marginTop: 2,
                }}
              >
                <span style={{ fontSize: "1rem", fontWeight: 700, color: "#1a1a1a" }}>
                  {formatPrice(product.price)}
                </span>
                <span style={{ fontSize: "0.78rem", color: "#9c9087" }}>
                  Est.: {product.stock}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Criar */}
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
                <button onClick={() => setIsCreating(false)}>✕</button>
              </div>
              <form onSubmit={handleCreate} className="create-form">
                <ProductFormFields form={form} setForm={setForm} error={error} />
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Criando..." : "Criar Produto"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Editar */}
      <AnimatePresence>
        {isEditing && selectedProduct && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsEditing(false)}
          >
            <motion.div
              className="modal-content create-modal"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3><Edit3 size={24} /> Editar Produto</h3>
                <button onClick={() => { setIsEditing(false); setError(null); }}>✕</button>
              </div>
              <form onSubmit={handleUpdate} className="create-form">
                <ProductFormFields form={form} setForm={setForm} error={error} />
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Detalhes */}
      <AnimatePresence>
        {selectedProduct && !isEditing && (
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
                  <button className="btn-edit" onClick={() => openEdit(selectedProduct)}>
                    <Edit3 size={18} />
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(selectedProduct.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="modal-body">
                <div className="product-detail-image">
                  <div
                    style={{
                      width: "100%",
                      maxWidth: 400,
                      aspectRatio: "1",
                      position: "relative",
                      background: "linear-gradient(145deg, #ede9e4 0%, #ddd8d0 100%)",
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={selectedProduct.image || "/default-product.jpg"}
                      alt={selectedProduct.name}
                      fill
                      style={{ objectFit: "contain", padding: 16 }}
                    />
                  </div>
                </div>
                <div className="product-detail-info">
                  <span className="price-current-large">{formatPrice(selectedProduct.price)}</span>
                  <div className="product-stats-large">
                    <div className="stat-item"><span>Categoria: {selectedProduct.category}</span></div>
                    <div className="stat-item"><span>Estação: {selectedProduct.season}</span></div>
                    <div className="stat-item"><span>Estoque: {selectedProduct.stock}</span></div>
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