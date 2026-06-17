import { spawnSync } from 'node:child_process';

const target = process.env.DAST_TARGET || 'http://host.docker.internal:3000';
const image = 'ghcr.io/zaproxy/zaproxy:stable';

console.log(`OWASP ZAP baseline scan -> ${target}`);
console.log(`Imagem: ${image} (o primeiro pull pode demorar alguns minutos)`);

const result = spawnSync(
  'docker',
  [
    'run',
    '--rm',
    image,
    'zap-baseline.py',
    '-t',
    target,
    '-I', 
    '-m',
    '2', 
  ],
  { stdio: 'inherit' }
);

if (result.error) {
  console.error('Falha ao executar o Docker/ZAP:', result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
