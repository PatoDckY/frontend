"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import "../styles/RegistroPublico.css";

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
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const name = e.target.name as keyof FormData;
    let value = e.target.value;

    if (["nombre", "apellidoPaterno", "apellidoMaterno"].includes(name))
      value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    if (name === "telefono") value = value.replace(/[^0-9]/g, "").slice(0, 10);

    setFormData({ ...formData, [name]: value });
    validarCampo(name, value);
  };

  const validarCampo = (name: keyof FormData, value: string) => {
    let error = "";

    switch (name) {
      case "nombre":
      case "apellidoPaterno":
        if (!value.trim()) error = "Este campo es obligatorio";
        break;
      case "edad":
        if (!value) {
          error = "La edad es obligatoria";
        } else if (isNaN(Number(value))) {
          error = "La edad debe ser un número";
        } else if (Number(value) < 18) {
          error = "Debes ser mayor de 18 años para registrarte";
        } else if (Number(value) > 100) {
          error = "La edad no puede superar los 100 años";
        }
        break;
      case "sexo":
        if (!value) error = "Seleccione un sexo";
        break;
      case "telefono":
        if (!/^[0-9]{10}$/.test(value)) error = "El teléfono debe tener 10 dígitos";
        break;
      case "correo":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Ingrese un correo válido";
        break;
      case "contrasena":
        if (value.length < 6) error = "Mínimo 6 caracteres";
        if (formData.confirmarContrasena && value !== formData.confirmarContrasena)
          setErrores((prev) => ({
            ...prev,
            confirmarContrasena: "Las contraseñas no coinciden",
          }));
        break;
      case "confirmarContrasena":
        if (value !== formData.contrasena) error = "Las contraseñas no coinciden";
        break;
    }

    setErrores((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sinErrores =
      Object.values(errores).every((e) => !e) &&
      Object.values(formData).every((v) => v.trim() !== "");

    if (!sinErrores) {
      toast.error("Corrige los errores antes de enviar");
      return;
    }

    try {
      const response = await fetch("https://backend-7nyf.onrender.com/usuarios/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Registro exitoso 🎉");
        setTimeout(() => router.push("/usuarios/public/screens/Login"), 2000);
        setFormData({
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
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Error al registrar");
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor");
    }
  };

  return (
    <div className="registro-container">
      <h1>Crear cuenta</h1>
      <form className="registro-form" onSubmit={handleSubmit}>
        {/* Nombre */}
        <div className="form-group">
          <label>Nombre</label>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={errores.nombre ? "input-error" : formData.nombre ? "input-success" : ""}
          />
          {errores.nombre && <p className="error">{errores.nombre}</p>}
        </div>

        {/* Apellidos */}
        <div className="form-group">
          <label>Apellido Paterno</label>
          <input
            name="apellidoPaterno"
            value={formData.apellidoPaterno}
            onChange={handleChange}
            className={errores.apellidoPaterno ? "input-error" : formData.apellidoPaterno ? "input-success" : ""}
          />
          {errores.apellidoPaterno && <p className="error">{errores.apellidoPaterno}</p>}
        </div>

        <div className="form-group">
          <label>Apellido Materno</label>
          <input
            name="apellidoMaterno"
            value={formData.apellidoMaterno}
            onChange={handleChange}
            className={formData.apellidoMaterno ? "input-success" : ""}
          />
        </div>

        {/* Edad y sexo */}
        <div className="form-row">
          <div className="form-group half">
            <label>Edad</label>
            <input
              name="edad"
              type="number"
              min="0"
              value={formData.edad}
              onChange={handleChange}
              className={errores.edad ? "input-error" : formData.edad ? "input-success" : ""}
            />
            {errores.edad && <p className="error">{errores.edad}</p>}
          </div>

          <div className="form-group half">
            <label>Sexo</label>
            <select
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              className={errores.sexo ? "input-error" : formData.sexo ? "input-success" : ""}
            >
              <option value="">Seleccione...</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
            </select>
            {errores.sexo && <p className="error">{errores.sexo}</p>}
          </div>
        </div>

        {/* Teléfono y correo */}
        <div className="form-group">
          <label>Teléfono</label>
          <input
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="10 dígitos"
            className={errores.telefono ? "input-error" : formData.telefono ? "input-success" : ""}
          />
          {errores.telefono && <p className="error">{errores.telefono}</p>}
        </div>

        <div className="form-group">
          <label>Correo Electrónico</label>
          <input
            name="correo"
            type="email"
            value={formData.correo}
            onChange={handleChange}
            className={errores.correo ? "input-error" : formData.correo ? "input-success" : ""}
          />
          {errores.correo && <p className="error">{errores.correo}</p>}
        </div>

        {/* Contraseñas */}
        <div className="form-group password-group">
          <label>Contraseña</label>
          <div className="password-wrapper">
            <input
              name="contrasena"
              type={mostrarContrasena ? "text" : "password"}
              value={formData.contrasena}
              onChange={handleChange}
              className={errores.contrasena ? "input-error" : formData.contrasena ? "input-success" : ""}
            />
            <span className="icon" onClick={() => setMostrarContrasena(!mostrarContrasena)}>
              {mostrarContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          {errores.contrasena && <p className="error">{errores.contrasena}</p>}
        </div>

        <div className="form-group password-group">
          <label>Confirmar Contraseña</label>
          <div className="password-wrapper">
            <input
              name="confirmarContrasena"
              type={mostrarConfirmar ? "text" : "password"}
              value={formData.confirmarContrasena}
              onChange={handleChange}
              className={errores.confirmarContrasena ? "input-error" : formData.confirmarContrasena ? "input-success" : ""}
            />
            <span className="icon" onClick={() => setMostrarConfirmar(!mostrarConfirmar)}>
              {mostrarConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          {errores.confirmarContrasena && <p className="error">{errores.confirmarContrasena}</p>}
        </div>

        <button type="submit" className="btn-submit">Registrar</button>

        <p className="login-link">
          ¿Ya tienes cuenta?{" "}
          <Link href="/usuarios/public/screens/Login" className="link">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}