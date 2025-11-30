import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// Configuración optimizada para Vercel + Neon
const client = postgres(connectionString, { 
  prepare: false, // Vital para Neon/Serverless (evita errores de prepared statements)
  ssl: 'require'  // Asegura conexión encriptada
});

export const db = drizzle(client, { schema });