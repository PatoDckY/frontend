"use client";
import React from 'react';
import { useRouter } from "next/navigation";
import DetalleCursoView, { ImagenCurso } from './DetalleCursoView'; // Ajusta la ruta de importación
import { toast } from "react-toastify";

export default function DetalleCurso() {
  const router = useRouter();

  const handleCompra = () => {
    // Aquí iría tu lógica de Stripe, PayPal o redirección a WhatsApp
    toast.success("¡Redirigiendo a pasarela de pago!");
  };

  // --- DATOS DEL CURSO ESPECÍFICO (LAS 5 INTELIGENCIAS) ---
  const IMAGENES_CURSO: ImagenCurso[] = [
    {
        src: "/Inteligencias.jpg", // Cambia esto por una foto real del taller
        descripcion: "Escanealo con la aplicacion para visualizarlo en 3D"
    },
    {
        src: "/brains.png", // Otra imagen
        descripcion: "Material didáctico incluido en el kit de bienvenida."
    }
  ];

  const DESCRIPCION_LARGA = `
    Este curso está diseñado para padres que desean ir más allá de la crianza tradicional y entender cómo funciona realmente el cerebro de sus hijos.
    
    A lo largo de dos días intensivos, exploraremos:
    1. Inteligencia Emocional: Cómo ayudarles a gestionar sus frustraciones.
    2. Inteligencia Lógica: Juegos para despertar el pensamiento crítico.
    3. Inteligencia Creativa: El arte como medio de expresión.
    4. Inteligencia Social: Habilidades para relacionarse sanamente.
    5. Inteligencia Kinestésica: Conexión mente-cuerpo.

    No necesitas conocimientos previos de psicología. Todo se explica con ejemplos prácticos, ejercicios vivenciales y herramientas que podrás aplicar en casa desde el primer día.
    
    ¡Incluye manual de trabajo y refrigerio!
  `;

  return (
    <DetalleCursoView
      titulo="Las 5 Inteligencias del Cerebro Infantil"
      instructor="Dra. Mariana Echeverría"
      descripcionCompleta={DESCRIPCION_LARGA}
      horario="Viernes y Sábado 16:00 - 19:00"
      ubicacion="Auditorio Principal, Torre Médica 1"
      fechaInicio="05 Dic 2025"
      fechaFin="06 Dic 2025"
      cupoMaximo={30}
      cupoInscrito={5}
      dirigidoA="Padres de familia y tutores"
      costo={1200}
      imagenes={IMAGENES_CURSO} // Si borras esta línea, el layout se adapta a solo texto automáticamente
      onAdquirir={handleCompra}
    />
  );
}