// No React imports needed in service layer

export interface ProductTranslation {
  en: string;
  bg: string;
}

export interface ApiProduct {
  id: string;
  title: ProductTranslation;
  description: ProductTranslation;
  tag: string;
  category: string;
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
    return {
      ...product,
      title: product.title[language as keyof ProductTranslation] || product.title.en,
      description: product.description[language as keyof ProductTranslation] || product.description.en
    };
  }
}

export const apiService = new ApiService();
