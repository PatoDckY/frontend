// screens/admin/modals/EditarCursoModal.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { X, Save, BookOpen } from 'lucide-react';
// IMPORTAMOS EL NUEVO CSS
import '../../../styles/Cursos/CursoModals.css';

interface EditarCursoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cursoActualizado: any) => void;
  curso: any;
}

export default function EditarCursoModal({ isOpen, onClose, onSave, curso }: EditarCursoModalProps) {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (curso) {
      setFormData({
        ...curso,
        costo: curso.costo === 'Gratuito' ? 0 : curso.costo
      });
    }
  }, [curso, isOpen]);

  if (!isOpen || !formData.id) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({ ...prev, inscripcionesAbiertas: e.target.checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cursoActualizado = {
      ...formData,
      costo: Number(formData.costo) === 0 ? 'Gratuito' : Number(formData.costo),
      cupoMaximo: Number(formData.cupoMaximo),
      cupoInscrito: Number(formData.cupoInscrito)
    };
    onSave(cursoActualizado);
    onClose();
  };

  return (
    <div className="course-modal-overlay">
      <div className="course-modal-container">
        
        <div className="course-modal-header">
          <h2 className="course-modal-title"><BookOpen size={24}/> Editar Curso</h2>
          <button className="btn-close-course" onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="course-modal-form">
          
          {/* CONTROL DE ESTADO (Específico de Editar) */}
          <div style={{marginBottom: '20px', display: 'flex', gap: '20px'}}>
             <label className="checkbox-wrapper">
                <input type="checkbox" checked={formData.inscripcionesAbiertas} onChange={handleCheckbox} />
                Inscripciones Abiertas
             </label>
             <div className="course-input-group" style={{flex: 1}}>
                <select name="estado" value={formData.estado} onChange={handleChange}>
                    <option value="Activo">Activo</option>
                    <option value="Finalizado">Finalizado</option>
                    <option value="Próximamente">Próximamente</option>
                </select>
             </div>
          </div>

          <div className="form-section-header">Información Básica</div>
          
          <div className="form-grid-row">
            <div className="course-input-group full-width">
              <label>Título</label>
              <input name="titulo" value={formData.titulo} onChange={handleChange} required />
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
              <label>Instructor</label>
              <input name="instructor" value={formData.instructor} onChange={handleChange} required />
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

          <div className="form-section-header">Logística y Fechas</div>

          <div className="form-grid-row cols-3">
            <div className="course-input-group">
              <label>Fecha Inicio</label>
              <input name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} />
            </div>
            <div className="course-input-group">
              <label>Fecha Fin</label>
              <input name="fechaFin" value={formData.fechaFin} onChange={handleChange} />
            </div>
            <div className="course-input-group">
              <label>Horario</label>
              <input name="horario" value={formData.horario} onChange={handleChange} />
            </div>
          </div>

          <div className="form-grid-row cols-3">
            <div className="course-input-group">
              <label>Cupo Máximo</label>
              <input type="number" name="cupoMaximo" value={formData.cupoMaximo} onChange={handleChange} />
            </div>
            <div className="course-input-group">
              <label>Inscritos Actuales</label>
              <input type="number" name="cupoInscrito" value={formData.cupoInscrito} onChange={handleChange} />
            </div>
            <div className="course-input-group">
              <label>Costo</label>
              <input type="number" name="costo" value={formData.costo} onChange={handleChange} />
            </div>
          </div>

          <div className="form-section-header">Detalles Finales</div>

          <div className="form-grid-row">
             <div className="course-input-group">
                <label>Ubicación</label>
                <input name="ubicacion" value={formData.ubicacion} onChange={handleChange} />
             </div>
             <div className="course-input-group">
                <label>URL Imagen</label>
                <input name="imagenSrc" value={formData.imagenSrc} onChange={handleChange} />
             </div>
          </div>

        </form>

        <div className="course-modal-footer">
          <button type="button" className="btn-course-cancel" onClick={onClose}>Cancelar</button>
          <button type="button" className="btn-course-save" onClick={(e) => handleSubmit(e as any)}>
            <Save size={18}/> Guardar Cambios
          </button>
        </div>

      </div>
    </div>
  );
}