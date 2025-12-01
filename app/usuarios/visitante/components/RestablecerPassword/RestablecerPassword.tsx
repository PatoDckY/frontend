"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; 
import axios from "axios";
import { toast } from "react-toastify";
import { Lock, Eye, EyeOff } from "lucide-react";
// Asegúrate de que esta ruta sea correcta en tu proyecto local
import "../../styles/login/LoginPub.css";

export default function RestablecerPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Captura el ?token=abc... de la URL

  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [cargando, setCargando] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Validación de seguridad (misma lógica que en Registro)
  const validarPassword = (password: string) => {
    if (password.length < 8) return "Mínimo 8 caracteres";
    
    const tieneLetra = /[a-zA-Z]/.test(password);
    const tieneNumero = /\d/.test(password);
    const tieneEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const secuenciasProhibidas = ["012", "123", "234", "345", "456", "567", "678", "789", "890"];
    const tieneSecuencia = secuenciasProhibidas.some(seq => password.includes(seq));

    if (!tieneLetra || !tieneNumero || !tieneEspecial) return "Debe tener letra, número y símbolo";
    if (tieneSecuencia) return "No uses secuencias numéricas (ej. 123)";
    
    return null; // Es válida
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pass || !confirm) return toast.error("Completa los campos");
    if (pass !== confirm) return toast.error("Las contraseñas no coinciden");
    
    // Validar robustez
    const errorPass = validarPassword(pass);
    if (errorPass) return toast.error(errorPass);

    try {
      setCargando(true);
      await axios.post("/api/auth/reset-password", {
        token, 
        nuevaContrasena: pass
      });
      
      toast.success("¡Contraseña actualizada! Iniciando sesión...");
      
      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        router.push("/usuarios/visitante/screens/Login");
      }, 3000);

    } catch (error: any) {
      toast.error(error.response?.data?.message || "El enlace ha expirado o no es válido");
    } finally {
      setCargando(false);
    }
  };

  // Si no hay token, mostramos un error visual
  if (!token) {
    return (
      <div className="login-container" style={{justifyContent:'center', alignItems:'center'}}>
        <div style={{background:'white', padding:'40px', borderRadius:'20px', textAlign:'center', boxShadow:'0 10px 25px rgba(0,0,0,0.1)'}}>
          <h3 style={{color:'#EF4444', marginBottom:'10px'}}>Enlace Inválido</h3>
          <p style={{color:'#6B7280'}}>El enlace de recuperación no es válido o está incompleto.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container" style={{justifyContent:'center', alignItems:'center', background:'#f3f4f6'}}>
      <div className="login-card" style={{borderRadius:'20px', maxWidth:'450px', height:'auto', padding:'40px'}}>
        <h2 className="title-form">Nueva Contraseña</h2>
        <p style={{textAlign:'center', color:'#6B7280', marginBottom:'30px'}}>
          Crea una nueva contraseña segura para tu cuenta.
        </p>

        <form onSubmit={handleSubmit} style={{width:'100%'}}>
            {/* Input Nueva Contraseña */}
            <div className="form-group">
                <label>Nueva Contraseña</label>
                <div className="input-with-icon-wrapper">
                    <Lock className="input-icon-left" size={20} />
                    <input 
                        type={showPass ? "text" : "password"} 
                        value={pass} 
                        onChange={(e) => setPass(e.target.value)} 
                        placeholder="••••••••"
                        disabled={cargando}
                        style={{paddingRight: '45px'}}
                    />
                    <span className="icon-eye-right" onClick={() => setShowPass(!showPass)}>
                        {showPass ? <EyeOff size={20}/> : <Eye size={20}/>}
                    </span>
                </div>
            </div>

            {/* Input Confirmar */}
            <div className="form-group">
                <label>Confirmar Contraseña</label>
                <div className="input-with-icon-wrapper">
                    <Lock className="input-icon-left" size={20} />
                    <input 
                        type="password" 
                        value={confirm} 
                        onChange={(e) => setConfirm(e.target.value)} 
                        placeholder="••••••••"
                        disabled={cargando}
                    />
                </div>
            </div>

            <button type="submit" className="btn-submit" disabled={cargando}>
                {cargando ? "ACTUALIZANDO..." : "CAMBIAR CONTRASEÑA"}
            </button>
        </form>
      </div>
    </div>
  );
}