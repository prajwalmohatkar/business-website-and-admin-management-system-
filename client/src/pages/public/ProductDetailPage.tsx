import React, { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import {
  ChevronRight,
  Phone,
  MessageSquare,
  Send,
  CheckCircle2,
  Share2,
  Shield,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { productService } from '../../services/productService';
import { useSettings } from '../../context/SettingsContext';
import { IProduct, ICategory } from '../../types';
import { ImageGallery } from '../../components/product/ImageGallery';
import { PriceDisplay } from '../../components/product/PriceDisplay';
import { DynamicSpecs } from '../../components/product/DynamicSpecs';
import { ProductCard } from '../../components/product/ProductCard';
import { SEOHead } from '../../components/seo/SEOHead';
import { ProductSchemaMarkup } from '../../components/seo/SchemaMarkup';
import { createWhatsAppUrl } from '../../utils/formatters';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { settings } = useSettings();
  const { onOpenEnquiry } = useOutletContext<{ onOpenEnquiry: (p?: IProduct) => void }>();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        setIsLoading(true);
        setError(null);
        const data = await productService.getProductBySlug(slug);
        setProduct(data.product);
        setRelatedProducts(data.relatedProducts || []);
      } catch (err: any) {
        setError(err.message || 'Product not found.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="w-full aspect-square bg-slate-200 rounded-2xl"></div>
          <div className="space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/4"></div>
            <div className="h-10 bg-slate-200 rounded w-3/4"></div>
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="h-24 bg-slate-100 rounded w-full"></div>
            <div className="h-12 bg-slate-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">
            The product you are looking for may have been removed, renamed, or is temporarily unavailable.
          </p>
          <Link
            to="/products"
            className="inline-block px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-xl text-sm hover:bg-brand-700 transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  const categoryObj = typeof product.category === 'object' ? (product.category as ICategory) : null;
  const primaryImage = product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url;

  const whatsappMessage = `Hello, I am interested in ${product.name}. Please provide more details and price. (Link: ${window.location.href})`;
  const whatsappUrl = createWhatsAppUrl(settings.whatsapp, whatsappMessage);

  return (
    <>
      <SEOHead
        title={product.seoTitle || product.name}
        description={product.seoDescription || product.shortDescription || product.description}
        keywords={product.seoKeywords}
        ogImage={primaryImage}
        ogType="product"
      />
      <ProductSchemaMarkup product={product} businessSettings={settings} />

      <div className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center text-xs text-slate-500 space-x-1.5 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-brand-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <Link to="/products" className="hover:text-brand-600 transition-colors">
              Products
            </Link>
            {categoryObj && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <Link
                  to={`/products?category=${categoryObj.slug}`}
                  className="hover:text-brand-600 transition-colors"
                >
                  {categoryObj.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-slate-800 font-semibold truncate max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left: Interactive Image Gallery (5 cols on lg) */}
          <div className="lg:col-span-6">
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Right: Product Information & CTAs (6 cols on lg) */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="space-y-4">
              {/* Category, Brand, Share */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {categoryObj && (
                    <Link
                      to={`/products?category=${categoryObj.slug}`}
                      className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-700 rounded-md hover:bg-brand-100 transition-colors"
                    >
                      {categoryObj.name}
                    </Link>
                  )}
                  {product.brand && (
                    <span className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100 rounded-md">
                      Brand: {product.brand}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleShare}
                  className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors text-xs flex items-center space-x-1"
                  title="Share product link"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
                </button>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Stock Status Badge */}
              <div className="flex items-center space-x-3">
                {product.stockStatus === 'in_stock' && (
                  <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                    Ready in Stock (Fast Dispatch)
                  </span>
                )}
                {product.stockStatus === 'out_of_stock' && (
                  <span className="inline-flex items-center text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                    Temporarily Out of Stock
                  </span>
                )}
                {product.stockStatus === 'on_request' && (
                  <span className="inline-flex items-center text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    Manufactured on Order
                  </span>
                )}
              </div>

              {/* Pricing Box */}
              <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <PriceDisplay
                  price={product.price}
                  mrp={product.mrp}
                  showPrice={product.showPrice}
                  priceLabel={product.priceLabel}
                  size="lg"
                />
                <p className="text-[11px] text-slate-500 mt-2">
                  * Prices are subject to applicable taxes, freight charges, and optional on-site installation.
                </p>
              </div>

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-sm text-slate-600 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}

              {/* Action Buttons: Request Quote, WhatsApp, Call */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => onOpenEnquiry(product)}
                  className="flex-1 py-3.5 px-6 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Enquire Now / Get Quote</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>

                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm transition-colors flex items-center justify-center space-x-1"
                  title="Direct Phone Call"
                >
                  <Phone className="w-4 h-4" />
                  <span className="sm:hidden ml-1">Call Us</span>
                </a>
              </div>

              {/* Trust Features Strip */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Shield className="w-4 h-4 text-brand-600 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-slate-800 block">Warranty</span>
                  <span className="text-[10px] text-slate-500">100% Genuine</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Truck className="w-4 h-4 text-brand-600 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-slate-800 block">Fast Delivery</span>
                  <span className="text-[10px] text-slate-500">Across India</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <RotateCcw className="w-4 h-4 text-brand-600 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-slate-800 block">Support</span>
                  <span className="text-[10px] text-slate-500">Full AMC Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description, Dynamic Specifications, and Features */}
        <div className="mt-16 pt-12 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Full Description & Features (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Detailed Product Overview
              </h2>
              <div className="prose prose-slate max-w-none text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>

            {/* Key Features Bullet List */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  Key Features & Advantages
                </h3>
                <ul className="space-y-3">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2.5 mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Technical Dynamic Specifications Table (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 sticky top-28">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                Technical Specifications
              </h3>
              <DynamicSpecs specifications={product.specifications} />
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
                  Similar Solutions
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Related Products
                </h2>
              </div>
              {categoryObj && (
                <Link
                  to={`/products?category=${categoryObj.slug}`}
                  className="text-xs sm:text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center"
                >
                  <span>View All in {categoryObj.name}</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard
                  key={relProduct._id}
                  product={relProduct}
                  onEnquire={onOpenEnquiry}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
