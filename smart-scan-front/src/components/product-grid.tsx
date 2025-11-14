import { type Product } from '../lib/utils';
import { ProductCard } from './product-card';

interface ProductGridProps {
  products: Product[];
  onViewDetails: (product: Product) => void;
}

export const ProductGrid = ({ products, onViewDetails }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4">
        <svg
          className="w-20 h-20 sm:w-24 sm:h-24 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
          Nenhum produto encontrado
        </h3>
        <p className="text-sm sm:text-base text-gray-500 text-center max-w-md">
          Não encontramos produtos que correspondam à sua busca. Tente usar palavras-chave diferentes.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
};
