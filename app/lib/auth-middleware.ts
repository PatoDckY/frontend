import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import * as jose from 'jose';

// Verifica si el usuario es Admin. Úsalo al inicio de tus route.ts administrativos.
export async function verificarAdmin() {
  const headersList = await headers();
  const authHeader = headersList.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: NextResponse.json({ message: 'No autorizado' }, { status: 401 }) };
  }

  const token = authHeader.split(' ')[1];
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'clave_super_secreta_local');

  try {
    const { payload } = await jose.jwtVerify(token, secret);
    
    // Verificar Rol (Asumiendo que 2 es Admin, ajusta según tu BD)
    // También puedes verificar el string si guardaste nombres: payload.rol === 'admin'
    if (payload.rol !== 2 && payload.rol !== 'admin') { 
        return { error: NextResponse.json({ message: 'Acceso denegado: Se requieren permisos de Administrador' }, { status: 403 }) };
    }

    return { usuarioId: payload.id }; // Éxito

  } catch (err) {
    return { error: NextResponse.json({ message: 'Token inválido' }, { status: 401 }) };
  }
}