"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, ShieldCheck } from "lucide-react";
import axios from "axios"; 
import { toast } from "react-toastify"; 
import "../../styles/login/LoginPub.css"; 

type LoginData = { correo: string; contrasena: string; codigoMfa?: string };
type Errores = Partial<Record<keyof LoginData, string>>;

export default function LoginPublico() {
  const router = useRouter();
  const [loginData, setLoginData] = useState<LoginData>({ correo: "", contrasena: "", codigoMfa: "" });
  const [errores, setErrores] = useState<Errores>({});
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);
  
  // Estado para controlar la interfaz de MFA
  const [necesitaMfa, setNecesitaMfa] = useState(false);

  // --- DETECTOR DE INACTIVIDAD (Seguridad de Sesión) ---
  // Si el usuario deja la pantalla abierta 15 minutos sin hacer nada, limpia todo.
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
        clearTimeout(timeoutId);
        // 15 minutos = 900,000 ms
        timeoutId = setTimeout(() => {
            // Solo si hay algo en localStorage (sesión activa o datos sensibles)
            if (localStorage.getItem("token")) {
                localStorage.removeItem("token");
                localStorage.removeItem("usuario");
                toast.info("Tu sesión ha expirado por inactividad.");
                router.refresh(); 
            }
        }, 15 * 60 * 1000); 
    };

    // Escuchamos eventos de actividad
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    
    resetTimer(); // Iniciar timer

    return () => {
        window.removeEventListener("mousemove", resetTimer);
        window.removeEventListener("keydown", resetTimer);
        window.removeEventListener("click", resetTimer);
        clearTimeout(timeoutId);
    };
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    if (errores[name as keyof LoginData]) setErrores({ ...errores, [name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const nuevosErrores: Errores = {};
      
      // Validaciones básicas
      if (!loginData.correo) nuevosErrores.correo = "Ingresa tu correo";
      if (!loginData.contrasena) nuevosErrores.contrasena = "Ingresa tu contraseña";
      // Validación condicional para MFA
      if (necesitaMfa && !loginData.codigoMfa) nuevosErrores.codigoMfa = "Ingresa el código de 6 dígitos";
      
      if (Object.keys(nuevosErrores).length > 0) { setErrores(nuevosErrores); return; }

      try {
        setCargando(true);

        const res = await axios.post("/api/auth/login", loginData);
        
        const { token, usuario } = res.data;
        const nombreRol = typeof usuario.rol === 'string' ? usuario.rol : usuario.rol?.nombre;
        const rol = nombreRol?.toLowerCase() ?? "cliente";

        if (!token) throw new Error("Token no recibido");
        
        // Login Exitoso
        localStorage.setItem("token", token);
        localStorage.setItem("rol", rol);
        localStorage.setItem("usuario", JSON.stringify(usuario)); 
        
        toast.success(`Bienvenido, ${usuario.nombre}`);

        setTimeout(() => {
          if (rol.includes("admin")) {
              router.push("/usuarios/admin/screens/Dashboard");
          } else {
              router.push("/usuarios/public/screens/HomePublico");
          }
        }, 1000);

      } catch (error: any) {
        console.error("Error login:", error);
        
        if (error.response) {
            const status = error.response.status;
            
            // 423 Locked: Cuenta bloqueada por intentos fallidos
            if (status === 423) {
                toast.error("Cuenta BLOQUEADA temporalmente. Espera 15 min.");
            } 
            // 403 Forbidden + requireMfa: Contraseña OK, falta código
            else if (status === 403 && error.response.data.requireMfa) {
                setNecesitaMfa(true);
                toast.info("Autenticación de 2 factores requerida.");
            } 
            // 401 Unauthorized: Contraseña o usuario mal
            else if (status === 401) {
                toast.error(error.response.data.message || "Credenciales incorrectas");
            } else {
                toast.error("Error de conexión con el servidor");
            }
        } else {
            toast.error("Error de red. Verifica tu conexión.");
        }
      } finally {
        setCargando(false);
      }
    };

  return (
    <div className="login-container">
      
      <div className="marketing-section">
        <div className="illustration-wrapper">
          <Image src="/brains.png" alt="Cerebro" width={350} height={350} style={{objectFit: 'contain'}} priority />
        </div>
        <h1 className="marketing-tagline">Centro Médico Pichardo</h1>
        
        <div className="side-nav-buttons">
            <div className="side-btn active">INICIAR SESIÓN</div>
            <Link href="/usuarios/visitante/screens/Registro" className="side-btn outline">
                REGISTRARSE
            </Link>
        </div>
      </div>

      <div className="login-card">
        <div className="form-wrapper">
            
          <div className="form-header-logo">
             <Image src="/logo.png" width={60} height={60} alt="Logo CMP" />
             <h2 className="title-form">Bienvenido</h2>
          </div>

          {/* Ocultamos login social si estamos en paso de MFA para no distraer */}
          {!necesitaMfa && (
            <>
                <div className="social-login">
                    <button type="button" className="btn-social">Google</button>
                    <button type="button" className="btn-social">Facebook</button>
                </div>
                <div className="separator-or">o ingresa con tu correo</div>
            </>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* VISTA 1: Usuario y Contraseña */}
            {!necesitaMfa && (
                <>
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
                            style={{paddingRight: '45px'}}
                        />
                        <span className="icon-eye-right" onClick={() => setMostrarContrasena(!mostrarContrasena)}>
                        {mostrarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                    </div>
                    {errores.contrasena && <span className="error">{errores.contrasena}</span>}
                    </div>
                </>
            )}

            {/* VISTA 2: Autenticación Multifactor (Solo aparece si el back lo pide) */}
            {necesitaMfa && (
                <div className="form-group" style={{animation: 'fadeIn 0.5s'}}>
                    <div style={{background: '#EFF6FF', padding: '15px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center'}}>
                        <ShieldCheck size={40} color="#0A3D62" style={{marginBottom: '10px'}}/>
                        <p style={{margin:0, color: '#1F2937', fontWeight: '600'}}>Seguridad Adicional</p>
                        <p style={{margin:0, fontSize: '0.85rem', color: '#6B7280'}}>Ingresa el código de tu app autenticadora</p>
                    </div>

                    <div className="input-with-icon-wrapper">
                        <input
                            type="text"
                            name="codigoMfa"
                            placeholder="Ej. 123456"
                            value={loginData.codigoMfa}
                            onChange={handleChange}
                            className={errores.codigoMfa ? "input-error" : ""}
                            style={{textAlign: 'center', fontSize: '1.2rem', letterSpacing: '5px', fontWeight: 'bold'}}
                            autoFocus
                            maxLength={6}
                        />
                    </div>
                    {errores.codigoMfa && <span className="error" style={{display:'block', textAlign:'center'}}>{errores.codigoMfa}</span>}
                </div>
            )}

            {/* Link de Olvidé Contraseña (solo en vista 1) */}
            {!necesitaMfa && (
                <div className="forgot-password">
                <Link href="/usuarios/public/screens/EnlaceMagico" className="link-olvide">
                    ¿Olvidaste tu contraseña?
                </Link>
                </div>
            )}

            <button type="submit" className="btn-submit" disabled={cargando}>
              {cargando ? "VERIFICANDO..." : (necesitaMfa ? "VALIDAR CÓDIGO" : "ENTRAR AHORA")}
            </button>
            
            {/* Opción para cancelar el MFA y volver al login normal */}
            {necesitaMfa && (
                <div style={{textAlign:'center', marginTop:'15px'}}>
                    <button 
                        type="button"
                        style={{background:'none', border:'none', color:'#6B7280', cursor:'pointer', textDecoration:'underline'}}
                        onClick={() => { setNecesitaMfa(false); setLoginData({...loginData, codigoMfa: ''}); }}
                    >
                        Volver a intentar
                    </button>
                </div>
            )}

          </form>

        </div>
      </div>
    </div>
  );
}