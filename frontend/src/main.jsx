import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'; // O CSS do Tailwind

// Provedores Globais
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout Principal (Cabeçalho e Rodapé)
import App from './App';

// Nossas Páginas
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import UserProfilePage from './pages/UserProfilePage'; // "Minha Conta"
import AdminPage from './pages/AdminPage'; // Painel Admin
import GenericPage from './pages/GenericPage'; // Pág. genérica (Sobre, Contato...)

// Este é o "GPS" do seu site.
// Ele define qual componente (página) mostrar para cada URL.
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // O <App> é o layout (Header/Footer)
    // As "children" são as páginas que mudam dentro do layout
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/produto/:id', element: <ProductDetailPage /> }, // Rota de Detalhe
      { path: '/login', element: <LoginPage /> },
      { path: '/registro', element: <RegisterPage /> },
      { path: '/carrinho', element: <CartPage /> },
      { path: '/minha-conta', element: <UserProfilePage /> }, // Rota "Minha Conta"
      { path: '/admin', element: <AdminPage /> }, // Rota "Painel Admin"
      
      // Rotas genéricas (Sobre, Contato, etc.)
      { path: '/sobre', element: <GenericPage title="Sobre Nós" /> },
      { path: '/contato', element: <GenericPage title="Contato" /> },
      { path: '/politicas', element: <GenericPage title="Política de Trocas" /> },
    ],
  },
]);

// Renderiza o aplicativo
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);