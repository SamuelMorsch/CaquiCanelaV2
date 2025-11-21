import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const result = await login(email, password);

    if (result.success) {
      // Se for admin, vai para o painel de admin. Senão, vai para "Minha Conta".
      if (result.role === 'owner' || result.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/minha-conta');
      }
    } else {
      setError(result.error || 'Falha no login.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-brand-secondary font-serif">
            Acesse sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-brand-text">
            Não tem uma conta?{' '}
            <Link to="/registro" className="font-medium text-brand-primary hover:text-brand-primary-dark">
              Crie uma gratuitamente
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-white p-8 shadow-lg rounded-lg" onSubmit={handleSubmit}>
          
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Input
                id="email-address" name="email" type="email" required
                placeholder="Endereço de e-mail"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Input
                id="password" name="password" type="password" required
                placeholder="Senha"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-brand-primary hover:text-brand-primary-dark">
                Esqueceu sua senha?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-brand-primary py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-75"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}