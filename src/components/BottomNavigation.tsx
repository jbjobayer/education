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
  const { 
    activeTab, 
    setActiveTab, 
    setSelectedCategory 
  } = useApp();

  const navItems = [
    {
      id: 'exams' as MainTab,
      label: 'পরীক্ষা দিন',
      icon: FileText,
      badge: null,
      badgeColor: '',
      onClick: () => setActiveTab('exams'),
      isActive: activeTab === 'exams',
    },
    {
      id: 'courses' as MainTab,
      label: 'কোর্স',
      icon: BookOpen,
      badge: 'নতুন',
      badgeColor: 'bg-red-500 text-white',
      onClick: () => {
        setSelectedCategory('all');
        setActiveTab('courses');
      },
      isActive: activeTab === 'courses',
    },
    {
      id: 'ai' as MainTab,
      label: 'তামরীন এআই',
      icon: Sparkles,
      badge: 'এআই',
      badgeColor: 'bg-amber-500 text-slate-950',
      iconColor: 'text-amber-500',
      onClick: () => setActiveTab('ai'),
      isActive: activeTab === 'ai',
    },
    {
      id: 'circular' as MainTab,
      label: 'সার্কুলার',
      icon: Briefcase,
      badge: '৩টি',
      badgeColor: 'bg-red-500 text-white',
      onClick: () => setActiveTab('circular'),
      isActive: activeTab === 'circular',
    },
    {
      id: 'subject_wise' as MainTab,
      label: 'বিষয়ভিত্তিক প্রস্তুতি',
      icon: Layers,
      badge: null,
      badgeColor: '',
      onClick: () => setActiveTab('subject_wise'),
      isActive: activeTab === 'subject_wise',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#e9edf5] dark:bg-[#0d1522] border-t border-white/70 dark:border-slate-800/80 shadow-[0_-4px_20px_rgba(195,207,226,0.85)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.6)] py-2 px-2 sm:px-4 transition-colors duration-200">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = item.isActive;

          return (
            <button
              key={idx}
              onClick={item.onClick}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all cursor-pointer select-none active:scale-95 ${
                isActive
                  ? 'bg-[#005a36] text-[#fbbf24] shadow-[2px_2px_10px_rgba(0,90,54,0.45)] ring-1 ring-emerald-500/60 dark:ring-emerald-400/50'
                  : 'neu-btn text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {/* Badge Area */}
              <div className="h-4 flex items-center justify-center">
                {item.badge ? (
                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full tracking-wider shadow-xs ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                ) : (
                  <div className="h-2" />
                )}
              </div>

              {/* Icon */}
              <div className="my-0.5">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'text-[#fbbf24] scale-105 stroke-[2.2]' : (item.iconColor ? item.iconColor : 'text-slate-700 dark:text-slate-400 stroke-[2]')
                  }`}
                />
              </div>

              {/* Label */}
              <span className={`text-[10px] sm:text-[11px] whitespace-nowrap leading-tight tracking-tight mt-0.5 ${
                isActive ? 'font-black text-[#fbbf24]' : 'font-semibold text-slate-700 dark:text-slate-300'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
