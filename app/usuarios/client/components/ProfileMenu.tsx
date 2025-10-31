"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Settings, LogOut } from "lucide-react";
import "../styles/ProfileMenu.css";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [usuario, setUsuario] = useState<{ nombre: string; correo: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú si se da clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Obtener los datos del usuario
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("https://backend-7nyf.onrender.com/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuario(res.data);
      } catch (error) {
        console.error("Error al obtener el perfil", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="profile-menu-container" ref={menuRef}>
      <button className="profile-button" onClick={() => setOpen(!open)}>
        <img src="/user-icon.png" alt="Perfil" className="profile-icon" />
      </button>

      {open && usuario && (
        <div className="profile-dropdown">
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
        </div>
      )}
    </div>
  );
}
