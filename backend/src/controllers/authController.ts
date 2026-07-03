import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authService } from '../services/authService';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const {
        name, cpf, email, password
      } = req.body;

      // Validações básicas no backend (defesa em profundidade)
      if (!name || !cpf || !email || !password) {
        res.status(400).json({ success: false, message: 'Campos obrigatórios: name, cpf, email, password.' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ success: false, message: 'A senha deve ter no mínimo 6 caracteres.' });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ success: false, message: 'Formato de e-mail inválido.' });
        return;
      }

      const data = await authService.registerUser(req.body);

      console.log(`✅ Novo usuário cadastrado: ID=${data.id}, Nome=${data.name}, Email=${data.email}`);

      res.status(201).json({
        success: true,
        message: 'Cadastro realizado com sucesso!',
        data // Retorna os dados salvos (sem senha)
      });

    } catch (err: any) {
      if (err.message === 'EMAIL_EXISTS') {
        res.status(409).json({ success: false, message: 'E-mail já cadastrado.' });
        return;
      }
      if (err.message === 'CPF_EXISTS') {
        res.status(409).json({ success: false, message: 'CPF já cadastrado.' });
        return;
      }
      if (err.code === '23505') {
        const field = err.message.includes('email') ? 'E-mail' : 'CPF';
        res.status(409).json({ success: false, message: `${field} já cadastrado.` });
        return;
      }
      console.error('[POST /cadastro]', err.message);
      res.status(500).json({ success: false, message: 'Erro interno no servidor.' });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, message: 'E-mail e senha são obrigatórios.' });
        return;
      }

      // Busca usuário pelo email
      const user = await authService.loginUser(email);

      if (!user) {
        res.status(401).json({ success: false, message: 'E-mail ou senha incorretos.' });
        return;
      }

      // Compara a senha fornecida com o hash armazenado
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
        res.status(401).json({ success: false, message: 'E-mail ou senha incorretos.' });
        return;
      }

      // Gera um token JWT
      const secret = process.env.JWT_SECRET || 'secret_fallback';
      const token = jwt.sign(
        { id: user.id, email: user.email },
        secret,
        { expiresIn: '24h' }
      );

      console.log(`🔐 Login bem-sucedido: ID=${user.id}, Email=${user.email}`);

      res.json({
        success: true,
        message: 'Login realizado com sucesso!',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        redirect: '/pages/agendamento.html' // Indica ao frontend para onde redirecionar
      });

    } catch (err: any) {
      console.error('[POST /login]', err.message);
      res.status(500).json({ success: false, message: 'Erro interno no servidor.' });
    }
  }
};
