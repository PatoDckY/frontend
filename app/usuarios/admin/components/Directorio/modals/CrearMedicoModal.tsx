// screens/admin/modals/CrearMedicoModal.tsx
"use client";
import React, { useState } from 'react';
import { X, Save, User, Stethoscope, Building, MapPin, Image as ImageIcon } from 'lucide-react';
import '../../../styles/Directorio/MedicoModals.css';

interface CrearMedicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nuevoMedico: any) => void;
}

export default function CrearMedicoModal({ isOpen, onClose, onSave }: CrearMedicoModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    especialidad: '',
    hospital: 'Centro Médico Pichardo',
    direccion: '',
    imagenSrc: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoMedico = {
      id: Date.now(),
      ...formData,
      imagenSrc: formData.imagenSrc || "/Pichardo.jpg",
      linkVerMas: "#"
    };
    onSave(nuevoMedico);
    setFormData({ nombre: '', especialidad: '', hospital: 'Centro Médico Pichardo', direccion: '', imagenSrc: '' });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title"><User size={22}/> Registrar Nuevo Médico</h2>
          <button className="btn-close" onClick={onClose}><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          
          <div className="form-row">
            <div className="form-group half">
              <label>Nombre Completo</label>
              <input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Dr. Juan Pérez" required />
            </div>
            <div className="form-group half">
              <label><Stethoscope size={14}/> Especialidad</label>
              <input name="especialidad" value={formData.especialidad} onChange={handleChange} placeholder="Pediatría" required />
            </div>
          </div>

          <div className="form-group">
            <label><Building size={14}/> Hospital / Clínica</label>
            <input name="hospital" value={formData.hospital} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label><MapPin size={14}/> Dirección</label>
            <textarea name="direccion" value={formData.direccion} onChange={handleChange} rows={2} required />
          </div>

          <div className="form-group">
            <label><ImageIcon size={14}/> URL de la Foto (Opcional)</label>
            <input name="imagenSrc" value={formData.imagenSrc} onChange={handleChange} placeholder="https://..." />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save"><Save size={18}/> Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}