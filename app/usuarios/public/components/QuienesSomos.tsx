// pages/QuienesSomos.tsx
"use client";
import React from 'react';
import Image from 'next/image';
import { Target, Eye, Handshake, Heart } from 'lucide-react';
import '../styles/QuienesSomos.css';

export default function QuienesSomos() {
  return (
    <div className="quienes-somos-container">
      
      {/* --- SECCIÓN HERO Y TÍTULO --- */}
      <header className="quienes-somos-header">
        <div className="header-content">
          <h1 className="main-title">
            Centro Médico Pichardo: <span className="highlight-text">Cuidado Pediátrico con Propósito</span>
          </h1>
          <p className="intro-text">
            Somos más que una clínica; somos el aliado de su familia en el viaje más importante: el crecimiento y bienestar de sus hijos.
          </p>
        </div>
      </header>
      
      {/* --- SECCIÓN DE COMPROMISO (Misión, Visión, Valores) --- */}
      <section className="compromiso-mvv">
        <div className="compromiso-card">
          <Target size={36} className="mvv-icon mission-icon" />
          <h2 className="mvv-title">Misión</h2>
          <p className="mvv-description">
            Proveer atención médica pediátrica de la más alta calidad, centrada en la evidencia científica, la calidez humana y la prevención, asegurando el desarrollo pleno y seguro de cada niño.
          </p>
        </div>

        <div className="compromiso-card">
          <Eye size={36} className="mvv-icon vision-icon" />
          <h2 className="mvv-title">Visión</h2>
          <p className="mvv-description">
            Ser el centro pediátrico de referencia a nivel nacional, reconocido por la excelencia en el diagnóstico, la innovación en tratamientos y el compromiso con la salud integral de la familia.
          </p>
        </div>
        
        <div className="compromiso-card">
          <Handshake size={36} className="mvv-icon values-icon" />
          <h2 className="mvv-title">Valores</h2>
          <ul className="values-list">
            <li><Heart size={16} /> Humanidad y Empatía</li>
            <li><Heart size={16} /> Excelencia Médica</li>
            <li><Heart size={16} /> Confianza y Transparencia</li>
            <li><Heart size={16} /> Innovación Constante</li>
          </ul>
        </div>
      </section>
      
      {/* --- SECCIÓN DE HISTORIA Y COMPROMISO (Texto e Imagen) --- */}
      <section className="historia-y-compromiso">
        
        <div className="historia-content">
          <h2 className="content-title">Nuestra Historia y Compromiso</h2>
          <p>
            Fundado hace más de una década, el Centro Médico Pichardo nació de la profunda convicción de que los niños merecen un cuidado especializado que combine la tecnología avanzada con un trato personal y afectuoso. Nuestro equipo de pediatras, subespecialistas y personal de apoyo está unido por el mismo juramento: ofrecer lo mejor de nosotros en cada consulta.
          </p>
          <p>
            Entendemos que la salud infantil es dinámica. Por ello, mantenemos una filosofía de mejora continua, integrando la investigación pediátrica más reciente en nuestros protocolos. Desde la etapa neonatal hasta la adolescencia, estamos aquí para guiar a los padres con información clara y profesional.
          </p>
          <p>
            **¡Su tranquilidad es nuestro motor!** Confíe en nuestra trayectoria para cuidar de quienes más ama.
          </p>
        </div>
        
        {/* Ilustración Pediátrica (Se usa la ilustración conocida) */}
        <div className="historia-image-wrapper">
          <Image 
            src="/pediatric-illustration.png" 
            alt="Ilustración de cuidado pediátrico"
            width={450}
            height={450}
            className="historia-image"
          />
        </div>
        
      </section>
      
    </div>
  );
}