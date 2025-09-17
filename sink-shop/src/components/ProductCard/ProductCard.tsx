import { useTranslation } from 'react-i18next';
import { apiService, type ApiProduct } from '../../services/apiService';

interface ProductCardProps {
  product: ApiProduct;
  onClick: (id: string) => void;
}

function ProductCard({ product, onClick }: ProductCardProps) {
  const { t, i18n } = useTranslation();
  
  // Get product in current language
  const localizedProduct = apiService.getLocalizedProduct(product, i18n.language);
  
  // Determine price and currency based on language
  const isEnglish = i18n.language === 'en';
  const price = isEnglish ? product.priceEur : product.priceBgn;
  const currency = isEnglish ? '€' : 'лв';

  return (
    <div className="product-card" onClick={() => onClick(product.id)}>
      <img src={product.image} alt={localizedProduct.title} />
      
      <div className="content">
        {/* UI text from i18n */}
        <span className="tag">{typeof product.tag === 'string' ? product.tag : product.tag?.en || ''}</span>
        <span className="category">{t(`categories.${product.category}`)}</span>
        
        {/* Product data from API (localized) */}
        <h3>{localizedProduct.title}</h3>
        <p>{localizedProduct.description}</p>
        
        <div className="footer">
          <span>{price} {currency}</span>
          {/* UI text from i18n */}
          <button>{t('product.addToCart')}</button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
