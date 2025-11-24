// screens/admin/GestionAcademia.tsx
"use client";
import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, FileText } from 'lucide-react';

// Componentes UI
import NoticiaBreveCard from '../../../public/components/cards/NoticiaBreveCard'; 
import CrearPublicacionModal from './modals/CrearPublicacionModal'; 
import EditarPublicacionModal from './modals/EditarPublicacionModal';

// Estilos
import '../../styles/Academia/GestionAcademia.css'; 

// --- DATOS DE EJEMPLO ---
const NOTICIAS_INICIALES = [
  {
    id: 1,
    imagenSrc: "/logo.png",
    altTexto: "Niño jugando",
    titulo: "Hitos Clave del Desarrollo del Lenguaje",
    bajada: "Identificar las etapas cruciales del habla y lenguaje puede ayudar a los padres a detectar a tiempo posibles retrasos.",
    autor: "Equipo de Desarrollo",
    fecha: "20.11.2025",
    linkVerMas: "#",
    etiquetas: ["lenguaje", "desarrollo"],
  },
  {
    id: 2,
    imagenSrc: "/logo.png",
    altTexto: "Padre e hijo",
    titulo: "Estrategias para el Manejo de Rabietas",
    bajada: "Técnicas de disciplina positiva que promueven la inteligencia emocional y el manejo de frustraciones en preescolares.",
    autor: "Psicología Infantil",
    fecha: "18.11.2025",
    linkVerMas: "#",
    etiquetas: ["crianza", "emocional"],
  },
];

export default function GestionAcademia() {
  // Estados
  const [noticias, setNoticias] = useState(NOTICIAS_INICIALES);
  
  // Estados de Modales
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [publicacionAEditar, setPublicacionAEditar] = useState<any>(null);

  // --- FUNCIONES DE CONTROL ---

  // 1. CREAR
  const handleCreate = () => {
    setCreateModalOpen(true);
  };

  const guardarNuevaPublicacion = (nuevaPublicacion: any) => {
    setNoticias([nuevaPublicacion, ...noticias]); 
    setCreateModalOpen(false);
  };

  // 2. EDITAR
  const handleEdit = (id: number) => {
    const publicacion = noticias.find(p => p.id === id);
    if (publicacion) {
      setPublicacionAEditar(publicacion);
      setEditModalOpen(true);
    }
  };

  const actualizarPublicacion = (publicacionActualizada: any) => {
    setNoticias(prevNoticias => 
      prevNoticias.map(p => (p.id === publicacionActualizada.id ? publicacionActualizada : p))
    );
    setEditModalOpen(false);
    setPublicacionAEditar(null);
  };

  // 3. ELIMINAR
  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta publicación? Esta acción no se puede deshacer.")) {
        setNoticias(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="admin-academia-container">
      
      {/* --- HEADER DE GESTIÓN --- */}
      <div className="admin-toolbar">
        <div className="toolbar-info">
            <h1 className="admin-title">Gestión de Academia Infantil</h1>
            <p className="admin-subtitle">Administra las guías, consejos y novedades visibles para los padres.</p>
        </div>
        <div className="toolbar-actions">
            <button className="btn-admin-create" onClick={handleCreate}>
                <PlusCircle size={20} /> Nueva Publicación
            </button>
        </div>
      </div>

      {/* --- ESTADÍSTICAS RÁPIDAS --- */}
      <div className="admin-stats-bar">
        <div className="stat-item">
            <FileText size={20} />
            <span><strong>{noticias.length}</strong> Publicaciones Activas</span>
        </div>
      </div>

      {/* --- LISTA DE CONTENIDO --- */}
      <div className="admin-content-grid">
        {noticias.length > 0 ? (
          noticias.map(noticia => (
            <div key={noticia.id} className="admin-card-wrapper">
              
              {/* Tarjeta Visual */}
              <NoticiaBreveCard
                  imagenSrc={noticia.imagenSrc || "/logo.png"}
                  altTexto={noticia.altTexto}
                  titulo={noticia.titulo}
                  bajada={noticia.bajada}
                  autor={noticia.autor}
                  fecha={noticia.fecha}
                  linkVerMas={noticia.linkVerMas}
                  etiquetas={noticia.etiquetas}
              />

              {/* Controles de la Tarjeta */}
              <div className="card-controls">
                  <button 
                      className="btn-control edit" 
                      onClick={() => handleEdit(noticia.id)}
                      title="Editar Publicación"
                  >
                      <Edit size={18} /> Editar
                  </button>
                  <button 
                      className="btn-control delete" 
                      onClick={() => handleDelete(noticia.id)}
                      title="Eliminar Publicación"
                  >
                      <Trash2 size={18} /> Eliminar
                  </button>
              </div>

            </div>
          ))
        ) : (
          <div style={{textAlign: 'center', padding: '3rem', color: '#6B7280'}}>
            No hay publicaciones aún. ¡Crea la primera!
          </div>
        )}
      </div>

      {/* --- MODALES --- */}
      <CrearPublicacionModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
        onSave={guardarNuevaPublicacion}
      />

      <EditarPublicacionModal 
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={actualizarPublicacion}
        publicacion={publicacionAEditar}
      />

    </div>
  );
}