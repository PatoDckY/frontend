"use client";

import { useState } from "react";

export default function EnlaceMagico() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const enviarEnlace = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setMensaje("");

    try {
      const respuesta = await fetch("https://backend-7nyf.onrender.com/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo }),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) throw new Error(data.message || "Error al enviar el enlace");

      setMensaje("✅ Enlace mágico enviado. Revisa tu correo.");
    } catch (error: any) {
      setMensaje(`❌ ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", textAlign: "center" }}>
      <h2>Iniciar sesión con enlace mágico ✨</h2>
      <p>Introduce tu correo y te enviaremos un enlace seguro</p>

      <form onSubmit={enviarEnlace}>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="tuemail@gmail.com"
          required
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "10px",
          }}
        />
        <button
          type="submit"
          disabled={cargando}
          style={{
            width: "100%",
            backgroundColor: "#6c63ff",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {cargando ? "Enviando..." : "Enviar enlace mágico"}
        </button>
      </form>

      {mensaje && (
        <p style={{ marginTop: "15px", color: mensaje.startsWith("✅") ? "green" : "red" }}>
          {mensaje}
        </p>
      )}
    </div>
  );
}
