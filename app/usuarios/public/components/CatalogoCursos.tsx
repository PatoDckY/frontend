// screens/CatalogoCursos.tsx
"use client";
import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import CursoCard from '../components/CursoCard'; 
import '../styles/CatalogoCursos.css';

// --- TIPOS DE DATOS (CORREGIDO) ---
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
  imagenSrc?: string;
  costo: number | 'Gratuito';
  ubicacion?: string;
  categoria: string; 
  linkDetalle: string; // <--- ¡ESTA PROPIEDAD FALTABA!
};

// --- DATOS SIMULADOS ---
const CURSOS_DATA: Curso[] = [
  {
    id: 1,
    titulo: "Primeros Auxilios Pediátricos: RCP y Atragantamiento",
    descripcion: "Taller práctico esencial para padres y cuidadores. Aprende a reaccionar ante emergencias reales con maniquíes de simulación.",
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
  {
    id: 2,
    titulo: "Taller de Emociones: 'Mi Monstruo de Colores'",
    descripcion: "Un espacio lúdico para que niños de 4 a 7 años aprendan a identificar y gestionar sus emociones a través del arte.",
    fechaInicio: "20 Nov 2025",
    fechaFin: "22 Nov 2025",
    fechaPublicacion: "10 Oct 2025",
    inscripcionesAbiertas: true,
    cupoMaximo: 10,
    cupoInscrito: 8, 
    instructor: "Psic. Ana Torres",
    horario: "16:00 - 18:00",
    modalidad: "Presencial",
    dirigidoA: "Niños",
    estado: "Activo",
    costo: 450,
    ubicacion: "Ludoteca Clínica",
    categoria: "Psicología",
    linkDetalle: "#"
  },
  {
    id: 3,
    titulo: "Sueño Infantil: Guía para Dormir Mejor",
    descripcion: "Estrategias respetuosas para mejorar el descanso de tu bebé y el de toda la familia. Sin llanto controlado.",
    fechaInicio: "01 Dic 2025",
    fechaFin: "05 Dic 2025",
    fechaPublicacion: "15 Sep 2025",
    inscripcionesAbiertas: true, 
    cupoMaximo: 50,
    cupoInscrito: 50, 
    instructor: "Dra. Sofía Mdz (Consultora de Sueño)",
    horario: "Acceso 24/7",
    modalidad: "Online",
    dirigidoA: "Padres",
    estado: "Activo",
    imagenSrc: "/logo.png", 
    costo: 600,
    categoria: "Crianza",
    linkDetalle: "#"
  },
  {
    id: 4,
    titulo: "Lactancia Materna Exitosa (Edición Octubre)",
    descripcion: "Preparación prenatal para la lactancia. Técnicas de agarre, posturas y resolución de problemas comunes.",
    fechaInicio: "10 Oct 2025",
    fechaFin: "12 Oct 2025",
    fechaPublicacion: "01 Sep 2025",
    inscripcionesAbiertas: false,
    cupoMaximo: 15,
    cupoInscrito: 15,
    instructor: "L.E. Carla Ruiz",
    horario: "10:00 - 12:00",
    modalidad: "Híbrido",
    dirigidoA: "Familia",
    estado: "Finalizado",
    imagenSrc: "/logo.png",
    costo: "Gratuito", 
    ubicacion: "Sala A y Zoom",
    categoria: "Lactancia",
    linkDetalle: "#"
  },
  {
    id: 5,
    titulo: "Pubertad y Cambios: Charla para Adolescentes",
    descripcion: "Un espacio seguro para resolver dudas sobre los cambios físicos y emocionales en la adolescencia.",
    fechaInicio: "15 Ene 2026",
    fechaFin: "15 Ene 2026",
    fechaPublicacion: "01 Nov 2025",
    inscripcionesAbiertas: true,
    cupoMaximo: 25,
    cupoInscrito: 5,
    instructor: "Dr. Roberto Limón",
    horario: "17:00 - 19:00",
    modalidad: "Presencial",
    dirigidoA: "Adolescentes",
    estado: "Próximamente",
    costo: 300,
    ubicacion: "Auditorio Principal",
    categoria: "Salud",
    linkDetalle: "#"
  },
];

export default function CatalogoCursos() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroAudiencia, setFiltroAudiencia] = useState("Todos");
  const [filtroEstado, setFiltroEstado] = useState("Activos"); 

  // Lógica de Filtrado
  const cursosFiltrados = useMemo(() => {
    return CURSOS_DATA.filter(curso => {
      // 1. Filtro Texto
      const coincideTexto = curso.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                            curso.instructor.toLowerCase().includes(busqueda.toLowerCase());
      
      // 2. Filtro Audiencia
      const coincideAudiencia = filtroAudiencia === "Todos" || curso.dirigidoA === filtroAudiencia;

      // 3. Filtro Estado 
      let coincideEstado = true;
      if (filtroEstado === "Activos") {
        coincideEstado = curso.estado !== "Finalizado";
      } else if (filtroEstado === "Finalizados") {
        coincideEstado = curso.estado === "Finalizado";
      }

      return coincideTexto && coincideAudiencia && coincideEstado;
    });
  }, [busqueda, filtroAudiencia, filtroEstado]);

  return (
    <div className="catalogo-container">
      
      {/* --- HERO DE LA SECCIÓN --- */}
      <div className="catalogo-hero">
        <div className="catalogo-hero-content">
          <h1 className="catalogo-title">Formación y Talleres</h1>
          <p className="catalogo-subtitle">
            Cursos diseñados por especialistas para acompañarte en cada etapa del crecimiento.
          </p>
          
          {/* Barra de Búsqueda Principal */}
          <div className="main-search-bar">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por tema, doctor o especialidad..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* --- BARRA DE FILTROS --- */}
      <div className="filters-bar-container">
        <div className="filters-bar">
          <div className="filter-group">
            <Filter size={18} className="filter-icon"/>
            <span className="filter-label">Filtrar por:</span>
            
            {/* Filtro Audiencia */}
            <select 
              value={filtroAudiencia} 
              onChange={(e) => setFiltroAudiencia(e.target.value)}
              className="filter-select"
            >
              <option value="Todos">Toda la Audiencia</option>
              <option value="Padres">Para Padres</option>
              <option value="Niños">Para Niños</option>
              <option value="Adolescentes">Para Adolescentes</option>
            </select>

            {/* Filtro Estado */}
            <select 
              value={filtroEstado} 
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="filter-select"
            >
              <option value="Activos">Cursos Activos & Próximos</option>
              <option value="Finalizados">Cursos Anteriores</option>
              <option value="Todos">Ver Todo el Historial</option>
            </select>
          </div>

          <div className="results-count">
            <strong>{cursosFiltrados.length}</strong> cursos encontrados
          </div>
        </div>
      </div>

      {/* --- GRID DE CURSOS --- */}
      <div className="cursos-grid-section">
        {cursosFiltrados.length > 0 ? (
          <div className="cursos-grid">
            {cursosFiltrados.map((curso) => (
              <CursoCard 
                key={curso.id}
                titulo={curso.titulo}
                descripcion={curso.descripcion}
                fechaInicio={curso.fechaInicio}
                fechaFin={curso.fechaFin}
                fechaPublicacion={curso.fechaPublicacion}
                inscripcionesAbiertas={curso.inscripcionesAbiertas}
                cupoMaximo={curso.cupoMaximo}
                cupoInscrito={curso.cupoInscrito}
                instructor={curso.instructor}
                horario={curso.horario}
                modalidad={curso.modalidad}
                dirigidoA={curso.dirigidoA}
                estado={curso.estado}
                imagenSrc={curso.imagenSrc}
                costo={curso.costo}
                ubicacion={curso.ubicacion}
                linkDetalle={curso.linkDetalle}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <BookOpen size={48} className="empty-icon" />
            <h3>No encontramos cursos con esos criterios</h3>
            <p>Intenta cambiar los filtros o busca otro término.</p>
            <button 
              className="btn-reset-filters"
              onClick={() => { setBusqueda(""); setFiltroAudiencia("Todos"); setFiltroEstado("Todos"); }}
            >
              Ver todos los cursos
            </button>
          </div>
        )}
      </div>

    </div>
  );
}