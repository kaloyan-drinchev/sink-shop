import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product, ProductTranslation } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache for generated products
let cachedProducts: Product[] | null = null;

export class DynamicProductService {
  static async getAllProducts(): Promise<Product[]> {
    if (!cachedProducts) {
      cachedProducts = await this.generateProductsFromImages();
    }
    return cachedProducts;
  }

  static async getProductById(id: string): Promise<Product | null> {
    const products = await this.getAllProducts();
    return products.find(p => p.id === id) || null;
  }

  static async getProductsByCategory(category: string): Promise<Product[]> {
    const products = await this.getAllProducts();
    return products.filter(p => p.category === category);
  }

  private static async generateProductsFromImages(): Promise<Product[]> {
    try {
      // Get all images from public/assets/products
      const imagesDir = path.join(__dirname, '../../../public/assets/products');
      
      if (!fs.existsSync(imagesDir)) {
        console.log('Images directory not found, returning empty array');
        return [];
      }

      const imageFiles = fs.readdirSync(imagesDir)
        .filter(file => file.endsWith('.jpg'))
        .sort();

      console.log(`Generating products for ${imageFiles.length} images...`);

      const products: Product[] = [];
      let idCounter = 1;

      for (const file of imageFiles) {
        const serialNumber = path.basename(file, '.jpg');
        const { category, subcategory } = this.getCategoryAndSubcategoryFromSerial(serialNumber);
        const { priceEur, priceBgn } = this.getPriceBySubcategory(category, subcategory);

        if (category && subcategory) {
          products.push({
            id: (idCounter++).toString(),
            serialNumber: serialNumber,
            model: { en: `Type ${idCounter}`, bg: `Вид ${idCounter}` },
            title: { en: `${this.capitalize(category)} Sink ${serialNumber}`, bg: `${this.translateCategory(category, 'bg')} мивка ${serialNumber}` },
            description: { en: `Unique handcrafted ${this.getMaterial(category)} sink`, bg: `Уникална ръчно изработена ${this.translateMaterial(category, 'bg')} мивка` },
            material: { en: this.getMaterial(category), bg: this.translateMaterial(category, 'bg') },
            color: { en: "Natural Stone Color", bg: "Естествен цвят на камъка" },
            dimensions: "L: 40-60, W: 31-50, H: 15", // Placeholder
            weight: "18-30 kg", // Placeholder
            mounting: { en: "Top mount", bg: "Горен монтаж" },
            manufacture: { en: "hand-made", bg: "ръчен труд" },
            tag: { en: this.capitalize(subcategory), bg: this.translateSubcategory(subcategory, 'bg') },
            category: category,
            subcategory: subcategory,
            salesCount: Math.floor(Math.random() * 50) + 1,
            image: `/assets/products/${file}`,
            date: new Date().toISOString().split('T')[0],
            priceEur: priceEur,
            priceBgn: priceBgn,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
      return products;
    } catch (error) {
      console.error('Error generating products from images:', error);
      return [];
    }
  }

  private static getCategoryAndSubcategoryFromSerial(serial: string): { category: string | null; subcategory: string | null } {
    const prefix = serial[0].toLowerCase();
    switch (prefix) {
      case 'b': return { category: 'riverStone', subcategory: 'natural' };
      case 'c': return { category: 'riverStone', subcategory: 'polished' };
      case 'a': return { category: 'riverStone', subcategory: 'withTabHole' };
      case 'd': return { category: 'fossil', subcategory: 'natural' };
      case 'e': return { category: 'fossil', subcategory: 'withTabHole' };
      case 'f': return { category: 'fossil', subcategory: 'polished' };
      case 'g': return { category: 'marble', subcategory: 'natural' };
      case 'h': return { category: 'marble', subcategory: 'withTabHole' };
      case 'i': return { category: 'marble', subcategory: 'polished' };
      case 'j': return { category: 'onyx', subcategory: 'natural' };
      case 'k': return { category: 'onyx', subcategory: 'withTabHole' };
      case 'l': return { category: 'onyx', subcategory: 'polished' };
      default: return { category: null, subcategory: null };
    }
  }

  private static getPriceBySubcategory(category: string | null, subcategory: string | null): { priceEur: number; priceBgn: number } {
    if (category === 'riverStone') {
      switch (subcategory) {
        case 'natural': return { priceEur: 143, priceBgn: 280 };
        case 'withTabHole': return { priceEur: 153, priceBgn: 300 };
        case 'polished': return { priceEur: 194, priceBgn: 380 };
      }
    }
    // Default prices for other categories
    return { priceEur: 180, priceBgn: 350 };
  }

  private static getMaterial(category: string): string {
    switch (category) {
      case 'riverStone': return 'River Stone';
      case 'fossil': return 'Fossil Stone';
      case 'marble': return 'Marble';
      case 'onyx': return 'Onyx';
      default: return 'Stone';
    }
  }

  private static capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  private static translateCategory(category: string, lang: 'en' | 'bg'): string {
    const translations: Record<string, Record<string, string>> = {
      riverStone: { en: 'River Stone', bg: 'Речна каменна' },
      fossil: { en: 'Fossil', bg: 'Фосилна' },
      marble: { en: 'Marble', bg: 'Мраморна' },
      onyx: { en: 'Onyx', bg: 'Ониксова' },
    };
    return translations[category]?.[lang] || category;
  }

  private static translateMaterial(category: string, lang: 'en' | 'bg'): string {
    const translations: Record<string, Record<string, string>> = {
      riverStone: { en: 'river stone', bg: 'речен камък' },
      fossil: { en: 'fossil stone', bg: 'фосилен камък' },
      marble: { en: 'marble', bg: 'мрамор' },
      onyx: { en: 'onyx', bg: 'оникс' },
    };
    return translations[category]?.[lang] || category;
  }

  private static translateSubcategory(subcategory: string, lang: 'en' | 'bg'): string {
    const translations: Record<string, Record<string, string>> = {
      natural: { en: 'Natural', bg: 'Естествен' },
      withTabHole: { en: 'With tab hole', bg: 'С отвор за кран' },
      polished: { en: 'Polished', bg: 'Полиран' },
    };
    return translations[subcategory]?.[lang] || subcategory;
  }
}