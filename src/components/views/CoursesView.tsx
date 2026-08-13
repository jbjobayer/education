import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  Star, 
  Video, 
  FileText, 
  Clock, 
  Users, 
  Sparkles, 
  CheckCircle2,
  Search,
  Filter
} from 'lucide-react';
import { CourseCategory } from '../../types';

export const CoursesView: React.FC = () => {
  const { 
    courses, 
    selectedCategory, 
    setSelectedCategory, 
    setSelectedCourseDetails, 
    enrolledCourseIds,
    searchQuery,
    setSearchQuery 
  } = useApp();

  const categories: { id: CourseCategory; label: string }[] = [
    { id: 'all', label: 'সব কোর্স' },
    { id: 'madrasah_ntrca', label: 'মাদ্রাসা শিক্ষক নিবন্ধন' },
    { id: 'general_ntrca', label: 'জেনারেল NTRCA' },
    { id: 'arabic_language', label: 'আরবি ভাষা ও ব্যাকরণ' },
    { id: 'subject_wise', label: 'বিষয়ভিত্তিক ব্যাচ' },
  ];

  const filteredCourses = courses.filter((c) => {
    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch = 
      !searchQuery || 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-24 animate-fadeIn">
      {/* View Header with Neumorphic Styling */}
      <div className="p-5 sm:p-6 rounded-3xl neu-card">
        <div className="max-w-2xl">
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full shadow-xs">
            আমাদের সকল কোর্স ও ব্যাচ
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 leading-tight">
            ১৯তম শিক্ষক নিবন্ধন ও মাদ্রাসা নিয়োগ প্রস্তুতি
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
            অভিজ্ঞ প্রভাষক ও জাতীয় পর্যায়ের মেন্টরদের তত্ত্বাবধানে সর্বোচ্চ মানের লাইভ ক্লাস, বিষয়ভিত্তিক ওএমআর মডেল টেস্ট ও তামরীন এআই সহায়তা।
          </p>
        </div>

        {/* Neumorphic Inset Category Pills */}
        <div className="mt-5 p-2 rounded-2xl neu-inset flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-all ${
                  isSelected
                    ? 'neu-tab-active-amber bg-amber-400 text-slate-950 font-black shadow-[4px_4px_8px_#c2cfdf,-4px_-4px_8px_#ffffff]'
                    : 'text-slate-600 hover:text-emerald-900 font-bold hover:bg-white/50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Courses List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledCourseIds.includes(course.id);

          return (
            <div
              key={course.id}
              onClick={() => setSelectedCourseDetails(course)}
              className="p-3.5 rounded-3xl neu-card-hover cursor-pointer flex flex-col justify-between h-full group"
            >
              <div className="flex-1 flex flex-col">
                <div className="relative h-44 sm:h-48 overflow-hidden rounded-2xl bg-slate-200 shadow-inner">
                  <img
                    src={course.coverImage}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {course.badge && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-black shadow-md">
                        {course.badge}
                      </span>
                    )}
                    {isEnrolled && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white text-xs font-black shadow-md flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> এনরোল করা আছে
                      </span>
                    )}
                  </div>

                  <span className="absolute bottom-2.5 left-3 text-xs font-bold text-white flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {course.rating} • {course.totalStudents}+ শিক্ষার্থী
                  </span>
                </div>

                <div className="p-2.5 pt-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-emerald-800 transition-colors leading-snug line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-emerald-800 font-bold mt-1 line-clamp-1">
                      {course.subtitle}
                    </p>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed font-normal">
                      {course.description}
                    </p>

                    {/* Instructors Preview */}
                    <div className="mt-3 flex items-center gap-2 pt-2.5 border-t border-white/60">
                      <div className="flex -space-x-2 overflow-hidden">
                        {course.instructors.map((inst) => (
                          <img
                            key={inst.id}
                            src={inst.image}
                            alt={inst.name}
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-[#e9edf5] object-cover shadow-xs"
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium truncate">
                        মেন্টর: {course.instructors.map(i => i.name.split(' ')[0]).join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Specs Inset Bar */}
                  <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-slate-600 neu-inset p-2 rounded-xl text-center font-medium">
                    <span className="flex items-center justify-center gap-1">
                      <Video className="w-3.5 h-3.5 text-emerald-700" /> {course.totalClasses}টি ক্লাস
                    </span>
                    <span className="flex items-center justify-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-emerald-700" /> {course.totalExams}টি এক্সাম
                    </span>
                    <span className="flex items-center justify-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-700" /> {course.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-2.5 pt-2.5 border-t border-white/60 flex items-center justify-between gap-2 mt-2">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">কোর্স ফি</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-black text-emerald-950">৳{course.price}</span>
                    <span className="text-xs text-slate-400 line-through">৳{course.originalPrice}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCourseDetails(course);
                  }}
                  className={`px-4 py-2 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                    isEnrolled
                      ? 'neu-btn text-emerald-900'
                      : 'neu-btn-primary'
                  }`}
                >
                  {isEnrolled ? 'ক্লাসরুমে যান' : 'বিস্তারিত ও ভর্তি'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12 neu-card rounded-3xl p-8 space-y-2">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="font-extrabold text-slate-800 text-sm">কোনো কোর্স পাওয়া যায়নি</h4>
          <p className="text-xs text-slate-500">অন্য কোনো কি-ওয়ার্ড দিয়ে সার্চ করুন বা ক্যাটাগরি পরিবর্তন করুন।</p>
        </div>
      )}
    </div>
  );
};
