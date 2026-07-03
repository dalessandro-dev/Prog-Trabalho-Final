import { supabase } from '../database/supabase';

export const categoriaService = {
  async getAllCategorias() {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('title', { ascending: true });

    if (error) {
      throw error;
    }
    return data;
  }
};
