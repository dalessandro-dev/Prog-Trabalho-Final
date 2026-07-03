import { Request, Response } from 'express';
import { petService } from '../services/petService';

export const petController = {
  async create(req: Request, res: Response) {
    try {
      const { name, species, breed, age, notes } = req.body;
      const user_id = req.userId; // Vem do middleware

      if (!name || name.trim().length < 2) {
        res.status(400).json({ success: false, message: 'O nome do pet deve ter pelo menos 2 caracteres.' });
        return;
      }

      if (!species || species.trim() === '') {
        res.status(400).json({ success: false, message: 'A espécie do pet é obrigatória (ex: Cachorro, Gato).' });
        return;
      }

      if (!user_id) {
        res.status(401).json({ success: false, message: 'Usuário não autenticado.' });
        return;
      }

      const data = await petService.registerPet({ name, species, breed, age, notes, user_id });

      res.status(201).json({
        success: true,
        message: 'Pet cadastrado com sucesso!',
        data
      });
    } catch (err: any) {
      console.error('[POST /pets]', err.message);
      res.status(500).json({ success: false, message: 'Erro ao cadastrar pet.' });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const user_id = req.userId;
      if (!user_id) {
        res.status(401).json({ success: false, message: 'Não autorizado.' });
        return;
      }

      const data = await petService.getPetsByUserId(user_id);
      res.json({ success: true, data });
    } catch (err: any) {
      console.error('[GET /pets]', err.message);
      res.status(500).json({ success: false, message: 'Erro ao buscar pets.' });
    }
  }
};
