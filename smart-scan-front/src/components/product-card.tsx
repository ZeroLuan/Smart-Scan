import { type Product, formatPrice, renderStars } from '../lib/utils';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  return (
    <div className="card overflow-hidden group">
      {/* Imagem do produto */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://placehold.co/300x300/3B82F6/ffffff?text=${encodeURIComponent(product.category)}`;
          }}
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
          {product.category}
        </div>
      </div>

      {/* Conteúdo do card */}
      <div className="p-4 sm:p-5">
        <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm" aria-label={`${product.rating} estrelas`}>
            {renderStars(product.rating)}
          </span>
          <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
        </div>

        {/* Preço */}
        <div className="mb-4">
          <p className="text-2xl sm:text-3xl font-bold text-primary">
            {formatPrice(product.price)}
          </p>
        </div>

        {/* Botão de detalhes */}
        <button
          onClick={() => onViewDetails(product)}
          className={cn(
            "w-full btn-secondary",
            "text-sm sm:text-base font-medium",
            "hover:bg-primary hover:text-white"
          )}
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  );
};
