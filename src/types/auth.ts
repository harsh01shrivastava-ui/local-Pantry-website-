export type UserRole = 'customer' | 'owner';

export interface UserProfile {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
  phone?: string;
  address?: string;
  city?: string;
}

export interface OrderItemRecord {
  productId: string;
  productName: string;
  quantity: number;
  jarSize: 'Standard' | 'Grand (Double)';
  unitPrice: number;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Cancelled';

export interface CustomerOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  pincode: string;
  date: string;
  items: OrderItemRecord[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'UPI' | 'COD' | 'Card';
  status: OrderStatus;
  notes?: string;
}
