import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Search, 
  BookOpen, 
  Calendar, 
  Sparkles,
  GraduationCap,
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
    userProfile,
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
    <header className="sticky top-0 z-40 bg-[#e9edf5] border-b border-white/60 shadow-[0_6px_16px_rgba(195,207,226,0.65)]">
      {/* Top Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo & Academy Name with Neumorphic Plate */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#e9edf5] shadow-[5px_5px_10px_#c5d2e3,-5px_-5px_10px_#ffffff] border border-white/80 flex items-center justify-center group-hover:scale-105 transition-transform">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-800 flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5 text-amber-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl text-emerald-950 tracking-wide font-arabic leading-none">
                আত-তামরীন
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-800 text-amber-300 font-bold shadow-xs">
                একাডেমি
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium truncate max-w-[210px] sm:max-w-none mt-0.5">
              মাদ্রাসা ও NTRCA শিক্ষক নিবন্ধন প্রস্তুতি
            </p>
          </div>
        </div>

        {/* Inset Neumorphic Search Bar on Tablet/Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="কোর্স, বিষয়, শিক্ষক বা প্রশ্ন খুঁজুন..."
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

        {/* Action icons & Profile Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Daily Routine Button */}
          <button
            onClick={() => setIsRoutineOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl neu-btn text-xs font-bold text-slate-700 hover:text-emerald-800 border border-white/80"
            title="ক্লাস রুটিন"
          >
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">রুটিন</span>
          </button>

          {/* Tamreen AI Quick Badge */}
          <button
            onClick={() => setActiveTab('ai')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl neu-btn-amber text-xs font-extrabold"
            title="তামরীন এআই"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">তামরীন AI</span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="relative p-2.5 rounded-xl neu-btn text-slate-700 hover:text-emerald-800 border border-white/80"
            title="নোটিফিকেশন"
          >
            <Bell className="w-4 h-4 text-emerald-800" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-[#e9edf5]"></span>
          </button>

          {/* Avatar with Neumorphic Frame */}
          <button
            onClick={() => setActiveTab('profile')}
            className="p-0.5 rounded-full neu-btn border border-white/90"
            title="প্রোফাইল"
          >
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* Mobile Inset Search input */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="কোর্স, বিষয় বা প্রশ্ন খুঁজুন..."
            className="w-full pl-10 pr-9 py-2 text-xs neu-inset rounded-full text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
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

      {/* Neumorphic Horizontal Category Pills Tray */}
      <div className="px-4 py-2 border-t border-white/50 bg-[#e4ebf4] overflow-x-auto no-scrollbar flex items-center gap-2 shadow-[inset_0_2px_4px_rgba(195,207,226,0.5)]">
        <span className="text-[11px] font-bold text-emerald-900 shrink-0 uppercase tracking-wider flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-emerald-700" /> ক্যাটাগরি:
        </span>

        <div className="flex items-center gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                  isSelected
                    ? 'neu-tab-active-amber bg-amber-400 text-slate-950 shadow-[4px_4px_8px_#c2cfdf,-4px_-4px_8px_#ffffff] font-extrabold border border-amber-300'
                    : 'neu-btn text-slate-600 hover:text-emerald-900 font-medium'
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
