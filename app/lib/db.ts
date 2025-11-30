import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema'; // Importamos las tablas

const connectionString = process.env.DATABASE_URL!;

// Configuración del cliente de Postgres
const client = postgres(connectionString);

// Inicializamos Drizzle con el esquema
export const db = drizzle(client, { schema });