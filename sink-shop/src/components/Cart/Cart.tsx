import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Toast from '../Toast/Toast';
import './Cart.css';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  // Toast state for confirmation
  const [showConfirmToast, setShowConfirmToast] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  
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
      // Show confirmation toast instead of directly removing
      setItemToRemove(id);
      setShowConfirmToast(true);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove);
      setItemToRemove(null);
    }
    setShowConfirmToast(false);
  };

  const handleCancelRemove = () => {
    setItemToRemove(null);
    setShowConfirmToast(false);
  };

  // Get the item name for the confirmation message
  const getItemToRemoveName = () => {
    if (!itemToRemove) return '';
    const item = items.find(item => item.id === itemToRemove);
    if (!item) return '';
    
    // Get current language title dynamically
    const currentSinkData = t(`sinks.sink${item.id}`, { returnObjects: true }) as any;
    return currentSinkData?.title || item.title;
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
                {item.image && (
                  <img 
                    src={item.image.startsWith('/assets/') ? item.image : `http://localhost:3001${item.image}`} 
                    alt={currentTitle} 
                    className="cart-item-image"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                
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

      {/* Confirmation Toast */}
      <Toast
        show={showConfirmToast}
        onClose={handleCancelRemove}
        type="confirmation"
        title={t('cart.confirmRemoveTitle')}
        message={t('cart.confirmRemoveMessage', { itemName: getItemToRemoveName() })}
        onConfirm={handleConfirmRemove}
        confirmText={t('cart.confirmRemoveButton')}
        cancelText={t('cart.keepItem')}
        t={t}
      />
    </div>
  );
};

export default Cart;