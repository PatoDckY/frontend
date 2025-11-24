// components/FooterClient.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Phone, Mail, MapPin, Facebook, Instagram, Twitter, 
  ChevronRight 
} from 'lucide-react';
import "../../../public/styles/footer/FooterPublico.css"; // Reutilizamos los estilos del footer público

export default function FooterClient() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-publico">
      
      {/* --- SECCIÓN SUPERIOR --- */}
      <div className="footer-top">
        <div className="footer-container">
          
          {/* Columna 1: Identidad */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
               <Image src="/logo.png" alt="Logo Centro Médico Pichardo" width={50} height={50} />
               <span className="footer-logo-text">Centro Médico Pichardo</span>
            </div>
            <p className="footer-description">
              Gracias por confiar en nosotros. Seguimos comprometidos con la salud y el bienestar de su familia en cada etapa.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon"><Facebook size={20} /></a>
              <a href="#" className="social-icon"><Instagram size={20} /></a>
              <a href="#" className="social-icon"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Columna 2: Navegación Cliente */}
          <div className="footer-col links-col">
            <h4 className="footer-heading">Mi Cuenta</h4>
            <ul className="footer-menu">
              <li>
                <Link href="/usuarios/client/screens/HomeClient">
                  <ChevronRight size={16} /> Inicio / Mi Panel
                </Link>
              </li>
              <li>
                <Link href="/usuarios/client/screens/Citas">
                  <ChevronRight size={16} /> Mis Citas
                </Link>
              </li>
              <li>
                <Link href="/usuarios/public/screens/Servicios">
                  <ChevronRight size={16} /> Servicios Médicos
                </Link>
              </li>
              <li>
                <Link href="/usuarios/public/screens/DirectorioMedico">
                  <ChevronRight size={16} /> Directorio
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Aprendizaje */}
          <div className="footer-col links-col">
            <h4 className="footer-heading">Academia & Recursos</h4>
            <ul className="footer-menu">
              <li>
                <Link href="/usuarios/public/screens/Academia">
                  <ChevronRight size={16} /> Academia Infantil
                </Link>
              </li>
              <li>
                <Link href="/usuarios/public/screens/CatalogoCursos">
                  <ChevronRight size={16} /> Cursos Disponibles
                </Link>
              </li>
              <li>
                <Link href="/usuarios/public/screens/Blog">
                  <ChevronRight size={16} /> Blog de Salud
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Soporte */}
          <div className="footer-col contact-col">
            <h4 className="footer-heading">Soporte al Paciente</h4>
            <ul className="contact-list">
              <li>
                <MapPin size={20} className="contact-icon" />
                <span>Av. Benito Juárez S/N, Huejutla, Hgo.</span>
              </li>
              <li>
                <Phone size={20} className="contact-icon" />
                <span>(771) 123-4567</span>
              </li>
              <li>
                <Mail size={20} className="contact-icon" />
                <span>atencion@cmpichardo.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* --- SECCIÓN INFERIOR --- */}
      <div className="footer-bottom">
        <div className="footer-container bottom-flex">
          <p className="copyright-text">
            © {currentYear} Centro Médico Pichardo. Portal de Pacientes.
          </p>
          <div className="legal-links">
            <Link href="/privacidad">Privacidad</Link>
            <span className="separator">|</span>
            <Link href="/terminos">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}