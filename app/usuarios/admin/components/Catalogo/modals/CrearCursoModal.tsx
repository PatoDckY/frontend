// screens/admin/modals/CrearCursoModal.tsx
"use client";
import React, { useState } from 'react';
import { X, Save, BookOpen, Calendar, User, MapPin, DollarSign, Image as ImageIcon } from 'lucide-react';
// Reutilizamos los estilos de modales que ya tienes
import '../../../styles/Directorio/MedicoModals.css';

interface CrearCursoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nuevoCurso: any) => void;
}

export default function CrearCursoModal({ isOpen, onClose, onSave }: CrearCursoModalProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    instructor: '',
    categoria: 'Salud',
    fechaInicio: '',
    fechaFin: '',
    horario: '',
    modalidad: 'Presencial',
    dirigidoA: 'Padres',
    cupoMaximo: 20,
    costo: 0, // 0 para gratuito
    ubicacion: '',
    imagenSrc: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nuevoCurso = {
      id: Date.now(),
      ...formData,
      // Datos automáticos iniciales
      fechaPublicacion: new Date().toLocaleDateString(),
      inscripcionesAbiertas: true,
      cupoInscrito: 0,
      estado: 'Activo',
      costo: formData.costo === 0 ? 'Gratuito' : formData.costo,
      imagenSrc: formData.imagenSrc || "/logo.png",
      linkDetalle: "#"
    };

    onSave(nuevoCurso);
    
    // Reset parcial del form
    setFormData({
      titulo: '', descripcion: '', instructor: '', categoria: 'Salud',
      fechaInicio: '', fechaFin: '', horario: '', modalidad: 'Presencial',
      dirigidoA: 'Padres', cupoMaximo: 20, costo: 0, ubicacion: '', imagenSrc: ''
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{maxWidth: '800px'}}> {/* Un poco más ancho */}
        
        <div className="modal-header">
          <h2 className="modal-title"><BookOpen size={22}/> Nuevo Curso o Taller</h2>
          <button className="btn-close" onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          
          {/* --- SECCIÓN 1: INFORMACIÓN GENERAL --- */}
          <h3 style={{fontSize: '0.9rem', color: '#0A3D62', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>Información General</h3>
          
          <div className="form-group">
            <label>Título del Curso</label>
            <input name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Ej: Primeros Auxilios" required />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={2} required />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label><User size={14}/> Instructor</label>
              <input name="instructor" value={formData.instructor} onChange={handleChange} placeholder="Dr. Juan Pérez" required />
            </div>
            <div className="form-group half">
              <label>Categoría</label>
              <select name="categoria" value={formData.categoria} onChange={handleChange}>
                <option value="Salud">Salud</option>
                <option value="Psicología">Psicología</option>
                <option value="Crianza">Crianza</option>
                <option value="Lactancia">Lactancia</option>
                <option value="Nutrición">Nutrición</option>
              </select>
            </div>
          </div>

          {/* --- SECCIÓN 2: LOGÍSTICA (FECHAS Y MODALIDAD) --- */}
          <h3 style={{fontSize: '0.9rem', color: '#0A3D62', marginTop: '20px', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>Logística</h3>

          <div className="form-row">
            <div className="form-group half">
              <label><Calendar size={14}/> Fecha Inicio</label>
              <input type="text" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} placeholder="15 Nov 2025" required />
            </div>
            <div className="form-group half">
              <label><Calendar size={14}/> Fecha Fin</label>
              <input type="text" name="fechaFin" value={formData.fechaFin} onChange={handleChange} placeholder="15 Nov 2025" />
            </div>
            <div className="form-group half">
              <label>Horario</label>
              <input name="horario" value={formData.horario} onChange={handleChange} placeholder="09:00 - 13:00" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group third">
              <label>Modalidad</label>
              <select name="modalidad" value={formData.modalidad} onChange={handleChange}>
                <option value="Presencial">Presencial</option>
                <option value="Online">Online</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>
            <div className="form-group third">
              <label>Dirigido A</label>
              <select name="dirigidoA" value={formData.dirigidoA} onChange={handleChange}>
                <option value="Padres">Padres</option>
                <option value="Niños">Niños</option>
                <option value="Adolescentes">Adolescentes</option>
                <option value="Familia">Familia</option>
              </select>
            </div>
            <div className="form-group third">
              <label>Cupo Máximo</label>
              <input type="number" name="cupoMaximo" value={formData.cupoMaximo} onChange={handleChange} />
            </div>
          </div>

          {formData.modalidad !== 'Online' && (
            <div className="form-group">
              <label><MapPin size={14}/> Ubicación / Sala</label>
              <input name="ubicacion" value={formData.ubicacion} onChange={handleChange} placeholder="Auditorio Torre 2" />
            </div>
          )}

          {/* --- SECCIÓN 3: COSTO E IMAGEN --- */}
          <div className="form-row" style={{marginTop: '15px'}}>
            <div className="form-group half">
              <label><DollarSign size={14}/> Costo (0 = Gratis)</label>
              <input type="number" name="costo" value={formData.costo} onChange={handleChange} />
            </div>
            <div className="form-group half">
              <label><ImageIcon size={14}/> URL Imagen</label>
              <input name="imagenSrc" value={formData.imagenSrc} onChange={handleChange} />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save"><Save size={18}/> Publicar Curso</button>
          </div>

        </form>
      </div>
    </div>
  );
}