import { Request, Response } from 'express';
import { homeService } from '../services/homeService';

export const homeController = {
  async getHome(_req: Request, res: Response) {
    try {
      const data = await homeService.getHomeData();
      res.json({
        success: true,
        data
      });
    } catch (err: any) {
      console.error('[GET /home]', err.message);
      res.status(500).json({ success: false, message: 'Erro ao carregar dados da home.' });
    }
  }
};
