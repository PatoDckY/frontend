import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // 👈 Importante: Usamos cookies ahora
import * as jose from 'jose';
import { db } from '@/app/lib/db';
import { usuarios } from '@/app/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    // 1. OBTENER TOKEN DE LA COOKIE
    // Ya no usamos 'headers().get("authorization")' porque la cookie es más segura
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'No hay sesión activa' }, { status: 401 });
    }

    // 2. VERIFICAR TOKEN
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'clave_super_secreta_local');
    
    let payload;
    try {
      const { payload: decoded } = await jose.jwtVerify(token, secret);
      payload = decoded;
    } catch (err) {
      return NextResponse.json({ message: 'Token inválido o expirado' }, { status: 401 });
    }

    // 3. BUSCAR USUARIO EN BASE DE DATOS
    const userId = Number(payload.id); 

    const usuario = await db.query.usuarios.findFirst({
      where: eq(usuarios.id, userId),
      with: {
        rol: true 
      },
      // Traemos 'versionToken' para validar que la sesión sea legítima
      columns: {
        id: true,
        nombre: true,
        apellidoPaterno: true,
        apellidoMaterno: true,
        correo: true,
        versionToken: true 
      }
    });

    if (!usuario) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    // 4. SEGURIDAD EXTRA: VALIDAR REVOCACIÓN
    // Si la versión en la BD es distinta a la del token, significa que se cerró sesión remotamente
    if (usuario.versionToken !== payload.version) {
         return NextResponse.json({ message: 'Sesión revocada' }, { status: 401 });
    }

    // 5. RETORNAR PERFIL LIMPIO
    return NextResponse.json({
      nombreCompleto: `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno || ''}`.trim(),
      correo: usuario.correo,
      rol: usuario.rol?.nombre || 'Usuario',
      id: usuario.id
    });

  } catch (error) {
    console.error('Error en perfil:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}