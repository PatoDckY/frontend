// screens/admin/modals/ServicioModal.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { X, Save, Stethoscope, MapPin, FileText, Image as ImageIcon } from 'lucide-react';
import '../../../styles/Servicios/ServicioModal.css'; // Reutilizamos tu CSS de modales existente

// Importamos el tipo desde el padre o lo definimos aquí
// Actualizamos el Tipo para incluir 'tipo'
type Servicio = {
  id?: number;
  altTexto: string;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  linkVerMas: string;
  imagenSrc?: string;
  tipo?: 'vertical' | 'horizontal'; // NUEVO CAMPO
};

interface ServicioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (servicio: any) => void;
  servicio: Servicio | null;
  tipoPreseleccionado?: 'vertical' | 'horizontal'; // NUEVA PROP
}

export default function ServicioModal({ isOpen, onClose, onSave, servicio, tipoPreseleccionado }: ServicioModalProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    ubicacion: '',
    imagenSrc: '',
    altTexto: ''
  });

  useEffect(() => {
    if (servicio) {
      setFormData({
        titulo: servicio.titulo,
        descripcion: servicio.descripcion,
        ubicacion: servicio.ubicacion,
        imagenSrc: servicio.imagenSrc || '',
        altTexto: servicio.altTexto
      });
    } else {
      setFormData({ titulo: '', descripcion: '', ubicacion: '', imagenSrc: '', altTexto: '' });
    }
  }, [servicio, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const datosFinales = {
      ...servicio,
      ...formData,
      linkVerMas: "#",
      // Si estamos editando, mantenemos el tipo original. Si es nuevo, usamos el preseleccionado.
      tipo: servicio?.tipo || tipoPreseleccionado || 'vertical' 
    };
    onSave(datosFinales);
  };

  // ... (El resto del return y formulario se mantiene IGUAL) ...
  // Solo asegúrate de usar el componente como lo definimos aquí.
  return (
      // ... contenido del modal ...
      <div className="service-modal-overlay">
          <div className="service-modal-container">
              {/* ... Header y Formulario igual que antes ... */}
              <div className="service-modal-header">
                  <h2 className="service-modal-title">
                      {/* Mostrar qué tipo se está creando */}
                      <Stethoscope size={22}/> 
                      {servicio ? 'Editar Servicio' : `Nuevo Servicio (${tipoPreseleccionado === 'vertical' ? 'Vertical' : 'Horizontal'})`}
                  </h2>
                  <button className="btn-close-service" onClick={onClose}><X size={24} /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="service-modal-form">
                  {/* ... inputs ... */}
                  <div className="input-group">
                    <label>Título del Servicio</label>
                    <input name="titulo" value={formData.titulo} onChange={handleChange} required />
                  </div>
                  <div className="input-group">
                    <label><FileText size={16}/> Descripción</label>
                    <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={4} required />
                  </div>
                  <div className="input-group">
                    <label><MapPin size={16}/> Ubicación</label>
                    <input name="ubicacion" value={formData.ubicacion} onChange={handleChange} />
                  </div>
                  <div className="form-row-service">
                    <div className="input-group">
                       <label><ImageIcon size={16}/> URL Imagen</label>
                       <input name="imagenSrc" value={formData.imagenSrc} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                       <label>Texto Alt</label>
                       <input name="altTexto" value={formData.altTexto} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="service-modal-footer">
                    <button type="button" className="btn-service-cancel" onClick={onClose}>Cancelar</button>
                    <button type="submit" className="btn-service-save"><Save size={18}/> Guardar</button>
                  </div>
              </form>
          </div>
      </div>
  );
}