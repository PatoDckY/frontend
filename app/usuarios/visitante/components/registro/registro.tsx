"use client";
import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Phone, Calendar, Lock, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import "../../styles/registro/registro.css";

type FormData = {
  nombre: string; apellidoPaterno: string; apellidoMaterno: string;
  edad: string; sexo: string; telefono: string; correo: string;
  contrasena: string; confirmarContrasena: string;
};

type Errores = Partial<Record<keyof FormData, string>>;

export default function RegistroPublico() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    nombre: "", apellidoPaterno: "", apellidoMaterno: "", edad: "",
    sexo: "", telefono: "", correo: "", contrasena: "", confirmarContrasena: "",
  });
  const [errores, setErrores] = useState<Errores>({});
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if ((name === "edad" || name === "telefono") && value !== "" && !/^\d+$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
    if (errores[name as keyof FormData]) setErrores({ ...errores, [name]: "" });
  };

  const validarFormulario = () => {
    const nuevosErrores: Errores = {};
    if (!formData.nombre.trim()) nuevosErrores.nombre = "Obligatorio";
    if (!formData.apellidoPaterno.trim()) nuevosErrores.apellidoPaterno = "Obligatorio";
    if (!formData.apellidoMaterno.trim()) nuevosErrores.apellidoMaterno = "Obligatorio";
    const edadNum = parseInt(formData.edad);
    if (!formData.edad || isNaN(edadNum) || edadNum < 18 || edadNum > 100) nuevosErrores.edad = "18-100 años";
    if (!formData.sexo) nuevosErrores.sexo = "Selecciona sexo";
    if (!formData.telefono || formData.telefono.length !== 10) nuevosErrores.telefono = "10 dígitos exactos";
    if (!formData.correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) nuevosErrores.correo = "Correo inválido";
    if (!formData.contrasena || formData.contrasena.length < 6) nuevosErrores.contrasena = "Mín. 6 car.";
    if (formData.contrasena !== formData.confirmarContrasena) nuevosErrores.confirmarContrasena = "No coinciden";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) { toast.error("Corrige los errores."); return; }

    try {
      setCargando(true);

      // 1. Quitamos confirmarContrasena y convertimos edad a número
      const { confirmarContrasena, ...datosLimpios } = formData;
      
      const datosEnvio = { 
          ...datosLimpios, 
          edad: parseInt(formData.edad) 
      };

      // 2. Enviamos a TU NUEVA RUTA LOCAL
      const res = await axios.post("/api/auth/register", datosEnvio);

      toast.success(res.data.mensaje || "¡Cuenta creada! 🎉");
      setTimeout(() => { router.push("/usuarios/visitante/screens/Login"); }, 2000);
    } catch (error: any) {
      if (error.response?.status === 409) toast.error("Correo ya registrado.");
      else toast.error(error.response?.data?.message || "Error de servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro-container">
        
  {/* --- IZQUIERDA (AZUL) --- */ }
    <div className="marketing-section">
        {/* Nuevo envoltorio para efecto sticky */}
        <div className="marketing-content-fixed">
            <div className="illustration-wrapper">
                <Image src="/niños.png" alt="Ilustración" width={350} height={350} className="illustration-register" priority />
            </div>
            <h1 className="marketing-tagline">Centro Médico Pichardo</h1>

            <div className="side-nav-buttons">
                <Link href="/usuarios/visitante/screens/Login" className="side-btn outline">
                    INICIAR SESIÓN
                </Link>
                <div className="side-btn active">REGISTRARSE</div>
            </div>
        </div>
    </div>

      {/* --- DERECHA (BLANCO) --- */}
      <div className="registro-card">
        <h2 className="title-form">Crear Nueva Cuenta</h2>
        
        {/* Sección Social */}
        <div className="social-section">
            <span className="social-label">Regístrate con:</span>
            <div className="social-buttons-row">
                <button type="button" className="btn-social">
                <svg className="icon-social" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.61 20.087a1.996 1.996 0 0 0-.25-1.05H24v4.71h10.94a12.44 12.44 0 0 1-5.18 7.39l.01 4.39 3.55.01c2.16-2.02 3.4-4.88 3.4-7.89 0-.49-.05-.98-.14-1.46z"/><path fill="#4CAF50" d="M24 44c5.16 0 9.88-1.97 13.43-5.22l-3.56-4.38c-1.92 1.44-4.36 2.29-6.9 2.29-5.26 0-9.75-3.54-11.36-8.32l-4.49 3.51c2.09 5.17 7.21 8.8 13.52 8.8z"/><path fill="#1976D2" d="M12.64 29.83c-.32-1.3-.5-2.7-.5-4.14s.18-2.84.5-4.14l-4.49-3.51C6.03 19.34 5 21.6 5 24c0 2.4.99 4.66 2.15 6.48l4.49-3.51z"/><path fill="#E53935" d="M24 15.07c2.86 0 5.43 1.01 7.42 2.9l4.15-4.15C33.87 9.82 29.28 8 24 8c-6.31 0-11.43 3.63-13.52 8.8l4.49 3.51c1.61-4.78 6.1-8.32 11.36-8.32z"/></svg>
                Google
                </button>
                <button type="button" className="btn-social">
                <svg className="icon-social" viewBox="0 0 24 24" fill="#1877F2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                Facebook
                </button>
            </div>
        </div>
        
        <div className="separator-or">o usa tu correo electrónico</div>

        <form className="registro-form" onSubmit={handleSubmit}>
          
          <div className="form-row">
            <div className="form-group half">
              <div className="input-with-icon-wrapper">
                  <User className="input-icon-left" size={20} />
                  <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className={errores.nombre ? "input-error" : ""} />
              </div>
            </div>
            <div className="form-group half">
              <div className="input-with-icon-wrapper">
                  <User className="input-icon-left" size={20} />
                  <input type="text" name="apellidoPaterno" placeholder="Apellido Paterno" value={formData.apellidoPaterno} onChange={handleChange} className={errores.apellidoPaterno ? "input-error" : ""} />
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="input-with-icon-wrapper">
                <User className="input-icon-left" size={20} />
                <input type="text" name="apellidoMaterno" placeholder="Apellido Materno" value={formData.apellidoMaterno} onChange={handleChange} className={errores.apellidoMaterno ? "input-error" : ""} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <div className="input-with-icon-wrapper">
                <Calendar className="input-icon-left" size={20} />
                <input type="number" name="edad" placeholder="Edad" value={formData.edad} onChange={handleChange} className={errores.edad ? "input-error" : ""} />
              </div>
            </div>
            <div className="form-group half">
              <div className="input-with-icon-wrapper">
                <Users className="input-icon-left" size={20} />
                <select name="sexo" value={formData.sexo} onChange={handleChange} className={errores.sexo ? "input-error" : ""}>
                    <option value="">Sexo</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="input-with-icon-wrapper">
                <Phone className="input-icon-left" size={20} />
                <input type="tel" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} className={errores.telefono ? "input-error" : ""} maxLength={10} />
            </div>
          </div>

          <div className="form-group">
            <div className="input-with-icon-wrapper">
                <Mail className="input-icon-left" size={20} />
                <input type="email" name="correo" placeholder="Correo Electrónico" value={formData.correo} onChange={handleChange} className={errores.correo ? "input-error" : ""} />
            </div>
          </div>

          <div className="form-group password-wrapper">
            <div className="input-with-icon-wrapper">
                <Lock className="input-icon-left" size={20} />
                <input type={mostrarContrasena ? "text" : "password"} name="contrasena" placeholder="Contraseña" value={formData.contrasena} onChange={handleChange} className={errores.contrasena ? "input-error" : ""} style={{paddingRight: '45px'}} />
                <span className="icon-eye-right" onClick={() => setMostrarContrasena(!mostrarContrasena)}>
                    {mostrarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
            </div>
          </div>

          <div className="form-group password-wrapper">
            <div className="input-with-icon-wrapper">
                <Lock className="input-icon-left" size={20} />
                <input type={mostrarConfirmar ? "text" : "password"} name="confirmarContrasena" placeholder="Confirmar Contraseña" value={formData.confirmarContrasena} onChange={handleChange} className={errores.confirmarContrasena ? "input-error" : ""} style={{paddingRight: '45px'}} />
                <span className="icon-eye-right" onClick={() => setMostrarConfirmar(!mostrarConfirmar)}>
                    {mostrarConfirmar ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={cargando}>
            {cargando ? "REGISTRANDO..." : "CREAR CUENTA"}
          </button>

          <p className="login-link">
            ¿Ya tienes cuenta? <Link href="/usuarios/visitante/screens/Login" className="link">Inicia Sesion</Link>
          </p>
        </form>
      </div>
    </div>
  );
}