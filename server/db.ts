import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // 🟢 CONFIGURAÇÃO PARA RESOLVER O ERRO TLS/SSL
  ssl: {
    // Permite que o driver se conecte mesmo que o hostname (pooler.c.c2...)
    // não corresponda perfeitamente ao padrão do certificado (*.us-west-2...).
    rejectUnauthorized: false, 
  },
  // 🟢 NOVA CONFIGURAÇÃO PARA RESOLVER O ERRO ENETUNREACH
  // Força o driver a usar IPv4, contornando problemas de rota IPv6 no Render/Supabase.
  family: 4, 
});

export const db = drizzle(pool, { schema });
