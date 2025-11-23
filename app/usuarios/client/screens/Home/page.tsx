// app/usuarios/public/screens/HomePublico/page.tsx

// Importas solo el componente que tiene el contenido (Hero, Servicios, etc.)
import Home from "../../../public/components/HomePublico"; 

export default function HomePublicoPage() {
  return (
    <>
      {/* Ya NO usamos <PublicLayout>. 
        Next.js ya envolvió esto automáticamente con el RootLayout 
        y nuestro componente Navegacion.
      */}
      <Home />
    </>
  );
}