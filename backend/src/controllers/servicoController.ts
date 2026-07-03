import { Request, Response } from 'express';
import { servicoService } from '../services/servicoService';

export const servicoController = {
  async getAll(req: Request, res: Response) {
    try {
      const { categoria } = req.query;
      const data = await servicoService.getServicos(categoria as string | undefined);
      res.json({ success: true, data });
    } catch (err: any) {
      console.error('[GET /servicos]', err.message);
      res.status(500).json({ success: false, message: 'Erro ao buscar serviços.' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const parsedId = parseInt(id, 10);

      if (isNaN(parsedId)) {
        res.status(400).json({ success: false, message: 'ID inválido.' });
        return;
      }

      const data = await servicoService.getServicoById(parsedId);

      if (!data) {
        res.status(404).json({ success: false, message: 'Serviço não encontrado.' });
        return;
      }

      res.json({ success: true, data });
    } catch (err: any) {
      console.error('[GET /servicos/:id]', err.message);
      res.status(500).json({ success: false, message: 'Erro ao buscar serviço.' });
    }
  }
};
