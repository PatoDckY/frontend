// components/CursoCard.tsx
"use client";
import React from 'react';
import Image from 'next/image';
import { 
  Calendar, Clock, MapPin, User, Users, 
  Monitor, DollarSign, CalendarDays, CheckCircle, XCircle 
} from 'lucide-react';
import '../styles/CursoCard.css';

interface CursoProps {
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  fechaPublicacion: string;
  inscripcionesAbiertas: boolean;
  cupoMaximo: number;
  cupoInscrito: number; // Para calcular lugares disponibles
  instructor: string;
  horario: string;
  modalidad: 'Online' | 'Presencial' | 'Híbrido';
  dirigidoA: 'Padres' | 'Niños' | 'Familia' | 'Adolescentes';
  estado: 'Activo' | 'Finalizado' | 'Próximamente';
  imagenSrc?: string; // Opcional
  costo: number | 'Gratuito';
  ubicacion?: string; // Opcional si es Online
  linkDetalle: string;
}

export default function CursoCard({
  titulo,
  descripcion,
  fechaInicio,
  fechaFin,
  fechaPublicacion,
  inscripcionesAbiertas,
  cupoMaximo,
  cupoInscrito,
  instructor,
  horario,
  modalidad,
  dirigidoA,
  estado,
  imagenSrc,
  costo,
  ubicacion,
  linkDetalle
}: CursoProps) {

  // Lógica para lugares disponibles
  const lugaresDisponibles = cupoMaximo - cupoInscrito;
  const porcentajeLlenado = (cupoInscrito / cupoMaximo) * 100;
  
  // Determinar color de estado
  const isActive = estado === 'Activo';
  const isClosed = !inscripcionesAbiertas || estado === 'Finalizado';

  return (
    <div className={`curso-card ${isClosed ? 'curso-cerrado' : ''}`}>
      
      {/* --- 1. ENCABEZADO (Imagen o Patrón) --- */}
      <div className={`curso-header ${!imagenSrc ? 'no-image-header' : ''}`}>
        {imagenSrc ? (
          <Image 
            src={imagenSrc} 
            alt={titulo} 
            layout="fill" 
            objectFit="cover" 
            className="curso-image"
          />
        ) : (
          <div className="curso-pattern">
            <BookOpenIconPlaceholder /> {/* Icono decorativo si no hay foto */}
          </div>
        )}

        {/* Badge de Estado Absoluto */}
        <div className={`status-badge ${inscripcionesAbiertas ? 'open' : 'closed'}`}>
          {inscripcionesAbiertas ? 'Inscripciones Abiertas' : 'Cerrado'}
        </div>
      </div>

      {/* --- 2. CUERPO DE LA TARJETA --- */}
      <div className="curso-body">
        
        {/* Etiquetas Superiores */}
        <div className="curso-tags">
          <span className={`tag-badge audiencia ${dirigidoA.toLowerCase()}`}>
            {dirigidoA}
          </span>
          <span className="tag-badge modalidad">
            {modalidad === 'Online' ? <Monitor size={12}/> : <MapPin size={12}/>}
            {modalidad}
          </span>
        </div>

        {/* Título e Instructor */}
        <h3 className="curso-titulo">{titulo}</h3>
        <div className="curso-instructor">
          <User size={16} className="icon-instructor" />
          <span>Imparte: <strong>{instructor}</strong></span>
        </div>

        {/* Descripción Corta */}
        <p className="curso-descripcion">{descripcion}</p>

        {/* Grid de Detalles (Fechas y Horario) */}
        <div className="curso-details-grid">
          <div className="detail-item">
            <CalendarDays size={16} />
            <div>
              <span className="detail-label">Fecha:</span>
              <span className="detail-value">{fechaInicio} - {fechaFin}</span>
            </div>
          </div>
          <div className="detail-item">
            <Clock size={16} />
            <div>
              <span className="detail-label">Horario:</span>
              <span className="detail-value">{horario}</span>
            </div>
          </div>
          {ubicacion && modalidad !== 'Online' && (
            <div className="detail-item full-width">
              <MapPin size={16} />
              <span className="detail-value">{ubicacion}</span>
            </div>
          )}
        </div>

        {/* Barra de Cupo (Elemento Extra Importante) */}
        {inscripcionesAbiertas && (
          <div className="curso-cupo-wrapper">
            <div className="cupo-info">
              <span><Users size={14}/> Cupo:</span>
              <span className={lugaresDisponibles < 5 ? 'text-urgent' : ''}>
                {lugaresDisponibles} lugares disponibles
              </span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${porcentajeLlenado}%` }}
              ></div>
            </div>
          </div>
        )}

      </div>

      {/* --- 3. PIE DE TARJETA (Costo y Acción) --- */}
      <div className="curso-footer">
        <div className="curso-costo">
          <span className="costo-label">Costo:</span>
          <span className="costo-valor">
            {costo === 'Gratuito' ? 'Gratuito' : `$${costo} MXN`}
          </span>
        </div>
        
        <a href={linkDetalle} className={`btn-curso-action ${isClosed ? 'disabled' : ''}`}>
          {isClosed ? 'No disponible' : 'Ver Detalles'}
        </a>
      </div>
      
      {/* Fecha de publicación discreta */}
      <div className="curso-meta-footer">
        Publicado el: {fechaPublicacion}
      </div>
    </div>
  );
}

// Componente auxiliar para cuando no hay imagen
const BookOpenIconPlaceholder = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);