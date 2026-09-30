import React from 'react';
import { formatCurrency, calculateDiscount } from '../../utils/formatters';

interface PriceDisplayProps {
  price?: number;
  mrp?: number;
  showPrice: 'exact' | 'mrp_selling' | 'contact' | 'quote';
  priceLabel?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  mrp,
  showPrice,
  priceLabel,
  size = 'md',
}) => {
  const discount = calculateDiscount(mrp, price);

  const sizeClasses = {
    sm: {
      price: 'text-base font-bold',
      mrp: 'text-xs',
      badge: 'text-[10px] px-1.5 py-0.5',
    },
    md: {
      price: 'text-xl font-extrabold',
      mrp: 'text-sm',
      badge: 'text-xs px-2 py-0.5',
    },
    lg: {
      price: 'text-3xl font-black',
      mrp: 'text-base',
      badge: 'text-xs px-2.5 py-1',
    },
  };

  if (showPrice === 'contact') {
    return (
      <div className="flex flex-col">
        <span className={`${sizeClasses[size].price} text-brand-600`}>
          Contact for Price
        </span>
        {priceLabel && <span className="text-xs text-slate-500 mt-0.5">{priceLabel}</span>}
      </div>
    );
  }

  if (showPrice === 'quote') {
    return (
      <div className="flex flex-col">
        <span className={`${sizeClasses[size].price} text-slate-800`}>
          Get a Quote
        </span>
        {priceLabel && <span className="text-xs text-slate-500 mt-0.5">{priceLabel}</span>}
      </div>
    );
  }

  if (showPrice === 'mrp_selling' && mrp && price && mrp > price) {
    return (
      <div className="flex flex-col">
        {priceLabel && <span className="text-xs text-slate-500 mb-0.5">{priceLabel}</span>}
        <div className="flex items-baseline space-x-2 flex-wrap">
          <span className={`${sizeClasses[size].price} text-slate-900 tracking-tight`}>
            {formatCurrency(price)}
          </span>
          <span className={`${sizeClasses[size].mrp} text-slate-400 line-through`}>
            {formatCurrency(mrp)}
          </span>
          {discount > 0 && (
            <span
              className={`${sizeClasses[size].badge} font-bold text-emerald-700 bg-emerald-100 rounded-md`}
            >
              {discount}% OFF
            </span>
          )}
        </div>
      </div>
    );
  }

  // Fallback to exact price
  return (
    <div className="flex flex-col">
      {priceLabel && <span className="text-xs text-slate-500 mb-0.5">{priceLabel}</span>}
      <span className={`${sizeClasses[size].price} text-slate-900 tracking-tight`}>
        {price ? formatCurrency(price) : 'Price on Request'}
      </span>
    </div>
  );
};
