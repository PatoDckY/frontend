"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "../styles/registro.css";

// --- TIPOS (Sin cambios) ---
type FormData = {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  edad: string;
  sexo: string;
  telefono: string;
  correo: string;
  contrasena: string;
  confirmarContrasena: string;
};

// --- COMPONENTE DE REGISTRO SOLO DISEÑO ---
export default function RegistroPublico() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    edad: "",
    sexo: "",
    telefono: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
  });
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name as keyof FormData;
    setFormData({ ...formData, [name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario de Registro (Solo Diseño) enviado.");
  };

  return (
    <div className="registro-container">
      <div className="registro-content">
        
        {/* 1. Sección Lateral de Marketing (Izquierda) */}
        <div className="marketing-section">
          
          {/* LOGO REMOVIDO */}
          
          {/* TÍTULO AGRANDADO A 2REM */}
          <h1 className="marketing-tagline">
            Centro Medico Pichardo
          </h1>
          
          {/* Ilustración (Centrada y Circular) */}
          <div className="illustration-wrapper">
            <Image 
              src="/niños.png" // Ruta de imagen sugerida
              alt="Ilustración de familia registrándose"
              width={350} 
              height={350}
              className="illustration-register"
            />
          </div>
        </div>

        {/* 2. Sección del Formulario (Derecha) */}
        <div className="registro-card">
          <h2 className="title-form">Crear Nueva Cuenta</h2>
          
          <div className="social-login">
            <button className="btn-social google">
              <svg className="icon-social" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.61 20.087a1.996 1.996 0 0 0-.25-1.05H24v4.71h10.94a12.44 12.44 0 0 1-5.18 7.39l.01 4.39 3.55.01c2.16-2.02 3.4-4.88 3.4-7.89 0-.49-.05-.98-.14-1.46z"/><path fill="#4CAF50" d="M24 44c5.16 0 9.88-1.97 13.43-5.22l-3.56-4.38c-1.92 1.44-4.36 2.29-6.9 2.29-5.26 0-9.75-3.54-11.36-8.32l-4.49 3.51c2.09 5.17 7.21 8.8 13.52 8.8z"/><path fill="#1976D2" d="M12.64 29.83c-.32-1.3-.5-2.7-.5-4.14s.18-2.84.5-4.14l-4.49-3.51C6.03 19.34 5 21.6 5 24c0 2.4.99 4.66 2.15 6.48l4.49-3.51z"/><path fill="#E53935" d="M24 15.07c2.86 0 5.43 1.01 7.42 2.9l4.15-4.15C33.87 9.82 29.28 8 24 8c-6.31 0-11.43 3.63-13.52 8.8l4.49 3.51c1.61-4.78 6.1-8.32 11.36-8.32z"/></svg>
              Regístrate con Google
            </button>
            <button className="btn-social facebook">
              <svg className="icon-social" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1877F2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              Regístrate con Facebook
            </button>
          </div>
          
          <div className="separator-or">- O -</div>
          
          <form className="registro-form" onSubmit={handleSubmit}>
            
            <div className="form-row">
              <div className="form-group half">
                <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className="input-success" />
              </div>
              <div className="form-group half">
                <input type="text" name="apellidoPaterno" placeholder="Apellido Paterno" value={formData.apellidoPaterno} onChange={handleChange} className="input-success" />
              </div>
            </div>
            
            <div className="form-group">
              <input type="text" name="apellidoMaterno" placeholder="Apellido Materno (Opcional)" value={formData.apellidoMaterno} onChange={handleChange} />
            </div>

            <div className="form-row">
              <div className="form-group half">
                <input type="number" name="edad" placeholder="Edad" value={formData.edad} onChange={handleChange} className="input-success" />
              </div>
              <div className="form-group half">
                <select name="sexo" value={formData.sexo} onChange={handleChange} className="input-success">
                  <option value="">Seleccione Sexo</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <input type="tel" name="telefono" placeholder="Teléfono (10 dígitos)" value={formData.telefono} onChange={handleChange} className="input-success" />
            </div>
            <div className="form-group">
              <input type="email" name="correo" placeholder="Correo Electrónico" value={formData.correo} onChange={handleChange} className="input-success" />
            </div>

            <div className="form-group password-group">
              <div className="password-wrapper">
                <input type={mostrarContrasena ? "text" : "password"} name="contrasena" placeholder="Contraseña" value={formData.contrasena} onChange={handleChange} className="input-success" />
                <span className="icon-eye" onClick={() => setMostrarContrasena(!mostrarContrasena)}>
                  {mostrarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>
            
            <div className="form-group password-group">
              <div className="password-wrapper">
                <input type={mostrarConfirmar ? "text" : "password"} name="confirmarContrasena" placeholder="Confirmar Contraseña" value={formData.confirmarContrasena} onChange={handleChange} className="input-success" />
                <span className="icon-eye" onClick={() => setMostrarConfirmar(!mostrarConfirmar)}>
                  {mostrarConfirmar ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
            </div>

            <button type="submit" className="btn-submit">Crear Cuenta</button>

            <p className="login-link">
              ¿Ya tienes cuenta?{" "}
              <Link href="/usuarios/public/screens/Login" className="link">Inicia sesión aquí</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}