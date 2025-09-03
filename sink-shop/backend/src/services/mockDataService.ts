import { Product, User, CartItem, Order } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

// Mock Products Data - Using local images with consistent pricing
export const mockProducts: Product[] = [
  // Fossil Sinks
  {
    id: '1',
    title: {
      en: 'Classic Fossil Stone Sink',
      bg: 'Класическа фосилна каменна мивка'
    },
    description: {
      en: 'Premium fossil stone sink with natural textures and ancient marine patterns. Perfect for modern bathrooms.',
      bg: 'Премиум фосилна каменна мивка с естествени текстури и древни морски мотиви. Перфектна за модерни бани.'
    },
    tag: 'Premium',
    category: 'fossil',
    salesCount: 45,
    image: '/assets/fosil-sink-images/d1.jpg',
    date: '2024-01-15',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: {
      en: 'Elegant Fossil Basin',
      bg: 'Елегантна фосилна мивка'
    },
    description: {
      en: 'Sophisticated fossil stone basin featuring intricate natural patterns and smooth finish.',
      bg: 'Изискана фосилна каменна мивка с интригуващи естествени модели и гладка повърхност.'
    },
    tag: 'Elegant',
    category: 'fossil',
    salesCount: 32,
    image: '/assets/fosil-sink-images/d2.jpg',
    date: '2024-01-18',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    title: {
      en: 'Luxury Fossil Stone Vessel',
      bg: 'Луксозна фосилна каменна мивка'
    },
    description: {
      en: 'Exclusive fossil stone vessel sink with unique geological formations and premium craftsmanship.',
      bg: 'Ексклузивна фосилна каменна мивка с уникални геологически образувания и премиум изработка.'
    },
    tag: 'Luxury',
    category: 'fossil',
    salesCount: 28,
    image: '/assets/fosil-sink-images/d3.jpg',
    date: '2024-01-22',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: '4',
    title: {
      en: 'Artisan Fossil Collection',
      bg: 'Артистична фосилна колекция'
    },
    description: {
      en: 'Handcrafted fossil sink showcasing millions of years of natural history in every detail.',
      bg: 'Ръчно изработена фосилна мивка, показваща милиони години естествена история във всеки детайл.'
    },
    tag: 'Artisan',
    category: 'fossil',
    salesCount: 41,
    image: '/assets/fosil-sink-images/d4.jpg',
    date: '2024-01-25',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: '5',
    title: {
      en: 'Premium Fossil Washbasin',
      bg: 'Премиум фосилна мивка за измиване'
    },
    description: {
      en: 'Distinguished fossil stone washbasin with exceptional durability and timeless beauty.',
      bg: 'Отличаваща се фосилна каменна мивка с изключителна издръжливост и вечна красота.'
    },
    tag: 'Premium',
    category: 'fossil',
    salesCount: 37,
    image: '/assets/fosil-sink-images/d5.jpg',
    date: '2024-01-28',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28')
  },
  
  // River Stone Sinks
  {
    id: '6',
    title: {
      en: 'Natural River Stone Basin',
      bg: 'Естествена речна каменна мивка'
    },
    description: {
      en: 'Authentic river stone sink with smooth water-polished surface and organic shape.',
      bg: 'Автентична речна каменна мивка с гладка, полирана от водата повърхност и органична форма.'
    },
    tag: 'Natural',
    category: 'riverStone',
    salesCount: 63,
    image: '/assets/river-stone-sink-images/100.jpg',
    date: '2024-02-01',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: '7',
    title: {
      en: 'Polished River Stone Vessel',
      bg: 'Полирана речна каменна мивка'
    },
    description: {
      en: 'Beautifully polished river stone vessel with natural color variations and smooth texture.',
      bg: 'Красиво полирана речна каменна мивка с естествени цветни вариации и гладка текстура.'
    },
    tag: 'Polished',
    category: 'riverStone',
    salesCount: 51,
    image: '/assets/river-stone-sink-images/101.jpg',
    date: '2024-02-05',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  },
  {
    id: '8',
    title: {
      en: 'Rustic River Stone Sink',
      bg: 'Рустик речна каменна мивка'
    },
    description: {
      en: 'Rustic river stone sink maintaining natural edges and authentic riverbed character.',
      bg: 'Рустична речна каменна мивка, запазваща естествените краища и автентичния характер на речното корито.'
    },
    tag: 'Rustic',
    category: 'riverStone',
    salesCount: 44,
    image: '/assets/river-stone-sink-images/102.jpg',
    date: '2024-02-08',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-02-08')
  },
  {
    id: '9',
    title: {
      en: 'Smooth River Stone Bowl',
      bg: 'Гладка речна каменна купа'
    },
    description: {
      en: 'Exceptionally smooth river stone bowl sink with perfect balance of form and function.',
      bg: 'Изключително гладка речна каменна купа с перфектен баланс между форма и функция.'
    },
    tag: 'Smooth',
    category: 'riverStone',
    salesCount: 56,
    image: '/assets/river-stone-sink-images/103.jpg',
    date: '2024-02-12',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-12')
  },
  {
    id: '10',
    title: {
      en: 'Designer River Stone Washbasin',
      bg: 'Дизайнерска речна каменна мивка'
    },
    description: {
      en: 'Contemporary designer river stone washbasin combining natural beauty with modern aesthetics.',
      bg: 'Съвременна дизайнерска речна каменна мивка, съчетаваща естествена красота с модерна естетика.'
    },
    tag: 'Designer',
    category: 'riverStone',
    salesCount: 39,
    image: '/assets/river-stone-sink-images/104.jpg',
    date: '2024-02-15',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  }
];

export const mockUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@sinkshop.com',
    password: '$2a$10$T.reGZvqEMOpZ7m49Tbb7.YC9pF14nPvIout.Gn8eHNmz5OknIPFS', // "admin123"
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const mockCartItems: CartItem[] = [];
export const mockOrders: Order[] = [];

// Mock Database Service
export class MockDataService {
  // Products
  static async getAllProducts(): Promise<Product[]> {
    return [...mockProducts];
  }

  static async getProductById(id: string): Promise<Product | null> {
    return mockProducts.find(p => p.id === id) || null;
  }

  static async getProductsByCategory(category: string): Promise<Product[]> {
    return mockProducts.filter(p => p.category === category);
  }

  static async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockProducts.push(newProduct);
    return newProduct;
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    mockProducts[index] = {
      ...mockProducts[index],
      ...updates,
      updatedAt: new Date()
    };
    return mockProducts[index];
  }

  static async deleteProduct(id: string): Promise<boolean> {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    mockProducts.splice(index, 1);
    return true;
  }

  // Users
  static async getUserByEmail(email: string): Promise<User | null> {
    return mockUsers.find(u => u.email === email) || null;
  }

  static async getUserById(id: string): Promise<User | null> {
    return mockUsers.find(u => u.id === id) || null;
  }

  static async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const newUser: User = {
      ...user,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockUsers.push(newUser);
    return newUser;
  }

  // Cart
  static async getCartItems(userId: string): Promise<CartItem[]> {
    return mockCartItems.filter(item => item.userId === userId);
  }

  static async addToCart(userId: string, productId: string, quantity: number): Promise<CartItem> {
    const existingItem = mockCartItems.find(item => 
      item.userId === userId && item.productId === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.updatedAt = new Date();
      return existingItem;
    }

    const newItem: CartItem = {
      id: uuidv4(),
      userId,
      productId,
      quantity,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockCartItems.push(newItem);
    return newItem;
  }

  static async updateCartItem(id: string, quantity: number): Promise<CartItem | null> {
    const item = mockCartItems.find(item => item.id === id);
    if (!item) return null;

    item.quantity = quantity;
    item.updatedAt = new Date();
    return item;
  }

  static async removeFromCart(id: string): Promise<boolean> {
    const index = mockCartItems.findIndex(item => item.id === id);
    if (index === -1) return false;

    mockCartItems.splice(index, 1);
    return true;
  }

  static async clearCart(userId: string): Promise<boolean> {
    const initialLength = mockCartItems.length;
    const filteredItems = mockCartItems.filter(item => item.userId !== userId);
    mockCartItems.length = 0;
    mockCartItems.push(...filteredItems);
    return mockCartItems.length < initialLength;
  }

  // Orders
  static async getOrdersByUser(userId: string): Promise<Order[]> {
    return mockOrders.filter(order => order.userId === userId);
  }

  static async getOrderById(id: string): Promise<Order | null> {
    return mockOrders.find(order => order.id === id) || null;
  }

  static async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const newOrder: Order = {
      ...order,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockOrders.push(newOrder);
    return newOrder;
  }
}
