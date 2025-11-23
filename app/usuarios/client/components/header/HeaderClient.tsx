// components/HeaderClient.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, MapPin, Clock } from "lucide-react";
import ProfileMenu from "../Profile/ProfileMenu"; // Tu componente de perfil existente
import "../../styles/header/HeaderClient.css";

export default function HeaderClient() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Efecto para sombra al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  return (
    <>
      {/* --- 1. TOP BAR (Igual que el público) --- */}
      <div className="top-bar">
        <div className="top-bar-container">
          <div className="contact-info">
            <span className="info-item">
              <Phone size={14} /> (771) 123-4567
            </span>
            <span className="info-item hidden-mobile">
              <MapPin size={14} /> Huejutla de Reyes, Hgo.
            </span>
            <span className="info-item hidden-mobile">
              <Clock size={14} /> Lun - Sab: 8:00 - 20:00
            </span>
          </div>
          <div className="top-bar-links">
            <Link href="/ayuda">Ayuda</Link>
            <Link href="/contacto">Soporte</Link>
          </div>
        </div>
      </div>

      {/* --- 2. HEADER PRINCIPAL --- */}
      <header className={`header-client ${scrolled ? "scrolled" : ""}`}>
        <div className="header-container">
          
          {/* LOGO (Redirige al Home del Cliente) */}
          <Link href="/usuarios/public/screens/HomePublico" className="logo-area">
            <Image 
                src="/logo.png" 
                alt="Logo Centro Medico Pichardo" 
                width={50} 
                height={50} 
                className="logo-img"
            />
            <div className="logo-text-wrapper">
                <span className="logo-title">Centro Médico</span>
                <span className="logo-subtitle">Pichardo</span>
            </div>
          </Link>

          {/* NAVEGACIÓN DESKTOP */}
          <nav className="nav-desktop">
            <Link href="/usuarios/public/screens/Servicios" className="nav-link">Servicios</Link>
            <Link href="/usuarios/public/screens/DirectorioMedico" className="nav-link">Directorio</Link>
            <Link href="/usuarios/public/screens/CatalogoCursos" className="nav-link">Cursos</Link>
            <Link href="/usuarios/public/screens/Academia" className="nav-link">Academia</Link>
            <Link href="/usuarios/public/screens/Blog" className="nav-link">Blog</Link>
            <Link href="/usuarios/public/screens/QuienesSomos" className="nav-link">Nosotros</Link>
          </nav>

          {/* SECCIÓN DERECHA: PERFIL Y MENÚ MÓVIL */}
          <div className="right-section">
            
            {/* Componente de Perfil (Visible siempre o ajustado según prefieras) */}
            <div className="profile-wrapper">
                <ProfileMenu />
            </div>

            {/* Botón Hamburguesa (Solo Móvil) */}
            <button className="menu-toggle" onClick={toggleMenu} aria-label="Abrir menú">
                {menuAbierto ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

        </div>

        {/* --- 3. MENÚ MÓVIL (Overlay) --- */}
        <div className={`mobile-menu ${menuAbierto ? "open" : ""}`}>
          <nav className="nav-mobile">
            <Link href="/usuarios/public/screens/Servicios" onClick={toggleMenu}>Servicios</Link>
            <Link href="/usuarios/public/screens/DirectorioMedico" onClick={toggleMenu}>Directorio Médico</Link>
            <Link href="/usuarios/public/screens/CatalogoCursos" onClick={toggleMenu}>Cursos y Talleres</Link>
            <Link href="/usuarios/public/screens/Academia" onClick={toggleMenu}>Academia Infantil</Link>
            <Link href="/usuarios/public/screens/Blog" onClick={toggleMenu}>Noticias & Consejos</Link>
            <Link href="/usuarios/public/screens/QuienesSomos" onClick={toggleMenu}>¿Quiénes Somos?</Link>
            {/* En móvil el perfil suele estar arriba, pero puedes agregar enlaces extra aquí si ProfileMenu no es accesible en el menú cerrado */}
          </nav>
        </div>
      </header>
    </>
  );
}