// components/ServicioCardHorizontal.tsx
import React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react'; 
import '../styles/ServicioCardHorizontal.css'; 

interface ServicioCardProps {
  imagenSrc: string;
  altTexto: string;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  linkVerMas: string;
}

export default function ServicioCardHorizontal({ 
  imagenSrc, 
  altTexto, 
  titulo, 
  descripcion, 
  ubicacion, 
  linkVerMas 
}: ServicioCardProps) {
  return (
    <div className="servicio-card-horizontal">
      
      {/* Columna de la Imagen */}
      <div className="card-image-wrapper-horizontal">
        <Image 
          src={imagenSrc}
          alt={altTexto}
          layout="fill"
          objectFit="cover"
          className="card-image-horizontal"
        />
      </div>
      
      {/* Columna del Contenido */}
      <div className="card-content-horizontal">
        <h3 className="card-title-horizontal">{titulo}</h3>
        <p className="card-description-horizontal">{descripcion}</p>
        <p className="card-location-horizontal">
          <span className="location-label-horizontal">Lo encuentras en:</span>
          <br />
          {ubicacion}
        </p>
        <a href={linkVerMas} className="btn-ver-mas-horizontal">
          Ver más <ChevronRight size={20} />
        </a>
      </div>
      
    </div>
  );
}