import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import * as jose from 'jose';
import { db } from '@/app/lib/db';
import { usuarios } from '@/app/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Token no proporcionado' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'clave_super_secreta_local');

    // 1. Verificar integridad del Token
    let payload;
    try {
      const { payload: decoded } = await jose.jwtVerify(token, secret);
      payload = decoded;
    } catch (err) {
      return NextResponse.json({ message: 'Token inválido o expirado' }, { status: 401 });
    }

    // 2. Verificar la versión en la BD (REVOCACIÓN)
    // Buscamos el usuario y comparamos la 'versionToken'
    const usuario = await db.query.usuarios.findFirst({
        where: eq(usuarios.id, Number(payload.id)),
        columns: {
            id: true,
            versionToken: true, // Solo traemos esto para ser rápidos
            bloqueadoHasta: true
        }
    });

    if (!usuario) {
        return NextResponse.json({ message: 'Usuario ya no existe' }, { status: 401 });
    }

    // 🔥 EL PUNTO CLAVE: Si la versión en la BD es diferente a la del token,
    // significa que se cerró sesión en otro lado o se cambió la contraseña.
    if (usuario.versionToken !== payload.version) {
        return NextResponse.json({ message: 'Sesión revocada' }, { status: 401 });
    }

    // Validar bloqueo también por si acaso
    if (usuario.bloqueadoHasta && new Date(usuario.bloqueadoHasta) > new Date()) {
        return NextResponse.json({ message: 'Usuario bloqueado' }, { status: 401 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Error interno' }, { status: 500 });
  }
}