"use client";
import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, User, Mail, Phone, Calendar, Lock, Users, X } from "lucide-react";
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

  // Estados OTP
  const [modalVisible, setModalVisible] = useState(false);
  const [verificandoOtp, setVerificandoOtp] = useState(false);
  const [otpValues, setOtpValues] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Temporizador
  const [segundosRestantes, setSegundosRestantes] = useState(0);
  const [intentosReenvio, setIntentosReenvio] = useState(0);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Validación para solo números en edad y teléfono
    if ((name === "edad" || name === "telefono") && value !== "" && !/^\d+$/.test(value)) return;
    
    setFormData({ ...formData, [name]: value });
    // Limpiar error al escribir
    if (errores[name as keyof FormData]) setErrores({ ...errores, [name]: "" });
  };

  // --- VALIDACIONES ACTUALIZADAS ---
  const validarFormulario = () => {
    const nuevosErrores: Errores = {};
    const pass = formData.contrasena;

    if (!formData.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!formData.apellidoPaterno.trim()) nuevosErrores.apellidoPaterno = "El apellido es obligatorio";
    if (!formData.apellidoMaterno.trim()) nuevosErrores.apellidoMaterno = "El apellido es obligatorio";
    
    const edadNum = parseInt(formData.edad);
    if (!formData.edad || isNaN(edadNum) || edadNum < 18 || edadNum > 100) nuevosErrores.edad = "Debes tener entre 18 y 100 años";
    
    if (!formData.sexo) nuevosErrores.sexo = "Selecciona tu sexo";
    
    if (!formData.telefono || formData.telefono.length !== 10) nuevosErrores.telefono = "El teléfono debe tener 10 dígitos";
    
    // Validación Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo || !emailRegex.test(formData.correo)) nuevosErrores.correo = "Ingresa un correo válido";

    // --- VALIDACIÓN DE CONTRASEÑA ---
    if (!pass) {
        nuevosErrores.contrasena = "La contraseña es obligatoria";
    } else if (pass.length < 8) {
        nuevosErrores.contrasena = "Mínimo 8 caracteres";
    } else {
        // Reglas estrictas
        const tieneLetra = /[a-zA-Z]/.test(pass);
        const tieneNumero = /\d/.test(pass);
        const tieneEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
        // Busca secuencias como 123, 234, 789, 012
        const tieneSecuencia = /(012|123|234|345|456|567|678|789|890)/.test(pass);

        if (!tieneLetra || !tieneNumero || !tieneEspecial) {
            nuevosErrores.contrasena = "Requiere letra, número y símbolo (!@#...)";
        } else if (tieneSecuencia) {
            nuevosErrores.contrasena = "No uses secuencias numéricas (ej. 123)";
        }
    }

    if (pass !== formData.confirmarContrasena) nuevosErrores.confirmarContrasena = "Las contraseñas no coinciden";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const enviarCodigo = async (esReenvio = false) => {
    if (!esReenvio && !validarFormulario()) { 
        toast.error("Por favor revisa los campos en rojo."); 
        return; 
    }

    try {
      setCargando(true);
      
      await axios.post("/api/auth/send-verification-code", { 
          correo: formData.correo,
          nombre: formData.nombre 
      });
      
      toast.info(`Código enviado a ${formData.correo}`);
      
      if (!esReenvio) {
        setModalVisible(true);
        setSegundosRestantes(59);
        setIntentosReenvio(0);
        setOtpValues(new Array(6).fill(""));
      } else {
        setSegundosRestantes(120); 
        setIntentosReenvio(prev => prev + 1);
      }

    } catch (error: any) {
        // Aquí capturamos el error 409 que configuramos en el backend
        if (error.response?.status === 409) {
            toast.error("Este correo ya está registrado. Intenta iniciar sesión.");
            // Opcional: setErrores({ ...errores, correo: "Correo ya registrado" });
        } else {
            toast.error("Error al conectar con el servidor.");
        }
    } finally {
      setCargando(false);
    }
  };

  // --- LÓGICA OTP ---
  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otpValues];
    newOtp[index] = value.substring(value.length - 1);
    setOtpValues(newOtp);
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
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
    const nextFocus = Math.min(data.length, 5);
    inputRefs.current[nextFocus]?.focus();
  };

  const handleVerificarYRegistrar = async () => {
    const codigoFinal = otpValues.join("");
    if (codigoFinal.length !== 6) { toast.warning("Ingresa el código completo"); return; }
    
    try {
      setVerificandoOtp(true);
      const { confirmarContrasena, ...datosLimpios } = formData;
      const datosEnvio = { 
          ...datosLimpios, 
          edad: parseInt(formData.edad),
          codigoVerificacion: codigoFinal 
      };

      await axios.post("/api/auth/register", datosEnvio);
      
      toast.success("¡Registro exitoso!");
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
      {modalVisible && (
        <div className="modal-overlay">
            <div className="modal-otp modern">
                <button className="btn-close-modal" onClick={() => setModalVisible(false)}><X size={20}/></button>
                <div className="modal-logo-wrapper">
                    <Image src="/logo.png" alt="Logo CMP" width={60} height={60} style={{objectFit:'contain'}} />
                </div>
                <h3>Verificación de Seguridad</h3>
                <p className="modal-subtitle">
                    Ingresa el código enviado a <br/>
                    <strong>{formData.correo}</strong>
                </p>
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
                <div className="resend-wrapper">
                    {segundosRestantes > 0 ? (
                        <p className="timer-text">Reenviar en <span>{formatearTiempo(segundosRestantes)}</span></p>
                    ) : (
                        <p className="resend-text">¿No llegó? <span onClick={() => enviarCodigo(true)} className="link-resend">Reenviar ahora</span></p>
                    )}
                </div>
            </div>
        </div>
      )}

      <div className="marketing-section">
        <div className="marketing-content-fixed">
            <div className="illustration-wrapper">
                <Image src="/logo.png" alt="Ilustración" width={350} height={350} className="illustration-register" priority />
            </div>
            <h1 className="marketing-tagline">Centro Médico Pichardo</h1>
            <div className="side-nav-buttons">
                <Link href="/usuarios/visitante/screens/Login" className="side-btn outline">INICIAR SESIÓN</Link>
                <div className="side-btn active">REGISTRARSE</div>
            </div>
        </div>
      </div>

      <div className="registro-card">
        <h2 className="title-form">Crear Nueva Cuenta</h2>
        <div className="separator-or" style={{marginTop:'20px'}}>Ingresa tus datos</div>

        <form className="registro-form" onSubmit={(e) => { e.preventDefault(); enviarCodigo(false); }}>
          <div className="form-row">
            <div className="form-group half">
              <div className="input-with-icon-wrapper">
                  <User className="input-icon-left" size={20} />
                  <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className={errores.nombre ? "input-error" : ""} />
              </div>
              {errores.nombre && <span className="error">{errores.nombre}</span>}
            </div>
            <div className="form-group half">
              <div className="input-with-icon-wrapper">
                  <User className="input-icon-left" size={20} />
                  <input type="text" name="apellidoPaterno" placeholder="Ap. Paterno" value={formData.apellidoPaterno} onChange={handleChange} className={errores.apellidoPaterno ? "input-error" : ""} />
              </div>
              {errores.apellidoPaterno && <span className="error">{errores.apellidoPaterno}</span>}
            </div>
          </div>

          <div className="form-group">
            <div className="input-with-icon-wrapper">
                <User className="input-icon-left" size={20} />
                <input type="text" name="apellidoMaterno" placeholder="Apellido Materno" value={formData.apellidoMaterno} onChange={handleChange} className={errores.apellidoMaterno ? "input-error" : ""} />
            </div>
            {errores.apellidoMaterno && <span className="error">{errores.apellidoMaterno}</span>}
          </div>

          <div className="form-row">
            <div className="form-group half">
              <div className="input-with-icon-wrapper">
                <Calendar className="input-icon-left" size={20} />
                <input type="number" name="edad" placeholder="Edad" value={formData.edad} onChange={handleChange} className={errores.edad ? "input-error" : ""} />
              </div>
              {errores.edad && <span className="error">{errores.edad}</span>}
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
              {errores.sexo && <span className="error">{errores.sexo}</span>}
            </div>
          </div>

          <div className="form-group">
            <div className="input-with-icon-wrapper">
                <Phone className="input-icon-left" size={20} />
                <input type="tel" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} className={errores.telefono ? "input-error" : ""} maxLength={10} />
            </div>
            {errores.telefono && <span className="error">{errores.telefono}</span>}
          </div>

          <div className="form-group">
            <div className="input-with-icon-wrapper">
                <Mail className="input-icon-left" size={20} />
                <input type="email" name="correo" placeholder="Correo Electrónico" value={formData.correo} onChange={handleChange} className={errores.correo ? "input-error" : ""} />
            </div>
            {errores.correo && <span className="error">{errores.correo}</span>}
          </div>

          <div className="form-group password-wrapper">
            <div className="input-with-icon-wrapper">
                <Lock className="input-icon-left" size={20} />
                <input type={mostrarContrasena ? "text" : "password"} name="contrasena" placeholder="Contraseña" value={formData.contrasena} onChange={handleChange} className={errores.contrasena ? "input-error" : ""} style={{paddingRight: '45px'}} />
                <span className="icon-eye-right" onClick={() => setMostrarContrasena(!mostrarContrasena)}>
                    {mostrarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
            </div>
            {errores.contrasena && <span className="error">{errores.contrasena}</span>}
          </div>

          <div className="form-group password-wrapper">
            <div className="input-with-icon-wrapper">
                <Lock className="input-icon-left" size={20} />
                <input type={mostrarConfirmar ? "text" : "password"} name="confirmarContrasena" placeholder="Confirmar Contraseña" value={formData.confirmarContrasena} onChange={handleChange} className={errores.confirmarContrasena ? "input-error" : ""} style={{paddingRight: '45px'}} />
                <span className="icon-eye-right" onClick={() => setMostrarConfirmar(!mostrarConfirmar)}>
                    {mostrarConfirmar ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
            </div>
            {errores.confirmarContrasena && <span className="error">{errores.confirmarContrasena}</span>}
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