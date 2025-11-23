// components/BlogSidebarPediatria.tsx
import React from 'react';
import '../styles/BlogSidebar.css'; // Reutilizamos el CSS anterior

// Datos simulados enfocados en Pediatría
const CATEGORIAS_PED = [
  { nombre: "Vacunación", cuenta: 5 },
  { nombre: "Nutrición Infantil", cuenta: 12 },
  { nombre: "Desarrollo", cuenta: 8 },
  { nombre: "Urgencias", cuenta: 20 },
];

const ETIQUETAS_PED = [
  "pediatria", "vacunas", "salud mental", "nutricion", 
  "crecimiento", "alergias", "fiebre", "control niño sano"
];

export default function BlogSidebarPediatria() {
  return (
    <div className="blog-sidebar-container">
      
      {/* Sección de Categorías */}
      <div className="sidebar-section categorias-section">
        <h3 className="section-title">Categorías</h3>
        <ul className="categorias-list">
          {CATEGORIAS_PED.map((cat, index) => (
            <li key={index} className="categoria-item">
              <a href={`#`}>
                {cat.nombre}
              </a>
              <span className="categoria-count">({cat.cuenta})</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Sección de Etiquetas */}
      <div className="sidebar-section etiquetas-section">
        <h3 className="section-title">Etiquetas</h3>
        <div className="etiquetas-cloud">
          {ETIQUETAS_PED.map((tag, index) => (
            <a 
              key={index} 
              href={`#`}
              className="etiqueta-link"
            >
              {tag}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}