import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import * as React from 'react';
import EmailVerificacion from '@/app/usuarios/visitante/components/emails/EmailVerificacion';
import { otpMemoria } from '@/app/lib/otpStore';

export async function POST(req: Request) {
  try {
    const { correo, nombre } = await req.json();

    if (!correo) {
        return NextResponse.json({ message: "El correo es obligatorio" }, { status: 400 });
    }
    
    // 1. FORZAR MINÚSCULAS Y QUITAR ESPACIOS (Crucial para que coincida después)
    const emailNormalizado = correo.trim().toLowerCase(); 

    // 2. Generar código de 6 dígitos
    const codigoGenerado = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. GUARDAR EN MEMORIA
    // Usamos el email normalizado como "llave"
    otpMemoria.set(emailNormalizado, { 
        code: codigoGenerado,
        expires: Date.now() + 10 * 60 * 1000 // Expira en 10 minutos
    });

    // Log para depuración (puedes borrarlo luego)
    console.log(`CÓDIGO GENERADO para ${emailNormalizado}: ${codigoGenerado}`);

    // 4. Renderizar el HTML del correo
    const emailHtml = await render(
      React.createElement(EmailVerificacion, { 
        codigoValidacion: codigoGenerado, 
        nombreUsuario: nombre 
      })
    );

    // 5. Configurar transporte de Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
    });

    // 6. Enviar el correo
    await transporter.sendMail({
      from: '"Centro Médico Pichardo" <tucorreo@gmail.com>',
      to: correo, // Al usuario se le envía al correo original (aunque internamente guardamos en minúsculas)
      subject: `Tu código de verificación: ${codigoGenerado}`,
      html: emailHtml,
    });

    return NextResponse.json({ message: "Código enviado correctamente" });

  } catch (error) {
    console.error("Error enviando correo:", error);
    return NextResponse.json({ message: "Error interno al enviar correo" }, { status: 500 });
  }
}