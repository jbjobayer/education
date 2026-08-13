import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Video, 
  FileCheck2, 
  Calendar, 
  BookOpen, 
  Award, 
  ChevronRight, 
  Star, 
  Users, 
  Clock, 
  Flame, 
  Compass, 
  Zap,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { mockBannerSlides, mockExams, mockCourses, mockRoutines } from '../../data/mockData';
import { CourseCard } from '../CourseCard';

export const HomeView: React.FC = () => {
  const { 
    setActiveTab, 
    setSelectedCourseDetails, 
    startExam, 
    setIsRoutineOpen, 
    setIsNotificationOpen,
    searchQuery,
    setSelectedCategory,
    enrolledCourseIds
  } = useApp();

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockBannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = mockBannerSlides[currentSlide];

  // Filter courses by search if any
  const displayedCourses = searchQuery
    ? mockCourses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : mockCourses;

  return (
    <div className="space-y-6 pb-24 animate-fadeIn">
      {/* Top Banner Slider with Neumorphic Outer Frame */}
      <div className="p-2 sm:p-2.5 rounded-3xl neu-card overflow-hidden">
        <div className={`p-5 sm:p-7 rounded-2xl bg-gradient-to-br ${slide.bgGradient} text-white transition-all duration-700 min-h-[200px] sm:min-h-[230px] flex flex-col justify-between relative overflow-hidden shadow-inner`}>
          {/* Subtle geometric light blur overlay */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md ${slide.badgeColor}`}>
                {slide.tag}
              </span>
              <span className="text-xs text-amber-200 font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> আত-তামরীন একাডেমি
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm">
              {slide.title}
            </h2>
            <p className="text-sm sm:text-base text-amber-300 font-bold mt-1">
              {slide.highlight}
            </p>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-lg leading-relaxed">
              {slide.subtitle}
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                if (slide.id === 'banner-1') setActiveTab('courses');
                else if (slide.id === 'banner-2') setActiveTab('ai');
                else setActiveTab('exams');
              }}
              className="px-5 py-2.5 rounded-xl neu-btn-amber text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5"
            >
              <span>{slide.ctaText}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Slider Inset Indicator Dots */}
            <div className="flex items-center gap-1.5 bg-black/25 px-2.5 py-1.5 rounded-full backdrop-blur-xs">
              {mockBannerSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === idx ? 'w-6 bg-amber-400 shadow-sm' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inset Neumorphic Notice Ticker Bar */}
      <div 
        onClick={() => setIsNotificationOpen(true)}
        className="cursor-pointer neu-inset rounded-2xl p-3 px-4 flex items-center gap-3 text-xs text-amber-950 transition-all hover:bg-[#dfe6f0]"
      >
        <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase shrink-0 shadow-xs">
          বিজ্ঞপ্তি
        </span>
        <p className="truncate flex-1 font-semibold text-slate-700">
          ১৯তম শিক্ষক নিবন্ধন (NTRCA) সার্কুলার ও আবেদন সংক্রান্ত জরুরি নির্দেশনা প্রকাশিত হয়েছে।
        </p>
        <ChevronRight className="w-4 h-4 text-amber-700 shrink-0" />
      </div>

      {/* Neumorphic 6-Grid Quick Actions */}
      <div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-3.5">
          {/* Live Classes */}
          <button
            onClick={() => setIsRoutineOpen(true)}
            className="flex flex-col items-center p-3 sm:p-3.5 rounded-2xl neu-card-hover group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl neu-btn text-red-600 flex items-center justify-center mb-2 group-hover:scale-108 transition-transform">
              <Video className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800 text-center leading-tight">লাইভ ক্লাস</span>
            <span className="text-[10px] text-red-600 font-bold mt-0.5">চলমান</span>
          </button>

          {/* Model Tests */}
          <button
            onClick={() => setActiveTab('exams')}
            className="flex flex-col items-center p-3 sm:p-3.5 rounded-2xl neu-card-hover group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl neu-btn text-amber-600 flex items-center justify-center mb-2 group-hover:scale-108 transition-transform">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800 text-center leading-tight">মডেল টেস্ট</span>
            <span className="text-[10px] text-slate-500 font-semibold mt-0.5">৫০+ সেট</span>
          </button>

          {/* Tamreen AI */}
          <button
            onClick={() => setActiveTab('ai')}
            className="flex flex-col items-center p-3 sm:p-3.5 rounded-2xl neu-card-hover group cursor-pointer border border-amber-300/60"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center mb-2 shadow-md group-hover:scale-108 transition-transform">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-xs font-extrabold text-emerald-900 text-center leading-tight">তামরীন AI</span>
            <span className="text-[10px] text-amber-700 font-bold mt-0.5">ডাউট সলভ</span>
          </button>

          {/* Routine */}
          <button
            onClick={() => setIsRoutineOpen(true)}
            className="flex flex-col items-center p-3 sm:p-3.5 rounded-2xl neu-card-hover group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl neu-btn text-blue-600 flex items-center justify-center mb-2 group-hover:scale-108 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800 text-center leading-tight">ক্লাস রুটিন</span>
            <span className="text-[10px] text-slate-500 font-semibold mt-0.5">সাপ্তাহিক</span>
          </button>

          {/* Question Bank */}
          <button
            onClick={() => setActiveTab('exams')}
            className="flex flex-col items-center p-3 sm:p-3.5 rounded-2xl neu-card-hover group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl neu-btn text-purple-600 flex items-center justify-center mb-2 group-hover:scale-108 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800 text-center leading-tight">বিগত প্রশ্ন</span>
            <span className="text-[10px] text-slate-500 font-semibold mt-0.5">ব্যাখ্যাসহ</span>
          </button>

          {/* All Courses */}
          <button
            onClick={() => setActiveTab('courses')}
            className="flex flex-col items-center p-3 sm:p-3.5 rounded-2xl neu-card-hover group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl neu-btn text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-108 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-slate-800 text-center leading-tight">সব কোর্স</span>
            <span className="text-[10px] text-emerald-700 font-bold mt-0.5">স্পেশাল ছাড়</span>
          </button>
        </div>
      </div>

      {/* Active Live Class Neumorphic Alert Card */}
      {mockRoutines.find(r => r.status === 'live') && (
        <div className="p-4 sm:p-5 rounded-3xl neu-card border-l-4 border-l-red-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-lg animate-pulse">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-extrabold flex items-center gap-1 border border-red-200">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span> লাইভ ক্লাস চলছে
                </span>
                <span className="text-xs text-slate-500 font-semibold">আজ রাত ৯:০০ টা</span>
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 mt-1">
                আরবি ২য় পত্র: কালিমাহ ও ইরব নির্ণয়ের টেকনিক
              </h4>
              <p className="text-xs text-slate-500">
                মুফতী মাওলানা আবদুল্লাহ আল-ফারুক • ১৯তম প্রভাষক ব্যাচ
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsRoutineOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>সরাসরি ক্লাসে যোগ দিন</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Featured Courses Section */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h3 className="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-700" />
              জনপ্রিয় শিক্ষক নিবন্ধন ও স্পেশাল ব্যাচ
            </h3>
            <p className="text-xs text-slate-500">সিলেবাসভিত্তিক মানসম্মত ক্লাস ও মক টেস্ট</p>
          </div>

          <button
            onClick={() => setActiveTab('courses')}
            className="px-3 py-1.5 rounded-xl neu-btn text-xs font-bold text-emerald-800 flex items-center gap-0.5"
          >
            <span>সব দেখুন</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Neumorphic Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedCourses.slice(0, 4).map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            return (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={isEnrolled}
                onClick={() => setSelectedCourseDetails(course)}
              />
            );
          })}
        </div>
      </div>

      {/* Live Exams Section with Neumorphic Cards */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              চলমান লাইভ মডেল টেস্ট
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">রিয়েলটাইম ওএমআর স্কোর ও জাতীয় মেধা তালিকা</p>
          </div>

          <button
            onClick={() => setActiveTab('exams')}
            className="px-3 py-1.5 rounded-xl neu-btn text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-0.5"
          >
            <span>সব পরীক্ষা</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3.5">
          {mockExams.slice(0, 2).map((exam) => (
            <div
              key={exam.id}
              className="p-4 sm:p-5 rounded-3xl neu-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl neu-btn text-emerald-800 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                      লাইভ এক্সাম
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{exam.subject}</span>
                  </div>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 mt-1">{exam.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    <span>পূর্ণমান: <strong className="text-slate-800 dark:text-slate-200">{exam.totalMarks}</strong></span>
                    <span>সময়: <strong className="text-slate-800 dark:text-slate-200">{exam.durationMinutes} মিনিট</strong></span>
                    <span>অংশগ্রহণকারী: <strong className="text-slate-800 dark:text-slate-200">{exam.participantsCount}+</strong></span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => startExam(exam)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl neu-btn-primary font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shrink-0"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>পরীক্ষায় অংশ নিন</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AI Mentor Showcase Neumorphic Banner */}
      <div className="p-5 sm:p-6 rounded-3xl neu-card bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-lg">
            <Sparkles className="w-6 h-6 animate-spin text-slate-950" />
          </div>
          <div>
            <h4 className="font-black text-base sm:text-lg text-amber-300">
              আরবি ব্যাকরণ বা যেকোনো বিষয়ে সমস্যা?
            </h4>
            <p className="text-xs sm:text-sm text-emerald-200 mt-0.5">
              তামরীন এআই আপনাকে দেবে শতভাগ সঠিক ও তথ্যবহুল সমাধান ২৪/৭!
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('ai')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl neu-btn-amber font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shrink-0"
        >
          <MessageSquare className="w-4 h-4" />
          <span>তামরীন AI কে জিজ্ঞেস করুন</span>
        </button>
      </div>
    </div>
  );
};
