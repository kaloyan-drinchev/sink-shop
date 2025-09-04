import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Checkout.css';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

interface FormErrors {
  [key: string]: string;
}

const Checkout: React.FC = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+359888123456',
    address: '123 Test Street, Apt 4B',
    city: 'Sofia',
    postalCode: '1000',
    country: 'Bulgaria'
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '1234 5678 9012 3456',
    expiryDate: '12/25',
    cvv: '123',
    cardholderName: 'John Doe'
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const isEnglish = i18n.language === 'en';
  const currency = isEnglish ? '€' : 'лв';
  const total = getCartTotal(isEnglish);

  // Redirect if cart is empty
  if (items.length === 0 && !orderSuccess) {
    navigate('/cart');
    return null;
  }

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateCardNumber = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\s/g, '');
    return cleaned.length === 16 && /^\d+$/.test(cleaned);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate shipping info
    if (!shippingInfo.firstName.trim()) newErrors.firstName = t('checkout.requiredField');
    if (!shippingInfo.lastName.trim()) newErrors.lastName = t('checkout.requiredField');
    if (!shippingInfo.email.trim()) {
      newErrors.email = t('checkout.requiredField');
    } else if (!validateEmail(shippingInfo.email)) {
      newErrors.email = t('checkout.invalidEmail');
    }
    if (!shippingInfo.phone.trim()) newErrors.phone = t('checkout.requiredField');
    if (!shippingInfo.address.trim()) newErrors.address = t('checkout.requiredField');
    if (!shippingInfo.city.trim()) newErrors.city = t('checkout.requiredField');
    if (!shippingInfo.postalCode.trim()) newErrors.postalCode = t('checkout.requiredField');

    // Validate payment info
    if (!paymentInfo.cardNumber.trim()) {
      newErrors.cardNumber = t('checkout.requiredField');
    } else if (!validateCardNumber(paymentInfo.cardNumber)) {
      newErrors.cardNumber = t('checkout.invalidCard');
    }
    if (!paymentInfo.expiryDate.trim()) newErrors.expiryDate = t('checkout.requiredField');
    if (!paymentInfo.cvv.trim()) newErrors.cvv = t('checkout.requiredField');
    if (!paymentInfo.cardholderName.trim()) newErrors.cardholderName = t('checkout.requiredField');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 3);
    }

    setPaymentInfo(prev => ({ ...prev, [name]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Prepare cart items for backend
      const cartItems = items.map(item => ({
        id: item.id,
        title: item.title,
        quantity: item.quantity,
        priceEur: item.priceEur,
        priceBgn: item.priceBgn,
        image: item.image,
        category: item.category,
        tag: item.tag
      }));

      // Process payment via backend
      const response = await fetch('http://localhost:3001/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shippingInfo,
          paymentInfo,
          cartItems
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment processing failed');
      }

      const result = await response.json();
      
      // Set order number from backend response
      setOrderNumber(result.order.id);
      
      // Clear cart
      clearCart();
      
      // Show success
      setOrderSuccess(true);
      
    } catch (error) {
      console.error('Order processing failed:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="checkout-container">
        <div className="checkout-success">
          <div className="success-icon">✓</div>
          <h2>{t('checkout.orderSuccess')}</h2>
          <p>{t('checkout.orderSuccessMessage')}</p>
          <div className="order-details">
            <p><strong>{t('checkout.orderNumber')}:</strong> {orderNumber}</p>
          </div>
          <button 
            onClick={() => navigate('/')} 
            className="continue-shopping-btn"
          >
            {t('cart.continueShopping')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <h1>{t('checkout.title')}</h1>
        
        <div className="checkout-layout">
          <div className="checkout-main">
            <form onSubmit={handleSubmit}>
              {/* Shipping Information */}
              <div className="checkout-section">
                <h2>{t('checkout.shippingInfo')}</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">{t('checkout.firstName')} *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleShippingChange}
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">{t('checkout.lastName')} *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleShippingChange}
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">{t('checkout.email')} *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleShippingChange}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">{t('checkout.phone')} *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">{t('checkout.address')} *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    className={errors.address ? 'error' : ''}
                  />
                  {errors.address && <span className="error-text">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">{t('checkout.city')} *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-text">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="postalCode">{t('checkout.postalCode')} *</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={handleShippingChange}
                      className={errors.postalCode ? 'error' : ''}
                    />
                    {errors.postalCode && <span className="error-text">{errors.postalCode}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="country">{t('checkout.country')} *</label>
                  <select
                    id="country"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleShippingChange}
                  >
                    <option value="Bulgaria">Bulgaria</option>
                    <option value="Romania">Romania</option>
                    <option value="Greece">Greece</option>
                    <option value="Serbia">Serbia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Payment Information */}
              <div className="checkout-section">
                <h2>{t('checkout.paymentInfo')}</h2>
                <div className="mock-notice">
                  <p>{t('checkout.mockPaymentNotice')}</p>
                </div>
                
                <div className="form-group">
                  <label htmlFor="cardholderName">{t('checkout.cardholderName')} *</label>
                  <input
                    type="text"
                    id="cardholderName"
                    name="cardholderName"
                    value={paymentInfo.cardholderName}
                    onChange={handlePaymentChange}
                    className={errors.cardholderName ? 'error' : ''}
                  />
                  {errors.cardholderName && <span className="error-text">{errors.cardholderName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cardNumber">{t('checkout.cardNumber')} *</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={handlePaymentChange}
                    placeholder="1234 5678 9012 3456"
                    className={errors.cardNumber ? 'error' : ''}
                    maxLength={19}
                  />
                  {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate">{t('checkout.expiryDate')} *</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={paymentInfo.expiryDate}
                      onChange={handlePaymentChange}
                      placeholder="MM/YY"
                      className={errors.expiryDate ? 'error' : ''}
                      maxLength={5}
                    />
                    {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv">{t('checkout.cvv')} *</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentChange}
                      placeholder="123"
                      className={errors.cvv ? 'error' : ''}
                      maxLength={3}
                    />
                    {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                  </div>
                </div>
              </div>

              <div className="checkout-actions">
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="back-btn"
                  disabled={isProcessing}
                >
                  {t('checkout.backToCart')}
                </button>
                <button
                  type="submit"
                  className="place-order-btn"
                  disabled={isProcessing}
                >
                  {isProcessing ? t('checkout.processing') : t('checkout.placeOrder')}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-sidebar">
            <div className="order-summary">
              <h3>{t('checkout.orderSummary')}</h3>
              
              <div className="order-items">
                {items.map((item) => {
                  const currentSinkData = t(`sinks.sink${item.id}`, { returnObjects: true }) as any;
                  const itemTitle = currentSinkData?.title || item.title;
                  const price = isEnglish ? item.priceEur : item.priceBgn;
                  
                  return (
                    <div key={item.id} className="order-item">
                      <div className="item-info">
                        <img src={item.image} alt={itemTitle} />
                        <div className="item-details">
                          <h4>{itemTitle}</h4>
                          <p>{t('cart.quantity')}: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="item-price">
                        {(price * item.quantity).toFixed(2)} {currency}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="order-totals">
                <div className="total-row">
                  <span>{t('checkout.subtotal')}:</span>
                  <span>{total.toFixed(2)} {currency}</span>
                </div>
                <div className="total-row">
                  <span>{t('checkout.shipping')}:</span>
                  <span>{t('checkout.free')}</span>
                </div>
                <div className="total-row total-final">
                  <span>{t('checkout.orderTotal')}:</span>
                  <span>{total.toFixed(2)} {currency}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
