import { Request, Response } from 'express';
import { agendamentoService } from '../services/agendamentoService';
import { servicoService } from '../services/servicoService';

export const agendamentoController = {
  async create(req: Request, res: Response) {
    try {
      const { itens, pets_ids } = req.body;
      const user_id = req.userId; // Pegando do token JWT

      if (!itens || !Array.isArray(itens) || itens.length === 0) {
        res.status(400).json({ success: false, message: 'Carrinho vazio ou formato inválido.' });
        return;
      }

      // Normaliza os itens (se o usuário mandar um array de números, transforma em array de objetos)
      const normalizedItens = itens.map(item => {
        if (typeof item === 'number') {
          return { id: item, quantity: 1 };
        }
        return { id: item.id, quantity: item.quantity || 1 };
      });

      let total = 0;
      const itensComPreco = [];

      // Busca o preço real de cada serviço no banco de dados para total segurança
      for (const item of normalizedItens) {
        const servicoDb = await servicoService.getServicoById(item.id);
        if (!servicoDb) {
          res.status(400).json({ success: false, message: `Serviço de ID ${item.id} não encontrado.` });
          return;
        }
        total += servicoDb.price * item.quantity;
        itensComPreco.push({
          id: servicoDb.id,
          price: servicoDb.price,
          quantity: item.quantity
        });
      }

      const data = await agendamentoService.registerAgendamento({ itens: itensComPreco, pets_ids, total, user_id });

      res.status(201).json({
        success: true,
        message: 'Agendamento criado com sucesso!',
        data: {
          protocolId: data.protocol_id
        }
      });
    } catch (err: any) {
      console.error('[POST /agendamentos]', err.message);
      res.status(500).json({ success: false, message: 'Erro ao criar agendamento.' });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const user_id = req.userId;
      if (!user_id) {
        res.status(401).json({ success: false, message: 'Não autorizado.' });
        return;
      }

      const data = await agendamentoService.getAgendamentosByUserId(user_id);
      res.json({ success: true, data });
    } catch (err: any) {
      console.error('[GET /agendamentos]', err.message);
      res.status(500).json({ success: false, message: 'Erro ao buscar agendamentos.' });
    }
  }
};
