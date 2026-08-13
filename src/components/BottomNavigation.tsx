import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  BookOpen, 
  FileCheck2, 
  Sparkles, 
  UserCircle2 
} from 'lucide-react';
import { MainTab } from '../types';

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems: { id: MainTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'home', label: 'হোম', icon: Home },
    { id: 'courses', label: 'কোর্সসমূহ', icon: BookOpen },
    { id: 'exams', label: 'পরীক্ষা', icon: FileCheck2, badge: 'লাইভ' },
    { id: 'ai', label: 'তামরীন AI', icon: Sparkles, badge: 'স্মার্ট' },
    { id: 'profile', label: 'প্রোফাইল', icon: UserCircle2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#e9edf5]/95 backdrop-blur-md border-t border-white/80 shadow-[0_-6px_20px_rgba(195,207,226,0.8)] py-2 px-3">
      <div className="max-w-md mx-auto flex items-center justify-around gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'neu-inset text-emerald-800 scale-102 font-bold'
                  : 'text-slate-500 hover:text-emerald-700 hover:scale-102 font-medium'
              }`}
            >
              {item.badge && (
                <span className="absolute -top-1 right-1 text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-amber-500 text-slate-950 shadow-xs animate-bounce">
                  {item.badge}
                </span>
              )}
              
              <div className={`p-1.5 rounded-xl transition-all ${
                isActive 
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-700 text-white shadow-[2px_2px_5px_#024734]' 
                  : 'neu-btn text-slate-600'
              }`}>
                <Icon className="w-5 h-5" />
              </div>

              <span className={`text-[11px] mt-1 tracking-tight leading-tight ${
                isActive ? 'text-emerald-900 font-extrabold' : 'text-slate-600'
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
