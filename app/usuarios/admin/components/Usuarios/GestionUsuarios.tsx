// screens/admin/GestionUsuarios.tsx
"use client";
import React, { useState, useMemo } from 'react';
import { Search, Filter, Users, ShieldAlert } from 'lucide-react';
import UsuarioCard from './UsuarioCard'; // Componente nuevo
import EditarRolModal from './EditarRolModal'; // Modal específico
import '../../styles/Usuarios/GestionUsuarios.css'; // CSS Nuevo

// --- TIPO DE DATOS ---
export type RolUsuario = 'Cliente' | 'Admin' | 'Medico';

export type Usuario = {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  genero: string;
  telefono: string;
  correo: string;
  edad: number;
  rol: RolUsuario;
  imagenSrc?: string; // Opcional, para avatar
};

// --- DATOS SIMULADOS ---
const USUARIOS_INICIALES: Usuario[] = [
  {
    id: 1,
    nombre: "Juan",
    apellidoPaterno: "Pérez",
    apellidoMaterno: "López",
    genero: "Masculino",
    telefono: "7711234567",
    correo: "juan.perez@email.com",
    edad: 34,
    rol: "Cliente",
  },
  {
    id: 2,
    nombre: "María",
    apellidoPaterno: "González",
    apellidoMaterno: "Reyes",
    genero: "Femenino",
    telefono: "5544332211",
    correo: "admin@cmpichardo.com",
    edad: 29,
    rol: "Admin",
  },
  {
    id: 3,
    nombre: "Carlos",
    apellidoPaterno: "Ruiz",
    apellidoMaterno: "Sánchez",
    genero: "Masculino",
    telefono: "7719876543",
    correo: "doc.carlos@email.com",
    edad: 45,
    rol: "Medico",
  },
];

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(USUARIOS_INICIALES);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState<string>("Todos");
  
  // Estados Modal
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState<Usuario | null>(null);

  // --- FILTRADO ---
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(usuario => {
      const nombreCompleto = `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}`.toLowerCase();
      const coincideTexto = nombreCompleto.includes(busqueda.toLowerCase()) || 
                            usuario.correo.toLowerCase().includes(busqueda.toLowerCase());
      
      const coincideRol = filtroRol === "Todos" || usuario.rol === filtroRol;

      return coincideTexto && coincideRol;
    });
  }, [busqueda, filtroRol, usuarios]);

  // --- FUNCIONES ---
  const handleEditClick = (usuario: Usuario) => {
    setUsuarioAEditar(usuario);
    setEditModalOpen(true);
  };

  const guardarCambioRol = (id: number, nuevoRol: RolUsuario) => {
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, rol: nuevoRol } : u));
    setEditModalOpen(false);
    setUsuarioAEditar(null);
  };

  return (
    <div className="admin-usuarios-container">
      
      {/* --- HEADER --- */}
      <header className="admin-usuarios-header">
        <div className="header-background"></div>
        <div className="header-content">
          <h1 className="header-title">Gestión de Usuarios</h1>
          <p className="header-subtitle">Administra los roles y permisos de acceso a la plataforma.</p>
        </div>
      </header>

      {/* --- BARRA DE HERRAMIENTAS (Sin botón Crear) --- */}
      <div className="admin-tools-wrapper">
        <div className="admin-tools-card">
          
          <div className="search-section">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input 
                type="text" 
                placeholder="Buscar por nombre o correo..." 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            
            <div className="filters-group">
               <span className="filter-label"><Filter size={16}/> Rol:</span>
               <select 
                  value={filtroRol} 
                  onChange={(e) => setFiltroRol(e.target.value)}
                  className="filter-select"
                >
                  <option value="Todos">Todos</option>
                  <option value="Cliente">Cliente</option>
                  <option value="Admin">Administrador</option>
                  <option value="Medico">Médico</option>
               </select>
            </div>
          </div>

          <div className="actions-section">
            {/* Solo mostramos estadísticas, no hay botón crear */}
            <div className="stats-badge">
                <Users size={16} /> 
                <span>{usuarios.length} Usuarios</span>
            </div>
          </div>

        </div>
      </div>

      {/* --- GRID DE USUARIOS --- */}
      <main className="admin-usuarios-content">
        {usuariosFiltrados.length > 0 ? (
          <div className="admin-usuarios-grid">
            {usuariosFiltrados.map((usuario) => (
              <UsuarioCard 
                key={usuario.id}
                usuario={usuario}
                onEdit={() => handleEditClick(usuario)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <ShieldAlert size={48} className="empty-icon" />
            <h3>No se encontraron usuarios</h3>
            <p>Intenta con otros términos de búsqueda.</p>
          </div>
        )}
      </main>

      {/* --- MODAL EDICIÓN DE ROL --- */}
      <EditarRolModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={guardarCambioRol}
        usuario={usuarioAEditar}
      />

    </div>
  );
}