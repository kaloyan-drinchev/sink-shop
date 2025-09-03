import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService, type ApiProduct } from '../../../services/apiService';

interface ProductForm {
  titleEn: string;
  titleBg: string;
  descriptionEn: string;
  descriptionBg: string;
  tag: string;
  category: 'fossil' | 'riverStone';
  priceEur: number;
  priceBgn: number;
  image: File | null;
}

function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<ProductForm>({
    titleEn: '',
    titleBg: '',
    descriptionEn: '',
    descriptionBg: '',
    tag: '',
    category: 'fossil',
    priceEur: 0,
    priceBgn: 0,
    image: null
  });

  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load existing product data
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        navigate('/admin-portal/dashboard');
        return;
      }

      try {
        const product = await apiService.getProduct(id);
        
        setForm({
          titleEn: product.title.en,
          titleBg: product.title.bg,
          descriptionEn: product.description.en,
          descriptionBg: product.description.bg,
          tag: product.tag,
          category: product.category as 'fossil' | 'riverStone',
          priceEur: product.priceEur,
          priceBgn: product.priceBgn,
          image: null
        });

        setCurrentImageUrl(product.image);
      } catch (error) {
        setError('Failed to load product');
        console.error('Error loading product:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Handle dropped files
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  // Handle file selection
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size must be less than 5MB');
      return;
    }

    setError(null);
    setForm({ ...form, image: file });

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ 
      ...form, 
      [name]: name.includes('price') ? parseFloat(value) || 0 : value 
    });
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!form.titleEn || !form.titleBg || !form.descriptionEn || !form.descriptionBg) {
        throw new Error('All title and description fields are required');
      }

      if (form.priceEur <= 0 || form.priceBgn <= 0) {
        throw new Error('Prices must be greater than 0');
      }

      // Create FormData for file upload
      const formData = new FormData();
      if (form.image) {
        formData.append('image', form.image);
      }
      formData.append('titleEn', form.titleEn);
      formData.append('titleBg', form.titleBg);
      formData.append('descriptionEn', form.descriptionEn);
      formData.append('descriptionBg', form.descriptionBg);
      formData.append('tag', form.tag);
      formData.append('category', form.category);
      formData.append('priceEur', form.priceEur.toString());
      formData.append('priceBgn', form.priceBgn.toString());

      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Admin token not found');
      }

      const response = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      // Redirect to dashboard
      navigate('/admin-portal/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
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
              <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-sm text-gray-500">Update product details</p>
            </div>
            <button
              onClick={() => navigate('/admin-portal/dashboard')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow sm:rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                
                {/* Current Image Display */}
                {!imagePreview && currentImageUrl && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Current image:</p>
                    <img
                      src={currentImageUrl.startsWith('/uploads/') ? `http://localhost:3001${currentImageUrl}` : currentImageUrl}
                      alt="Current product"
                      className="h-32 w-32 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Upload Area */}
                <div
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
                    dragActive 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={imagePreview}
                          alt="New preview"
                          className="mx-auto h-32 w-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setForm({ ...form, image: null });
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="text-sm text-red-600 hover:text-red-500"
                        >
                          Remove new image
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                          >
                            <span>Upload new image</span>
                            <input
                              ref={fileInputRef}
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleFileInputChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Title Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="titleEn" className="block text-sm font-medium text-gray-700">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    name="titleEn"
                    id="titleEn"
                    required
                    value={form.titleEn}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Premium Oak Kitchen Sink"
                  />
                </div>
                <div>
                  <label htmlFor="titleBg" className="block text-sm font-medium text-gray-700">
                    Title (Bulgarian) *
                  </label>
                  <input
                    type="text"
                    name="titleBg"
                    id="titleBg"
                    required
                    value={form.titleBg}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Премиум дъбова кухненска мивка"
                  />
                </div>
              </div>

              {/* Description Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="descriptionEn" className="block text-sm font-medium text-gray-700">
                    Description (English) *
                  </label>
                  <textarea
                    name="descriptionEn"
                    id="descriptionEn"
                    rows={4}
                    required
                    value={form.descriptionEn}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Handcrafted solid oak kitchen sink..."
                  />
                </div>
                <div>
                  <label htmlFor="descriptionBg" className="block text-sm font-medium text-gray-700">
                    Description (Bulgarian) *
                  </label>
                  <textarea
                    name="descriptionBg"
                    id="descriptionBg"
                    rows={4}
                    required
                    value={form.descriptionBg}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ръчно изработена дъбова кухненска мивка..."
                  />
                </div>
              </div>

              {/* Tag and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="tag" className="block text-sm font-medium text-gray-700">
                    Tag
                  </label>
                  <input
                    type="text"
                    name="tag"
                    id="tag"
                    value={form.tag}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Premium, Luxury, Natural..."
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    name="category"
                    id="category"
                    required
                    value={form.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="fossil">Fossil</option>
                    <option value="riverStone">River Stone</option>
                  </select>
                </div>
              </div>

              {/* Price Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="priceEur" className="block text-sm font-medium text-gray-700">
                    Price (EUR) *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">€</span>
                    </div>
                    <input
                      type="number"
                      name="priceEur"
                      id="priceEur"
                      min="0"
                      step="0.01"
                      required
                      value={form.priceEur}
                      onChange={handleInputChange}
                      className="pl-7 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="priceBgn" className="block text-sm font-medium text-gray-700">
                    Price (BGN) *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">лв</span>
                    </div>
                    <input
                      type="number"
                      name="priceBgn"
                      id="priceBgn"
                      min="0"
                      step="0.01"
                      required
                      value={form.priceBgn}
                      onChange={handleInputChange}
                      className="pl-8 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => navigate('/admin-portal/dashboard')}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EditProduct;
