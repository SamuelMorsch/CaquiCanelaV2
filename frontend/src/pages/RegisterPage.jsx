import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', cep: '', logradouro: '', numero: '',
    bairro: '', cidade: '', estado: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.'); return;
    }

    // O backend (auth.js) só aceita name, email, password.
    // O backend (Address.js) precisaria de outra rota para salvar o endereço.
    const result = await register(formData);

    if (result.success) {
      setSuccess('Cadastro realizado! Redirecionando para o login...');
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setError(result.error || 'Falha ao registrar.');
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-brand-secondary font-serif">
            Crie sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-brand-text">
            Já tem uma?{' '}
            <Link to="/login" className="font-medium text-brand-primary hover:text-brand-primary-dark">
              Faça login
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-white p-8 shadow-lg rounded-lg" onSubmit={handleSubmit}>
          
          {error && <div className="rounded-md bg-red-50 p-4"><p className="text-sm text-red-800">{error}</p></div>}
          {success && <div className="rounded-md bg-green-50 p-4"><p className="text-sm text-green-800">{success}</p></div>}

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-brand-secondary font-serif">Dados de Acesso</h3>
            <Input name="name" type="text" placeholder="Nome Completo" required value={formData.name} onChange={handleChange} />
            <Input name="email" type="email" placeholder="E-mail" required value={formData.email} onChange={handleChange} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="password" type="password" placeholder="Senha" required value={formData.password} onChange={handleChange} />
              <Input name="confirmPassword" type="password" placeholder="Confirmar Senha" required value={formData.confirmPassword} onChange={handleChange} />
            </div>
            
            <hr className="my-6" />

            <h3 className="text-lg font-medium text-brand-secondary font-serif">Dados Pessoais e Endereço (Opcional)</h3>
            <p className="text-sm text-gray-500">Seu backend precisa ser atualizado para salvar estes dados.</p>
            
            <Input name="phone" type="tel" placeholder="Telefone" value={formData.phone} onChange={handleChange} />
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
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-brand-primary py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-75"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}