// components/DirectorioMedicos.tsx
"use client";
import React, { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import MedicoCard from './MedicoCard'; // Importamos la tarjeta de médico
import '../styles/DirectorioMedicos.css';

// --- DATOS DE EJEMPLO ---
const MEDICOS = [
  {
    id: 1,
    imagenSrc: "/Pichardo.jpg", // Asegúrate de tener estas imágenes
    nombre: "Dr. Francisco Javier Moreno Pichardo",
    especialidad: "Pediatría",
    hospital: "Centro Medico Pichardo",
    direccion: "Calle Alcatraz colonia los prados a cien metros de la asociación del jubilado y pensionado sobre la terracería centro médico Pichardo",
    linkVerMas: "#",
  }
];

export default function DirectorioMedicos() {
    // Estado simulado para la pestaña activa (puro diseño)
    const [activeTab, setActiveTab] = useState('medicos'); 
    
    // Función de envío deshabilitada (puro diseño)
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Búsqueda simulada...");
    };

    return (
        <div className="directorio-page-container">
            {/* --- 1. Encabezado y Fondo Azul --- */}
            <header className="directorio-header">
                <div className="header-background"></div>
                <h1 className="header-title">Directorio</h1>
            </header>

            {/* --- 2. Barra de Búsqueda y Filtros --- */}
            <div className="search-bar-wrapper">
                <div className="search-card">
                    
                    <div className="tab-selector">
                        <button 
                            className={`tab-btn ${activeTab === 'medicos' ? 'active' : ''}`}
                            onClick={() => setActiveTab('medicos')}
                        >
                            Médicos
                        </button>
                    </div>

                    <form className="search-form" onSubmit={handleSearchSubmit}>
                        <input 
                            type="text" 
                            placeholder="pediatría" 
                            className="search-input"
                        />
                        <button type="submit" className="search-btn">
                            <Search size={20} />
                        </button>
                        <button type="button" className="filters-btn">
                            <SlidersHorizontal size={20} />
                            Filtros
                        </button>
                    </form>
                </div>
            </div>

            {/* --- 3. Resultados y Título Secundario --- */}
            <main className="directorio-main-content">
                <h2 className="section-subtitle">Médicos</h2>

                <div className="medicos-grid">
                    {MEDICOS.map(medico => (
                        <MedicoCard 
                            key={medico.id}
                            imagenSrc={medico.imagenSrc}
                            nombre={medico.nombre}
                            especialidad={medico.especialidad}
                            hospital={medico.hospital}
                            direccion={medico.direccion}
                            linkVerMas={medico.linkVerMas}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}