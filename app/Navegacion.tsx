"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

// COMPONENTES SEGÚN ROLES
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
      const token = localStorage.getItem("token");
      let rol = localStorage.getItem("rol");

      // 1. Si no hay token local, limpiamos y marcamos como público
      if (!token || token === "undefined" || token === "null") {
        limpiarSesion();
        return;
      }

      // 2. SI HAY TOKEN, PREGUNTAMOS AL SERVIDOR SI ES VÁLIDO (Revocación remota)
      try {
        await axios.get("/api/auth/check-session", {
            headers: { Authorization: `Bearer ${token}` }
        });

        // Si el servidor dice OK (200), procedemos a configurar el estado
        rol = rol?.toLowerCase() ?? "publico";

        if (rol.includes("admin")) {
            setEstado({ logueado: true, rol: "admin" });
        } else if (rol === "cliente" || rol === "usuario") {
            setEstado({ logueado: true, rol: "cliente" });
        } else {
            setEstado({ logueado: false, rol: "publico" });
        }

      } catch (error) {
        // 3. SI EL SERVIDOR DICE 401 (Token revocado, versión vieja, o expirado)
        // Forzamos el cierre de sesión inmediato
        console.warn("Sesión invalidada por el servidor");
        limpiarSesion();
        
        // Si estaba en una ruta privada, lo mandamos al login o home
        if (pathname.includes("/admin") || pathname.includes("/client")) {
            router.push("/usuarios/visitante/screens/Login");
        }
      } finally {
        setCargando(false);
      }
    };

    const limpiarSesion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        localStorage.removeItem("usuario");
        setEstado({ logueado: false, rol: "publico" });
        setCargando(false);
    };

    validarSesion();

    // Escuchamos cambios en localStorage (por si abres otra pestaña y cierras sesión ahí)
    window.addEventListener("storage", validarSesion);
    return () => window.removeEventListener("storage", validarSesion);
    
  // Ejecutamos validación cada vez que cambie la ruta (pathname)
  }, [pathname, router]);

  if (cargando) return <div style={{ minHeight: "100vh", background: "white" }}></div>;

  const obtenerHeader = () => {
    if (!estado.logueado) return <HeaderPublico />;
    if (estado.rol === "admin") return <HeaderAdmin />;
    // Cliente por defecto si está logueado y no es admin
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