import { Timestamp } from 'firebase/firestore';

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  brand: string;
}

export interface UserProfile {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  address?: string;
  city?: string;
  postal_code?: string;
  role: 'user' | 'admin';
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: Product; // Populated client-side
}

export interface Order {
  id: string;
  user_id: string;
  order_date: Timestamp;
  total_amount: number;
  payment_method: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
}

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  single_price: number;
  product?: Product; // Populated client-side
}
