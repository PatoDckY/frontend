import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { usuarios } from '@/app/lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import * as jose from 'jose'; 

export async function POST(req: Request) {
  try {
    const { correo, contrasena, codigoMfa } = await req.json();
    const ahora = new Date();

    // 1. BUSCAR USUARIO CON SU ROL (CORRECCIÓN AQUÍ) 🛠️
    // Usamos db.query en lugar de db.select para incluir la relación 'rol'
    const usuario = await db.query.usuarios.findFirst({
        where: eq(usuarios.correo, correo),
        with: {
            rol: true // <--- ¡ESTO TRAE EL NOMBRE "admin"!
        }
    });

    // Protección contra enumeración
    if (!usuario) {
        await new Promise(r => setTimeout(r, 500)); 
        return NextResponse.json({ message: "Credenciales incorrectas" }, { status: 401 });
    }

    // 2. VERIFICAR BLOQUEO
    if (usuario.bloqueadoHasta && usuario.bloqueadoHasta > ahora) {
        return NextResponse.json({ 
            message: "Cuenta bloqueada temporalmente. Intenta en 15 minutos." 
        }, { status: 423 });
    }

    // 3. VERIFICAR CONTRASEÑA
    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!passwordValida) {
        const nuevosIntentos = (usuario.intentosFallidos || 0) + 1;
        let updateData: any = { intentosFallidos: nuevosIntentos };

        if (nuevosIntentos >= 3) {
            updateData.bloqueadoHasta = new Date(ahora.getTime() + 15 * 60 * 1000);
        }

        await db.update(usuarios)
            .set(updateData)
            .where(eq(usuarios.id, usuario.id));

        return NextResponse.json({ message: "Credenciales incorrectas" }, { status: 401 });
    }

    // 4. VERIFICAR MFA
    if (usuario.mfaHabilitado) {
        if (!codigoMfa) {
            return NextResponse.json({ message: "Se requiere código MFA", requireMfa: true }, { status: 403 });
        }
        // Aquí validarías el código...
    }

    // --- ÉXITO ---
    await db.update(usuarios)
        .set({ intentosFallidos: 0, bloqueadoHasta: null })
        .where(eq(usuarios.id, usuario.id));

    // 5. GENERAR TOKEN
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'clave_super_secreta_local');
    
    const token = await new jose.SignJWT({ 
        id: usuario.id, 
        rol: usuario.rolId, 
        version: usuario.versionToken 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(secret);

    const { contrasena: _, secretoMfa: __, ...usuarioSeguro } = usuario;

    // AHORA usuarioSeguro INCLUYE EL OBJETO ROL: { id: 2, nombre: "admin" }
    return NextResponse.json({ token, usuario: usuarioSeguro });

  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}