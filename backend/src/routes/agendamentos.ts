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

// PUT /agendamentos/:id
router.put('/:id', agendamentoController.update);

// DELETE /agendamentos/:id
router.delete('/:id', agendamentoController.delete);

export default router;
