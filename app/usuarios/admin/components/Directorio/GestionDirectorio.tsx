// screens/admin/GestionDirectorio.tsx
"use client";
import React, { useState } from 'react';
import { Search, SlidersHorizontal, PlusCircle, Users, Edit, Trash2 } from 'lucide-react';
import MedicoCard from '../../../public/components/cards/MedicoCard'; // Reutilizamos la tarjeta visual
//import CrearMedicoModal from './modals/CrearMedicoModal'; // (Debes crear este modal similar al de publicaciones)
//import EditarMedicoModal from './modals/EditarMedicoModal'; // (Debes crear este modal similar al de publicaciones)
import '../../styles/Academia/GestionDirectorio.css'; // CSS Específico de Admin

// --- DATOS DE EJEMPLO ---
const MEDICOS_INICIALES = [
  {
    id: 1,
    imagenSrc: "/Pichardo.jpg",
    nombre: "Dr. Francisco Javier Moreno Pichardo",
    especialidad: "Pediatría",
    hospital: "Centro Medico Pichardo",
    torre: "Principal",
    consultorio: "101",
    direccion: "Calle Alcatraz colonia los prados...",
    linkVerMas: "#",
  },
  {
    id: 2,
    imagenSrc: "/logo.png", // Placeholder
    nombre: "Dra. Ana Torres",
    especialidad: "Psicología Infantil",
    hospital: "Centro Medico Pichardo",
    torre: "B",
    consultorio: "205",
    direccion: "Av. Revolución...",
    linkVerMas: "#",
  }
];

export default function GestionDirectorio() {
    const [medicos, setMedicos] = useState(MEDICOS_INICIALES);
    const [busqueda, setBusqueda] = useState("");
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [medicoAEditar, setMedicoAEditar] = useState<any>(null);

    // --- FILTRADO ---
    const medicosFiltrados = medicos.filter(medico => 
        medico.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        medico.especialidad.toLowerCase().includes(busqueda.toLowerCase())
    );

    // --- FUNCIONES CRUD ---
    const handleCreate = () => setCreateModalOpen(true);

    const guardarNuevoMedico = (nuevoMedico: any) => {
        setMedicos([...medicos, nuevoMedico]);
        setCreateModalOpen(false);
    };

    const handleEdit = (id: number) => {
        const medico = medicos.find(m => m.id === id);
        if (medico) {
            setMedicoAEditar(medico);
            setEditModalOpen(true);
        }
    };

    const actualizarMedico = (medicoActualizado: any) => {
        setMedicos(prev => prev.map(m => m.id === medicoActualizado.id ? medicoActualizado : m));
        setEditModalOpen(false);
        setMedicoAEditar(null);
    };

    const handleDelete = (id: number) => {
        if (confirm("¿Estás seguro de eliminar a este médico del directorio?")) {
            setMedicos(prev => prev.filter(m => m.id !== id));
        }
    };

    return (
        <div className="admin-directorio-container">
            
            {/* --- 1. HEADER DE GESTIÓN --- */}
            <header className="admin-directorio-header">
                <div className="header-background"></div>
                <div className="header-content">
                    <h1 className="header-title">Gestión de Directorio Médico</h1>
                    <p className="header-subtitle">Administra el catálogo de especialistas visibles para los pacientes.</p>
                </div>
            </header>

            {/* --- 2. BARRA DE HERRAMIENTAS Y BÚSQUEDA --- */}
            <div className="admin-tools-wrapper">
                <div className="admin-tools-card">
                    
                    {/* Buscador */}
                    <div className="search-section">
                        <div className="search-input-wrapper">
                            <Search size={20} className="search-icon"/>
                            <input 
                                type="text" 
                                placeholder="Buscar médico por nombre o especialidad..." 
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>
                        <button className="btn-filters">
                            <SlidersHorizontal size={18} /> Filtros
                        </button>
                    </div>

                    {/* Acciones Admin */}
                    <div className="actions-section">
                        <button className="btn-admin-create" onClick={handleCreate}>
                            <PlusCircle size={20} /> Nuevo Médico
                        </button>
                        <div className="stats-badge">
                            <Users size={16} /> 
                            <span>{medicos.length} Registrados</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- 3. GRID DE MÉDICOS CON CONTROLES --- */}
            <main className="admin-directorio-content">
                {medicosFiltrados.length > 0 ? (
                    <div className="admin-medicos-grid">
                        {medicosFiltrados.map(medico => (
                            <div key={medico.id} className="admin-medico-wrapper">
                                
                                {/* Tarjeta Visual (Reutilizada) */}
                                <MedicoCard 
                                    imagenSrc={medico.imagenSrc}
                                    nombre={medico.nombre}
                                    especialidad={medico.especialidad}
                                    hospital={medico.hospital}
                                    direccion={medico.direccion}
                                    linkVerMas="#" // En admin no redirige
                                />

                                {/* Panel de Control (Overlay) */}
                                <div className="medico-controls">
                                    <button 
                                        className="btn-control-medico edit"
                                        onClick={() => handleEdit(medico.id)}
                                    >
                                        <Edit size={16} /> Editar
                                    </button>
                                    <button 
                                        className="btn-control-medico delete"
                                        onClick={() => handleDelete(medico.id)}
                                    >
                                        <Trash2 size={16} /> Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">No se encontraron médicos.</div>
                )}
            </main>

            {/* --- MODALES --- */}
            {/* Aquí irían tus componentes CrearMedicoModal y EditarMedicoModal */}
            {/* <CrearMedicoModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onSave={guardarNuevoMedico} /> */}
            {/* <EditarMedicoModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} onSave={actualizarMedico} medico={medicoAEditar} /> */}

        </div>
    );
}