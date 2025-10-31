import Link from "next/link";
import Image from "next/image";
import "../styles/HeaderClient.css";

export default function HeaderClient() {
  return (
    <header className="header-client">
      {/* Logo */}
      <div className="logo">
        <Link href="/usuarios/client/screens/HomeClient" className="logo-link">
            <Image src="/logo.png" alt="Logo Centro Medico Pichardo" width={70} height={70} />
            <span className="logo-text">Centro Medico Pichardo</span>
        </Link>
        </div>


      {/* Navegación */}
      <nav className="nav-publico">
        <Link href="/servicios">Servicios</Link>
        <Link href="/directorio-medico">Directorio Médico</Link>
        <Link href="/academia">Academia de Cuidado Infantil</Link>
        <Link href="/noticias">Noticias & Consejos</Link>
        <Link href="/quienes-somos">¿Quiénes Somos?</Link>
      </nav>
    </header>
  );
}
