// screens/admin/modals/CrearPublicacionModal.tsx
"use client";
import React, { useState } from 'react';
import { X, Save, Image as ImageIcon, Tag } from 'lucide-react';
import '../../../styles/Academia/CrearPublicacionModal.css';

interface CrearPublicacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nuevaPublicacion: any) => void;
}

export default function CrearPublicacionModal({ isOpen, onClose, onSave }: CrearPublicacionModalProps) {
  // Estado del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    bajada: '',
    autor: '',
    fecha: new Date().toLocaleDateString('es-MX'), // Fecha de hoy por defecto
    imagenSrc: '', // Por ahora texto (URL), idealmente sería un upload
    etiquetasInput: '' // Texto separado por comas
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Procesar etiquetas (separar por comas y limpiar espacios)
    const etiquetasArray = formData.etiquetasInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');

    // Crear objeto final
    const nuevaPublicacion = {
      id: Date.now(), // ID temporal único
      titulo: formData.titulo,
      bajada: formData.bajada,
      autor: formData.autor,
      fecha: formData.fecha,
      imagenSrc: formData.imagenSrc || "/logo.png", // Imagen por defecto si no pone nada
      altTexto: formData.titulo,
      linkVerMas: "#",
      etiquetas: etiquetasArray
    };

    onSave(nuevaPublicacion);
    
    // Limpiar formulario (opcional)
    setFormData({
        titulo: '', bajada: '', autor: '', fecha: new Date().toLocaleDateString('es-MX'), 
        imagenSrc: '', etiquetasInput: ''
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        
        {/* Header del Modal */}
        <div className="modal-header">
          <h2 className="modal-title">Nueva Publicación</h2>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Cuerpo del Formulario */}
        <form onSubmit={handleSubmit} className="modal-form">
          
          <div className="form-group">
            <label>Título de la Guía o Noticia</label>
            <input 
              type="text" 
              name="titulo" 
              value={formData.titulo} 
              onChange={handleChange} 
              placeholder="Ej: Importancia de la Vacunación..." 
              required 
            />
          </div>

          <div className="form-group">
            <label>Descripción Corta (Bajada)</label>
            <textarea 
              name="bajada" 
              value={formData.bajada} 
              onChange={handleChange} 
              placeholder="Resumen breve del contenido..." 
              rows={3}
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Autor / Especialista</label>
              <input 
                type="text" 
                name="autor" 
                value={formData.autor} 
                onChange={handleChange} 
                placeholder="Ej: Dr. Pérez" 
              />
            </div>
            <div className="form-group half">
              <label>Fecha de Publicación</label>
              <input 
                type="text" 
                name="fecha" 
                value={formData.fecha} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="form-group">
            <label><ImageIcon size={16}/> URL de la Imagen (Opcional)</label>
            <input 
              type="text" 
              name="imagenSrc" 
              value={formData.imagenSrc} 
              onChange={handleChange} 
              placeholder="https://..." 
            />
          </div>

          <div className="form-group">
            <label><Tag size={16}/> Etiquetas (Separadas por comas)</label>
            <input 
              type="text" 
              name="etiquetasInput" 
              value={formData.etiquetasInput} 
              onChange={handleChange} 
              placeholder="Ej: salud, nutrición, bebés" 
            />
          </div>

          {/* Footer del Modal (Acciones) */}
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              <Save size={18} /> Guardar Publicación
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}