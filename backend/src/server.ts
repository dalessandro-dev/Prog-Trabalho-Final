import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do .env antes de qualquer import que as use
dotenv.config();

// Importa as rotas
import categoriasRouter from './routes/categorias';
import servicosRouter from './routes/servicos';
import authRouter from './routes/auth';
import homeRouter from './routes/home';
import petsRouter from './routes/pets';
import agendamentosRouter from './routes/agendamentos';

const app = express();
const PORT = process.env.PORT || 3001;

// ==========================================
// MIDDLEWARES GLOBAIS
// ==========================================

// Habilita CORS para o frontend (arquivo aberto localmente ou servidor)
app.use(cors({
  origin: '*', // Em produção, restringir para o domínio do frontend
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parseia o body das requisições como JSON
app.use(express.json());

// Log simples de cada requisição recebida
app.use((req, _res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
});

// ==========================================
// ROTAS
// ==========================================
app.use('/categorias', categoriasRouter);
app.use('/servicos', servicosRouter);
app.use('/home', homeRouter);
app.use('/pets', petsRouter);
app.use('/agendamentos', agendamentosRouter);

// Rotas de autenticação montadas diretamente na raiz
app.use('/', authRouter);

// Rota raiz (healthcheck)
app.get('/', (_req, res) => {
  res.json({
    message: '🐾 PetCare API está online!',
    version: '1.0.0',
    endpoints: [
      'GET  /home',
      'GET  /categorias',
      'GET  /servicos',
      'GET  /servicos?categoria=:id',
      'GET  /servicos/:id',
      'POST /cadastro',
      'POST /login',
      'GET  /pets (Requer JWT)',
      'POST /pets (Requer JWT)',
      'POST /agendamentos (Requer JWT)',
      'GET  /agendamentos (Requer JWT)'
    ]
  });
});

// Rota 404 — catch-all para rotas inexistentes
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Rota não encontrada.' });
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================
app.listen(PORT, () => {
  console.log('\n🐾 ====================================');
  console.log(`   PetCare Backend rodando!`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log('   ====================================\n');
});

export default app;
