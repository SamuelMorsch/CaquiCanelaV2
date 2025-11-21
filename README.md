# Projeto CaquiCanela E-commerce

Este repositório contém o código-fonte completo do **CaquiCanela**, um e-commerce de roupas femininas desenvolvido como parte do projeto de extensão do curso de Análise e Desenvolvimento de Sistemas da Católica SC.  
O sistema foi criado para atender às necessidades da empresa **CaquiCanela**, que trabalha com revenda de roupas femininas, oferecendo uma plataforma moderna, intuitiva e segura para suas clientes.

# Telas

<img width="1159" height="577" alt="imagem (3)" src="https://github.com/user-attachments/assets/b88a50ac-69b7-48d7-86a6-4a2bc8301e43" />
<img width="1163" height="576" alt="image" src="https://github.com/user-attachments/assets/b6dd7f26-fad3-41af-b5bc-39f44781361d" />
<img width="1160" height="576" alt="image" src="https://github.com/user-attachments/assets/2c7972de-5b4a-41eb-83ec-fed85b452bbd" />
<img width="1157" height="575" alt="image" src="https://github.com/user-attachments/assets/bbe6ed46-2d3b-4f8a-aba8-22c65565aa00" />
<img width="1162" height="580" alt="image" src="https://github.com/user-attachments/assets/4f2ac2f0-355a-4673-ad98-92e9f5c1fcb1" />
<img width="1160" height="577" alt="image" src="https://github.com/user-attachments/assets/333aff19-73b4-4d18-b65b-dbb885045333" />
<img width="1157" height="578" alt="image" src="https://github.com/user-attachments/assets/489636db-c023-423c-8d18-6269eaad3a60" />
<img width="1920" height="956" alt="image3" src="https://github.com/user-attachments/assets/99a274a5-7d7b-453e-ba7f-944b213bf383" />
<img width="1920" height="953" alt="image4" src="https://github.com/user-attachments/assets/8730470d-5f31-4f1e-bb2f-70d1018bbd06" />
<img width="1920" height="955" alt="image" src="https://github.com/user-attachments/assets/544d6b41-c97f-49d8-aab5-f163745c47dc" />
<img width="1920" height="955" alt="image2" src="https://github.com/user-attachments/assets/f1f45568-66f8-4693-9487-6916693ea1b7" />

---

## Estrutura do Projeto

Este é um **monorepo** que contém as duas aplicações separadas:

```
/
├── /backend/       (Servidor Node.js + Express + Sequelize)
└── /frontend/      (Cliente React + Vite + Tailwind CSS)
└── README.md       (Você está aqui)
```

### Tecnologias Utilizadas

**Backend**
- Node.js  
- Express  
- Sequelize (ORM)  
- MySQL  
- JWT + Bcrypt  
- Dotenv  

**Frontend**
- React  
- Vite  
- Tailwind CSS  
- Axios  
- React Router DOM  

---

## Como Rodar o Projeto Localmente

Você precisará ter o **Node.js (v18 ou superior)** e o **MySQL** instalados.

Para rodar o projeto completo, abra **dois terminais separados** — um para o backend e outro para o frontend.

---

### 1. Rodando o Backend (API)

No primeiro terminal:

```bash
# 1. Navegue até a pasta do backend
cd backend

# 2. Instale as dependências (apenas na primeira vez)
npm install

# 3. Inicie o servidor
npm start
```

O backend estará disponível em **http://localhost:3000**

---

### 2. Rodando o Frontend (Loja)

No segundo terminal:

```bash
# 1. Navegue até a pasta do frontend
cd frontend

# 2. Instale as dependências (apenas na primeira vez)
npm install

# 3. Inicie o cliente React
npm run dev
```

O frontend estará disponível em **http://localhost:5173**  
(o Vite pode escolher outra porta, verifique no terminal).

O frontend se conecta automaticamente à API em **http://localhost:3000**.

