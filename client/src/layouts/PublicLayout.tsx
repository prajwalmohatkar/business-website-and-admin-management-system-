import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { FloatingContactButtons } from '../components/common/FloatingContactButtons';
import { EnquiryModal } from '../components/enquiry/EnquiryModal';
import { IProduct } from '../types';

export const PublicLayout: React.FC = () => {
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  const handleOpenEnquiry = (product?: IProduct | null) => {
    setSelectedProduct(product || null);
    setEnquiryModalOpen(true);
  };

  const handleCloseEnquiry = () => {
    setEnquiryModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-16 sm:pb-0">
      {/* Header */}
      <Header onOpenEnquiry={() => handleOpenEnquiry(null)} />

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet context={{ onOpenEnquiry: handleOpenEnquiry }} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Call & WhatsApp Buttons */}
      <FloatingContactButtons onOpenEnquiry={() => handleOpenEnquiry(null)} />

      {/* Global Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={handleCloseEnquiry}
        product={selectedProduct}
      />
    </div>
  );
};
