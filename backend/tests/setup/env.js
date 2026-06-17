process.env.NODE_ENV = 'test';
process.env.DATABASE_URL ??= 'postgres://placeholder:placeholder@localhost:5432/placeholder';
process.env.FRONTEND_ORIGIN ??= 'http://localhost:5173';
process.env.DB_SSL ??= 'false';
