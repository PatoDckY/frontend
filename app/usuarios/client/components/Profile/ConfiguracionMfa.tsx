"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShieldCheck, ShieldAlert, Check, X, Lock } from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function ConfiguracionMfa({ onClose }: Props) {
  // Estados generales
  const [cargando, setCargando] = useState(false);
  const [estaActivo, setEstaActivo] = useState(false);
  
  // Estados para ACTIVAR
  const [pasoActivacion, setPasoActivacion] = useState<"inicial" | "qr" | "final">("inicial");
  const [qrUrl, setQrUrl] = useState("");
  const [codigoOtp, setCodigoOtp] = useState("");

  // Estados para DESACTIVAR
  const [modoDesactivar, setModoDesactivar] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // Cargar estado inicial
  useEffect(() => {
    const stored = localStorage.getItem("usuario");
    if (stored) {
        const u = JSON.parse(stored);
        setEstaActivo(u.mfaHabilitado || false);
    }
  }, []);

  const getUsuario = () => {
      const stored = localStorage.getItem("usuario");
      return stored ? JSON.parse(stored) : null;
  };

  // --- LÓGICA ACTIVAR ---
  const iniciarConfiguracion = async () => {
    const usuario = getUsuario();
    if (!usuario) return;
    try {
      setCargando(true);
      const res = await axios.post("/api/auth/mfa/generate", { userId: usuario.id, correo: usuario.correo });
      setQrUrl(res.data.qrCodeUrl);
      setPasoActivacion("qr");
    } catch (error) { toast.error("Error al generar QR"); } 
    finally { setCargando(false); }
  };

  const confirmarActivacion = async () => {
    const usuario = getUsuario();
    if (codigoOtp.length < 6) return toast.warning("Ingresa el código completo");
    try {
      setCargando(true);
      await axios.post("/api/auth/mfa/enable", { userId: usuario.id, token: codigoOtp });
      
      toast.success("¡Seguridad Activada!");
      actualizarLocalStorage(true);
      setEstaActivo(true);
      setPasoActivacion("final");
    } catch (error) { toast.error("Código incorrecto"); } 
    finally { setCargando(false); }
  };

  // --- LÓGICA DESACTIVAR ---
  const desactivarMfa = async () => {
    const usuario = getUsuario();
    if (!passwordConfirm) return toast.warning("Ingresa tu contraseña para confirmar");

    try {
        setCargando(true);
        await axios.post("/api/auth/mfa/disable", { 
            userId: usuario.id, 
            contrasena: passwordConfirm 
        });

        toast.info("Seguridad de 2 pasos desactivada.");
        actualizarLocalStorage(false);
        setEstaActivo(false);
        setModoDesactivar(false);
        setPasswordConfirm("");
        setPasoActivacion("inicial"); // Resetear vista

    } catch (error: any) {
        if (error.response?.status === 401) toast.error("Contraseña incorrecta");
        else toast.error("No se pudo desactivar");
    } finally {
        setCargando(false);
    }
  };

  const actualizarLocalStorage = (estado: boolean) => {
      const u = getUsuario();
      if (u) {
          u.mfaHabilitado = estado;
          localStorage.setItem("usuario", JSON.stringify(u));
      }
  };

  return (
    <div style={{ padding: '30px', background: 'white', borderRadius: '20px', width: '100%', maxWidth: '450px', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
      
      <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <X size={18} color="#6B7280" />
      </button>

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
        <div style={{ background: estaActivo ? '#DCFCE7' : '#E0F2FE', padding: '12px', borderRadius: '50%' }}>
            {estaActivo ? <Check size={32} color="#10B981" /> : <ShieldCheck size={32} color="#0284C7" />}
        </div>
        <div>
            <h2 style={{ margin: 0, fontSize: '1.3rem', color: '#0F172A', fontWeight: '800' }}>
                {estaActivo ? "MFA Activo" : "Configurar MFA"}
            </h2>
            <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem' }}>
                {estaActivo ? "Tu cuenta está protegida" : "Aumenta la seguridad de tu cuenta"}
            </p>
        </div>
      </div>

      {/* --- VISTA: YA ESTÁ ACTIVO (OPCIÓN DE DESACTIVAR) --- */}
      {estaActivo && !modoDesactivar && (
          <div style={{textAlign:'center'}}>
              <p style={{color:'#64748B', marginBottom:'20px'}}>
                  La autenticación de dos factores está habilitada. Se te pedirá un código cada vez que inicies sesión.
              </p>
              <button 
                onClick={() => setModoDesactivar(true)}
                style={{background:'#FEF2F2', color:'#EF4444', border:'1px solid #FECACA', padding:'10px 20px', borderRadius:'10px', cursor:'pointer', fontWeight:'600', display:'flex', alignItems:'center', gap:'8px', margin:'0 auto'}}
              >
                  <ShieldAlert size={18}/> Desactivar Seguridad
              </button>
          </div>
      )}

      {/* --- VISTA: CONFIRMAR DESACTIVACIÓN (CON PASSWORD) --- */}
      {estaActivo && modoDesactivar && (
          <div style={{background:'#F8FAFC', padding:'20px', borderRadius:'15px', border:'1px solid #E2E8F0'}}>
              <h4 style={{margin:'0 0 10px 0', color:'#0F172A'}}>Confirmar Desactivación</h4>
              <p style={{fontSize:'0.9rem', color:'#64748B', marginBottom:'15px'}}>
                  Por tu seguridad, ingresa tu contraseña para desactivar la verificación en 2 pasos.
              </p>
              
              <div style={{display:'flex', alignItems:'center', background:'white', border:'1px solid #CBD5E1', borderRadius:'10px', padding:'0 10px', marginBottom:'15px'}}>
                  <Lock size={18} color="#94A3B8"/>
                  <input 
                    type="password" 
                    placeholder="Tu contraseña actual"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    style={{border:'none', outline:'none', padding:'10px', flex:1, fontSize:'0.95rem'}}
                  />
              </div>

              <div style={{display:'flex', gap:'10px'}}>
                  <button onClick={() => setModoDesactivar(false)} style={{flex:1, padding:'10px', background:'white', border:'1px solid #CBD5E1', borderRadius:'8px', cursor:'pointer', color:'#64748B'}}>Cancelar</button>
                  <button onClick={desactivarMfa} disabled={cargando} style={{flex:1, padding:'10px', background:'#EF4444', border:'none', borderRadius:'8px', cursor:'pointer', color:'white', fontWeight:'bold'}}>
                      {cargando ? "..." : "Desactivar"}
                  </button>
              </div>
          </div>
      )}

      {/* --- VISTA: FLUJO DE ACTIVACIÓN (QR) --- */}
      {!estaActivo && (
          <>
            {pasoActivacion === "inicial" && (
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#475569', marginBottom: '25px', lineHeight: '1.6' }}>
                        Al activar esto, escanea un código QR con tu celular. Generará códigos temporales para iniciar sesión.
                    </p>
                    <button onClick={iniciarConfiguracion} disabled={cargando} style={{ background: '#0A3D62', color: 'white', padding: '14px 25px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: 'bold', width: '100%', boxShadow: '0 4px 15px rgba(10, 61, 98, 0.3)' }}>
                        {cargando ? "Preparando..." : "Comenzar Configuración"}
                    </button>
                </div>
            )}

            {pasoActivacion === "qr" && (
                <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                    <p style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '15px' }}>1. Escanea con Google Authenticator.</p>
                    <div style={{ background: '#FFFFFF', padding: '10px', border: '2px dashed #CBD5E1', borderRadius: '15px', display: 'inline-block', marginBottom: '20px' }}>
                        <img src={qrUrl} alt="QR" width={180} height={180} style={{display:'block'}} />
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '10px' }}>2. Ingresa el código:</p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" placeholder="000000" maxLength={6} value={codigoOtp} onChange={(e) => setCodigoOtp(e.target.value.replace(/\D/g, ''))} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid #E2E8F0', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '4px' }} />
                        <button onClick={confirmarActivacion} disabled={cargando} style={{ flex: 1, background: '#FFC300', color: '#0A3D62', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '800' }}>
                            {cargando ? "..." : "CONFIRMAR"}
                        </button>
                    </div>
                </div>
            )}

            {pasoActivacion === "final" && (
                <div style={{textAlign:'center'}}>
                    <h3 style={{color:'#10B981'}}>¡Activado!</h3>
                    <button onClick={onClose} style={{marginTop:'15px', padding:'10px 30px', borderRadius:'20px', border:'none', background:'#F1F5F9', cursor:'pointer'}}>Cerrar</button>
                </div>
            )}
          </>
      )}
    </div>
  );
}