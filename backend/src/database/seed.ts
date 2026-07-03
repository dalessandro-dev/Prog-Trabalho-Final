/**
 * Seed Script — Popula o banco de dados Supabase com os dados iniciais.
 * Execute com: npm run seed
 */

import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { supabase } from './supabase';

// ========================================
// DADOS DE CATEGORIAS
// ========================================
const categorias = [
  {
    id: 'clinica',
    title: 'Clínica Veterinária',
    icon: 'ph-stethoscope',
    color: 'var(--color-primary-100)',
    text_color: 'var(--color-primary-700)',
    description: 'Consultas, exames e cuidados médicos especializados'
  },
  {
    id: 'estetica',
    title: 'Banho & Tosa',
    icon: 'ph-scissors',
    color: 'var(--color-secondary-50)',
    text_color: 'var(--color-secondary-600)',
    description: 'Banhos terapêuticos, tosas e cuidados estéticos'
  },
  {
    id: 'hospedagem',
    title: 'Hospedagem',
    icon: 'ph-house-line',
    color: '#FEF3C7',
    text_color: 'var(--color-accent-600)',
    description: 'Hotel, creche e estadia com conforto e segurança'
  },
  {
    id: 'petshop',
    title: 'Pet Shop',
    icon: 'ph-shopping-bag',
    color: 'var(--color-gray-100)',
    text_color: 'var(--color-gray-800)',
    description: 'Rações, acessórios e produtos de qualidade'
  },
  {
    id: 'adestramento',
    title: 'Adestramento',
    icon: 'ph-medal',
    color: '#F0FDF4',
    text_color: '#166534',
    description: 'Treinamento comportamental e socialização'
  }
];

// ========================================
// DADOS DE SERVIÇOS
// ========================================
const servicos = [
  // CLÍNICA
  {
    category_id: 'clinica', category_name: 'Clínica', is_popular: true, rating: 4.9, reviews: 124,
    title: 'Consulta Clínica', price: 150.00,
    image: 'https://images.unsplash.com/photo-1628009368231-7bb7cb131649?auto=format&fit=crop&q=80&w=800',
    description: 'Avaliação geral detalhada para garantir a saúde preventiva do seu pet com nossos especialistas.',
    duration: '45 a 60 minutos',
    professional: 'Dr. Roberto Alves (CRMV 12345)',
    cares: ['Chegar com 10 min de antecedência', 'Trazer carteirinha de vacinação', 'Informar histórico de saúde do pet'],
    benefits: ['Diagnóstico precoce de doenças', 'Orientação nutricional personalizada', 'Paz de espírito para o tutor']
  },
  {
    category_id: 'clinica', category_name: 'Clínica', is_popular: false, rating: 4.8, reviews: 45,
    title: 'Vacinação V10', price: 120.00,
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=800',
    description: 'Proteção completa contra as 10 principais doenças virais caninas.',
    duration: '20 a 30 minutos',
    professional: 'Dra. Camila Ramos (CRMV 54321)',
    cares: ['Pet deve estar em jejum de 2h', 'Evitar banho 3 dias após', 'Observar reações nas 24h seguintes'],
    benefits: ['Imunidade contra 10 doenças graves', 'Obrigatório para canis e hotéis', 'Segurança garantida']
  },
  {
    category_id: 'clinica', category_name: 'Clínica', is_popular: false, rating: 5.0, reviews: 32,
    title: 'Limpeza de Tártaro', price: 350.00,
    image: 'https://images.unsplash.com/photo-1537151608804-ea2f1fa53664?auto=format&fit=crop&q=80&w=800',
    description: 'Procedimento odontológico sob anestesia inalatória com total segurança e eficácia.',
    duration: '60 a 90 minutos',
    professional: 'Dr. Marcos Souza (CRMV 78910)',
    cares: ['Jejum de 8h obrigatório', 'Exame pré-anestésico necessário', 'Repouso de 24h após o procedimento'],
    benefits: ['Elimina mau hálito', 'Previne doenças cardíacas', 'Aumenta qualidade de vida']
  },
  {
    category_id: 'clinica', category_name: 'Clínica', is_popular: false, rating: 4.7, reviews: 88,
    title: 'Exame de Sangue', price: 95.00,
    image: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?auto=format&fit=crop&q=80&w=800',
    description: 'Hemograma completo processado em nosso laboratório próprio com resultado em 30 minutos.',
    duration: '30 a 45 minutos',
    professional: 'Equipe do Laboratório PetCare',
    cares: ['Jejum de 4h recomendado', 'Levar pet calmo e hidratado', 'Resultado disponível digitalmente'],
    benefits: ['Diagnóstico preciso e rápido', 'Detecta doenças silenciosas', 'Laboratório próprio certificado']
  },
  {
    category_id: 'clinica', category_name: 'Clínica', is_popular: false, rating: 4.9, reviews: 15,
    title: 'Ultrassonografia', price: 210.00,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
    description: 'Exame de imagem não invasivo com especialista em diagnóstico por imagem veterinária.',
    duration: '30 a 60 minutos',
    professional: 'Dr. Felipe Costa (CRMV 11223)',
    cares: ['Jejum de 6h obrigatório', 'Trazer exames anteriores', 'Bexiga cheia pode ser necessária'],
    benefits: ['Avaliação de órgãos internos', 'Sem radiação, totalmente seguro', 'Diagnóstico em tempo real']
  },
  // ESTÉTICA
  {
    category_id: 'estetica', category_name: 'Estética', is_popular: true, rating: 4.8, reviews: 312,
    title: 'Banho Terapêutico', price: 80.00,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800',
    description: 'Banho com shampoos especiais para tratar dermatites, alergias e ressecamento de pele.',
    duration: '60 a 90 minutos',
    professional: 'Equipe Especializada PetCare',
    cares: ['Informar alergias do pet', 'Não alimentar 1h antes', 'Notificar medicamentos em uso'],
    benefits: ['Alívio de coceiras e alergias', 'Pele e pelo mais saudáveis', 'Produtos hipoalergênicos']
  },
  {
    category_id: 'estetica', category_name: 'Estética', is_popular: false, rating: 4.9, reviews: 142,
    title: 'Tosa na Tesoura', price: 140.00,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800',
    description: 'Acabamento perfeito e manual, ideal para raças como Spitz Alemão, Poodle e Bichon.',
    duration: '90 a 120 minutos',
    professional: 'Groomer Certificado PetCare',
    cares: ['Pelo deve estar limpo e seco', 'Informar o estilo desejado', 'Agendar com 3 dias de antecedência'],
    benefits: ['Acabamento artesanal de alta qualidade', 'Sem estresse por máquinas', 'Ideal para pelos finos']
  },
  {
    category_id: 'estetica', category_name: 'Estética', is_popular: false, rating: 4.7, reviews: 67,
    title: 'Tosa Higiênica', price: 50.00,
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800',
    description: 'Limpeza de áreas sensíveis (patinhas, virilha e região anal) essencial para a saúde.',
    duration: '30 a 45 minutos',
    professional: 'Equipe Especializada PetCare',
    cares: ['Realizada em pets calmos', 'Recomendada a cada 30 dias', 'Pode ser combinada com banho'],
    benefits: ['Prevenção de infecções locais', 'Maior higiene e conforto', 'Custo-benefício excelente']
  },
  {
    category_id: 'estetica', category_name: 'Estética', is_popular: false, rating: 4.8, reviews: 90,
    title: 'Hidratação de Pelos', price: 65.00,
    image: 'https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?auto=format&fit=crop&q=80&w=800',
    description: 'Máscara de reconstrução profunda para pelos opacos, quebradiços ou ressecados.',
    duration: '60 minutos',
    professional: 'Groomer Certificado PetCare',
    cares: ['Combinar com banho para melhor resultado', 'Repetir mensalmente', 'Evitar sol direto após'],
    benefits: ['Brilho e sedosidade imediatos', 'Reduz queda excessiva de pelos', 'Produtos veganos e naturais']
  },
  {
    category_id: 'estetica', category_name: 'Estética', is_popular: false, rating: 4.6, reviews: 110,
    title: 'Corte de Unhas', price: 30.00,
    image: 'https://images.unsplash.com/photo-1629898083896-1eb61955fb82?auto=format&fit=crop&q=80&w=800',
    description: 'Manutenção e corte das unhas para evitar encravamentos, dores e problemas posturais.',
    duration: '15 a 20 minutos',
    professional: 'Equipe Especializada PetCare',
    cares: ['Realizada com alicate profissional', 'Recomendada a cada 3-4 semanas', 'Pets nervosos podem precisar de contenção'],
    benefits: ['Evita encravamento e dor', 'Melhora postura e locomoção', 'Rápido e sem estresse']
  },
  // HOSPEDAGEM
  {
    category_id: 'hospedagem', category_name: 'Hospedagem', is_popular: true, rating: 5.0, reviews: 430,
    title: 'Diária de Hotel', price: 110.00,
    image: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&q=80&w=800',
    description: 'Um dia inteiro de diversão com 3 refeições inclusas e monitoramento veterinário 24h.',
    duration: '1 Diária (24h)',
    professional: 'Equipe de Hospedagem PetCare',
    cares: ['Vacinas V10 e Antirrábica em dia', 'Trazer ração habitual do pet', 'Informar medicamentos e alergias'],
    benefits: ['Monitoramento veterinário 24h', 'Câmera ao vivo para o tutor', 'Ambiente lúdico e seguro']
  },
  {
    category_id: 'hospedagem', category_name: 'Hospedagem', is_popular: false, rating: 4.9, reviews: 85,
    title: 'Creche (Day Care)', price: 65.00,
    image: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=800',
    description: 'Deixe seu pet socializando e gastando energia enquanto você trabalha. Das 7h às 19h.',
    duration: 'Período integral (7h às 19h)',
    professional: 'Equipe de Hospedagem PetCare',
    cares: ['Vacinas em dia obrigatório', 'Check-in até às 9h', 'Retirada até às 19h'],
    benefits: ['Socialização com outros pets', 'Atividades e brincadeiras', 'Pet chega em casa cansado e feliz']
  },
  {
    category_id: 'hospedagem', category_name: 'Hospedagem', is_popular: false, rating: 4.8, reviews: 15,
    title: 'Quarto VIP Privativo', price: 180.00,
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=800',
    description: 'Suíte climatizada exclusiva com câmera ao vivo para o tutor acompanhar pelo celular.',
    duration: '1 Diária (24h)',
    professional: 'Equipe VIP PetCare',
    cares: ['Reserva com antecedência mínima de 3 dias', 'Vacinas obrigatórias', 'Limite de 1 pet por suíte'],
    benefits: ['Total privacidade e conforto', 'Câmera ao vivo 24h', 'Cama ortopédica e brinquedos inclusos']
  },
  {
    category_id: 'hospedagem', category_name: 'Hospedagem', is_popular: false, rating: 4.7, reviews: 30,
    title: 'Treinamento Comportamental', price: 130.00,
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=800',
    description: 'Sessão de adestramento básico durante a hospedagem com acompanhamento profissional.',
    duration: '1h de sessão por diária',
    professional: 'Adestrador Certificado PetCare',
    cares: ['Informar comportamentos problemáticos', 'Não use punição física', 'Consistência em casa é essencial'],
    benefits: ['Melhora do comportamento geral', 'Comandos básicos e obediência', 'Relatório de progresso ao tutor']
  },
  {
    category_id: 'hospedagem', category_name: 'Hospedagem', is_popular: false, rating: 5.0, reviews: 12,
    title: 'Pacote Final de Semana', price: 200.00,
    image: 'https://images.unsplash.com/photo-1520110120835-c96534a4c984?auto=format&fit=crop&q=80&w=800',
    description: 'Hospedagem de Sexta a Domingo com banho de cortesia incluído. Aproveite o seu fim de semana!',
    duration: 'Sexta à Domingo (48-72h)',
    professional: 'Equipe de Hospedagem PetCare',
    cares: ['Reserva até quinta-feira', 'Trazer pertences do pet', 'Banho incluído na saída'],
    benefits: ['Melhor custo-benefício da semana', 'Banho de cortesia incluso', 'Relatório fotográfico enviado ao tutor']
  },
  // PET SHOP
  {
    category_id: 'petshop', category_name: 'Pet Shop', is_popular: false, rating: 4.9, reviews: 250,
    title: 'Ração Super Premium 15kg', price: 289.90,
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=800',
    description: 'Alimentação balanceada e sem corantes artificiais para cães adultos de todos os portes.',
    duration: 'Entrega em até 2 dias úteis',
    professional: 'Nutricionista Veterinária PetCare',
    cares: ['Transicionar gradualmente em 7 dias', 'Manter água fresca sempre disponível', 'Consultar veterinário sobre porção ideal'],
    benefits: ['Sem corantes artificiais', 'Rico em proteínas de origem animal', 'Aprovado por nutricionistas veterinários']
  },
  {
    category_id: 'petshop', category_name: 'Pet Shop', is_popular: false, rating: 4.8, reviews: 170,
    title: 'Antipulgas Bravecto', price: 215.00,
    image: 'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?auto=format&fit=crop&q=80&w=800',
    description: 'Proteção de até 12 semanas contra pulgas e carrapatos em uma única aplicação.',
    duration: 'Proteção de 12 semanas',
    professional: 'Farmácia Veterinária PetCare',
    cares: ['Receita veterinária necessária', 'Não usar em filhotes menores de 8 semanas', 'Observar reações nas 24h'],
    benefits: ['12 semanas de proteção', 'Prático — dose única', 'Eficaz contra mais de 20 espécies de parasitas']
  },
  {
    category_id: 'petshop', category_name: 'Pet Shop', is_popular: false, rating: 4.7, reviews: 90,
    title: 'Cama Ortopédica G', price: 199.90,
    image: 'https://images.unsplash.com/photo-1629898084050-68d712ce19d8?auto=format&fit=crop&q=80&w=800',
    description: 'Espuma de alta densidade com cobertura lavável, ideal para pets idosos com artrite.',
    duration: 'Vida útil de 2 a 3 anos',
    professional: 'Loja PetCare',
    cares: ['Lavar capa semanalmente', 'Não expor ao sol direto por longos períodos', 'Tamanho G para pets até 30kg'],
    benefits: ['Alivia dores articulares', 'Capa removível e lavável', 'Design moderno para a casa']
  },
  {
    category_id: 'petshop', category_name: 'Pet Shop', is_popular: false, rating: 4.9, reviews: 300,
    title: 'Sachês Premium (Caixa)', price: 45.00,
    image: 'https://images.unsplash.com/photo-1625910513393-9dd64c8d8b68?auto=format&fit=crop&q=80&w=800',
    description: 'Pack com 12 sachês de frango e salmão, ideal como complemento alimentar para gatos.',
    duration: 'Validade de 24 meses',
    professional: 'Loja PetCare',
    cares: ['Refrigerar após aberto', 'Não substituir a ração principal', 'Verificar peso do pet periodicamente'],
    benefits: ['Alto teor proteico natural', 'Ótima palatabilidade', 'Sem glutamato monossódico']
  },
  {
    category_id: 'petshop', category_name: 'Pet Shop', is_popular: false, rating: 4.8, reviews: 120,
    title: 'Coleira Peitoral Conforto', price: 85.00,
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=800',
    description: 'Peitoral que evita puxões no pescoço com tecido respirável e fecho de segurança.',
    duration: 'Vida útil de 1 a 2 anos',
    professional: 'Loja PetCare',
    cares: ['Medir o tórax antes de comprar', 'Verificar ajuste semanalmente', 'Não deixar com o pet sem supervisão'],
    benefits: ['Evita lesões na traqueia', 'Tecido respirável e confortável', 'Disponível em 5 cores']
  },
  // ADESTRAMENTO
  {
    category_id: 'adestramento', category_name: 'Adestramento', is_popular: true, rating: 4.9, reviews: 78,
    title: 'Adestramento Básico', price: 160.00,
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=800',
    description: 'Ensino de comandos essenciais: sentar, deitar, ficar, vir e não pular em pessoas.',
    duration: '60 minutos por sessão',
    professional: 'Adestrador Certificado Carlos Mendes',
    cares: ['Trazer petiscos favoritos', 'Sessões de manhã rendem mais', 'Consistência em casa é fundamental'],
    benefits: ['Mais segurança nos passeios', 'Fortalece o vínculo tutor-pet', 'Resultados visíveis em 4 sessões']
  },
  {
    category_id: 'adestramento', category_name: 'Adestramento', is_popular: false, rating: 4.8, reviews: 40,
    title: 'Socialização para Filhotes', price: 120.00,
    image: 'https://images.unsplash.com/photo-1534361960057-19f4434a337d?auto=format&fit=crop&q=80&w=800',
    description: 'Exposição controlada a sons, pessoas e outros animais para um desenvolvimento saudável.',
    duration: '45 minutos por sessão',
    professional: 'Adestrador Certificado Carlos Mendes',
    cares: ['Ideal para filhotes de 2 a 5 meses', 'Vacinas parciais já são suficientes', 'Não forçar interações'],
    benefits: ['Previne medos e fobias futuras', 'Pet mais equilibrado e confiante', 'Grupo pequeno de até 5 filhotes']
  },
  {
    category_id: 'adestramento', category_name: 'Adestramento', is_popular: false, rating: 4.7, reviews: 22,
    title: 'Controle de Ansiedade', price: 200.00,
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=800',
    description: 'Protocolo especializado para pets com ansiedade por separação, medos e comportamentos destrutivos.',
    duration: '75 minutos por sessão',
    professional: 'Adestrador Certificado + Veterinário Comportamental',
    cares: ['Trazer objeto com cheiro do tutor', 'Relatar todos os comportamentos', 'Pode ser necessária medicação veterinária'],
    benefits: ['Redução do estresse do pet', 'Menos destruição em casa', 'Abordagem humanizada e positiva']
  },
  {
    category_id: 'adestramento', category_name: 'Adestramento', is_popular: false, rating: 4.9, reviews: 18,
    title: 'Adestramento Avançado', price: 220.00,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800',
    description: 'Comandos avançados, truques, obediência à distância e controle em ambientes com distrações.',
    duration: '75 minutos por sessão',
    professional: 'Adestrador Certificado Carlos Mendes',
    cares: ['Pré-requisito: comandos básicos dominados', 'Praticar 15 min por dia em casa', 'Evitar treinar com o pet com fome'],
    benefits: ['Pet com alto nível de obediência', 'Ideal para cães de trabalho e esporte', 'Certificado de conclusão emitido']
  },
  {
    category_id: 'adestramento', category_name: 'Adestramento', is_popular: false, rating: 4.6, reviews: 35,
    title: 'Passeio Acompanhado', price: 90.00,
    image: 'https://images.unsplash.com/photo-1601758174114-e711f5f08a73?auto=format&fit=crop&q=80&w=800',
    description: 'Passeio de 60 minutos com adestrador para reforçar comandos em ambiente real e dinâmico.',
    duration: '60 minutos',
    professional: 'Adestrador Certificado PetCare',
    cares: ['Coleira e guia obrigatórios', 'Agendar com 2 dias de antecedência', 'Disponível de segunda a sábado'],
    benefits: ['Treino em ambiente real', 'Gastos de energia físico e mental', 'Relatório de progresso pós-passeio']
  }
];

// ========================================
// FUNÇÃO PRINCIPAL DE SEED
// ========================================
async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // 1. Limpa tabelas na ordem correta (respeita FK)
  console.log('🗑️  Limpando dados antigos...');
  await supabase.from('pets').delete().neq('id', 0);
  await supabase.from('usuarios').delete().neq('id', 0);
  await supabase.from('servicos').delete().neq('id', 0);
  await supabase.from('categorias').delete().neq('id', '');
  console.log('   ✅ Tabelas limpas\n');

  // 2. Insere categorias
  console.log('📁 Inserindo categorias...');
  const { error: catError } = await supabase.from('categorias').insert(categorias);
  if (catError) {
    console.error('   ❌ Erro nas categorias:', catError.message);
    process.exit(1);
  }
  console.log(`   ✅ ${categorias.length} categorias inseridas\n`);

  // 3. Insere serviços
  console.log('📋 Inserindo serviços...');
  const { error: svcError } = await supabase.from('servicos').insert(servicos);
  if (svcError) {
    console.error('   ❌ Erro nos serviços:', svcError.message);
    process.exit(1);
  }
  console.log(`   ✅ ${servicos.length} serviços inseridos\n`);

  // 4. Insere Usuários e Pets de teste
  console.log('👥 Inserindo usuários e pets de teste...');
  const passwordHash = await bcrypt.hash('senha123', 10);
  const usuarios = [
    {
      name: 'João Silva',
      cpf: '12345678901',
      email: 'joao@teste.com',
      phone: '11999999999',
      city: 'São Paulo',
      address: 'Rua A, 123',
      password_hash: passwordHash
    },
    {
      name: 'Maria Oliveira',
      cpf: '98765432109',
      email: 'maria@teste.com',
      phone: '11888888888',
      city: 'Rio de Janeiro',
      address: 'Av B, 456',
      password_hash: passwordHash
    }
  ];

  const { data: usersDb, error: usersError } = await supabase.from('usuarios').insert(usuarios).select();
  if (usersError) {
    console.error('   ❌ Erro nos usuários:', usersError.message);
    process.exit(1);
  }
  console.log(`   ✅ ${usersDb.length} usuários inseridos\n`);

  const pets = [
    {
      name: 'Rex',
      species: 'Cachorro',
      breed: 'Labrador',
      age: '2 anos',
      notes: 'Muito dócil',
      user_id: usersDb[0].id
    },
    {
      name: 'Mia',
      species: 'Gato',
      breed: 'Siamês',
      age: '1 ano',
      notes: 'Gosta de sachê',
      user_id: usersDb[1].id
    }
  ];

  const { error: petsError } = await supabase.from('pets').insert(pets);
  if (petsError) {
    console.error('   ❌ Erro nos pets:', petsError.message);
    process.exit(1);
  }
  console.log(`   ✅ ${pets.length} pets inseridos\n`);

  console.log('🎉 Seed concluído com sucesso!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Erro fatal no seed:', err);
  process.exit(1);
});
