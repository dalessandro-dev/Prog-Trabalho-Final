import { Request, Response } from 'express';
import { categoriaService } from '../services/categoriaService';

export const categoriaController = {
  async getAll(_req: Request, res: Response) {
    try {
      const data = await categoriaService.getAllCategorias();
      res.json({ success: true, data });
    } catch (err: any) {
      console.error('[GET /categorias]', err.message);
      res.status(500).json({ success: false, message: 'Erro ao buscar categorias.' });
    }
  }
};
