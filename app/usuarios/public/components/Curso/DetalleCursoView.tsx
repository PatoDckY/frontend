import React from 'react';
import { MapPin, Calendar, User, Clock, Users, Target, ChevronDown } from 'lucide-react';
// Asegúrate de que esta ruta relativa sea correcta en tu estructura de carpetas
import '../../styles/Curso/DetalleCurso.css';

export interface ImagenCurso {
  src: string;
  descripcion: string; 
}

interface DetalleCursoProps {
  titulo: string;
  instructor: string;
  descripcionCompleta: string;
  horario: string;
  ubicacion?: string;
  fechaInicio: string;
  fechaFin: string;
  cupoMaximo: number;
  cupoInscrito: number;
  dirigidoA: string;
  costo: number | string;
  imagenes?: ImagenCurso[];
  onAdquirir: () => void;
}

export default function DetalleCursoView({
  titulo,
  instructor,
  descripcionCompleta,
  horario,
  ubicacion,
  fechaInicio,
  fechaFin,
  cupoMaximo,
  cupoInscrito,
  dirigidoA,
  costo,
  imagenes = [], 
  onAdquirir
}: DetalleCursoProps) {

  const tieneImagenes = imagenes.length > 0;
  const lugaresDisponibles = cupoMaximo - cupoInscrito;

  // Función para bajar suavemente al precio
  const scrollToPrice = () => {
    const element = document.getElementById('precio-final');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="curso-detail-container">
      
      {/* HERO SECTION */}
      <div className="curso-hero">
        <div className="curso-hero-content">
          <span className="curso-badge">{dirigidoA}</span>
          <h1 className="curso-title-large">{titulo}</h1>
          
          <div className="curso-meta-grid">
            <div className="meta-item">
                <User size={22} className="text-yellow-400" />
                <span>{instructor}</span>
            </div>
            <div className="meta-item">
                <Calendar size={22} className="text-yellow-400" />
                <span>{fechaInicio} - {fechaFin}</span>
            </div>
            {ubicacion && (
                <div className="meta-item">
                    <MapPin size={22} className="text-yellow-400" />
                    <span>{ubicacion}</span>
                </div>
            )}
          </div>

          {/* FLECHA DE SCROLL */}
          <div className="scroll-indicator" onClick={scrollToPrice}>
            <span className="scroll-text">Inscripción</span>
            <ChevronDown size={32} />
          </div>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="curso-content-wrapper">
        <div className={`curso-body ${tieneImagenes ? 'has-images' : ''}`}>
            
            {/* LADO IZQUIERDO: Texto */}
            <div className="curso-description-area">
                <h2 className="section-title">Información del Curso</h2>
                <p className="curso-description-text">
                    {descripcionCompleta}
                </p>

                <div className="details-grid">
                    <div className="detail-box">
                        <span className="detail-label"><Clock size={16}/> Horario</span>
                        <span className="detail-value">{horario}</span>
                    </div>
                    
                    <div className="detail-box">
                        <span className="detail-label"><Users size={16}/> Disponibilidad</span>
                        <span className="detail-value" style={{color: lugaresDisponibles < 5 ? '#E53935' : 'inherit'}}>
                            {lugaresDisponibles > 0 ? `${lugaresDisponibles} lugares` : "AGOTADO"}
                        </span>
                        <span style={{fontSize: '0.85rem', color: '#666'}}>
                            (Inscritos: {cupoInscrito}/{cupoMaximo})
                        </span>
                    </div>

                    <div className="detail-box">
                        <span className="detail-label"><Target size={16}/> Dirigido A</span>
                        <span className="detail-value">{dirigidoA}</span>
                    </div>
                </div>
            </div>

            {/* LADO DERECHO: Imágenes */}
            {tieneImagenes && (
                <div className="curso-gallery-area">
                    {imagenes.map((img, index) => (
                        <div key={index} className="image-card">
                            <img src={img.src} alt={`Imagen del curso ${index + 1}`} className="curso-img-detail" />
                            {img.descripcion && (
                                <div className="img-caption">
                                    {img.descripcion}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

        </div>
      </div>

      {/* SECCIÓN DE COMPRA (AL FINAL) */}
      <div id="precio-final" className="curso-purchase-section">
        <div className="purchase-card">
            <span className="price-label">Inversión Total por Persona</span>
            <span className="price-amount">
                {typeof costo === 'number' ? `$${costo}` : costo}
            </span>
            
            <button 
                className="btn-adquirir" 
                onClick={onAdquirir}
                disabled={lugaresDisponibles <= 0}
            >
                {lugaresDisponibles > 0 ? "¡Quiero Inscribirme!" : "Cupo Lleno"}
            </button>
            
            {lugaresDisponibles > 0 && (
                <p style={{marginTop: '15px', color: '#64748B', fontSize: '0.9rem'}}>
                    *Cupo limitado. Reserva tu lugar hoy mismo.
                </p>
            )}
        </div>
      </div>

    </div>
  );
}