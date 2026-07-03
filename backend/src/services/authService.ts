import bcrypt from 'bcryptjs';
import { supabase } from '../database/supabase';

export const authService = {
  async registerUser(userData: any) {
    const { name, cpf, email, phone, city, address, password, petName, petSpecies, petBreed, petAge, petNotes } = userData;

    const cpfLimpo = cpf.replace(/\D/g, '');

    // Verifica se e-mail ou CPF já existem
    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('email, cpf')
      .or(`email.eq.${email},cpf.eq.${cpfLimpo}`)
      .maybeSingle();

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error('EMAIL_EXISTS');
      }
      if (existingUser.cpf === cpfLimpo) {
        throw new Error('CPF_EXISTS');
      }
    }

    // Hash seguro da senha
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insere o usuário no Supabase
    const { data: userDataDb, error: userError } = await supabase
      .from('usuarios')
      .insert([{
        name,
        cpf: cpfLimpo,
        email,
        phone: phone ? phone.replace(/\D/g, '') : null,
        city,
        address,
        password_hash: passwordHash
      }])
      .select('id, name, email, cpf, created_at')
      .single();

    if (userError) {
      throw userError;
    }

    // Se informou dados do pet, insere na tabela pets
    if (petName && petSpecies) {
      const { error: petError } = await supabase
        .from('pets')
        .insert([{
          name: petName,
          species: petSpecies,
          breed: petBreed || null,
          age: petAge || null,
          notes: petNotes || null,
          user_id: userDataDb.id
        }]);

      if (petError) {
        console.error('Erro ao salvar pet:', petError.message);
        // Não lançamos o erro para não invalidar o cadastro do usuário que já ocorreu
      }
    }

    // Retorna os dados do usuário com o nome do pet injetado apenas para manter retrocompatibilidade no retorno caso algo espere
    return { ...userDataDb, pet_name: petName };
  },

  async loginUser(email: string) {
    const { data: user, error } = await supabase
      .from('usuarios')
      .select('id, name, email, password_hash')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !user) {
      return null;
    }
    return user;
  }
};
