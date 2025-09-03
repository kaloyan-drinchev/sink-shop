// No React imports needed in service layer

export interface ProductTranslation {
  en: string;
  bg: string;
}

export interface ApiProduct {
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
}

class ApiService {
  private baseUrl = 'http://localhost:3001/api';

  async getProducts(): Promise<ApiProduct[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  }

  async getProduct(id: string): Promise<ApiProduct> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch product ${id}:`, error);
      throw error;
    }
  }

  // Helper to get localized product data
  getLocalizedProduct(product: ApiProduct, language: string) {
    const lang = language as keyof ProductTranslation;
    return {
      ...product,
      model: product.model[lang] || product.model.en,
      title: product.title[lang] || product.title.en,
      description: product.description[lang] || product.description.en,
      material: product.material[lang] || product.material.en,
      color: product.color[lang] || product.color.en,
      mounting: product.mounting[lang] || product.mounting.en,
      manufacture: product.manufacture[lang] || product.manufacture.en
    };
  }
}

export const apiService = new ApiService();
