import { Router } from 'express';
import { servicoController } from '../controllers/servicoController';

const router = Router();

/**
 * GET /servicos
 * Critério 3 e 4: Lista serviços, filtrando por categoria via query param
 * Exemplo: GET /servicos?categoria=clinica
 */
router.get('/', servicoController.getAll);

/**
 * GET /servicos/:id
 * Critério 5: Retorna os detalhes completos de um serviço pelo ID
 */
router.get('/:id', servicoController.getById);

export default router;
