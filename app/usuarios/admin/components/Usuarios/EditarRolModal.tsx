// screens/admin/modals/EditarRolModal.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { X, Save, Shield } from 'lucide-react';
// IMPORTAR EL NUEVO CSS
import '../../styles/Usuarios/UsuarioModal.css';
import { Usuario, RolUsuario } from './GestionUsuarios';

interface EditarRolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, nuevoRol: RolUsuario) => void;
  usuario: Usuario | null;
}

export default function EditarRolModal({ isOpen, onClose, onSave, usuario }: EditarRolModalProps) {
  const [rolSeleccionado, setRolSeleccionado] = useState<RolUsuario>('Cliente');

  useEffect(() => {
    if (usuario) {
      setRolSeleccionado(usuario.rol);
    }
  }, [usuario, isOpen]);

  if (!isOpen || !usuario) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(usuario.id, rolSeleccionado);
  };

  return (
    <div className="usuario-modal-overlay" onClick={onClose}>
      <div className="usuario-modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="usuario-modal-header">
          <h2 className="usuario-modal-title"><Shield size={20}/> Gestionar Permisos</h2>
          <button className="btn-close-usuario" onClick={onClose}><X size={22} /></button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="usuario-modal-form">
          
          <div className="form-info-text">
            Estás editando el rol de acceso para:
            <strong>{usuario.nombre} {usuario.apellidoPaterno}</strong>
          </div>
            
          <div className="input-group">
            <label>Selecciona el nuevo Rol:</label>
            <select 
                className="role-select-large"
                value={rolSeleccionado} 
                onChange={(e) => setRolSeleccionado(e.target.value as RolUsuario)}
            >
              <option value="Cliente">Cliente (Acceso básico)</option>
              <option value="Medico">Médico (Gestión de citas propias)</option>
              <option value="Admin">Administrador (Acceso total)</option>
            </select>
          </div>

        </form>

        {/* Footer */}
        <div className="usuario-modal-footer">
            <button type="button" className="btn-usuario-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-usuario-save" onClick={handleSubmit}>
                <Save size={18}/> Guardar Rol
            </button>
        </div>

      </div>
    </div>
  );
}