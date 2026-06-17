import pino from 'pino';
import { env } from './env.js';

function resolveLogLevel() {
  if (env.nodeEnv === 'test') return 'silent';
  return env.isProduction ? 'info' : 'debug';
}

export const logger = pino({
  level: resolveLogLevel(),
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'DATABASE_URL'],
    remove: true,
  },
});
