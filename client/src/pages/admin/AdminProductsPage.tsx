import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { productService } from '../../services/productService';
import { useSettings } from '../../context/SettingsContext';
import { IProduct, ICategory } from '../../types';
import { Badge } from '../../components/common/Badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { PriceDisplay } from '../../components/product/PriceDisplay';
import { SEOHead } from '../../components/seo/SEOHead';
import { formatDate } from '../../utils/formatters';

export const AdminProductsPage: React.FC = () => {
  const { categories } = useSettings();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<IProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Success message toast
  const [toastMessage, setToastMessage] = useState('');

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await productService.getProducts({
        search: search.trim() || undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page: currentPage,
        limit: 15,
        isAdmin: true,
      });

      setProducts(res.products);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to load admin products', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, statusFilter, currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      const newFeatured = await productService.toggleFeatured(id);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, featured: newFeatured } : p))
      );
      showToast(newFeatured ? 'Marked as featured on homepage.' : 'Removed from featured products.');
    } catch (err: any) {
      alert(err.message || 'Failed to toggle featured status.');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
      await productService.toggleStatus(id, nextStatus);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: nextStatus as any } : p))
      );
      showToast(`Product status set to ${nextStatus}.`);
    } catch (err: any) {
      alert(err.message || 'Failed to toggle product status.');
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      setIsDeleting(true);
      await productService.deleteProduct(productToDelete._id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      showToast('Product deleted successfully.');
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product.');
    } finally {
      setIsDeleting(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <>
      <SEOHead title="Product Catalogue Management" noIndex={true} />

      <div className="space-y-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-semibold animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Product Catalogue
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Add new models, configure pricing, upload high-res images, and update technical specs.
            </p>
          </div>

          <Link
            to="/admin/products/new"
            className="inline-flex items-center px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>Add New Product</span>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by title, brand, or specs..."
              className="w-full pl-9 pr-20 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-slate-800 text-white rounded-lg text-xs font-semibold"
            >
              Search
            </button>
          </form>

          {/* Filters */}
          <div className="flex items-center space-x-2">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3.5 text-left">Item</th>
                  <th className="px-4 py-3.5 text-left">Category</th>
                  <th className="px-4 py-3.5 text-left">Pricing</th>
                  <th className="px-4 py-3.5 text-center">Featured</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5 text-left">Created</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      Loading products...
                    </td>
                  </tr>
                ) : products.length > 0 ? (
                  products.map((product) => {
                    const primaryImg =
                      product.images.find((img) => img.isPrimary)?.url ||
                      product.images[0]?.url ||
                      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=100&q=80';

                    const categoryName =
                      typeof product.category === 'object' && product.category
                        ? (product.category as ICategory).name
                        : 'Unassigned';

                    return (
                      <tr key={product._id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Item image + name + brand */}
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-3">
                            <img
                              src={primaryImg}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                            />
                            <div className="min-w-0 max-w-xs">
                              {product.brand && (
                                <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block">
                                  {product.brand}
                                </span>
                              )}
                              <Link
                                to={`/admin/products/edit/${product._id}`}
                                className="font-bold text-slate-900 hover:text-brand-600 line-clamp-1 text-xs"
                              >
                                {product.name}
                              </Link>
                              <span className="text-[10px] text-slate-400 block truncate">
                                /{product.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3 text-slate-700 font-medium whitespace-nowrap">
                          {categoryName}
                        </td>

                        {/* Pricing */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <PriceDisplay
                            price={product.price}
                            mrp={product.mrp}
                            showPrice={product.showPrice}
                            priceLabel={product.priceLabel}
                            size="sm"
                          />
                        </td>

                        {/* Featured Toggle Button */}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(product._id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              product.featured
                                ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                            }`}
                            title={product.featured ? 'Featured on Homepage' : 'Not Featured'}
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                        </td>

                        {/* Status Toggle Button */}
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(product._id, product.status)}
                            className="focus:outline-none"
                            title="Click to toggle publish status"
                          >
                            <Badge
                              variant={
                                product.status === 'published'
                                  ? 'success'
                                  : product.status === 'draft'
                                  ? 'warning'
                                  : 'gray'
                              }
                            >
                              {product.status.toUpperCase()}
                            </Badge>
                          </button>
                        </td>

                        {/* Created Date */}
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {formatDate(product.createdAt).split(',')[0]}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1">
                            <a
                              href={`/products/${product.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                              title="View on Live Site"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>

                            <Link
                              to={`/admin/products/edit/${product._id}`}
                              className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-slate-100"
                              title="Edit Product"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => {
                                setProductToDelete(product);
                                setDeleteDialogOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-500">
                      No products found. Click "Add New Product" to publish your first item!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Page {currentPage} of {totalPages} ({totalCount} total)
              </span>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Product"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => {
          setDeleteDialogOpen(false);
          setProductToDelete(null);
        }}
      />
    </>
  );
};
