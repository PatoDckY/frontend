// components/MedicoCard.tsx
import React from 'react';
import Image from 'next/image';
import { Plus, MapPin, Building, ChevronRight } from 'lucide-react';
import '../styles/MedicoCard.css';

interface MedicoCardProps {
  imagenSrc: string;
  nombre: string;
  especialidad: string;
  hospital: string;
  direccion: string;
  linkVerMas: string;
}

export default function MedicoCard({ 
  imagenSrc, 
  nombre, 
  especialidad, 
  hospital, 
  direccion, 
  linkVerMas 
}: MedicoCardProps) {
  return (
    <div className="medico-card">
      {/* Imagen del Médico */}
      <div className="medico-image-wrapper">
        <Image 
          src={imagenSrc}
          alt={`Foto del Dr. ${nombre}`}
          width={300}
          height={300}
          className="medico-image"
        />
      </div>
      
      <div className="medico-content">
        {/* Nombre y Especialidad */}
        <h3 className="medico-name">{nombre}</h3>
        <p className="medico-specialty">{especialidad}</p>
        
        <hr className="divider" />
        
        {/* Detalles del Hospital */}
        <div className="detail-group hospital-detail">
          <div className="hospital-title">
            <Plus size={16} className="icon-plus" />
            <span className="hospital-label">Hospital:</span>
          </div>
          <p className="hospital-name">{hospital}</p>
        </div>
        
        {/* Detalles de Ubicación */}
        <div className="detail-group location-detail">
          <MapPin size={16} className="icon-location" />
          
          <div className="location-info">
            <p className="location-address">{direccion}</p>
          </div>
        </div>
        
        {/* Botón Ver Más */}
        <a href={linkVerMas} className="btn-ver-mas-medico">
          Ver más <ChevronRight size={18} />
        </a>
      </div>
    </div>
  );
}