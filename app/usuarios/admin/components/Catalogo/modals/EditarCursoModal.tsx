// screens/admin/modals/EditarCursoModal.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { X, Save, BookOpen, Calendar, User, MapPin, DollarSign, Image as ImageIcon } from 'lucide-react';
import '../../../styles/Directorio/MedicoModals.css';

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
        // Convertir 'Gratuito' a 0 para el input type number si es necesario
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
    <div className="modal-overlay">
      <div className="modal-container" style={{maxWidth: '800px'}}>
        
        <div className="modal-header">
          <h2 className="modal-title"><BookOpen size={22}/> Editar Curso</h2>
          <button className="btn-close" onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          
          {/* --- ESTADO Y CONTROL --- */}
          <div style={{backgroundColor: '#F3F4F6', padding: '10px', borderRadius: '8px', marginBottom: '15px', display: 'flex', gap: '20px', alignItems: 'center'}}>
             <div className="form-group" style={{marginBottom: 0}}>
                <label style={{marginBottom: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <input 
                        type="checkbox" 
                        checked={formData.inscripcionesAbiertas} 
                        onChange={handleCheckbox} 
                        style={{width: 'auto'}}
                    />
                    Inscripciones Abiertas
                </label>
             </div>
             <div className="form-group" style={{marginBottom: 0}}>
                <select name="estado" value={formData.estado} onChange={handleChange} style={{padding: '5px', borderRadius: '4px'}}>
                    <option value="Activo">🟢 Activo</option>
                    <option value="Finalizado">🔴 Finalizado</option>
                    <option value="Próximamente">🟡 Próximamente</option>
                </select>
             </div>
          </div>

          {/* --- SECCIÓN 1: GENERAL --- */}
          <div className="form-group">
            <label>Título</label>
            <input name="titulo" value={formData.titulo} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={2} required />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Instructor</label>
              <input name="instructor" value={formData.instructor} onChange={handleChange} required />
            </div>
            <div className="form-group half">
              <label>Categoría</label>
              <select name="categoria" value={formData.categoria} onChange={handleChange}>
                <option value="Salud">Salud</option>
                <option value="Psicología">Psicología</option>
                <option value="Crianza">Crianza</option>
                <option value="Lactancia">Lactancia</option>
              </select>
            </div>
          </div>

          {/* --- SECCIÓN 2: FECHAS Y CUPO --- */}
          <div className="form-row">
            <div className="form-group third">
              <label>Fecha Inicio</label>
              <input name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} />
            </div>
            <div className="form-group third">
              <label>Fecha Fin</label>
              <input name="fechaFin" value={formData.fechaFin} onChange={handleChange} />
            </div>
            <div className="form-group third">
              <label>Horario</label>
              <input name="horario" value={formData.horario} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Cupo Máximo</label>
              <input type="number" name="cupoMaximo" value={formData.cupoMaximo} onChange={handleChange} />
            </div>
            <div className="form-group half">
              <label>Inscritos Actuales</label>
              <input type="number" name="cupoInscrito" value={formData.cupoInscrito} onChange={handleChange} />
            </div>
          </div>

          {/* --- SECCIÓN 3: DETALLES --- */}
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
              </select>
            </div>
            <div className="form-group third">
              <label>Costo</label>
              <input type="number" name="costo" value={formData.costo} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label>Ubicación</label>
            <input name="ubicacion" value={formData.ubicacion} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>URL Imagen</label>
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