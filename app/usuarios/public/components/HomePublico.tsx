// pages/HomePublico.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { Stethoscope, BookOpen, UserPlus, MapPin, ArrowRight } from 'lucide-react';

// Importamos componentes de las secciones que ya diseñamos
import MedicoCard from './cards/MedicoCard'; 
import NoticiaBreveCard from './cards/NoticiaBreveCard'; 
import ServicioCard from './cards/ServicioCard'; 
import CursoCard from './cards/CursoCard'; // <--- NUEVO IMPORT

import '../styles/HomePublico.css'; 

// --- DATOS SIMULADOS PARA EL HOME ---

const SERVICIOS_DESTACADOS = [
    {
        id: 1,
        imagenSrc: "/pediatric-illustration.png",
        altTexto: "Consulta",
        titulo: "Consulta de Niño Sano",
        descripcion: "Evaluación periódica del crecimiento y desarrollo de su hijo.",
        ubicacion: "Sucursal Principal y 2 más",
        linkVerMas: "/usuarios/public/screens/Servicios",
    },
    {
        id: 2,
        imagenSrc: "/pediatric-illustration.png",
        altTexto: "Vacunas",
        titulo: "Control de Vacunación",
        descripcion: "Seguimiento exhaustivo del calendario de vacunación oficial.",
        ubicacion: "Todas las sucursales",
        linkVerMas: "/usuarios/public/screens/Servicios",
    },
    {
        id: 3,
        imagenSrc: "/pediatric-illustration.png",
        altTexto: "Urgencias",
        titulo: "Urgencias Pediátricas",
        descripcion: "Atención inmediata para fiebres, accidentes y crisis respiratorias.",
        ubicacion: "Sucursal Principal",
        linkVerMas: "/usuarios/public/screens/Servicios",
    },
];

// --- NUEVOS DATOS PARA LA SECCIÓN DE CURSOS ---
const CURSOS_HOME = [
  {
    titulo: "Primeros Auxilios Pediátricos",
    descripcion: "Taller práctico esencial para padres. Aprende RCP y manejo de atragantamiento.",
    fechaInicio: "15 Nov 2025",
    fechaFin: "15 Nov 2025",
    fechaPublicacion: "01 Oct 2025",
    inscripcionesAbiertas: true,
    cupoMaximo: 20,
    cupoInscrito: 12,
    instructor: "Dr. Francisco Wong",
    horario: "Sábado 09:00 - 13:00",
    modalidad: "Presencial" as const,
    dirigidoA: "Padres" as const,
    estado: "Activo" as const,
    imagenSrc: "/logo.png", // Opcional
    costo: 800,
    ubicacion: "Auditorio Torre 2",
    categoria: "Salud",
    linkDetalle: "/usuarios/public/screens/CatalogoCursos"
  },
  {
    titulo: "Taller de Emociones Infantil",
    descripcion: "Espacio lúdico para que niños aprendan a gestionar sus emociones.",
    fechaInicio: "20 Nov 2025",
    fechaFin: "22 Nov 2025",
    fechaPublicacion: "10 Oct 2025",
    inscripcionesAbiertas: true,
    cupoMaximo: 10,
    cupoInscrito: 8,
    instructor: "Psic. Ana Torres",
    horario: "16:00 - 18:00",
    modalidad: "Presencial" as const,
    dirigidoA: "Niños" as const,
    estado: "Activo" as const,
    costo: 450,
    ubicacion: "Ludoteca Clínica",
    categoria: "Psicología",
    linkDetalle: "/usuarios/public/screens/CatalogoCursos"
  }
];

const MEDICO_DESTACADO = {
    id: 1,
    imagenSrc: "/Pichardo.jpg", 
    nombre: "Dr. FRANCISCO JAVIER MORENO PICHARDO",
    especialidad: "Pediatría Certificada",
    hospital: "Centro Médico Pichardo (Matriz)",
    torre: "Principal",
    consultorio: "101",
    direccion: "Av. Benito Juárez S/N, Huejutla de Reyes, Hidalgo.",
    linkVerMas: "/usuarios/public/screens/DirectorioMedico",
};

const NOTICIA_DESTACADA = {
    id: 1,
    imagenSrc: "/logo.png", 
    altTexto: "Lactancia materna",
    titulo: "Guía para Padres Primerizos: La Lactancia Materna",
    bajada: "Nuestros especialistas comparten consejos esenciales para un inicio exitoso en la lactancia, desmintiendo mitos comunes.",
    autor: "Nutrición Infantil",
    fecha: "15.11.2025",
    linkVerMas: "/usuarios/public/screens/Blog",
    etiquetas: ["lactancia", "nutricion", "bebe"],
};

export default function HomePublico() {
    return (
        <div className="home-publico-container">
            
            {/* --- 1. HERO BANNER --- */}
            <section className="hero-publico">
                <div className="hero-contenido">
                    <h1 className="hero-title">
                        Bienvenido al <span className="highlight-span">Centro Médico Pichardo</span>
                    </h1>

                    <p className="hero-text-large">
                        En el <strong>Centro Médico Pichardo</strong>, liderado por el{" "}
                        <strong>Dr. Francisco Javier Moreno Pichardo</strong>, médico pediatra,
                        ofrecemos atención médica integral para la salud y el bienestar de los niños de
                        <strong> Huejutla de Reyes, Hidalgo</strong>.
                    </p>

                    <p className="hero-text-small">
                        Nuestro compromiso es brindar un servicio cálido, profesional y humano,
                        cuidando cada detalle en el desarrollo y crecimiento saludable de los más pequeños.
                    </p>
                    
                    {/* Botones de Navegación Rápida */}
                    <div className="hero-cta-buttons">
                        <Link href="/usuarios/public/screens/DirectorioMedico" className="btn-hero-cta primary">
                            <Stethoscope size={20} /> Directorio Médico
                        </Link>
                        <Link href="/usuarios/public/screens/Academia" className="btn-hero-cta secondary">
                            <BookOpen size={20} /> Academia Infantil
                        </Link>
                    </div>
                </div>
            </section>
            
            {/* --- 2. SECCIÓN DE SERVICIOS DESTACADOS --- */}
            <section className="seccion-destacada servicios-destacados-grid">
                <h2 className="section-title">Servicios Esenciales para su Familia</h2>
                <div className="servicios-grid-home">
                    {SERVICIOS_DESTACADOS.map(servicio => (
                        <ServicioCard
                            key={servicio.id}
                            imagenSrc={servicio.imagenSrc}
                            altTexto={servicio.altTexto}
                            titulo={servicio.titulo}
                            descripcion={servicio.descripcion}
                            ubicacion={servicio.ubicacion}
                            linkVerMas={servicio.linkVerMas}
                        />
                    ))}
                </div>
                <div className="center-link-wrapper">
                    <Link href="/usuarios/public/screens/Servicios" className="link-ver-todo">
                        Ver todos nuestros Servicios &rarr;
                    </Link>
                </div>
            </section>

            {/* --- 3. NUEVA SECCIÓN: ACADEMIA INFANTIL (CURSOS) --- */}
            <section className="seccion-destacada cursos-home-section">
                <div className="header-flex">
                    <h2 className="section-title left-aligned" style={{marginBottom: 0}}>
                        Academia Infantil: Próximos Cursos
                    </h2>
                    {/* BOTÓN ADICIONAL PARA IR AL CATÁLOGO */}
                    <Link href="/usuarios/public/screens/CatalogoCursos" className="btn-ver-catalogo">
                        Ver Catálogo Completo <ArrowRight size={18}/>
                    </Link>
                </div>
                
                <p className="section-subtitle-home">
                    Talleres prácticos y charlas educativas para padres y niños, impartidos por nuestros especialistas.
                </p>

                <div className="cursos-home-grid">
                    {CURSOS_HOME.map((curso, index) => (
                        <CursoCard 
                            key={index}
                            {...curso}
                        />
                    ))}
                </div>
            </section>

            {/* --- 4. SECCIÓN SOBRE NOSOTROS Y MÉDICO DESTACADO --- */}
            <section className="seccion-destacada sobre-nosotros-medico">
                <div className="sobre-nosotros-contenido">
                    <h2 className="section-title left-aligned">Conozca a Nuestro Líder</h2>
                    <p>
                        El Centro Médico Pichardo es fundado y dirigido por el <strong>Dr. Francisco Javier Moreno Pichardo</strong>, un pediatra con años de experiencia y un enfoque humano y preventivo. Su compromiso con la salud de los niños de la región de **Huejutla** asegura que cada familia reciba la mejor atención.
                    </p>
                    <Link href="/usuarios/public/screens/QuienesSomos" className="link-ver-todo">
                        Nuestra Historia y Compromiso &rarr;
                    </Link>
                </div>
                
                <div className="medico-destacado-wrapper">
                    <MedicoCard 
                        imagenSrc={MEDICO_DESTACADO.imagenSrc}
                        nombre={MEDICO_DESTACADO.nombre}
                        especialidad={MEDICO_DESTACADO.especialidad}
                        hospital={MEDICO_DESTACADO.hospital}
                        direccion={MEDICO_DESTACADO.direccion}
                        linkVerMas={MEDICO_DESTACADO.linkVerMas}
                    />
                </div>
            </section>
            
            {/* --- 5. SECCIÓN DE NOTICIAS Y ACADEMIA (CTA) --- */}
            <section className="seccion-destacada noticias-y-academia">
                 <div className="noticias-content-wrapper">
                    <h2 className="section-title left-aligned">Últimas Noticias & Consejos</h2>
                    <NoticiaBreveCard 
                        imagenSrc={NOTICIA_DESTACADA.imagenSrc}
                        altTexto={NOTICIA_DESTACADA.altTexto}
                        titulo={NOTICIA_DESTACADA.titulo}
                        bajada={NOTICIA_DESTACADA.bajada}
                        autor={NOTICIA_DESTACADA.autor}
                        fecha={NOTICIA_DESTACADA.fecha}
                        linkVerMas={NOTICIA_DESTACADA.linkVerMas}
                        etiquetas={NOTICIA_DESTACADA.etiquetas}
                    />
                    <div className="center-link-wrapper">
                        <Link href="/usuarios/public/screens/Blog" className="link-ver-todo">
                            Ver todo el Blog &rarr;
                        </Link>
                    </div>
                </div>

                <div className="academia-cta-home">
                    <h2 className="section-title white-text">Conviértase en un Padre Experto</h2>
                    <p className="academia-cta-text">
                        Acceda a guías prácticas, talleres y cursos especializados para el desarrollo óptimo de sus hijos.
                    </p>
                    <Link href="/usuarios/public/screens/Academia" className="btn-academia-home">
                        <UserPlus size={20} /> Inscríbase a la Academia
                    </Link>
                </div>
            </section>

        </div>
    );
}