// pages/AcademiaInfantil.tsx
"use client";
import React from 'react';
import NoticiaBreveCard from '../components/NoticiaBreveCard'; 
import BlogSidebarPediatria from '../components/BlogSidebarPediatria'; 
import { ArrowRightCircle, BookOpen } from 'lucide-react';
import '../styles/AcademiaInfantil.css'; 

// --- DATOS DE NOTICIAS DE EJEMPLO (Sin cambios) ---
const NOTICIAS_ACADEMIA = [
  // ... (datos de noticias) ...
  {
    id: 1,
    imagenSrc: "/logo.png",
    altTexto: "Niño jugando con bloques",
    titulo: "Hitos Clave del Desarrollo del Lenguaje en los Primeros 3 Años",
    bajada: "Identificar las etapas cruciales del habla y lenguaje puede ayudar a los padres a detectar a tiempo posibles retrasos.",
    autor: "Equipo de Desarrollo",
    fecha: "20.11.2025",
    linkVerMas: "#",
    etiquetas: ["lenguaje", "desarrollo", "psicomotor", "hitos"],
  },
  {
    id: 2,
    imagenSrc: "/logo.png",
    altTexto: "Padre consolando a un niño",
    titulo: "Estrategias Efectivas para el Manejo de Rabietas y Berrinches",
    bajada: "Aprenda técnicas de disciplina positiva que promueven la inteligencia emocional y el manejo de frustraciones en preescolares.",
    autor: "Psicología Infantil",
    fecha: "18.11.2025",
    linkVerMas: "#",
    etiquetas: ["comportamiento", "crianza", "emocional", "limites"],
  },
];

export default function AcademiaInfantil() {
  return (
    <div className="academia-page-container">
      
      {/* --- SECCIÓN PRINCIPAL DE HERO BANNER (Mensaje Destacado) --- */}
      <div className="academia-hero-banner">
        <div className="hero-content">
          {/* TÍTULO INCENTIVADOR */}
          <h1 className="hero-title">
            Tu aliado de confianza en la aventura de la paternidad.
          </h1>
          {/* SUBTÍTULO Y LLAMADA A LA ACCIÓN */}
          <p className="hero-subtitle">
            Hemos diseñado esta sección como una extensión del cuidado profesional que ofrecemos. Aquí encontrarás recursos, consejos y guías prácticas, además de acceso a cursos y talleres especializados para promover el desarrollo óptimo y seguro de tus hijos. 
          </p>
          <p className="hero-subtitle">
            ¡Empieza hoy a nutrir tu rol como padre!
          </p>
        </div>
        
        {/* Botón de Acción Principal y Llamativo */}
        <div className="academia-cta-wrapper">
          <a href="/usuarios/public/screens/CatalogoCursos" className="btn-cursos-disponibles">
            <BookOpen size={24} />
            Cursos & Talleres Disponibles
            <ArrowRightCircle size={20} />
          </a>
        </div>
      </div>

      {/* --- LAYOUT DE CONTENIDO Y SIDEBAR --- */}
      <div className="academia-layout-grid">
        
        {/* Columna Principal: Información Relevante Constante */}
        <div className="academia-content-area">
          <h2 className="content-section-title">Guías Prácticas y Novedades</h2>
          
          <div className="publicaciones-list">
            {NOTICIAS_ACADEMIA.map(noticia => (
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
            <NoticiaBreveCard key={3} imagenSrc="/logo.png" altTexto="Alimentación" titulo="Introducción de Sólidos: El Método BLW" bajada="Descubre el método Baby-Led Weaning, una aproximación donde el bebé guía su propia alimentación." autor="Nutrición" fecha="05.11.2025" linkVerMas="#" etiquetas={["nutricion", "BLW", "alimentacion"]} />
          </div>
        </div>

        {/* Barra Lateral: Categorías y Guías Rápidas */}
        <div className="academia-sidebar-area">
          <BlogSidebarPediatria />
        </div>
      </div>
    </div>
  );
}