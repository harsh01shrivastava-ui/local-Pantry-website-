export type CategoryId = 'all' | 'chili' | 'pesto' | 'sauces' | 'heritage';

export interface Product {
  id: string;
  name: string;
  category: 'chili' | 'pesto' | 'sauces' | 'heritage';
  subtitle: string;
  weight: string;
  price: number;
  rating: number;
  reviewCount: number;
  tag?: string;
  tagType?: 'bestseller' | 'fresh' | 'heritage' | 'essential' | 'new' | 'weekend';
  description: string;
  longDescription: string;
  imageUrl: string;
  altText: string;
  ingredients: string[];
  pairingSuggestions: string[];
  shelfLife: string;
  heatLevel: 'None' | 'Mild' | 'Medium' | 'Hot';
  dietary: string[];
  isPreOrder?: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  condimentTag: string;
  prepTime: string;
  servings: string;
  description: string;
  imageUrl: string;
  altText: string;
  ingredients: string[];
  steps: string[];
  chefTip: string;
  featuredProductId: string;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  role: string;
  initials: string;
  comment: string;
  rating: number;
  productMentioned?: string;
}

export interface Stockist {
  id: string;
  name: string;
  city: string;
  type: 'Artisan Market' | 'Gourmet Store' | 'Farm Shop' | 'Heritage Stall';
  address: string;
  schedule: string;
  hours: string;
  nextDate: string;
  stallNumber?: string;
  contact: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  jarSize: 'Standard' | 'Grand (Double)';
}
