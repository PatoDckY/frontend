"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import { Settings, LogOut } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/Profile/ProfileMenu.css";

// ❌ YA NO NECESITAMOS ESTO:
// const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-7nyf.onrender.com";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [usuario, setUsuario] = useState<{ nombre: string; correo: string } | null>(null);
  const [loading, setLoading] = useState(true); 
  const menuRef = useRef<HTMLDivElement>(null);

  // 🔹 Función Robusta para Cerrar Sesión
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      localStorage.removeItem("rol"); // Agregamos limpiar el rol también
      
      toast.info("Cerrando sesión...");
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

  // 🔹 Obtener el perfil del usuario
  useEffect(() => {
    const fetchUser = async () => {
      if (typeof window === "undefined") return;
      
      const token = localStorage.getItem("token");
      
      if (!token) {
        handleLogout();
        return;
      }

      try {
        // ✅ CAMBIO IMPORTANTE: Usamos la ruta local de Next.js
        const res = await axios.get("/api/auth/perfil", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuario(res.data);
      } catch (error: any) {
        console.error("❌ Error al obtener perfil:", error);
        
        // Si el token expiró o es inválido (401), sacamos al usuario
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            toast.error("Tu sesión ha expirado.");
            handleLogout();
        } else {
            toast.error("Error al cargar perfil.");
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

      {/* Botón del menú */}
      <button
        className="profile-button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Abrir menú de perfil"
      >
        <Image
          src="/logo.png" 
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