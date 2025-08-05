import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Toast.css';

interface ToastProps {
  show: boolean;
  onClose: () => void;
  productTitle?: string;
  type?: 'success' | 'confirmation';
  title?: string;
  message?: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  t?: (key: string) => string;
}

const Toast: React.FC<ToastProps> = ({ 
  show, 
  onClose, 
  productTitle,
  type = 'success',
  title,
  message,
  onConfirm,
  confirmText = 'Yes, Remove',
  cancelText = 'Cancel',
  t
}) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Small delay for entrance animation
      setTimeout(() => setIsAnimating(true), 10);
    }
  }, [show]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    handleClose();
  };

  const handleViewCart = () => {
    handleClose();
    navigate('/cart');
  };

  const handleContinueShopping = () => {
    handleClose();
  };

  if (!isVisible) return null;

  // Confirmation Toast
  if (type === 'confirmation') {
    return (
      <>
        <div 
          className={`toast-overlay ${isAnimating ? 'show' : ''}`}
          onClick={handleClose}
        />
        <div className={`toast toast-confirmation ${isAnimating ? 'show' : ''}`}>
          <div className="toast-content">
            <div className="toast-header">
              <div className="toast-icon toast-icon-warning">
                <span className="warning-icon">⚠️</span>
              </div>
              <h3>{title || 'Confirm Action'}</h3>
              <button 
                className="toast-close"
                onClick={handleClose}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            
            <div className="toast-body">
              <p className="toast-message">
                {message || 'Are you sure you want to proceed?'}
              </p>
            </div>

            <div className="toast-actions">
              <button 
                className="toast-btn toast-btn-secondary"
                onClick={handleClose}
              >
                {cancelText}
              </button>
              <button 
                className="toast-btn toast-btn-danger"
                onClick={handleConfirm}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Success Toast (original functionality)
  return (
    <>
      <div 
        className={`toast-overlay ${isAnimating ? 'show' : ''}`}
        onClick={handleClose}
      />
      <div className={`toast ${isAnimating ? 'show' : ''}`}>
        <div className="toast-content">
          <div className="toast-header">
            <div className="toast-icon">
              <span className="checkmark">✓</span>
            </div>
            <h3>{t ? t('toast.addedToCart') : 'Added to Cart!'}</h3>
            <button 
              className="toast-close"
              onClick={handleClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          
          <div className="toast-body">
            <p className="toast-product">
              <strong>{productTitle}</strong> {t ? t('toast.hasBeenAdded') : 'has been added to your cart.'}
            </p>
          </div>

          <div className="toast-actions">
            <button 
              className="toast-btn toast-btn-secondary"
              onClick={handleContinueShopping}
            >
              {t ? t('toast.continueShopping') : 'Continue Shopping'}
            </button>
            <button 
              className="toast-btn toast-btn-primary"
              onClick={handleViewCart}
            >
              {t ? t('toast.viewCart') : 'View Cart'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Toast; 