import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle,
  Building,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Globe,
  UploadCloud,
} from 'lucide-react';
import { settingsService } from '../../services/settingsService';
import { uploadService } from '../../services/uploadService';
import { useSettings } from '../../context/SettingsContext';
import { SEOHead } from '../../components/seo/SEOHead';

export const AdminSettingsPage: React.FC = () => {
  const { settings, refreshSettings } = useSettings();

  const [businessName, setBusinessName] = useState(settings.businessName || '');
  const [tagline, setTagline] = useState(settings.tagline || '');
  const [logo, setLogo] = useState(settings.logo || '');
  const [phone, setPhone] = useState(settings.phone || '');
  const [alternatePhone, setAlternatePhone] = useState(settings.alternatePhone || '');
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp || '');
  const [email, setEmail] = useState(settings.email || '');
  const [address, setAddress] = useState(settings.address || '');
  const [city, setCity] = useState(settings.city || '');
  const [state, setState] = useState(settings.state || '');
  const [pincode, setPincode] = useState(settings.pincode || '');
  const [businessHours, setBusinessHours] = useState(settings.businessHours || '');
  const [aboutBusiness, setAboutBusiness] = useState(settings.aboutBusiness || '');
  const [googleMapsEmbed, setGoogleMapsEmbed] = useState(settings.googleMapsEmbed || '');

  // Social
  const [facebook, setFacebook] = useState(settings.socialLinks?.facebook || '');
  const [instagram, setInstagram] = useState(settings.socialLinks?.instagram || '');
  const [linkedin, setLinkedin] = useState(settings.socialLinks?.linkedin || '');
  const [twitter, setTwitter] = useState(settings.socialLinks?.twitter || '');
  const [youtube, setYoutube] = useState(settings.socialLinks?.youtube || '');

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setBusinessName(settings.businessName || '');
    setTagline(settings.tagline || '');
    setLogo(settings.logo || '');
    setPhone(settings.phone || '');
    setAlternatePhone(settings.alternatePhone || '');
    setWhatsapp(settings.whatsapp || '');
    setEmail(settings.email || '');
    setAddress(settings.address || '');
    setCity(settings.city || '');
    setState(settings.state || '');
    setPincode(settings.pincode || '');
    setBusinessHours(settings.businessHours || '');
    setAboutBusiness(settings.aboutBusiness || '');
    setGoogleMapsEmbed(settings.googleMapsEmbed || '');
    setFacebook(settings.socialLinks?.facebook || '');
    setInstagram(settings.socialLinks?.instagram || '');
    setLinkedin(settings.socialLinks?.linkedin || '');
    setTwitter(settings.socialLinks?.twitter || '');
    setYoutube(settings.socialLinks?.youtube || '');
  }, [settings]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingLogo(true);
      setErrorMessage('');
      const res = await uploadService.uploadSingleImage(file, 'business_website/branding');
      setLogo(res.url);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload logo.');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      setIsSaving(true);
      await settingsService.updateSettings({
        businessName: businessName.trim(),
        tagline: tagline.trim(),
        logo: logo.trim(),
        phone: phone.trim(),
        alternatePhone: alternatePhone.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        businessHours: businessHours.trim(),
        aboutBusiness: aboutBusiness.trim(),
        googleMapsEmbed: googleMapsEmbed.trim(),
        socialLinks: {
          facebook: facebook.trim(),
          instagram: instagram.trim(),
          linkedin: linkedin.trim(),
          twitter: twitter.trim(),
          youtube: youtube.trim(),
        },
      });

      await refreshSettings();
      setToastMessage('Business settings updated successfully! Live website updated.');
      setTimeout(() => setToastMessage(''), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <SEOHead title="Business Profile & Settings" noIndex={true} />

      <div className="max-w-4xl mx-auto space-y-6 pb-16">
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-semibold animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Business Configuration
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Changes saved here instantly update the public Header, Footer, Contact Page, and WhatsApp links.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg flex items-center space-x-2 transition-all disabled:opacity-60"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Settings</span>
          </button>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Identity & Branding */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Brand Identity & Logo
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Business Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Tagline / Motto
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Business Logo
              </label>
              <div className="flex items-center space-x-3">
                {logo ? (
                  <img
                    src={logo}
                    alt="Logo preview"
                    className="w-12 h-12 rounded-xl object-contain border border-slate-200 bg-slate-50 p-1"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                    <Building className="w-5 h-5" />
                  </div>
                )}
                <input
                  type="url"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="https://... logo image URL"
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <label className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-colors whitespace-nowrap">
                  {isUploadingLogo ? 'Uploading...' : 'Upload Logo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={isUploadingLogo}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                About Business Overview Text
              </label>
              <textarea
                rows={3}
                value={aboutBusiness}
                onChange={(e) => setAboutBusiness(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              ></textarea>
            </div>
          </div>

          {/* Contact Details & WhatsApp */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Direct Contact Details & WhatsApp Number
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Primary Phone <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Official Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Alternate Support Phone
                </label>
                <input
                  type="text"
                  value={alternatePhone}
                  onChange={(e) => setAlternatePhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Business / Store Hours
                </label>
                <input
                  type="text"
                  value={businessHours}
                  onChange={(e) => setBusinessHours(e.target.value)}
                  placeholder="e.g. Mon - Sat: 9:00 AM - 7:00 PM"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Physical Address & Location */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Office Address & Google Maps Embed
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Street Address / Plot / Industrial Area <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Google Maps Embed URL (iframe src)
              </label>
              <input
                type="text"
                value={googleMapsEmbed}
                onChange={(e) => setGoogleMapsEmbed(e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Get this from Google Maps: Share → Embed a map → copy only the `src="..."` URL.
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg flex items-center space-x-2 transition-all disabled:opacity-60"
            >
              {isSaving ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save & Publish Changes</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
