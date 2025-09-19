// No React imports needed in service layer

export interface ProductTranslation {
  en: string;
  bg: string;
}

export interface ApiProduct {
  id: string;
  serialNumber?: string; // b72, d1, m15, etc.
  model: ProductTranslation; // Type 1.1, Type 2.1, etc.
  title: ProductTranslation;
  description: ProductTranslation;
  material: ProductTranslation; // River Stone, Marble, Onyx, Fossil
  color: ProductTranslation; // Dark Grey/Grey, Black, Cream, etc.
  dimensions: string; // L: 40-60, W: 31-50, H: 15 or Ø: 40, H: 90
  weight: string; // 18-30 kg or 25 kg
  mounting: ProductTranslation; // Top mount, Floor mount, Flush mount
  manufacture: ProductTranslation; // hand-made / ръчен труд
  tag: ProductTranslation;
  category: string; // riverStone, marble, onyx, fossil
  subcategory: string; // natural, withTabHole, polished
  salesCount: number;
  image: string;
  date: string;
  priceEur: number;
  priceBgn: number;
}

class ApiService {
  private baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  async getProducts(): Promise<ApiProduct[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch products:", error);
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
      manufacture: product.manufacture[lang] || product.manufacture.en,
    };
  }

  // Helper to format dimensions - show only height for now
  formatDimensions(dimensions: string, t: (key: string) => string): string {
    if (!dimensions || !t) return dimensions;

    // Extract height from different dimension formats
    let heightMatch;

    if (dimensions.includes("H:")) {
      // Match any format that has "H: value"
      heightMatch = dimensions.match(/H:\s*([^,\s]+)/);
      if (heightMatch) {
        return `${t("product.height")}: ${heightMatch[1].trim()}`;
      }
    }

    // Return original if no height found
    return dimensions;
  }

  // Helper to format weight with proper language unit
  formatWeight(weight: string, language: string): string {
    if (!weight) return weight;

    // Remove existing "kg" or "кг"
    const cleanWeight = weight.replace(/\s*(kg|кг)\s*$/i, "").trim();

    // Add appropriate unit based on language
    const unit = language === "bg" ? "кг" : "kg";
    return `${cleanWeight} ${unit}`;
  }
}

export const apiService = new ApiService();
