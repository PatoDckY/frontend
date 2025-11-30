import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '@/app/lib/prisma'; // 👈 1. IMPORTANTE: Asegúrate de tener este archivo (ver abajo si no)

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { correo, contrasena } = body;

    // 2. BUSCAR EN BASE DE DATOS REAL
    const usuario = await prisma.usuario.findUnique({
      where: { 
        correo: correo 
      },
      include: { 
        rol: true // 👈 3. Traemos la relación para leer usuario.rol.nombre
      }
    });
    
    // Si no existe el usuario
    if (!usuario) {
      return NextResponse.json(
        { message: 'Correo o contraseña incorrectos' }, 
        { status: 401 }
      );
    }

    // 4. Validar contraseña (bcrypt)
    // Nota: Esto asume que en tu registro hasheaste la contraseña
    const passValido = await bcrypt.compare(contrasena, usuario.contrasena);
    
    if (!passValido) {
      return NextResponse.json(
        { message: 'Correo o contraseña incorrectos' }, 
        { status: 401 }
      );
    }

    // 5. Generar Token JWT
    const payload = { 
      sub: usuario.id, 
      correo: usuario.correo, 
      nombre: usuario.nombre, 
      // Ojo: Si el rol es null por alguna razón, esto fallaría. 
      // El '?' protege si el usuario no tuviera rol asignado.
      rol: usuario.rol?.nombre 
    };

    const secret = process.env.JWT_SECRET || 'default_secret';
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    // 6. Retornar respuesta
    return NextResponse.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id,
        correo: usuario.correo,
        nombre: usuario.nombre,
        rol: usuario.rol?.nombre
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}