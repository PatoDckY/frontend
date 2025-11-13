"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../styles/LoginPublico.css";

type LoginData = {
  correo: string;
  contrasena: string;
};

type Errores = Partial<Record<keyof LoginData, string>>;

export default function LoginPublico() {
  const router = useRouter();
  const [loginData, setLoginData] = useState<LoginData>({
    correo: "",
    contrasena: "",
  });
  const [errores, setErrores] = useState<Errores>({});
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    validarCampo(name as keyof LoginData, value);
  };

  const validarCampo = (name: keyof LoginData, value: string) => {
    let error = "";
    switch (name) {
      case "correo":
        if (!value) error = "El correo es obligatorio";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Correo inválido";
        break;
      case "contrasena":
        if (!value) error = "Ingrese su contraseña";
        break;
    }
    setErrores((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sinErrores =
      Object.values(errores).every((e) => !e) &&
      Object.values(loginData).every((v) => v.trim() !== "");

    if (!sinErrores) {
      toast.error("Corrige los errores antes de continuar");
      return;
    }

    try {
      setCargando(true);
      const res = await axios.post(
        "https://backend-7nyf.onrender.com/auth/login",
        loginData
      );

      const token = res.data.token;
      if (!token) {
        toast.error("No se recibió token del servidor");
        return;
      }

      // Guardamos el token JWT
      localStorage.setItem("token", token);

      toast.success(res.data.mensaje || "Inicio de sesión exitoso 🎉");

      // Redirige al home del cliente
      setTimeout(() => {
        router.push("/usuarios/client/screens/HomeClient");
      }, 1000);
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Correo o contraseña incorrectos");
      } else {
        toast.error("Error al conectar con el servidor");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Iniciar Sesión</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Correo Electrónico</label>
          <input
            type="email"
            name="correo"
            value={loginData.correo}
            onChange={handleChange}
            className={
              errores.correo
                ? "input-error"
                : loginData.correo
                ? "input-success"
                : ""
            }
          />
          {errores.correo && <p className="error">{errores.correo}</p>}
        </div>

        <div className="form-group password-group">
          <label>Contraseña</label>
          <div className="password-wrapper">
            <input
              type={mostrarContrasena ? "text" : "password"}
              name="contrasena"
              value={loginData.contrasena}
              onChange={handleChange}
              className={
                errores.contrasena
                  ? "input-error"
                  : loginData.contrasena
                  ? "input-success"
                  : ""
              }
            />
            <span
              className="icon"
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
            >
              {mostrarContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          {errores.contrasena && (
            <p className="error">{errores.contrasena}</p>
          )}
        </div>

        <button type="submit" className="btn-submit" disabled={cargando}>
          {cargando ? "Verificando..." : "Iniciar Sesión"}
        </button>

        <p className="registro-link">
          ¿No tienes cuenta?{" "}
          <Link href="/usuarios/public/screens/Registro" className="link">
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  );
}
