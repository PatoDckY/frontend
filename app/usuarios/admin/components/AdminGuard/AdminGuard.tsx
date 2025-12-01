"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [autorizado, setAutorizado] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verificarAcceso = async () => {
      try {
        // 1. Preguntamos al servidor si la sesión (Cookie) es válida
        // No enviamos token manual, la cookie viaja sola 🍪
        await axios.get("/api/auth/check-session");

        // 2. Si la sesión es válida (200 OK), verificamos el rol
        // El rol sí lo mantenemos en localStorage para decisiones de UI rápidas
        const rolStorage = localStorage.getItem("rol");
        const rol = rolStorage ? rolStorage.toLowerCase().trim() : "";

        // Validamos que sea admin
        if (!rol.includes("admin")) {
            toast.error("Acceso denegado. Área restringida.");
            router.push("/usuarios/public/screens/HomePublico"); 
            return;
        }

        // 3. Si pasa ambas pruebas, autorizamos
        setAutorizado(true);

      } catch (error) {
        // Si el servidor devuelve error (401), la sesión no es válida (o no hay cookie)
        // toast.error("Debes iniciar sesión."); // Opcional, a veces es mejor ser silencioso
        router.push("/usuarios/visitante/screens/Login");
      }
    };

    verificarAcceso();
  }, [router]);

  if (!autorizado) {
    // Spinner de carga mientras verifica con el servidor
    return (
      <div style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc'}}>
        <div style={{
            width: '50px', 
            height: '50px', 
            border: '4px solid #E2E8F0', 
            borderTop: '4px solid #0A3D62', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}