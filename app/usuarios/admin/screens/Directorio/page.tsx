// Importamos solo el contenido de la Academia
import GDirectorio from "../../components/Directorio/GestionDirectorio";

// He renombrado la función a 'AcademiaPage' para que coincida con lo que muestra
export default function AcademiaPage() {
  return (
    <>
      {/* Ya no necesitamos <PublicLayout> aquí.
        El sistema ya sabe qué mostrar gracias a app/layout.tsx
      */}
      <GDirectorio />
    </>
  );
}