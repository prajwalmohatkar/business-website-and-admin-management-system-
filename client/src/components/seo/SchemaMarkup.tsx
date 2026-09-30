import React from 'react';
import { IProduct, IBusinessSettings } from '../../types';

interface ProductSchemaProps {
  product: IProduct;
  businessSettings: IBusinessSettings;
}

export const ProductSchemaMarkup: React.FC<ProductSchemaProps> = ({ product, businessSettings }) => {
  const primaryImage = product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url || '';
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const schema: any = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images.map((img) => img.url),
    description: product.shortDescription || product.description,
    sku: product.slug,
    brand: {
      '@type': 'Brand',
      name: product.brand || businessSettings.businessName,
    },
  };

  // Add Offers only if a price is configured
  if (product.price && product.showPrice !== 'contact' && product.showPrice !== 'quote') {
    schema.offers = {
      '@type': 'Offer',
      url: currentUrl,
      priceCurrency: 'INR',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.stockStatus === 'in_stock'
          ? 'https://schema.org/InStock'
          : product.stockStatus === 'out_of_stock'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/PreOrder',
      seller: {
        '@type': 'Organization',
        name: businessSettings.businessName,
      },
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface OrganizationSchemaProps {
  settings: IBusinessSettings;
}

export const OrganizationSchemaMarkup: React.FC<OrganizationSchemaProps> = ({ settings }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.businessName,
    description: settings.aboutBusiness || settings.tagline,
    url: typeof window !== 'undefined' ? window.location.origin : '',
    telephone: settings.phone,
    email: settings.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: settings.city,
      addressRegion: settings.state,
      postalCode: settings.pincode,
      addressCountry: 'IN',
    },
    priceRange: '₹₹',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
