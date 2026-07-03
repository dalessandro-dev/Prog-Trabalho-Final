import { Router } from 'express';
import { petController } from '../controllers/petController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Aplica o middleware de autenticação em todas as rotas de pets
router.use(authMiddleware);

router.get('/', petController.getAll);
router.post('/', petController.create);

export default router;
