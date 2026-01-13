export interface Product {
  id: string;
  name: string;
  category: 'iphone' | 'ipad' | 'mac';
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  specs: { label: string; value: string }[];
  colors: { name: string; hex: string }[];
  storage: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
}

export const products: Product[] = [
  {
    id: 'iphone-15-pro-max',
    name: 'iPhone 15 Pro Max',
    category: 'iphone',
    price: 34990000,
    originalPrice: 36990000,
    image:
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=60',
    ],
    description: 'iPhone 15 Pro Max với chip A17 Pro, camera 48MP và khung Titanium cao cấp.',
    specs: [
      { label: 'Màn hình', value: '6.7" Super Retina XDR' },
      { label: 'Chip', value: 'A17 Pro' },
      { label: 'Camera', value: '48MP + 12MP + 12MP' },
      { label: 'Pin', value: '4422 mAh' },
    ],
    colors: [
      { name: 'Titan Tự nhiên', hex: '#8F8A81' },
      { name: 'Titan Xanh', hex: '#394C5A' },
      { name: 'Titan Trắng', hex: '#F0F0EB' },
      { name: 'Titan Đen', hex: '#3C3C3D' },
    ],
    storage: ['256GB', '512GB', '1TB'],
    rating: 4.9,
    reviews: 2847,
    inStock: true,
    isNew: true,
    isFeatured: true,
  },
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    category: 'iphone',
    price: 28990000,
    originalPrice: 30990000,
    image:
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=60',
    ],
    description: 'iPhone 15 Pro với thiết kế Titanium siêu nhẹ và chip A17 Pro mạnh mẽ.',
    specs: [
      { label: 'Màn hình', value: '6.1" Super Retina XDR' },
      { label: 'Chip', value: 'A17 Pro' },
      { label: 'Camera', value: '48MP + 12MP + 12MP' },
      { label: 'Pin', value: '3274 mAh' },
    ],
    colors: [
      { name: 'Titan Tự nhiên', hex: '#8F8A81' },
      { name: 'Titan Xanh', hex: '#394C5A' },
      { name: 'Titan Trắng', hex: '#F0F0EB' },
      { name: 'Titan Đen', hex: '#3C3C3D' },
    ],
    storage: ['128GB', '256GB', '512GB', '1TB'],
    rating: 4.8,
    reviews: 1923,
    inStock: true,
    isNew: true,
  },
  {
    id: 'iphone-15',
    name: 'iPhone 15',
    category: 'iphone',
    price: 22990000,
    image:
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=60',
    ],
    description: 'iPhone 15 với Dynamic Island, camera 48MP và cổng USB-C tiện lợi.',
    specs: [
      { label: 'Màn hình', value: '6.1" Super Retina XDR' },
      { label: 'Chip', value: 'A16 Bionic' },
      { label: 'Camera', value: '48MP + 12MP' },
      { label: 'Pin', value: '3349 mAh' },
    ],
    colors: [
      { name: 'Hồng', hex: '#FADDD4' },
      { name: 'Vàng', hex: '#F9E5C9' },
      { name: 'Xanh lá', hex: '#CAD4C5' },
      { name: 'Xanh dương', hex: '#D4E4ED' },
      { name: 'Đen', hex: '#3C3C3D' },
    ],
    storage: ['128GB', '256GB', '512GB'],
    rating: 4.7,
    reviews: 3421,
    inStock: true,
  },
  {
    id: 'ipad-pro-m4',
    name: 'iPad Pro M4',
    category: 'ipad',
    price: 28990000,
    originalPrice: 31990000,
    image:
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=60',
    ],
    description: 'iPad Pro với chip M4 mới nhất, màn hình Ultra Retina XDR và Apple Pencil Pro.',
    specs: [
      { label: 'Màn hình', value: '11" Ultra Retina XDR' },
      { label: 'Chip', value: 'Apple M4' },
      { label: 'Camera', value: '12MP Wide + 10MP Ultra Wide' },
      { label: 'Face ID', value: 'Có' },
    ],
    colors: [
      { name: 'Bạc', hex: '#E3E4E5' },
      { name: 'Xám không gian', hex: '#1D1D1F' },
    ],
    storage: ['256GB', '512GB', '1TB', '2TB'],
    rating: 4.9,
    reviews: 1567,
    inStock: true,
    isNew: true,
    isFeatured: true,
  },
  {
    id: 'ipad-air-m2',
    name: 'iPad Air M2',
    category: 'ipad',
    price: 18990000,
    image:
      'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&auto=format&fit=crop&q=60',
    ],
    description: 'iPad Air với chip M2 mạnh mẽ, thiết kế siêu mỏng và màn hình Liquid Retina.',
    specs: [
      { label: 'Màn hình', value: '10.9" Liquid Retina' },
      { label: 'Chip', value: 'Apple M2' },
      { label: 'Camera', value: '12MP Wide' },
      { label: 'Touch ID', value: 'Có' },
    ],
    colors: [
      { name: 'Xám không gian', hex: '#1D1D1F' },
      { name: 'Ánh sao', hex: '#F0E4D3' },
      { name: 'Tím', hex: '#B9B8D1' },
      { name: 'Xanh dương', hex: '#88AECE' },
    ],
    storage: ['128GB', '256GB', '512GB', '1TB'],
    rating: 4.8,
    reviews: 2134,
    inStock: true,
  },
  {
    id: 'ipad-10',
    name: 'iPad (Gen 10)',
    category: 'ipad',
    price: 12990000,
    image:
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=60',
    ],
    description: 'iPad thế hệ mới với thiết kế tràn viền, chip A14 Bionic và USB-C.',
    specs: [
      { label: 'Màn hình', value: '10.9" Liquid Retina' },
      { label: 'Chip', value: 'A14 Bionic' },
      { label: 'Camera', value: '12MP Wide' },
      { label: 'Touch ID', value: 'Có' },
    ],
    colors: [
      { name: 'Bạc', hex: '#E3E4E5' },
      { name: 'Xanh dương', hex: '#6EB5FF' },
      { name: 'Hồng', hex: '#F9D1C7' },
      { name: 'Vàng', hex: '#F5E6A3' },
    ],
    storage: ['64GB', '256GB'],
    rating: 4.6,
    reviews: 1876,
    inStock: true,
  },
  {
    id: 'macbook-pro-16-m3-max',
    name: 'MacBook Pro 16" M3 Max',
    category: 'mac',
    price: 89990000,
    originalPrice: 95990000,
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60',
    ],
    description: 'MacBook Pro 16" với chip M3 Max cực mạnh, màn hình Liquid Retina XDR.',
    specs: [
      { label: 'Màn hình', value: '16.2" Liquid Retina XDR' },
      { label: 'Chip', value: 'Apple M3 Max' },
      { label: 'RAM', value: '36GB' },
      { label: 'Pin', value: 'Lên đến 22 giờ' },
    ],
    colors: [
      { name: 'Bạc', hex: '#E3E4E5' },
      { name: 'Xám không gian', hex: '#1D1D1F' },
    ],
    storage: ['512GB', '1TB', '2TB', '4TB'],
    rating: 4.9,
    reviews: 987,
    inStock: true,
    isNew: true,
    isFeatured: true,
  },
  {
    id: 'macbook-pro-14-m3-pro',
    name: 'MacBook Pro 14" M3 Pro',
    category: 'mac',
    price: 49990000,
    image:
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=60',
    ],
    description: 'MacBook Pro 14" với chip M3 Pro, hiệu năng chuyên nghiệp.',
    specs: [
      { label: 'Màn hình', value: '14.2" Liquid Retina XDR' },
      { label: 'Chip', value: 'Apple M3 Pro' },
      { label: 'RAM', value: '18GB' },
      { label: 'Pin', value: 'Lên đến 17 giờ' },
    ],
    colors: [
      { name: 'Bạc', hex: '#E3E4E5' },
      { name: 'Xám không gian', hex: '#1D1D1F' },
    ],
    storage: ['512GB', '1TB', '2TB'],
    rating: 4.8,
    reviews: 1234,
    inStock: true,
  },
  {
    id: 'macbook-air-m3',
    name: 'MacBook Air M3',
    category: 'mac',
    price: 27990000,
    image:
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=60',
    ],
    description: 'MacBook Air siêu mỏng với chip M3, thiết kế không quạt.',
    specs: [
      { label: 'Màn hình', value: '13.6" Liquid Retina' },
      { label: 'Chip', value: 'Apple M3' },
      { label: 'RAM', value: '8GB' },
      { label: 'Pin', value: 'Lên đến 18 giờ' },
    ],
    colors: [
      { name: 'Midnight', hex: '#2E3642' },
      { name: 'Starlight', hex: '#F0E4D3' },
      { name: 'Xám không gian', hex: '#1D1D1F' },
      { name: 'Bạc', hex: '#E3E4E5' },
    ],
    storage: ['256GB', '512GB', '1TB'],
    rating: 4.8,
    reviews: 2456,
    inStock: true,
    isFeatured: true,
  },
];

export const categories = [
  { id: 'all', name: 'Tất cả', icon: 'Grid3X3' },
  { id: 'iphone', name: 'iPhone', icon: 'Smartphone' },
  { id: 'ipad', name: 'iPad', icon: 'Tablet' },
  { id: 'mac', name: 'Mac', icon: 'Laptop' },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};
