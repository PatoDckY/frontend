// components/SeccionServicios.tsx
import React from 'react';
import ServicioCard from './ServicioCard'; // Tarjeta Vertical
import ServicioCardHorizontal from './ServicioCardHorizontal'; // Tarjeta Horizontal
import '../styles/SeccionServicios.css'; 
// La imagen es única para todos
const IMAGEN_PEDIATRICA = "/pediatric-illustration.png";

// Define la interfaz de datos para los servicios
interface Servicio {
  id: number;
  altTexto: string;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  linkVerMas: string;
}

// Datos de ejemplo enfocados en Pediatría
const DATOS_SERVICIOS: Servicio[] = [
  {
    id: 1,
    altTexto: "Vacunación Infantil",
    titulo: "Control de Vacunación",
    descripcion: "Seguimiento exhaustivo del calendario de vacunación oficial y aplicación de dosis necesarias para proteger a su hijo.",
    ubicacion: "Sucursal Principal - 5 sedes",
    linkVerMas: "#",
  },
  {
    id: 2,
    altTexto: "Consulta de Niño Sano",
    titulo: "Consulta de Niño Sano",
    descripcion: "Evaluación periódica del crecimiento, desarrollo psicomotor y nutricional del bebé y el niño en cada etapa.",
    ubicacion: "Sucursal Principal - 3 sedes",
    linkVerMas: "#",
  },
  {
    id: 3,
    altTexto: "Urgencias Pediátricas 24h",
    titulo: "Urgencias Pediátricas 24h",
    descripcion: "Atención inmediata y especializada para fiebres altas, accidentes, crisis respiratorias y otras emergencias.",
    ubicacion: "Sucursal Principal - 1 sede",
    linkVerMas: "#",
  },
  {
    id: 4,
    altTexto: "Nutrición Infantil",
    titulo: "Nutrición Infantil",
    descripcion: "Planes dietéticos personalizados, manejo de alergias alimentarias y orientación sobre lactancia y ablactación.",
    ubicacion: "Todas las sucursales",
    linkVerMas: "#",
  },
  {
    id: 5,
    altTexto: "Control de Enfermedades Crónicas",
    titulo: "Control de Enfermedades Crónicas",
    descripcion: "Manejo y seguimiento de asma, diabetes infantil, problemas renales y otras condiciones crónicas.",
    ubicacion: "Sucursal Principal y Especialistas",
    linkVerMas: "#",
  },
  {
    id: 6,
    altTexto: "Evaluación del Desarrollo",
    titulo: "Evaluación del Desarrollo",
    descripcion: "Detección temprana de retrasos en el lenguaje, habilidades motoras o aprendizaje, con interconsulta a terapia.",
    ubicacion: "Especialistas en Desarrollo",
    linkVerMas: "#",
  },
  {
    id: 7,
    altTexto: "Dermatología Infantil",
    titulo: "Dermatología Infantil",
    descripcion: "Diagnóstico y tratamiento de afecciones de la piel comunes en niños: eczemas, dermatitis, acné infantil, etc.",
    ubicacion: "Especialistas en Piel",
    linkVerMas: "#",
  },
  {
    id: 8,
    altTexto: "Salud Mental y Comportamiento",
    titulo: "Salud Mental y Comportamiento",
    descripcion: "Evaluación inicial de problemas de comportamiento, ansiedad, TDAH y referencias a psicólogos infantiles.",
    ubicacion: "Servicio de Psicología",
    linkVerMas: "#",
  },
];

export default function SeccionServicios() {
  const serviciosVerticales = DATOS_SERVICIOS.slice(0, 4);
  const serviciosHorizontales = DATOS_SERVICIOS.slice(4, 8);

  return (
    <section className="seccion-servicios-container">
      <h2 className="servicios-titulo">Nuestros Servicios Pediátricos</h2>
      
      {/* --- 1. PRIMEROS 4 SERVICIOS (VERTICAL - 4 en fila) --- */}
      <div className="servicios-grid vertical-grid">
        {serviciosVerticales.map((servicio) => (
          <ServicioCard
            key={servicio.id}
            imagenSrc={IMAGEN_PEDIATRICA}
            altTexto={servicio.altTexto}
            titulo={servicio.titulo}
            descripcion={servicio.descripcion}
            ubicacion={servicio.ubicacion}
            linkVerMas={servicio.linkVerMas}
          />
        ))}
      </div>
      
      {/* --- 2. SIGUIENTES 4 SERVICIOS (HORIZONTAL - 2 filas, 2 en fila) --- */}
      <div className="servicios-grid horizontal-grid">
        {serviciosHorizontales.map((servicio) => (
          <ServicioCardHorizontal
            key={servicio.id}
            imagenSrc={IMAGEN_PEDIATRICA}
            altTexto={servicio.altTexto}
            titulo={servicio.titulo}
            descripcion={servicio.descripcion}
            ubicacion={servicio.ubicacion}
            linkVerMas={servicio.linkVerMas}
          />
        ))}
      </div>
      
      <div className="servicios-footer">
        <button className="btn-ver-todos">Ver Catálogo Completo</button>
      </div>
    </section>
  );
}