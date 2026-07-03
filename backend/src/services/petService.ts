import { supabase } from '../database/supabase';

export const petService = {
  async registerPet(petData: { name: string; species: string; breed?: string; age?: string; notes?: string; user_id: number }) {
    const { data, error } = await supabase
      .from('pets')
      .insert([{
        name: petData.name,
        species: petData.species,
        breed: petData.breed || null,
        age: petData.age || null,
        notes: petData.notes || null,
        user_id: petData.user_id
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }
    return data;
  },

  async getPetsByUserId(userId: number) {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }
    return data;
  },

  async updatePet(id: number, userId: number, petData: { name?: string; species?: string; breed?: string; age?: string; notes?: string }) {
    const { data, error } = await supabase
      .from('pets')
      .update(petData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }
    return data;
  },

  async deletePet(id: number, userId: number) {
    // Apaga os vínculos em agendamento_pets para evitar erro de chave estrangeira
    await supabase.from('agendamento_pets').delete().eq('pet_id', id);

    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }
    return true;
  }
};
