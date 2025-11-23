// components/NoticiaBreveCard.tsx
import React from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react'; // Usamos Plus para el botón de etiquetas
import '../../styles/cards/NoticiaBreveCard.css';

interface NoticiaBreveCardProps {
  imagenSrc: string;
  altTexto: string;
  titulo: string;
  bajada: string; 
  autor?: string; 
  fecha: string; // Hacemos la fecha obligatoria
  linkVerMas: string;
  etiquetas: string[]; // Arreglo de strings para las etiquetas
}

export default function NoticiaBreveCard({ 
  imagenSrc, 
  altTexto, 
  titulo, 
  bajada, 
  autor,
  fecha,
  linkVerMas,
  etiquetas
}: NoticiaBreveCardProps) {

  // Mostrar solo las primeras 3 etiquetas para el diseño inicial
  const etiquetasVisibles = etiquetas.slice(0, 3);
  const etiquetasRestantes = etiquetas.length - etiquetasVisibles.length;

  return (
    <div className="noticia-breve-card">
      
      {/* 1. Columna de la Imagen */}
      <div className="noticia-image-container">
        <Image 
          src={imagenSrc}
          alt={altTexto}
          width={180} 
          height={280} 
          objectFit="fill"
          className="noticia-image"
        />
      </div>
      
      {/* 2. Columna del Contenido */}
      <div className="noticia-content">
        <h3 className="noticia-title">{titulo}</h3>
        {autor && <p className="noticia-author">Por {autor}</p>}
        <p className="noticia-bajada">{bajada}</p>
        
        {/* --- SECCIÓN DE ETIQUETAS --- */}
        <div className="noticia-tags">
          {etiquetasVisibles.map((tag, index) => (
            <span key={index} className="tag-item">
              {tag}
            </span>
          ))}
          {etiquetasRestantes > 0 && (
            <span className="tag-more">
              Etiquetas <Plus size={12} style={{ marginLeft: '2px' }}/>
            </span>
          )}
        </div>

        {/* --- SECCIÓN DE META Y BOTÓN VER MÁS --- */}
        <div className="noticia-footer">
          <p className="noticia-meta">
            {fecha}
          </p>
          <a href={linkVerMas} className="btn-leer-mas">
            Leer más
          </a>
        </div>
      </div>
      
    </div>
  );
}