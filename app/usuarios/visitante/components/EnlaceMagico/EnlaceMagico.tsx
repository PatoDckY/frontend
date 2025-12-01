"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
// Ajusta esta ruta si tu carpeta styles está en otro nivel (ej: '@/styles/login/LoginPub.css')
import "../../styles/login/LoginPub.css"; 

export default function EnlaceMagico() {
  const [correo, setCorreo] = useState("");
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correo) return toast.error("Ingresa tu correo");

    try {
      setCargando(true);
      // Siempre dará éxito (200) aunque el correo no exista, por seguridad
      await axios.post("/api/auth/forgot-password", { correo });
      setEnviado(true);
      toast.success("Solicitud procesada");
    } catch (error: any) {
        // Solo mostramos error si es por bloqueo de intentos (429)
        if (error.response?.status === 429) {
            toast.error(error.response.data.message);
        } else {
            toast.error("Error de conexión");
        }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container" style={{justifyContent:'center', alignItems:'center', background:'#f3f4f6'}}>
      <div className="login-card" style={{borderRadius:'20px', boxShadow:'0 10px 25px rgba(0,0,0,0.1)', maxWidth:'450px', height:'auto'}}>
        
        <Link href="/usuarios/visitante/screens/Login" style={{alignSelf:'flex-start', marginBottom:'20px', color:'#0A3D62'}}>
            <ArrowLeft />
        </Link>

        <h2 className="title-form">Recuperar Contraseña</h2>
        
        {!enviado ? (
            <>
                <p style={{textAlign:'center', color:'#6B7280', marginBottom:'30px'}}>
                    Ingresa tu correo y te enviaremos un enlace temporal para restablecer tu acceso.
                </p>

                <form onSubmit={handleSubmit} style={{width:'100%'}}>
                    <div className="form-group">
                        <label>Correo Electrónico</label>
                        <div className="input-with-icon-wrapper">
                            <Mail className="input-icon-left" size={20} />
                            <input 
                                type="email" 
                                value={correo} 
                                onChange={(e) => setCorreo(e.target.value)} 
                                placeholder="tu@correo.com"
                                disabled={cargando}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-submit" disabled={cargando}>
                        {cargando ? "PROCESANDO..." : "ENVIAR ENLACE"}
                    </button>
                </form>
            </>
        ) : (
            <div style={{textAlign:'center'}}>
                <div style={{background:'#DEF7EC', width:'80px', height:'80px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px'}}>
                    <Mail size={40} color="#03543F" />
                </div>
                <h3 style={{color:'#03543F', marginBottom:'10px'}}>¡Correo Enviado!</h3>
                <p style={{color:'#6B7280', marginBottom:'30px', lineHeight:'1.5'}}>
                    Si el correo <strong>{correo}</strong> está registrado en nuestro sistema, recibirás las instrucciones en unos momentos.<br/><br/>
                    Recuerda revisar tu carpeta de Spam.
                </p>
                <button className="btn-submit" onClick={() => setEnviado(false)}>
                    VOLVER A INTENTAR
                </button>
            </div>
        )}
      </div>
    </div>
  );
}