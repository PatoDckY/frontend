// screens/admin/modals/CrearCursoModal.tsx
"use client";
import React, { useState } from 'react';
import { X, Save, BookOpen } from 'lucide-react';
// IMPORTAMOS EL NUEVO CSS
import '../../../styles/Cursos/CursoModals.css';

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
    costo: 0,
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
      fechaPublicacion: new Date().toLocaleDateString(),
      inscripcionesAbiertas: true,
      cupoInscrito: 0,
      estado: 'Activo',
      costo: Number(formData.costo) === 0 ? 'Gratuito' : formData.costo,
      imagenSrc: formData.imagenSrc || "/logo.png",
      linkDetalle: "#"
    };
    onSave(nuevoCurso);
    setFormData({
      titulo: '', descripcion: '', instructor: '', categoria: 'Salud',
      fechaInicio: '', fechaFin: '', horario: '', modalidad: 'Presencial',
      dirigidoA: 'Padres', cupoMaximo: 20, costo: 0, ubicacion: '', imagenSrc: ''
    });
  };

  return (
    <div className="course-modal-overlay">
      <div className="course-modal-container">
        
        {/* HEADER */}
        <div className="course-modal-header">
          <h2 className="course-modal-title"><BookOpen size={24}/> Crear Nuevo Curso</h2>
          <button className="btn-close-course" onClick={onClose}><X size={24} /></button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="course-modal-form">
          
          {/* SECCIÓN 1 */}
          <div className="form-section-header">Información Básica</div>
          
          <div className="form-grid-row">
            <div className="course-input-group full-width">
              <label>Título del Curso</label>
              <input name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Ej: Primeros Auxilios Pediátricos" required />
            </div>
          </div>

          <div className="form-grid-row">
            <div className="course-input-group full-width">
              <label>Descripción</label>
              <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} required />
            </div>
          </div>

          <div className="form-grid-row">
            <div className="course-input-group">
              <label>Instructor / Especialista</label>
              <input name="instructor" value={formData.instructor} onChange={handleChange} placeholder="Dr. Juan Pérez" required />
            </div>
            <div className="course-input-group">
              <label>Categoría</label>
              <select name="categoria" value={formData.categoria} onChange={handleChange}>
                <option value="Salud">Salud</option>
                <option value="Psicología">Psicología</option>
                <option value="Crianza">Crianza</option>
                <option value="Nutrición">Nutrición</option>
              </select>
            </div>
          </div>

          {/* SECCIÓN 2 */}
          <div className="form-section-header">Logística y Fechas</div>

          <div className="form-grid-row cols-3">
            <div className="course-input-group">
              <label>Fecha Inicio</label>
              <input type="text" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} placeholder="DD/MM/AAAA" required />
            </div>
            <div className="course-input-group">
              <label>Fecha Fin</label>
              <input type="text" name="fechaFin" value={formData.fechaFin} onChange={handleChange} placeholder="DD/MM/AAAA" />
            </div>
            <div className="course-input-group">
              <label>Horario</label>
              <input name="horario" value={formData.horario} onChange={handleChange} placeholder="09:00 - 13:00" required />
            </div>
          </div>

          <div className="form-grid-row cols-3">
            <div className="course-input-group">
              <label>Modalidad</label>
              <select name="modalidad" value={formData.modalidad} onChange={handleChange}>
                <option value="Presencial">Presencial</option>
                <option value="Online">Online</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>
            <div className="course-input-group">
              <label>Dirigido A</label>
              <select name="dirigidoA" value={formData.dirigidoA} onChange={handleChange}>
                <option value="Padres">Padres</option>
                <option value="Niños">Niños</option>
                <option value="Familia">Familia</option>
              </select>
            </div>
            <div className="course-input-group">
              <label>Cupo Máximo</label>
              <input type="number" name="cupoMaximo" value={formData.cupoMaximo} onChange={handleChange} />
            </div>
          </div>

          {/* SECCIÓN 3 */}
          <div className="form-section-header">Detalles Finales</div>

          <div className="form-grid-row">
            <div className="course-input-group">
                <label>Ubicación (Sala/Zoom)</label>
                <input name="ubicacion" value={formData.ubicacion} onChange={handleChange} placeholder="Auditorio Torre 2" />
            </div>
            <div className="course-input-group">
                <label>Costo (0 = Gratis)</label>
                <input type="number" name="costo" value={formData.costo} onChange={handleChange} />
            </div>
          </div>

          <div className="course-input-group full-width">
            <label>URL Imagen de Portada</label>
            <input name="imagenSrc" value={formData.imagenSrc} onChange={handleChange} placeholder="https://..." />
          </div>

        </form>

        {/* FOOTER */}
        <div className="course-modal-footer">
          <button type="button" className="btn-course-cancel" onClick={onClose}>Cancelar</button>
          <button type="button" className="btn-course-save" onClick={(e) => handleSubmit(e as any)}>
            <Save size={18}/> Publicar Curso
          </button>
        </div>

      </div>
    </div>
  );
}