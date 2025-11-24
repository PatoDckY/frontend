"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

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

  useEffect(() => {
    const verificarSesion = () => {
      const token = localStorage.getItem("token");
      let rol = localStorage.getItem("rol");

      if (!token || token === "undefined" || token === "null") {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");

        setEstado({
          logueado: false,
          rol: "publico",
        });

        setCargando(false);
        return;
      }

      // Normalizamos por seguridad
      rol = rol?.toLowerCase() ?? "publico";

      if (rol === "admin") {
        setEstado({ logueado: true, rol: "admin" });
      } else if (rol === "cliente") {
        setEstado({ logueado: true, rol: "cliente" });
      } else {
        setEstado({ logueado: false, rol: "publico" });
      }

      setCargando(false);
    };

    verificarSesion();
    window.addEventListener("storage", verificarSesion);
    return () => window.removeEventListener("storage", verificarSesion);
  }, [pathname]);

  if (cargando) return <div style={{ minHeight: "100vh" }}></div>;

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
