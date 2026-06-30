const BASE_URL = 'https://sua-api.com/v1'; // Futura URL da sua API em Produção

// ==========================================
// BANCO DE DADOS MOCKADO (Estado Atual)
// ==========================================
const MOCK_DB = {
  categories: [
    { id: "todos", title: "Todos", icon: "ph-list", color: "var(--color-gray-100)", textColor: "var(--color-gray-800)" },
    { id: "clinica", title: "Clínica Veterinária", icon: "ph-stethoscope", color: "var(--color-primary-100)", textColor: "var(--color-primary-700)" },
    { id: "estetica", title: "Banho & Tosa", icon: "ph-scissors", color: "var(--color-secondary-50)", textColor: "var(--color-secondary-600)" },
    { id: "hospedagem", title: "Hospedagem", icon: "ph-house-line", color: "#FEF3C7", textColor: "var(--color-accent-600)" },
    { id: "petshop", title: "Pet Shop", icon: "ph-shopping-bag", color: "var(--color-gray-100)", textColor: "var(--color-gray-800)" }
  ],
  services: [
    { id: 1, categoryId: "clinica", categoryName: "Clínica", isPopular: true, rating: 4.9, reviews: 124, title: "Consulta Clínica", price: 150.00, image: "https://images.unsplash.com/photo-1628009368231-7bb7cb131649?auto=format&fit=crop&q=80&w=800", description: "Avaliação geral detalhada para garantir a saúde preventiva do seu pet com nossos especialistas." },
    { id: 2, categoryId: "clinica", categoryName: "Clínica", isPopular: false, rating: 4.8, reviews: 45, title: "Vacinação V10", price: 120.00, image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=800", description: "Proteção completa contra as 10 principais doenças virais caninas." },
    { id: 3, categoryId: "clinica", categoryName: "Clínica", isPopular: false, rating: 5.0, reviews: 32, title: "Limpeza de Tártaro", price: 350.00, image: "https://images.unsplash.com/photo-1537151608804-ea2f1fa53664?auto=format&fit=crop&q=80&w=800", description: "Procedimento cirúrgico odontológico sob anestesia inalatória com total segurança." },
    { id: 4, categoryId: "clinica", categoryName: "Clínica", isPopular: false, rating: 4.7, reviews: 88, title: "Exame de Sangue", price: 95.00, image: "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?auto=format&fit=crop&q=80&w=800", description: "Hemograma completo processado em nosso laboratório próprio com resultado em 30 min." },
    { id: 5, categoryId: "clinica", categoryName: "Clínica", isPopular: false, rating: 4.9, reviews: 15, title: "Ultrassonografia", price: 210.00, image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800", description: "Exame de imagem não invasivo com especialista em diagnóstico por imagem veterinária." },
    { id: 6, categoryId: "estetica", categoryName: "Estética", isPopular: true, rating: 4.8, reviews: 312, title: "Banho Terapêutico", price: 80.00, image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800", description: "Banho com shampoos especiais para tratar dermatites e alergias de pele." },
    { id: 7, categoryId: "estetica", categoryName: "Estética", isPopular: false, rating: 4.9, reviews: 142, title: "Tosa na Tesoura", price: 140.00, image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800", description: "Acabamento perfeito e manual, ideal para raças como Spitz Alemão e Poodle." },
    { id: 8, categoryId: "estetica", categoryName: "Estética", isPopular: false, rating: 4.7, reviews: 67, title: "Tosa Higiênica", price: 50.00, image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800", description: "Limpeza de áreas sensíveis essencial para a saúde e bem-estar." },
    { id: 9, categoryId: "estetica", categoryName: "Estética", isPopular: false, rating: 4.8, reviews: 90, title: "Hidratação de Pelos", price: 65.00, image: "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?auto=format&fit=crop&q=80&w=800", description: "Máscara de reconstrução profunda para pelos danificados." },
    { id: 10, categoryId: "estetica", categoryName: "Estética", isPopular: false, rating: 4.6, reviews: 110, title: "Corte de Unhas", price: 30.00, image: "https://images.unsplash.com/photo-1629898083896-1eb61955fb82?auto=format&fit=crop&q=80&w=800", description: "Manutenção e corte das unhas para evitar encravamentos e problemas posturais." },
    { id: 11, categoryId: "hospedagem", categoryName: "Hospedagem", isPopular: true, rating: 5.0, reviews: 430, title: "Diária de Hotel", price: 110.00, image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&q=80&w=800", description: "Um dia inteiro de diversão, 3 refeições inclusas e monitoramento veterinário." },
    { id: 12, categoryId: "hospedagem", categoryName: "Hospedagem", isPopular: false, rating: 4.9, reviews: 85, title: "Creche (Day Care)", price: 65.00, image: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=800", description: "Deixe seu pet socializando e gastando energia enquanto você trabalha." },
    { id: 13, categoryId: "hospedagem", categoryName: "Hospedagem", isPopular: false, rating: 4.8, reviews: 15, title: "Quarto VIP Privativo", price: 180.00, image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=800", description: "Suíte climatizada com câmera ao vivo para o tutor acompanhar pelo celular." },
    { id: 14, categoryId: "hospedagem", categoryName: "Hospedagem", isPopular: false, rating: 4.7, reviews: 30, title: "Treinamento Comportamental", price: 130.00, image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=800", description: "Sessão de adestramento básico durante a hospedagem." },
    { id: 15, categoryId: "hospedagem", categoryName: "Hospedagem", isPopular: false, rating: 5.0, reviews: 12, title: "Pacote Final de Semana", price: 200.00, image: "https://images.unsplash.com/photo-1520110120835-c96534a4c984?auto=format&fit=crop&q=80&w=800", description: "Hospedagem de Sexta a Domingo com banho de cortesia." },
    { id: 16, categoryId: "petshop", categoryName: "Pet Shop", isPopular: false, rating: 4.9, reviews: 250, title: "Ração Super Premium 15kg", price: 289.90, image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=800", description: "Alimentação balanceada e sem corantes." },
    { id: 17, categoryId: "petshop", categoryName: "Pet Shop", isPopular: false, rating: 4.8, reviews: 170, title: "Antipulgas Bravecto", price: 215.00, image: "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?auto=format&fit=crop&q=80&w=800", description: "Proteção de até 12 semanas contra pulgas e carrapatos." },
    { id: 18, categoryId: "petshop", categoryName: "Pet Shop", isPopular: false, rating: 4.7, reviews: 90, title: "Cama Ortopédica G", price: 199.90, image: "https://images.unsplash.com/photo-1629898084050-68d712ce19d8?auto=format&fit=crop&q=80&w=800", description: "Espuma de alta densidade, ideal para pets idosos." },
    { id: 19, categoryId: "petshop", categoryName: "Pet Shop", isPopular: false, rating: 4.9, reviews: 300, title: "Sachês Premium (Caixa)", price: 45.00, image: "https://images.unsplash.com/photo-1625910513393-9dd64c8d8b68?auto=format&fit=crop&q=80&w=800", description: "Pack com 12 sachês de frango e salmão." },
    { id: 20, categoryId: "petshop", categoryName: "Pet Shop", isPopular: false, rating: 4.8, reviews: 120, title: "Coleira Peitoral Conforto", price: 85.00, image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=800", description: "Evita puxões no pescoço. Tecido respirável." }
  ],
  testimonials: [
    { id: 1, author: "Mariana Souza", pet: "Tutora do Max", avatar: "https://randomuser.me/api/portraits/women/44.jpg", text: "Atendimento clínico impecável!", stars: 5 },
    { id: 2, author: "Carlos Ferreira", pet: "Tutor da Luna", avatar: "https://randomuser.me/api/portraits/men/32.jpg", text: "Hotel maravilhoso, Luna sempre volta feliz.", stars: 5 },
    { id: 3, author: "Beatriz Lima", pet: "Tutora do Simba", avatar: "https://randomuser.me/api/portraits/women/68.jpg", text: "O banho e tosa é maravilhoso! Muita paciência com o pet.", stars: 4 }
  ],
  promotions: [
    { id: "promo_1", title: "Mês da Prevenção", subtitle: "Ganhe 20% de desconto em qualquer pacote de Vacinação V10 + Antirrábica.", code: "SAUDE20", image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=800" }
  ]
};

// ==========================================
// MÓDULO EXPORTADO (ApiService)
// ==========================================
const ApiService = {

  /**
   * FUTURA CHAMADA: GET /categorias
   * fetch(`${BASE_URL}/categorias`).then(res => res.json())
   */
  getCategories: async () => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_DB.categories), 400));
  },

  /**
   * FUTURA CHAMADA: GET /servicos
   * fetch(`${BASE_URL}/servicos`).then(res => res.json())
   */
  getServices: async () => {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_DB.services), 600));
  },

  /**
   * FUTURA CHAMADA: GET /servicos/:id
   * fetch(`${BASE_URL}/servicos/${id}`).then(res => res.json())
   */
  getServiceById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const service = MOCK_DB.services.find(s => s.id === parseInt(id));
        if (service) {
          resolve({
            ...service,
            duration: service.categoryId === 'hospedagem' ? '1 Diária' : '45 a 90 minutos',
            professional: service.categoryId === 'clinica' ? 'Dr. Roberto Alves (CRMV 12345)' : 'Equipe Especializada PetCare',
            cares: ["Chegar com antecedência.", "Trazer carteirinha de vacinação.", "Informar problemas de saúde."],
            benefits: ["Qualidade de vida", "Atendimento focado e carinhoso", "Ambiente higienizado"]
          });
        } else {
          reject(new Error("Serviço não encontrado."));
        }
      }, 700);
    });
  },

  /**
   * FUTURA CHAMADA: POST /login
   * fetch(`${BASE_URL}/login`, { method: 'POST', body: JSON.stringify(credentials) })
   */
  login: async (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.password.length >= 6) {
          resolve({ token: "fake-jwt-token-123", user: { email: credentials.email } });
        } else {
          reject(new Error("E-mail ou senha incorretos."));
        }
      }, 800);
    });
  },

  /**
   * FUTURA CHAMADA: POST /cadastro
   * fetch(`${BASE_URL}/cadastro`, { method: 'POST', body: JSON.stringify(userData) })
   */
  register: async (userData) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, message: "Cadastro realizado com sucesso." });
      }, 1500);
    });
  },

  /**
   * FUTURA CHAMADA: POST /agendamento
   * fetch(`${BASE_URL}/agendamento`, { method: 'POST', body: JSON.stringify(cartData) })
   */
  checkout: async (cartData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (cartData && cartData.length > 0) {
          resolve({ success: true, protocolId: "PET-98765" });
        } else {
          reject(new Error("Carrinho vazio."));
        }
      }, 1500);
    });
  },

  /**
   * DADOS AGREGADOS PARA A HOME
   * Na API real, faríamos um Promise.all() chamando /categorias, /servicos?popular=true e /depoimentos.
   */
  getHomeData: async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          categories: MOCK_DB.categories.filter(c => c.id !== "todos"),
          popularServices: MOCK_DB.services.filter(s => s.isPopular),
          testimonials: MOCK_DB.testimonials,
          promotion: MOCK_DB.promotions[0]
        });
      }, 500);
    });
  }
};

// ==========================================
// UTILITÁRIOS GLOBAIS (Helpers)
// ==========================================
const Utils = {
  formatCurrency: (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
};
