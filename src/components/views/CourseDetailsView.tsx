import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Check, 
  CreditCard, 
  Sparkles, 
  Landmark, 
  FileText, 
  CheckCircle2, 
  Users, 
  Calendar, 
  Bookmark, 
  BookOpen, 
  Trophy, 
  Clock, 
  RotateCcw, 
  FileSearch, 
  Lock, 
  Download, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  PlayCircle,
  Award,
  Star,
  Flame,
  CheckCircle,
  FileCheck2,
  Share2
} from 'lucide-react';
import { Course, CourseExamItem, CourseLectureSheet, Exam } from '../../types';
import { mockExams, mockLeaderboardData, mockRoutines } from '../../data/mockData';

type CourseTabType = 'details' | 'routine' | 'syllabus' | 'sheets' | 'exams' | 'leaderboard';

export const CourseDetailsView: React.FC = () => {
  const { 
    selectedCourseDetails, 
    setSelectedCourseDetails, 
    enrolledCourseIds, 
    setCheckoutCourse,
    startExam,
    setViewingResult,
    showToast,
    userProfile
  } = useApp();

  const [activeTab, setActiveTab] = useState<CourseTabType>('details');
  const [expandedModule, setExpandedModule] = useState<number>(0);
  const [readingSheet, setReadingSheet] = useState<CourseLectureSheet | null>(null);

  if (!selectedCourseDetails) return null;

  const course = selectedCourseDetails;
  const isEnrolled = enrolledCourseIds.includes(course.id);

  // Convert numbers to Bengali digits
  const toBn = (num: number | string) => {
    return String(num).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);
  };

  // Fallback sheets if not explicitly provided
  const lectureSheets: CourseLectureSheet[] = course.sheets || [
    {
      id: 'sh-1',
      title: 'উচ্চতর আরবি সাহিত্য ও বালাগাত নোট.pdf',
      subtitle: 'PDF Sheet 01',
      fileSize: '২.৪ MB',
      pagesCount: 45,
    },
    {
      id: 'sh-2',
      title: 'তাফসীরে জালালাইন ও বায়জাবী নোট.pdf',
      subtitle: 'PDF Sheet 02',
      fileSize: '৩.১ MB',
      pagesCount: 58,
    },
    {
      id: 'sh-3',
      title: 'হাদীস শরীফ ও উসূলে হাদীস স্পেশাল.pdf',
      subtitle: 'PDF Sheet 03',
      fileSize: '১.৮ MB',
      pagesCount: 36,
    },
    {
      id: 'sh-4',
      title: 'ইসলামি ফিকহ ও উসূলে ফিকহ মাস্টারনোট.pdf',
      subtitle: 'PDF Sheet 04',
      fileSize: '৪.২ MB',
      pagesCount: 84,
    },
    {
      id: 'sh-5',
      title: 'বিগত ১০ বছরের শিক্ষক নিবন্ধন সমাধান.pdf',
      subtitle: 'PDF Sheet 05',
      fileSize: '৫.৬ MB',
      pagesCount: 92,
    },
  ];

  // Fallback exams if not explicitly provided
  const courseExamsList: CourseExamItem[] = course.courseExams || [
    {
      id: 'ce-1',
      examNumber: 'পরীক্ষা ০১',
      title: 'প্রভাষক আরবি প্রথম পত্র বিশেষ পরীক্ষা',
      topic: 'প্রভাষক আরবি প্রথম পত্র বিশেষ পরীক্ষা',
      dateStr: '১৫ আগস্ট, ২০২৬ (শনিবার)',
      questionCount: 100,
      durationMinutes: 60,
      examRefId: 'exam-1',
    },
    {
      id: 'ce-2',
      examNumber: 'পরীক্ষা ০২',
      title: 'তাজবীদ ও কিরাআত মডেল টেস্ট',
      topic: 'তাজবীদ ও কিরাআত মডেল টেস্ট',
      dateStr: '১৮ আগস্ট, ২০২৬ (মঙ্গলবার)',
      questionCount: 50,
      durationMinutes: 30,
      examRefId: 'exam-2',
    },
    {
      id: 'ce-3',
      examNumber: 'পরীক্ষা ০৩',
      title: 'নাহু ও সরফ স্পেশাল টেস্ট',
      topic: 'নাহু ও সরফ ব্যাকরণ মডেল পরীক্ষা',
      dateStr: '২২ আগস্ট, ২০২৬ (শনিবার)',
      questionCount: 50,
      durationMinutes: 30,
      examRefId: 'exam-3',
    },
    {
      id: 'ce-4',
      examNumber: 'পরীক্ষা ০৪',
      title: 'ফিকহ ও উসূলে ফিকহ মেগা টেস্ট',
      topic: 'কুদুরী ও হিদায়া নির্বাচিত অংশ',
      dateStr: '২৫ আগস্ট, ২০২৬ (মঙ্গলবার)',
      questionCount: 100,
      durationMinutes: 60,
      examRefId: 'exam-1',
    },
  ];

  // Handler for starting practice exam
  const handlePracticeExam = (examItem: CourseExamItem) => {
    const targetExam = mockExams.find(e => e.id === examItem.examRefId) || mockExams[0];
    const customExam: Exam = {
      ...targetExam,
      title: `${examItem.examNumber}: ${examItem.topic}`,
      durationMinutes: examItem.durationMinutes,
      totalQuestions: examItem.questionCount,
      totalMarks: examItem.questionCount,
    };
    startExam(customExam);
  };

  // Handler for viewing answer sheet
  const handleViewAnswerSheet = (examItem: CourseExamItem) => {
    const targetExam = mockExams.find(e => e.id === examItem.examRefId) || mockExams[0];
    const mockResult = {
      id: `res-${examItem.id}`,
      examId: targetExam.id,
      examTitle: `${examItem.examNumber}: ${examItem.topic}`,
      date: examItem.dateStr,
      score: 84,
      totalMarks: examItem.questionCount,
      correctAnswers: Math.floor(examItem.questionCount * 0.84),
      wrongAnswers: 8,
      skippedAnswers: examItem.questionCount - Math.floor(examItem.questionCount * 0.84) - 8,
      timeSpentSeconds: 2450,
      userAnswers: {
        'qa-1': 3,
        'qa-2': 1,
        'qa-3': 0,
        'qa-4': 1,
        'qa-5': 1,
        'qe-1': 1,
        'qe-2': 1,
      },
      rank: 14,
      totalParticipants: course.totalStudents || 722,
    };
    setViewingResult(mockResult);
  };

  // Handler for downloading or viewing PDF sheet
  const handleDownloadSheet = (sheet: CourseLectureSheet) => {
    if (!isEnrolled) {
      setCheckoutCourse(course);
      return;
    }
    showToast(`"${sheet.title}" ডাউনলোড শুরু হয়েছে...`, 'success');
  };

  const handleOpenSheetReader = (sheet: CourseLectureSheet) => {
    if (!isEnrolled) {
      setCheckoutCourse(course);
      return;
    }
    setReadingSheet(sheet);
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-16">
      {/* Top Header Actions Bar */}
      <div className="flex items-center justify-between gap-3">
        {/* Back button */}
        <button
          onClick={() => setSelectedCourseDetails(null)}
          className="neu-btn px-4 py-2 rounded-2xl flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 hover:text-[#005a36] active:scale-95 transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>হোমে ফিরুন</span>
        </button>

        {/* Right Status / Enrollment CTA button */}
        {isEnrolled ? (
          <div className="bg-[#e6f7ef] dark:bg-[#064e3b]/40 text-[#059669] dark:text-[#34d399] border border-[#a7f3d0] dark:border-emerald-700/60 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-xs">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>ভর্তি সক্রিয়</span>
          </div>
        ) : (
          <button
            onClick={() => setCheckoutCourse(course)}
            className="bg-[#005a36] hover:bg-[#004826] text-white px-4 sm:px-5 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>ভর্তি হন (৳{toBn(course.price)})</span>
          </button>
        )}
      </div>

      {/* Signature Deep Emerald Green Hero Banner (100% matched with screenshot) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#004d2e] dark:bg-[#023c24] text-white relative overflow-hidden shadow-[4px_4px_14px_rgba(195,207,226,0.85),-4px_-4px_14px_rgba(255,255,255,0.9)] dark:shadow-[4px_4px_14px_rgba(0,0,0,0.6)] border border-[#007043]/50">
        {/* Top Row: Badge & Institution Circle */}
        <div className="flex items-center justify-between gap-3">
          {/* Yellow Batch Pill Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#f59e0b] text-slate-950 px-3.5 py-1 rounded-xl text-xs font-black shadow-xs">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>{course.batchType || course.badge || 'রেকর্ড ব্যাচ'}</span>
          </div>

          {/* Institution/Bank Icon Circle */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/25 flex items-center justify-center text-emerald-200 border border-white/15 shrink-0 shadow-inner">
            <Landmark className="w-5 h-5 stroke-[2.2]" />
          </div>
        </div>

        {/* Stats Pill Row */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mt-4">
          {/* Sheets Pill */}
          <div className="bg-black/30 hover:bg-black/40 transition-colors text-emerald-100 text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/10 backdrop-blur-xs">
            <FileText className="w-3.5 h-3.5 text-emerald-300" />
            <span>{toBn(course.totalSheets || course.totalClasses)} শিট</span>
          </div>

          {/* Exams Pill */}
          <div className="bg-black/30 hover:bg-black/40 transition-colors text-emerald-100 text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/10 backdrop-blur-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>{toBn(course.totalExams)} পরীক্ষা</span>
          </div>

          {/* Full Model Pill */}
          <div className="bg-black/30 hover:bg-black/40 transition-colors text-amber-200 text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/10 backdrop-blur-xs">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>{course.totalFullModels || '৭ ফুল মডেল'}</span>
          </div>

          {/* Students Pill */}
          <div className="bg-black/30 hover:bg-black/40 transition-colors text-emerald-100 text-[11px] sm:text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/10 backdrop-blur-xs">
            <Users className="w-3.5 h-3.5 text-emerald-300" />
            <span>{toBn(course.totalStudents)} জন</span>
          </div>
        </div>

        {/* Course Main Title & Subtitle */}
        <div className="mt-5 pt-3 border-t border-white/15">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
            {course.title}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/90 font-bold mt-1.5 flex items-center gap-1.5">
            <span>{course.subtitle}</span>
          </p>
        </div>
      </div>

      {/* Horizontal Navigation Tabs (Scrollable) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {/* 1. কোর্স সম্পর্কে বিস্তারিত */}
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer select-none active:scale-95 ${
            activeTab === 'details'
              ? 'bg-[#004d2e] dark:bg-[#059669] text-white shadow-sm font-black border border-[#00603a]'
              : 'neu-btn text-slate-700 dark:text-slate-200 hover:text-[#004d2e]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>কোর্স সম্পর্কে বিস্তারিত</span>
        </button>

        {/* 2. রুটিন */}
        <button
          onClick={() => setActiveTab('routine')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer select-none active:scale-95 ${
            activeTab === 'routine'
              ? 'bg-[#004d2e] dark:bg-[#059669] text-white shadow-sm font-black border border-[#00603a]'
              : 'neu-btn text-slate-700 dark:text-slate-200 hover:text-[#004d2e]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>রুটিন</span>
        </button>

        {/* 3. সিলেবাস */}
        <button
          onClick={() => setActiveTab('syllabus')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer select-none active:scale-95 ${
            activeTab === 'syllabus'
              ? 'bg-[#004d2e] dark:bg-[#059669] text-white shadow-sm font-black border border-[#00603a]'
              : 'neu-btn text-slate-700 dark:text-slate-200 hover:text-[#004d2e]'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>সিলেবাস</span>
        </button>

        {/* 4. লেকচার শিট */}
        <button
          onClick={() => setActiveTab('sheets')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer select-none active:scale-95 ${
            activeTab === 'sheets'
              ? 'bg-[#004d2e] dark:bg-[#059669] text-white shadow-sm font-black border border-[#00603a]'
              : 'neu-btn text-slate-700 dark:text-slate-200 hover:text-[#004d2e]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>লেকচার শিট</span>
        </button>

        {/* 5. পরীক্ষা */}
        <button
          onClick={() => setActiveTab('exams')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer select-none active:scale-95 ${
            activeTab === 'exams'
              ? 'bg-[#004d2e] dark:bg-[#059669] text-white shadow-sm font-black border border-[#00603a]'
              : 'neu-btn text-slate-700 dark:text-slate-200 hover:text-[#004d2e]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>পরীক্ষা</span>
        </button>

        {/* 6. লিডারবোর্ড */}
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer select-none active:scale-95 ${
            activeTab === 'leaderboard'
              ? 'bg-[#004d2e] dark:bg-[#059669] text-white shadow-sm font-black border border-[#00603a]'
              : 'neu-btn text-slate-700 dark:text-slate-200 hover:text-[#004d2e]'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>লিডারবোর্ড</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: কোর্স সম্পর্কে বিস্তারিত (Course Overview Details) */}
      {/* ========================================================================= */}
      {activeTab === 'details' && (
        <div className="space-y-4">
          <div className="neu-card rounded-3xl p-4 sm:p-6 bg-[#e9edf5] dark:bg-[#111b2b] border border-white/80 dark:border-slate-800/80 space-y-5">
            {/* Top Header Card Inside Details */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-[#005a36] dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
                <FileText className="w-5 h-5 stroke-[2.3]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                  কোর্স সম্পর্কে বিস্তারিত
                </h3>
                <p className="text-xs text-[#005a36] dark:text-emerald-400 font-bold">
                  {course.title}
                </p>
              </div>
            </div>

            {/* Overview Paragraph Description */}
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {course.detailedOverview || course.description}
            </p>

            {/* Structured Points Cards */}
            <div className="space-y-3">
              {(course.overviewSections || [
                {
                  title: '১. বিষয়ভিত্তিক মূল বিষয়াদি',
                  items: [
                    'অধ্যায়ভিত্তিক বিস্তারিত আলোচনা',
                    'বিগত বছরের প্রশ্নের সমাধান',
                    'মাস্টার নোট ও শর্টকাট টিপস',
                  ],
                },
                {
                  title: '২. শিক্ষক নিয়োগ ও চূড়ান্ত প্রস্তুতি গাইডলাইন',
                  items: [
                    'ভাইভা ও লিখিত পরীক্ষার বিশেষ কৌশল',
                    'চূড়ান্ত মডেল টেস্ট ও মেধা তালিকা',
                  ],
                },
                {
                  title: '৩. লাইভ ও রেকর্ড ক্লাসের সুবিধা',
                  items: [
                    'যে কোনো সময় আনলিমিটেড রিভিশন',
                    'সার্বক্ষণিক আত-তামরীন মেন্টর সাপোর্ট',
                  ],
                },
              ]).map((section, sIdx) => (
                <div
                  key={sIdx}
                  className="p-4 rounded-2xl bg-[#edf2f9] dark:bg-[#142034] border border-slate-200/80 dark:border-slate-800 shadow-2xs"
                >
                  <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100 mb-2.5">
                    {section.title}
                  </h4>
                  <ul className="space-y-1.5 pl-1">
                    {section.items.map((item, iIdx) => (
                      <li key={iIdx} className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Experienced Mentors Panel */}
            <div className="pt-2">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>অভিজ্ঞ মেন্টর প্যানেল</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.instructors.map((inst) => (
                  <div key={inst.id} className="flex items-center gap-3 p-3.5 rounded-2xl neu-card-sm">
                    <img
                      src={inst.image}
                      alt={inst.name}
                      className="w-12 h-12 rounded-2xl object-cover shadow-xs border border-white/60 dark:border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <h5 className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                        {inst.name}
                      </h5>
                      <p className="text-[11px] text-emerald-800 dark:text-emerald-400 font-bold truncate">
                        {inst.designation}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                        {inst.institution || inst.experience}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: পরীক্ষা (Exams List - 100% matched with screenshots 2 & 3) */}
      {/* ========================================================================= */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          {courseExamsList.map((examItem, idx) => (
            <div
              key={examItem.id}
              className="neu-card rounded-3xl p-4 sm:p-5 bg-[#e9edf5] dark:bg-[#111b2b] border border-white/80 dark:border-slate-800/80 space-y-3.5 transition-all"
            >
              {/* Header Row: Date & Questions/Duration Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Date Pill */}
                <div className="neu-inset px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>{examItem.dateStr}</span>
                </div>

                {/* Questions & Duration Pill */}
                <div className="neu-inset px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>{toBn(examItem.questionCount)}টি প্রশ্ন • {toBn(examItem.durationMinutes)} মিনিট</span>
                </div>
              </div>

              {/* Exam Title */}
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                  {examItem.examNumber}
                </h3>

                {/* Topic Row */}
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="bg-[#ccfbf1] dark:bg-[#064e3b]/50 text-[#0f766e] dark:text-[#2dd4bf] px-2.5 py-0.5 rounded-lg text-[11px] font-black shrink-0">
                    টপিক
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                    {examItem.topic}
                  </p>
                </div>
              </div>

              {/* Bottom Actions based on Enrollment Status */}
              {isEnrolled ? (
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                  {/* 3 Interactive Buttons Row (Screenshot 3) */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {/* 1. প্র্যাকটিস */}
                    <button
                      onClick={() => handlePracticeExam(examItem)}
                      className="neu-btn border border-amber-300 dark:border-amber-700/60 bg-[#edf2f9] dark:bg-[#18263e] hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-800 dark:text-amber-300 py-2.5 px-2 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>প্র্যাকটিস</span>
                    </button>

                    {/* 2. উত্তরমালা */}
                    <button
                      onClick={() => handleViewAnswerSheet(examItem)}
                      className="neu-btn border border-sky-300 dark:border-sky-700/60 bg-[#edf2f9] dark:bg-[#18263e] hover:bg-sky-50 dark:hover:bg-sky-950/30 text-sky-800 dark:text-sky-300 py-2.5 px-2 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
                    >
                      <FileSearch className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>উত্তরমালা</span>
                    </button>

                    {/* 3. মেধা তালিকা */}
                    <button
                      onClick={() => setActiveTab('leaderboard')}
                      className="neu-btn border border-emerald-300 dark:border-emerald-700/60 bg-[#edf2f9] dark:bg-[#18263e] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 py-2.5 px-2 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
                    >
                      <Trophy className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>মেধা তালিকা</span>
                    </button>
                  </div>

                  {/* Footnote text */}
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 text-center font-medium italic">
                    * দ্রষ্টব্য: পুনরায় প্র্যাকটিস দিলে নতুন পয়েন্ট যুক্ত হবে না। ১ম চেষ্টার ফলাফল সংরক্ষিত থাকবে।
                  </p>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
                  {/* Locked Badge */}
                  <div>
                    <span className="bg-[#fef9c3] dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 px-3 py-1 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs">
                      <Lock className="w-3.5 h-3.5" />
                      <span>লকড</span>
                    </span>
                  </div>

                  {/* Locked Banner Bar (Screenshot 2) */}
                  <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40">
                    <div className="flex items-center gap-1.5 text-xs text-amber-950 dark:text-amber-200 font-bold min-w-0">
                      <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">কোর্সে ভর্তি হয়ে পরীক্ষাটি আনলক করুন</span>
                    </div>

                    <button
                      onClick={() => setCheckoutCourse(course)}
                      className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs shrink-0 transition-all cursor-pointer"
                    >
                      আনলক করুন
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: লেকচার শিট (Lecture Sheets & PDF Notes - Screenshot 4) */}
      {/* ========================================================================= */}
      {activeTab === 'sheets' && (
        <div className="space-y-4">
          {/* Top Title Card */}
          <div className="neu-card rounded-3xl p-4 sm:p-5 bg-[#e9edf5] dark:bg-[#111b2b] border border-white/80 dark:border-slate-800/80 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-[#005a36] dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
              <BookOpen className="w-5 h-5 stroke-[2.3]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                লেকচার শিট ও পিডিএফ নোট
              </h3>
              <p className="text-xs text-[#005a36] dark:text-emerald-400 font-bold">
                {course.title}
              </p>
            </div>
          </div>

          {/* List of PDF Notes */}
          <div className="space-y-3">
            {lectureSheets.map((sheet, idx) => (
              <div
                key={sheet.id}
                onClick={() => (isEnrolled ? handleOpenSheetReader(sheet) : setCheckoutCourse(course))}
                className="neu-card rounded-2xl p-3.5 sm:p-4 bg-[#e9edf5] dark:bg-[#111b2b] border border-white/80 dark:border-slate-800/80 flex items-center justify-between gap-3 cursor-pointer hover:bg-[#f0f4fa] dark:hover:bg-[#152338] transition-all group"
              >
                {/* Left File Icon & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl neu-btn text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-900 dark:group-hover:text-emerald-400 transition-colors truncate">
                      {sheet.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                      {sheet.subtitle} {sheet.fileSize ? `• ${sheet.fileSize}` : ''} {sheet.pagesCount ? `• ${toBn(sheet.pagesCount)} পৃষ্ঠা` : ''}
                    </p>
                  </div>
                </div>

                {/* Right Action / Lock */}
                {isEnrolled ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadSheet(sheet);
                      }}
                      title="ডাউনলোড করুন"
                      className="p-2 rounded-xl neu-btn text-slate-700 dark:text-slate-300 hover:text-emerald-700 active:scale-95 transition-all"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSheetReader(sheet);
                      }}
                      className="bg-[#005a36] hover:bg-[#004826] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>পড়ুন</span>
                    </button>
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: সিলেবাস (Full Syllabus & Modules) */}
      {/* ========================================================================= */}
      {activeTab === 'syllabus' && (
        <div className="space-y-4">
          <div className="neu-card rounded-3xl p-4 sm:p-5 bg-[#e9edf5] dark:bg-[#111b2b] border border-white/80 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
                <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  পূর্ণাঙ্গ পাঠ্যক্রম ও সিলেবাস
                </h3>
              </div>
              <span className="text-xs text-emerald-800 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                {toBn(course.syllabus.length)}টি মডিউল
              </span>
            </div>

            <div className="space-y-2.5">
              {course.syllabus.map((mod, idx) => {
                const isOpen = expandedModule === idx;
                return (
                  <div key={idx} className="neu-card-sm rounded-2xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedModule(isOpen ? -1 : idx)}
                      className="w-full p-3.5 flex items-center justify-between bg-transparent transition-colors text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-xl bg-[#005a36] text-white text-xs font-black flex items-center justify-center shrink-0 shadow-xs">
                          {toBn(idx + 1)}
                        </span>
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                          {mod.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-emerald-900 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full font-bold">
                          {toBn(mod.classesCount)} ক্লাস
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="p-3.5 pt-0 neu-inset rounded-xl m-2 space-y-2">
                        {mod.items.map((item, subIdx) => (
                          <div key={subIdx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 pl-2 pt-1">
                            <PlayCircle className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                            <span className="font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: রুটিন (Routine Schedule) */}
      {/* ========================================================================= */}
      {activeTab === 'routine' && (
        <div className="space-y-4">
          <div className="neu-card rounded-3xl p-4 sm:p-5 bg-[#e9edf5] dark:bg-[#111b2b] border border-white/80 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5 mb-4">
              <Calendar className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
              <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100">
                কোর্স ক্লাস ও পরীক্ষার সময়সূচি
              </h3>
            </div>

            <div className="space-y-3">
              {mockRoutines.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-[#edf2f9] dark:bg-[#142034] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-[#005a36] text-white">
                        {item.day}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.time}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                      {item.topic}
                    </h4>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold">
                      {item.instructor} • {item.subject}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <span className={`px-2.5 py-1 rounded-xl text-[10.5px] font-bold ${
                      item.status === 'live' 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'neu-inset text-slate-600 dark:text-slate-400'
                    }`}>
                      {item.status === 'live' ? 'চলমান' : 'আসন্ন'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: লিডারবোর্ড (Course Leaderboard) */}
      {/* ========================================================================= */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          <div className="neu-card rounded-3xl p-4 sm:p-5 bg-[#e9edf5] dark:bg-[#111b2b] border border-white/80 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  কোর্স শীর্ষ মেধা তালিকা
                </h3>
              </div>
              <span className="text-xs text-emerald-800 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                {toBn(course.totalStudents)} জন পরীক্ষার্থী
              </span>
            </div>

            <div className="space-y-2.5">
              {(mockLeaderboardData.default || []).slice(0, 8).map((entry, rankIdx) => (
                <div
                  key={entry.id}
                  className={`p-3 rounded-2xl flex items-center justify-between gap-3 ${
                    rankIdx === 0
                      ? 'bg-amber-50/80 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/50'
                      : rankIdx === 1
                      ? 'bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700'
                      : rankIdx === 2
                      ? 'bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800'
                      : 'bg-[#edf2f9] dark:bg-[#142034] border border-slate-200/70 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      rankIdx === 0 ? 'bg-amber-500 text-slate-950' :
                      rankIdx === 1 ? 'bg-slate-400 text-white' :
                      rankIdx === 2 ? 'bg-amber-700 text-white' : 'neu-inset text-slate-700 dark:text-slate-300'
                    }`}>
                      {toBn(rankIdx + 1)}
                    </span>

                    <img
                      src={entry.avatar}
                      alt={entry.name}
                      className="w-10 h-10 rounded-xl object-cover shadow-2xs border border-white/60 dark:border-slate-700 shrink-0"
                    />

                    <div className="min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                        {entry.name}
                      </h4>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate">
                        {entry.institution || 'সরকারি মাদ্রাসা-ই-আলিয়া'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-black text-xs sm:text-sm text-emerald-800 dark:text-emerald-400 block">
                      {toBn(entry.score)}/{toBn(entry.totalMarks)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      সময়: {toBn(Math.floor(entry.timeSpentSeconds / 60))} মি.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PDF Sheet Reader Modal (When user clicks 'পড়ুন') */}
      {readingSheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#e9edf5] dark:bg-[#111b2b] w-full max-w-2xl rounded-3xl neu-card overflow-hidden my-auto flex flex-col max-h-[90vh] border border-white/80 dark:border-slate-800">
            {/* Modal Header */}
            <div className="p-4 bg-[#005a36] text-white flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-5 h-5 text-emerald-300 shrink-0" />
                <h3 className="font-black text-sm sm:text-base truncate">
                  {readingSheet.title}
                </h3>
              </div>
              <button
                onClick={() => setReadingSheet(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/25 text-white cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Simulated PDF Document Viewer */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-slate-800 dark:text-slate-200">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                    আত-তামরীন একাডেমি • মাস্টার হ্যান্ডনোট
                  </span>
                  <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 mt-1">
                    {readingSheet.title.replace('.pdf', '')}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {course.title} • {readingSheet.subtitle}
                  </p>
                </div>

                <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  <h4 className="font-extrabold text-sm text-[#005a36] dark:text-emerald-400">
                    অধ্যায়ভিত্তিক সারসংক্ষেপ ও গুরুত্বপূর্ণ নোট:
                  </h4>
                  <p>
                    ১. শিক্ষক নিবন্ধন ও মাদ্রাসা শিক্ষক নিয়োগ পরীক্ষায় আরবি সাহিত্যের যুগবিভাগ, জাহিলি যুগের প্রসিদ্ধ সাবআ মুআল্লাকাত এবং ইসলামি যুগের কবিদের পরিচিতি থেকে প্রতি বছর ৪-৬টি প্রশ্ন আসে।
                  </p>
                  <p>
                    ২. ইলমুল বালাগাতের তিনটি মূল শাখা: ইলমুল মাআনি (علم المعاني), ইলমুল বায়ান (علم البيان) এবং ইলমুল বাদি (علم البديع)। এগুলোর সংজ্ঞা, প্রকারভেদ এবং কুরআনিক উদাহরণ মুখস্থ রাখা আবশ্যক।
                  </p>
                  <p>
                    ৩. নাহু ও সরফের ক্ষেত্রে ‘কালেমা’ ও ‘ইরব’ নির্ণয়ের নিয়মাবলী এবং মুরাব-মাবনি এর প্রকারভেদ অত্যন্ত গুরুত্বপূর্ণ।
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#e9edf5] dark:bg-[#111b2b] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-semibold">
                পৃষ্ঠা ১ / {toBn(readingSheet.pagesCount || 45)}
              </span>
              <button
                onClick={() => {
                  handleDownloadSheet(readingSheet);
                  setReadingSheet(null);
                }}
                className="bg-[#005a36] hover:bg-[#004826] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>পিডিএফ ডাউনলোড করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
