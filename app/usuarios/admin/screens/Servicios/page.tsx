// Importamos solo el contenido de la Academia
import GServicios from "../../components/ServiciosClinica/GestionServicios";
import AdminGuard from "@/app/usuarios/admin/components/AdminGuard/AdminGuard";
// He renombrado la función a 'AcademiaPage' para que coincida con lo que muestra
export default function AcademiaPage() {
  return (
    <AdminGuard>
    <>
      {/* Ya no necesitamos <PublicLayout> aquí.
        El sistema ya sabe qué mostrar gracias a app/layout.tsx
      */}
      <GServicios />
    </>
    </AdminGuard>
  );
}