import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IBusinessSettings, ICategory } from '../types';
import { settingsService } from '../services/settingsService';
import { categoryService } from '../services/categoryService';

interface SettingsContextType {
  settings: IBusinessSettings;
  categories: ICategory[];
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  refreshCategories: () => Promise<void>;
}

const defaultSettings: IBusinessSettings = {
  businessName: 'Apex Solutions',
  tagline: 'Reliable Solutions for Weighing, Solar & Water Purification',
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  email: 'sales@apexsolutions.com',
  address: 'Plot 45, Industrial Area, Phase II',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  businessHours: 'Mon - Sat: 9:00 AM - 7:00 PM (Sunday Closed)',
  aboutBusiness: 'We are a premier provider of industrial and commercial Weighing Scale Machines, Solar Power Systems, and Water Purification Systems. Committed to precision engineering, unmatched durability, and superior after-sales customer service.',
  socialLinks: {},
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<IBusinessSettings>(defaultSettings);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSettings = useCallback(async () => {
    try {
      const data = await settingsService.getSettings();
      if (data) setSettings(data);
    } catch (err) {
      console.warn('Could not load remote settings, using defaults.', err);
    }
  }, []);

  const refreshCategories = useCallback(async () => {
    try {
      const data = await categoryService.getCategories();
      if (Array.isArray(data)) setCategories(data);
    } catch (err) {
      console.warn('Could not load categories.', err);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.allSettled([refreshSettings(), refreshCategories()]);
      setIsLoading(false);
    };
    init();
  }, [refreshSettings, refreshCategories]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        categories,
        isLoading,
        refreshSettings,
        refreshCategories,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
