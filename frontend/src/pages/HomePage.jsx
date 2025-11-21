import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Busca produtos da API (redirecionada pelo vite.config.js)
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Falha ao buscar produtos.');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter(product => category === 'all' || product.category === category) // Simulação de categoria
    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <div className="text-center bg-white p-10 rounded-lg shadow-lg mb-12">
        <h1 className="text-4xl font-bold text-brand-secondary tracking-tight font-serif">
          Coleção de Outono
        </h1>
        <p className="text-brand-text mt-4 max-w-2xl mx-auto">
          Descubra as peças que vão transformar sua estação.
        </p>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar por nome..."
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">Todas as Categorias</option>
          <option value="vestidos">Vestidos</option>
          <option value="blusas">Blusas</option>
          <option value="calcas">Calças</option>
        </select>
      </div>

      {loading && <p className="text-center">Carregando produtos...</p>}
      {error && (
        <p className="text-center text-red-600">
          <strong>Erro:</strong> {error} (Verifique se o backend está rodando)
        </p>
      )}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center">Nenhum produto encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
}