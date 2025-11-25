// screens/admin/GestionNoticias.tsx
"use client";
import React, { useState } from 'react';
import { Search, PlusCircle, Edit, Trash2, Eye, EyeOff, FileText } from 'lucide-react';
import NoticiaBreveCard from '../../../public/components/cards/NoticiaBreveCard'; 
import CrearNoticiaModal from './modals/CrearNoticiaModal';
import EditarNoticiaModal from './modals/EditarNoticiaModal';
import '../../styles/blog/GestionNoticias.css'; 

// --- TIPO DE DATOS ---
export type Noticia = {
  id: number;
  imagenSrc: string;
  altTexto: string;
  titulo: string;
  bajada: string;
  autor: string;
  fecha: string;
  linkVerMas: string;
  etiquetas: string[];
  visible: boolean; // Nuevo campo para controlar visibilidad
};

// --- DATOS SIMULADOS ---
const NOTICIAS_INICIALES: Noticia[] = [
  {
    id: 1,
    imagenSrc: "/logo.png",
    altTexto: "Niño recibiendo vacuna",
    titulo: "Nueva Guía de Vacunación 2025",
    bajada: "Actualización de las recomendaciones para la vacunación infantil enfocándose en la prevención de virus respiratorios.",
    autor: "Dr. Pérez",
    fecha: "20.11.2025",
    linkVerMas: "#",
    etiquetas: ["vacunas", "salud infantil", "protocolo"],
    visible: true,
  },
  {
    id: 2,
    imagenSrc: "/logo.png",
    altTexto: "Alimentos saludables",
    titulo: "Importancia de la Vitamina D",
    bajada: "Especialistas destacan la necesidad de suplementar la Vitamina D en infantes para evitar el raquitismo.",
    autor: "Dra. Rodríguez",
    fecha: "18.11.2025",
    linkVerMas: "#",
    etiquetas: ["nutricion", "desarrollo", "vitaminas"],
    visible: true,
  },
  {
    id: 3,
    imagenSrc: "/logo.png",
    altTexto: "Borrador",
    titulo: "Borrador: Consejos de Sueño (Oculto)",
    bajada: "Este artículo está oculto al público mientras se termina de editar.",
    autor: "Admin",
    fecha: "22.11.2025",
    linkVerMas: "#",
    etiquetas: ["sueño", "borrador"],
    visible: false, // Ejemplo de noticia oculta
  },
];

export default function GestionNoticias() {
  const [noticias, setNoticias] = useState<Noticia[]>(NOTICIAS_INICIALES);
  const [busqueda, setBusqueda] = useState("");
  
  // Estados de Modales
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [noticiaAEditar, setNoticiaAEditar] = useState<Noticia | null>(null);

  // Filtrado
  const noticiasFiltradas = noticias.filter(noticia => 
    noticia.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    noticia.autor.toLowerCase().includes(busqueda.toLowerCase())
  );

  // --- CRUD ---
  const handleCreate = () => setCreateModalOpen(true);

  const guardarNuevaNoticia = (nuevaNoticia: Noticia) => {
    setNoticias([nuevaNoticia, ...noticias]);
    setCreateModalOpen(false);
  };

  const handleEdit = (id: number) => {
    const noticia = noticias.find(n => n.id === id);
    if (noticia) {
      setNoticiaAEditar(noticia);
      setEditModalOpen(true);
    }
  };

  const actualizarNoticia = (noticiaActualizada: Noticia) => {
    setNoticias(prev => prev.map(n => n.id === noticiaActualizada.id ? noticiaActualizada : n));
    setEditModalOpen(false);
    setNoticiaAEditar(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta noticia?")) {
      setNoticias(prev => prev.filter(n => n.id !== id));
    }
  };

  // Función para alternar visibilidad
  const toggleVisibilidad = (id: number) => {
    setNoticias(prev => prev.map(n => 
      n.id === id ? { ...n, visible: !n.visible } : n
    ));
  };

  return (
    <div className="admin-noticias-container">
      
      {/* --- HEADER --- */}
      <header className="admin-noticias-header">
        <div className="header-background"></div>
        <div className="header-content">
          <h1 className="header-title">Gestión de Blog y Noticias</h1>
          <p className="header-subtitle">Administra las publicaciones, consejos y novedades para los padres.</p>
        </div>
      </header>

      {/* --- TOOLS BAR --- */}
      <div className="admin-tools-wrapper">
        <div className="admin-tools-card">
          <div className="search-section">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon"/>
              <input 
                type="text" 
                placeholder="Buscar noticia por título o autor..." 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <div className="actions-section">
            <button className="btn-admin-create" onClick={handleCreate}>
                <PlusCircle size={20} /> Nueva Publicación
            </button>
            <div className="stats-badge">
                <FileText size={16} /> 
                <span>{noticias.length} Publicaciones</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- GRID DE NOTICIAS --- */}
      <main className="admin-noticias-content">
        {noticiasFiltradas.length > 0 ? (
          <div className="admin-noticias-grid">
            {noticiasFiltradas.map((noticia) => (
              <div key={noticia.id} className={`admin-noticia-wrapper ${!noticia.visible ? 'oculta' : ''}`}>
                
                {/* Indicador visual de estado */}
                {!noticia.visible && <div className="badge-oculto">Oculto al público</div>}

                {/* Tarjeta Visual */}
                <NoticiaBreveCard
                  imagenSrc={noticia.imagenSrc}
                  altTexto={noticia.altTexto}
                  titulo={noticia.titulo}
                  bajada={noticia.bajada}
                  autor={noticia.autor}
                  fecha={noticia.fecha}
                  linkVerMas="#"
                  etiquetas={noticia.etiquetas}
                />

                {/* Controles Integrados */}
                <div className="noticia-controls">
                    {/* Botón Visibilidad */}
                    <button 
                        className={`btn-control-noticia visibility ${noticia.visible ? 'active' : 'inactive'}`}
                        onClick={() => toggleVisibilidad(noticia.id)}
                        title={noticia.visible ? "Ocultar noticia" : "Mostrar noticia"}
                    >
                        {noticia.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                        {noticia.visible ? "Visible" : "Oculto"}
                    </button>

                    <div className="controls-divider"></div>

                    <button 
                        className="btn-control-noticia edit" 
                        onClick={() => handleEdit(noticia.id)}
                        title="Editar"
                    >
                        <Edit size={18} />
                    </button>
                    
                    <button 
                        className="btn-control-noticia delete" 
                        onClick={() => handleDelete(noticia.id)}
                        title="Eliminar"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">No se encontraron noticias.</div>
        )}
      </main>

      {/* --- MODALES --- */}
      <CrearNoticiaModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
        onSave={guardarNuevaNoticia} 
      />

      <EditarNoticiaModal 
        isOpen={isEditModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        onSave={actualizarNoticia} 
        noticia={noticiaAEditar} 
      />

    </div>
  );
}