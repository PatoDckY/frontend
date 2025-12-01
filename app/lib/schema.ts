import { pgTable, serial, text, timestamp, integer,boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. Tabla Roles
export const roles = pgTable('roles', {
  id: serial('id').primaryKey(), // ID autoincremental
  nombre: text('nombre').notNull().unique(), // Nombre único (Cliente, Admin)
});

// 2. Tabla Usuarios
export const usuarios = pgTable('usuarios', {
  id: serial('id').primaryKey(),
  nombre: text('nombre').notNull(),
  apellidoPaterno: text('apellidoPaterno').notNull(),
  apellidoMaterno: text('apellidoMaterno'), // Opcional (sin notNull)
  edad: integer('edad').notNull(),
  sexo: text('sexo').notNull(),
  telefono: text('telefono').notNull(),
  correo: text('correo').notNull().unique(),
  contrasena: text('contrasena').notNull(),
  resetToken: text('reset_token'), // El código largo
  resetTokenExpiry: timestamp('reset_token_expiry'), // Cuándo caduca
  
  // Llave foránea (Foreign Key)
  rolId: integer('rol_id')
    .notNull()
    .references(() => roles.id), // Conecta con roles.id
});

// NUEVA TABLA PARA RATE LIMITING (Control de intentos)
export const intentosRecuperacion = pgTable('intentos_recuperacion', {
  id: serial('id').primaryKey(),
  identificador: text('identificador').notNull(), // Puede ser la IP o el Correo
  conteo: integer('conteo').default(0),
  ultimoIntento: timestamp('ultimo_intento').defaultNow(),
  bloqueadoHasta: timestamp('bloqueado_hasta'),
});

// 3. Relaciones (Para poder hacer 'findMany' con includes)
export const usuariosRelations = relations(usuarios, ({ one }) => ({
  rol: one(roles, {
    fields: [usuarios.rolId],
    references: [roles.id],
  }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  usuarios: many(usuarios),
}));