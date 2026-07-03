import { Router } from 'express';
import { categoriaController } from '../controllers/categoriaController';

const router = Router();

/**
 * GET /categorias
 * Critério 1 e 2: Lista todas as categorias de forma dinâmica
 */
router.get('/', categoriaController.getAll);

export default router;
