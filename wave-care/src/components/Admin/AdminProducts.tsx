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

const categories = [
  "Shampoo",
  "Máscara",
  "Leave-in",
  "Gelatina",
  "Óleo",
  "Kit",
];
const seasons = ["verao", "outono", "inverno", "primavera"];

// ✅ FORA do AdminProducts — isso resolve o bug de perder foco a cada letra
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
              <option key={cat} value={cat}>
                {cat}
              </option>
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
              <option key={s} value={s}>
                {s}
              </option>
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
            <img
              src={form.image}
              alt="preview"
              style={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: 8,
                marginTop: 8,
              }}
            />
          )}
        </div>
      </div>
      {error && (
        <p style={{ color: "var(--color-danger)", fontSize: "0.8rem" }}>
          {error}
        </p>
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
    const matchesCategory =
      filterCategory === "all" || p.category === filterCategory;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);

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
        prev.map((p) =>
          p.id === selectedProduct.id ? (updated as Product) : p,
        ),
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
              <option key={cat} value={cat}>
                {cat}
              </option>
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
                src={product.image || "/default-product.jpg"}
                alt={product.name}
                width={120}
                height={120}
                className="product-image-admin"
              />
              <span className="product-season">{product.season}</span>
            </div>
            <div className="product-info-admin">
              <h3 className="product-name-admin">{product.name}</h3>
              <div className="product-category">
                <Tag size={14} />
                <span>{product.category}</span>
              </div>
              <div className="product-price-admin">
                <span className="price-current">
                  {formatPrice(product.price)}
                </span>
              </div>
              <div className="product-stats">
                <span>Estoque: {product.stock}</span>
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
                <h3>
                  <Plus size={24} /> Novo Produto
                </h3>
                <button onClick={() => setIsCreating(false)}>✕</button>
              </div>
              <form onSubmit={handleCreate} className="create-form">
                <ProductFormFields
                  form={form}
                  setForm={setForm}
                  error={error}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
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
                <h3>
                  <Edit3 size={24} /> Editar Produto
                </h3>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setError(null);
                  }}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleUpdate} className="create-form">
                <ProductFormFields
                  form={form}
                  setForm={setForm}
                  error={error}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
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
                  <button
                    className="btn-edit"
                    onClick={() => openEdit(selectedProduct)}
                  >
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
                    src={selectedProduct.image || "/default-product.jpg"}
                    alt={selectedProduct.name}
                    width={400}
                    height={400}
                    className="product-detail-img"
                  />
                </div>
                <div className="product-detail-info">
                  <span className="price-current-large">
                    {formatPrice(selectedProduct.price)}
                  </span>
                  <div className="product-stats-large">
                    <div className="stat-item">
                      <span>Categoria: {selectedProduct.category}</span>
                    </div>
                    <div className="stat-item">
                      <span>Estação: {selectedProduct.season}</span>
                    </div>
                    <div className="stat-item">
                      <span>Estoque: {selectedProduct.stock}</span>
                    </div>
                  </div>
                  <p className="product-description-large">
                    {selectedProduct.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
