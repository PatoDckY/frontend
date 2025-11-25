// screens/admin/Dashboard.tsx
"use client";
import React from 'react';
import Link from 'next/link';
import { 
  Users, Stethoscope, GraduationCap, FileText, 
  Globe, Activity, ArrowRight, Bell 
} from 'lucide-react';
import '../../styles/Dashboard/Dashboard.css';

// --- CONFIGURACIÓN DE ATAJOS (Menú Principal) ---
const ADMIN_SECTIONS = [
  {
    title: "Gestión de Usuarios",
    desc: "Administra roles, accesos y cuentas de pacientes.",
    icon: <Users size={32} />,
    path: "/usuarios/admin/screens/Usuarios",
    color: "blue",
    stat: "150 Registrados"
  },
  {
    title: "Directorio Médico",
    desc: "Añade o edita especialistas y su información de contacto.",
    icon: <Stethoscope size={32} />,
    path: "/usuarios/admin/screens/Directorio",
    color: "green",
    stat: "12 Médicos"
  },
  {
    title: "Cursos y Talleres",
    desc: "Gestiona la oferta educativa, fechas y cupos.",
    icon: <GraduationCap size={32} />,
    path: "/usuarios/admin/screens/Cursos",
    color: "orange",
    stat: "5 Activos"
  },
  {
    title: "Blog de Noticias",
    desc: "Publica artículos, consejos y novedades para los padres.",
    icon: <FileText size={32} />,
    path: "/usuarios/admin/screens/blog",
    color: "purple",
    stat: "42 Entradas"
  },
  {
    title: "Servicios Clínicos",
    desc: "Actualiza el catálogo de servicios médicos ofrecidos.",
    icon: <Activity size={32} />,
    path: "/usuarios/admin/screens/Servicios",
    color: "red",
    stat: "8 Servicios"
  },
  {
    title: "Academia Infantil",
    desc: "Contenido educativo general y guías para padres.",
    icon: <Globe size={32} />,
    path: "/usuarios/admin/screens/Academia",
    color: "teal",
    stat: "Sección Web"
  },
];

export default function Dashboard() {
  const fechaHoy = new Date().toLocaleDateString('es-MX', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <div className="dashboard-container">
      
      {/* --- 1. HEADER DE BIENVENIDA --- */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="welcome-text">
            <h1>¡Hola, Administrador! 👋</h1>
            <p className="date-badge">{fechaHoy}</p>
            <p className="welcome-subtitle">
              Aquí tienes un resumen de la actividad reciente en el Centro Médico Pichardo.
            </p>
          </div>
          
          {/* Tarjeta de Notificaciones Rápidas (Simulada) */}
          <div className="notifications-card">
            <div className="notif-icon">
                <Bell size={20} />
                <span className="notif-dot"></span>
            </div>
            <div className="notif-text">
                <strong>3 Nuevos usuarios</strong> registrados hoy.
                <br/>
                <small>Revisar pendientes</small>
            </div>
          </div>
        </div>
      </header>

      {/* --- 2. GRID DE NAVEGACIÓN (ATAJOS) --- */}
      <main className="dashboard-content">
        <h2 className="section-heading">Acceso Rápido</h2>
        
        <div className="shortcuts-grid">
          {ADMIN_SECTIONS.map((section, index) => (
            <Link href={section.path} key={index} className={`shortcut-card ${section.color}`}>
              <div className="shortcut-header">
                <div className="icon-wrapper">
                    {section.icon}
                </div>
                <span className="shortcut-stat">{section.stat}</span>
              </div>
              
              <div className="shortcut-body">
                <h3>{section.title}</h3>
                <p>{section.desc}</p>
              </div>

              <div className="shortcut-footer">
                <span>Gestionar</span>
                <ArrowRight size={18} />
              </div>
            </Link>
          ))}
        </div>
      </main>

    </div>
  );
}