import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';

export default function CartPage() {
  const { items, total, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [shippingCost, setShippingCost] = useState(0);
  const [cep, setCep] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateShipping = () => {
    if (cep.length >= 8) setShippingCost(25.50); // Simulado
    else setShippingCost(0);
  };

  const handleCheckout = async () => {
    setError(null); setSuccess(null);

    if (!isAuthenticated) {
      setError('Você precisa estar logado para finalizar a compra.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    if (items.length === 0) {
      setError('Seu carrinho está vazio.'); return;
    }

    setLoading(true);

    const orderData = {
      user_id: user.id, // Agora o user.id existe no AuthContext
      shipping_amount: shippingCost,
      items: items.map(item => ({
        product_id: item.id,
        quantity: item.qty,
        unit_price: item.price
      }))
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Falha ao criar o pedido.');

      setSuccess('Pedido realizado com sucesso! Redirecionando...');
      clearCart();
      setTimeout(() => navigate('/minha-conta'), 3000); // Vai para "Minha Conta"

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold tracking-tight text-brand-secondary font-serif text-center mb-12">
        Meu Carrinho
      </h2>

      {items.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-lg shadow-md">
          <p className="text-brand-text text-lg">Seu carrinho está vazio.</p>
          <Link to="/" className="mt-6 inline-block px-6 py-2 bg-brand-primary text-white text-sm font-bold rounded-md shadow-sm hover:bg-brand-primary-dark">
            Ver produtos
          </Link>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <ul role="list" className="divide-y divide-gray-200">
              {items.map((item, index) => (
                <li key={index} className="flex py-6">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.imageUrl || `https://placehold.co/100x100/FFE2C8/7C4A2D?text=${item.name.replace(' ', '+')}`}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-brand-secondary">
                        <h3 className="font-serif">{item.name}</h3>
                        <p>R$ {(parseFloat(item.price) * item.qty).toFixed(2)}</p>
                      </div>
                      <p className="text-sm text-gray-500">{item.color} / {item.size}</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <p className="text-brand-text">Qtd: {item.qty}</p>
                      <p className="text-brand-text">R$ {parseFloat(item.price).toFixed(2)} cada</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1 mt-10 lg:mt-0">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <h3 className="text-lg font-medium text-brand-secondary font-serif mb-4">Resumo</h3>
              
              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium text-brand-text">Calcular Frete</label>
                <div className="flex gap-2">
                  <Input name="cep" placeholder="Seu CEP" value={cep} onChange={(e) => setCep(e.target.value)} />
                  <button onClick={calculateShipping} className="px-4 rounded-md bg-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-300">OK</button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium text-brand-text">Forma de Pagamento</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-3 text-brand-text focus:z-10 focus:border-brand-primary focus:outline-none focus:ring-brand-primary sm:text-sm"
                >
                  <option value="pix">Pix</option>
                  <option value="credit_card">Cartão de Crédito</option>
                  <option value="boleto">Boleto</option>
                </select>
              </div>
              
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-base text-brand-text">
                  <p>Subtotal</p>
                  <p>R$ {total.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-base text-brand-text">
                  <p>Frete</p>
                  <p>R$ {shippingCost.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-lg font-bold text-brand-secondary font-serif">
                  <p>Total</p>
                  <p>R$ {(total + shippingCost).toFixed(2)}</p>
                </div>
              </div>

              {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
              {success && <p className="text-sm text-green-600 mt-4">{success}</p>}

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full mt-6 rounded-md border border-transparent bg-brand-primary py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-75"
              >
                {loading ? 'Processando...' : 'Finalizar Compra'}
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}