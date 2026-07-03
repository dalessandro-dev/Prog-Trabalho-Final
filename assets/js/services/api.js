
 // Camada de Serviço da API — PetCare
 // Faz chamadas reais ao backend Node.js + Express + Supabase
 // Backend rodando em: http://localhost:3001


const BASE_URL = 'http://localhost:3001';

// HELPERS INTERNOS
function getAuthHeaders() {
  const token = localStorage.getItem('@PetCare:token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}


// MÓDULO EXPORTADO (ApiService)
const ApiService = {

  /**
   * GET /categorias
   * Retorna todas as categorias de serviços cadastradas no banco.
   */
  getCategorias: async () => {
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
   * Filtra localmente uma categoria pelo ID.
   */
  getCategoria: async (id) => {
    const categorias = await ApiService.getCategorias();
    const cat = categorias.find(c => c.id === id);
    if (!cat) throw new Error('Categoria não encontrada.');
    return cat;
  },

  /**
   * GET /servicos
   * Retorna todos os serviços (sem filtro de categoria).
   */
  getServicos: async () => {
    const res = await fetch(`${BASE_URL}/servicos`);
    if (!res.ok) throw new Error('Falha ao buscar serviços.');
    const json = await res.json();
    return json.data.map(mapService);
  },

  /**
   * GET /servicos?categoria=:id
   * Retorna serviços filtrados por categoria.
   */
  getServicosCategoria: async (categoryId) => {
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
  getServico: async (id) => {
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
   * Cadastra um novo usuário mapeando as chaves em português para o inglês do backend.
   */
  cadastrarUsuario: async (userData) => {
    const backendPayload = {
      name: userData.nome,
      cpf: userData.cpf,
      email: userData.email,
      phone: userData.telefone,
      city: userData.cidade,
      address: userData.endereco,
      password: userData.senha
    };

    const res = await fetch(`${BASE_URL}/cadastro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendPayload)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Erro ao realizar cadastro.');
    }
    return json;
  },

  /**
   * GET /home
   * Retorna dados agregados para a página inicial.
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
   * POST /pets
   * Cadastra um novo pet associado a um usuário.
   */
  cadastrarPet: async (petData) => {
    const res = await fetch(`${BASE_URL}/pets`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(petData)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Erro ao cadastrar pet.');
    }
    return json;
  },

  /**
   * GET /pets
   * Retorna os pets do usuário logado
   */
  getPets: async () => {
    const res = await fetch(`${BASE_URL}/pets`, {
      headers: { ...getAuthHeaders() }
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Erro ao buscar pets.');
    }
    return json.data;
  },

  /**
   * POST /agendamentos
   * Cria um agendamento real na API e salva localmente (histórico)
   */
  criarAgendamento: async (cartData, petsIds = []) => {
    if (!cartData || cartData.length === 0) {
      throw new Error('Carrinho vazio.');
    }
    
    let user_id = null;
    try {
      const savedUser = localStorage.getItem('@PetCare:user');
      if (savedUser) user_id = JSON.parse(savedUser).id;
    } catch(e) {}

    const res = await fetch(`${BASE_URL}/agendamentos`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ itens: cartData, pets_ids: petsIds, user_id })
    });
    
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Erro ao processar agendamento.');
    }

    try {
      const saved = localStorage.getItem('@PetCare:agendamentos');
      const agendamentos = saved ? JSON.parse(saved) : [];
      agendamentos.push({
        protocolId: json.data.protocolId,
        data: new Date().toISOString(),
        itens: cartData,
        total: cartData.reduce((acc, item) => acc + item.price * item.quantity, 0)
      });
      localStorage.setItem('@PetCare:agendamentos', JSON.stringify(agendamentos));
    } catch (e) {
      console.error("Falha ao persistir agendamento localmente", e);
    }

    return { success: true, protocolId: json.data.protocolId };
  },

  /**
   * Lista todos os agendamentos realizados do localStorage
   */
  listarAgendamentos: async () => {
    try {
      const saved = localStorage.getItem('@PetCare:agendamentos');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Limpa a sessão local e desloga o usuário.
   */
  logout: async () => {
    localStorage.removeItem('@PetCare:user');
    localStorage.removeItem('@PetCare:token');
    window.location.reload();
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

// UTILITÁRIOS GLOBAIS (Helpers)
const Utils = {
  formatCurrency: (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
};
