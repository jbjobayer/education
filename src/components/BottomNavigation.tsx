import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  BookOpen, 
  Sparkles, 
  Briefcase, 
  Layers 
} from 'lucide-react';
import { MainTab } from '../types';

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, setIsNotificationOpen } = useApp();

  const handleTabClick = (id: string) => {
    if (id === 'circular') {
      setIsNotificationOpen(true);
    } else if (id === 'subject_prep') {
      setActiveTab('courses');
    } else {
      setActiveTab(id as MainTab);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] py-1.5 px-2">
      <div className="max-w-md mx-auto flex items-center justify-around gap-1">
        {/* 1. পরীক্ষা দিন */}
        <button
          type="button"
          onClick={() => handleTabClick('exams')}
          className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all ${
            activeTab === 'exams'
              ? 'text-emerald-800 font-extrabold scale-102'
              : 'text-slate-600 hover:text-slate-900 font-medium'
          }`}
        >
          <div className="p-1 rounded-lg">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold mt-0.5 leading-tight">
            পরীক্ষা দিন
          </span>
        </button>

        {/* 2. কোর্স (Active Navy Card if courses active) */}
        <button
          type="button"
          onClick={() => handleTabClick('courses')}
          className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${
            activeTab === 'courses'
              ? 'bg-[#0b1c3d] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 font-medium'
          }`}
        >
          {/* Red 'নতুন' Badge */}
          <span className="absolute -top-1.5 bg-[#e02424] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full shadow-xs">
            নতুন
          </span>
          <div className="p-0.5">
            <BookOpen className={`w-5 h-5 ${activeTab === 'courses' ? 'text-amber-400 fill-amber-400/20' : ''}`} />
          </div>
          <span className={`text-[11px] font-black mt-0.5 leading-tight ${activeTab === 'courses' ? 'text-white' : 'text-slate-700'}`}>
            কোর্স
          </span>
        </button>

        {/* 3. তামরীন এআই */}
        <button
          type="button"
          onClick={() => handleTabClick('ai')}
          className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all ${
            activeTab === 'ai'
              ? 'text-emerald-800 font-extrabold scale-102'
              : 'text-slate-600 hover:text-slate-900 font-medium'
          }`}
        >
          {/* Yellow 'এআই' Badge */}
          <span className="absolute -top-1.5 bg-amber-500 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full shadow-xs">
            এআই
          </span>
          <div className="p-1 rounded-lg">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-[11px] font-bold mt-0.5 leading-tight">
            তামরীন এআই
          </span>
        </button>

        {/* 4. সার্কুলার */}
        <button
          type="button"
          onClick={() => handleTabClick('circular')}
          className="relative flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all text-slate-600 hover:text-slate-900 font-medium"
        >
          {/* Red '৩টি' Badge */}
          <span className="absolute -top-1.5 bg-[#e02424] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full shadow-xs">
            ৩টি
          </span>
          <div className="p-1 rounded-lg">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold mt-0.5 leading-tight">
            সার্কুলার
          </span>
        </button>

        {/* 5. বিষয়ভিত্তিক প্রস্তুতি */}
        <button
          type="button"
          onClick={() => handleTabClick('subject_prep')}
          className="relative flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all text-slate-600 hover:text-slate-900 font-medium"
        >
          <div className="p-1 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-[10.5px] font-bold mt-0.5 leading-tight text-center">
            বিষয়ভিত্তিক প্রস্তুতি
          </span>
        </button>
      </div>
    </nav>
  );
};
