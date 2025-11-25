// public/components/cards/UsuarioCard.tsx
import React from 'react';
import { User, Mail, Phone, Calendar, UserCog } from 'lucide-react';
import '../../styles/Usuarios/UsuarioCard.css'; // CSS Específico de la tarjeta
import { Usuario } from './GestionUsuarios'; // Importamos el tipo

interface UsuarioCardProps {
  usuario: Usuario;
  onEdit: () => void;
}

export default function UsuarioCard({ usuario, onEdit }: UsuarioCardProps) {
  
  // Color del badge según rol
  const getRoleClass = (rol: string) => {
    switch(rol) {
        case 'Admin': return 'badge-admin';
        case 'Medico': return 'badge-medico';
        default: return 'badge-cliente';
    }
  };

  return (
    <div className="usuario-card">
      
      {/* Header de la tarjeta: Avatar y Rol */}
      <div className="user-card-header">
        <div className="user-avatar">
            {usuario.nombre.charAt(0)}{usuario.apellidoPaterno.charAt(0)}
        </div>
        <span className={`role-badge ${getRoleClass(usuario.rol)}`}>
            {usuario.rol}
        </span>
      </div>

      {/* Cuerpo: Datos Personales */}
      <div className="user-card-body">
        <h3 className="user-name">
            {usuario.nombre} {usuario.apellidoPaterno} {usuario.apellidoMaterno}
        </h3>
        
        <div className="user-info-grid">
            <div className="info-row">
                <Mail size={14} className="info-icon"/>
                <span className="info-text">{usuario.correo}</span>
            </div>
            <div className="info-row">
                <Phone size={14} className="info-icon"/>
                <span className="info-text">{usuario.telefono}</span>
            </div>
            <div className="info-row half">
                <Calendar size={14} className="info-icon"/>
                <span className="info-text">{usuario.edad} años</span>
            </div>
            <div className="info-row half">
                <User size={14} className="info-icon"/>
                <span className="info-text">{usuario.genero}</span>
            </div>
        </div>
      </div>

      {/* Footer: Acción */}
      <div className="user-card-footer">
        <button className="btn-edit-role" onClick={onEdit}>
            <UserCog size={16} /> Cambiar Rol
        </button>
      </div>

    </div>
  );
}