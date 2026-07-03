import { supabase } from '../database/supabase';

export const agendamentoService = {
  async registerAgendamento(agendamentoData: { itens: any[], pets_ids?: number[], total: number, user_id?: number }) {
    const protocolId = `PET-${Math.floor(Math.random() * 999999)}`;
    
    // 1. Insere o Agendamento principal
    const { data: agendamento, error: agendamentoError } = await supabase
      .from('agendamentos')
      .insert([{
        protocol_id: protocolId,
        total: agendamentoData.total,
        user_id: agendamentoData.user_id || null
      }])
      .select('id, protocol_id')
      .single();

    if (agendamentoError || !agendamento) {
      throw new Error(`Erro ao criar agendamento principal: ${agendamentoError?.message}`);
    }

    const agendamentoId = agendamento.id;

    // 2. Insere os Itens (Serviços)
    if (agendamentoData.itens && agendamentoData.itens.length > 0) {
      const itensToInsert = agendamentoData.itens.map(item => ({
        agendamento_id: agendamentoId,
        servico_id: item.id,
        quantidade: item.quantity || 1,
        preco_unitario: item.price
      }));

      const { error: itensError } = await supabase
        .from('agendamento_itens')
        .insert(itensToInsert);
      
      if (itensError) throw new Error(`Erro ao vincular itens: ${itensError.message}`);
    }

    // 3. Insere os Pets
    if (agendamentoData.pets_ids && agendamentoData.pets_ids.length > 0) {
      const petsToInsert = agendamentoData.pets_ids.map(petId => ({
        agendamento_id: agendamentoId,
        pet_id: petId
      }));

      const { error: petsError } = await supabase
        .from('agendamento_pets')
        .insert(petsToInsert);

      if (petsError) throw new Error(`Erro ao vincular pets: ${petsError.message}`);
    }
    
    return agendamento;
  },

  async getAgendamentosByUserId(userId: number) {
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        *,
        agendamento_itens (
          quantidade,
          preco_unitario,
          servicos (*)
        ),
        agendamento_pets (
          pets (*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }
    return data;
  },

  async deleteAgendamento(id: number, userId: number) {
    // 1. Verifica se o agendamento pertence ao usuário
    const { data: agendamento, error: findError } = await supabase
      .from('agendamentos')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (findError || !agendamento) {
      throw new Error('Agendamento não encontrado ou não pertence ao usuário.');
    }

    // 2. Deleta os vínculos (itens e pets)
    await supabase.from('agendamento_itens').delete().eq('agendamento_id', id);
    await supabase.from('agendamento_pets').delete().eq('agendamento_id', id);

    // 3. Deleta o agendamento principal
    const { error: deleteError } = await supabase
      .from('agendamentos')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw new Error(`Erro ao deletar agendamento: ${deleteError.message}`);
    }

    return true;
  },

  async updateAgendamento(id: number, userId: number, agendamentoData: { itens?: any[], pets_ids?: number[], total?: number }) {
    // 1. Verifica se o agendamento pertence ao usuário
    const { data: agendamento, error: findError } = await supabase
      .from('agendamentos')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (findError || !agendamento) {
      throw new Error('Agendamento não encontrado ou não pertence ao usuário.');
    }

    // 2. Atualiza o total se fornecido
    if (agendamentoData.total !== undefined) {
      const { error: updateError } = await supabase
        .from('agendamentos')
        .update({ total: agendamentoData.total })
        .eq('id', id);

      if (updateError) throw new Error(`Erro ao atualizar agendamento: ${updateError.message}`);
    }

    // 3. Atualiza os Itens (Serviços)
    if (agendamentoData.itens) {
      await supabase.from('agendamento_itens').delete().eq('agendamento_id', id);

      if (agendamentoData.itens.length > 0) {
        const itensToInsert = agendamentoData.itens.map(item => ({
          agendamento_id: id,
          servico_id: item.id,
          quantidade: item.quantity || 1,
          preco_unitario: item.price
        }));
  
        const { error: itensError } = await supabase
          .from('agendamento_itens')
          .insert(itensToInsert);
        
        if (itensError) throw new Error(`Erro ao atualizar itens: ${itensError.message}`);
      }
    }

    // 4. Atualiza os Pets
    if (agendamentoData.pets_ids) {
      await supabase.from('agendamento_pets').delete().eq('agendamento_id', id);

      if (agendamentoData.pets_ids.length > 0) {
        const petsToInsert = agendamentoData.pets_ids.map(petId => ({
          agendamento_id: id,
          pet_id: petId
        }));
  
        const { error: petsError } = await supabase
          .from('agendamento_pets')
          .insert(petsToInsert);
  
        if (petsError) throw new Error(`Erro ao atualizar pets: ${petsError.message}`);
      }
    }
    
    return true;
  }
};
