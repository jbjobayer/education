import React from 'react';
import { 
  useFont, 
  BanglaFont, 
  ArabicFont, 
  FontSizeLevel, 
  removeHarakat 
} from '../../context/FontContext';
import { 
  X, 
  Check, 
  Sparkles, 
  Type, 
  Eye, 
  RotateCcw,
  Sliders
} from 'lucide-react';

export const FontSettingsModal: React.FC = () => {
  const {
    settings,
    setBanglaFont,
    setArabicFont,
    setShowHarakat,
    setFontSize,
    isFontModalOpen,
    setIsFontModalOpen,
  } = useFont();

  if (!isFontModalOpen) return null;

  const banglaFonts: { id: BanglaFont; name: string; sample: string }[] = [
    { id: 'Hind Siliguri', name: 'হিন্দ শিলিগুড়ি', sample: 'আত-তামরীন একাডেমি' },
    { id: 'Tiro Bangla', name: 'তিরো বাংলা', sample: 'আত-তামরীন একাডেমি' },
    { id: 'Noto Serif Bengali', name: 'নোটো সেরিফ', sample: 'আত-তামরীন একাডেমি' },
    { id: 'Anek Bangla', name: 'অনেক বাংলা', sample: 'আত-তামরীন একাডেমি' },
  ];

  const arabicFonts: { id: ArabicFont; name: string; sample: string }[] = [
    { id: 'Amiri', name: 'আমিরী (Amiri)', sample: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ' },
    { id: 'Scheherazade New', name: 'শহরাজাদ', sample: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ' },
    { id: 'Noto Naskh Arabic', name: 'নোটো নাসখ', sample: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ' },
    { id: 'Lateef', name: 'লতীফ', sample: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ' },
  ];

  const fontSizes: { id: FontSizeLevel; label: string }[] = [
    { id: 'normal', label: 'স্বাভাবিক' },
    { id: 'medium', label: 'মাঝারি' },
    { id: 'large', label: 'বড়' },
    { id: 'xlarge', label: 'অনেক বড়' },
  ];

  const sampleArabic = 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ';

  const handleReset = () => {
    setBanglaFont('Hind Siliguri');
    setArabicFont('Amiri');
    setShowHarakat(true);
    setFontSize('normal');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0" 
        onClick={() => setIsFontModalOpen(false)} 
      />

      <div className="relative w-full max-w-sm sm:max-w-md bg-[#e9edf5] dark:bg-[#101927] rounded-3xl neu-card dark:border dark:border-slate-800 shadow-[6px_6px_20px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden z-10 transition-colors">
        {/* Compact Top Header */}
        <div className="px-4 py-3 border-b border-white/60 dark:border-slate-800 flex items-center justify-between bg-[#005a36] text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <span className="font-black text-amber-300 text-sm">T</span>
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white leading-tight">
                ফন্ট ও হরকত সেটিংস
              </h3>
              <p className="text-[10px] text-emerald-100/80">পড়ার জন্য ফন্ট ও হরকত কাস্টমাইজেশন</p>
            </div>
          </div>

          <button
            onClick={() => setIsFontModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-3.5 sm:p-4 space-y-3.5 overflow-y-auto max-h-[75vh] no-scrollbar">
          {/* Compact Live Preview */}
          <div className="rounded-2xl neu-inset dark:bg-[#0b121d] p-3 border border-white/50 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Eye className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                প্রিভিউ
              </span>
              <span className="text-[9.5px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">
                {settings.showHarakat ? 'হরকত সক্রিয়' : 'হরকত নিষ্ক্রিয়'}
              </span>
            </div>
            <p 
              className="text-right text-base text-[#005a36] dark:text-emerald-300 font-bold leading-normal font-arabic"
              style={{ fontFamily: `"${settings.arabicFont}", serif` }}
              dir="rtl"
            >
              {settings.showHarakat ? sampleArabic : removeHarakat(sampleArabic)}
            </p>
            <p 
              className="text-slate-800 dark:text-slate-200 text-xs font-semibold mt-1"
              style={{ fontFamily: `"${settings.banglaFont}", sans-serif` }}
            >
              আত-তামরীন একাডেমি — শিক্ষক নিবন্ধন প্রস্তুতি
            </p>
          </div>

          {/* Section 1: Arabic Harakat (Segmented Toggle) */}
          <div>
            <label className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              আরবি হরকত (জের-জবর-পেশ)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowHarakat(true)}
                className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer select-none active:scale-95 ${
                  settings.showHarakat
                    ? 'border-2 border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-[#005a36] dark:text-emerald-300 shadow-xs'
                    : 'neu-btn text-slate-600 dark:text-slate-400'
                }`}
              >
                {settings.showHarakat && <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" />}
                <span>হরকত সহ (তশকীল)</span>
              </button>

              <button
                onClick={() => setShowHarakat(false)}
                className={`py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer select-none active:scale-95 ${
                  !settings.showHarakat
                    ? 'border-2 border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-[#005a36] dark:text-emerald-300 shadow-xs'
                    : 'neu-btn text-slate-600 dark:text-slate-400'
                }`}
              >
                {!settings.showHarakat && <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" />}
                <span>হরকত ছাড়া (সহজ)</span>
              </button>
            </div>
          </div>

          {/* Section 2: Arabic Font */}
          <div>
            <label className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1">
                <span className="text-emerald-600 font-serif">ع</span>
                আরবি ফন্ট
              </span>
              <span className="text-[10px] text-slate-500 font-normal">নির্বাচিত: {settings.arabicFont}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {arabicFonts.map((font) => {
                const isSelected = settings.arabicFont === font.id;
                return (
                  <button
                    key={font.id}
                    onClick={() => setArabicFont(font.id)}
                    className={`p-2 rounded-xl text-left transition-all cursor-pointer select-none active:scale-95 flex flex-col justify-between ${
                      isSelected
                        ? 'border-2 border-emerald-600 dark:border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/50 shadow-xs'
                        : 'neu-btn'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100 truncate">
                        {font.name}
                      </span>
                      {isSelected && <Check className="w-3 h-3 text-emerald-600 shrink-0" />}
                    </div>
                    <span 
                      className="text-right text-xs text-[#005a36] dark:text-emerald-300 font-arabic mt-1 truncate"
                      style={{ fontFamily: `"${font.id}", serif` }}
                      dir="rtl"
                    >
                      {settings.showHarakat ? font.sample : removeHarakat(font.sample)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Bangla Font */}
          <div>
            <label className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-emerald-600" />
                বাংলা ফন্ট
              </span>
              <span className="text-[10px] text-slate-500 font-normal">নির্বাচিত: {settings.banglaFont}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {banglaFonts.map((font) => {
                const isSelected = settings.banglaFont === font.id;
                return (
                  <button
                    key={font.id}
                    onClick={() => setBanglaFont(font.id)}
                    className={`p-2 rounded-xl text-left transition-all cursor-pointer select-none active:scale-95 flex flex-col justify-between ${
                      isSelected
                        ? 'border-2 border-emerald-600 dark:border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/50 shadow-xs'
                        : 'neu-btn'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100 truncate">
                        {font.name}
                      </span>
                      {isSelected && <Check className="w-3 h-3 text-emerald-600 shrink-0" />}
                    </div>
                    <span 
                      className="text-[10.5px] text-slate-600 dark:text-slate-300 mt-1 truncate font-medium"
                      style={{ fontFamily: `"${font.id}", sans-serif` }}
                    >
                      {font.sample}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Font Size */}
          <div>
            <label className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1 mb-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              লেখার সাইজ
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {fontSizes.map((size) => {
                const isSelected = settings.fontSize === size.id;
                return (
                  <button
                    key={size.id}
                    onClick={() => setFontSize(size.id)}
                    className={`py-1.5 px-1 rounded-xl text-center transition-all cursor-pointer select-none active:scale-95 ${
                      isSelected
                        ? 'border-2 border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-[#005a36] dark:text-emerald-300 font-extrabold text-xs shadow-xs'
                        : 'neu-btn text-slate-700 dark:text-slate-300 text-xs font-medium'
                    }`}
                  >
                    {size.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Compact Footer */}
        <div className="px-4 py-2.5 bg-[#e4e9f2] dark:bg-[#0b121d] border-t border-white/60 dark:border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl neu-btn text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>রিসেট</span>
          </button>

          <button
            onClick={() => setIsFontModalOpen(false)}
            className="px-5 py-1.5 rounded-xl neu-btn-primary font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>সংরক্ষণ করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
