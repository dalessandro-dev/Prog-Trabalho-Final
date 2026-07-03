import { supabase } from '../database/supabase';

export const servicoService = {
  async getServicos(categoria?: string) {
    let query = supabase
      .from('servicos')
      .select('*')
      .order('id', { ascending: true });

    // Aplica filtro por categoria se fornecido
    if (categoria && categoria !== 'todos') {
      query = query.eq('category_id', categoria);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getServicoById(id: number) {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }
    return data;
  }
};
