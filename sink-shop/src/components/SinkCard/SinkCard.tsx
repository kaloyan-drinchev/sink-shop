import { useTranslation } from "react-i18next";
import { apiService, type ApiProduct } from "../../services/apiService";

// Legacy interface for backward compatibility
export interface SinkData {
  id: string;
  title: string;
  description: string;
  tag: string;
  category: string;
  salesCount: number;
  image: string;
  date: string;
  priceEur: number;
  priceBgn: number;
}

interface SinkCardProps {
  product: ApiProduct;
  onClick?: (sinkId: string) => void;
}

function SinkCard({ product, onClick }: SinkCardProps) {
  const { t, i18n } = useTranslation();

  // Get localized product data
  const localizedProduct = apiService.getLocalizedProduct(product, i18n.language);

  // Determine currency based on language
  const isEnglish = i18n.language === "en";
  const price = isEnglish ? product.priceEur : product.priceBgn;
  const currency = isEnglish ? "€" : "лв";

  const handleClick = () => {
    if (onClick) {
      onClick(product.id);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer relative"
      onClick={handleClick}
    >
      {/* Image - Made larger */}
      <div className="w-full h-64 bg-gray-200 rounded-t-lg overflow-hidden relative">
        {product.image && (
          <img
            src={product.image}
            alt={localizedProduct.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
      </div>

      {/* Content - Reduced size */}
      <div className="p-3">
        {/* Title - More prominent and larger */}
        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
          {localizedProduct.title}
        </h3>

        {/* Tag as subtitle */}
        {product.tag && (
          <p className="text-sm text-gray-500 mb-2 italic">
            {isEnglish ? product.tag.en : product.tag.bg}
          </p>
        )}

        {/* Price and Button - Main focus */}
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">
            {price} {currency}
          </span>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded text-sm transition-colors">
            {t("product.viewDetails")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SinkCard;
