import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Cart.css';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  // Determine currency based on language
  const isEnglish = i18n.language === 'en';
  const currency = isEnglish ? '€' : 'лв';

  if (items.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-content">
          <h2>{t('cart.title')}</h2>
          <div className="empty-cart">
            <p>{t('cart.empty')}</p>
            <button onClick={() => navigate('/')} className="continue-shopping-btn">
              {t('cart.continueShopping')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // Directly remove item when quantity goes to 0
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-container">
      <div className="cart-content">
        <div className="cart-header">
          <h2>{t('cart.title')} ({items.length} {items.length === 1 ? t('cart.item') : t('cart.items')})</h2>
        </div>

        <div className="cart-items">
          {items.map((item) => {
            // Get current language title dynamically
            const currentSinkData = t(`sinks.sink${item.id}`, { returnObjects: true }) as any
            const currentTitle = currentSinkData?.title || item.title
            
            return (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={currentTitle} className="cart-item-image" />
                
                <div className="cart-item-details">
                  <h3>{currentTitle}</h3>
                  <p className="cart-item-price">
                    {(isEnglish ? item.priceEur : item.priceBgn).toFixed(2)} {currency}
                  </p>
                </div>

                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-total">
                  {((isEnglish ? item.priceEur : item.priceBgn) * item.quantity).toFixed(2)} {currency}
                </div>
              </div>
            )
          })}
        </div>

        <div className="cart-summary">
          <div className="cart-total">
            <h3>{t('cart.total')}: {getCartTotal(isEnglish).toFixed(2)} {currency}</h3>
          </div>
          
          <div className="cart-actions">
            <button onClick={() => navigate('/')} className="continue-shopping-btn">
              {t('cart.continueShopping')}
            </button>
            <button onClick={handleCheckout} className="checkout-btn">
              {t('cart.proceedToCheckout')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;