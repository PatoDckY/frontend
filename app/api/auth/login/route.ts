import { NextResponse } from 'next/server';
import { db } from '@/app/lib/db';
import { usuarios } from '@/app/lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import * as jose from 'jose'; // Librería moderna para JWT seguros (npm install jose)

export async function POST(req: Request) {
  try {
    const { correo, contrasena, codigoMfa } = await req.json();
    const ahora = new Date();

    // 1. Buscar usuario
    const usuariosEncontrados = await db
        .select()
        .from(usuarios)
        .where(eq(usuarios.correo, correo));

    const usuario = usuariosEncontrados[0];

    // Protección de enumeración de usuarios: Si no existe, devolvemos error genérico
    // pero tardamos un poco para evitar "timing attacks".
    if (!usuario) {
        await new Promise(r => setTimeout(r, 500)); 
        return NextResponse.json({ message: "Credenciales incorrectas" }, { status: 401 });
    }

    // 2. VERIFICAR BLOQUEO (Brute Force)
    if (usuario.bloqueadoHasta && usuario.bloqueadoHasta > ahora) {
        return NextResponse.json({ 
            message: "Cuenta bloqueada temporalmente por seguridad. Intenta en 15 minutos." 
        }, { status: 423 }); // 423 Locked
    }

    // 3. VERIFICAR CONTRASEÑA
    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!passwordValida) {
        // Incrementar contador de fallos
        const nuevosIntentos = (usuario.intentosFallidos || 0) + 1;
        let updateData: any = { intentosFallidos: nuevosIntentos };

        // Si llega a 3 fallos, bloquear por 15 minutos
        if (nuevosIntentos >= 3) {
            updateData.bloqueadoHasta = new Date(ahora.getTime() + 15 * 60 * 1000);
        }

        await db.update(usuarios)
            .set(updateData)
            .where(eq(usuarios.id, usuario.id));

        return NextResponse.json({ message: "Credenciales incorrectas" }, { status: 401 });
    }

    // 4. VERIFICAR MFA (Si está habilitado)
    if (usuario.mfaHabilitado) {
        if (!codigoMfa) {
            // Avisar al front que necesitamos el código
            return NextResponse.json({ 
                message: "Se requiere código MFA", 
                requireMfa: true 
            }, { status: 403 });
        }

        // Aquí validarías el código TOTP usando una librería como 'otplib'
        // const esValido = authenticator.check(codigoMfa, usuario.secretoMfa);
        // if (!esValido) return NextResponse.json({ message: "Código MFA inválido" }, { status: 401 });
    }

    // --- ÉXITO: RESETEAR INTENTOS ---
    await db.update(usuarios)
        .set({ intentosFallidos: 0, bloqueadoHasta: null })
        .where(eq(usuarios.id, usuario.id));

    // 5. GENERAR TOKEN JWT SEGURO (Estructura Header.Payload.Signature)
    // Usamos 'jose' para firmar con algoritmo HS256
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secreto_super_seguro_local');
    
    const token = await new jose.SignJWT({ 
        id: usuario.id, 
        rol: usuario.rolId, 
        version: usuario.versionToken // 🔥 CLAVE PARA REVOCACIÓN: Si cambias esto en BD, el token muere
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15m') // 🔥 Expiración corta (15 min)
      .sign(secret);

    // Quitamos info sensible
    const { contrasena: _, secretoMfa: __, ...usuarioSeguro } = usuario;

    return NextResponse.json({ token, usuario: usuarioSeguro });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}