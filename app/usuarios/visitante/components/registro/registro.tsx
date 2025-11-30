"use client";
import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, User, Mail, Phone, Calendar, Lock, Users, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
// Asegúrate de que la ruta al CSS sea correcta según tu estructura
import "../../styles/registro/registro.css";

type FormData = {
  nombre: string; apellidoPaterno: string; apellidoMaterno: string;
  edad: string; sexo: string; telefono: string; correo: string;
  contrasena: string; confirmarContrasena: string;
};

type Errores = Partial<Record<keyof FormData, string>>;

export default function RegistroPublico() {
  const router = useRouter();
  
  // --- ESTADOS DEL FORMULARIO ---
  const [formData, setFormData] = useState<FormData>({
    nombre: "", apellidoPaterno: "", apellidoMaterno: "", edad: "",
    sexo: "", telefono: "", correo: "", contrasena: "", confirmarContrasena: "",
  });
  const [errores, setErrores] = useState<Errores>({});
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [cargando, setCargando] = useState(false);

  // --- ESTADOS PARA VERIFICACIÓN OTP ---
  const [modalVisible, setModalVisible] = useState(false);
  const [verificandoOtp, setVerificandoOtp] = useState(false);
  
  // Array para los 6 dígitos individuales
  const [otpValues, setOtpValues] = useState<string[]>(new Array(6).fill(""));
  // Referencias para el foco automático
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // --- TEMPORIZADOR DE REENVÍO ---
  const [segundosRestantes, setSegundosRestantes] = useState(0);

  // Efecto para la cuenta regresiva
  useEffect(() => {
    let intervalo: NodeJS.Timeout;
    if (segundosRestantes > 0) {
      intervalo = setInterval(() => {
        setSegundosRestantes((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [segundosRestantes]);

  const formatearTiempo = (segundos: number) => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min}:${seg < 10 ? `0${seg}` : seg}`;
  };

  // --- MANEJO DEL FORMULARIO PRINCIPAL ---
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

  // --- 1. ENVIAR CÓDIGO (Pre-Registro y Reenvío) ---
  const enviarCodigo = async (esReenvio = false) => {
    if (!esReenvio && !validarFormulario()) { 
        toast.error("Corrige los errores antes de continuar."); 
        return; 
    }

    try {
      setCargando(true);
      
      // Endpoint para enviar el correo
      await axios.post("/api/auth/send-verification-code", { correo: formData.correo, nombre: formData.nombre });
      
      toast.info(`Código enviado a ${formData.correo}`);
      
      // Lógica de Tiempos
      if (!esReenvio) {
        setModalVisible(true);
        setSegundosRestantes(59); // Primera vez: 59 segundos
        setOtpValues(new Array(6).fill("")); // Limpiar inputs al abrir
      } else {
        setSegundosRestantes(120); // Reenvíos siguientes: 2 minutos (120s)
      }

    } catch (error: any) {
        if (error.response?.status === 409) {
            toast.error("Este correo ya está registrado.");
        } else {
            toast.error("Error al enviar el código.");
        }
    } finally {
      setCargando(false);
    }
  };

  // --- LÓGICA DE INPUTS OTP (Casillas) ---
  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return; // Solo números

    const newOtp = [...otpValues];
    // Tomar solo el último caracter ingresado
    newOtp[index] = value.substring(value.length - 1);
    setOtpValues(newOtp);

    // Mover foco a la derecha si se escribió un número
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Mover foco a la izquierda si se borra
    if (e.key === "Backspace" && !otpValues[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").slice(0, 6).split("");
    if (data.length === 0) return;

    const newOtp = [...otpValues];
    data.forEach((char, index) => {
        if (index < 6 && !isNaN(Number(char))) newOtp[index] = char;
    });
    setOtpValues(newOtp);
    // Enfocar el último llenado
    const nextFocus = Math.min(data.length, 5);
    inputRefs.current[nextFocus]?.focus();
  };

  // --- 2. VERIFICAR CÓDIGO Y REGISTRAR ---
  const handleVerificarYRegistrar = async () => {
    const codigoFinal = otpValues.join("");
    if (codigoFinal.length !== 6) { toast.warning("Ingresa los 6 dígitos completos"); return; }
    
    try {
      setVerificandoOtp(true);

      const { confirmarContrasena, ...datosLimpios } = formData;
      const datosEnvio = { 
          ...datosLimpios, 
          edad: parseInt(formData.edad),
          codigoVerificacion: codigoFinal 
      };

      await axios.post("/api/auth/register", datosEnvio);

      toast.success("¡Bienvenido! Cuenta creada exitosamente.");
      setModalVisible(false);
      setTimeout(() => { router.push("/usuarios/visitante/screens/Login"); }, 2000);

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Código incorrecto.");
    } finally {
      setVerificandoOtp(false);
    }
  };

  return (
    <div className="registro-container">
        
      {/* --- MODAL DE VERIFICACIÓN (DISEÑO MODERNO) --- */}
      {modalVisible && (
        <div className="modal-overlay">
            <div className="modal-otp modern">
                <button className="btn-close-modal" onClick={() => setModalVisible(false)}><X size={20}/></button>
                
                {/* Logo Arriba */}
                <div className="modal-logo-wrapper">
                    <Image src="/logo.png" alt="Logo CMP" width={50} height={50} style={{objectFit:'contain'}} />
                </div>

                <h3>Verificación de Seguridad</h3>
                <p className="modal-subtitle">
                    Ingresa el código de 6 dígitos enviado a <br/>
                    <strong>{formData.correo}</strong>
                </p>
                
                {/* Inputs X-X-X-X-X-X */}
                <div className="otp-inputs-container">
                    {otpValues.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            className={`otp-box ${digit ? "filled" : ""}`}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            onPaste={handleOtpPaste}
                            ref={(el) => { inputRefs.current[index] = el; }}
                        />
                    ))}
                </div>

                <button className="btn-verify" onClick={handleVerificarYRegistrar} disabled={verificandoOtp}>
                    {verificandoOtp ? "Verificando..." : "Validar Código"}
                </button>
                
                {/* Reenvío con Temporizador */}
                <div className="resend-wrapper">
                    {segundosRestantes > 0 ? (
                        <p className="timer-text">
                            Reenviar código en <span>{formatearTiempo(segundosRestantes)}</span>
                        </p>
                    ) : (
                        <p className="resend-text">
                            ¿No recibiste el código? <span onClick={() => enviarCodigo(true)} className="link-resend">Reenviar ahora</span>
                        </p>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* --- IZQUIERDA (AZUL) --- */}
      <div className="marketing-section">
        <div className="marketing-content-fixed">
            <div className="illustration-wrapper">
                <Image src="/logo.png" alt="Ilustración" width={350} height={350} className="illustration-register" priority />
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

      {/* --- DERECHA (FORMULARIO) --- */}
      <div className="registro-card">
        <h2 className="title-form">Crear Nueva Cuenta</h2>
        
        <div className="separator-or" style={{marginTop:'20px'}}>Ingresa tus datos</div>

        {/* Usamos preventDefault y llamamos a enviarCodigo(false) para el primer envío */}
        <form className="registro-form" onSubmit={(e) => { e.preventDefault(); enviarCodigo(false); }}>
          
          {/* TUS INPUTS (Sin cambios en esta sección) */}
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
            {cargando ? "ENVIANDO CÓDIGO..." : "CREAR CUENTA"}
          </button>

          <p className="login-link">
            ¿Ya tienes cuenta? <Link href="/usuarios/visitante/screens/Login" className="link">Inicia Sesion</Link>
          </p>
        </form>
      </div>
    </div>
  );
}