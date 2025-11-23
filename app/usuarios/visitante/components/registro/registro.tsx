"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import "../../styles/registro/registro.css";

// --- TIPOS ---
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

type Errores = Partial<Record<keyof FormData, string>>;

export default function RegistroPublico() {
  const router = useRouter();
  
  // Estados
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
  const [errores, setErrores] = useState<Errores>({});
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Manejo de cambios
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Restricción de entrada: Solo números para edad y teléfono
    if (name === "edad" || name === "telefono") {
        if (value !== "" && !/^\d+$/.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });
    
    // Limpiar error visual al escribir
    if (errores[name as keyof FormData]) {
      setErrores({ ...errores, [name]: "" });
    }
  };

  // --- VALIDACIÓN ESTRICTA ---
  const validarFormulario = () => {
    const nuevosErrores: Errores = {};
    
    // 1. Nombres y Apellidos (Todos obligatorios)
    if (!formData.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!formData.apellidoPaterno.trim()) nuevosErrores.apellidoPaterno = "El apellido paterno es obligatorio";
    if (!formData.apellidoMaterno.trim()) nuevosErrores.apellidoMaterno = "El apellido materno es obligatorio";

    // 2. Edad (Regla: 18 a 100 años)
    const edadNum = parseInt(formData.edad);
    if (!formData.edad) {
        nuevosErrores.edad = "Ingresa tu edad";
    } else if (isNaN(edadNum)) {
        nuevosErrores.edad = "Debe ser un número";
    } else if (edadNum < 18) {
        nuevosErrores.edad = "Debes ser mayor de 18 años";
    } else if (edadNum > 100) {
        nuevosErrores.edad = "Edad no válida";
    }

    // 3. Sexo
    if (!formData.sexo) nuevosErrores.sexo = "Selecciona un sexo";

    // 4. Teléfono
    if (!formData.telefono) {
        nuevosErrores.telefono = "El teléfono es obligatorio";
    } else if (formData.telefono.length !== 10) {
        nuevosErrores.telefono = "Debe tener 10 dígitos exactos";
    }
    
    // 5. Correo
    if (!formData.correo) {
        nuevosErrores.correo = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
        nuevosErrores.correo = "Formato de correo inválido";
    }

    // 6. Contraseña
    if (!formData.contrasena) {
        nuevosErrores.contrasena = "La contraseña es obligatoria";
    } else if (formData.contrasena.length < 6) {
        nuevosErrores.contrasena = "Mínimo 6 caracteres";
    }

    // 7. Confirmación
    if (formData.contrasena !== formData.confirmarContrasena) {
      nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden";
    }

    setErrores(nuevosErrores);
    // Retorna true si no hay claves de error
    return Object.keys(nuevosErrores).length === 0;
  };

  // Lógica de Envío
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      toast.error("Por favor corrige los errores marcados en rojo.");
      return;
    }

    try {
      setCargando(true);
      
      const datosEnvio = {
        ...formData,
        edad: parseInt(formData.edad),
      };

      const res = await axios.post(
        "https://backend-7nyf.onrender.com/usuarios/registro", 
        datosEnvio
      );

      toast.success(res.data.mensaje || "¡Cuenta creada con éxito! 🎉");
      
      setTimeout(() => {
        router.push("/usuarios/visitante/screens/Login");
      }, 2000);

    } catch (error: any) {
      console.error("Error de registro:", error);
      if (error.response?.status === 409) {
        toast.error("Este correo ya está registrado.");
        setErrores((prev) => ({ ...prev, correo: "Este correo ya está registrado" }));
      } else if (error.response?.data?.mensaje) {
        toast.error(error.response.data.mensaje);
      } else {
        toast.error("Error al conectar con el servidor.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-content">
        
        {/* Sección Lateral */}
        <div className="marketing-section">
          <h1 className="marketing-tagline">
            Centro Médico Pichardo
          </h1>
          <div className="illustration-wrapper">
            <Image 
              src="/niños.png" 
              alt="Ilustración de familia registrándose"
              width={350} 
              height={350}
              className="illustration-register"
              priority
            />
          </div>
        </div>

        {/* Sección del Formulario */}
        <div className="registro-card">
          <h2 className="title-form">Crear Nueva Cuenta</h2>
          
          {/* Botones Sociales Visuales */}
          <div className="social-login">
            <button type="button" className="btn-social google">
              <svg className="icon-social" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.61 20.087a1.996 1.996 0 0 0-.25-1.05H24v4.71h10.94a12.44 12.44 0 0 1-5.18 7.39l.01 4.39 3.55.01c2.16-2.02 3.4-4.88 3.4-7.89 0-.49-.05-.98-.14-1.46z"/><path fill="#4CAF50" d="M24 44c5.16 0 9.88-1.97 13.43-5.22l-3.56-4.38c-1.92 1.44-4.36 2.29-6.9 2.29-5.26 0-9.75-3.54-11.36-8.32l-4.49 3.51c2.09 5.17 7.21 8.8 13.52 8.8z"/><path fill="#1976D2" d="M12.64 29.83c-.32-1.3-.5-2.7-.5-4.14s.18-2.84.5-4.14l-4.49-3.51C6.03 19.34 5 21.6 5 24c0 2.4.99 4.66 2.15 6.48l4.49-3.51z"/><path fill="#E53935" d="M24 15.07c2.86 0 5.43 1.01 7.42 2.9l4.15-4.15C33.87 9.82 29.28 8 24 8c-6.31 0-11.43 3.63-13.52 8.8l4.49 3.51c1.61-4.78 6.1-8.32 11.36-8.32z"/></svg>
              Regístrate con Google
            </button>
            <button type="button" className="btn-social facebook">
              <svg className="icon-social" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1877F2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              Regístrate con Facebook
            </button>
          </div>
          
          <div className="separator-or">- O -</div>
          
          <form className="registro-form" onSubmit={handleSubmit}>
            
            {/* Nombres y Apellidos */}
            <div className="form-row">
              <div className="form-group half">
                <input 
                    type="text" name="nombre" placeholder="Nombre" 
                    value={formData.nombre} onChange={handleChange} 
                    className={errores.nombre ? "input-error" : ""}
                />
                {errores.nombre && <span className="error">{errores.nombre}</span>}
              </div>
              <div className="form-group half">
                <input 
                    type="text" name="apellidoPaterno" placeholder="Apellido Paterno" 
                    value={formData.apellidoPaterno} onChange={handleChange} 
                    className={errores.apellidoPaterno ? "input-error" : ""}
                />
                {errores.apellidoPaterno && <span className="error">{errores.apellidoPaterno}</span>}
              </div>
            </div>
            
            {/* Apellido Materno (AHORA OBLIGATORIO) */}
            <div className="form-group">
              <input 
                type="text" name="apellidoMaterno" placeholder="Apellido Materno" 
                value={formData.apellidoMaterno} onChange={handleChange} 
                className={errores.apellidoMaterno ? "input-error" : ""}
              />
              {errores.apellidoMaterno && <span className="error">{errores.apellidoMaterno}</span>}
            </div>

            {/* Edad y Sexo */}
            <div className="form-row">
              <div className="form-group half">
                <input 
                    type="number" name="edad" placeholder="Edad (18-100)" 
                    value={formData.edad} onChange={handleChange} 
                    className={errores.edad ? "input-error" : ""}
                />
                {errores.edad && <span className="error">{errores.edad}</span>}
              </div>
              <div className="form-group half">
                <select 
                    name="sexo" value={formData.sexo} onChange={handleChange} 
                    className={errores.sexo ? "input-error" : ""}
                >
                  <option value="">Sexo</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
                {errores.sexo && <span className="error">{errores.sexo}</span>}
              </div>
            </div>

            {/* Contacto */}
            <div className="form-group">
              <input 
                type="tel" name="telefono" placeholder="Teléfono (10 dígitos)" 
                value={formData.telefono} onChange={handleChange} 
                className={errores.telefono ? "input-error" : ""}
                maxLength={10}
              />
              {errores.telefono && <span className="error">{errores.telefono}</span>}
            </div>
            <div className="form-group">
              <input 
                type="email" name="correo" placeholder="Correo Electrónico" 
                value={formData.correo} onChange={handleChange} 
                className={errores.correo ? "input-error" : ""}
              />
              {errores.correo && <span className="error">{errores.correo}</span>}
            </div>

            {/* Contraseñas */}
            <div className="form-group password-group">
              <div className="password-wrapper">
                <input 
                    type={mostrarContrasena ? "text" : "password"} 
                    name="contrasena" placeholder="Contraseña (mín 6 caracteres)" 
                    value={formData.contrasena} onChange={handleChange} 
                    className={errores.contrasena ? "input-error" : ""}
                />
                <span className="icon-eye" onClick={() => setMostrarContrasena(!mostrarContrasena)}>
                  {mostrarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
              {errores.contrasena && <span className="error">{errores.contrasena}</span>}
            </div>
            
            <div className="form-group password-group">
              <div className="password-wrapper">
                <input 
                    type={mostrarConfirmar ? "text" : "password"} 
                    name="confirmarContrasena" placeholder="Confirmar Contraseña" 
                    value={formData.confirmarContrasena} onChange={handleChange} 
                    className={errores.confirmarContrasena ? "input-error" : ""}
                />
                <span className="icon-eye" onClick={() => setMostrarConfirmar(!mostrarConfirmar)}>
                  {mostrarConfirmar ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
              {errores.confirmarContrasena && <span className="error">{errores.confirmarContrasena}</span>}
            </div>

            <button type="submit" className="btn-submit" disabled={cargando}>
                {cargando ? "Creando cuenta..." : "Crear Cuenta"}
            </button>

            <p className="login-link">
              ¿Ya tienes cuenta?{" "}
              <Link href="/usuarios/visitante/screens/Login" className="link">Inicia sesión aquí</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}