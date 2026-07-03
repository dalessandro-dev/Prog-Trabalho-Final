import { Router } from 'express';
import { agendamentoController } from '../controllers/agendamentoController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Aplica o middleware JWT
router.use(authMiddleware);

// GET /agendamentos
router.get('/', agendamentoController.getAll);

// POST /agendamentos
router.post('/', agendamentoController.create);

export default router;
