import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Trash2,
  UploadCloud,
  Star,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Link as LinkIcon,
  X,
} from 'lucide-react';
import { productService } from '../../services/productService';
import { uploadService } from '../../services/uploadService';
import { useSettings } from '../../context/SettingsContext';
import { IProduct, IProductImage, IProductSpecification } from '../../types';
import { SEOHead } from '../../components/seo/SEOHead';

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { categories } = useSettings();

  // Form State
  const [name, setName] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [brand, setBrand] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');

  // Pricing
  const [showPrice, setShowPrice] = useState<'exact' | 'mrp_selling' | 'contact' | 'quote'>('exact');
  const [price, setPrice] = useState<string>('');
  const [mrp, setMrp] = useState<string>('');
  const [discountPrice, setDiscountPrice] = useState<string>('');
  const [priceLabel, setPriceLabel] = useState('');

  // Images
  const [images, setImages] = useState<IProductImage[]>([]);
  const [manualImageUrl, setManualImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Specifications (Dynamic key-value array)
  const [specifications, setSpecifications] = useState<IProductSpecification[]>([
    { key: 'Capacity', value: '' },
    { key: 'Accuracy', value: '' },
    { key: 'Platform Size', value: '' },
  ]);

  // Features (Dynamic array of strings)
  const [features, setFeatures] = useState<string[]>([
    'Heavy-duty industrial grade construction',
    'High accuracy precision load cell sensor',
  ]);

  // Inventory & Visibility
  const [stockStatus, setStockStatus] = useState<'in_stock' | 'out_of_stock' | 'on_request'>('in_stock');
  const [featured, setFeatured] = useState<boolean>(false);
  const [status, setStatus] = useState<'published' | 'draft' | 'hidden'>('published');

  // SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If in Edit Mode, fetch existing product
  useEffect(() => {
    if (isEditMode && id) {
      const loadProduct = async () => {
        try {
          const product = await productService.getProductByIdAdmin(id);
          setName(product.name);
          setCustomSlug(product.slug);
          setCategoryId(
            typeof product.category === 'object' && product.category
              ? (product.category as any)._id
              : product.category
          );
          setSubcategory(product.subcategory || '');
          setBrand(product.brand || '');
          setShortDescription(product.shortDescription || '');
          setDescription(product.description || '');
          setShowPrice(product.showPrice || 'exact');
          setPrice(product.price !== undefined ? product.price.toString() : '');
          setMrp(product.mrp !== undefined ? product.mrp.toString() : '');
          setDiscountPrice(product.discountPrice !== undefined ? product.discountPrice.toString() : '');
          setPriceLabel(product.priceLabel || '');
          setImages(product.images || []);
          setSpecifications(
            product.specifications && product.specifications.length > 0
              ? product.specifications
              : [{ key: '', value: '' }]
          );
          setFeatures(product.features || []);
          setStockStatus(product.stockStatus || 'in_stock');
          setFeatured(Boolean(product.featured));
          setStatus(product.status || 'published');
          setSeoTitle(product.seoTitle || '');
          setSeoDescription(product.seoDescription || '');
          setSeoKeywords(product.seoKeywords ? product.seoKeywords.join(', ') : '');
        } catch (err: any) {
          setErrorMessage('Failed to load existing product for editing.');
        }
      };
      loadProduct();
    } else if (categories.length > 0 && !categoryId) {
      // Default to first category
      setCategoryId(categories[0]._id);
    }
  }, [id, isEditMode, categories]);

  // Image Upload handler
  const handleImageFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      setErrorMessage('');

      const uploadedList = await uploadService.uploadMultipleImages(Array.from(files));

      const newImages: IProductImage[] = uploadedList.map((item, idx) => ({
        url: item.url,
        publicId: item.publicId,
        isPrimary: images.length === 0 && idx === 0,
      }));

      setImages((prev) => [...prev, ...newImages]);
    } catch (err: any) {
      setErrorMessage(err.message || 'Image upload failed. Check format or size.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddManualImage = () => {
    if (!manualImageUrl.trim()) return;
    const isFirst = images.length === 0;
    setImages((prev) => [
      ...prev,
      {
        url: manualImageUrl.trim(),
        publicId: '',
        isPrimary: isFirst,
      },
    ]);
    setManualImageUrl('');
  };

  const handleSetPrimaryImage = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const handleDeleteImage = (index: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // If deleted image was primary, set first remaining image as primary
      if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
        updated[0].isPrimary = true;
      }
      return updated;
    });
  };

  // Specification Dynamic Rows
  const handleAddSpecRow = (key: string = '', value: string = '') => {
    setSpecifications((prev) => [...prev, { key, value }]);
  };

  const handleUpdateSpecRow = (index: number, field: 'key' | 'value', text: string) => {
    setSpecifications((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: text } : item))
    );
  };

  const handleDeleteSpecRow = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  // Feature Dynamic Bullets
  const handleAddFeature = () => {
    setFeatures((prev) => [...prev, '']);
  };

  const handleUpdateFeature = (index: number, text: string) => {
    setFeatures((prev) => prev.map((f, i) => (i === index ? text : f)));
  };

  const handleDeleteFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async (submitStatus?: 'published' | 'draft') => {
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter a product name.');
      return;
    }

    if (!categoryId) {
      setErrorMessage('Please select a category for this product.');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('Please enter a product description.');
      return;
    }

    // Filter out empty specs
    const cleanSpecs = specifications.filter((s) => s.key.trim() && s.value.trim());

    // Filter out empty features
    const cleanFeatures = features.filter((f) => f.trim());

    // Clean keywords
    const cleanKeywords = seoKeywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const productPayload: Partial<IProduct> = {
      name: name.trim(),
      category: categoryId as any,
      subcategory: subcategory.trim(),
      brand: brand.trim(),
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      showPrice,
      price: price ? Number(price) : undefined,
      mrp: mrp ? Number(mrp) : undefined,
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      priceLabel: priceLabel.trim(),
      images,
      specifications: cleanSpecs,
      features: cleanFeatures,
      stockStatus,
      featured,
      status: submitStatus || status,
      seoTitle: seoTitle.trim() || name.trim(),
      seoDescription: seoDescription.trim() || shortDescription.trim(),
      seoKeywords: cleanKeywords,
    };

    if (customSlug.trim()) {
      (productPayload as any).customSlug = customSlug.trim();
    }

    try {
      setIsSubmitting(true);
      if (isEditMode && id) {
        await productService.updateProduct(id, productPayload);
      } else {
        await productService.createProduct(productPayload);
      }
      navigate('/admin/products');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save product. Please check fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead title={isEditMode ? 'Edit Product' : 'Add New Product'} noIndex={true} />

      <div className="max-w-5xl mx-auto space-y-8 pb-16">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div className="flex items-center space-x-3">
            <Link
              to="/admin/products"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {isEditMode ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-xs text-slate-500">
                {isEditMode
                  ? 'Update model details, pricing, images, and specifications'
                  : 'Publish a new item to your online product catalogue'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              disabled={isSubmitting}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors shadow-sm disabled:opacity-60"
            >
              Save as Draft
            </button>

            <button
              type="button"
              onClick={() => handleSubmit('published')}
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md hover:shadow-lg flex items-center space-x-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span>{isEditMode ? 'Update Product' : 'Publish Product'}</span>
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* SECTION 1: BASIC INFORMATION */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">1. Basic Information</h2>
            <p className="text-xs text-slate-500">Product name, category, and descriptive details</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. ATOM 300kg Digital Heavy Duty Platform Weighing Scale"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Subcategory
                </label>
                <input
                  type="text"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  placeholder="e.g. Platform Scales, Rooftop Solar, Commercial RO"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Brand / Manufacturer
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. ATOM, Eagle, Luminous, AquaPure"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Short Summary Description
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief 1-2 sentence overview shown on product cards and search results..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Full Technical Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide detailed information regarding build quality, applications, power supply, warranty, and included accessories..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              ></textarea>
            </div>
          </div>
        </div>

        {/* SECTION 2: DYNAMIC PRICING SYSTEM */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">2. Pricing Configuration</h2>
            <p className="text-xs text-slate-500">
              Choose how the price is presented on the public catalogue
            </p>
          </div>

          <div className="space-y-4">
            {/* Pricing Mode Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Pricing Display Mode
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setShowPrice('exact')}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    showPrice === 'exact'
                      ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-100'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="block font-extrabold text-sm mb-0.5">Exact Price</span>
                  <span className="text-[10px] text-slate-500">e.g. ₹8,500</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPrice('mrp_selling')}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    showPrice === 'mrp_selling'
                      ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-100'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="block font-extrabold text-sm mb-0.5">MRP + Discount</span>
                  <span className="text-[10px] text-slate-500">MRP ₹10k & Sell ₹8.5k</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPrice('contact')}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    showPrice === 'contact'
                      ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-100'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="block font-extrabold text-sm mb-0.5">Contact for Price</span>
                  <span className="text-[10px] text-slate-500">Direct enquiry button</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPrice('quote')}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    showPrice === 'quote'
                      ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-100'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="block font-extrabold text-sm mb-0.5">Get a Quote</span>
                  <span className="text-[10px] text-slate-500">Industrial / Customized</span>
                </button>
              </div>
            </div>

            {/* Price values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Selling Price (₹ INR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 7800"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  MRP Price (₹ INR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                  placeholder="e.g. 9500"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Price Label / Unit
                </label>
                <input
                  type="text"
                  value={priceLabel}
                  onChange={(e) => setPriceLabel(e.target.value)}
                  placeholder="e.g. Starting from, Per Unit, Turnkey"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: PRODUCT IMAGES & UPLOADS */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">3. Product Images (Cloudinary)</h2>
            <p className="text-xs text-slate-500">
              Upload multiple JPG, PNG, or WebP product pictures. Select one image as Primary for product cards.
            </p>
          </div>

          {/* Upload Area */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl p-6 text-center bg-slate-50/50 transition-colors">
              <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700 mb-1">
                Drag and drop or browse product photos
              </p>
              <p className="text-[11px] text-slate-400 mb-4">
                Supported formats: JPG, PNG, WebP (Max 5MB per file)
              </p>

              <label className="inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow">
                {isUploading ? 'Uploading...' : 'Browse Images'}
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageFilesSelected}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* Manual Image URL Adder */}
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="url"
                value={manualImageUrl}
                onChange={(e) => setManualImageUrl(e.target.value)}
                placeholder="Or paste an image URL (e.g. https://images.unsplash.com/...)"
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={handleAddManualImage}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors"
              >
                Add URL
              </button>
            </div>

            {/* Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-3">
                {images.map((image, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-xl overflow-hidden border-2 bg-slate-100 group aspect-square flex items-center justify-center ${
                      image.isPrimary ? 'border-brand-600 ring-2 ring-brand-100 shadow' : 'border-slate-200'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Product preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {image.isPrimary && (
                      <span className="absolute top-1.5 left-1.5 bg-brand-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                        Primary
                      </span>
                    )}

                    {/* Overlay controls */}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      {!image.isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(idx)}
                          className="p-1.5 bg-white text-slate-800 hover:text-brand-600 rounded-lg shadow"
                          title="Set as Primary Image"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(idx)}
                        className="p-1.5 bg-white text-rose-600 hover:bg-rose-50 rounded-lg shadow"
                        title="Delete Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: DYNAMIC SPECIFICATIONS */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">4. Dynamic Specifications</h2>
              <p className="text-xs text-slate-500">
                Add flexible technical specifications customized to this exact machine model
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleAddSpecRow()}
              className="inline-flex items-center px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg text-xs font-bold transition-colors border border-brand-200"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add Specification</span>
            </button>
          </div>

          {/* Preset Buttons for Quick Adding */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
              Quick Presets:
            </span>
            {[
              'Capacity',
              'Accuracy',
              'Platform Size',
              'Display Type',
              'Power Supply',
              'Battery Backup',
              'Material',
              'Warranty',
              'Water Discharge',
              'Membrane Type',
            ].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleAddSpecRow(preset, '')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-md font-medium transition-colors"
              >
                + {preset}
              </button>
            ))}
          </div>

          {/* Spec Rows */}
          <div className="space-y-2.5">
            {specifications.map((spec, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={spec.key}
                  onChange={(e) => handleUpdateSpecRow(index, 'key', e.target.value)}
                  placeholder="Specification Name (e.g. Capacity)"
                  className="w-1/3 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => handleUpdateSpecRow(index, 'value', e.target.value)}
                  placeholder="Value (e.g. 300 kg / 450x450 mm)"
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteSpecRow(index)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Remove Specification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: FEATURES & INVENTORY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Key Bullet Features */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Key Feature Bullet Points</h2>
              <button
                type="button"
                onClick={handleAddFeature}
                className="text-xs font-bold text-brand-600 hover:underline flex items-center"
              >
                <Plus className="w-3.5 h-3.5 mr-0.5" />
                Add Bullet
              </button>
            </div>

            <div className="space-y-2">
              {features.map((feat, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => handleUpdateFeature(index, e.target.value)}
                    placeholder="e.g. Tare & zero functionality built-in"
                    className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteFeature(index)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Visibility & Inventory Settings */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Inventory & Visibility</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Stock Availability Status
                </label>
                <select
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="in_stock">In Stock (Immediate Dispatch)</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="on_request">Manufactured on Request (Made to order)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Publication Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="published">Published (Visible on live site)</option>
                  <option value="draft">Draft (Hidden from public)</option>
                  <option value="hidden">Hidden / Archived</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Mark as Featured Product
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Displays in the Featured section on the public homepage.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 6: SEO SETTINGS */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">6. Search Engine Optimization (SEO)</h2>
            <p className="text-xs text-slate-500">
              Customize meta tags, Google snippet title, and product slug for Google Search indexing
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Custom URL Slug (Optional)
                </label>
                <input
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  placeholder="Auto-generated if left blank"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  SEO Meta Title
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Defaults to Product Name"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                SEO Meta Description
              </label>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="High-converting search snippet description for Google results..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                SEO Keywords (Comma separated)
              </label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="e.g. ATOM digital scale, 300kg platform scale, commercial weighing machine"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Action Bar */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Cancel
          </Link>

          <button
            type="button"
            onClick={() => handleSubmit('published')}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md hover:shadow-lg flex items-center space-x-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            <span>{isEditMode ? 'Update Product' : 'Publish Product to Website'}</span>
          </button>
        </div>
      </div>
    </>
  );
};
