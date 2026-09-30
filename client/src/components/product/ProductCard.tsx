import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Eye, Sparkles } from 'lucide-react';
import { IProduct, ICategory } from '../../types';
import { PriceDisplay } from './PriceDisplay';
import { truncateText } from '../../utils/formatters';

interface ProductCardProps {
  product: IProduct;
  onEnquire?: (product: IProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEnquire }) => {
  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url ||
    product.images[0]?.url ||
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';

  const categoryName =
    typeof product.category === 'object' && product.category
      ? (product.category as ICategory).name
      : '';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-brand-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Thumbnail Container */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {categoryName && (
            <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-800 rounded-lg shadow-sm">
              {categoryName}
            </span>
          )}
          {product.featured && (
            <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white rounded-lg shadow-sm flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              Featured
            </span>
          )}
        </div>

        {/* Stock Status pill */}
        <div className="absolute bottom-3 right-3 z-10">
          {product.stockStatus === 'in_stock' && (
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-600/90 text-white rounded-md backdrop-blur-sm">
              In Stock
            </span>
          )}
          {product.stockStatus === 'out_of_stock' && (
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-rose-600/90 text-white rounded-md backdrop-blur-sm">
              Out of Stock
            </span>
          )}
          {product.stockStatus === 'on_request' && (
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-600/90 text-white rounded-md backdrop-blur-sm">
              Made to Order
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {product.brand && (
            <span className="text-xs font-semibold text-brand-600 tracking-wider uppercase block mb-1">
              {product.brand}
            </span>
          )}

          <Link to={`/products/${product.slug}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug mb-2">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {product.shortDescription || truncateText(product.description, 90)}
          </p>
        </div>

        {/* Pricing & CTA footer */}
        <div className="pt-4 border-t border-slate-100 mt-auto">
          <div className="mb-3">
            <PriceDisplay
              price={product.price}
              mrp={product.mrp}
              showPrice={product.showPrice}
              priceLabel={product.priceLabel}
              size="md"
            />
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/products/${product.slug}`}
              className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Details</span>
            </Link>

            {onEnquire && (
              <button
                type="button"
                onClick={() => onEnquire(product)}
                className="flex-1 py-2 px-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enquire</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
