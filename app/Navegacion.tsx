// components/Navegacion.tsx
"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Importamos TODOS los componentes de navegación (Manteniendo tus rutas)
import HeaderPublico from "../app/usuarios/public/components/header/HeaderPublico"; 
import HeaderClient from "../app/usuarios/client/components/header/HeaderClient";
import FooterPublico from "../app/usuarios/public/components/footer/FooterPublico"; 
import FooterClient from "../app/usuarios/client/components/footer/FooterClient"; 

export default function Navegacion({ children }: { children: React.ReactNode }) {
  const [estaLogueado, setEstaLogueado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Función para verificar el token (MEJORADA)
    const verificarSesion = () => {
      const token = localStorage.getItem("token");
      
      // VALIDACIÓN ESTRICTA:
      // 1. Si no hay token
      // 2. Si el token es el texto "undefined" (error común)
      // 3. Si el token es el texto "null" (error común)
      if (!token || token === "undefined" || token === "null") {
        setEstaLogueado(false);
        // Limpieza preventiva: si hay basura, la borramos
        if (token) localStorage.removeItem("token"); 
      } else {
        // Solo si pasa las pruebas, lo consideramos logueado
        setEstaLogueado(true);
      }
      
      setCargando(false);
    };

    verificarSesion();
    
    // Escuchar cambios en localStorage
    window.addEventListener('storage', verificarSesion);
    
    return () => {
        window.removeEventListener('storage', verificarSesion);
    };
  }, [pathname]); 

  // Evitar parpadeo
  if (cargando) {
    return <div style={{minHeight: '100vh', background: '#F4F7F6'}}></div>; 
  }

  return (
    <>
      {/* 1. Header Condicional */}
      {estaLogueado ? <HeaderClient /> : <HeaderPublico />}
      
      {/* 2. Contenido de la Página */}
      <main>
        {children}
      </main>

      {/* 3. Footer Condicional */}
      {estaLogueado ? <FooterClient /> : <FooterPublico />}
    </>
  );
}