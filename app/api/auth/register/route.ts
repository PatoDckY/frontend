import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '@/app/lib/db'; // 👈 Tu nueva conexión Drizzle
import { usuarios, roles } from '@/app/lib/schema'; // 👈 Tus tablas
import { eq } from 'drizzle-orm'; // Operador "igual"

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Extraemos los datos
    const { nombre, apellidoPaterno, apellidoMaterno, edad, sexo, telefono, correo, contrasena } = body;

    const ROL_POR_DEFECTO = 1;

    // 2. Validar campos obligatorios
    if (!correo || !contrasena || !nombre) {
      return NextResponse.json(
        { message: 'Faltan datos obligatorios (nombre, correo, contrasena)' }, 
        { status: 400 }
      );
    }

    // 3. Verificar si el usuario ya existe
    // Prisma: prisma.usuario.findUnique(...)
    // Drizzle: select().from().where()
    const usuariosEncontrados = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.correo, correo));

    if (usuariosEncontrados.length > 0) {
      return NextResponse.json(
        { message: 'El correo ya está registrado' }, 
        { status: 409 }
      );
    }

    // 4. Verificar que el Rol 1 exista (Seguridad)
    // Prisma: prisma.rol.findUnique(...)
    const rolesEncontrados = await db
      .select()
      .from(roles)
      .where(eq(roles.id, ROL_POR_DEFECTO));

    if (rolesEncontrados.length === 0) {
      return NextResponse.json(
        { message: 'Error de configuración: El Rol "Cliente" (ID 1) no existe en la base de datos.' }, 
        { status: 500 }
      );
    }

    // 5. Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    // 6. Crear usuario
    // Prisma: prisma.usuario.create({ data: ... })
    // Drizzle: insert(tabla).values(...).returning()
    const nuevosUsuarios = await db.insert(usuarios).values({
        nombre,
        apellidoPaterno,
        apellidoMaterno: apellidoMaterno || null, // Manejo de opcional
        edad: Number(edad),
        sexo,
        telefono,
        correo,
        contrasena: hashedPassword,
        rolId: ROL_POR_DEFECTO
    }).returning(); // 👈 Importante: Drizzle no devuelve el objeto creado por defecto, hay que pedirlo.

    // 7. Retornar éxito sin password
    // 'nuevosUsuarios' es un array, tomamos el primero
    const usuarioCreado = nuevosUsuarios[0];
    const { contrasena: _, ...usuarioSinPass } = usuarioCreado;

    return NextResponse.json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: usuarioSinPass
    }, { status: 201 });

  } catch (error) {
    console.error('Error al registrar:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}