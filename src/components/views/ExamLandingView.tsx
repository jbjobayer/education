import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Clock, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowLeft, 
  Share2, 
  Sparkles, 
  User as UserIcon, 
  Rocket, 
  ShieldCheck, 
  BookOpen, 
  Users, 
  Copy,
  Check
} from 'lucide-react';

const toBengaliNumerals = (n: number | string) => {
  return String(n).replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)]);
};

export const ExamLandingView: React.FC = () => {
  const { 
    landingExam, 
    setLandingExam, 
    startExam, 
    shareExam, 
    userProfile, 
    isLoggedIn,
    openAuthModal,
    showToast, 
    setActiveTab, 
    examResults, 
    setViewingResult, 
    setResultSubTab 
  } = useApp();

  // Participant Name State for Guest Users
  const [participantName, setParticipantName] = useState<string>(() => {
    return localStorage.getItem('tamreen_guest_name') || '';
  });

  const [nameError, setNameError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!landingExam) return null;

  const toBn = (num: number | string | undefined | null) => {
    if (num === undefined || num === null) return '০';
    return toBengaliNumerals ? toBengaliNumerals(String(num)) : String(num);
  };

  // Check if current user has already completed this exam
  const completedResult = examResults.find((r) => r.examId === landingExam.id);

  const handleStartExam = () => {
    // If logged in, automatically use userProfile name
    if (isLoggedIn && userProfile?.name) {
      startExam(landingExam, {
        name: userProfile.name,
        institution: userProfile.institution || '',
        phone: userProfile.phone || ''
      });
      return;
    }

    // Guest user validation
    if (!participantName.trim()) {
      setNameError('অনুগ্রহ করে আপনার নামটি লিখুন');
      showToast('পরীক্ষা শুরু করার পূর্বে আপনার নাম লিখুন', 'error');
      return;
    }
    setNameError(null);

    // Save to local storage for future tests
    localStorage.setItem('tamreen_guest_name', participantName.trim());

    startExam(landingExam, {
      name: participantName.trim()
    });
  };

  const handleCopyLink = () => {
    shareExam(landingExam);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleBack = () => {
    setLandingExam(null);
    // Remove query param from url
    if (window.history.pushState) {
      const newUrl = window.location.pathname;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
    setActiveTab('exams');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-5 pb-20 animate-fadeIn select-none">
      {/* 1. Top Navigation & Action Row */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সকল পরীক্ষা</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-[#004d2e] dark:text-emerald-400 text-xs font-black shadow-xs hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all cursor-pointer active:scale-95"
          title="পরীক্ষার সরাসরি লিংক কপি করুন"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
              <span>লিংক কপি হয়েছে!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>লিংক শেয়ার</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Main Deep Emerald Header Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#023b24] via-[#004d2e] to-[#012d1b] text-white p-5 sm:p-7 shadow-xl overflow-hidden border border-emerald-500/20 text-center">
        {/* Ambient Glow */}
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[#fbbf24]/15 rounded-full blur-2xl pointer-events-none"></div>

        {/* Top Gold Badge */}
        <div className="inline-flex items-center gap-1.5 bg-[#012616]/80 border border-[#fbbf24]/50 text-[#fbbf24] px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-black shadow-inner mb-3.5">
          <Sparkles className="w-3.5 h-3.5 text-[#fbbf24] fill-[#fbbf24]" />
          <span>{landingExam.examType === 'course_exam' ? 'কোর্স বিশেষ পরীক্ষা' : 'ফ্রি লাইভ ওএমআর পরীক্ষা'}</span>
        </div>

        {/* Big Exam Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-snug tracking-tight mb-3">
          📖 {landingExam.title}
        </h1>

        {/* Meta Pill Badges (Subject, Instructor, Academy) */}
        <div className="flex items-center justify-center gap-2 flex-wrap text-[11px] sm:text-xs font-bold text-emerald-100">
          <div className="bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full flex items-center gap-1">
            <span>📚</span>
            <span>{landingExam.subject || 'সাধারণ বিষয়'}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full flex items-center gap-1">
            <span>👤</span>
            <span>{landingExam.authorName || 'আত-তামরীন ফ্যাকাল্টি'}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full flex items-center gap-1">
            <span>🏛️</span>
            <span>{landingExam.institution || 'আত-তামরীন একাডেমি'}</span>
          </div>
        </div>

        {/* Total participants count */}
        <div className="mt-3.5 text-[11px] sm:text-xs text-emerald-200/90 font-medium flex items-center justify-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-emerald-300" />
          <span>ইতোমধ্যে {toBn(landingExam.participantsCount || 150)}+ জন শিক্ষার্থী অংশ নিয়েছেন</span>
        </div>
      </div>

      {/* 3. Three Metric Highlight Cards (Time, Questions, Negative Marking) */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
        {/* Metric 1: Time */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 text-center border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_14px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1.5 shadow-xs">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            সময় (TIME)
          </span>
          <p className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5">
            {toBn(landingExam.durationMinutes)} <span className="text-xs font-semibold text-slate-500">মি.</span>
          </p>
        </div>

        {/* Metric 2: Questions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 text-center border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_14px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1.5 shadow-xs">
            <HelpCircle className="w-4 h-4" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            প্রশ্ন (QUESTIONS)
          </span>
          <p className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5">
            {toBn(landingExam.totalQuestions || landingExam.questions?.length || 20)} <span className="text-xs font-semibold text-slate-500">টি</span>
          </p>
        </div>

        {/* Metric 3: Negative Marking */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 text-center border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_14px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-1.5 shadow-xs">
            <AlertCircle className="w-4 h-4" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            নেগেটিভ (NEGATIVE)
          </span>
          <p className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400 mt-0.5">
            -{toBn(landingExam.negativeMarking ?? 0.25)}
          </p>
        </div>
      </div>

      {/* 4. Exam Instructions (নিয়মাবলী ও নির্দেশিকা) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_14px_rgba(0,0,0,0.03)] space-y-3">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-extrabold text-sm sm:text-base border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
          <span className="text-lg">📋</span>
          <span>পরীক্ষার নিয়মাবলী ও ওএমআর নির্দেশিকা</span>
        </div>

        <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>প্রতিটি সঠিক উত্তরের জন্য <strong className="text-emerald-700 dark:text-emerald-300 font-bold">১.০০ নম্বর</strong> বরাদ্দ থাকবে।</span>
          </li>
          <li className="flex items-start gap-2.5">
            <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>প্রতিটি ভুল উত্তরের জন্য <strong className="text-rose-600 dark:text-rose-400 font-bold">০.২৫ নম্বর</strong> কেটে নেওয়া হবে।</span>
          </li>
          <li className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <span>একবার অপশন সিলেক্ট করলে ওএমআর (OMR) শিটের মতো তা <strong className="text-blue-700 dark:text-blue-300 font-bold">লক হয়ে যাবে</strong>।</span>
          </li>
          <li className="flex items-start gap-2.5">
            <RotateCcw className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>পরীক্ষা চলাকালে পেজ <strong className="text-amber-700 dark:text-amber-400 font-bold">রিফ্রেশ বা ব্যাক করবেন না</strong>।</span>
          </li>
          <li className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
            <span>নির্ধারিত সময় শেষ হলে পরীক্ষা <strong className="text-purple-700 dark:text-purple-300 font-bold">স্বয়ংক্রিয়ভাবে জমা</strong> হয়ে যাবে।</span>
          </li>
        </ul>
      </div>

      {/* 5. Participant Info Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-[0_4px_14px_rgba(0,0,0,0.03)] space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-extrabold text-sm sm:text-base">
            <UserIcon className="w-4 h-4 text-emerald-600" />
            <span>পরীক্ষার্থীর পরিচয়</span>
          </div>
          {isLoggedIn ? (
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" />
              লগইন আছেন
            </span>
          ) : (
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
              নাম আবশ্যক
            </span>
          )}
        </div>

        {isLoggedIn && userProfile?.name ? (
          /* Logged-in User Profile Summary Card (No input required) */
          <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-sm shrink-0">
                {userProfile.name.slice(0, 1)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 truncate">
                    {userProfile.name}
                  </h4>
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                  {userProfile.institution || userProfile.phone || userProfile.email || 'নিবন্ধিত পরীক্ষার্থী'} • স্বয়ংক্রিয়ভাবে লিডারবোর্ডে যুক্ত হবে
                </p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800 px-2 py-1 rounded-xl border border-emerald-200 dark:border-emerald-700/50 shadow-2xs">
                যাচাইকৃত
              </span>
            </div>
          </div>
        ) : (
          /* Guest User Name Input + Option to Login */
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                আপনার নাম লিখুন <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                একাউন্ট আছে? লগইন করুন
              </button>
            </div>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={participantName}
                onChange={(e) => {
                  setParticipantName(e.target.value);
                  if (nameError) setNameError(null);
                }}
                placeholder="আপনার পূর্ণ নাম লিখুন (যেমন: মুহাম্মদ তানভীর আহমেদ)"
                className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all ${
                  nameError 
                    ? 'border-rose-400 ring-2 ring-rose-400/20' 
                    : 'border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-600'
                }`}
              />
            </div>
            {nameError && (
              <p className="text-[11px] font-bold text-rose-500 mt-1.5 pl-1">{nameError}</p>
            )}
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
              💡 আপনি চাইলে <button type="button" onClick={() => openAuthModal('register')} className="text-emerald-600 font-bold underline">নতুন একাউন্ট খুলতে পারেন</button>, তখন পরবর্তী পরীক্ষায় আর নাম লিখতে হবে না।
            </p>
          </div>
        )}
      </div>

      {/* 6. Primary Action Buttons */}
      <div className="space-y-2.5 pt-1">
        {/* START EXAM BIG BUTTON */}
        <button
          onClick={handleStartExam}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#004d2e] via-[#02683e] to-[#004d2e] hover:from-[#003822] hover:to-[#003822] text-white text-base sm:text-lg font-black tracking-wide flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-900/20 hover:shadow-xl hover:shadow-emerald-900/30 active:scale-[0.99] transition-all cursor-pointer"
        >
          <Rocket className="w-5 h-5 fill-amber-300 text-amber-300 animate-bounce" />
          <span>🚀 পরীক্ষা শুরু করুন (START EXAM)</span>
        </button>

        {/* Secondary Row: Completed Result Check & Share link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {completedResult && (
            <button
              onClick={() => {
                setResultSubTab('explanation');
                setViewingResult(completedResult);
              }}
              className="py-3 px-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-800 text-[#004d2e] dark:text-emerald-400 text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>পূর্বের ফলাফল ও সমাধান</span>
            </button>
          )}

          <button
            onClick={handleCopyLink}
            className={`py-3 px-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 ${!completedResult ? 'sm:col-span-2' : ''}`}
          >
            <Copy className="w-4 h-4 text-emerald-600" />
            <span>{copiedLink ? 'লিংক কপি হয়েছে!' : 'পরীক্ষার লিংক কপি করুন'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
