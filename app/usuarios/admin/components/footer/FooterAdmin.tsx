// components/footer/FooterAdmin.tsx
"use client"; // Necesario para el onClick preventDefault en links muertos
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, Server, Database, LifeBuoy, FileText, 
  ChevronRight, Settings, Globe, Users, Stethoscope, GraduationCap
} from 'lucide-react';
import "../../styles/footer/FooterAdmin.css"; 

export default function FooterAdmin() {
  const currentYear = new Date().getFullYear();

  // Función para enlaces que aún no funcionan
  const handleDeadLink = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <footer className="footer-admin">
      
      {/* --- SECCIÓN SUPERIOR --- */}
      <div className="footer-top">
        <div className="footer-container">
          
          {/* Columna 1: Identidad Admin */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
               <Image src="/logo.png" alt="Logo Admin" width={45} height={45} />
               <div className="logo-text-col">
                   <span className="footer-logo-title">Centro Médico Pichardo</span>
                   <span className="footer-logo-subtitle">Panel de Administración</span>
               </div>
            </div>
            <p className="footer-description">
              Plataforma de gestión de contenido. Acceso restringido solo a personal autorizado.
            </p>
            <div className="admin-status">
                <ShieldCheck size={16} className="status-icon" />
                <span>Sistema Seguro</span>
            </div>
          </div>

          {/* Columna 2: Gestión de Contenido (Rutas Reales) */}
          <div className="footer-col links-col">
            <h4 className="footer-heading">Administración Web</h4>
            <ul className="footer-menu">
              <li>
                <Link href="/usuarios/admin/screens/Dashboard">
                  <ChevronRight size={16} /> Dashboard
                </Link>
              </li>
              <li>
                <Link href="/usuarios/admin/screens/GestionUsuarios">
                  <Users size={16} /> Usuarios
                </Link>
              </li>
              <li>
                <Link href="/usuarios/admin/screens/GestionDirectorio">
                  <Stethoscope size={16} /> Directorio Médico
                </Link>
              </li>
              <li>
                <Link href="/usuarios/admin/screens/GestionServicios">
                  <Globe size={16} /> Servicios
                </Link>
              </li>
              <li>
                <Link href="/usuarios/admin/screens/GestionAcademia">
                  <GraduationCap size={16} /> Academia & Cursos
                </Link>
              </li>
              <li>
                <Link href="/usuarios/admin/screens/GestionBlog">
                  <FileText size={16} /> Blog de Noticias
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Herramientas (Solo Visuales) */}
          <div className="footer-col links-col">
            <h4 className="footer-heading">Herramientas & Logs</h4>
            <ul className="footer-menu">
              <li>
                <a href="#" onClick={handleDeadLink} style={{cursor: 'not-allowed', opacity: 0.7}}>
                  <Database size={16} /> Registros del Sistema
                </a>
              </li>
              <li>
                <a href="#" onClick={handleDeadLink} style={{cursor: 'not-allowed', opacity: 0.7}}>
                  <Server size={16} /> Estado del Servidor
                </a>
              </li>
              <li>
                <a href="#" onClick={handleDeadLink} style={{cursor: 'not-allowed', opacity: 0.7}}>
                  <Settings size={16} /> Configuración Avanzada
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Soporte Técnico */}
          <div className="footer-col contact-col">
            <h4 className="footer-heading">Soporte IT</h4>
            <ul className="contact-list">
              <li>
                <LifeBuoy size={20} className="contact-icon" />
                <span>¿Problemas con el panel?</span>
              </li>
              <li className="support-email">
                <a href="mailto:soporte@cmpichardo.com">soporte@cmpichardo.com</a>
              </li>
              <li>
                <span className="support-phone">Versión del Panel: 1.0.0</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* --- SECCIÓN INFERIOR --- */}
      <div className="footer-bottom">
        <div className="footer-container bottom-flex">
          <p className="copyright-text">
            © {currentYear} Centro Médico Pichardo. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}