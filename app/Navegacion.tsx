"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

// 👇 ASEGÚRATE QUE ESTAS RUTAS SEAN LAS CORRECTAS EN TU PROYECTO
import HeaderPublico from "../app/usuarios/public/components/header/HeaderPublico"; 
import FooterPublico from "../app/usuarios/public/components/footer/FooterPublico";

import HeaderClient from "../app/usuarios/client/components/header/HeaderClient";
import FooterClient from "../app/usuarios/client/components/footer/FooterClient";

import HeaderAdmin from "../app/usuarios/admin/components/header/HeaderAdmin";
import FooterAdmin from "../app/usuarios/admin/components/footer/FooterAdmin";

export default function Navegacion({ children }: { children: React.ReactNode }) {
  const [estado, setEstado] = useState({
    logueado: false,
    rol: "publico" as "publico" | "cliente" | "admin",
  });

  const [cargando, setCargando] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const validarSesion = async () => {
      try {
        // 1. Preguntamos al servidor si la sesión es válida (Lee la Cookie HttpOnly)
        // No necesitamos enviar headers manuales, el navegador envía la cookie solo.
        await axios.get("/api/auth/check-session");

        // 2. Si el servidor responde OK (200), leemos el rol local para la UI
        const rolStorage = localStorage.getItem("rol");
        
        // 🛡️ CORRECCIÓN DEL ERROR 'possibly null':
        // Si rolStorage es null, usamos una cadena vacía "" para que no falle el .includes
        const rol = rolStorage ? rolStorage.toLowerCase().trim() : "";

        if (rol.includes("admin")) {
            setEstado({ logueado: true, rol: "admin" });
        } else if (rol.includes("cliente") || rol.includes("usuario")) {
            setEstado({ logueado: true, rol: "cliente" });
        } else {
            // Si hay sesión pero el rol no se reconoce, lo mandamos a público o cliente por defecto
            setEstado({ logueado: true, rol: "cliente" }); 
        }

      } catch (error) {
        // 3. Si el servidor responde error (401), la sesión no es válida
        // console.warn("Sesión inválida o expirada"); // Opcional para depurar
        limpiarSesion();
        
        // Protección de rutas: Si estaba en una zona privada, sacarlo
        if (pathname?.includes("/admin") || pathname?.includes("/client")) {
            router.push("/usuarios/visitante/screens/Login");
        }
      } finally {
        setCargando(false);
      }
    };

    const limpiarSesion = () => {
        // Limpiamos datos residuales del localStorage
        localStorage.removeItem("token"); // Por si quedó algo viejo
        localStorage.removeItem("rol");
        localStorage.removeItem("usuario");
        setEstado({ logueado: false, rol: "publico" });
        setCargando(false);
    };

    validarSesion();

    // Escuchamos cambios en localStorage para sincronizar pestañas
    window.addEventListener("storage", validarSesion);
    return () => window.removeEventListener("storage", validarSesion);
    
  }, [pathname, router]);

  if (cargando) return <div style={{ minHeight: "100vh", background: "white" }}></div>;

  const obtenerHeader = () => {
    if (!estado.logueado) return <HeaderPublico />;
    if (estado.rol === "admin") return <HeaderAdmin />;
    return <HeaderClient />;
  };

  const obtenerFooter = () => {
    if (!estado.logueado) return <FooterPublico />;
    if (estado.rol === "admin") return <FooterAdmin />;
    return <FooterClient />;
  };

  return (
    <>
      {obtenerHeader()}
      <main>{children}</main>
      {obtenerFooter()}
    </>
  );
}