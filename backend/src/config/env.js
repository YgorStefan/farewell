import 'dotenv/config';
import { z } from 'zod';

const booleanFromString = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true');

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_URL: z.string().min(1).optional(),
    PGHOST: z.string().min(1).optional(),
    DB_SSL: booleanFromString.default('false'),
    FRONTEND_ORIGIN: z.string().default('http://localhost:5173'),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
    RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
  })
  .refine((data) => Boolean(data.DATABASE_URL || data.PGHOST), {
    message: 'Defina DATABASE_URL ou as variaveis PG* (PGHOST, PGUSER, PGPASSWORD, PGDATABASE)',
    path: ['DATABASE_URL'],
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('\n');
  throw new Error(`Variaveis de ambiente invalidas:\n${issues}`);
}

const data = parsed.data;

export const env = Object.freeze({
  nodeEnv: data.NODE_ENV,
  isProduction: data.NODE_ENV === 'production',
  port: data.PORT,
  databaseUrl: data.DATABASE_URL ?? null,
  databaseSsl: data.DB_SSL,
  allowedOrigins: data.FRONTEND_ORIGIN.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  rateLimit: {
    windowMs: data.RATE_LIMIT_WINDOW_MS,
    max: data.RATE_LIMIT_MAX,
  },
});
