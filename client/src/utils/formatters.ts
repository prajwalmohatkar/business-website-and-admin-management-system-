/**
 * Formats a number to Indian Rupee (INR) currency string: e.g. ₹8,500
 */
export const formatCurrency = (amount?: number): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Calculates discount percentage between MRP and selling price
 */
export const calculateDiscount = (mrp?: number, sellingPrice?: number): number => {
  if (!mrp || !sellingPrice || mrp <= sellingPrice) return 0;
  return Math.round(((mrp - sellingPrice) / mrp) * 100);
};

/**
 * Formats an Indian phone number to international WhatsApp format
 */
export const cleanPhoneNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
};

/**
 * Generates a WhatsApp click-to-chat URL with pre-filled message
 */
export const createWhatsAppUrl = (phone: string, message: string): string => {
  const cleaned = cleanPhoneNumber(phone);
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
};

/**
 * Formats ISO date string to readable Indian standard format: e.g. "12 Oct 2025, 4:30 PM"
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

/**
 * Truncate long strings with ellipsis
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
};
