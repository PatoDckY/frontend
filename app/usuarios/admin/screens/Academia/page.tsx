// Importamos solo el contenido de la Academia
import Academia from "../../components/Academia/GestionAcademia";

// He renombrado la función a 'AcademiaPage' para que coincida con lo que muestra
export default function AcademiaPage() {
  return (
    <>
      {/* Ya no necesitamos <PublicLayout> aquí.
        El sistema ya sabe qué mostrar gracias a app/layout.tsx
      */}
      <Academia />
    </>
  );
}