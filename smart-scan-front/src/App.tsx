import { useState, useEffect } from 'react';
import { MOCK_PRODUCTS, type Product } from './lib/utils';
import { ProductSearch } from './components/product-search';
import { ProductGrid } from './components/product-grid';
import { ProductModal } from './components/product-modal';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filtrar produtos por nome e categoria em tempo real
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(MOCK_PRODUCTS);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = MOCK_PRODUCTS.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm]);

  // Handler para busca por nome
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  // Handler para upload de imagem
  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    
    // Simular chamada ao backend
    console.log('📸 Imagem enviada para processamento:', {
      name: file.name,
      size: file.size,
      type: file.type,
      timestamp: new Date().toISOString()
    });

    // Simular delay de processamento (200-300ms)
    await new Promise(resolve => setTimeout(resolve, 250));

    // Simular resposta do backend retornando produtos similares
    // Em produção, isso seria substituído pela resposta real da API
    const simulatedResults = MOCK_PRODUCTS.filter(p => 
      Math.random() > 0.3 // Simulação: 70% de chance de match
    ).slice(0, 4); // Retornar até 4 produtos

    console.log('✅ Produtos similares encontrados:', simulatedResults.map(p => p.name));

    // Limpar busca por texto e mostrar resultados da imagem
    setSearchTerm('');
    setFilteredProducts(simulatedResults);
    setIsLoading(false);
  };

  // Handler para abrir modal de detalhes
  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Handler para fechar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300); // Delay para animação
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com título */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                SmartScan
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Busque produtos por nome ou foto
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Barra de pesquisa */}
      <ProductSearch
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onImageUpload={handleImageUpload}
        isLoading={isLoading}
      />

      {/* Grid de produtos */}
      <main>
        <ProductGrid
          products={filteredProducts}
          onViewDetails={handleViewDetails}
        />
      </main>

      {/* Modal de detalhes */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              © 2025 SmartScan. Todos os direitos reservados.
            </p>
            <p className="text-xs text-gray-500">
              Desenvolvido com React + TypeScript + Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
