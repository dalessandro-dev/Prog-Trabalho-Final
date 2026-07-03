import { Router } from 'express';
import { homeController } from '../controllers/homeController';

const router = Router();

/**
 * GET /home
 * Dados agregados para a página inicial:
 * - Categorias (exceto "todos")
 * - 5 serviços mais procurados (is_popular = true)
 * - Depoimentos (fixos, pois não há tabela de depoimentos)
 * - Promoção ativa (fixa)
 */
router.get('/', homeController.getHome);

export default router;
