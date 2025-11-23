// components/Navegacion.tsx
"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Importamos TODOS los componentes de navegación
import HeaderPublico from "../app/usuarios/public/components/header/HeaderPublico"; // Tu header público existente
import HeaderClient from "../app/usuarios/client/components/header/HeaderClient";
import FooterPublico from "../app/usuarios/public/components/footer/FooterPublico"; // Tu footer público existente
import FooterClient from "../app/usuarios/client/components/footer/FooterClient";   // El nuevo footer cliente

export default function Navegacion({ children }: { children: React.ReactNode }) {
  const [estaLogueado, setEstaLogueado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Función para verificar el token
    const verificarSesion = () => {
      const token = localStorage.getItem("token");
      setEstaLogueado(!!token); // true si hay token, false si no
      setCargando(false);
    };

    verificarSesion();
    
    // Escuchar cambios en localStorage (por si se cierra sesión en otra pestaña/componente)
    window.addEventListener('storage', verificarSesion);
    
    return () => {
        window.removeEventListener('storage', verificarSesion);
    };
  }, [pathname]); // Re-verificar cada vez que cambiamos de ruta

  // Evitar parpadeo de contenido incorrecto mientras carga
  if (cargando) {
    return <div style={{minHeight: '100vh', background: '#F4F7F6'}}></div>; 
  }

  return (
    <>
      {/* 1. Header Condicional */}
      {estaLogueado ? <HeaderClient /> : <HeaderPublico />}
      
      {/* 2. Contenido de la Página (El "Main") */}
      <main>
        {children}
      </main>

      {/* 3. Footer Condicional */}
      {estaLogueado ? <FooterClient /> : <FooterPublico />}
    </>
  );
}