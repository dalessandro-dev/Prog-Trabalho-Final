import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../database/supabase';

const router = Router();

/**
 * POST /cadastro
 * Critério 6a e 8: Cadastra novo usuário com senha hasheada e salva no banco.
 */
router.post('/cadastro', async (req: Request, res: Response) => {
  try {
    const {
      name, cpf, email, phone, city, address,
      password, petName, petSpecies, petBreed, petAge, petNotes
    } = req.body;

    // Validações básicas no backend (defesa em profundidade)
    if (!name || !cpf || !email || !password) {
      res.status(400).json({ success: false, message: 'Campos obrigatórios: name, cpf, email, password.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'A senha deve ter no mínimo 6 caracteres.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, message: 'Formato de e-mail inválido.' });
      return;
    }

    // Hash seguro da senha (nunca armazenar em texto puro)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insere o usuário no Supabase
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{
        name,
        cpf: cpf.replace(/\D/g, ''), // Salva só números
        email,
        phone: phone ? phone.replace(/\D/g, '') : null,
        city,
        address,
        password_hash: passwordHash,
        pet_name: petName,
        pet_species: petSpecies,
        pet_breed: petBreed || null,
        pet_age: petAge,
        pet_notes: petNotes || null
      }])
      .select('id, name, email, cpf, pet_name, created_at') // Retorna apenas campos seguros
      .single();

    if (error) {
      // Trata erro de duplicidade (email ou CPF já existem)
      if (error.code === '23505') {
        const field = error.message.includes('email') ? 'E-mail' : 'CPF';
        res.status(409).json({ success: false, message: `${field} já cadastrado.` });
        return;
      }
      throw error;
    }

    console.log(`✅ Novo usuário cadastrado: ID=${data.id}, Nome=${data.name}, Email=${data.email}`);

    res.status(201).json({
      success: true,
      message: 'Cadastro realizado com sucesso!',
      data // Retorna os dados salvos (sem senha)
    });

  } catch (err: any) {
    console.error('[POST /cadastro]', err.message);
    res.status(500).json({ success: false, message: 'Erro interno no servidor.' });
  }
});

/**
 * POST /login
 * Critério 6b e 7: Autentica o usuário com email + senha.
 * Em caso de sucesso, redireciona para o carrinho (agendamento).
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'E-mail e senha são obrigatórios.' });
      return;
    }

    // Busca usuário pelo email
    const { data: user, error } = await supabase
      .from('usuarios')
      .select('id, name, email, password_hash')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !user) {
      res.status(401).json({ success: false, message: 'E-mail ou senha incorretos.' });
      return;
    }

    // Compara a senha fornecida com o hash armazenado
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      res.status(401).json({ success: false, message: 'E-mail ou senha incorretos.' });
      return;
    }

    // Gera um token simples para identificar a sessão no frontend
    // (Em produção, usar JWT com expiração)
    const token = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString('base64');

    console.log(`🔐 Login bem-sucedido: ID=${user.id}, Email=${user.email}`);

    res.json({
      success: true,
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      redirect: '/pages/agendamento.html' // Indica ao frontend para onde redirecionar
    });

  } catch (err: any) {
    console.error('[POST /login]', err.message);
    res.status(500).json({ success: false, message: 'Erro interno no servidor.' });
  }
});

export default router;
