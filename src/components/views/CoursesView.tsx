import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles,
  GraduationCap,
  SlidersHorizontal,
  BookOpen,
  Scroll,
  Landmark,
  Globe,
  Search,
  X
} from 'lucide-react';
import { CourseCard } from '../CourseCard';
import { CourseCategory } from '../../types';

export const CoursesView: React.FC = () => {
  const { 
    courses, 
    setSelectedCourseDetails, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery, 
    setSearchQuery,
    enrolledCourseIds
  } = useApp();

  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  const subjectFilters = [
    {
      id: 'all',
      label: 'সকল বিষয়',
      icon: SlidersHorizontal,
      iconBg: 'bg-[#ccfbf1]',
      iconColor: 'text-[#0f766e]',
      category: 'all' as CourseCategory,
      keyword: '',
    },
    {
      id: 'arabic_lecturer',
      label: 'আরবি প্রভাষক',
      icon: BookOpen,
      iconBg: 'bg-[#ccfbf1]',
      iconColor: 'text-[#0f766e]',
      category: 'madrasah_ntrca' as CourseCategory,
      keyword: 'প্রভাষক',
    },
    {
      id: 'assistant_moulvi',
      label: 'সহকারী মৌলভী',
      icon: Scroll,
      iconBg: 'bg-[#ffe4e6]',
      iconColor: 'text-[#e11d48]',
      category: 'madrasah_ntrca' as CourseCategory,
      keyword: 'সহকারী মৌলভী',
    },
    {
      id: 'ebtedaye_moulvi',
      label: 'ইবতেদায়ী মৌলবি',
      icon: Landmark,
      iconBg: 'bg-[#fef3c7]',
      iconColor: 'text-[#d97706]',
      category: 'madrasah_ntrca' as CourseCategory,
      keyword: 'ইবতেদায়ী',
    },
    {
      id: 'general_subjects',
      label: 'জেনারেল বিষয়',
      icon: Globe,
      iconBg: 'bg-[#ede9fe]',
      iconColor: 'text-[#7c3aed]',
      category: 'general_ntrca' as CourseCategory,
      keyword: 'জেনারেল',
    },
  ];

  const filteredCourses = courses.filter((c) => {
    // Check subject filter
    let matchesSubject = true;
    if (selectedSubjectFilter !== 'all') {
      const filter = subjectFilters.find((f) => f.id === selectedSubjectFilter);
      if (filter && filter.keyword) {
        matchesSubject = c.title.toLowerCase().includes(filter.keyword.toLowerCase()) || 
                         c.category === filter.category;
      }
    }

    // Check main category filter
    const matchesCategory = 
      selectedCategory === 'all' || 
      c.category === selectedCategory;
      
    // Check search query
    const matchesSearch = 
      !searchQuery || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructors.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
    return matchesSubject && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-5 animate-fadeIn pb-14">
      {/* Top Emerald Green Banner (100% matched with screenshot) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#005a36] text-white flex items-center justify-between shadow-[4px_4px_14px_rgba(195,207,226,0.85),-4px_-4px_14px_rgba(255,255,255,0.9)] relative overflow-hidden border border-[#007043]/40">
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-emerald-200 text-xs sm:text-sm font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300" />
            <span>তামরীন একাডেমি</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            আমাদের কোর্স সমূহ
          </h2>
        </div>

        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 shadow-inner shrink-0">
          <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-100" />
        </div>
      </div>

      {/* Subject Filter Section (বিষয় নির্বাচন করুন | ৭টি কোর্স সহজলভ্য) */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="font-extrabold text-sm sm:text-base text-[#111827] dark:text-slate-100">
            বিষয় নির্বাচন করুন
          </h3>
          <span className="bg-[#e6f7ef] dark:bg-[#064e3b]/40 text-[#059669] dark:text-[#34d399] border border-[#a7f3d0] dark:border-emerald-700/50 px-3 py-0.5 rounded-full text-xs font-bold shadow-xs">
            {courses.length}টি কোর্স সহজলভ্য
          </span>
        </div>

        {/* Horizontal Subject Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar py-1">
          {subjectFilters.map((sub) => {
            const Icon = sub.icon;
            const isSelected = selectedSubjectFilter === sub.id;

            return (
              <button
                key={sub.id}
                onClick={() => {
                  setSelectedSubjectFilter(sub.id);
                  if (sub.category !== 'all') {
                    setSelectedCategory(sub.category);
                  }
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl min-w-[92px] sm:min-w-[105px] transition-all cursor-pointer select-none active:scale-95 ${
                  isSelected
                    ? 'neu-btn border-2 border-[#14b8a6] bg-[#edf2f9] dark:bg-[#18263e] shadow-[3px_3px_8px_rgba(195,207,226,0.8),-3px_-3px_8px_rgba(255,255,255,0.9)] dark:shadow-[3px_3px_8px_rgba(0,0,0,0.6),-3px_-3px_8px_rgba(255,255,255,0.05)]'
                    : 'neu-btn hover:bg-[#f0f4fa] dark:hover:bg-[#152338]'
                }`}
              >
                {/* Circular Icon Plate */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 shadow-2xs ${sub.iconBg} ${sub.iconColor}`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>

                {/* Subject Label */}
                <span
                  className={`text-xs font-bold text-center leading-tight whitespace-nowrap ${
                    isSelected ? 'text-[#111827] dark:text-emerald-400 font-black' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {sub.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Course Cards List (100% matching screenshot) */}
      <div className="space-y-4">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            return (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={isEnrolled}
                onClick={() => setSelectedCourseDetails(course)}
              />
            );
          })
        ) : (
          <div className="text-center py-12 rounded-3xl neu-card p-6">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">কোনো কোর্স পাওয়া যায়নি</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">অন্য কোনো বিষয় নির্বাচন করে দেখুন।</p>
            <button
              onClick={() => {
                setSelectedSubjectFilter('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-1.5 rounded-full neu-btn text-xs font-bold text-[#005a36] dark:text-emerald-400"
            >
              সকল কোর্স দেখুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
