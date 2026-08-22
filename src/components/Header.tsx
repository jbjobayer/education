import React from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useFont } from '../context/FontContext';
import { 
  Search, 
  GraduationCap, 
  Moon, 
  Sun, 
  X, 
  ArrowLeft,
  Home,
  FileText,
  BookOpen,
  Sparkles,
  Briefcase,
  Layers,
  LogIn,
  User,
  UserCheck
} from 'lucide-react';
import { MainTab } from '../types';

export const Header: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery,
    activeTab,
    setActiveTab,
    setSelectedCategory,
    userProfile,
    isLoggedIn,
    openAuthModal
  } = useApp();

  const { isDark, toggleTheme } = useTheme();
  const { setIsFontModalOpen } = useFont();

  const navTabs: {
    id: MainTab;
    label: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
  }[] = [
    {
      id: 'home',
      label: 'হোম',
      icon: Home,
    },
    {
      id: 'exams',
      label: 'পরীক্ষা দিন',
      icon: FileText,
    },
    {
      id: 'courses',
      label: 'কোর্স',
      icon: BookOpen,
      badge: 'নতুন',
      badgeColor: 'bg-red-500 text-white',
    },
    {
      id: 'ai',
      label: 'তামরীন এআই',
      icon: Sparkles,
      badge: 'AI',
      badgeColor: 'bg-amber-400 text-slate-950 font-black',
    },
    {
      id: 'circular',
      label: 'সার্কুলার',
      icon: Briefcase,
      badge: '৩টি',
      badgeColor: 'bg-red-500 text-white',
    },
    {
      id: 'subject_wise',
      label: 'বিষয়ভিত্তিক প্রস্তুতি',
      icon: Layers,
    },
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
              className="w-10 h-10 rounded-2xl neu-btn text-amber-600 dark:text-amber-400 flex items-center justify-center transition-transform active:scale-95 shrink-0 cursor-pointer"
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
            className="cursor-pointer select-none min-w-0"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-extrabold text-base sm:text-2xl text-[#0a2e23] dark:text-emerald-400 tracking-tight leading-none">
                আত-তামরীন
              </h1>
              <span className="text-[9.5px] sm:text-[11px] font-black bg-[#004d2e] dark:bg-[#064e3b] text-[#fbbf24] px-1.5 sm:px-2 py-0.5 rounded-full tracking-wide shadow-inner border border-[#00663d]/40">
                একাডেমি
              </span>
            </div>
            <p className="text-[10.5px] sm:text-[12px] text-slate-500 dark:text-slate-400 font-medium tracking-normal mt-0.5 leading-tight">
              প্রস্তুতি হোক আরও স্মার্ট
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
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-white/70 dark:bg-slate-700 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
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
            className="w-10 h-10 rounded-2xl neu-btn text-amber-600 dark:text-amber-400 flex items-center justify-center transition-transform active:scale-95 shrink-0 cursor-pointer"
            title="বাংলা ও আরবি ফন্ট সেটিংস (T)"
          >
            <span className="font-black text-base leading-none text-amber-600 dark:text-amber-400 font-sans">
              T
            </span>
          </button>

          {/* Theme Toggle Button (Light/Dark) */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-2xl neu-btn text-slate-700 dark:text-amber-400 flex items-center justify-center transition-transform active:scale-95 shrink-0 cursor-pointer"
            title={isDark ? "লাইট মোড চালু করুন" : "ডার্ক মোড চালু করুন"}
          >
            {isDark ? (
              <Sun className="w-5 h-5 stroke-[2.2] text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 stroke-[2.2] text-slate-700" />
            )}
          </button>

          {/* Profile or Login Button */}
          {!isLoggedIn ? (
            <button
              id="header-login-btn"
              onClick={() => openAuthModal('login')}
              className="h-10 px-3 sm:px-3.5 rounded-2xl bg-gradient-to-r from-[#005a36] to-emerald-700 hover:from-[#004d2e] hover:to-emerald-800 text-white flex items-center gap-1.5 font-bold text-xs sm:text-sm shadow-[2px_2px_8px_rgba(0,90,54,0.35)] active:scale-95 transition-all cursor-pointer border border-amber-400/40 shrink-0"
              title="লগইন বা নতুন একাউন্ট খুলুন"
            >
              <LogIn className="w-4 h-4 text-amber-300 stroke-[2.5]" />
              <span className="text-amber-300 font-extrabold">লগইন</span>
            </button>
          ) : (
            <button
              id="header-profile-btn"
              onClick={() => setActiveTab('profile')}
              className={`w-10 h-10 rounded-2xl p-0.5 flex items-center justify-center overflow-hidden transition-all active:scale-95 shrink-0 cursor-pointer relative ${
                activeTab === 'profile'
                  ? 'ring-2 ring-[#005a36] dark:ring-emerald-400 shadow-[0_0_12px_rgba(0,90,54,0.5)]'
                  : 'neu-btn border border-emerald-500/40'
              }`}
              title={`আমার প্রোফাইল (${userProfile?.name || 'লগইন আছেন'})`}
            >
              {userProfile?.avatar ? (
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name || 'ইউজার প্রোফাইল'}
                  className="w-full h-full rounded-2xl object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#005a36] to-emerald-700 text-white flex items-center justify-center font-black text-xs">
                  {userProfile?.name ? userProfile.name.slice(0, 1) : 'প'}
                </div>
              )}
              {/* Online verified indicator badge */}
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
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
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-white/70 dark:bg-slate-700 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs Bar (Replacing old Categories) */}
      <div className="border-t border-slate-200/60 dark:border-slate-800/80 bg-[#e4e9f2]/70 dark:bg-[#0b121d]/80 backdrop-blur-xs py-2 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {navTabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'courses') {
                    setSelectedCategory('all');
                  }
                  setActiveTab(tab.id);
                }}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer inline-flex items-center gap-1.5 select-none active:scale-95 ${
                  isSelected
                    ? 'bg-[#005a36] text-[#fbbf24] font-black border border-emerald-500/50 shadow-[2px_2px_8px_rgba(0,90,54,0.45)]'
                    : 'neu-btn text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#fbbf24]' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full tracking-wider shadow-xs ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
