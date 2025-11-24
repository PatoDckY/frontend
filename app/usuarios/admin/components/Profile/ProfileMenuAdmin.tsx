"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import { Settings, LogOut } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/Profile/ProfileMenuAdmin.css";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://backend-7nyf.onrender.com";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [usuario, setUsuario] = useState<{ nombre: string; correo: string } | null>(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  const menuRef = useRef<HTMLDivElement>(null);

  // 🔹 Función Robusta para Cerrar Sesión
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      // 1. Borrar credenciales
      localStorage.removeItem("token");
      localStorage.removeItem("usuario"); // Si guardas algo más, bórralo
      
      // 2. Feedback visual
      toast.info("Cerrando sesión...");
      
      // 3. Redirección forzada al Login (limpia estados de React)
      window.location.href = "/usuarios/public/screens/HomePublico";
    }
  };

  // 🔹 Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Obtener el perfil del usuario (Con Auto-Logout si falla)
  useEffect(() => {
    const fetchUser = async () => {
      if (typeof window === "undefined") return;
      
      const token = localStorage.getItem("token");
      
      // Si no hay token, forzar salida inmediata
      if (!token) {
        handleLogout();
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/auth/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuario(res.data);
      } catch (error: any) {
        console.error("❌ Error al obtener perfil:", error);
        
        // SI EL TOKEN NO SIRVE (401/403), SACAR AL USUARIO AUTOMÁTICAMENTE
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            toast.error("Tu sesión ha expirado.");
            handleLogout();
        } else {
            // Si es otro error (conexión, etc), solo avisar pero no sacar
            toast.error("Error de conexión al cargar perfil.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="profile-menu-container" ref={menuRef}>
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

      {/* Botón del menú de perfil */}
      <button
        className="profile-button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Abrir menú de perfil"
      >
        <Image
          src="/logo.png" // O la foto del usuario si la tuvieras
          alt="Perfil"
          width={42}
          height={42}
          className="profile-icon"
        />
      </button>

      {/* Menú desplegable */}
      {open && (
        <div className="profile-dropdown">
          
          {/* INFORMACIÓN DEL USUARIO */}
          {loading ? (
             <div className="profile-info">
                <div className="profile-name" style={{color: '#999'}}>Cargando...</div>
             </div>
          ) : usuario ? (
            <div className="profile-info">
              <div className="profile-name">{usuario.nombre}</div>
              <div className="profile-email">{usuario.correo}</div>
            </div>
          ) : (
            <div className="profile-info">
               <div className="profile-name" style={{color: 'red'}}>Sin conexión</div>
            </div>
          )}

          <hr />

          {/* OPCIONES SIEMPRE VISIBLES (Incluso si falla la carga del perfil) */}
          <button className="profile-option">
            <Settings size={16} /> Configuración
          </button>
          
          <button className="profile-option logout" onClick={handleLogout}>
            <LogOut size={16} /> Cerrar sesión
          </button>
          
        </div>
      )}
    </div>
  );
}