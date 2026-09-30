import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Shield,
  Award,
  Wrench,
  Headphones,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const Footer: React.FC = () => {
  const { settings, categories } = useSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 pb-12 border-b border-slate-800/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="p-3 bg-brand-900/50 text-brand-400 rounded-xl border border-brand-800/50">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Certified Quality</h5>
              <p className="text-xs text-slate-400 mt-0.5">Government-approved standards</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="p-3 bg-solar-500/10 text-solar-500 rounded-xl border border-solar-500/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Genuine Warranty</h5>
              <p className="text-xs text-slate-400 mt-0.5">Direct manufacturer guarantee</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="p-3 bg-water-500/10 text-water-500 rounded-xl border border-water-500/20">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Installation Support</h5>
              <p className="text-xs text-slate-400 mt-0.5">Experienced on-site engineers</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="p-3 bg-scale-500/10 text-scale-500 rounded-xl border border-scale-500/20">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Fast After-Sales Service</h5>
              <p className="text-xs text-slate-400 mt-0.5">Prompt maintenance & spares</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Col 1: Business Info */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center space-x-3">
            {settings.logo ? (
              <img
                src={settings.logo}
                alt={settings.businessName}
                className="w-10 h-10 object-contain rounded-lg bg-white p-1"
              />
            ) : (
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-extrabold text-xl">
                {settings.businessName.charAt(0)}
              </div>
            )}
            <span className="text-xl font-bold text-white tracking-tight">
              {settings.businessName}
            </span>
          </Link>

          <p className="text-sm text-slate-400 leading-relaxed pr-4">
            {settings.aboutBusiness}
          </p>

          <div className="pt-2 text-xs text-slate-400 space-y-1">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-brand-400" />
              <span>{settings.businessHours}</span>
            </div>
          </div>
        </div>

        {/* Col 2: Dynamic Categories */}
        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
            Product Categories
          </h4>
          <ul className="space-y-2.5 text-sm">
            {categories.map((cat) => (
              <li key={cat._id}>
                <Link
                  to={`/products?category=${cat.slug}`}
                  className="hover:text-white transition-colors flex items-center group text-slate-400"
                >
                  <ArrowRight className="w-3 h-3 mr-2 text-slate-600 group-hover:text-brand-400 transition-colors" />
                  <span>{cat.name}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/categories"
                className="text-brand-400 hover:text-brand-300 font-medium text-xs flex items-center pt-1"
              >
                Browse All Categories →
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Quick Navigation */}
        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="text-slate-400 hover:text-white transition-colors">
                Product Catalogue
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                Contact & Support
              </Link>
            </li>
            <li>
              <Link to="/quote" className="text-slate-400 hover:text-white transition-colors">
                Request a Quotation
              </Link>
            </li>
            <li>
              <Link to="/admin/login" className="text-slate-500 hover:text-slate-300 transition-colors text-xs pt-1 block">
                Admin Login
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact & Location */}
        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
            Get In Touch
          </h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-brand-400 mt-1 flex-shrink-0" />
              <span>
                {settings.address}, {settings.city}, {settings.state} - {settings.pincode}
              </span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="hover:text-white transition-colors"
              >
                {settings.phone}
              </a>
            </li>
            <li className="flex items-center space-x-3">
              <MessageSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                WhatsApp: {settings.whatsapp}
              </a>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <a
                href={`mailto:${settings.email}`}
                className="hover:text-white transition-colors break-all"
              >
                {settings.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright & Legal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>
          © {currentYear} {settings.businessName}. All rights reserved.
        </p>
        <p className="flex items-center space-x-4">
          <span>Engineered for Reliability</span>
          <span>•</span>
          <Link to="/contact" className="hover:text-slate-400">
            Enquire Today
          </Link>
        </p>
      </div>
    </footer>
  );
};
