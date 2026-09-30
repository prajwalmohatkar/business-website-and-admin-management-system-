import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  ArrowRight,
  Phone,
  MessageSquare,
  ShieldCheck,
  Zap,
  Droplets,
  Scale,
  Sparkles,
  CheckCircle2,
  Wrench,
  Clock,
  Award,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { productService } from '../../services/productService';
import { IProduct } from '../../types';
import { ProductCard } from '../../components/product/ProductCard';
import { SkeletonCard } from '../../components/common/Skeleton';
import { SEOHead } from '../../components/seo/SEOHead';
import { OrganizationSchemaMarkup } from '../../components/seo/SchemaMarkup';
import { createWhatsAppUrl } from '../../utils/formatters';

export const HomePage: React.FC = () => {
  const { settings, categories, isLoading: isSettingsLoading } = useSettings();
  const { onOpenEnquiry } = useOutletContext<{ onOpenEnquiry: (p?: IProduct) => void }>();

  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoadingProducts(true);
        const res = await productService.getProducts({ featured: true, limit: 6 });
        setFeaturedProducts(res.products);
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleWhatsApp = () => {
    const url = createWhatsAppUrl(
      settings.whatsapp,
      `Hello ${settings.businessName}, I would like to enquire about your products and services.`
    );
    window.open(url, '_blank');
  };

  return (
    <>
      <SEOHead
        title="Industrial Weighing Scales, Solar Power & Water Purifiers"
        description={`${settings.businessName} provides precision Weighing Scale Machines, commercial & residential Solar Systems, and heavy duty Water Purification plants.`}
      />
      <OrganizationSchemaMarkup settings={settings} />

      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden py-16 sm:py-24">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-brand-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Certified Commercial & Industrial Supplier</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {settings.tagline || 'Reliable Solutions for Weighing, Solar & Water Purification'}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {settings.aboutBusiness
                ? settings.aboutBusiness.length > 180
                  ? `${settings.aboutBusiness.substring(0, 180)}...`
                  : settings.aboutBusiness
                : 'Direct supply, precision calibration, turnkey installation, and reliable after-sales maintenance support across India.'}
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/products"
                className="px-6 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg hover:shadow-brand-500/25 flex items-center space-x-2"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/contact"
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition-all border border-slate-700"
              >
                Contact Us
              </Link>

              <button
                onClick={handleWhatsApp}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg hover:shadow-emerald-600/25 flex items-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC PRODUCT CATEGORIES */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
              Core Specializations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore Our Product Categories
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Browse our diverse inventory of certified machinery, solar energy setups, and water treatment solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/products?category=${cat.slug}`}
                className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-brand-400 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img
                    src={
                      cat.image ||
                      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-sm">
                      {cat.name}
                    </h3>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {cat.description || `High-performance ${cat.name} engineered for precision and durability.`}
                  </p>

                  <span className="inline-flex items-center text-xs font-bold text-brand-600 group-hover:text-brand-700 mt-auto">
                    <span>Browse Products</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
                Handpicked Equipment
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Featured Products & Solutions
              </h2>
            </div>
            <Link
              to="/products"
              className="mt-4 md:mt-0 text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center group"
            >
              <span>View Complete Catalogue</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onEnquire={onOpenEnquiry}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500 text-sm">
                No featured products marked yet. Explore our full catalogue below.
              </p>
              <Link
                to="/products"
                className="mt-4 inline-block px-5 py-2.5 bg-brand-600 text-white rounded-lg text-xs font-bold"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
              Our Value Proposition
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Businesses & Homeowners Rely On Us
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              We combine premier manufacturing standards with dedicated field installation and calibration service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Government Stamping</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                All weighing scales are verified and stamped as per Legal Metrology Department norms for accurate commercial trading.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-solar-500/10 text-solar-500 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">High Efficiency Solar</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tier-1 Monocrystalline bifacial panels with 25-year performance warranties and government subsidy documentation assistance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-water-500/10 text-water-500 flex items-center justify-center mb-4">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Industrial Water Plants</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Custom SS 304 skid RO plants engineered with multi-stage pre-filtration, anti-scalant dosing, and certified high-rejection membranes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Prompt Service</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                On-demand field repair, annual maintenance contracts (AMC), genuine replacement spares, and emergency troubleshooting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION */}
      <section className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Need a Product, Custom Specification or Quotation?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Connect with our technical sales engineers for bulk discounts, turnkey solar consultations, and water filtration water testing.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/quote"
                className="px-6 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg hover:shadow-brand-500/25"
              >
                Request Free Quote
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition-all border border-slate-700"
              >
                Contact Sales Office
              </Link>
              <button
                onClick={handleWhatsApp}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg hover:shadow-emerald-600/25 flex items-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Directly</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
