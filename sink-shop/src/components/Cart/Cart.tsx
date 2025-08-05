import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Toast from '../Toast/Toast';
import './Cart.css';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  // Toast states
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [itemNameToRemove, setItemNameToRemove] = useState<string>('');

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
      // Find the item name for confirmation
      const item = items.find(item => item.id === id);
      setItemToRemove(id);
      setItemNameToRemove(item?.title || t('cart.item'));
      setShowRemoveConfirm(true);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveClick = (id: string) => {
    const item = items.find(item => item.id === id);
    setItemToRemove(id);
    setItemNameToRemove(item?.title || t('cart.item'));
    setShowRemoveConfirm(true);
  };

  const handleClearCartClick = () => {
    setShowClearConfirm(true);
  };

  const confirmRemoveItem = () => {
    if (itemToRemove !== null) {
      removeFromCart(itemToRemove);
      setItemToRemove(null);
      setItemNameToRemove('');
    }
  };

  const confirmClearCart = () => {
    clearCart();
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-container">
      <div className="cart-content">
        <div className="cart-header">
          <h2>{t('cart.title')} ({items.length} {items.length === 1 ? t('cart.item') : t('cart.items')})</h2>
          <button onClick={handleClearCartClick} className="clear-cart-btn">
            {t('cart.clearCart')}
          </button>
        </div>

        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.title} className="cart-item-image" />
              
              <div className="cart-item-details">
                <h3>{item.title}</h3>
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
                
                <button 
                  onClick={() => handleRemoveClick(item.id)}
                  className="remove-btn"
                >
                  {t('cart.remove')}
                </button>
              </div>

              <div className="cart-item-total">
                {((isEnglish ? item.priceEur : item.priceBgn) * item.quantity).toFixed(2)} {currency}
              </div>
            </div>
          ))}
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

      {/* Clear Cart Confirmation Toast */}
      <Toast
        show={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        type="confirmation"
        title={t('cart.confirmClearTitle')}
        message={t('cart.confirmClearMessage')}
        onConfirm={confirmClearCart}
        confirmText={t('cart.confirmClearButton')}
        cancelText={t('cart.keepItems')}
        t={t}
      />

      {/* Remove Item Confirmation Toast */}
      <Toast
        show={showRemoveConfirm}
        onClose={() => {
          setShowRemoveConfirm(false);
          setItemToRemove(null);
          setItemNameToRemove('');
        }}
        type="confirmation"
        title={t('cart.confirmRemoveTitle')}
        message={t('cart.confirmRemoveMessage', { itemName: itemNameToRemove })}
        onConfirm={confirmRemoveItem}
        confirmText={t('cart.confirmRemoveButton')}
        cancelText={t('cart.keepItem')}
        t={t}
      />
    </div>
  );
};

export default Cart; 