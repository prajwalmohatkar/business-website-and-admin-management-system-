import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Building,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { enquiryService } from '../../services/enquiryService';
import { SEOHead } from '../../components/seo/SEOHead';
import { createWhatsAppUrl } from '../../utils/formatters';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!message.trim()) {
      setErrorMessage('Please enter your requirement message.');
      return;
    }

    try {
      setIsSubmitting(true);
      await enquiryService.submitEnquiry({
        name: name.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setIsSuccess(true);
      setName('');
      setMobile('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappUrl = createWhatsAppUrl(
    settings.whatsapp,
    `Hello ${settings.businessName}, I would like to get in touch regarding your products and solutions.`
  );

  return (
    <>
      <SEOHead
        title="Contact Us & Store Location"
        description={`Get in touch with ${settings.businessName}. Visit our sales office at ${settings.address}, ${settings.city} or call ${settings.phone}.`}
      />

      <section className="bg-slate-900 text-white py-14 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 block mb-2">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Contact Our Sales & Support Team
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
            Have a question about weighing scale calibration, solar rooftop installation, or water plant capacity? We are here to assist you.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Contact Cards & Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Office & Sales Facility
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Connect directly with our branch representatives or visit our workshop for live demonstrations.
              </p>
            </div>

            {/* Quick Contact Cards */}
            <div className="space-y-4">
              {/* Address */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4">
                <div className="p-3 bg-brand-50 text-brand-600 rounded-xl mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Registered Office & Workshop</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {settings.address}, {settings.city}, {settings.state} - {settings.pincode}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Phone Support</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Direct Sales:{' '}
                    <a
                      href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                      className="font-bold text-brand-600 hover:underline"
                    >
                      {settings.phone}
                    </a>
                  </p>
                  {settings.alternatePhone && (
                    <p className="text-xs text-slate-600 mt-0.5">
                      Customer Service:{' '}
                      <a
                        href={`tel:${settings.alternatePhone.replace(/\s+/g, '')}`}
                        className="font-bold text-slate-700 hover:underline"
                      >
                        {settings.alternatePhone}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {/* WhatsApp */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl mt-0.5">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">WhatsApp Instant Chat</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Send model inquiries and receive instant PDF brochures:
                  </p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
                  >
                    Open WhatsApp Chat ({settings.whatsapp}) →
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4">
                <div className="p-3 bg-brand-50 text-brand-600 rounded-xl mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Official Email</h3>
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-xs font-semibold text-brand-600 hover:underline block mt-1 break-all"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start space-x-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Working Hours</h3>
                  <p className="text-xs text-slate-600 mt-1">{settings.businessHours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form & Google Map (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
                Send Us an Online Message
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                Fill in your contact information below and our product specialist will reach out with technical specs and quotation.
              </p>

              {isSuccess ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-lg font-bold text-emerald-900">Message Received!</h4>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    Thank you for contacting {settings.businessName}. Your enquiry has been forwarded to our technical sales team.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                      {errorMessage}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                        Mobile Phone <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-slate-400">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="9876543210"
                          className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rajesh@company.com"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                      Message / Equipment Requirement <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please let us know which machine, capacity, or solar setup you are interested in..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Requirement</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Embedded Google Map */}
            {settings.googleMapsEmbed && (
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-2">
                <iframe
                  title="Business Google Map Location"
                  src={settings.googleMapsEmbed}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  className="rounded-2xl w-full"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
