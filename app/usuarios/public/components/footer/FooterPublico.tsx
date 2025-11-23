// components/FooterPublico.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Phone, Mail, MapPin, Facebook, Instagram, Twitter, 
  ChevronRight, Heart 
} from 'lucide-react';
import "../../styles/footer/FooterPublico.css";

export default function FooterPublico() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-publico">
      
      {/* --- SECCIÓN SUPERIOR (GRID) --- */}
      <div className="footer-top">
        <div className="footer-container">
          
          {/* Columna 1: Identidad y Misión */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
               {/* Ajusta la ruta de tu logo si es necesario */}
               <Image src="/logo.png" alt="Logo Centro Médico Pichardo" width={50} height={50} />
               <span className="footer-logo-text">Centro Médico Pichardo</span>
            </div>
            <p className="footer-description">
              Comprometidos con el desarrollo saludable y el bienestar integral de los niños de Huejutla. Atención pediátrica de excelencia con calidez humana.
            </p>
            <div className="social-links">
              <a href="#" className="social-icon" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" className="social-icon" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" className="social-icon" aria-label="Twitter"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div className="footer-col links-col">
            <h4 className="footer-heading">Enlaces Rápidos</h4>
            <ul className="footer-menu">
              <li>
                <Link href="/usuarios/public/screens/HomePublico">
                  <ChevronRight size={16} /> Inicio
                </Link>
              </li>
              <li>
                <Link href="/usuarios/public/screens/QuienesSomos">
                  <ChevronRight size={16} /> Quiénes Somos
                </Link>
              </li>
              <li>
                <Link href="/usuarios/public/screens/Servicios">
                  <ChevronRight size={16} /> Servicios
                </Link>
              </li>
              <li>
                <Link href="/usuarios/public/screens/DirectorioMedico">
                  <ChevronRight size={16} /> Directorio Médico
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Academia y Recursos */}
          <div className="footer-col links-col">
            <h4 className="footer-heading">Recursos para Padres</h4>
            <ul className="footer-menu">
              <li>
                <Link href="/usuarios/public/screens/Academia">
                  <ChevronRight size={16} /> Academia Infantil
                </Link>
              </li>
              <li>
                <Link href="/usuarios/public/screens/CatalogoCursos">
                  <ChevronRight size={16} /> Cursos y Talleres
                </Link>
              </li>
              <li>
                <Link href="/usuarios/public/screens/Blog">
                  <ChevronRight size={16} /> Blog de Noticias
                </Link>
              </li>
              <li>
                <Link href="/usuarios/public/screens/Login">
                  <ChevronRight size={16} /> Portal de Pacientes
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div className="footer-col contact-col">
            <h4 className="footer-heading">Contacto</h4>
            <ul className="contact-list">
              <li>
                <MapPin size={20} className="contact-icon" />
                <span>Av. Benito Juárez S/N, Huejutla de Reyes, Hidalgo. CP 43000</span>
              </li>
              <li>
                <Phone size={20} className="contact-icon" />
                <span>(771) 123-4567</span>
              </li>
              <li>
                <Mail size={20} className="contact-icon" />
                <span>contacto@cmpichardo.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* --- SECCIÓN INFERIOR (COPYRIGHT) --- */}
      <div className="footer-bottom">
        <div className="footer-container bottom-flex">
          <p className="copyright-text">
            © {currentYear} Centro Médico Pichardo. Todos los derechos reservados.
          </p>
          <div className="legal-links">
            <Link href="/privacidad">Aviso de Privacidad</Link>
            <span className="separator">|</span>
            <Link href="/terminos">Términos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}