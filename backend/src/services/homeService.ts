import { supabase } from '../database/supabase';

export const homeService = {
  async getHomeData() {
    // Busca categorias e serviços populares em paralelo
    const [categoriasResult, popularResult] = await Promise.all([
      supabase
        .from('categorias')
        .select('*')
        .order('title', { ascending: true }),

      supabase
        .from('servicos')
        .select('*')
        .eq('is_popular', true)
        .order('reviews', { ascending: false })
        .limit(5)
    ]);

    if (categoriasResult.error) throw categoriasResult.error;
    if (popularResult.error) throw popularResult.error;

    // Depoimentos são dados estáticos
    const testimonials = [
      {
        id: 1,
        author: 'Mariana Souza',
        pet: 'Tutora do Max',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        text: 'Atendimento clínico impecável! O Dr. Roberto é muito cuidadoso e explica tudo detalhadamente.',
        stars: 5
      },
      {
        id: 2,
        author: 'Carlos Ferreira',
        pet: 'Tutor da Luna',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        text: 'Hotel maravilhoso, Luna sempre volta super feliz e descansada. Recomendo muito!',
        stars: 5
      },
      {
        id: 3,
        author: 'Beatriz Lima',
        pet: 'Tutora do Simba',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        text: 'O banho e tosa é maravilhoso! Muita paciência e carinho com o pet.',
        stars: 4
      }
    ];

    // Promoção ativa (estática)
    const promotion = {
      id: 'promo_1',
      title: 'Mês da Prevenção',
      subtitle: 'Ganhe 20% de desconto em qualquer pacote de Vacinação V10 + Antirrábica.',
      code: 'SAUDE20',
      image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=800'
    };

    return {
      categories: categoriasResult.data,
      popularServices: popularResult.data,
      testimonials,
      promotion
    };
  }
};
