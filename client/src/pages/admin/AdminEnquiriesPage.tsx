import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  Phone,
  MessageSquare,
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { enquiryService } from '../../services/enquiryService';
import { IEnquiry } from '../../types';
import { Badge } from '../../components/common/Badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { SEOHead } from '../../components/seo/SEOHead';
import { formatDate, createWhatsAppUrl } from '../../utils/formatters';
import { useSettings } from '../../context/SettingsContext';

export const AdminEnquiriesPage: React.FC = () => {
  const { settings } = useSettings();

  const [enquiries, setEnquiries] = useState<IEnquiry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [newCount, setNewCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Selected enquiry for notes or deletion
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState<IEnquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState('');

  const fetchEnquiries = async () => {
    try {
      setIsLoading(true);
      const res = await enquiryService.getEnquiries({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: search.trim() || undefined,
        page: currentPage,
        limit: 15,
      });

      setEnquiries(res.enquiries);
      setTotalCount(res.totalCount);
      setNewCount(res.newCount);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to load enquiries', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter, currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchEnquiries();
  };

  const handleStatusChange = async (id: string, newStatus: 'new' | 'contacted' | 'completed') => {
    try {
      await enquiryService.updateEnquiryStatus(id, newStatus);
      setEnquiries((prev) =>
        prev.map((e) => (e._id === id ? { ...e, status: newStatus } : e))
      );
      showToast(`Enquiry marked as ${newStatus}.`);
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const confirmDelete = async () => {
    if (!enquiryToDelete) return;
    try {
      setIsDeleting(true);
      await enquiryService.deleteEnquiry(enquiryToDelete._id);
      showToast('Enquiry deleted.');
      setDeleteDialogOpen(false);
      setEnquiryToDelete(null);
      fetchEnquiries();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
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
      <SEOHead title="Customer Enquiries Management" noIndex={true} />

      <div className="space-y-6">
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-semibold animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Customer Enquiries & Quotations
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage incoming lead submissions, client quote requests, and communication history.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl flex items-center">
              <span className="w-2 h-2 rounded-full bg-rose-500 mr-2 animate-pulse"></span>
              {newCount} New Enquiries
            </span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Status Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Enquiries' },
              { id: 'new', label: 'New' },
              { id: 'contacted', label: 'Contacted' },
              { id: 'completed', label: 'Completed' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-sm w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, product..."
              className="w-full pl-9 pr-16 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-2.5 bg-slate-800 text-white rounded-lg text-xs font-semibold"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Enquiries Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5 text-left">Customer</th>
                  <th className="px-5 py-3.5 text-left">Contact & Quick Connect</th>
                  <th className="px-5 py-3.5 text-left">Interested Product</th>
                  <th className="px-5 py-3.5 text-left">Message / Specs</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-left">Date</th>
                  <th className="px-5 py-3.5 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400">
                      Loading enquiries...
                    </td>
                  </tr>
                ) : enquiries.length > 0 ? (
                  enquiries.map((enquiry) => {
                    const whatsappUrl = createWhatsAppUrl(
                      enquiry.mobile,
                      `Hello ${enquiry.name}, thank you for contacting ${settings.businessName} regarding ${enquiry.productName || 'our equipment'}. How can we assist you with pricing and delivery?`
                    );

                    return (
                      <tr key={enquiry._id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Name */}
                        <td className="px-5 py-3.5">
                          <span className="font-bold text-slate-900 block text-xs">
                            {enquiry.name}
                          </span>
                        </td>

                        {/* Quick Contact Action Buttons */}
                        <td className="px-5 py-3.5">
                          <div className="space-y-1.5">
                            <div className="flex items-center space-x-2">
                              <a
                                href={`tel:${enquiry.mobile.replace(/\s+/g, '')}`}
                                className="font-bold text-slate-800 hover:text-brand-600 flex items-center"
                                title="Click to Call"
                              >
                                <Phone className="w-3.5 h-3.5 mr-1 text-brand-600" />
                                <span>{enquiry.mobile}</span>
                              </a>

                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-0.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded text-[10px] font-bold flex items-center transition-colors"
                                title="Open WhatsApp Chat"
                              >
                                <MessageSquare className="w-3 h-3 mr-1" />
                                <span>Chat</span>
                              </a>
                            </div>

                            {enquiry.email && (
                              <a
                                href={`mailto:${enquiry.email}`}
                                className="text-slate-500 hover:text-slate-800 flex items-center text-[11px] truncate max-w-xs"
                              >
                                <Mail className="w-3 h-3 mr-1 text-slate-400" />
                                <span>{enquiry.email}</span>
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Product */}
                        <td className="px-5 py-3.5">
                          {enquiry.productName ? (
                            <span className="font-bold text-brand-700 block max-w-xs line-clamp-1">
                              {enquiry.productName}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">General Quotation</span>
                          )}
                        </td>

                        {/* Message */}
                        <td className="px-5 py-3.5 max-w-xs">
                          <p className="text-slate-600 line-clamp-2 text-xs leading-relaxed">
                            {enquiry.message}
                          </p>
                        </td>

                        {/* Status Dropdown */}
                        <td className="px-5 py-3.5 text-center">
                          <select
                            value={enquiry.status}
                            onChange={(e) =>
                              handleStatusChange(enquiry._id, e.target.value as any)
                            }
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border focus:outline-none ${
                              enquiry.status === 'new'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : enquiry.status === 'contacted'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            <option value="new">NEW</option>
                            <option value="contacted">CONTACTED</option>
                            <option value="completed">COMPLETED</option>
                          </select>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap text-[11px]">
                          {formatDate(enquiry.createdAt)}
                        </td>

                        {/* Delete Action */}
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => {
                              setEnquiryToDelete(enquiry);
                              setDeleteDialogOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Delete Enquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-500">
                      No customer enquiries found matching the selected filter.
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

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Enquiry"
        message={`Are you sure you want to delete this enquiry from "${enquiryToDelete?.name}"?`}
        confirmText="Delete Enquiry"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onClose={() => {
          setDeleteDialogOpen(false);
          setEnquiryToDelete(null);
        }}
      />
    </>
  );
};
