import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { SinkData } from "../SinkCard/SinkCard";
import Toast from "../Toast/Toast";
import { useCart } from "../../contexts/CartContext";
import { apiService, type ApiProduct } from "../../services/apiService";

function SingleSinkView() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);

  // State for product data
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await apiService.getProduct(id);
        setProduct(data);
      } catch (err) {
        setError("Product not found");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading product...</p>
      </div>
    );
  }

  // Error state or product not found
  if (error || !product) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Get localized product data
  const localizedProduct = apiService.getLocalizedProduct(product, i18n.language);

  // Determine currency based on language
  const isEnglish = i18n.language === "en";
  const price = isEnglish ? product.priceEur : product.priceBgn;
  const currency = isEnglish ? "€" : "лв";

  const handleAddToCart = () => {
    // Convert API product to legacy SinkData format for cart
    const legacySinkData: SinkData = {
      id: product.id,
      title: localizedProduct.title,
      description: localizedProduct.description,
      tag: isEnglish ? product.tag.en : product.tag.bg,
      category: product.category,
      salesCount: product.salesCount,
      image: product.image,
      date: product.date,
      priceEur: product.priceEur,
      priceBgn: product.priceBgn,
    };
    addToCart(legacySinkData);
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Navigation */}
      <nav className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="text-blue-500 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          ← {t("navigation.allProducts")}
        </button>
      </nav>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="w-full">
          <div className="bg-gray-100 rounded-lg shadow-sm overflow-hidden">
            {product.image && (
              <img
                src={
                  product.image.startsWith("/assets/")
                    ? product.image
                    : `https://artindohome.com${product.image}`
                }
                alt={localizedProduct.title}
                className="w-full h-[500px] md:h-[600px] lg:h-[730px] object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>
        </div>

        {/* Product Information */}
        <div className="flex flex-col">
          {/* Tag */}
          <div className="flex gap-3 mb-4">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
              {product.tag && (isEnglish ? product.tag.en : product.tag.bg)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{localizedProduct.title}</h1>

          {/* Price */}
          <div className="text-4xl font-bold text-gray-900 mb-6">
            {price} {currency}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t("product.description")}</h3>
            <p className="text-gray-600 leading-relaxed">{localizedProduct.description}</p>
          </div>

          {/* Specifications */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {t("product.specifications")}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">{t("product.model")}</span>
                <span className="font-medium">{localizedProduct.model}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">{t("product.material")}</span>
                <span className="font-medium">{localizedProduct.material}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">{t("product.color")}</span>
                <span className="font-medium">{localizedProduct.color}</span>
              </div>
              {/* <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">{t("product.dimensions")}</span>
                <span className="font-medium">
                  {apiService.formatDimensions(product.dimensions, t)}
                </span>
              </div> */}
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">{t("product.weight")}</span>
                <span className="font-medium">
                  {apiService.formatWeight(product.weight, i18n.language)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">{t("product.mounting")}</span>
                <span className="font-medium">{localizedProduct.mounting}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">{t("product.manufacture")}</span>
                <span className="font-medium">{localizedProduct.manufacture}</span>
              </div>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="mt-auto">
            <button
              onClick={handleAddToCart}
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-200"
            >
              {t("product.addToCart")} - {price} {currency}
            </button>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      <Toast
        show={showToast}
        onClose={handleCloseToast}
        productTitle={localizedProduct.title}
        type="success"
        t={t}
      />
    </div>
  );
}

export default SingleSinkView;
