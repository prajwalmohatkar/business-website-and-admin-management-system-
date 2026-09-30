import React, { useState, useEffect } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, X, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { productService } from '../../services/productService';
import { useSettings } from '../../context/SettingsContext';
import { IProduct } from '../../types';
import { ProductCard } from '../../components/product/ProductCard';
import { SkeletonCard } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { SEOHead } from '../../components/seo/SEOHead';

export const ProductsPage: React.FC = () => {
  const { categories, settings } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();
  const { onOpenEnquiry } = useOutletContext<{ onOpenEnquiry: (p?: IProduct) => void }>();

  const currentCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [sortBy, setSortBy] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(pageParam);

  const [products, setProducts] = useState<IProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state when URL params change
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSearch(searchParams.get('search') || '');
    setSortBy(searchParams.get('sort') || 'newest');
    setCurrentPage(parseInt(searchParams.get('page') || '1', 10));
  }, [searchParams]);

  // Fetch products
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setIsLoading(true);
        const res = await productService.getProducts({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: search.trim() || undefined,
          sortBy,
          page: currentPage,
          limit: 12,
        });
        setProducts(res.products);
        setTotalCount(res.totalCount);
        setTotalPages(res.totalPages);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalog();
  }, [selectedCategory, search, sortBy, currentPage]);

  const updateFilters = (newCat: string, newSearch: string, newSort: string, newPage: number = 1) => {
    const params: any = {};
    if (newCat && newCat !== 'all') params.category = newCat;
    if (newSearch && newSearch.trim()) params.search = newSearch.trim();
    if (newSort && newSort !== 'newest') params.sort = newSort;
    if (newPage > 1) params.page = newPage.toString();
    setSearchParams(params);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(selectedCategory, search, sortBy, 1);
  };

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    updateFilters(slug, search, sortBy, 1);
  };

  const handleSortChange = (sortVal: string) => {
    setSortBy(sortVal);
    updateFilters(selectedCategory, search, sortVal, 1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSortBy('newest');
    setSearchParams({});
  };

  // Find active category name for SEO and heading
  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const pageTitle = activeCategoryObj ? activeCategoryObj.name : 'All Products & Equipment';

  return (
    <>
      <SEOHead
        title={`${pageTitle} Catalogue`}
        description={`Explore our comprehensive inventory of ${pageTitle.toLowerCase()} with direct manufacturer specifications, genuine warranty, and instant quotation.`}
      />

      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400 block mb-1">
              Product Catalogue
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              {pageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              {activeCategoryObj?.description ||
                'Find certified Weighing Scales, Solar Power Units, and Water Purification Systems designed for rigorous residential and industrial performance.'}
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Top Controls: Search Bar and Sorting */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product name, brand, capacity (e.g. 300kg, ATOM, 5kW)..."
                className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg text-xs transition-colors"
              >
                Search
              </button>
            </form>

            {/* Sorting Dropdown */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <label htmlFor="sortSelect" className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                Sort By:
              </label>
              <select
                id="sortSelect"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Dynamic Category Filter Pills */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 hidden sm:inline">
              Category:
            </span>

            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>

            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.slug
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}

            {(selectedCategory !== 'all' || search) && (
              <button
                onClick={handleClearFilters}
                className="ml-auto inline-flex items-center text-xs font-semibold text-rose-600 hover:text-rose-700 whitespace-nowrap px-2 py-1"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-medium text-slate-500">
            Showing <span className="font-bold text-slate-800">{products.length}</span> of{' '}
            <span className="font-bold text-slate-800">{totalCount}</span> products
          </p>
        </div>

        {/* Product Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onEnquire={onOpenEnquiry}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Products Found"
            description="We could not find any products matching your selected category and search criteria. Try removing keywords or browse all categories."
            actionText="View All Products"
            onAction={handleClearFilters}
          />
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center space-x-2">
            <button
              onClick={() => updateFilters(selectedCategory, search, sortBy, currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const p = idx + 1;
              return (
                <button
                  key={p}
                  onClick={() => updateFilters(selectedCategory, search, sortBy, p)}
                  className={`w-10 h-10 rounded-lg text-xs font-bold transition-colors ${
                    currentPage === p
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => updateFilters(selectedCategory, search, sortBy, currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
