"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios"; // Importamos Axios
import { toast } from "react-toastify"; // Importamos Toastify
import "../../styles/login/LoginPub.css"; 

// Definiciones de Tipos
type LoginData = {
  correo: string;
  contrasena: string;
};

type Errores = Partial<Record<keyof LoginData, string>>;

export default function LoginPublico() {
  const router = useRouter();
  
  // Estados
  const [loginData, setLoginData] = useState<LoginData>({
    correo: "",
    contrasena: "",
  });
  const [errores, setErrores] = useState<Errores>({});
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Manejo de cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    // Limpiamos errores visuales al escribir
    if (errores[name as keyof LoginData]) {
      setErrores({ ...errores, [name]: "" });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores: Errores = {};
    if (!loginData.correo) nuevosErrores.correo = "El correo es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.correo)) nuevosErrores.correo = "Correo inválido";
    
    if (!loginData.contrasena) nuevosErrores.contrasena = "La contraseña es obligatoria";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Lógica de Inicio de Sesión (Funcional)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      toast.error("Por favor corrige los errores.");
      return;
    }

    try {
      setCargando(true);

      const res = await axios.post(
        "https://backend-7nyf.onrender.com/auth/login",
        loginData
      );

      const token = res.data.token;
      const rol = res.data.usuario?.rol?.nombre?.toLowerCase() ?? "cliente";



      if (!token) {
        toast.error("Error: No se recibió el token de seguridad.");
        return;
      }

      // Guardamos token y rol
      localStorage.setItem("token", token);
      localStorage.setItem("rol", rol);

      toast.success(res.data.mensaje || "¡Bienvenido!");

      // Redirección según rol
      setTimeout(() => {
        if (rol === "admin") {
          router.push("/admin/HomeAdmin");
        } else {
          router.push("/usuarios/public/screens/HomePublico");
        }
      }, 1200);

    } catch (error: any) {
      console.error("Error de login:", error);

      if (error.response?.status === 401) {
        toast.error("Correo o contraseña incorrectos.");
      } else if (error.response?.status === 404) {
        toast.error("El usuario no existe.");
      } else {
        toast.error("Error de conexión. Intente más tarde.");
      }

    } finally {
      setCargando(false);
    }
  };


  return (
    <div className="login-container">
      <div className="login-content">
        
        {/* 1. Sección Lateral de Marketing (Izquierda) */}
        <div className="marketing-section">
          <div className="logo-box">
            <div className="logo-icon"></div> 
          </div>
          
          <h1 className="marketing-tagline">
            Centro Médico Pichardo
          </h1>
          
          <div className="illustration-wrapper">
            <Image 
              src="/brains.png" 
              alt="Ilustración 3D del Cerebro"
              width={350}
              height={350}
              className="illustration-stethoscope"
              priority // Carga prioritaria para la imagen principal
            />
          </div>
        </div>

        {/* 2. Sección del Formulario (Derecha) */}
        <div className="login-card">
          
          {/* Opciones de idioma (Solo visual) */}
          <div className="language-selector">
              <span>Español</span>
          </div>
          
          <h2 className="title-form">Iniciar Sesión</h2>
          
          {/* Botones Sociales (Solo visuales, type="button" para no enviar form) */}
          <div className="social-login">
            <button type="button" className="btn-social google">
              <svg className="icon-social" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.61 20.087a1.996 1.996 0 0 0-.25-1.05H24v4.71h10.94a12.44 12.44 0 0 1-5.18 7.39l.01 4.39 3.55.01c2.16-2.02 3.4-4.88 3.4-7.89 0-.49-.05-.98-.14-1.46z"/><path fill="#4CAF50" d="M24 44c5.16 0 9.88-1.97 13.43-5.22l-3.56-4.38c-1.92 1.44-4.36 2.29-6.9 2.29-5.26 0-9.75-3.54-11.36-8.32l-4.49 3.51c2.09 5.17 7.21 8.8 13.52 8.8z"/><path fill="#1976D2" d="M12.64 29.83c-.32-1.3-.5-2.7-.5-4.14s.18-2.84.5-4.14l-4.49-3.51C6.03 19.34 5 21.6 5 24c0 2.4.99 4.66 2.15 6.48l4.49-3.51z"/><path fill="#E53935" d="M24 15.07c2.86 0 5.43 1.01 7.42 2.9l4.15-4.15C33.87 9.82 29.28 8 24 8c-6.31 0-11.43 3.63-13.52 8.8l4.49 3.51c1.61-4.78 6.1-8.32 11.36-8.32z"/></svg>
              Ingresar con Google
            </button>
            <button type="button" className="btn-social facebook">
              <svg className="icon-social" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1877F2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              Ingresar con Facebook
            </button>
          </div>
          
          <div className="separator-or">- O -</div>
          
          {/* Formulario Funcional */}
          <form className="login-form" onSubmit={handleSubmit}>
            
            {/* Campo de Correo Electrónico */}
            <div className="form-group">
              <input
                type="email"
                name="correo"
                placeholder="Correo Electrónico"
                value={loginData.correo}
                onChange={handleChange}
                className={errores.correo ? "input-error" : ""}
              />
              {errores.correo && <span className="error">{errores.correo}</span>}
            </div>

            {/* Campo de Contraseña */}
            <div className="form-group password-group">
              <div className="password-wrapper">
                <input
                  type={mostrarContrasena ? "text" : "password"}
                  name="contrasena"
                  placeholder="Contraseña"
                  value={loginData.contrasena}
                  onChange={handleChange}
                  className={errores.contrasena ? "input-error" : ""}
                />
                <span
                  className="icon-eye"
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                >
                  {mostrarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
              {errores.contrasena && <span className="error">{errores.contrasena}</span>}
            </div>
            
            {/* Enlace de Olvidé Contraseña (Visual) */}
            <div className="forgot-password">
              <span 
                className="link" 
                style={{cursor: 'pointer', color: 'var(--color-naranja-calido)'}}
                onClick={() => router.push("/usuarios/public/screens/EnlaceMagico")}
              >
                ¿Olvidaste tu contraseña?
              </span>
            </div>

            {/* Botón Principal (Submit) */}
            <button type="submit" className="btn-submit" disabled={cargando}>
              {cargando ? "Verificando..." : "Iniciar Sesión"}
            </button>
            
            {/* Enlace de Registro */}
            <p className="registro-link">
              ¿No tienes una cuenta?{" "}
              <Link href="/usuarios/visitante/screens/Registro" className="link">
                Regístrate
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}