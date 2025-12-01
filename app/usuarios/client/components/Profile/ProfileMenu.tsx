"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Settings, LogOut, User } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Importamos estilos locales
import "../../styles/Profile/ProfileMenu.css";

// Importamos el componente de configuración usando ruta relativa
import ConfiguracionMfa from "./ConfiguracionMfa";

interface UsuarioPerfil {
  nombreCompleto: string;
  correo: string;
  rol?: string;
  id?: number;
}

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [usuario, setUsuario] = useState<UsuarioPerfil | null>(null);
  const [loading, setLoading] = useState(true); 
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      localStorage.removeItem("rol");
      toast.info("Cerrando sesión...");
      // Redirección forzada para limpiar estado
      window.location.href = "/usuarios/public/screens/HomePublico";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("token");
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/auth/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuario(res.data);
      } catch (error: any) {
        console.error("Error perfil:", error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <div className="profile-menu-container" ref={menuRef}>
        <ToastContainer position="top-right" autoClose={2000} theme="colored" />

        <button
            className="profile-button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Abrir menú"
        >
            {/* Usamos img estándar para evitar errores en preview */}
            <img
              src="/logo.png" 
              alt="Perfil"
              width={42}
              height={42}
              className="profile-icon"
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
        </button>

        {open && (
            <div className="profile-dropdown">
            
            {loading ? (
                <div className="profile-info">
                    <div className="profile-name" style={{color: '#999'}}>Cargando...</div>
                </div>
            ) : usuario ? (
                <div className="profile-info">
                    <div className="profile-name">{usuario.nombreCompleto}</div>
                    <div className="profile-email">{usuario.correo}</div>
                    <span className="profile-rol">{usuario.rol}</span>
                </div>
            ) : (
                <div className="profile-info">
                    <div className="profile-name" style={{color: 'red'}}>Sin sesión</div>
                </div>
            )}

            <hr />

            <button 
                className="profile-option" 
                onClick={() => {
                    setOpen(false);
                    setShowConfig(true);
                }}
            >
                <Settings size={16} /> Configuración y Seguridad
            </button>
            
            <button className="profile-option logout" onClick={handleLogout}>
                <LogOut size={16} /> Cerrar sesión
            </button>
            
            </div>
        )}
      </div>

      {showConfig && (
        <div className="modal-overlay-mfa">
            <ConfiguracionMfa onClose={() => setShowConfig(false)} />
        </div>
      )}
    </>
  );
}