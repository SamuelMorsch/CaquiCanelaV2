import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import OrdersPage from './OrdersPage'; // Importa a lista de pedidos
import Input from '../components/Input';

// Página "Minha Conta" (US-10)
export default function UserProfilePage() {
  const { isAuthenticated, user } = useAuth();
  const [tab, setTab] = useState('pedidos'); // 'pedidos' ou 'dados'

  // Dados simulados do usuário (no futuro, viria da API)
  const [formData, setFormData] = useState({
    name: 'Cliente CaquiCanela',
    email: user?.email || 'cliente@email.com',
    phone: '51999998888', cep: '90000-000',
    logradouro: 'Rua das Flores', numero: '123',
    bairro: 'Centro', cidade: 'Porto Alegre', estado: 'RS',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSaveData = (e) => {
    e.preventDefault();
    // No projeto real, aqui você faria um fetch PUT/PATCH para /api/me
    alert("Dados salvos (simulado)!");
  };

  // Se não estiver logado, redireciona para o login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h2 className="text-3xl font-bold text-brand-secondary font-serif text-center mb-12">
        Minha Conta
      </h2>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        {/* Abas */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setTab('pedidos')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                tab === 'pedidos'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Meus Pedidos
            </button>
            <button
              onClick={() => setTab('dados')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                tab === 'dados'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Meus Dados
            </button>
          </nav>
        </div>

        {/* Conteúdo da Aba */}
        <div>
          {tab === 'pedidos' && (
            <OrdersPage />
          )}
          
          {tab === 'dados' && (
            <form onSubmit={handleSaveData} className="space-y-6">
              <h3 className="text-xl font-medium text-brand-secondary font-serif">Seus Dados</h3>
              
              <Input name="name" type="text" placeholder="Nome Completo" required value={formData.name} onChange={handleChange} />
              <Input name="email" type="email" placeholder="E-mail" required value={formData.email} onChange={handleChange} disabled />
              <Input name="phone" type="tel" placeholder="Telefone" value={formData.phone} onChange={handleChange} />
              
              <hr className="my-6" />
              <h3 className="text-xl font-medium text-brand-secondary font-serif">Endereço</h3>
              
              <Input name="cep" type="text" placeholder="CEP" value={formData.cep} onChange={handleChange} />
              <Input name="logradouro" type="text" placeholder="Endereço (Rua, Av.)" value={formData.logradouro} onChange={handleChange} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input name="numero" type="text" placeholder="Número" value={formData.numero} onChange={handleChange} />
                <Input name="bairro" type="text" placeholder="Bairro" value={formData.bairro} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input name="cidade" type="text" placeholder="Cidade" value={formData.cidade} onChange={handleChange} />
                <Input name="estado" type="text" placeholder="Estado (ex: RS)" value={formData.estado} onChange={handleChange} />
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="rounded-md border border-transparent bg-brand-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-primary-dark focus:outline-none"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}