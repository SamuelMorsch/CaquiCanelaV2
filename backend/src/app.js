// 1. Imports (Originais + Novos)
require('dotenv').config(); // Carrega o .env
const express = require('express');
const cors = require('cors'); // Novo
const path = require('path'); // Novo
const { sequelize } = require('./db'); // Original

// 2. Rotas (Originais + Novas)
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const uploadRoutes = require('./routes/upload'); // Novo
const stockRoutes = require('./routes/stock'); // Novo

// 3. Script de Init (Original)
const init = require('./app_init'); // Roda o admin_seed

// 4. Configuração do App (Original + Novos)
const app = express();
app.use(cors()); // Novo (para o frontend)
app.use(express.json()); // Novo (substitui o obsoleto body-parser)

// 5. Servir Imagens (Novo)
// Serve arquivos estáticos da pasta 'uploads'.
// Quando alguém acessar http://localhost:3000/uploads/nome_da_imagem.jpg
// ele buscará em backend/uploads/nome_da_imagem.jpg
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// 6. Usar as Rotas (Original + Novas)
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/upload', uploadRoutes);
app.use('/stock', stockRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('API CaquiCanela Online!');
});

// 7. Função de Start (A PARTE QUE FALTAVA!)
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate(); // Conecta ao DB
    console.log('Conexão com o banco estabelecida.');
    
    await sequelize.sync({ alter: true }); // Sincroniza os modelos
    console.log('Modelos sincronizados.');
    
    await init(); // Roda o admin_seed
    
    app.listen(PORT, () => { // Inicia o servidor
      console.log(`\n========== SERVIDOR RODANDO ==========`);
      console.log(`Backend ouvindo na porta ${PORT}`);
      console.log(`Imagens servidas de http://localhost:${PORT}/uploads`);
      console.log(`====================================\n`);
    });
    
  } catch (err) {
    console.error('Erro ao iniciar servidor:', err);
    process.exit(1);
  }
}

// 8. Chamar a função de Start
start();