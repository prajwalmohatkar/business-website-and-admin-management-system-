import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Package, ArrowLeft } from 'lucide-react';
import { SEOHead } from '../../components/seo/SEOHead';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEOHead title="404 - Page Not Found" noIndex={true} />
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl">
          <span className="text-6xl font-black text-brand-600 block mb-2">404</span>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
          <p className="text-xs sm:text-sm text-slate-500 mb-8 leading-relaxed">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-2 shadow-md"
            >
              <Home className="w-4 h-4" />
              <span>Go to Home</span>
            </Link>

            <Link
              to="/products"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <Package className="w-4 h-4" />
              <span>Browse Products</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
