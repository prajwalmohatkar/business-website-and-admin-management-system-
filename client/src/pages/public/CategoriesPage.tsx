import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { SEOHead } from '../../components/seo/SEOHead';

export const CategoriesPage: React.FC = () => {
  const { categories, settings } = useSettings();

  return (
    <>
      <SEOHead
        title="Product Categories & Equipment Portfolios"
        description={`Explore product categories at ${settings.businessName} including digital weighing machines, rooftop solar power installations, and commercial water purifiers.`}
      />

      <section className="bg-slate-900 text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Industrial & Commercial Hardware</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Product Categories
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-3">
            Select a specialized category below to view models, dynamic specifications, and wholesale quotations.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/products?category=${category.slug}`}
              className="group bg-white rounded-2xl border border-slate-200 hover:border-brand-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
            >
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                <img
                  src={
                    category.image ||
                    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                <div className="absolute bottom-4 left-5 right-5">
                  <h3 className="text-xl font-bold text-white drop-shadow-sm">
                    {category.name}
                  </h3>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {category.description ||
                    `High precision, durable, and certified ${category.name.toLowerCase()} for commercial and industrial use.`}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold text-brand-600 group-hover:text-brand-700">
                    Browse All Products
                  </span>
                  <ArrowRight className="w-4 h-4 text-brand-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
