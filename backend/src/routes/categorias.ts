import { Router, Request, Response } from 'express';
import { supabase } from '../database/supabase';

const router = Router();

/**
 * GET /categorias
 * Critério 1 e 2: Lista todas as categorias de forma dinâmica
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('title', { ascending: true });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err: any) {
    console.error('[GET /categorias]', err.message);
    res.status(500).json({ success: false, message: 'Erro ao buscar categorias.' });
  }
});

export default router;
