import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middlewares/validate.js';

const idParam = {
  params: z.object({
    id: z.coerce
      .number({ invalid_type_error: 'id deve ser numerico' })
      .int('id deve ser inteiro')
      .positive('id deve ser positivo'),
  }),
};

const searchQuery = {
  query: z.object({
    search: z.string().trim().max(100, 'busca excede o tamanho maximo').optional(),
  }),
};

// ──── Schemas por entidade ────

const pessoaBody = {
  body: z.object({
    nome: z.string().trim().min(1, 'nome e obrigatorio').max(100),
    sobrenome: z.string().trim().min(1, 'sobrenome e obrigatorio').max(100),
    cpf: z.string().trim().min(1, 'cpf e obrigatorio').max(14),
    data_nascimento: z.string().min(1, 'data de nascimento e obrigatoria'),
    data_falecimento: z.string().min(1, 'data de falecimento e obrigatoria'),
  }),
};

const registroBody = {
  body: z.object({
    pessoa_id: z.coerce.number().int().positive('pessoa_id deve ser positivo'),
    numero_registro: z.string().trim().min(1, 'numero de registro e obrigatorio').max(50),
    faf: z.string().trim().max(50).nullable().optional(),
    local_obito: z.string().trim().min(1, 'local de obito e obrigatorio').max(255),
    data_obito: z.string().min(1, 'data de obito e obrigatoria'),
    funeraria: z.string().trim().min(1, 'funeraria e obrigatoria').max(150),
  }),
};

const velorioBody = {
  body: z.object({
    registro_obito_id: z.coerce.number().int().positive('registro_obito_id deve ser positivo'),
    local_velorio: z.string().trim().min(1, 'local do velorio e obrigatorio').max(100),
    local_sepultamento: z.string().trim().min(1, 'local do sepultamento e obrigatorio').max(100),
    sala_velorio: z.string().trim().max(100).nullable().optional(),
    inicio_velorio: z.string().min(1, 'inicio do velorio e obrigatorio'),
    fim_velorio: z.string().nullable().optional(),
    inicio_sepultamento: z.string().nullable().optional(),
    fim_sepultamento: z.string().nullable().optional(),
  }),
};

const loginBody = {
  body: z.object({
    password: z.string().min(1, 'senha e obrigatoria'),
  }),
};

/**
 * @param {import('../controllers/AdminController.js').AdminController} controller
 * @param {import('express').RequestHandler} authMiddleware
 */
export function createAdminRouter(controller, authMiddleware) {
  const router = Router();

  // ──── Login Público ────
  router.post('/login', validate(loginBody), controller.login);

  // Proteger todas as rotas abaixo
  router.use(authMiddleware);

  // ──── Lookups (para selects de FK) ────
  router.get('/lookup/pessoas', controller.lookupPessoas);
  router.get('/lookup/registros', controller.lookupRegistros);

  // ──── Pessoas ────
  router.get('/pessoas', validate(searchQuery), controller.listarPessoas);
  router.get('/pessoas/:id', validate(idParam), controller.buscarPessoa);
  router.post('/pessoas', validate(pessoaBody), controller.criarPessoa);
  router.put('/pessoas/:id', validate({ ...idParam, ...pessoaBody }), controller.atualizarPessoa);
  router.delete('/pessoas/:id', validate(idParam), controller.excluirPessoa);

  // ──── Registros de Óbito ────
  router.get('/registros', validate(searchQuery), controller.listarRegistros);
  router.get('/registros/:id', validate(idParam), controller.buscarRegistro);
  router.post('/registros', validate(registroBody), controller.criarRegistro);
  router.put('/registros/:id', validate({ ...idParam, ...registroBody }), controller.atualizarRegistro);
  router.delete('/registros/:id', validate(idParam), controller.excluirRegistro);

  // ──── Velórios ────
  router.get('/velorios', validate(searchQuery), controller.listarVelorios);
  router.get('/velorios/:id', validate(idParam), controller.buscarVelorio);
  router.post('/velorios', validate(velorioBody), controller.criarVelorio);
  router.put('/velorios/:id', validate({ ...idParam, ...velorioBody }), controller.atualizarVelorio);
  router.delete('/velorios/:id', validate(idParam), controller.excluirVelorio);

  return router;
}
