// screens/admin/modals/EditarNoticiaModal.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { X, Save, FileText, User, Calendar, Tag, Image as ImageIcon } from 'lucide-react';
import '../../../styles/blog/NoticiaModal.css'; // <--- CSS NUEVO

interface EditarNoticiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (noticiaActualizada: any) => void;
  noticia: any;
}

export default function EditarNoticiaModal({ isOpen, onClose, onSave, noticia }: EditarNoticiaModalProps) {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (noticia) {
      setFormData({
        ...noticia,
        etiquetasInput: noticia.etiquetas ? noticia.etiquetas.join(', ') : ''
      });
    }
  }, [noticia, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const etiquetasArray = formData.etiquetasInput
      .split(',')
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag !== '');

    const noticiaActualizada = {
      ...noticia,
      ...formData,
      etiquetas: etiquetasArray
    };

    onSave(noticiaActualizada);
    onClose();
  };

  return (
    <div className="noticia-modal-overlay">
      <div className="noticia-modal-container">
        
        <div className="noticia-modal-header">
          <h2 className="noticia-modal-title"><FileText size={22}/> Editar Publicación</h2>
          <button className="btn-close-noticia" onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="noticia-modal-form">
          
          <div className="form-group">
            <label>Título</label>
            <input name="titulo" value={formData.titulo} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Resumen</label>
            <textarea name="bajada" value={formData.bajada} onChange={handleChange} rows={4} required />
          </div>

          <div className="form-row-noticia">
            <div className="form-group">
              <label><User size={14}/> Autor</label>
              <input name="autor" value={formData.autor} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label><Calendar size={14}/> Fecha</label>
              <input name="fecha" value={formData.fecha} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label><Tag size={14}/> Etiquetas</label>
            <input name="etiquetasInput" value={formData.etiquetasInput} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label><ImageIcon size={14}/> URL Imagen</label>
            <input name="imagenSrc" value={formData.imagenSrc} onChange={handleChange} />
          </div>

        </form>

        <div className="noticia-modal-footer">
            <button type="button" className="btn-noticia-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-noticia-save" onClick={(e) => handleSubmit(e as any)}>
                <Save size={18}/> Guardar Cambios
            </button>
        </div>

      </div>
    </div>
  );
}