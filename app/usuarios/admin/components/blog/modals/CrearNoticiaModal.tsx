// screens/admin/modals/CrearNoticiaModal.tsx
"use client";
import React, { useState } from 'react';
import { X, Save, FileText, User, Calendar, Tag, Image as ImageIcon } from 'lucide-react';
import '../../../styles/blog/NoticiaModal.css'; // <--- CSS NUEVO

interface CrearNoticiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nuevaNoticia: any) => void;
}

export default function CrearNoticiaModal({ isOpen, onClose, onSave }: CrearNoticiaModalProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    bajada: '',
    autor: '',
    fecha: new Date().toLocaleDateString('es-MX'),
    imagenSrc: '',
    etiquetasInput: '',
    visible: true 
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const etiquetasArray = formData.etiquetasInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');

    const nuevaNoticia = {
      id: Date.now(),
      ...formData,
      etiquetas: etiquetasArray,
      imagenSrc: formData.imagenSrc || "/logo.png",
      altTexto: formData.titulo,
      linkVerMas: "#"
    };

    onSave(nuevaNoticia);
    setFormData({ titulo: '', bajada: '', autor: '', fecha: new Date().toLocaleDateString('es-MX'), imagenSrc: '', etiquetasInput: '', visible: true });
  };

  return (
    <div className="noticia-modal-overlay">
      <div className="noticia-modal-container">
        
        <div className="noticia-modal-header">
          <h2 className="noticia-modal-title"><FileText size={22}/> Nueva Publicación</h2>
          <button className="btn-close-noticia" onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="noticia-modal-form">
          
          <div className="form-group">
            <label>Título de la Noticia</label>
            <input name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Ej: Beneficios de la Lactancia" required />
          </div>

          <div className="form-group">
            <label>Resumen (Bajada)</label>
            <textarea name="bajada" value={formData.bajada} onChange={handleChange} rows={4} required />
          </div>

          <div className="form-row-noticia">
            <div className="form-group">
              <label><User size={14}/> Autor</label>
              <input name="autor" value={formData.autor} onChange={handleChange} placeholder="Dr. Juan Pérez" />
            </div>
            <div className="form-group">
              <label><Calendar size={14}/> Fecha Publicación</label>
              <input name="fecha" value={formData.fecha} onChange={handleChange} placeholder="DD/MM/AAAA" />
            </div>
          </div>

          <div className="form-group">
            <label><Tag size={14}/> Etiquetas (Separadas por coma)</label>
            <input name="etiquetasInput" value={formData.etiquetasInput} onChange={handleChange} placeholder="salud, nutrición, bebés" />
          </div>

          <div className="form-group">
            <label><ImageIcon size={14}/> URL Imagen</label>
            <input name="imagenSrc" value={formData.imagenSrc} onChange={handleChange} placeholder="https://..." />
          </div>

        </form>

        <div className="noticia-modal-footer">
            <button type="button" className="btn-noticia-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-noticia-save" onClick={(e) => handleSubmit(e as any)}>
                <Save size={18}/> Publicar
            </button>
        </div>

      </div>
    </div>
  );
}