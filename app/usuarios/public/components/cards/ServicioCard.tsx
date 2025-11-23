// components/ServicioCard.tsx
import React from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react'; // Icono de flecha
import '../../styles/cards/ServicioCard.css'; // Asegúrate de crear este archivo CSS

interface ServicioCardProps {
  imagenSrc: string;
  altTexto: string;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  linkVerMas: string; // URL a la que redirige el botón "Ver más"
}

export default function ServicioCard({ 
  imagenSrc, 
  altTexto, 
  titulo, 
  descripcion, 
  ubicacion, 
  linkVerMas 
}: ServicioCardProps) {
  return (
    <div className="servicio-card">
      <div className="card-image-wrapper">
        <Image 
          src={imagenSrc}
          alt={altTexto}
          layout="fill" // Permite que la imagen llene el contenedor
          objectFit="cover" // Asegura que la imagen cubra el área sin distorsionarse
          className="card-image"
        />
      </div>
      <div className="card-content">
        <h3 className="card-title">{titulo}</h3>
        <p className="card-description">{descripcion}</p>
        <p className="card-location">
          <span className="location-label">Lo encuentras en:</span> <br />
          {ubicacion}
        </p>
        <a href={linkVerMas} className="btn-ver-mas">
          Ver más <ChevronRight size={20} />
        </a>
      </div>
    </div>
  );
}