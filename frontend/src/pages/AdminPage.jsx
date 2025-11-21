import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Input from '../components/Input';

// Esta é a Página de Admin completa
export default function AdminPage() {
  const { isAuthenticated, role, token } = useAuth(); // Pega o token para autenticar uploads
  const [tab, setTab] = useState('add');

  // --- Aba "Adicionar Produto" ---
  const [formData, setFormData] = useState({
    name: '', sku: '', slug: '', price: '', description: '',
    color: '', size: '', quantity: 0
  });
  const [imageFile, setImageFile] = useState(null); // Estado para o ARQUIVO da imagem
  const [errorAdd, setErrorAdd] = useState(null);
  const [successAdd, setSuccessAdd] = useState(null);
  const [loadingAdd, setLoadingAdd] = useState(false);

  // --- Aba "Gerenciar Estoque" ---
  const [stockItems, setStockItems] = useState([]);
  const [loadingStock, setLoadingStock] = useState(false);
  const [errorStock, setErrorStock] = useState(null);
  const [editValues, setEditValues] = useState({});

  if (!isAuthenticated || (role !== 'owner' && role !== 'admin')) {
    return <Navigate to="/" replace />;
  }

  // --- Lógica de ADICIONAR PRODUTO ---
  
  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setErrorAdd(null); setSuccessAdd(null); setLoadingAdd(true);
    
    let finalImageUrl = null;

    try {
      // 1. Upload da Imagem (se existir)
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('productImage', imageFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        
        const uploadData = await uploadResponse.json();
        if (!uploadResponse.ok) {
          throw new Error(uploadData.error || 'Falha no upload da imagem.');
        }
        // O backend (upload.js) retorna a URL (ex: /uploads/nome.jpg)
        finalImageUrl = uploadData.imageUrl; 
      }

      // 2. Criar o Produto
      const productData = {
        ...formData,
        imageUrl: finalImageUrl, // Adiciona a URL da imagem ao payload
      };

      const productResponse = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const data = await productResponse.json();
      if (!productResponse.ok) {
        throw new Error(data.error || 'Falha ao criar produto.');
      }
      
      setSuccessAdd('Produto adicionado com sucesso!');
      setFormData({ name: '', sku: '', slug: '', price: '', description: '', color: '', size: '', quantity: 0 });
      setImageFile(null);
      // Limpa o input de arquivo (necessário para re-adicionar o mesmo arquivo)
      e.target.querySelector('input[type="file"]').value = ""; 
      
    } catch (err) {
      setErrorAdd(err.message);
    } finally {
      setLoadingAdd(false);
    }
  };


  // --- Lógica de GERENCIAR ESTOQUE ---
  
  const fetchStock = async () => {
    setLoadingStock(true);
    setErrorStock(null);
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Falha ao buscar produtos.');
      
      const products = await response.json();
      const allStockItems = products.flatMap(product => 
        product.Stocks.map(stockItem => ({
          ...stockItem,
          productName: product.name,
        }))
      );
      setStockItems(allStockItems);
      setEditValues({});
    } catch (err) {
      setErrorStock(err.message);
    } finally {
      setLoadingStock(false);
    }
  };

  useEffect(() => {
    if (tab === 'stock') {
      fetchStock();
    }
  }, [tab]);

  const handleStockEditChange = (id, field, value) => {
    setEditValues(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSaveStock = async (id) => {
    const editedData = editValues[id];
    if (!editedData) return;

    try {
      const response = await fetch(`/api/stock/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Falha ao salvar.');
      }
      
      alert('Estoque salvo com sucesso!');
      fetchStock();

    } catch (err) {
      alert(`Erro ao salvar: ${err.message}`);
    }
  };

  const handleRemoveStock = async (id) => {
    if (!window.confirm("Atenção! Se este for o último item de estoque, o produto será removido do catálogo. Deseja continuar?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/stock/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
         throw new Error('Falha ao remover.');
      }
      
      alert('Item de estoque removido!');
      fetchStock();

    } catch (err) {
       alert(`Erro ao remover: ${err.message}`);
    }
  };


  // --- Renderização do Componente ---
  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <h2 className="text-3xl font-bold text-brand-secondary font-serif text-center mb-12">
        Painel do Administrador
      </h2>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        {/* Abas */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setTab('add')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                tab === 'add' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500'
              }`}
            >
              Adicionar Produto
            </button>
            <button
              onClick={() => setTab('stock')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                tab === 'stock' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500'
              }`}
            >
              Gerenciar Estoque
            </button>
          </nav>
        </div>

        {/* --- ABA ADICIONAR PRODUTO --- */}
        {tab === 'add' && (
          <form onSubmit={handleAddProduct} className="space-y-6 max-w-lg mx-auto">
            <h3 className="text-xl font-medium text-brand-secondary font-serif">Novo Produto</h3>
            
            {errorAdd && <div className="rounded-md bg-red-50 p-4"><p className="text-sm text-red-800">{errorAdd}</p></div>}
            {successAdd && <div className="rounded-md bg-green-50 p-4"><p className="text-sm text-green-800">{successAdd}</p></div>}
            
            <Input name="name" placeholder="Nome do Produto" required value={formData.name} onChange={handleFormChange} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="sku" placeholder="SKU (Código)" required value={formData.sku} onChange={handleFormChange} />
              <Input name="slug" placeholder="Slug (ex: vestido-floral)" required value={formData.slug} onChange={handleFormChange} />
            </div>
            <Input name="price" type="number" step="0.01" placeholder="Preço (ex: 149.90)" required value={formData.price} onChange={handleFormChange} />
            <textarea
              name="description" placeholder="Descrição" value={formData.description} onChange={handleFormChange}
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-3"
              rows="4"
            ></textarea>

            <hr className="my-6" />
            <h3 className="text-xl font-medium text-brand-secondary font-serif">Variação Inicial (Estoque)</h3>
            
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">Imagem do Produto</label>
              <input
                type="file"
                name="productImage"
                onChange={handleFileChange}
                accept="image/png, image/jpeg"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:bg-brand-primary file:text-white
                  hover:file:bg-brand-primary-dark"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="color" placeholder="Cor (ex: Azul Marinho)" value={formData.color} onChange={handleFormChange} />
              <Input name="size" placeholder="Tamanho (ex: M)" value={formData.size} onChange={handleFormChange} />
            </div>
            <Input name="quantity" type="number" placeholder="Quantidade em Estoque" required value={formData.quantity} onChange={handleFormChange} />
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={loadingAdd}
                className="rounded-md border border-transparent bg-brand-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-primary-dark disabled:opacity-75"
              >
                {loadingAdd ? 'Adicionando...' : 'Adicionar Produto'}
              </button>
            </div>
          </form>
        )}
        
        {/* --- ABA GERENCIAR ESTOQUE --- */}
        {tab === 'stock' && (
          <div>
            <h3 className="text-xl font-medium text-brand-secondary font-serif mb-4">Estoque Atual</h3>
            {loadingStock && <p>Buscando estoque...</p>}
            {errorStock && <div className="rounded-md bg-red-50 p-4"><p className="text-sm text-red-800"><strong>Erro:</strong> {errorStock}</p></div>}
            
            {!loadingStock && !errorStock && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {/* COLUNA DE IMAGEM ADICIONADA */}
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagem</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cor</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tamanho</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qtd.</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stockItems.length > 0 ? (
                      stockItems.map(item => (
                        <tr key={item.id}>
                          {/* DADO DA IMAGEM ADICIONADO */}
                          <td className="px-4 py-4">
                            <img 
                              src={item.imageUrl || `https://placehold.co/60x60/FFE2C8/7C4A2D?text=Sem+Img`} 
                              alt={item.productName}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">{item.productName}</td>
                          <td className="px-4 py-4 text-sm">
                            <input
                              type="text"
                              value={editValues[item.id]?.color ?? item.color}
                              onChange={(e) => handleStockEditChange(item.id, 'color', e.target.value)}
                              className="w-28 border border-gray-300 rounded-md p-1"
                            />
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <input
                              type="text"
                              value={editValues[item.id]?.size ?? item.size}
                              onChange={(e) => handleStockEditChange(item.id, 'size', e.target.value)}
                              className="w-20 border border-gray-300 rounded-md p-1"
                            />
                          </td>
                          <td className="px-4 py-4 text-sm">
                             <input
                              type="number"
                              value={editValues[item.id]?.quantity ?? item.quantity}
                              onChange={(e) => handleStockEditChange(item.id, 'quantity', e.target.value)}
                              className="w-20 border border-gray-300 rounded-md p-1"
                            />
                          </td>
                          <td className="px-4 py-4 text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleSaveStock(item.id)}
                              disabled={!editValues[item.id]}
                              className="text-green-600 hover:text-green-900 disabled:opacity-30"
                            >
                              Salvar
                            </button>
                            <button
                              onClick={() => handleRemoveStock(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Remover
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">Nenhum item em estoque encontrado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}