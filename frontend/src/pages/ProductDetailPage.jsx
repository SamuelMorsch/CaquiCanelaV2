import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Busca o produto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products'); // Busca todos
        if (!response.ok) throw new Error('Falha ao buscar produto.');
        
        const products = await response.json();
        const foundProduct = products.find(p => p.id.toString() === id); // Filtra

        if (foundProduct) {
          setProduct(foundProduct);
          if(foundProduct.Stocks && foundProduct.Stocks.length > 0) {
             setSelectedColor(foundProduct.Stocks[0].color || '');
             setSelectedSize(foundProduct.Stocks[0].size || '');
          }
        } else {
          throw new Error('Produto não encontrado.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center p-12">Carregando...</div>;
  if (error) return <div className="text-center p-12 text-red-600">Erro: {error}</div>;
  if (!product) return <div className="text-center p-12">Produto não encontrado.</div>;

  const totalStock = product.Stocks.reduce((sum, stock) => sum + stock.quantity, 0);

  // --- LÓGICA DA IMAGEM CORRIGIDA ---
  // 1. Tenta pegar a imagem da variação selecionada
  const selectedStockImage = product.Stocks.find(
    s => s.color === selectedColor && s.size === selectedSize
  )?.imageUrl;
  
  // 2. Se não achar, pega a primeira imagem que encontrar
  const firstStockImage = product.Stocks?.[0]?.imageUrl;
  
  // 3. Se não achar, usa o placeholder
  const displayImage = selectedStockImage || firstStockImage || `https://placehold.co/600x600/FFE2C8/7C4A2D?text=${product.name.replace(' ', '+')}`;


  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
  };
  
  const colors = [...new Set(product.Stocks.map(s => s.color).filter(Boolean))];
  const sizes = [...new Set(product.Stocks.map(s => s.size).filter(Boolean))];

  return (
    <div className="container mx-auto max-w-4xl p-4 py-12">
      <div className="mb-6">
        <Link to="/" className="text-sm font-medium text-brand-primary hover:text-brand-primary-dark">
          &larr; Voltar ao catálogo
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden md:flex">
        <div className="md:w-1/2">
          <img 
            src={displayImage} // <-- USA A IMAGEM CORRIGIDA
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="md:w-1/2 p-8">
          <h1 className="text-3xl font-bold text-brand-secondary font-serif mb-4">
            {product.name}
          </h1>
          <p className="text-3xl font-medium text-brand-secondary mb-6">
            R$ {parseFloat(product.price).toFixed(2)}
          </p>
          <p className="text-brand-text mb-6">
            {product.description || product.short_description || "Sem descrição detalhada."}
          </p>
          <p className="text-sm text-brand-accent mb-6">
            {totalStock > 0 ? `${totalStock} unidades em estoque` : "Fora de estoque"}
          </p>
          
          {colors.length > 0 && (
            <div className="mb-4">
              <label className="text-sm font-medium text-brand-text">Cor:</label>
              <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md">
                {colors.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}
          
          {sizes.length > 0 && (
            <div className="mb-4">
              <label className="text-sm font-medium text-brand-text">Tamanho:</label>
              <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className="w-full mt-1 p-2 border border-gray-300 rounded-md">
                {sizes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <label htmlFor="quantity" className="text-sm font-medium text-brand-text">Qtd:</label>
            <input
              type="number" id="quantity" name="quantity" min="1" max={totalStock}
              value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              className="w-20 rounded-md border border-gray-300 px-3 py-2"
              disabled={totalStock === 0}
            />
          </div>

          <button
            onClick={handleAddToCart}
            disabled={totalStock === 0 || quantity > totalStock}
            className="w-full rounded-md border border-transparent bg-brand-primary py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-brand-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {totalStock === 0 ? "Fora de estoque" : "Adicionar ao Carrinho"}
          </button>
        </div>
      </div>
    </div>
  );
}