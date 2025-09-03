import { Product, User, CartItem, Order } from '../types/index.js';
import { v4 as uuidv4 } from 'uuid';

// Mock Products Data - New structure with all materials
export const mockProducts: Product[] = [
  // River Stone Sinks
  {
    id: '1',
    model: {
      en: 'Type 1.1',
      bg: 'Вид 1.1'
    },
    title: {
      en: 'River Stone Irregular Sink',
      bg: 'Речна каменна неправилна мивка'
    },
    description: {
      en: 'Irregular Shape',
      bg: 'Неправилна форма'
    },
    material: {
      en: 'River Stone',
      bg: 'Речен камък'
    },
    color: {
      en: 'Dark Grey/Grey',
      bg: 'Тъмно сиво/Сиво'
    },
    dimensions: 'L: 40-60, W: 31-50, H: 15',
    weight: '18-30 kg',
    mounting: {
      en: 'Top mount',
      bg: 'Горен монтаж'
    },
    manufacture: {
      en: 'hand-made',
      bg: 'ръчен труд'
    },
    tag: 'Natural',
    category: 'riverStone',
    salesCount: 28,
    image: '/assets/river-stone-sink-images/101.jpg',
    date: '2024-01-15',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  // Type 1.2 - River Stone
  {
    id: '2',
    model: {
      en: 'Type 1.2',
      bg: 'Вид 1.2'
    },
    title: {
      en: 'River Stone Irregular Sink',
      bg: 'Речна каменна неправилна мивка'
    },
    description: {
      en: 'Irregular Shape',
      bg: 'Неправилна форма'
    },
    material: {
      en: 'River Stone',
      bg: 'Речен камък'
    },
    color: {
      en: 'Dark Grey/Grey',
      bg: 'Тъмно сиво/Сиво'
    },
    dimensions: 'L: 40-60, W: 31-50, H: 15',
    weight: '18-30 kg',
    mounting: {
      en: 'Top mount',
      bg: 'Горен монтаж'
    },
    manufacture: {
      en: 'hand-made',
      bg: 'ръчен труд'
    },
    tag: 'Natural',
    category: 'riverStone',
    salesCount: 31,
    image: '/assets/river-stone-sink-images/100.jpg',
    date: '2024-01-18',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  // Type 1.3 - River Stone
  {
    id: '3',
    model: {
      en: 'Type 1.3',
      bg: 'Вид 1.3'
    },
    title: {
      en: 'Polished River Stone Sink',
      bg: 'Полирана речна каменна мивка'
    },
    description: {
      en: 'Polished, Irregular Shape',
      bg: 'Полиран, Неправилна форма'
    },
    material: {
      en: 'River Stone',
      bg: 'Речен камък'
    },
    color: {
      en: 'Dark Grey/Grey',
      bg: 'Тъмно сиво/Сиво'
    },
    dimensions: 'L: 40-60, W: 31-50, H: 15',
    weight: '18-30 kg',
    mounting: {
      en: 'Top mount',
      bg: 'Горен монтаж'
    },
    manufacture: {
      en: 'hand-made',
      bg: 'ръчен труд'
    },
    tag: 'Polished',
    category: 'riverStone',
    salesCount: 27,
    image: '/assets/river-stone-sink-images/104.jpg',
    date: '2024-01-22',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  },
  // Type 2.1 - Marble
  {
    id: '4',
    model: {
      en: 'Type 2.1',
      bg: 'Вид 2.1'
    },
    title: {
      en: 'Marble Oval Sink',
      bg: 'Мраморна овална мивка'
    },
    description: {
      en: 'Oval, Rough',
      bg: 'Овална, необработена'
    },
    material: {
      en: 'Marble',
      bg: 'Мрамор'
    },
    color: {
      en: 'Black, Grey',
      bg: 'Черен, Сив'
    },
    dimensions: '50 x 36, H: 15',
    weight: '25 kg',
    mounting: {
      en: 'Top mount',
      bg: 'Горен монтаж'
    },
    manufacture: {
      en: 'hand-made',
      bg: 'ръчен труд'
    },
    tag: 'Rough',
    category: 'marble',
    salesCount: 35,
    image: '',
    date: '2024-01-25',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  // Type 3.1 - Marble
  {
    id: '5',
    model: {
      en: 'Type 3.1',
      bg: 'Вид 3.1'
    },
    title: {
      en: 'Marble Square Sink',
      bg: 'Мраморна квадратна мивка'
    },
    description: {
      en: 'Squared',
      bg: 'Квадратна'
    },
    material: {
      en: 'Marble',
      bg: 'Мрамор'
    },
    color: {
      en: 'Cream-Light Beige',
      bg: 'Крем-Светло бежово'
    },
    dimensions: '50 x 50, H: 17',
    weight: '27 kg',
    mounting: {
      en: 'Top mount',
      bg: 'Горен монтаж'
    },
    manufacture: {
      en: 'hand-made',
      bg: 'ръчен труд'
    },
    tag: 'Square',
    category: 'marble',
    salesCount: 42,
    image: '',
    date: '2024-01-28',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28')
  },
  // Type 4.1 - Marble  
  {
    id: '6',
    model: {
      en: 'Type 4.1',
      bg: 'Вид 4.1'
    },
    title: {
      en: 'Marble Rectangular Sink',
      bg: 'Мраморна правоъгълна мивка'
    },
    description: {
      en: 'Rectangular',
      bg: 'Правоъгълна'
    },
    material: {
      en: 'Marble',
      bg: 'Мрамор'
    },
    color: {
      en: 'Cream-Light Beige',
      bg: 'Крем-Светло бежово'
    },
    dimensions: '50 x 40, H: 17',
    weight: '33 kg',
    mounting: {
      en: 'Top mount',
      bg: 'Горен монтаж'
    },
    manufacture: {
      en: 'hand-made',
      bg: 'ръчен труд'
    },
    tag: 'Rectangular',
    category: 'marble',
    salesCount: 29,
    image: '',
    date: '2024-02-01',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  // Type 4.2 - Marble
  {
    id: '7',
    model: {
      en: 'Type 4.2',
      bg: 'Вид 4.2'
    },
    title: {
      en: 'Marble Rectangular Sink Dark',
      bg: 'Мраморна правоъгълна мивка тъмна'
    },
    description: {
      en: 'Rectangular',
      bg: 'Правоъгълна'
    },
    material: {
      en: 'Marble',
      bg: 'Мрамор'
    },
    color: {
      en: 'Black, Grey',
      bg: 'Черен, Сив'
    },
    dimensions: '50 x 40, H: 12',
    weight: '33 kg',
    mounting: {
      en: 'Top mount',
      bg: 'Горен монтаж'
    },
    manufacture: {
      en: 'hand-made',
      bg: 'ръчен труд'
    },
    tag: 'Rectangular',
    category: 'marble',
    salesCount: 38,
    image: '',
    date: '2024-02-05',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  },
  // Type 5.1 - Marble
  {
    id: '8',
    model: {
      en: 'Type 5.1',
      bg: 'Вид 5.1'
    },
    title: {
      en: 'Marble Oval Sink Light',
      bg: 'Мраморна овална мивка светла'
    },
    description: {
      en: 'Oval, Rough',
      bg: 'Овална, необработена'
    },
    material: {
      en: 'Marble',
      bg: 'Мрамор'
    },
    color: {
      en: 'Cream-Light Beige',
      bg: 'Крем-Светло бежово'
    },
    dimensions: '50 x 40, H: 15',
    weight: '32 kg',
    mounting: {
      en: 'Top mount',
      bg: 'Горен монтаж'
    },
    manufacture: {
      en: 'hand-made',
      bg: 'ръчен труд'
    },
    tag: 'Oval',
    category: 'marble',
    salesCount: 44,
    image: '',
    date: '2024-02-08',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-02-08')
  },
  // Type 6 - Marble Tower
  {
    id: '9',
    model: {
      en: 'Type 6',
      bg: 'Вид 6'
    },
    title: {
      en: 'Marble Tower Sink',
      bg: 'Мраморна кула мивка'
    },
    description: {
      en: 'Tower sink, polished top',
      bg: 'Кула, полиран горен сегмент'
    },
    material: {
      en: 'Marble',
      bg: 'Мрамор'
    },
    color: {
      en: 'Black/Grey',
      bg: 'Черно/Сиво'
    },
    dimensions: 'Ø: 40, H: 90',
    weight: '68 kg',
    mounting: {
      en: 'Floor mount',
      bg: 'Подов монтаж'
    },
    manufacture: {
      en: 'hand-made',
      bg: 'ръчен труд'
    },
    tag: 'Tower',
    category: 'marble',
    salesCount: 15,
    image: '',
    date: '2024-02-12',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-12')
  },
  // Type 7.1 - Onyx
  {
    id: '10',
    model: {
      en: 'Type 7.1',
      bg: 'Вид 7.1'
    },
    title: {
      en: 'Onyx Bowl Sink',
      bg: 'Ониксова купа мивка'
    },
    description: {
      en: 'Thickbowl, Natural',
      bg: 'Купа'
    },
    material: {
      en: 'Onyx',
      bg: 'Оникс'
    },
    color: {
      en: 'Ochre',
      bg: 'Охра'
    },
    dimensions: 'Ø: 40, H: 15',
    weight: '17 kg',
    mounting: {
      en: 'Top mount',
      bg: 'Горен монтаж'
    },
    manufacture: {
      en: 'hand-made',
      bg: 'ръчен труд'
    },
    tag: 'Bowl',
    category: 'onyx',
    salesCount: 21,
    image: '',
    date: '2024-02-15',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  },
  // Type 7.2 - Onyx
  {
    id: '11',
    model: {
      en: 'Type 7.2',
      bg: 'Вид 7.2'
    },
    title: {
      en: 'Onyx Oval Sink',
      bg: 'Ониксова овална мивка'
    },
    description: {
      en: 'Oval, Rough',
      bg: 'Овална, необработена'
    },
    material: {
      en: 'Onyx',
      bg: 'Оникс'
    },
    color: {
      en: 'Ochre',
      bg: 'Охра'
    },
    dimensions: '40 x 25, H: 12',
    weight: '12 kg',
    mounting: {
      en: 'Top mount',
      bg: 'Горен монтаж'
    },
    manufacture: {
      en: 'hand-made',
      bg: 'ръчен труд'
    },
    tag: 'Oval',
    category: 'onyx',
    salesCount: 18,
    image: '',
    date: '2024-02-18',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-02-18'),
    updatedAt: new Date('2024-02-18')
  },
  // Type 8 - Fossil
  {
    id: '12',
    model: {
      en: 'Type 8',
      bg: 'Вид 8'
    },
    title: {
      en: 'Fossil Petrified Wood Sink',
      bg: 'Фосилна вкаменена дърва мивка'
    },
    description: {
      en: 'Petrified Wood',
      bg: 'Вкаменено дърво'
    },
    material: {
      en: 'Fossil',
      bg: 'Фосил'
    },
    color: {
      en: 'Black/Grey',
      bg: 'Черно/Сиво'
    },
    dimensions: '42-64 x 33-47, H: 15',
    weight: '22 kg',
    mounting: {
      en: 'Top mount',
      bg: 'Горен монтаж'
    },
    manufacture: {
      en: 'hand-made',
      bg: 'ръчен труд'
    },
    tag: 'Fossil',
    category: 'fossil',
    salesCount: 33,
    image: '/assets/fosil-sink-images/d1.jpg',
    date: '2024-02-22',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-02-22'),
    updatedAt: new Date('2024-02-22')
  },
  // Type 9.1 - Marble
  {
    id: '13',
    model: {
      en: 'Type 9.1',
      bg: 'Вид 9.1'
    },
    title: {
      en: 'Marble Flush Mount Sink',
      bg: 'Мраморна вградена мивка'
    },
    description: {
      en: 'Rectangular',
      bg: 'Правоъгълна'
    },
    material: {
      en: 'Marble',
      bg: 'Мрамор'
    },
    color: {
      en: 'Grey',
      bg: 'Сив'
    },
    dimensions: '50 x 40, H: 16',
    weight: '27 kg',
    mounting: {
      en: 'Flush mount',
      bg: 'Вграден монтаж'
    },
    manufacture: {
      en: 'hand-made',
      bg: 'ръчен труд'
    },
    tag: 'Flush',
    category: 'marble',
    salesCount: 26,
    image: '',
    date: '2024-02-25',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-02-25'),
    updatedAt: new Date('2024-02-25')
  },
  // Type 10.1 - Marble
  {
    id: '14',
    model: {
      en: 'Type 10.1',
      bg: 'Вид 10.1'
    },
    title: {
      en: 'Marble Donut Sink',
      bg: 'Мраморна поничка мивка'
    },
    description: {
      en: 'Polished, Donut',
      bg: 'Полирана, Поничка'
    },
    material: {
      en: 'Marble',
      bg: 'Мрамор'
    },
    color: {
      en: 'Black',
      bg: 'Черен'
    },
    dimensions: 'Ø: 44, H: 15',
    weight: '20 kg',
    mounting: {
      en: 'Top mount',
      bg: 'Горен монтаж'
    },
    manufacture: {
      en: 'hand-made',
      bg: 'ръчен труд'
    },
    tag: 'Donut',
    category: 'marble',
    salesCount: 19,
    image: '',
    date: '2024-02-28',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-02-28'),
    updatedAt: new Date('2024-02-28')
  },
  // Type 11.1 - Marble
  {
    id: '15',
    model: {
      en: 'Type 11.1',
      bg: 'Вид 11.1'
    },
    title: {
      en: 'Marble Bowl Black',
      bg: 'Мраморна купа черна'
    },
    description: {
      en: 'Bowl, Polished',
      bg: 'Купа Полирана'
    },
    material: {
      en: 'Marble',
      bg: 'Мрамор'
    },
    color: {
      en: 'Black',
      bg: 'Черен'
    },
    dimensions: 'Ø: 40, H: 15',
    weight: '17 kg',
    mounting: {
      en: 'Top mount',
      bg: 'Горен монтаж'
    },
    manufacture: {
      en: 'hand-made',
      bg: 'ръчен труд'
    },
    tag: 'Bowl',
    category: 'marble',
    salesCount: 24,
    image: '',
    date: '2024-03-02',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-03-02'),
    updatedAt: new Date('2024-03-02')
  },
  // Type 11.2 - Marble
  {
    id: '16',
    model: {
      en: 'Type 11.2',
      bg: 'Вид 11.2'
    },
    title: {
      en: 'Marble Bowl Cream',
      bg: 'Мраморна купа крем'
    },
    description: {
      en: 'Bowl, Polished',
      bg: 'Купа Полирана'
    },
    material: {
      en: 'Marble',
      bg: 'Мрамор'
    },
    color: {
      en: 'Cream',
      bg: 'Крем'
    },
    dimensions: 'Ø: 40, H: 15',
    weight: '17 kg',
    mounting: {
      en: 'Top mount',
      bg: 'Горен монтаж'
    },
    manufacture: {
      en: 'hand-made',
      bg: 'ръчен труд'
    },
    tag: 'Bowl',
    category: 'marble',
    salesCount: 22,
    image: '',
    date: '2024-03-05',
    priceEur: 750,
    priceBgn: 1465,
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05')
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
