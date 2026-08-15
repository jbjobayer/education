import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Flame, 
  Zap, 
  Layers, 
  BookOpen, 
  SlidersHorizontal, 
  Share2, 
  Clock, 
  FileText, 
  Award, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Users, 
  Calendar,
  Sparkles,
  Trophy,
  RefreshCw
} from 'lucide-react';
import { Exam } from '../../types';

export const ExamsView: React.FC = () => {
  const { exams, startExam, examResults, setViewingResult, setResultSubTab, refreshFromDatabase, isLoadingData } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'daily' | 'free'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'latest' | 'participants' | 'marks'>('latest');
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Subject list extracted from exams
  const subjects = useMemo(() => {
    const set = new Set<string>();
    exams.forEach(e => {
      if (e.subject) set.add(e.subject);
    });
    return Array.from(set);
  }, [exams]);

  const handleShare = (examTitle: string) => {
    if (navigator.share) {
      navigator.share({
        title: examTitle,
        text: `আত-তামরীন একাডেমিতে '${examTitle}' ওএমআর পরীক্ষায় অংশ নিন!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setShareToast(`'${examTitle}' লিংক কপি করা হয়েছে!`);
      setTimeout(() => setShareToast(null), 2500);
    }
  };

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = exam.title.toLowerCase().includes(q);
        const matchSubject = exam.subject.toLowerCase().includes(q);
        if (!matchTitle && !matchSubject) return false;
      }

      // Filter Pill
      if (activeFilter === 'daily') {
        if (exam.category !== 'daily') return false;
      } else if (activeFilter === 'free') {
        if (!exam.isFree && exam.category !== 'free') return false;
      }

      // Subject
      if (selectedSubject !== 'all' && exam.subject !== selectedSubject) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortOrder === 'participants') {
        return (b.participantsCount || 0) - (a.participantsCount || 0);
      }
      if (sortOrder === 'marks') {
        return b.totalMarks - a.totalMarks;
      }
      return 0; // default latest order
    });
  }, [exams, searchQuery, activeFilter, selectedSubject, sortOrder]);

  return (
    <div className="space-y-4 sm:space-y-5 pb-24 animate-fadeIn">
      {/* Toast Notification */}
      {shareToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#004d2e] text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl border border-emerald-400/40 animate-bounce">
          {shareToast}
        </div>
      )}

      {/* 1. Deep Green Hero Card (Matching Screenshot 1) */}
      <div className="bg-gradient-to-b from-[#023b24] via-[#004d2e] to-[#013821] text-white rounded-3xl p-5 sm:p-7 shadow-lg relative overflow-hidden text-center">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#fbbf24]/10 rounded-full blur-xl pointer-events-none"></div>

        {/* Top Gold Pill Badge */}
        <div className="inline-flex items-center gap-1.5 bg-[#012d1b]/70 border border-[#fbbf24]/40 text-[#fbbf24] px-3.5 py-1 rounded-full text-xs font-black shadow-inner mb-3">
          <span>🎓</span>
          <span>আত-তামরীন একাডেমি</span>
        </div>

        {/* Big Heading */}
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1.5">
          পরীক্ষা দিন
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-emerald-100/90 font-medium max-w-md mx-auto mb-4">
          নিজেকে যাচাই করুন, সাফল্যের পথে এগিয়ে যান
        </p>

        {/* Action / Stat Pills */}
        <div className="flex items-center justify-center gap-2.5 flex-wrap">
          <div className="bg-[#02331f]/90 border border-emerald-600/40 text-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>উপলব্ধ পরীক্ষা: {filteredExams.length}টি</span>
          </div>

          <button
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('all');
              setSelectedSubject('all');
            }}
            className="bg-[#02331f]/90 hover:bg-[#03442a] border border-emerald-600/40 text-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-300" />
            <span>রিফ্রেশ</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Filter Bar Container (Matching Screenshot 1) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 space-y-3.5">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="পরীক্ষার নাম, বিষয় বা প্রশ্নপত্র দিয়ে খুঁজুন (যেমন: হাদিস, কুরআন, ইংরেজি...)"
            className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
              activeFilter === 'all'
                ? 'bg-[#004d2e] text-white shadow-md font-black'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>সবগুলো</span>
          </button>

          <button
            onClick={() => setActiveFilter('daily')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
              activeFilter === 'daily'
                ? 'bg-[#004d2e] text-white shadow-md font-black'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>দৈনিক মডেল টেস্ট</span>
          </button>

          <button
            onClick={() => setActiveFilter('free')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
              activeFilter === 'free'
                ? 'bg-[#004d2e] text-white shadow-md font-black'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
            <span>ফ্রি এক্সাম</span>
          </button>
        </div>

        {/* Dropdown Selectors Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {/* Subject Dropdown */}
          <div className="relative">
            <BookOpen className="w-4 h-4 text-emerald-700 dark:text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              aria-label="সকল বিষয় নির্বাচন করুন"
              className="w-full appearance-none pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="all">সকল বিষয়</option>
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</span>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <SlidersHorizontal className="w-4 h-4 text-emerald-700 dark:text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              aria-label="ক্রমানুসার নির্বাচন করুন"
              className="w-full appearance-none pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="latest">সর্বশেষ প্রকাশিত</option>
              <option value="participants">সর্বাধিক পরীক্ষার্থী</option>
              <option value="marks">সর্বোচ্চ নম্বর</option>
            </select>
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</span>
          </div>
        </div>
      </div>

      {/* 3. Exam Cards List (Matching Screenshots 1, 2, 3) */}
      <div className="space-y-4">
        {filteredExams.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 text-center text-slate-500 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-inner">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">
              {exams.length === 0 ? 'এখনো কোনো পরীক্ষা যুক্ত করা হয়নি' : 'কোনো পরীক্ষা পাওয়া যায়নি'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              {exams.length === 0 
                ? 'এডমিন প্যানেল থেকে নতুন পরীক্ষা বা ওএমআর প্রশ্ন তৈরি করলে তা সরাসরি এখানে লাইভ চলে আসবে।'
                : 'আপনার অনুসন্ধান বা ফিল্টারের সাথে মিলে এমন কোনো পরীক্ষা নেই।'}
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                  setSelectedSubject('all');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                ফিল্টার রিসেট
              </button>
              <button
                onClick={async () => {
                  await refreshFromDatabase();
                }}
                disabled={isLoadingData}
                className="px-4 py-2 bg-[#004d2e] hover:bg-[#003822] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
                <span>{isLoadingData ? 'লোড হচ্ছে...' : 'ডাটা রিফ্রেশ করুন'}</span>
              </button>
            </div>
          </div>
        ) : (
          filteredExams.map((exam) => {
            const completedResult = examResults.find((r) => r.examId === exam.id);
            const isCompleted = !!completedResult;

            return (
              <div
                key={exam.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all space-y-3.5"
              >
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  {/* Left Badge: Free Exam / Daily Pill */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className="bg-emerald-50 dark:bg-emerald-950/40 text-[#004d2e] dark:text-emerald-400 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                      {exam.category === 'daily' ? 'দৈনিক মডেল টেস্ট' : 'ফ্রি এক্সাম'}
                    </span>
                  </div>

                  {/* Right Tags: Free + Share */}
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200 dark:border-emerald-800/60">
                      <Sparkles className="w-3 h-3" />
                      <span>ফ্রি</span>
                    </span>

                    <button
                      onClick={() => handleShare(exam.title)}
                      className="bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200 dark:border-emerald-800/60 transition-colors"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>শেয়ার</span>
                    </button>
                  </div>
                </div>

                {/* Exam Title */}
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100 leading-snug">
                    {exam.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                    বিষয়: <span className="text-slate-800 dark:text-slate-200 font-bold">{exam.subject}</span>
                  </p>
                </div>

                {/* 3 Metric Chips Row */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-2 sm:p-2.5 text-center flex items-center justify-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold">{exam.durationMinutes} মি.</span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-2 sm:p-2.5 text-center flex items-center justify-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold">{exam.totalQuestions} প্রশ্ন</span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-2 sm:p-2.5 text-center flex items-center justify-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="text-xs font-bold">{exam.totalMarks} নম্বর</span>
                  </div>
                </div>

                {/* Secondary Meta Row */}
                <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium pt-0.5 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{exam.participantsCount.toLocaleString('bn-BD')}+ পরীক্ষার্থী</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{exam.dateStr || 'চলমান'}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-1">
                  {isCompleted ? (
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => {
                          setResultSubTab('explanation');
                          setViewingResult(completedResult);
                        }}
                        className="w-full py-2.5 sm:py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-[#004d2e] dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>ব্যাখ্যা সহ উত্তর</span>
                      </button>

                      <button
                        onClick={() => {
                          setResultSubTab('leaderboard');
                          setViewingResult(completedResult);
                        }}
                        className="w-full py-2.5 sm:py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
                      >
                        <Trophy className="w-4 h-4 text-amber-600 fill-amber-500" />
                        <span>মেধাতালিকা</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startExam(exam)}
                      className="w-full py-3 rounded-2xl bg-[#004d2e] hover:bg-[#003822] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>পরীক্ষা দিন</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
