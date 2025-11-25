// screens/admin/GestionServicios.tsx
"use client";
import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, Layers } from 'lucide-react';
import ServicioCard from '../../../public/components/cards/ServicioCard';
import ServicioCardHorizontal from '../../../public/components/cards/ServicioCardHorizontal';
import ServicioModal from './modals/ServicioModal';
import TipoServicioModal from './modals/TipoServicioModal'; // IMPORTAR NUEVO MODAL
import '../../styles/Servicios/GestionServicios.css'; 

export type Servicio = {
  id: number;
  altTexto: string;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  linkVerMas: string;
  imagenSrc?: string;
  tipo: 'vertical' | 'horizontal'; // AHORA EL TIPO ES OBLIGATORIO
};

// Datos iniciales actualizados con el campo 'tipo'
const DATOS_INICIALES: Servicio[] = [
  {
    id: 1,
    altTexto: "Vacunación Infantil",
    titulo: "Control de Vacunación",
    descripcion: "Seguimiento exhaustivo...",
    ubicacion: "Sucursal Principal",
    linkVerMas: "#",
    tipo: 'vertical'
  },
  {
    id: 2,
    altTexto: "Consulta Niño Sano",
    titulo: "Consulta de Niño Sano",
    descripcion: "Evaluación periódica...",
    ubicacion: "Sucursal Principal",
    linkVerMas: "#",
    tipo: 'vertical'
  },
  {
    id: 3,
    altTexto: "Urgencias",
    titulo: "Urgencias 24h",
    descripcion: "Atención inmediata...",
    ubicacion: "Sucursal Principal",
    linkVerMas: "#",
    tipo: 'horizontal'
  },
  // ... agrega más datos con su tipo correspondiente
];

const IMAGEN_PEDIATRICA = "/pediatric-illustration.png";

export default function GestionServicios() {
  const [servicios, setServicios] = useState<Servicio[]>(DATOS_INICIALES);
  
  // Estados de Modales
  const [isTypeModalOpen, setTypeModalOpen] = useState(false); // Modal de Selección
  const [isFormModalOpen, setFormModalOpen] = useState(false); // Modal de Formulario
  
  const [servicioAEditar, setServicioAEditar] = useState<Servicio | null>(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState<'vertical' | 'horizontal'>('vertical');

  // Filtrar visualmente por tipo
  const serviciosVerticales = servicios.filter(s => s.tipo === 'vertical');
  const serviciosHorizontales = servicios.filter(s => s.tipo === 'horizontal');

  // --- FLUJO DE CREACIÓN ---
  
  // 1. Clic en "Nuevo Servicio" -> Abre selector de tipo
  const handleStartCreate = () => {
    setServicioAEditar(null);
    setTypeModalOpen(true);
  };

  // 2. Usuario selecciona tipo -> Cierra selector, abre formulario
  const handleTypeSelected = (tipo: 'vertical' | 'horizontal') => {
    setTipoSeleccionado(tipo);
    setTypeModalOpen(false);
    setTimeout(() => setFormModalOpen(true), 100); // Pequeño delay para transición suave
  };

  // --- EDICIÓN ---
  const handleEdit = (servicio: Servicio) => {
    setServicioAEditar(servicio);
    setFormModalOpen(true); // Directo al formulario, ya tiene tipo
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de eliminar este servicio?")) {
      setServicios(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleSave = (servicioGuardado: Servicio) => {
    if (servicioAEditar) {
      setServicios(prev => prev.map(s => s.id === servicioGuardado.id ? servicioGuardado : s));
    } else {
      setServicios([...servicios, { ...servicioGuardado, id: Date.now() }]);
    }
    setFormModalOpen(false);
  };

  return (
    <div className="admin-servicios-container">
      
      {/* HEADER */}
      <div className="admin-toolbar">
        <div className="toolbar-info">
            <h1 className="admin-title">Gestión de Servicios Médicos</h1>
            <p className="admin-subtitle">Administra la oferta de servicios visibles en la página principal.</p>
        </div>
        <div className="toolbar-actions">
            <button className="btn-admin-create" onClick={handleStartCreate}>
                <PlusCircle size={20} /> Nuevo Servicio
            </button>
        </div>
      </div>

      {/* --- SECCIÓN VERTICAL --- */}
      <div className="seccion-label">
        <Layers size={18} /> 
        <span>Servicios Verticales (Destacados)</span>
      </div>

      <div className="servicios-grid vertical-grid">
        {serviciosVerticales.map((servicio) => (
          <div key={servicio.id} className="admin-servicio-wrapper vertical">
            <ServicioCard
              imagenSrc={servicio.imagenSrc || IMAGEN_PEDIATRICA}
              altTexto={servicio.altTexto}
              titulo={servicio.titulo}
              descripcion={servicio.descripcion}
              ubicacion={servicio.ubicacion}
              linkVerMas="#"
            />
            <div className="card-overlay-controls">
                <button onClick={() => handleEdit(servicio)} className="btn-icon edit"><Edit size={16}/></button>
                <button onClick={() => handleDelete(servicio.id)} className="btn-icon delete"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
        {serviciosVerticales.length === 0 && <p className="empty-msg">No hay servicios verticales.</p>}
      </div>

      {/* --- SECCIÓN HORIZONTAL --- */}
      <div className="seccion-label mt-large">
        <Layers size={18} /> 
        <span>Servicios Horizontales (Listado)</span>
      </div>

      <div className="servicios-grid horizontal-grid">
        {serviciosHorizontales.map((servicio) => (
          <div key={servicio.id} className="admin-servicio-wrapper horizontal">
            <ServicioCardHorizontal
              imagenSrc={servicio.imagenSrc || IMAGEN_PEDIATRICA}
              altTexto={servicio.altTexto}
              titulo={servicio.titulo}
              descripcion={servicio.descripcion}
              ubicacion={servicio.ubicacion}
              linkVerMas="#"
            />
            <div className="card-side-controls">
                <button onClick={() => handleEdit(servicio)} className="btn-icon edit"><Edit size={18}/></button>
                <button onClick={() => handleDelete(servicio.id)} className="btn-icon delete"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
        {serviciosHorizontales.length === 0 && <p className="empty-msg">No hay servicios horizontales.</p>}
      </div>

      {/* --- MODALES --- */}
      
      {/* 1. Selector de Tipo */}
      <TipoServicioModal 
        isOpen={isTypeModalOpen}
        onClose={() => setTypeModalOpen(false)}
        onSelect={handleTypeSelected}
      />

      {/* 2. Formulario de Datos */}
      <ServicioModal 
        isOpen={isFormModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSave={handleSave}
        servicio={servicioAEditar}
        tipoPreseleccionado={tipoSeleccionado}
      />

    </div>
  );
}