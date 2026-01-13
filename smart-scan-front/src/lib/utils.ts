import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export interface Product {
  id: number | string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  specs: string[];
  stock_quantity?: number;
  supplier?: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Smartphone Pro Max",
    category: "Eletrônicos",
    price: 1299.99,
    rating: 4.8,
    image: "/modern-smartphone.png",
    description: "Smartphone de última geração com câmera profissional",
    specs: ["6.7\" display", "128GB storage", "5G", "Câmera 108MP"]
  },
  {
    id: 2,
    name: "Tablet Ultra",
    category: "Tablets",
    price: 899.99,
    rating: 4.5,
    image: "/modern-tablet-display.png",
    description: "Tablet 2-em-1 para produtividade e entretenimento",
    specs: ["11\" display", "256GB", "Stylus included", "8 horas bateria"]
  },
  {
    id: 3,
    name: "Fones Wireless Premium",
    category: "Áudio",
    price: 299.99,
    rating: 4.6,
    image: "/diverse-people-listening-headphones.png",
    description: "Fones com cancelamento de ruído ativo",
    specs: ["ANC", "40h bateria", "Bluetooth 5.3", "Som Hi-Fi"]
  },
  {
    id: 4,
    name: "Smartwatch Elite",
    category: "Wearables",
    price: 599.99,
    rating: 4.7,
    image: "/modern-smartwatch.png",
    description: "Relógio inteligente com monitoramento de saúde",
    specs: ["AMOLED", "GPS", "Waterproof", "Sensor cardíaco"]
  },
  {
    id: 5,
    name: "Laptop Gaming",
    category: "Computadores",
    price: 1899.99,
    rating: 4.9,
    image: "https://placehold.co/300x300/2563eb/ffffff?text=Laptop",
    description: "Laptop para gaming e produção de conteúdo",
    specs: ["RTX 4090", "32GB RAM", "1TB SSD", "240Hz display"]
  },
  {
    id: 6,
    name: "Câmera Mirrorless",
    category: "Fotografia",
    price: 2299.99,
    rating: 4.4,
    image: "https://placehold.co/300x300/2563eb/ffffff?text=Camera",
    description: "Câmera profissional para fotografia e vídeo",
    specs: ["45MP sensor", "8K vídeo", "ISO 50-102400", "Autofoco AI"]
  },
  {
    id: 7,
    name: "Monitor Ultrawide 4K",
    category: "Monitores",
    price: 799.99,
    rating: 4.6,
    image: "https://placehold.co/300x300/2563eb/ffffff?text=Monitor",
    description: "Monitor ultrawide para produtividade máxima",
    specs: ["34\" display", "4K UHD", "144Hz", "HDR400"]
  },
  {
    id: 8,
    name: "Teclado Mecânico RGB",
    category: "Periféricos",
    price: 199.99,
    rating: 4.5,
    image: "https://placehold.co/300x300/2563eb/ffffff?text=Keyboard",
    description: "Teclado mecânico com switches customizáveis",
    specs: ["Switches Cherry MX", "RGB per-key", "USB-C", "Hot-swappable"]
  }
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

export const renderStars = (rating: number): string => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let stars = '⭐'.repeat(fullStars);
  if (hasHalfStar) stars += '✨';
  return stars;
};
