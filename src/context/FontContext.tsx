import React, { createContext, useContext, useState, useEffect } from 'react';

export type BanglaFont = 'Hind Siliguri' | 'Tiro Bangla' | 'Noto Serif Bengali' | 'Anek Bangla';
export type ArabicFont = 'Amiri' | 'Scheherazade New' | 'Noto Naskh Arabic' | 'Lateef';
export type FontSizeLevel = 'normal' | 'medium' | 'large' | 'xlarge';

interface FontSettings {
  banglaFont: BanglaFont;
  arabicFont: ArabicFont;
  showHarakat: boolean;
  fontSize: FontSizeLevel;
}

interface FontContextType {
  settings: FontSettings;
  setBanglaFont: (font: BanglaFont) => void;
  setArabicFont: (font: ArabicFont) => void;
  setShowHarakat: (show: boolean) => void;
  toggleHarakat: () => void;
  setFontSize: (size: FontSizeLevel) => void;
  formatArabicText: (text: string) => string;
  isFontModalOpen: boolean;
  setIsFontModalOpen: (open: boolean) => void;
}

const DEFAULT_SETTINGS: FontSettings = {
  banglaFont: 'Hind Siliguri',
  arabicFont: 'Amiri',
  showHarakat: true,
  fontSize: 'normal',
};

const FontContext = createContext<FontContextType | undefined>(undefined);

// Regex for removing Arabic diacritics (Harakat / Tashkeel)
const ARABIC_TASHKEEL_REGEX = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g;

export const removeHarakat = (text: string): string => {
  if (!text) return '';
  return text.replace(ARABIC_TASHKEEL_REGEX, '');
};

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<FontSettings>(() => {
    try {
      const saved = localStorage.getItem('tamreen_font_settings');
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  const [isFontModalOpen, setIsFontModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('tamreen_font_settings', JSON.stringify(settings));
    } catch {
      // Ignore
    }

    // Apply CSS Variables to Document Root
    const root = document.documentElement;
    root.style.setProperty('--font-bangla', `"${settings.banglaFont}", sans-serif`);
    root.style.setProperty('--font-arabic', `"${settings.arabicFont}", serif`);

    // Scale font sizes
    let fontScale = '100%';
    if (settings.fontSize === 'medium') fontScale = '108%';
    else if (settings.fontSize === 'large') fontScale = '116%';
    else if (settings.fontSize === 'xlarge') fontScale = '124%';
    
    root.style.setProperty('--font-scale', fontScale);
    root.style.fontSize = fontScale;

    // Apply class to body for custom font
    document.body.style.fontFamily = `"${settings.banglaFont}", system-ui, sans-serif`;
  }, [settings]);

  const setBanglaFont = (font: BanglaFont) => {
    setSettings((prev) => ({ ...prev, banglaFont: font }));
  };

  const setArabicFont = (font: ArabicFont) => {
    setSettings((prev) => ({ ...prev, arabicFont: font }));
  };

  const setShowHarakat = (show: boolean) => {
    setSettings((prev) => ({ ...prev, showHarakat: show }));
  };

  const toggleHarakat = () => {
    setSettings((prev) => ({ ...prev, showHarakat: !prev.showHarakat }));
  };

  const setFontSize = (size: FontSizeLevel) => {
    setSettings((prev) => ({ ...prev, fontSize: size }));
  };

  const formatArabicText = (text: string): string => {
    if (!text) return '';
    if (!settings.showHarakat) {
      return removeHarakat(text);
    }
    return text;
  };

  return (
    <FontContext.Provider
      value={{
        settings,
        setBanglaFont,
        setArabicFont,
        setShowHarakat,
        toggleHarakat,
        setFontSize,
        formatArabicText,
        isFontModalOpen,
        setIsFontModalOpen,
      }}
    >
      {children}
    </FontContext.Provider>
  );
};

export const useFont = () => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
};
