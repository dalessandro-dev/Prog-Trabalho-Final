/**
 * Camada de Serviço da API — PetCare
 * Faz chamadas reais ao backend Node.js + Express + Supabase
 * Backend rodando em: http://localhost:3001
 */

const BASE_URL = 'http://localhost:3001';

// ==========================================
// MÓDULO EXPORTADO (ApiService)
// ==========================================
const ApiService = {

  /**
   * GET /categorias
   * Retorna todas as categorias de serviços cadastradas no banco.
   */
  getCategories: async () => {
    const res = await fetch(`${BASE_URL}/categorias`);
    if (!res.ok) throw new Error('Falha ao buscar categorias.');
    const json = await res.json();
    // Mapeia campos do banco (snake_case) para o formato esperado pelo frontend
    return json.data.map((cat) => ({
      id: cat.id,
      title: cat.title,
      icon: cat.icon,
      color: cat.color,
      textColor: cat.text_color,
      description: cat.description
    }));
  },

  /**
   * GET /servicos
   * Retorna todos os serviços (sem filtro de categoria).
   */
  getServices: async () => {
    const res = await fetch(`${BASE_URL}/servicos`);
    if (!res.ok) throw new Error('Falha ao buscar serviços.');
    const json = await res.json();
    return json.data.map(mapService);
  },

  /**
   * GET /servicos?categoria=:id
   * Retorna serviços filtrados por categoria.
   */
  getServicesByCategory: async (categoryId) => {
    const url = categoryId && categoryId !== 'todos'
      ? `${BASE_URL}/servicos?categoria=${categoryId}`
      : `${BASE_URL}/servicos`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Falha ao buscar serviços por categoria.');
    const json = await res.json();
    return json.data.map(mapService);
  },

  /**
   * GET /servicos/:id
   * Retorna os detalhes completos de um serviço pelo ID.
   */
  getServiceById: async (id) => {
    const res = await fetch(`${BASE_URL}/servicos/${id}`);
    if (!res.ok) throw new Error('Serviço não encontrado.');
    const json = await res.json();
    return mapServiceDetail(json.data);
  },

  /**
   * POST /login
   * Autentica o usuário com email e senha.
   * Em caso de sucesso, retorna token e dados do usuário.
   */
  login: async (credentials) => {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'E-mail ou senha incorretos.');
    }
    return json;
  },

  /**
   * POST /cadastro
   * Cadastra um novo usuário e salva no banco de dados.
   */
  register: async (userData) => {
    const res = await fetch(`${BASE_URL}/cadastro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Erro ao realizar cadastro.');
    }
    return json;
  },

  /**
   * GET /home
   * Retorna dados agregados para a página inicial:
   * categorias, serviços populares, depoimentos e promoção.
   */
  getHomeData: async () => {
    const res = await fetch(`${BASE_URL}/home`);
    if (!res.ok) throw new Error('Falha ao carregar dados da home.');
    const json = await res.json();
    const d = json.data;
    return {
      categories: d.categories.map((cat) => ({
        id: cat.id,
        title: cat.title,
        icon: cat.icon,
        color: cat.color,
        textColor: cat.text_color,
        description: cat.description
      })),
      popularServices: d.popularServices.map(mapService),
      testimonials: d.testimonials,
      promotion: d.promotion
    };
  },

  /**
   * (Checkout é tratado apenas no frontend via localStorage)
   */
  checkout: async (cartData) => {
    if (!cartData || cartData.length === 0) {
      throw new Error('Carrinho vazio.');
    }
    // Simulação de checkout bem-sucedido
    return { success: true, protocolId: `PET-${Math.floor(Math.random() * 99999)}` };
  }
};

// ==========================================
// HELPERS DE MAPEAMENTO (banco → frontend)
// ==========================================

/**
 * Mapeia um objeto de serviço do banco (snake_case) para o formato do frontend (camelCase)
 */
function mapService(s) {
  return {
    id: s.id,
    categoryId: s.category_id,
    categoryName: s.category_name,
    isPopular: s.is_popular,
    rating: s.rating,
    reviews: s.reviews,
    title: s.title,
    price: s.price,
    image: s.image,
    description: s.description
  };
}

/**
 * Mapeia um serviço completo (com campos extras de detalhe) do banco para o frontend
 */
function mapServiceDetail(s) {
  return {
    ...mapService(s),
    duration: s.duration,
    professional: s.professional,
    cares: s.cares || [],
    benefits: s.benefits || []
  };
}

// ==========================================
// UTILITÁRIOS GLOBAIS (Helpers)
// ==========================================
const Utils = {
  formatCurrency: (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
};
