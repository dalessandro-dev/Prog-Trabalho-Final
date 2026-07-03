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
  }
};
