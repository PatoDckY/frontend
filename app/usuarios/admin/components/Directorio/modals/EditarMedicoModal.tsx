// screens/admin/modals/EditarMedicoModal.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { X, Save, User, Stethoscope, Building, MapPin, Image as ImageIcon } from 'lucide-react';
import '../../../styles/Directorio/MedicoModals.css';

interface EditarMedicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (medicoActualizado: any) => void;
  medico: any;
}

export default function EditarMedicoModal({ isOpen, onClose, onSave, medico }: EditarMedicoModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    especialidad: '',
    hospital: '',
    direccion: '',
    imagenSrc: ''
  });

  useEffect(() => {
    if (medico) {
      setFormData({
        nombre: medico.nombre || '',
        especialidad: medico.especialidad || '',
        hospital: medico.hospital || '',
        direccion: medico.direccion || '',
        imagenSrc: medico.imagenSrc || ''
      });
    }
  }, [medico, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...medico, ...formData });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title"><User size={22}/> Editar Médico</h2>
          <button className="btn-close" onClick={onClose}><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          
          <div className="form-row">
            <div className="form-group half">
              <label>Nombre Completo</label>
              <input name="nombre" value={formData.nombre} onChange={handleChange} required />
            </div>
            <div className="form-group half">
              <label><Stethoscope size={14}/> Especialidad</label>
              <input name="especialidad" value={formData.especialidad} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label><Building size={14}/> Hospital</label>
            <input name="hospital" value={formData.hospital} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label><MapPin size={14}/> Dirección</label>
            <textarea name="direccion" value={formData.direccion} onChange={handleChange} rows={2} required />
          </div>

          <div className="form-group">
            <label><ImageIcon size={14}/> URL de la Foto</label>
            <input name="imagenSrc" value={formData.imagenSrc} onChange={handleChange} />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save"><Save size={18}/> Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
}