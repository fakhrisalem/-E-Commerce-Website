export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  colors: ProductColor[];
  sizes: string[];
  shortDescription: string;
  longDescription: string;
  images: string[];
  stock: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  tags: string[];
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  color: string;
  size: string;
  product: Product;
}

export interface WishlistItem {
  productId: string;
  product: Product;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export type SortOption = 'newest' | 'price-low' | 'price-high' | 'rating' | 'popular';
export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'en' | 'ar';
