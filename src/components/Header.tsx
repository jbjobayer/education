import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Search, 
  GraduationCap, 
  Calendar,
  Sparkles,
  BookOpen,
  X
} from 'lucide-react';
import { CourseCategory } from '../types';

export const Header: React.FC = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    setIsNotificationOpen, 
    setIsRoutineOpen, 
    searchQuery, 
    setSearchQuery,
    activeTab,
    setActiveTab
  } = useApp();

  const categories: { id: CourseCategory; label: string }[] = [
    { id: 'all', label: 'সব কোর্স' },
    { id: 'madrasah_ntrca', label: 'মাদ্রাসা শিক্ষক নিবন্ধন' },
    { id: 'general_ntrca', label: 'জেনারেল NTRCA' },
    { id: 'arabic_language', label: 'আরবি ভাষা ও ব্যাকরণ' },
    { id: 'subject_wise', label: 'বিষয়ভিত্তিক টেস্ট' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#e9edf5] border-b border-white/60 shadow-[0_4px_16px_rgba(195,207,226,0.65)]">
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2 flex items-center justify-between gap-3">
        {/* Left Side: Brand Logo matching screenshot */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#005a36] text-amber-400 flex items-center justify-center shadow-[3px_3px_8px_rgba(195,207,226,0.9),-3px_-3px_8px_rgba(255,255,255,0.9)] group-hover:scale-105 transition-transform shrink-0 border border-[#007043]/30">
            <GraduationCap className="w-6 h-6 text-amber-400 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xl sm:text-2xl text-[#0a2e23] tracking-tight leading-none">
                আত-তামরীন
              </h1>
              <span className="text-[11px] font-black bg-[#004d2e] text-[#fbbf24] px-2.5 py-0.5 rounded-full tracking-wide shadow-inner border border-[#00663d]/40">
                একাডেমি
              </span>
            </div>
            <p className="text-[11px] text-[#4b5563] font-medium tracking-normal mt-0.5">
              মাদ্রাসা ও NTRCA শিক্ষক নিবন্ধন প্রস্তুতি
            </p>
          </div>
        </div>

        {/* Desktop Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="কোর্স, বিষয় বা প্রশ্ন খুঁজুন..."
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm neu-inset rounded-full text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 bg-white/70 rounded-full w-5 h-5 flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Right Side Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Daily Routine Button */}
          <button
            onClick={() => setIsRoutineOpen(true)}
            className="w-10 h-10 rounded-2xl neu-btn text-[#005a36] flex items-center justify-center transition-transform active:scale-95 shrink-0"
            title="ক্লাস ও পরীক্ষার রুটিন"
          >
            <Calendar className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* AI Sparkles Button (Orange in screenshot with dark icon) */}
          <button
            onClick={() => setActiveTab('ai')}
            className="w-10 h-10 rounded-2xl bg-[#f59e0b] text-slate-950 flex items-center justify-center shadow-[3px_3px_8px_rgba(195,207,226,0.8),-3px_-3px_8px_rgba(255,255,255,0.9)] hover:bg-amber-400 transition-transform active:scale-95 shrink-0"
            title="তামরীন এআই"
          >
            <Sparkles className="w-5 h-5 stroke-[2.3]" />
          </button>

          {/* Notification Button with orange dot */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="relative w-10 h-10 rounded-2xl neu-btn flex items-center justify-center text-[#005a36] transition-transform active:scale-95 shrink-0"
            title="নোটিফিকেশন"
          >
            <Bell className="w-5 h-5 stroke-[2.2]" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#f59e0b] ring-2 ring-[#e9edf5]"></span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar (matching screenshot) */}
      <div className="px-4 pb-2.5 max-w-7xl mx-auto md:hidden">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#005a36]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="কোর্স, বিষয় বা প্রশ্ন খুঁজুন..."
            className="w-full pl-10 pr-9 py-2 text-xs neu-inset rounded-full text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005a36] font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 bg-white/70 rounded-full w-5 h-5 flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills (matching screenshot with 📖 ক্যাটাগরি: ) */}
      <div className="border-t border-slate-200/60 bg-[#e4e9f2]/70 backdrop-blur-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1 text-xs font-bold text-[#005a36] shrink-0 pr-1">
            <BookOpen className="w-3.5 h-3.5 text-[#005a36] stroke-[2.2]" />
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
                    ? 'neu-btn text-[#b45309] font-black border-2 border-[#fcd34d] shadow-[2px_2px_6px_rgba(195,207,226,0.8),-2px_-2px_6px_rgba(255,255,255,0.9)] bg-[#edf1f8]'
                    : 'neu-btn text-slate-700 hover:text-slate-900'
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
