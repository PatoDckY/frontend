// screens/admin/GestionCursos.tsx
"use client";
import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, PlusCircle, Edit, Trash2, Users } from 'lucide-react';
import CursoCard from '../../../public/components/cards/CursoCard'; 
import CrearCursoModal from './modals/CrearCursoModal';
import EditarCursoModal from './modals/EditarCursoModal';
import '../../styles/Cursos/GestionCursos.css';

// 1. DEFINIMOS EL TIPO EXPLÍCITAMENTE
type Curso = {
  id: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  fechaPublicacion: string;
  inscripcionesAbiertas: boolean;
  cupoMaximo: number;
  cupoInscrito: number;
  instructor: string;
  horario: string;
  modalidad: 'Online' | 'Presencial' | 'Híbrido';
  dirigidoA: 'Padres' | 'Niños' | 'Familia' | 'Adolescentes';
  estado: 'Activo' | 'Finalizado' | 'Próximamente'; 
  imagenSrc: string;
  costo: number | 'Gratuito';
  ubicacion: string;
  categoria: string;
  linkDetalle: string;
};

// --- DATOS SIMULADOS ---
const CURSOS_INICIALES: Curso[] = [ 
  {
    id: 1,
    titulo: "Primeros Auxilios Pediátricos",
    descripcion: "Taller práctico esencial para padres. RCP y atragantamiento.",
    fechaInicio: "15 Nov 2025",
    fechaFin: "15 Nov 2025",
    fechaPublicacion: "01 Oct 2025",
    inscripcionesAbiertas: true,
    cupoMaximo: 20,
    cupoInscrito: 12, 
    instructor: "Dr. Francisco Wong",
    horario: "Sábado 09:00 - 13:00",
    modalidad: "Presencial",
    dirigidoA: "Padres",
    estado: "Activo",
    imagenSrc: "/logo.png", 
    costo: 800,
    ubicacion: "Auditorio Torre 2",
    categoria: "Salud",
    linkDetalle: "#"
  },
];

export default function GestionCursos() {
  const [cursos, setCursos] = useState<Curso[]>(CURSOS_INICIALES);
  const [busqueda, setBusqueda] = useState("");
  const [filtroAudiencia, setFiltroAudiencia] = useState("Todos");
  const [filtroEstado, setFiltroEstado] = useState("Activos"); 

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [cursoAEditar, setCursoAEditar] = useState<Curso | null>(null); 

  // Lógica de Filtrado
  const cursosFiltrados = useMemo(() => {
    return cursos.filter(curso => {
      const coincideTexto = curso.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                            curso.instructor.toLowerCase().includes(busqueda.toLowerCase());
      const coincideAudiencia = filtroAudiencia === "Todos" || curso.dirigidoA === filtroAudiencia;
      
      let coincideEstado = true;
      if (filtroEstado === "Activos") coincideEstado = curso.estado !== "Finalizado";
      else if (filtroEstado === "Finalizados") coincideEstado = curso.estado === "Finalizado";

      return coincideTexto && coincideAudiencia && coincideEstado;
    });
  }, [busqueda, filtroAudiencia, filtroEstado, cursos]);

  // --- CRUD ---
  const handleCreate = () => setCreateModalOpen(true);

  const guardarNuevoCurso = (nuevoCurso: Curso) => {
    setCursos([nuevoCurso, ...cursos]);
    setCreateModalOpen(false);
  };

  const handleEdit = (id: number) => {
    const curso = cursos.find(c => c.id === id);
    if (curso) {
      setCursoAEditar(curso);
      setEditModalOpen(true);
    }
  };

  const actualizarCurso = (cursoActualizado: Curso) => {
    setCursos(prev => prev.map(c => c.id === cursoActualizado.id ? cursoActualizado : c));
    setEditModalOpen(false);
    setCursoAEditar(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este curso?")) {
        setCursos(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="admin-cursos-container">
      
      {/* --- HEADER --- */}
      <header className="admin-cursos-header">
        <div className="header-background"></div>
        <div className="header-content">
          <h1 className="header-title">Gestión de Cursos y Talleres</h1>
          <p className="header-subtitle">Administra la oferta educativa de la Academia Infantil.</p>
        </div>
      </header>

      {/* --- TOOLS BAR --- */}
      <div className="admin-tools-wrapper">
        <div className="admin-tools-card">
          
          <div className="search-section">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input 
                type="text" 
                placeholder="Buscar curso o instructor..." 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            
            {/* Filtros */}
            <div className="filters-group">
                <select 
                    value={filtroAudiencia} 
                    onChange={(e) => setFiltroAudiencia(e.target.value)}
                    className="filter-select"
                >
                    <option value="Todos">Audiencia: Todas</option>
                    <option value="Padres">Para Padres</option>
                    <option value="Niños">Para Niños</option>
                </select>
                <select 
                    value={filtroEstado} 
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="filter-select"
                >
                    <option value="Activos">Estado: Activos</option>
                    <option value="Finalizados">Finalizados</option>
                    <option value="Todos">Todos</option>
                </select>
            </div>
          </div>

          {/* ACCIONES: BOTÓN AÑADIR + BADGE */}
          <div className="actions-section">
            {/* --- BOTÓN AÑADIR CURSO (AGREGADO) --- */}
            <button className="btn-admin-create" onClick={handleCreate}>
                <PlusCircle size={20} /> Añadir Curso
            </button>
            
            <div className="stats-badge">
                <BookOpen size={16} /> 
                <span>{cursos.length} Cursos</span>
            </div>
          </div>

        </div>
      </div>

      {/* --- GRID --- */}
      <main className="admin-cursos-content">
        {cursosFiltrados.length > 0 ? (
          <div className="admin-cursos-grid">
            {cursosFiltrados.map((curso) => (
              <div key={curso.id} className="admin-curso-wrapper">
                
                <CursoCard 
                  {...curso}
                  linkDetalle="#"
                />

                <div className="curso-controls">
                    <button 
                        className="btn-control-curso edit" 
                        onClick={() => handleEdit(curso.id)}
                    >
                        <Edit size={16} /> Editar
                    </button>
                    <button 
                        className="btn-control-curso delete" 
                        onClick={() => handleDelete(curso.id)}
                    >
                        <Trash2 size={16} /> Eliminar
                    </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <BookOpen size={48} className="empty-icon" />
            <h3>No se encontraron cursos</h3>
            <p>Intenta ajustar los filtros de búsqueda.</p>
          </div>
        )}
      </main>

      {/* --- MODALES --- */}
      <CrearCursoModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
        onSave={guardarNuevoCurso}
      />

      <EditarCursoModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={actualizarCurso}
        curso={cursoAEditar}
      />

    </div>
  );
}