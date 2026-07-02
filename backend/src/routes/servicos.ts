import { Router, Request, Response } from 'express';
import { supabase } from '../database/supabase';

const router = Router();

/**
 * GET /servicos
 * Critério 3 e 4: Lista serviços, filtrando por categoria via query param
 * Exemplo: GET /servicos?categoria=clinica
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { categoria } = req.query;

    let query = supabase
      .from('servicos')
      .select('*')
      .order('id', { ascending: true });

    // Aplica filtro por categoria se fornecido
    if (categoria && categoria !== 'todos') {
      query = query.eq('category_id', categoria as string);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json({ success: true, data });
  } catch (err: any) {
    console.error('[GET /servicos]', err.message);
    res.status(500).json({ success: false, message: 'Erro ao buscar serviços.' });
  }
});

/**
 * GET /servicos/:id
 * Critério 5: Retorna os detalhes completos de um serviço pelo ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      res.status(400).json({ success: false, message: 'ID inválido.' });
      return;
    }

    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .eq('id', parsedId)
      .single();

    if (error || !data) {
      res.status(404).json({ success: false, message: 'Serviço não encontrado.' });
      return;
    }

    res.json({ success: true, data });
  } catch (err: any) {
    console.error('[GET /servicos/:id]', err.message);
    res.status(500).json({ success: false, message: 'Erro ao buscar serviço.' });
  }
});

export default router;
