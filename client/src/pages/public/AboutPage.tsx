import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Award,
  Users,
  Building2,
  CheckCircle2,
  ArrowRight,
  Wrench,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { SEOHead } from '../../components/seo/SEOHead';

export const AboutPage: React.FC = () => {
  const { settings, categories } = useSettings();

  return (
    <>
      <SEOHead
        title="About Us - Leading Industrial Equipment & Solar Supplier"
        description={`Learn more about ${settings.businessName}, an authorized supplier of precision weighing scale machines, rooftop solar plants, and water purifiers.`}
      />

      <section className="bg-slate-900 text-white py-14 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 block mb-2">
            Company Overview
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            About {settings.businessName}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed">
            {settings.tagline}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Mission & Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block">
              Our Journey & Commitment
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Delivering Industrial Excellence & Sustainable Technologies
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {settings.aboutBusiness}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Over the years, we have built a reputation on three foundational pillars: genuine build quality, accurate metrology compliance, and prompt technical support. Whether providing high-tonnage weighing bridges for logistics yards, turnkey rooftop solar setups under government subsidy schemes, or high-capacity commercial RO water plants for schools and manufacturing units, our priority remains unmatched reliability.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-4 bg-brand-50 rounded-xl border border-brand-100">
                <span className="text-2xl font-extrabold text-brand-700 block">100%</span>
                <span className="text-xs font-semibold text-slate-600">Legal Stamping & Compliance</span>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-2xl font-extrabold text-emerald-700 block">24/7</span>
                <span className="text-xs font-semibold text-slate-600">Customer Support & AMC</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
              alt="Engineering and Assembly facility"
              className="rounded-3xl shadow-xl border border-slate-200 object-cover w-full h-[420px]"
            />
          </div>
        </div>

        {/* Pillars / Values Section */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
              Why Work With Us
            </span>
            <h3 className="text-2xl font-bold text-slate-900">
              Core Principles Behind Every Installation
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Uncompromising Quality</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We strictly partner with certified manufacturers and Tier-1 component providers to guarantee maximum operational life and zero premature equipment failure.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-solar-500/10 text-solar-500 flex items-center justify-center mb-6">
                <Wrench className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Turnkey Execution</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                From initial site measurement and water TDS testing to structural fabrication, wiring, DISCOM net-metering approvals, and stamping, we handle everything.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Long-Term Maintenance</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We stand firmly behind our products with comprehensive warranty protection, readily available spare parts, and dependable on-site servicing.
              </p>
            </div>
          </div>
        </div>

        {/* CTA banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Have a Specific Equipment Requirement?
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-8">
            Our experienced team is ready to evaluate your capacity requirements and propose an optimal, cost-effective solution.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl text-sm transition-colors shadow-md"
            >
              Contact Our Engineers
            </Link>
            <Link
              to="/products"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition-colors border border-slate-700"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
