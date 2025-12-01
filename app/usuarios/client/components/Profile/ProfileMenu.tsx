"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Settings, LogOut, User } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Estilos
import "../../styles/Profile/ProfileMenu.css";

// Componente MFA
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

  // 🔹 LOGOUT ACTUALIZADO (Limpia Cookie + LocalStorage)
  const handleLogout = async () => {
    try {
        // 1. Pedir al servidor que borre la cookie
        await axios.post("/api/auth/logout");
    } catch (error) {
        console.error("Error al cerrar sesión en servidor");
    } finally {
        // 2. Limpiar datos visuales del navegador
        if (typeof window !== "undefined") {
            localStorage.removeItem("token"); // Por si quedó basura vieja
            localStorage.removeItem("usuario");
            localStorage.removeItem("rol");
            
            toast.info("Cerrando sesión...");
            window.location.href = "/usuarios/public/screens/HomePublico";
        }
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

  // 🔹 FETCH USER ACTUALIZADO (Sin depender de localStorage token)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Ya no verificamos 'localStorage.getItem("token")' porque el token está en la cookie.
        // Hacemos la petición directa. Si no hay cookie, el back devuelve 401.
        
        // No enviamos headers manuales, la cookie viaja sola 🍪
        const res = await axios.get("/api/auth/perfil");
        
        setUsuario(res.data);
      } catch (error: any) {
        // Si falla (401/403), significa que la cookie expiró o es inválida
        console.error("No se pudo cargar perfil:", error.message);
        
        // Opcional: Si quieres forzar logout visual si falla el perfil:
        // if (error.response?.status === 401) handleLogout();
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
            {/* Usamos img estándar para asegurar compatibilidad */}
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
                    <div className="profile-name" style={{color: '#EF4444'}}>Sin sesión</div>
                    <small style={{display:'block', color:'#999', marginTop:'5px'}}>
                        <a href="/login" style={{textDecoration:'underline'}}>Iniciar sesión</a>
                    </small>
                </div>
            )}

            <hr />

            {/* Solo mostramos opciones si hay usuario */}
            {usuario && (
                <>
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
                </>
            )}
            
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