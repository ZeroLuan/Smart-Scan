import { useEffect, useState } from 'react';
import { type Product, formatPrice, renderStars } from '../lib/utils';
import { cn } from '../lib/utils';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [showFeedback, setShowFeedback] = useState<string | null>(null);

  // Fechar modal com tecla ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleAddToCart = () => {
    setShowFeedback('cart');
    setTimeout(() => setShowFeedback(null), 2000);
  };

  const handleAddToFavorites = () => {
    setShowFeedback('favorite');
    setTimeout(() => setShowFeedback(null), 2000);
  };

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className={cn(
          "relative bg-white w-full max-h-[90vh] overflow-y-auto",
          "sm:max-w-2xl sm:rounded-lg sm:shadow-xl",
          "rounded-t-2xl sm:rounded-b-lg",
          "animate-slide-up sm:animate-fade-in"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com botão fechar */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate pr-4">
            Detalhes do Produto
          </h2>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fechar modal"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-4 sm:p-6">
          {/* Imagem */}
          <div className="relative aspect-square sm:aspect-video w-full overflow-hidden rounded-lg bg-gray-100 mb-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://placehold.co/600x600/3B82F6/ffffff?text=${encodeURIComponent(product.category)}`;
              }}
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-gray-700">
              {product.category}
            </div>
          </div>

          {/* Info principal */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h3>
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <span className="text-base" aria-label={`${product.rating} estrelas`}>
                  {renderStars(product.rating)}
                </span>
                <span className="text-sm text-gray-600">
                  {product.rating.toFixed(1)} / 5.0
                </span>
              </div>
            </div>

            {/* Preço */}
            <div className="py-4 border-y border-gray-200">
              <p className="text-4xl sm:text-5xl font-bold text-primary">
                {formatPrice(product.price)}
              </p>
              <p className="text-sm text-gray-500 mt-1">ou em até 12x sem juros</p>
            </div>

            {/* Descrição */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Descrição</h4>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Especificações */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Especificações</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.specs.map((spec, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg"
                  >
                    <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 btn-primary py-3 sm:py-4 text-base sm:text-lg font-semibold flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Adicionar ao Carrinho
            </button>
            <button
              onClick={handleAddToFavorites}
              className="btn-secondary py-3 sm:py-4 text-base sm:text-lg font-semibold flex items-center justify-center gap-2 sm:w-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="sm:inline">Favoritar</span>
            </button>
          </div>

          {/* Feedback visual */}
          {showFeedback && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800 animate-fade-in">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">
                {showFeedback === 'cart'
                  ? 'Produto adicionado ao carrinho!'
                  : 'Produto adicionado aos favoritos!'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
