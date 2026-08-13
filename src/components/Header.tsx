import React from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useFont } from '../context/FontContext';
import { 
  Bell, 
  Search, 
  GraduationCap, 
  BookOpen,
  Moon,
  Sun,
  Type,
  X,
  ArrowLeft
} from 'lucide-react';
import { CourseCategory } from '../types';

export const Header: React.FC = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    setIsNotificationOpen, 
    searchQuery, 
    setSearchQuery,
    activeTab,
    setActiveTab
  } = useApp();

  const { isDark, toggleTheme } = useTheme();
  const { setIsFontModalOpen, settings } = useFont();

  const categories: { id: CourseCategory; label: string }[] = [
    { id: 'all', label: 'সব কোর্স' },
    { id: 'madrasah_ntrca', label: 'মাদ্রাসা শিক্ষক নিবন্ধন' },
    { id: 'general_ntrca', label: 'জেনারেল NTRCA' },
    { id: 'arabic_language', label: 'আরবি ভাষা ও ব্যাকরণ' },
    { id: 'subject_wise', label: 'বিষয়ভিত্তিক টেস্ট' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#e9edf5] dark:bg-[#0d1522] border-b border-white/60 dark:border-slate-800/80 shadow-[0_4px_16px_rgba(195,207,226,0.65)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-colors duration-200">
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2 flex items-center justify-between gap-3">
        {/* Left Side: Brand Logo or Back Arrow Button */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {activeTab !== 'home' ? (
            <button
              onClick={() => setActiveTab('home')}
              className="w-10 h-10 rounded-2xl neu-btn text-amber-600 dark:text-amber-400 flex items-center justify-center transition-transform active:scale-95 shrink-0"
              title="হোমে ফিরে যান"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          ) : (
            <div 
              onClick={() => setActiveTab('home')}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#005a36] text-amber-400 flex items-center justify-center shadow-[3px_3px_8px_rgba(195,207,226,0.9),-3px_-3px_8px_rgba(255,255,255,0.9)] dark:shadow-[3px_3px_8px_rgba(0,0,0,0.6),-3px_-3px_8px_rgba(255,255,255,0.05)] cursor-pointer select-none transition-transform shrink-0 border border-[#007043]/30"
            >
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 stroke-[2.2]" />
            </div>
          )}
          <div 
            onClick={() => setActiveTab('home')}
            className="cursor-pointer select-none"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-extrabold text-lg sm:text-2xl text-[#0a2e23] dark:text-emerald-400 tracking-tight leading-none">
                আত-তামরীন
              </h1>
              <span className="text-[10px] sm:text-[11px] font-black bg-[#004d2e] dark:bg-[#064e3b] text-[#fbbf24] px-2 py-0.5 rounded-full tracking-wide shadow-inner border border-[#00663d]/40">
                একাডেমি
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#4b5563] dark:text-slate-400 font-medium tracking-normal mt-0.5 hidden xs:block">
              মাদ্রাসা ও NTRCA শিক্ষক নিবন্ধন প্রস্তুতি
            </p>
          </div>
        </div>

        {/* Desktop Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="কোর্স, বিষয় বা প্রশ্ন খুঁজুন..."
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm neu-inset rounded-full text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-white/70 dark:bg-slate-700 rounded-full w-5 h-5 flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Right Side Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Font & Arabic Harakat Switcher Button - Clean T icon */}
          <button
            onClick={() => setIsFontModalOpen(true)}
            className="w-10 h-10 rounded-2xl neu-btn text-amber-600 dark:text-amber-400 flex items-center justify-center transition-transform active:scale-95 shrink-0"
            title="বাংলা ও আরবি ফন্ট সেটিংস (T)"
          >
            <span className="font-black text-base leading-none text-amber-600 dark:text-amber-400 font-sans">
              T
            </span>
          </button>

          {/* Theme Toggle Button (Light/Dark) */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-2xl neu-btn text-slate-700 dark:text-amber-400 flex items-center justify-center transition-transform active:scale-95 shrink-0"
            title={isDark ? "লাইট মোড চালু করুন" : "ডার্ক মোড চালু করুন"}
          >
            {isDark ? (
              <Sun className="w-5 h-5 stroke-[2.2] text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 stroke-[2.2] text-slate-700" />
            )}
          </button>

          {/* Profile Avatar Button */}
          <button
            onClick={() => setActiveTab('profile')}
            className="w-10 h-10 rounded-full neu-btn p-0.5 flex items-center justify-center overflow-hidden transition-transform active:scale-95 shrink-0 border border-amber-400/40"
            title="প্রোফাইল"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="ইউজার প্রোফাইল"
              className="w-full h-full rounded-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar (matching screenshot) */}
      <div className="px-4 pb-2.5 max-w-7xl mx-auto md:hidden">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#005a36] dark:text-emerald-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="কোর্স, বিষয় বা প্রশ্ন খুঁজুন..."
            className="w-full pl-10 pr-9 py-2 text-xs neu-inset rounded-full text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#005a36] font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-white/70 dark:bg-slate-700 rounded-full w-5 h-5 flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="border-t border-slate-200/60 dark:border-slate-800/80 bg-[#e4e9f2]/70 dark:bg-[#0b121d]/80 backdrop-blur-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1 text-xs font-bold text-[#005a36] dark:text-emerald-400 shrink-0 pr-1">
            <BookOpen className="w-3.5 h-3.5 text-[#005a36] dark:text-emerald-400 stroke-[2.2]" />
            <span>ক্যাটাগরি:</span>
          </div>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  if (activeTab !== 'courses' && activeTab !== 'home') {
                    setActiveTab('courses');
                  }
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'neu-btn text-[#b45309] dark:text-[#fbbf24] font-black border-2 border-[#fcd34d] dark:border-[#fbbf24] shadow-[2px_2px_6px_rgba(195,207,226,0.8),-2px_-2px_6px_rgba(255,255,255,0.9)] dark:shadow-[2px_2px_6px_rgba(0,0,0,0.6),-2px_-2px_6px_rgba(255,255,255,0.05)] bg-[#edf1f8] dark:bg-[#18263e]'
                    : 'neu-btn text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
