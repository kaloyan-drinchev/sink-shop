import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService, type ApiProduct } from '../../../services/apiService';
import OrdersView from '../OrdersView/OrdersView';
import LanguageSwitcher from '../../LanguageSwitcher/LanguageSwitcher';

function AdminDashboard() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ApiProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Check admin authentication
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || !user) {
      navigate('/admin-portal');
      return;
    }

    try {
      const userData = JSON.parse(user);
      if (userData.role !== 'admin') {
        navigate('/admin-portal');
        return;
      }
    } catch {
      navigate('/admin-portal');
      return;
    }

    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
    } else {
      const lang = i18n.language as 'en' | 'bg';
      const filtered = products.filter(product =>
        product.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.model[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.model.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.material[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.material.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.color[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.color.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products, i18n.language]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin-portal');
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm(t('admin.confirmDelete'))) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedProducts = products.filter(p => p.id !== productId);
        setProducts(updatedProducts);
        const lang = i18n.language as 'en' | 'bg';
        setFilteredProducts(updatedProducts.filter(p => 
          !searchQuery.trim() || 
          p.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.title.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.model[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.model.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.material[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.material.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.color[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.color.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tag.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      } else {
        alert(t('admin.deleteError'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(t('admin.deleteError'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('admin.dashboard')}</h1>
              <p className="text-sm text-gray-500">{t('admin.manageProducts')}</p>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <button
                onClick={() => navigate('/')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {t('admin.viewWebsite')}
              </button>
              <button
                onClick={() => navigate('/admin-portal/add-product')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {t('admin.addProduct')}
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {t('admin.logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Tab Navigation */}
          <div className="mb-6">
            <nav className="flex space-x-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('admin.products')} ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t('admin.ordersSales')}
              </button>
            </nav>
          </div>

          {activeTab === 'products' ? (
            /* Products Section */
            error ? (
              <div className="text-red-600 text-center bg-red-50 p-4 rounded">
                {error}
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {t('admin.products')} ({filteredProducts.length}/{products.length})
                    </h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t('admin.searchProducts')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">{t('admin.noProducts')}</p>
                    <button
                      onClick={() => navigate('/admin-portal/add-product')}
                      className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      {t('admin.addFirstProduct')}
                    </button>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">{t('admin.noSearchResults')}</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      {t('admin.clearSearch')}
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('admin.product')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('admin.model')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('admin.material')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('admin.dimensions')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('admin.price')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('admin.sales')}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {t('admin.actions')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product) => {
                          const lang = i18n.language as 'en' | 'bg';
                          
                          return (
                            <tr key={product.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {product.image && (
                                    <img
                                      className="h-12 w-12 rounded-lg object-cover"
                                      src={product.image.startsWith('/assets/') ? product.image : `http://localhost:3001${product.image}`}
                                      alt={product.title[lang]}
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  )}
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                      {product.title[lang]}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {product.color[lang]}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                {product.model[lang]}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                  {product.material[lang]}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {apiService.formatDimensions(product.dimensions, t)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div>€{product.priceEur}</div>
                                <div className="text-xs text-gray-500">{product.priceBgn} лв</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {product.salesCount} {t('admin.sold')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => navigate(`/admin-portal/edit-product/${product.id}`)}
                                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded text-xs font-medium"
                                  >
                                    {t('admin.edit')}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded text-xs font-medium"
                                  >
                                    {t('admin.delete')}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            )
          ) : (
            /* Orders Section */
            <OrdersView />
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
