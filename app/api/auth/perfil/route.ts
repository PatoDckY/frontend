import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import * as jose from 'jose'; // Usamos la misma librería que en el Login
import { db } from '@/app/lib/db';
import { usuarios } from '@/app/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const headersList = await headers(); 
    const authHeader = headersList.get('authorization');

    // 1. Validar Header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Token no proporcionado' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    // 2. Verificar Token (Usando 'jose' para compatibilidad con el Login)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'clave_super_secreta_local');
    
    let payload;
    try {
      const { payload: decoded } = await jose.jwtVerify(token, secret);
      payload = decoded;
    } catch (err) {
      return NextResponse.json({ message: 'Token inválido o expirado' }, { status: 401 });
    }

    // 3. Buscar Usuario en BD
    // OJO: En el Login guardamos 'id', no 'sub'.
    const userId = Number(payload.id); 

    const usuario = await db.query.usuarios.findFirst({
      where: eq(usuarios.id, userId),
      with: {
        rol: true 
      }
    });

    if (!usuario) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    // 4. Retornar solo lo que pediste
    return NextResponse.json({
      nombreCompleto: `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno || ''}`.trim(),
      correo: usuario.correo,
      // Extras por si acaso los ocupas visualmente
      rol: usuario.rol?.nombre || 'Usuario',
      id: usuario.id
    });

  } catch (error) {
    console.error('Error en perfil:', error);
    return NextResponse.json({ message: 'Error interno' }, { status: 500 });
  }
}