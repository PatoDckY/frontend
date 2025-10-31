import Link from "next/link";
import Image from "next/image";
import "../styles/HeaderPublico.css";

export default function HeaderPublico() {
  return (
    <header className="header-publico">
      {/* Logo */}
      <div className="logo">
        <Link href="/usuarios/public/screens/HomePublico" className="logo-link">
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

      {/* Botones Login / Registro */}
      <div className="header-buttons">
        <Link href="/usuarios/public/screens/Login" className="btn-login">Login</Link>
        <Link href="/usuarios/public/screens/Registro" className="btn-registro">Registro</Link>
      </div>
    </header>
  );
}
