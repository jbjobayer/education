import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  GraduationCap, 
  SlidersHorizontal, 
  BookOpen, 
  Scroll, 
  Landmark, 
  Globe 
} from 'lucide-react';
import { CourseCard } from '../CourseCard';

export const CoursesView: React.FC = () => {
  const { 
    courses, 
    setSelectedCourseDetails, 
    enrolledCourseIds,
    searchQuery
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    {
      id: 'all',
      title: 'সকল বিষয়',
      icon: SlidersHorizontal,
      iconBg: 'bg-[#e2f7ef] text-[#0d8259]',
    },
    {
      id: 'arabic_lecturer',
      title: 'আরবি প্রভাষক',
      icon: BookOpen,
      iconBg: 'bg-[#def7ec] text-[#087f47]',
    },
    {
      id: 'assistant_molvi',
      title: 'সহকারী মৌলভী',
      icon: Scroll,
      iconBg: 'bg-[#fde8e8] text-[#e02424]',
    },
    {
      id: 'ebtedaye_molvi',
      title: 'ইবতেদায়ী মৌলবি',
      icon: Landmark,
      iconBg: 'bg-[#fdf6b2] text-[#c27803]',
    },
    {
      id: 'general',
      title: 'জেনারেল বিষয়',
      icon: Globe,
      iconBg: 'bg-[#e1effe] text-[#1c64f2]',
    },
  ];

  const filteredCourses = courses.filter((c) => {
    let matchesCat = true;
    if (activeCategory === 'arabic_lecturer') {
      matchesCat = c.title.includes('প্রভাষক') || c.category === 'madrasah_ntrca' || c.shortTag?.includes('প্রভাষক');
    } else if (activeCategory === 'assistant_molvi') {
      matchesCat = c.title.includes('সহকারী মৌলভী') || c.shortTag?.includes('সহকারী');
    } else if (activeCategory === 'ebtedaye_molvi') {
      matchesCat = c.title.includes('ইবতেদায়ী') || c.title.includes('ক্বারী') || c.shortTag?.includes('ইবতেদায়ী');
    } else if (activeCategory === 'general') {
      matchesCat = c.category === 'general_ntrca' || c.title.includes('জেনারেল');
    }

    const matchesSearch = 
      !searchQuery || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4 sm:space-y-5 pb-24 animate-fadeIn max-w-4xl mx-auto">
      {/* 1. Green Hero Banner (Exact match to screenshot) */}
      <div className="bg-[#084b2c] rounded-3xl p-5 sm:p-6 text-white shadow-md flex items-center justify-between relative overflow-hidden">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-200 text-xs sm:text-sm font-bold mb-1">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>তামরীন একাডেমি</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            আমাদের কোর্স সমূহ
          </h2>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner shrink-0">
          <GraduationCap className="w-6 h-6 text-emerald-300" />
        </div>
      </div>

      {/* 2. Category Section: বিষয় নির্বাচন করুন + 7টি কোর্স সহজলভ্য */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
            বিষয় নির্বাচন করুন
          </h3>
          <span className="bg-[#def7ec] text-[#087f47] border border-[#bcf0da] text-xs font-bold px-3 py-1 rounded-full shadow-xs">
            {courses.length}টি কোর্স সহজলভ্য
          </span>
        </div>

        {/* Horizontal Category Cards */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 px-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl min-w-[92px] sm:min-w-[105px] h-[92px] sm:h-[100px] border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#087f47] shadow-sm ring-2 ring-[#087f47]/20 scale-102'
                    : 'bg-white border-slate-100 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 ${cat.iconBg}`}>
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className={`text-xs font-bold leading-tight truncate max-w-[85px] ${
                  isSelected ? 'text-[#087f47]' : 'text-slate-700'
                }`}>
                  {cat.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Course Cards List (Exact match to screenshot) */}
      <div className="space-y-3.5">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            return (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={isEnrolled}
                onSelect={(selected) => setSelectedCourseDetails(selected)}
              />
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl p-6 border border-slate-100">
            <p className="text-sm font-bold text-slate-500">
              এই ক্যাটাগরিতে কোনো কোর্স খুঁজে পাওয়া যায়নি।
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
