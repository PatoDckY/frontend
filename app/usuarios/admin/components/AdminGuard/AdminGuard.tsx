"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [autorizado, setAutorizado] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 1. Verificar si hay token
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol"); // Asumiendo que guardaste "admin"

    if (!token) {
      toast.error("Debes iniciar sesión.");
      router.push("/login"); // Usamos la ruta corta que creamos en el rewrite
      return;
    }

    // 2. Verificar si es Admin
    if (rol !== "admin") {
      toast.error("Acceso denegado. Área restringida.");
      router.push("/usuarios/public/screens/HomePublico"); // Sacarlo al home
      return;
    }

    // 3. Si pasa, mostramos el contenido
    setAutorizado(true);
  }, [router]);

  if (!autorizado) {
    // Mientras verificamos, mostramos una pantalla de carga o nada
    return (
      <div style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #0A3D62', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}