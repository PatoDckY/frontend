import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import { db } from '@/app/lib/db'; // 👈 Tu conexión Drizzle
import { usuarios } from '@/app/lib/schema'; // 👈 Tus tablas
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    // 👇 Esto sigue igual, obligatorio en Next.js 15
    const headersList = await headers(); 
    const authHeader = headersList.get('authorization');

    // 1. Verificar si existe el header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Token no proporcionado o inválido' }, 
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'default_secret';

    // 2. Verificar y decodificar el token
    let decoded: any;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return NextResponse.json(
        { message: 'Token inválido o expirado' }, 
        { status: 401 }
      );
    }

    // 3. Validar en Base de Datos (Estilo Drizzle)
    // Buscamos por ID (decoded.sub) y traemos el Rol
    const usuario = await db.query.usuarios.findFirst({
      where: eq(usuarios.id, Number(decoded.sub)),
      with: {
        rol: true 
      }
    });

    if (!usuario) {
      return NextResponse.json(
        { message: 'Token válido pero el usuario ya no existe' }, 
        { status: 401 }
      );
    }

    // 4. Retornar el perfil limpio
    return NextResponse.json({
      id: usuario.id,
      correo: usuario.correo,
      nombre: usuario.nombre,
      apellidoPaterno: usuario.apellidoPaterno,
      apellidoMaterno: usuario.apellidoMaterno,
      rol: usuario.rol?.nombre || 'Sin Rol', 
    });

  } catch (error) {
    console.error('Error en perfil:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}