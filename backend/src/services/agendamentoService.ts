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
  }
};
