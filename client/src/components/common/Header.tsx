import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Phone,
  Mail,
  Clock,
  Search,
  Menu,
  X,
  ChevronDown,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface HeaderProps {
  onOpenEnquiry?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenEnquiry }) => {
  const { settings, categories } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-slate-100">
      {/* Top Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 hidden md:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="flex items-center hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5 text-brand-400" />
              <span>{settings.phone}</span>
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="flex items-center hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 mr-1.5 text-brand-400" />
              <span>{settings.email}</span>
            </a>
            <div className="flex items-center text-slate-400">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-brand-400" />
              <span>{settings.businessHours}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-emerald-400 text-[11px] font-semibold tracking-wide uppercase">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Certified Commercial & Industrial Hardware
            </span>
            <Link to="/admin/login" className="hover:text-white text-slate-400 text-[11px]">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Business Logo & Name */}
          <Link to="/" className="flex items-center space-x-3 group">
            {settings.logo ? (
              <img
                src={settings.logo}
                alt={settings.businessName}
                className="w-10 h-10 object-contain rounded-lg"
              />
            ) : (
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:bg-brand-700 transition-colors">
                {settings.businessName.charAt(0)}
              </div>
            )}
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tight block">
                {settings.businessName}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                {settings.tagline.length > 40
                  ? `${settings.tagline.substring(0, 40)}...`
                  : settings.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden lg:block max-w-xs w-full mx-6">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search weighing, solar, purifier..."
                className="w-full pl-9 pr-4 py-2 bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-xs rounded-full border border-transparent focus:border-brand-500 focus:outline-none transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </form>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                isActive('/') ? 'text-brand-600 bg-brand-50' : 'text-slate-700 hover:text-brand-600 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            {/* Dynamic Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <button
                className={`flex items-center px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  location.pathname.startsWith('/products') || location.pathname === '/categories'
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-700 hover:text-brand-600 hover:bg-slate-50'
                }`}
              >
                <span>Categories</span>
                <ChevronDown className="w-4 h-4 ml-1 text-slate-400" />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Product Categories
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/products?category=${cat.slug}`}
                      onClick={() => setCategoriesDropdownOpen(false)}
                      className="flex items-center justify-between px-3.5 py-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                    >
                      <span className="font-medium">{cat.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  ))}
                  <div className="border-t border-slate-100 my-1"></div>
                  <Link
                    to="/categories"
                    onClick={() => setCategoriesDropdownOpen(false)}
                    className="flex items-center px-3.5 py-2 text-xs font-bold text-brand-600 hover:bg-brand-50 transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5 mr-1.5" />
                    View All Categories
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/products"
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                isActive('/products') && !location.search
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-slate-700 hover:text-brand-600 hover:bg-slate-50'
              }`}
            >
              All Products
            </Link>

            <Link
              to="/about"
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                isActive('/about') ? 'text-brand-600 bg-brand-50' : 'text-slate-700 hover:text-brand-600 hover:bg-slate-50'
              }`}
            >
              About
            </Link>

            <Link
              to="/contact"
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                isActive('/contact') ? 'text-brand-600 bg-brand-50' : 'text-slate-700 hover:text-brand-600 hover:bg-slate-50'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Action Button & Mobile Menu Toggle */}
          <div className="flex items-center space-x-3">
            <Link
              to="/quote"
              className="hidden sm:inline-flex items-center px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
            >
              Request Quote
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-100 text-sm rounded-lg border border-transparent focus:border-brand-500 focus:bg-white focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </form>

          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-lg font-medium text-sm ${
                isActive('/') ? 'bg-brand-50 text-brand-600' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-lg font-medium text-sm ${
                isActive('/products') ? 'bg-brand-50 text-brand-600' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              All Products
            </Link>

            {/* Dynamic Categories in Mobile Drawer */}
            <div className="py-2 pl-3 border-l-2 border-brand-200 ml-2 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Categories
              </span>
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/products?category=${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 text-sm text-slate-600 hover:text-brand-600"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-lg font-medium text-sm ${
                isActive('/about') ? 'bg-brand-50 text-brand-600' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-3 py-2 rounded-lg font-medium text-sm ${
                isActive('/contact') ? 'bg-brand-50 text-brand-600' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Contact Us
            </Link>
            <Link
              to="/quote"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg font-semibold text-sm bg-brand-600 text-white text-center shadow"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
