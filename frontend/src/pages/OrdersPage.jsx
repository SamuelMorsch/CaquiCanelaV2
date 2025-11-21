import React, { useEffect, useState } from 'react';

// Esta é a ABA "Meus Pedidos" (RF-Acompanhamento de Venda)
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulação de busca de pedidos
  useEffect(() => {
    // No backend, você criaria GET /api/my-orders
    const simulatedOrders = [
      { id: '1234A', date: '05/11/2025', total: 149.90, status: 'Entregue' },
      { id: '1235B', date: '07/11/2025', total: 89.90, status: 'A caminho' },
    ];
    setOrders(simulatedOrders);
    setLoading(false);
  }, []);

  if (loading) return <p>Carregando pedidos...</p>;
  
  if (orders.length === 0) {
    return <p className="text-center text-brand-text">Você ainda não fez nenhum pedido.</p>;
  }

  return (
    <div className="space-y-6">
      {orders.map(order => (
        <div key={order.id} className="bg-gray-50 p-6 rounded-lg shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm font-bold text-brand-primary">Pedido #{order.id}</p>
            <p className="text-lg font-medium text-brand-secondary">Total: R$ {order.total.toFixed(2)}</p>
            <p className="text-sm text-brand-text">Data: {order.date}</p>
          </div>
          <div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.status === 'Entregue' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {order.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}