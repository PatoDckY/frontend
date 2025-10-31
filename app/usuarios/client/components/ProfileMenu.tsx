"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import { Settings, LogOut } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ProfileMenu.css";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://backend-7nyf.onrender.com";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [usuario, setUsuario] = useState<{ nombre: string; correo: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // 🔹 Obtener el perfil del usuario
  useEffect(() => {
    const fetchUser = async () => {
      if (typeof window === "undefined") return; // Previene SSR
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${API_URL}/auth/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuario(res.data);
      } catch (error) {
        console.error("❌ Error al obtener perfil:", error);
        toast.error("No se pudo cargar el perfil. Inicia sesión nuevamente.");
      }
    };
    fetchUser();
  }, []);

  // 🔹 Cerrar sesión
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      toast.info("Cerrando sesión...");
      setTimeout(() => (window.location.href = "/usuarios/public/screens/HomePublico"), 1200);
    }
  };

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
          {usuario ? (
            <>
              <div className="profile-info">
                <div className="profile-name">{usuario.nombre}</div>
                <div className="profile-email">{usuario.correo}</div>
              </div>
              <hr />
              <button className="profile-option">
                <Settings size={16} /> Configuración
              </button>
              <button className="profile-option logout" onClick={handleLogout}>
                <LogOut size={16} /> Cerrar sesión
              </button>
            </>
          ) : (
            <div className="profile-info">
              <div className="profile-name">Cargando...</div>
              <div className="profile-email">---</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
