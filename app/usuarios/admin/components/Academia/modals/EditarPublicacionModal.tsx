// screens/admin/modals/EditarPublicacionModal.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, Tag } from 'lucide-react';
// Reutilizamos el mismo CSS porque el diseño es idéntico
import '../../../styles/Academia/CrearPublicacionModal.css';

interface EditarPublicacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (publicacionActualizada: any) => void;
  publicacion: any; // El objeto que vamos a editar
}

export default function EditarPublicacionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  publicacion 
}: EditarPublicacionModalProps) {
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    bajada: '',
    autor: '',
    fecha: '',
    imagenSrc: '',
    etiquetasInput: ''
  });

  // Cargar datos cuando cambia la publicación o se abre el modal
  useEffect(() => {
    if (publicacion) {
      setFormData({
        titulo: publicacion.titulo || '',
        bajada: publicacion.bajada || '',
        autor: publicacion.autor || '',
        fecha: publicacion.fecha || '',
        imagenSrc: publicacion.imagenSrc || '',
        // Convertimos el array de etiquetas a string separado por comas
        etiquetasInput: publicacion.etiquetas ? publicacion.etiquetas.join(', ') : ''
      });
    }
  }, [publicacion, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Procesar etiquetas de vuelta a array
    const etiquetasArray = formData.etiquetasInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');

    // Objeto actualizado (Mantenemos el ID original)
    const publicacionActualizada = {
      ...publicacion, // Mantener propiedades que no editamos (como id)
      titulo: formData.titulo,
      bajada: formData.bajada,
      autor: formData.autor,
      fecha: formData.fecha,
      imagenSrc: formData.imagenSrc,
      altTexto: formData.titulo, // Actualizamos altTexto
      etiquetas: etiquetasArray
    };

    onSave(publicacionActualizada);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        
        <div className="modal-header">
          {/* Título diferente para diferenciar del creador */}
          <h2 className="modal-title">Editar Publicación</h2>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          
          <div className="form-group">
            <label>Título</label>
            <input 
              type="text" 
              name="titulo" 
              value={formData.titulo} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Descripción Corta</label>
            <textarea 
              name="bajada" 
              value={formData.bajada} 
              onChange={handleChange} 
              rows={3}
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Autor</label>
              <input 
                type="text" 
                name="autor" 
                value={formData.autor} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group half">
              <label>Fecha</label>
              <input 
                type="text" 
                name="fecha" 
                value={formData.fecha} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="form-group">
            <label><ImageIcon size={16}/> URL Imagen</label>
            <input 
              type="text" 
              name="imagenSrc" 
              value={formData.imagenSrc} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label><Tag size={16}/> Etiquetas (Separadas por comas)</label>
            <input 
              type="text" 
              name="etiquetasInput" 
              value={formData.etiquetasInput} 
              onChange={handleChange} 
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              <Save size={18} /> Guardar Cambios
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}