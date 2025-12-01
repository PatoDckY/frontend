"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
// Agregamos Mail y Lock para los inputs
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import axios from "axios"; 
import { toast } from "react-toastify"; 
import "../../styles/login/LoginPub.css"; 

type LoginData = { correo: string; contrasena: string; };
type Errores = Partial<Record<keyof LoginData, string>>;

export default function LoginPublico() {
  const router = useRouter();
  const [loginData, setLoginData] = useState<LoginData>({ correo: "", contrasena: "" });
  const [errores, setErrores] = useState<Errores>({});
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    if (errores[name as keyof LoginData]) setErrores({ ...errores, [name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const nuevosErrores: Errores = {};
      if (!loginData.correo) nuevosErrores.correo = "Ingresa tu correo";
      if (!loginData.contrasena) nuevosErrores.contrasena = "Ingresa tu contraseña";
      
      if (Object.keys(nuevosErrores).length > 0) { setErrores(nuevosErrores); return; }

      try {
        setCargando(true);

        // 1️⃣ CAMBIO DE URL: Usamos la ruta local de Next.js
        const res = await axios.post("/api/auth/login", loginData);
        
        const { token, usuario } = res.data;

        // 2️⃣ CORRECCIÓN DEL ROL: 
        // En el backend nuevo, usuario.rol ya es un string (ej: "Administrador"), 
        // no un objeto. Quitamos el ".nombre".
        const nombreRol = typeof usuario.rol === 'string' ? usuario.rol : usuario.rol?.nombre;
        const rol = nombreRol?.toLowerCase() ?? "cliente";

        if (!token) { toast.error("Error de servidor"); return; }
        
        // Guardamos en localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("rol", rol);
        // Opcional: Guardar datos del usuario para mostrar "Hola Juan" en el dashboard
        localStorage.setItem("usuario", JSON.stringify(usuario)); 
        
        toast.success(`Bienvenido, ${usuario.nombre}`);

        // Redirección
        setTimeout(() => {
          // Asegúrate que tu rol en BD se llame "administrador" o "admin"
          // .includes permite detectar "Administrador" o "Admin"
          if (rol.includes("admin")) {
              router.push("/usuarios/admin/screens/Dashboard");
          } else {
              router.push("/usuarios/public/screens/HomePublico");
          }
        }, 1000);

      } catch (error: any) {
        console.error("Error login:", error);
        if (error.response?.status === 401) {
            toast.error("Credenciales incorrectas");
        } else {
            // Muestra el mensaje real del backend si es otro error
            toast.error(error.response?.data?.message || "Error de conexión");
        }
      } finally {
        setCargando(false);
      }
    };

  return (
    <div className="login-container">
      
      {/* --- IZQUIERDA: AZUL CON TEXTO BLANCO Y BOTONES --- */}
      <div className="marketing-section">
        <div className="illustration-wrapper">
          <Image src="/brains.png" alt="Cerebro" width={350} height={350} style={{objectFit: 'contain'}} priority />
        </div>
        <h1 className="marketing-tagline">Centro Médico Pichardo</h1>
        
        {/* Botones laterales estilo Nike */}
        <div className="side-nav-buttons">
            <div className="side-btn active">INICIAR SESIÓN</div>
            <Link href="/usuarios/visitante/screens/Registro" className="side-btn outline">
                REGISTRARSE
            </Link>
        </div>
      </div>

      {/* --- DERECHA: FORMULARIO BLANCO --- */}
      <div className="login-card">
        <div className="form-wrapper">
            
          {/* Logo y Título arriba */}
          <div className="form-header-logo">
             <Image src="/logo.png" width={60} height={60} alt="Logo CMP" />
             <h2 className="title-form">Bienvenido</h2>
          </div>

          {/* Botones Sociales */}
          <div className="social-login">
            <button type="button" className="btn-social">
               <svg className="icon-social" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.61 20.087a1.996 1.996 0 0 0-.25-1.05H24v4.71h10.94a12.44 12.44 0 0 1-5.18 7.39l.01 4.39 3.55.01c2.16-2.02 3.4-4.88 3.4-7.89 0-.49-.05-.98-.14-1.46z"/><path fill="#4CAF50" d="M24 44c5.16 0 9.88-1.97 13.43-5.22l-3.56-4.38c-1.92 1.44-4.36 2.29-6.9 2.29-5.26 0-9.75-3.54-11.36-8.32l-4.49 3.51c2.09 5.17 7.21 8.8 13.52 8.8z"/><path fill="#1976D2" d="M12.64 29.83c-.32-1.3-.5-2.7-.5-4.14s.18-2.84.5-4.14l-4.49-3.51C6.03 19.34 5 21.6 5 24c0 2.4.99 4.66 2.15 6.48l4.49-3.51z"/><path fill="#E53935" d="M24 15.07c2.86 0 5.43 1.01 7.42 2.9l4.15-4.15C33.87 9.82 29.28 8 24 8c-6.31 0-11.43 3.63-13.52 8.8l4.49 3.51c1.61-4.78 6.1-8.32 11.36-8.32z"/></svg>
               Google
            </button>
            <button type="button" className="btn-social">
               <svg className="icon-social" viewBox="0 0 24 24" fill="#1877F2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
               Facebook
            </button>
          </div>
          
          <div className="separator-or">o ingresa con tu correo</div>

          <form onSubmit={handleSubmit}>
            {/* Input Correo con Icono */}
            <div className="form-group">
              <label>Correo Electrónico</label>
              <div className="input-with-icon-wrapper">
                  <Mail className="input-icon-left" size={20} />
                  <input
                    type="email"
                    name="correo"
                    placeholder="nombre@ejemplo.com"
                    value={loginData.correo}
                    onChange={handleChange}
                    className={errores.correo ? "input-error" : ""}
                  />
              </div>
              {errores.correo && <span className="error">{errores.correo}</span>}
            </div>

            {/* Input Contraseña con Icono y Toggle */}
            <div className="form-group">
              <label>Contraseña</label>
              <div className="input-with-icon-wrapper">
                <Lock className="input-icon-left" size={20} />
                <input
                  type={mostrarContrasena ? "text" : "password"}
                  name="contrasena"
                  placeholder="••••••••"
                  value={loginData.contrasena}
                  onChange={handleChange}
                  className={errores.contrasena ? "input-error" : ""}
                  style={{paddingRight: '45px'}} // Espacio extra para el ojo
                />
                <span className="icon-eye-right" onClick={() => setMostrarContrasena(!mostrarContrasena)}>
                  {mostrarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
              {errores.contrasena && <span className="error">{errores.contrasena}</span>}
            </div>

            <div className="forgot-password">
              <Link href="/usuarios/visitante/screens/EnlaceMagico" className="link-olvide">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button type="submit" className="btn-submit" disabled={cargando}>
              {cargando ? "AUTENTICANDO..." : "ENTRAR AHORA"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}