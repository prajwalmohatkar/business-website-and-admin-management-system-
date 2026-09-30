import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Layers,
  Inbox,
  Sparkles,
  Plus,
  ArrowRight,
  Phone,
  MessageSquare,
  Mail,
  CheckCircle,
  Clock,
  Eye,
  Settings,
} from 'lucide-react';
import { api } from '../../services/api';
import { IDashboardStats, IProduct, IEnquiry } from '../../types';
import { Badge } from '../../components/common/Badge';
import { SEOHead } from '../../components/seo/SEOHead';
import { formatDate, createWhatsAppUrl } from '../../utils/formatters';
import { useSettings } from '../../context/SettingsContext';

export const AdminDashboardPage: React.FC = () => {
  const { settings } = useSettings();

  const [stats, setStats] = useState<IDashboardStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalCategories: 0,
    featuredProducts: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
  });
  const [recentProducts, setRecentProducts] = useState<IProduct[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<IEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const res = await api.get<{
          success: boolean;
          stats: IDashboardStats;
          recentProducts: IProduct[];
          recentEnquiries: IEnquiry[];
        }>('/stats/dashboard');

        if (res.data.success) {
          setStats(res.data.stats);
          setRecentProducts(res.data.recentProducts || []);
          setRecentEnquiries(res.data.recentEnquiries || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <>
      <SEOHead title="Admin Dashboard Overview" noIndex={true} />

      <div className="space-y-8">
        {/* Top Header & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Live business statistics, inventory metrics, and customer quote requests.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/admin/products/new"
              className="inline-flex items-center px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Add New Product</span>
            </Link>

            <Link
              to="/admin/categories"
              className="inline-flex items-center px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-sm transition-colors"
            >
              <Layers className="w-4 h-4 mr-1.5 text-slate-400" />
              <span>Categories</span>
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Total Products */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-brand-600 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total Products
              </span>
              <Package className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-slate-900">{stats.totalProducts}</div>
            <div className="text-[10px] text-slate-500 mt-1 font-medium">In Catalogue</div>
          </div>

          {/* Active Products */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-600 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Published
              </span>
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-emerald-600">{stats.activeProducts}</div>
            <div className="text-[10px] text-slate-500 mt-1 font-medium">Visible to Public</div>
          </div>

          {/* Categories */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-indigo-600 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Categories
              </span>
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-slate-900">{stats.totalCategories}</div>
            <div className="text-[10px] text-slate-500 mt-1 font-medium">Active Groups</div>
          </div>

          {/* Featured */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Featured
              </span>
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-amber-600">{stats.featuredProducts}</div>
            <div className="text-[10px] text-slate-500 mt-1 font-medium">On Homepage</div>
          </div>

          {/* New Enquiries */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-rose-600 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                New Quotes
              </span>
              <Inbox className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-rose-600">{stats.newEnquiries}</div>
            <div className="text-[10px] text-rose-500 mt-1 font-bold">Needs Action</div>
          </div>

          {/* Total Enquiries */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-600 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total Quotes
              </span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-2xl font-black text-slate-900">{stats.totalEnquiries}</div>
            <div className="text-[10px] text-slate-500 mt-1 font-medium">All Time</div>
          </div>
        </div>

        {/* Split Grid: Recent Enquiries & Recent Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Recent Enquiries (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Customer Enquiries</h3>
                <p className="text-xs text-slate-500">Latest quotation requests from website visitors</p>
              </div>
              <Link
                to="/admin/enquiries"
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {recentEnquiries.length > 0 ? (
              <div className="space-y-3 flex-1">
                {recentEnquiries.map((enq) => {
                  const whatsappUrl = createWhatsAppUrl(
                    enq.mobile,
                    `Hello ${enq.name}, thank you for contacting ${settings.businessName} regarding ${enq.productName || 'our products'}.`
                  );

                  return (
                    <div
                      key={enq._id}
                      className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-slate-900">{enq.name}</span>
                          <Badge
                            variant={
                              enq.status === 'new'
                                ? 'danger'
                                : enq.status === 'contacted'
                                ? 'warning'
                                : 'success'
                            }
                          >
                            {enq.status.toUpperCase()}
                          </Badge>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {formatDate(enq.createdAt)}
                        </span>
                      </div>

                      {enq.productName && (
                        <p className="text-xs font-semibold text-brand-700">
                          Product: {enq.productName}
                        </p>
                      )}

                      <p className="text-xs text-slate-600 line-clamp-2 italic">
                        "{enq.message}"
                      </p>

                      {/* Quick Contact Action Bar */}
                      <div className="pt-2 flex items-center space-x-3 text-xs">
                        <a
                          href={`tel:${enq.mobile.replace(/\s+/g, '')}`}
                          className="font-bold text-slate-700 hover:text-brand-600 flex items-center"
                        >
                          <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          <span>{enq.mobile}</span>
                        </a>

                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-emerald-600 hover:text-emerald-700 flex items-center"
                        >
                          <MessageSquare className="w-3.5 h-3.5 mr-1" />
                          <span>WhatsApp</span>
                        </a>

                        {enq.email && (
                          <a
                            href={`mailto:${enq.email}`}
                            className="text-slate-500 hover:text-slate-800 flex items-center truncate max-w-xs"
                          >
                            <Mail className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            <span>{enq.email}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                No customer enquiries received yet.
              </div>
            )}
          </div>

          {/* Right Column: Recent Products (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recent Products</h3>
                <p className="text-xs text-slate-500">Recently added inventory items</p>
              </div>
              <Link
                to="/admin/products"
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center"
              >
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {recentProducts.length > 0 ? (
              <div className="space-y-3 flex-1">
                {recentProducts.map((prod) => (
                  <div
                    key={prod._id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center space-x-3"
                  >
                    <img
                      src={
                        prod.images[0]?.url ||
                        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={prod.name}
                      className="w-12 h-12 rounded-lg object-cover bg-white border border-slate-200 flex-shrink-0"
                    />

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{prod.name}</h4>
                      <p className="text-[11px] text-slate-500">
                        {typeof prod.category === 'object' && prod.category
                          ? (prod.category as any).name
                          : 'General'}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <Badge variant={prod.status === 'published' ? 'success' : 'gray'}>
                        {prod.status}
                      </Badge>
                      <Link
                        to={`/admin/products/edit/${prod._id}`}
                        className="block text-[11px] font-bold text-brand-600 hover:underline mt-1"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                No products found. Click "Add New Product" to create one.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
