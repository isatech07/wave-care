// components/Admin/AdminBlogs.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Image as ImageIcon,
  Calendar,
  User
} from 'lucide-react';
import Image from 'next/image';

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
}

const blogs: Blog[] = [
  {
    id: '1',
    title: 'Cuidados com cabelos cacheados no verão',
    excerpt: 'Dicas essenciais para manter seus cachos hidratados e protegidos do sol.',
    author: 'Dr. Ana Silva',
    date: '2024-01-20',
    image: '/blog/verao-cacheados.jpg',
    content: 'Conteúdo completo do artigo...',
    status: 'published',
    views: 1245
  },
  {
    id: '2',
    title: 'Máscaras nutritivas para o inverno',
    excerpt: 'Recupere a hidratação dos fios com estas receitas caseiras.',
    author: 'Maria Oliveira',
    date: '2024-01-15',
    image: '/blog/inverno-mascaras.jpg',
    content: 'Conteúdo completo...',
    status: 'draft',
    views: 89
  },
  {
    id: '3',
    title: 'Gelatina modeladora: como usar corretamente',
    excerpt: 'Guia completo para definição perfeita dos cachos.',
    author: 'João Santos',
    date: '2024-01-10',
    image: '/blog/gelatina-modeladora.jpg',
    content: 'Conteúdo completo...',
    status: 'published',
    views: 2034
  }
];

const statusConfig = {
  draft: { label: 'Rascunho', color: 'gray' },
  published: { label: 'Publicado', color: 'green' },
  archived: { label: 'Arquivado', color: 'orange' }
};

export default function AdminBlogs() {
  const [blogsList, setBlogsList] = useState(blogs);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    excerpt: '',
    author: '',
    image: '',
    content: ''
  });
  const [filterStatus, setFilterStatus] = useState<'all' | Blog['status']>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBlogs = blogsList.filter(blog => {
    const matchesStatus = filterStatus === 'all' || blog.status === filterStatus;
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (blogId: string, newStatus: Blog['status']) => {
    setBlogsList(prev => 
      prev.map(blog => 
        blog.id === blogId 
          ? { ...blog, status: newStatus }
          : blog
      )
    );
  };

  const handleDelete = (blogId: string) => {
    setBlogsList(prev => prev.filter(blog => blog.id !== blogId));
    setSelectedBlog(null);
  };

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    const blog: Blog = {
      id: Date.now().toString(),
      title: newBlog.title,
      excerpt: newBlog.excerpt,
      author: newBlog.author,
      date: new Date().toISOString().split('T')[0],
      image: newBlog.image || '/default-blog.jpg',
      content: newBlog.content,
      status: 'draft',
      views: 0
    };
    
    setBlogsList([blog, ...blogsList]);
    setNewBlog({ title: '', excerpt: '', author: '', image: '', content: '' });
    setIsCreating(false);
  };

  return (
    <div className="admin-blogs">
      <div className="blogs-header">
        <div>
          <h2>Gerenciar Blogs</h2>
          <p>{filteredBlogs.length} artigos {filteredBlogs.length !== blogsList.length && `de ${blogsList.length}`}</p>
        </div>
        
        <div className="header-actions">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Buscar por título ou autor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">Todos</option>
            <option value="draft">Rascunhos</option>
            <option value="published">Publicados</option>
            <option value="archived">Arquivados</option>
          </select>
          
          <button 
            className="create-blog-btn"
            onClick={() => setIsCreating(true)}
          >
            <Plus size={20} />
            Novo Artigo
          </button>
        </div>
      </div>

      <div className="blogs-grid">
        {filteredBlogs.map((blog) => (
          <motion.div
            key={blog.id}
            className="blog-card"
            whileHover={{ y: -4 }}
            onClick={() => setSelectedBlog(blog)}
          >
            <div className="blog-image-wrapper">
              <Image
                src={blog.image}
                alt={blog.title}
                width={80}
                height={60}
                className="blog-image"
              />
              <span className={`blog-status status-${blog.status}`}>
                {statusConfig[blog.status].label}
              </span>
            </div>
            
            <div className="blog-content">
              <h3 className="blog-title">{blog.title}</h3>
              <p className="blog-excerpt">{blog.excerpt}</p>
              
              <div className="blog-meta">
                <div className="meta-author">
                  <User size={14} />
                  <span>{blog.author}</span>
                </div>
                <div className="meta-date">
                  <Calendar size={14} />
                  <span>{new Date(blog.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="meta-views">
                  <Eye size={14} />
                  <span>{blog.views.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Novo Blog */}
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
                <h3><Plus size={24} /> Novo Artigo</h3>
                <button onClick={() => setIsCreating(false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateBlog} className="create-form">
                <div className="form-group">
                  <label>Título *</label>
                  <input
                    type="text"
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Resumo</label>
                  <textarea
                    rows={3}
                    value={newBlog.excerpt}
                    onChange={(e) => setNewBlog({...newBlog, excerpt: e.target.value})}
                    placeholder="Breve descrição do artigo..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Autor</label>
                    <input
                      type="text"
                      value={newBlog.author}
                      onChange={(e) => setNewBlog({...newBlog, author: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Imagem (URL)</label>
                    <input
                      type="url"
                      value={newBlog.image}
                      onChange={(e) => setNewBlog({...newBlog, image: e.target.value})}
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Conteúdo</label>
                  <textarea
                    rows={8}
                    value={newBlog.content}
                    onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                    placeholder="Escreva o conteúdo completo do artigo..."
                  />
                </div>

                <button type="submit" className="btn-primary">
                  Criar Artigo
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Detalhes Blog */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>{selectedBlog.title}</h3>
                <div className="modal-actions">
                  <select 
                    value={selectedBlog.status}
                    onChange={(e) => handleStatusChange(selectedBlog.id, e.target.value as any)}
                    className="status-select"
                  >
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                    <option value="archived">Arquivado</option>
                  </select>
                  <button className="btn-edit">
                    <Edit3 size={18} />
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(selectedBlog.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="modal-body">
                <Image
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  width={800}
                  height={400}
                  className="modal-featured-image"
                />
                
                <div className="blog-meta-large">
                  <span>Por {selectedBlog.author} • {new Date(selectedBlog.date).toLocaleDateString('pt-BR')}</span>
                  <span>{selectedBlog.views} visualizações</span>
                </div>
                
                <div className="modal-content-preview">
                  <p>{selectedBlog.content.substring(0, 500)}...</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}