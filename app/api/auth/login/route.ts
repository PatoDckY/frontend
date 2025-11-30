import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '@/app/lib/db'; // Tu conexión Drizzle
import { usuarios } from '@/app/lib/schema'; // Tus tablas
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { correo, contrasena } = body;

    // 1. BUSCAR EN BASE DE DATOS (Estilo Drizzle Query)
    // Usamos .findFirst() que es muy parecido al findUnique de Prisma
    const usuario = await db.query.usuarios.findFirst({
      where: eq(usuarios.correo, correo),
      with: {
        rol: true // 👈 2. Traemos la relación (igual que include en Prisma)
      }
    });
    
    // Si no existe el usuario
    if (!usuario) {
      return NextResponse.json(
        { message: 'Correo o contraseña incorrectos' }, 
        { status: 401 }
      );
    }

    // 3. Validar contraseña (bcrypt)
    const passValido = await bcrypt.compare(contrasena, usuario.contrasena);
    
    if (!passValido) {
      return NextResponse.json(
        { message: 'Correo o contraseña incorrectos' }, 
        { status: 401 }
      );
    }

    // 4. Generar Token JWT
    const payload = { 
      sub: usuario.id, 
      correo: usuario.correo, 
      nombre: usuario.nombre, 
      // El '?' protege si el usuario no tuviera rol asignado (aunque en BD es notNull)
      rol: usuario.rol?.nombre 
    };

    const secret = process.env.JWT_SECRET || 'default_secret';
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    // 5. Retornar respuesta
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