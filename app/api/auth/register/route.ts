import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Extraemos los datos (YA NO pedimos el rolId aquí)
    const { nombre, apellidoPaterno, apellidoMaterno, edad, sexo, telefono, correo, contrasena } = body;

    // 2. Definimos el rol por defecto (Cliente)
    const ROL_POR_DEFECTO = 1;

    // 3. Validar campos obligatorios (rolId ya no es necesario validarlo aquí)
    if (!correo || !contrasena || !nombre) {
      return NextResponse.json(
        { message: 'Faltan datos obligatorios (nombre, correo, contrasena)' }, 
        { status: 400 }
      );
    }

    // 4. Verificar si el usuario ya existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { correo: correo }
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { message: 'El correo ya está registrado' }, 
        { status: 409 }
      );
    }

    // 5. Verificar que el Rol 1 exista en la BD (Seguridad para que no truene)
    const rolExiste = await prisma.rol.findUnique({
      where: { id: ROL_POR_DEFECTO }
    });

    if (!rolExiste) {
      return NextResponse.json(
        { message: 'Error de configuración: El Rol "Cliente" (ID 1) no existe en la base de datos.' }, 
        { status: 500 }
      );
    }

    // 6. Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    // 7. Crear usuario forzando el rolId
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        edad: Number(edad),
        sexo,
        telefono,
        correo,
        contrasena: hashedPassword,
        rolId: ROL_POR_DEFECTO // 👈 AQUÍ LA MAGIA: Siempre será 1
      }
    });

    // 8. Retornar éxito sin password
    const { contrasena: _, ...usuarioSinPass } = nuevoUsuario;

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