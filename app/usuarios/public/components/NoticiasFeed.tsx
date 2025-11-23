// components/NoticiasFeed.tsx - Diseño Mejorado
import React from 'react';
import NoticiaBreveCard from './cards/NoticiaBreveCard'; 
import BlogSidebarPediatria from './SideBars/BlogSidebarPediatria'; 
import '../styles/NoticiasFeed.css'; 

// Datos de Noticias Pediátricas (Primer artículo destacado)
const NOTICIAS_PED = [
  {
    id: 1,
    imagenSrc: "/logo.png",
    altTexto: "Niño recibiendo vacuna",
    titulo: "Nueva Guía de Vacunación: Protegiendo a nuestros Niños",
    bajada: "El Comité Pediátrico Internacional ha actualizado las recomendaciones para la vacunación infantil en 2025, enfocándose en la prevención de virus respiratorios y sarampión.",
    autor: "Dr. Pérez",
    fecha: "20.11.2025 10:30",
    linkVerMas: "#",
    etiquetas: ["vacunas", "prevencion", "salud infantil", "protocolo", "noticias"],
  },
  {
    id: 2,
    imagenSrc: "/logo.png",
    altTexto: "Alimentos saludables para niños",
    titulo: "Importancia de la Vitamina D en el Desarrollo Óseo Infantil",
    bajada: "Especialistas en nutrición destacan la necesidad de suplementar la Vitamina D en infantes, especialmente en regiones con baja exposición solar, para evitar el raquitismo.",
    autor: "Dra. Rodríguez",
    fecha: "18.11.2025 09:00",
    linkVerMas: "#",
    etiquetas: ["nutricion", "desarrollo", "dieta", "vitaminas"],
  },
];

export default function NoticiasFeed() {
  const noticiaDestacada = NOTICIAS_PED[0];
  const otrasNoticias = NOTICIAS_PED.slice(1);

  return (
    <div className="noticias-feed-layout">
      
      {/* Columna Principal de Contenido */}
      <div className="noticias-content-area">
        <h1 className="blog-category-main-title">Blog: Noticias Pediátricas</h1>
        
        <div className="noticias-grid-wrapper">
          
          {/* 1. Área de Noticia Destacada (Full-width card, con diseño de entrada de blog más grande) */}
          <div className="noticia-destacada">
             <NoticiaBreveCard
                imagenSrc={noticiaDestacada.imagenSrc}
                altTexto={noticiaDestacada.altTexto}
                titulo={noticiaDestacada.titulo}
                bajada={noticiaDestacada.bajada}
                autor={noticiaDestacada.autor}
                fecha={noticiaDestacada.fecha}
                linkVerMas={noticiaDestacada.linkVerMas}
                etiquetas={noticiaDestacada.etiquetas}
            />
          </div>

          {/* 2. Área de Otras Noticias (Horizontal, si hubiera más de una) */}
          <div className="otras-noticias-list">
            {otrasNoticias.map(noticia => (
              <NoticiaBreveCard
                key={noticia.id}
                imagenSrc={noticia.imagenSrc}
                altTexto={noticia.altTexto}
                titulo={noticia.titulo}
                bajada={noticia.bajada}
                autor={noticia.autor}
                fecha={noticia.fecha}
                linkVerMas={noticia.linkVerMas}
                etiquetas={noticia.etiquetas}
              />
            ))}
          </div>

        </div> {/* /.noticias-grid-wrapper */}
      </div> {/* /.noticias-content-area */}

      {/* Columna de la Barra Lateral */}
      <div className="noticias-sidebar-area">
        <BlogSidebarPediatria />
      </div>
    </div>
  );
}