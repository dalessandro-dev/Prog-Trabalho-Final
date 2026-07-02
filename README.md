# 🐾 PetCare — Sistema Web de Serviços para Pet Shop e Clínica Veterinária

Trabalho de Programação Web — Sistema completo com frontend em HTML/CSS/JS e backend em Node.js + TypeScript + Express, conectado ao banco de dados Supabase (PostgreSQL).

---

## 🗂️ Estrutura do Projeto

```
PETCARE/
├── backend/                  ← Servidor Node.js + Express + TypeScript
│   ├── src/
│   │   ├── database/
│   │   │   ├── supabase.ts   ← Cliente do banco de dados
│   │   │   └── seed.ts       ← Script para popular o banco
│   │   ├── routes/
│   │   │   ├── categorias.ts ← GET /categorias
│   │   │   ├── servicos.ts   ← GET /servicos e GET /servicos/:id
│   │   │   ├── auth.ts       ← POST /cadastro e POST /login
│   │   │   └── home.ts       ← GET /home (dados agregados)
│   │   └── server.ts         ← Ponto de entrada da aplicação
│   ├── .env                  ← Credenciais do banco (NÃO commitar)
│   ├── .env.example          ← Exemplo de variáveis necessárias
│   ├── package.json
│   └── tsconfig.json
├── css/                      ← Estilos globais e por página
├── js/
│   ├── services/
│   │   └── api.js            ← Camada de chamadas ao backend
│   └── pages/                ← Scripts específicos de cada página
├── pages/                    ← Páginas HTML do sistema
│   ├── servicos.html         ← Listagem de serviços por categoria
│   ├── detalhes.html         ← Detalhes de um serviço
│   ├── register.html         ← Cadastro de tutor e pet
│   ├── login.html            ← Login do usuário
│   └── agendamento.html      ← Carrinho / Agendamento
└── index.html                ← Página inicial
```

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior
- Conta no [Supabase](https://supabase.com) com um projeto criado
- Extensão **Live Server** no VS Code (para servir o frontend)

---

## 🗄️ 1. Configurar o Banco de Dados (Supabase)

1. Acesse [supabase.com](https://supabase.com) → seu projeto
2. Clique em **SQL Editor** no menu lateral
3. Execute o seguinte SQL para criar as tabelas:

```sql
CREATE TABLE IF NOT EXISTS categorias (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  text_color TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS servicos (
  id SERIAL PRIMARY KEY,
  category_id TEXT REFERENCES categorias(id) ON DELETE SET NULL,
  category_name TEXT,
  is_popular BOOLEAN DEFAULT FALSE,
  rating NUMERIC(3,1),
  reviews INT DEFAULT 0,
  title TEXT NOT NULL,
  price NUMERIC(10,2),
  image TEXT,
  description TEXT,
  duration TEXT,
  professional TEXT,
  cares TEXT[],
  benefits TEXT[]
);

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  city TEXT,
  address TEXT,
  password_hash TEXT NOT NULL,
  pet_name TEXT,
  pet_species TEXT,
  pet_breed TEXT,
  pet_age TEXT,
  pet_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Necessário para a chave pública funcionar
ALTER TABLE categorias DISABLE ROW LEVEL SECURITY;
ALTER TABLE servicos DISABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
```

---

## 🔑 2. Configurar as Variáveis de Ambiente

Dentro da pasta `backend/`, crie um arquivo chamado `.env` com base no `.env.example`:

```env
SUPABASE_URL=https://SEU_PROJETO.supabase.co
SUPABASE_KEY=sua_chave_publica_aqui
PORT=3001
```

> As credenciais estão em: Supabase → Settings → API → **Project URL** e **anon/public key**

---

## 📦 3. Instalar as Dependências do Backend

```bash
cd backend
npm install
```

---

## 🌱 4. Popular o Banco com os Dados Iniciais

Execute **uma única vez** para inserir as categorias e serviços:

```bash
npm run seed
```

Saída esperada:
```
🌱 Iniciando seed do banco de dados...
✅ 5 categorias inseridas
✅ 25 serviços inseridos
🎉 Seed concluído com sucesso!
```

---

## 🚀 5. Iniciar o Servidor Backend

```bash
npm run dev
```

O servidor será iniciado em: **http://localhost:3001**

Endpoints disponíveis:
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/home` | Dados da página inicial |
| GET | `/categorias` | Lista todas as categorias |
| GET | `/servicos` | Lista todos os serviços |
| GET | `/servicos?categoria=clinica` | Filtra serviços por categoria |
| GET | `/servicos/:id` | Detalhes de um serviço |
| POST | `/cadastro` | Cadastra novo usuário |
| POST | `/login` | Autentica usuário |

---

## 🖥️ 6. Abrir o Frontend

Com o backend rodando, abra o frontend de uma das formas:

**Opção A — Live Server (VS Code):**
- Clique com o botão direito em `index.html`
- Selecione **"Open with Live Server"**

**Opção B — Direto no navegador:**
- Dê dois cliques no arquivo `index.html`

> ⚠️ O backend precisa estar rodando (`npm run dev`) para o frontend funcionar corretamente.

---

## 📄 Páginas do Sistema

| Página | Arquivo | Descrição |
|--------|---------|-----------|
| Início | `index.html` | Cards de categorias e serviços mais procurados |
| Serviços | `pages/servicos.html` | Listagem filtrada por categoria |
| Detalhes | `pages/detalhes.html` | Informações completas do serviço |
| Cadastro | `pages/register.html` | Formulário de cadastro de tutor e pet |
| Login | `pages/login.html` | Autenticação do usuário |
| Agendamento | `pages/agendamento.html` | Carrinho com serviços selecionados |

---

## 🛠️ Tecnologias Utilizadas

**Frontend**
- HTML5, CSS3 (Vanilla), JavaScript (ES6+)
- Phosphor Icons, Google Fonts (Inter)

**Backend**
- Node.js + TypeScript
- Express.js
- Supabase JS Client
- bcryptjs (hash de senhas)
- dotenv, cors
