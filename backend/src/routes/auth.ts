import { Router } from 'express';
import { authController } from '../controllers/authController';

const router = Router();

/**
 * POST /cadastro
 * Critério 6a e 8: Cadastra novo usuário com senha hasheada e salva no banco.
 */
router.post('/cadastro', authController.register);

/**
 * POST /login
 * Critério 6b e 7: Autentica o usuário com email + senha.
 * Em caso de sucesso, redireciona para o carrinho (agendamento).
 */
router.post('/login', authController.login);

export default router;
