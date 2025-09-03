import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '../../LanguageSwitcher/LanguageSwitcher';

interface ProductForm {
  modelEn: string;
  modelBg: string;
  titleEn: string;
  titleBg: string;
  descriptionEn: string;
  descriptionBg: string;
  materialEn: string;
  materialBg: string;
  colorEn: string;
  colorBg: string;
  dimensions: string;
  weight: string;
  mountingEn: string;
  mountingBg: string;
  tag: string;
  category: 'fossil' | 'riverStone' | 'marble' | 'onyx';
  priceEur: number;
  priceBgn: number;
  image: File | null;
}

function AddProduct() {
  const [form, setForm] = useState<ProductForm>({
    modelEn: '',
    modelBg: '',
    titleEn: '',
    titleBg: '',
    descriptionEn: '',
    descriptionBg: '',
    materialEn: '',
    materialBg: '',
    colorEn: '',
    colorBg: '',
    dimensions: '',
    weight: '',
    mountingEn: 'Top mount',
    mountingBg: 'Горен монтаж',
    tag: '',
    category: 'fossil',
    priceEur: 750,
    priceBgn: 1465,
    image: null
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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
      if (!form.modelEn || !form.modelBg || !form.titleEn || !form.titleBg || !form.descriptionEn || !form.descriptionBg) {
        throw new Error('All model, title and description fields are required');
      }

      if (!form.materialEn || !form.materialBg || !form.colorEn || !form.colorBg) {
        throw new Error('All material and color fields are required');
      }

      if (!form.dimensions || !form.weight) {
        throw new Error('Dimensions and weight are required');
      }

      if (!form.image) {
        throw new Error('Product image is required');
      }

      if (form.priceEur <= 0 || form.priceBgn <= 0) {
        throw new Error('Prices must be greater than 0');
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', form.image);
      formData.append('modelEn', form.modelEn);
      formData.append('modelBg', form.modelBg);
      formData.append('titleEn', form.titleEn);
      formData.append('titleBg', form.titleBg);
      formData.append('descriptionEn', form.descriptionEn);
      formData.append('descriptionBg', form.descriptionBg);
      formData.append('materialEn', form.materialEn);
      formData.append('materialBg', form.materialBg);
      formData.append('colorEn', form.colorEn);
      formData.append('colorBg', form.colorBg);
      formData.append('dimensions', form.dimensions);
      formData.append('weight', form.weight);
      formData.append('mountingEn', form.mountingEn);
      formData.append('mountingBg', form.mountingBg);
      formData.append('tag', form.tag);
      formData.append('category', form.category);
      formData.append('priceEur', form.priceEur.toString());
      formData.append('priceBgn', form.priceBgn.toString());

      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Admin token not found');
      }

      const response = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      // Redirect to dashboard
      navigate('/admin-portal/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add Product</h1>
              <p className="text-sm text-gray-500">Create a new sink product</p>
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
                onClick={() => navigate('/admin-portal/dashboard')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow sm:rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              
              {/* Image Upload */}
              <div className="mx-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image *
                </label>
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
                          alt="Preview"
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
                          Remove image
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
                            <span>Upload a file</span>
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

              {/* Model Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-2">
                <div>
                  <label htmlFor="modelEn" className="block text-sm font-medium text-gray-700">
                    Model (English) *
                  </label>
                  <input
                    type="text"
                    name="modelEn"
                    id="modelEn"
                    required
                    minLength={2}
                    maxLength={20}
                    pattern="^Type\s+\d+(\.\d+)?$"
                    value={form.modelEn}
                    onChange={handleInputChange}
                    className="mt-1 mx-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Type 1.1"
                    title="Format: Type X.X (e.g., Type 1.1, Type 10.2)"
                  />
                </div>
                <div>
                  <label htmlFor="modelBg" className="block text-sm font-medium text-gray-700">
                    Model (Bulgarian) *
                  </label>
                  <input
                    type="text"
                    name="modelBg"
                    id="modelBg"
                    required
                    minLength={2}
                    maxLength={20}
                    pattern="^Вид\s+\d+(\.\d+)?$"
                    value={form.modelBg}
                    onChange={handleInputChange}
                    className="mt-1 mx-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Вид 1.1"
                    title="Формат: Вид X.X (напр., Вид 1.1, Вид 10.2)"
                  />
                </div>
              </div>

              {/* Title Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-2">
                <div>
                  <label htmlFor="titleEn" className="block text-sm font-medium text-gray-700">
                    Title (English) * <span className="text-xs text-gray-500">(5-100 chars)</span>
                  </label>
                  <input
                    type="text"
                    name="titleEn"
                    id="titleEn"
                    required
                    minLength={5}
                    maxLength={100}
                    value={form.titleEn}
                    onChange={handleInputChange}
                    className="mt-1 mx-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Premium Oak Kitchen Sink"
                  />
                </div>
                <div>
                  <label htmlFor="titleBg" className="block text-sm font-medium text-gray-700">
                    Title (Bulgarian) * <span className="text-xs text-gray-500">(5-100 chars)</span>
                  </label>
                  <input
                    type="text"
                    name="titleBg"
                    id="titleBg"
                    required
                    minLength={5}
                    maxLength={100}
                    value={form.titleBg}
                    onChange={handleInputChange}
                    className="mt-1 mx-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Премиум дъбова кухненска мивка"
                  />
                </div>
              </div>

              {/* Description Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-2">
                <div>
                  <label htmlFor="descriptionEn" className="block text-sm font-medium text-gray-700">
                    Description (English) * <span className="text-xs text-gray-500">(10-500 chars)</span>
                  </label>
                  <textarea
                    name="descriptionEn"
                    id="descriptionEn"
                    rows={4}
                    required
                    minLength={10}
                    maxLength={500}
                    value={form.descriptionEn}
                    onChange={handleInputChange}
                    className="mt-1 mx-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Handcrafted solid oak kitchen sink..."
                  />
                </div>
                <div>
                  <label htmlFor="descriptionBg" className="block text-sm font-medium text-gray-700">
                    Description (Bulgarian) * <span className="text-xs text-gray-500">(10-500 chars)</span>
                  </label>
                  <textarea
                    name="descriptionBg"
                    id="descriptionBg"
                    rows={4}
                    required
                    minLength={10}
                    maxLength={500}
                    value={form.descriptionBg}
                    onChange={handleInputChange}
                    className="mt-1 mx-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ръчно изработена дъбова кухненска мивка..."
                  />
                </div>
              </div>

              {/* Material Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-2">
                <div>
                  <label htmlFor="materialEn" className="block text-sm font-medium text-gray-700">
                    Material (English) * <span className="text-xs text-gray-500">(2-50 chars)</span>
                  </label>
                  <input
                    type="text"
                    name="materialEn"
                    id="materialEn"
                    required
                    minLength={2}
                    maxLength={50}
                    value={form.materialEn}
                    onChange={handleInputChange}
                    className="mt-1 mx-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="River Stone"
                  />
                </div>
                <div>
                  <label htmlFor="materialBg" className="block text-sm font-medium text-gray-700">
                    Material (Bulgarian) * <span className="text-xs text-gray-500">(2-50 chars)</span>
                  </label>
                  <input
                    type="text"
                    name="materialBg"
                    id="materialBg"
                    required
                    minLength={2}
                    maxLength={50}
                    value={form.materialBg}
                    onChange={handleInputChange}
                    className="mt-1 mx-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Речен камък"
                  />
                </div>
              </div>

              {/* Color Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-2">
                <div>
                  <label htmlFor="colorEn" className="block text-sm font-medium text-gray-700">
                    Color (English) * <span className="text-xs text-gray-500">(2-50 chars)</span>
                  </label>
                  <input
                    type="text"
                    name="colorEn"
                    id="colorEn"
                    required
                    minLength={2}
                    maxLength={50}
                    value={form.colorEn}
                    onChange={handleInputChange}
                    className="mt-1 mx-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Dark Grey/Grey"
                  />
                </div>
                <div>
                  <label htmlFor="colorBg" className="block text-sm font-medium text-gray-700">
                    Color (Bulgarian) * <span className="text-xs text-gray-500">(2-50 chars)</span>
                  </label>
                  <input
                    type="text"
                    name="colorBg"
                    id="colorBg"
                    required
                    minLength={2}
                    maxLength={50}
                    value={form.colorBg}
                    onChange={handleInputChange}
                    className="mt-1 mx-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Тъмно сиво/Сиво"
                  />
                </div>
              </div>

              {/* Dimensions and Weight */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-2">
                <div>
                  <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700">
                    Dimensions *
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    id="dimensions"
                    required
                    minLength={5}
                    maxLength={100}
                    pattern="^(L:\s*\d+(-\d+)?,\s*W:\s*\d+(-\d+)?,\s*H:\s*\d+|Ø:\s*\d+,\s*H:\s*\d+).*$"
                    value={form.dimensions}
                    onChange={handleInputChange}
                    className="mt-1 mx-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="L: 40-60, W: 31-50, H: 15"
                    title="Format: L: X-Y, W: X-Y, H: Z or Ø: X, H: Y"
                  />
                </div>
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                    Weight *
                  </label>
                  <input
                    type="text"
                    name="weight"
                    id="weight"
                    required
                    minLength={3}
                    maxLength={20}
                    pattern="^(\d+(-\d+)?\s*kg|\d+\s*kg)$"
                    value={form.weight}
                    onChange={handleInputChange}
                    className="mt-1 mx-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="18-30 kg"
                    title="Format: X kg or X-Y kg"
                  />
                </div>
              </div>

              {/* Mounting Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-2">
                <div>
                  <label htmlFor="mountingEn" className="block text-sm font-medium text-gray-700">
                    Mounting Type (English) *
                  </label>
                  <select
                    name="mountingEn"
                    id="mountingEn"
                    required
                    value={form.mountingEn}
                    onChange={handleInputChange}
                    className="mt-1 mx-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Top mount">Top mount</option>
                    <option value="Floor mount">Floor mount</option>
                    <option value="Flush mount">Flush mount</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="mountingBg" className="block text-sm font-medium text-gray-700">
                    Mounting Type (Bulgarian) *
                  </label>
                  <select
                    name="mountingBg"
                    id="mountingBg"
                    required
                    value={form.mountingBg}
                    onChange={handleInputChange}
                    className="mt-1 mx-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Горен монтаж">Горен монтаж</option>
                    <option value="Подов монтаж">Подов монтаж</option>
                    <option value="Вграден монтаж">Вграден монтаж</option>
                  </select>
                </div>
              </div>

              {/* Tag and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-2">
                <div>
                  <label htmlFor="tag" className="block text-sm font-medium text-gray-700">
                    Tag <span className="text-xs text-gray-500">(optional, max 30 chars)</span>
                  </label>
                  <input
                    type="text"
                    name="tag"
                    id="tag"
                    maxLength={30}
                    value={form.tag}
                    onChange={handleInputChange}
                    className="mt-1 mx-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                    className="mt-1 mx-1 block w-full px-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="fossil">Fossil</option>
                    <option value="riverStone">River Stone</option>
                    <option value="marble">Marble</option>
                    <option value="onyx">Onyx</option>
                  </select>
                </div>
              </div>

              {/* Price Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-2">
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
                      min="1"
                      max="10000"
                      step="0.01"
                      required
                      value={form.priceEur}
                      onChange={handleInputChange}
                      className="pl-7 pr-3 py-2 mx-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="750.00"
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
                      min="2"
                      max="20000"
                      step="0.01"
                      required
                      value={form.priceBgn}
                      onChange={handleInputChange}
                      className="pl-8 pr-3 py-2 mx-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1465.00"
                    />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded mx-2">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-6 border-t mx-2">
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
                  {loading ? 'Creating...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddProduct;
