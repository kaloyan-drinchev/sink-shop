export interface ProductTranslation {
  en: string;
  bg: string;
}

export interface Product {
  id: string;
  model: ProductTranslation; // Type 1.1, Type 2.1, etc.
  title: ProductTranslation;
  description: ProductTranslation;
  material: ProductTranslation; // River Stone, Marble, Onyx, Fossil
  color: ProductTranslation; // Dark Grey/Grey, Black, Cream, etc.
  dimensions: string; // L: 40-60, W: 31-50, H: 15 or Ø: 40, H: 90
  weight: string; // 18-30 kg or 25 kg
  mounting: ProductTranslation; // Top mount, Floor mount, Flush mount
  manufacture: ProductTranslation; // hand-made / ръчен труд
  tag: string;
  category: string; // riverStone, marble, onyx, fossil
  salesCount: number;
  image: string;
  date: string;
  priceEur: number;
  priceBgn: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalEur: number;
  totalBgn: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: Address;
  billingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceEur: number;
  priceBgn: number;
  createdAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
