import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FileText,
  Send,
  CheckCircle,
  Phone,
  MessageSquare,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { productService } from '../../services/productService';
import { enquiryService } from '../../services/enquiryService';
import { IProduct } from '../../types';
import { SEOHead } from '../../components/seo/SEOHead';
import { createWhatsAppUrl } from '../../utils/formatters';

export const QuotePage: React.FC = () => {
  const { settings, categories } = useSettings();
  const [searchParams] = useSearchParams();

  const productParam = searchParams.get('product') || '';

  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState(productParam);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await productService.getProducts({ limit: 100 });
        setProducts(res.products);
      } catch (err) {
        console.error('Failed to load products for quote selector', err);
      }
    };
    loadProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!message.trim()) {
      setErrorMessage('Please describe your requirements.');
      return;
    }

    try {
      setIsSubmitting(true);
      await enquiryService.submitEnquiry({
        name: name.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        productId: selectedProductId || undefined,
        message: message.trim(),
      });
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const url = createWhatsAppUrl(
      settings.whatsapp,
      `Hello ${settings.businessName}, I would like to request an official quotation.`
    );
    window.open(url, '_blank');
  };

  return (
    <>
      <SEOHead
        title="Request a Quotation & Price Estimate"
        description={`Get a formal pricing quotation for commercial weighing scales, solar systems, or RO plants from ${settings.businessName}.`}
      />

      <section className="bg-slate-900 text-white py-14 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 block mb-2">
            Commercial & Industrial Quotation
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Request an Official Quotation
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
            Direct factory & wholesale prices, GST compliance, warranty coverage, and turnkey on-site installation estimates.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
          {isSuccess ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="text-2xl font-bold text-slate-900">Quotation Request Submitted!</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you, <span className="font-bold">{name}</span>. Our sales team is preparing your official estimate and will call you at <span className="font-bold">{mobile}</span> shortly.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={handleWhatsApp}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Receive Quote on WhatsApp</span>
                </button>
                <Link
                  to="/products"
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
                >
                  Continue Browsing Products
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900">Product & Project Details</h3>
                <p className="text-xs text-slate-500">
                  Select a specific model or describe custom parameters (capacity, voltage, dimensions, TDS)
                </p>
              </div>

              {errorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* Product Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Interested Product (Optional)
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                >
                  <option value="">-- General Quote / Not sure which model --</option>
                  {products.map((prod) => (
                    <option key={prod._id} value={prod._id}>
                      {prod.name} {prod.brand ? `(${prod.brand})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Contact Information */}
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                      Full Name / Company Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Enterprises"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                        Mobile Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-slate-400">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="9876543210"
                          className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contact@enterprise.com"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                      Requirement Details & Destination Location <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Specify required capacity (e.g. 500kg weighing scale, 10kW rooftop solar, 500 LPH RO plant), quantity, delivery city/pincode, or any special specifications..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 px-6 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Submit Quotation Request</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Directly</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};
