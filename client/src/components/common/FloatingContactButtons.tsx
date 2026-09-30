import React from 'react';
import { MessageSquare, Phone, Send } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { createWhatsAppUrl } from '../../utils/formatters';

interface FloatingContactButtonsProps {
  onOpenEnquiry?: () => void;
}

export const FloatingContactButtons: React.FC<FloatingContactButtonsProps> = ({ onOpenEnquiry }) => {
  const { settings } = useSettings();

  const handleWhatsApp = () => {
    const url = createWhatsAppUrl(
      settings.whatsapp,
      `Hello ${settings.businessName}, I would like to inquire about your products and services.`
    );
    window.open(url, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${settings.phone.replace(/\s+/g, '')}`;
  };

  return (
    <>
      {/* Desktop & Tablet Floating WhatsApp Icon (Bottom Right) */}
      <div className="hidden sm:block fixed bottom-6 right-6 z-40">
        <button
          onClick={handleWhatsApp}
          className="group relative flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 focus:outline-none"
          title="Chat on WhatsApp"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-600"></span>
          </span>
          <MessageSquare className="w-7 h-7" />
          <span className="absolute right-16 bg-slate-900 text-white text-xs font-semibold py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
            Chat on WhatsApp
          </span>
        </button>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-between gap-2 shadow-2xl">
        <button
          onClick={handleCall}
          className="flex-1 flex items-center justify-center py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
        >
          <Phone className="w-4 h-4 mr-1.5 text-brand-600" />
          <span>Call Now</span>
        </button>

        <button
          onClick={handleWhatsApp}
          className="flex-1 flex items-center justify-center py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
        >
          <MessageSquare className="w-4 h-4 mr-1.5" />
          <span>WhatsApp</span>
        </button>

        {onOpenEnquiry && (
          <button
            onClick={onOpenEnquiry}
            className="flex-1 flex items-center justify-center py-2.5 px-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold transition-colors"
          >
            <Send className="w-4 h-4 mr-1.5" />
            <span>Enquire</span>
          </button>
        )}
      </div>
    </>
  );
};
