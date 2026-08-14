import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useFont } from '../../context/FontContext';
import { 
  ArrowLeft, 
  Trophy, 
  Medal, 
  Crown, 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  Bot, 
  MinusCircle, 
  Share2, 
  Users, 
  Check,
  User as UserIcon
} from 'lucide-react';
import Markdown from 'react-markdown';
import { mockExams, mockLeaderboardData } from '../../data/mockData';
import { LeaderboardEntry } from '../../types';

export const ResultView: React.FC = () => {
  const { 
    viewingResult, 
    setViewingResult, 
    resultSubTab, 
    setResultSubTab, 
    startExam, 
    bookmarks, 
    toggleBookmark,
    userProfile 
  } = useApp();
  const { formatArabicText } = useFont();

  const [aiExplanations, setAiExplanations] = useState<Record<string, { loading: boolean; text?: string }>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  if (!viewingResult) return null;

  // Find the original exam to match full questions
  const exam = mockExams.find((e) => e.id === viewingResult.examId) || mockExams[0];

  const percentage = Math.round((viewingResult.score / (viewingResult.totalMarks || 1)) * 100);
  const isPassed = percentage >= 40;

  // Build Leaderboard List including user's dynamic performance
  const leaderboardList: LeaderboardEntry[] = useMemo(() => {
    const base = [...(mockLeaderboardData.default || [])];
    
    // Check if user is already represented or needs update
    const userEntry: LeaderboardEntry = {
      id: 'current-user-res',
      rank: 1, // will recalculate
      name: userProfile.name || 'মুহাম্মদ আব্দুল্লাহ আল-মামুন',
      avatar: userProfile.avatar || '',
      correctAnswers: viewingResult.correctAnswers,
      wrongAnswers: viewingResult.wrongAnswers,
      score: viewingResult.score,
      totalMarks: viewingResult.totalMarks,
      timeSpentSeconds: viewingResult.timeSpentSeconds || 45,
      isCurrentUser: true,
    };

    // Filter out mock user duplicate if any
    const listWithoutUser = base.filter(item => !item.isCurrentUser && item.name !== userEntry.name);
    const combined = [...listWithoutUser, userEntry];

    // Sort by Score descending, then by timeSpent ascending
    combined.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.timeSpentSeconds - b.timeSpentSeconds;
    });

    // Assign Rank 1, 2, 3...
    return combined.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }, [viewingResult, userProfile]);

  const userRankEntry = leaderboardList.find(e => e.isCurrentUser) || leaderboardList[0];

  const handleAskAIExplanation = async (question: any) => {
    setAiExplanations((prev) => ({
      ...prev,
      [question.id]: { loading: true },
    }));

    try {
      const res = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.question,
          options: question.options,
          correctAnswer: question.options[question.correctIndex],
          subject: question.subject,
        }),
      });
      const data = await res.json();
      setAiExplanations((prev) => ({
        ...prev,
        [question.id]: { loading: false, text: data.explanation || question.explanation },
      }));
    } catch {
      setAiExplanations((prev) => ({
        ...prev,
        [question.id]: { loading: false, text: question.explanation },
      }));
    }
  };

  const handleShareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: `${viewingResult.examTitle} - ফলাফল`,
        text: `আমি আত-তামরীন একাডেমিতে '${viewingResult.examTitle}' পরীক্ষায় ${viewingResult.score}/${viewingResult.totalMarks} পেয়েছি!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Split top 3 vs others
  const top1 = leaderboardList.find(e => e.rank === 1);
  const top2 = leaderboardList.find(e => e.rank === 2);
  const top3 = leaderboardList.find(e => e.rank === 3);

  // Helper to render Avatar without default stock photos
  const renderAvatar = (entry: LeaderboardEntry, size = 'w-11 h-11 sm:w-12 sm:h-12') => {
    const hasCustomPhoto = entry.avatar && entry.avatar.trim() !== '' && !entry.avatar.includes('unsplash');
    
    return (
      <div className={`${size} rounded-full border-2 border-emerald-500 p-0.5 shrink-0 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center`}>
        {hasCustomPhoto ? (
          <img
            src={entry.avatar}
            alt={entry.name}
            className="w-full h-full rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-600 to-[#004d2e] text-white flex items-center justify-center font-black text-sm">
            {entry.name.slice(0, 1) || <UserIcon className="w-4 h-4" />}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-24 animate-fadeIn">
      {/* 1. Sticky Navigation Bar */}
      <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setViewingResult(null)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>পরীক্ষার তালিকায় ফিরে যান</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareResult}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-[#004d2e] dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800/60 transition-all active:scale-95 cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'কপি হয়েছে' : 'শেয়ার'}</span>
          </button>

          <button
            onClick={() => {
              setViewingResult(null);
              startExam(exam);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#004d2e] hover:bg-[#003822] text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>পুনরায় পরীক্ষা দিন</span>
          </button>
        </div>
      </div>

      {/* 2. Top Green Hero Card */}
      <div className="bg-gradient-to-b from-[#023b24] via-[#004d2e] to-[#013821] text-white rounded-3xl p-5 sm:p-7 shadow-lg relative overflow-hidden text-center space-y-4">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#fbbf24]/10 rounded-full blur-xl pointer-events-none"></div>

        {/* Top Gold Badge */}
        <div className="inline-flex items-center gap-1.5 bg-[#012d1b]/80 border border-[#fbbf24]/40 text-[#fbbf24] px-3.5 py-1 rounded-full text-xs font-black shadow-inner">
          <Award className="w-3.5 h-3.5 text-amber-300" />
          <span>পরীক্ষার ফলাফল ও মূল্যায়ন</span>
        </div>

        {/* Exam Title */}
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-snug">
            {viewingResult.examTitle}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 font-medium mt-1">
            বিষয়: {exam.subject} • তারিখ: {viewingResult.date} • মোট সময়: {Math.floor(viewingResult.timeSpentSeconds / 60)} মিনিট {viewingResult.timeSpentSeconds % 60} সেকেন্ড
          </p>
        </div>

        {/* 4 Inset Score Badges in Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 max-w-2xl mx-auto">
          {/* 1. Score */}
          <div className="bg-[#02331f]/90 border border-emerald-600/40 rounded-2xl p-3 text-center shadow-sm">
            <span className="text-[11px] text-emerald-200/80 font-semibold block">প্রাপ্ত নম্বর</span>
            <div className="text-xl font-black text-white mt-0.5">
              {viewingResult.score} <span className="text-xs font-normal text-emerald-300/70">/ {viewingResult.totalMarks}</span>
            </div>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full mt-1 inline-block ${
              isPassed ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/30' : 'bg-red-500/30 text-red-300 border border-red-400/30'
            }`}>
              {isPassed ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ'} ({percentage}%)
            </span>
          </div>

          {/* 2. Correct Answers */}
          <div className="bg-[#02331f]/90 border border-emerald-600/40 rounded-2xl p-3 text-center shadow-sm">
            <span className="text-[11px] text-emerald-200/80 font-semibold block">সঠিক উত্তর</span>
            <div className="text-xl font-black text-emerald-300 flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{viewingResult.correctAnswers}</span>
            </div>
            <span className="text-[10px] text-emerald-300/70 font-medium">{viewingResult.correctAnswers}টি সঠিক</span>
          </div>

          {/* 3. Wrong Answers */}
          <div className="bg-[#02331f]/90 border border-emerald-600/40 rounded-2xl p-3 text-center shadow-sm">
            <span className="text-[11px] text-emerald-200/80 font-semibold block">ভুল উত্তর</span>
            <div className="text-xl font-black text-rose-300 flex items-center justify-center gap-1 mt-0.5">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>{viewingResult.wrongAnswers}</span>
            </div>
            <span className="text-[10px] text-rose-300/80 font-semibold">(-{(viewingResult.wrongAnswers * (exam.negativeMarking || 0.25)).toFixed(2)})</span>
          </div>

          {/* 4. Merit Rank */}
          <div className="bg-[#02331f]/90 border border-emerald-600/40 rounded-2xl p-3 text-center shadow-sm">
            <span className="text-[11px] text-emerald-200/80 font-semibold block">মেধা স্থান</span>
            <div className="text-xl font-black text-[#fbbf24] flex items-center justify-center gap-1 mt-0.5">
              <Trophy className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>{userRankEntry.rank}তম</span>
            </div>
            <span className="text-[10px] text-emerald-200/80 font-medium">/{leaderboardList.length} জনের মধ্যে</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setResultSubTab('explanation')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer ${
              resultSubTab === 'explanation'
                ? 'bg-white text-[#004d2e] shadow-lg scale-102'
                : 'bg-[#02331f]/80 text-emerald-100 hover:bg-[#03442a] border border-emerald-600/40'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>ব্যাখ্যা সহ উত্তর</span>
          </button>

          <button
            onClick={() => setResultSubTab('leaderboard')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer ${
              resultSubTab === 'leaderboard'
                ? 'bg-[#fbbf24] text-[#02331f] shadow-lg scale-102 font-black'
                : 'bg-[#02331f]/80 text-emerald-100 hover:bg-[#03442a] border border-emerald-600/40'
            }`}
          >
            <Trophy className="w-4 h-4 fill-current" />
            <span>মেধাতালিকা (Leaderboard)</span>
          </button>
        </div>
      </div>

      {/* 3. Tab Content: SUB-TAB A - LEADERBOARD (মেধাতালিকা) */}
      {resultSubTab === 'leaderboard' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Header Card for Leaderboard */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shadow-xs">
                <Trophy className="w-5 h-5 fill-amber-500" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  জাতীয় মেধা তালিকা (Top Rankers)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  মোট পরীক্ষার্থী: {leaderboardList.length.toLocaleString('bn-BD')} জন
                </p>
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[#004d2e] dark:text-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-black">
              আপনার অবস্থান: {userRankEntry.rank}তম
            </div>
          </div>

          {/* Attractive Podium for 1st, 2nd, 3rd (No Madrasa, No stock photos, Neumorphic Name Button) */}
          <div className="bg-gradient-to-b from-slate-900 via-[#071b12] to-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-emerald-500/20 relative overflow-hidden">
            {/* Ambient Background Lights */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

            <h4 className="text-center font-black text-amber-300 text-xs sm:text-sm tracking-wider uppercase mb-6 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>শীর্ষ ৩ মেধা স্থানাধিকারী (Top 3 Champions)</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h4>

            {/* 3 Columns Podium Layout */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end max-w-xl mx-auto pt-4">
              {/* 2nd Place (Silver) */}
              {top2 && (
                <div className="flex flex-col items-center text-center space-y-2 order-1 group">
                  <div className="relative">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600 shadow-lg">
                      <div className="w-full h-full rounded-full bg-slate-800 border-2 border-emerald-500 flex items-center justify-center text-white font-black text-base">
                        {top2.name.slice(0, 1)}
                      </div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-900 w-6 h-6 rounded-full font-black text-xs flex items-center justify-center shadow-md border-2 border-slate-900">
                      ২
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col items-center">
                    {/* Neumorphic Name Button */}
                    <div className="bg-slate-800/90 shadow-[3px_3px_6px_rgba(0,0,0,0.6),-2px_-2px_5px_rgba(255,255,255,0.1)] border border-slate-700/60 px-3 py-1 rounded-xl text-slate-100 font-extrabold text-xs sm:text-sm truncate max-w-[120px]">
                      {top2.name}
                    </div>
                    
                    {/* Score Tag */}
                    <div className="mt-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl px-2 py-1 text-[11px] font-bold text-slate-200">
                      <span className="text-amber-400 font-black">{top2.score}</span> / {top2.totalMarks}
                    </div>
                  </div>

                  {/* Podium Base */}
                  <div className="w-full h-20 sm:h-24 bg-gradient-to-t from-slate-800 to-slate-700/70 rounded-t-2xl flex items-center justify-center border-t-2 border-slate-400 shadow-inner">
                    <div className="text-center">
                      <Medal className="w-5 h-5 text-slate-300 mx-auto mb-1" />
                      <span className="text-[10px] sm:text-xs font-black text-slate-300 uppercase">২য় স্থান</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 1st Place (Gold Champion) */}
              {top1 && (
                <div className="flex flex-col items-center text-center space-y-2 order-2 -mt-6 group">
                  <div className="relative">
                    <Crown className="w-7 h-7 text-amber-400 fill-amber-400 absolute -top-5 left-1/2 -translate-x-1/2 animate-bounce" />
                    <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full p-1.5 bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 shadow-[0_0_24px_rgba(245,158,11,0.5)]">
                      <div className="w-full h-full rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-amber-300 font-black text-xl">
                        {top1.name.slice(0, 1)}
                      </div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 w-7 h-7 rounded-full font-black text-sm flex items-center justify-center shadow-lg border-2 border-slate-900">
                      ১
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col items-center">
                    {/* Neumorphic Name Button */}
                    <div className="bg-amber-950/80 shadow-[3px_3px_8px_rgba(0,0,0,0.6),-2px_-2px_6px_rgba(245,158,11,0.2)] border border-amber-500/50 px-3.5 py-1.5 rounded-xl text-amber-300 font-black text-xs sm:text-sm truncate max-w-[130px]">
                      {top1.name}
                    </div>
                    
                    {/* Score Tag */}
                    <div className="mt-1.5 bg-amber-950/60 border border-amber-500/40 rounded-xl px-2.5 py-1 text-xs font-black text-amber-300">
                      <span className="text-white font-black">{top1.score}</span> / {top1.totalMarks}
                    </div>
                  </div>

                  {/* Podium Base */}
                  <div className="w-full h-28 sm:h-32 bg-gradient-to-t from-amber-600/40 via-amber-500/20 to-amber-500/40 rounded-t-2xl flex items-center justify-center border-t-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                    <div className="text-center">
                      <Trophy className="w-7 h-7 text-amber-400 fill-amber-400 mx-auto mb-1" />
                      <span className="text-xs sm:text-sm font-black text-amber-300 uppercase">১ম স্থান (চ্যাম্পিয়ন)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3rd Place (Bronze) */}
              {top3 && (
                <div className="flex flex-col items-center text-center space-y-2 order-3 group">
                  <div className="relative">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-1 bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 shadow-lg">
                      <div className="w-full h-full rounded-full bg-slate-800 border-2 border-emerald-500 flex items-center justify-center text-white font-black text-base">
                        {top3.name.slice(0, 1)}
                      </div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-700 text-white w-6 h-6 rounded-full font-black text-xs flex items-center justify-center shadow-md border-2 border-slate-900">
                      ৩
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col items-center">
                    {/* Neumorphic Name Button */}
                    <div className="bg-slate-800/90 shadow-[3px_3px_6px_rgba(0,0,0,0.6),-2px_-2px_5px_rgba(255,255,255,0.1)] border border-slate-700/60 px-3 py-1 rounded-xl text-slate-100 font-extrabold text-xs sm:text-sm truncate max-w-[120px]">
                      {top3.name}
                    </div>
                    
                    {/* Score Tag */}
                    <div className="mt-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl px-2 py-1 text-[11px] font-bold text-slate-200">
                      <span className="text-amber-400 font-black">{top3.score}</span> / {top3.totalMarks}
                    </div>
                  </div>

                  {/* Podium Base */}
                  <div className="w-full h-16 sm:h-20 bg-gradient-to-t from-slate-800 to-slate-700/60 rounded-t-2xl flex items-center justify-center border-t-2 border-amber-700 shadow-inner">
                    <div className="text-center">
                      <Medal className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                      <span className="text-[10px] sm:text-xs font-black text-amber-500 uppercase">৩য় স্থান</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Full Leaderboard Table Matching User's Exact Screenshot */}
          <div className="space-y-3 pt-2">
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center gap-2 px-1">
              <Users className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>সকল অংশগ্রহণকারীদের মেধা তালিকা</span>
            </h4>

            {/* List of Neumorphic Green-Bordered Cards */}
            <div className="space-y-3">
              {leaderboardList.map((entry) => {
                const isUser = entry.isCurrentUser;
                const accuracy = Math.round((entry.correctAnswers / (entry.correctAnswers + entry.wrongAnswers || 1)) * 100);

                return (
                  <div
                    key={entry.id}
                    className="flex items-center gap-2.5 sm:gap-3.5"
                  >
                    {/* Serial Number on the far left (e.g. ১. , ২. ) */}
                    <div className="w-6 sm:w-8 text-center shrink-0 font-black text-base sm:text-xl text-slate-800 dark:text-slate-200 font-sans">
                      {entry.rank.toLocaleString('bn-BD')}.
                    </div>

                    {/* Neumorphic Green Bordered Card Frame (Exact Replica of User's Image) */}
                    <div
                      className={`flex-1 rounded-[24px] sm:rounded-[28px] border-2 border-emerald-500 dark:border-emerald-500/80 p-3 sm:p-4 bg-[#eef4f8] dark:bg-[#111c27] shadow-[5px_5px_12px_rgba(160,175,195,0.45),-5px_-5px_12px_rgba(255,255,255,0.9)] dark:shadow-[4px_4px_10px_rgba(0,0,0,0.5),-3px_-3px_8px_rgba(25,40,55,0.4)] flex items-center justify-between gap-3 sm:gap-4 transition-all hover:scale-[1.008] ${
                        isUser ? 'ring-2 ring-emerald-400/60 bg-[#e7f3ec] dark:bg-[#0e241b]' : ''
                      }`}
                    >
                      {/* Left: Avatar with green ring + Neumorphic Name Button + Subtitle */}
                      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                        {/* Avatar Image with Green Ring Border */}
                        {renderAvatar(entry, 'w-11 h-11 sm:w-13 sm:h-13')}

                        {/* Name & Meta */}
                        <div className="min-w-0 flex-1 space-y-1">
                          {/* Neumorphic Name Button + 'আপনি' Badge */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="bg-[#e4ebf3] dark:bg-[#1a2736] shadow-[2px_2px_5px_rgba(160,175,195,0.5),-2px_-2px_5px_rgba(255,255,255,0.9)] dark:shadow-[2px_2px_5px_rgba(0,0,0,0.5),-2px_-2px_4px_rgba(35,50,70,0.4)] border border-slate-200/80 dark:border-slate-700/60 px-3 py-1 rounded-xl text-slate-900 dark:text-slate-100 font-black text-xs sm:text-sm tracking-wide inline-flex items-center">
                              {entry.name}
                            </div>
                            {isUser && (
                              <span className="bg-[#004d2e] text-white text-[11px] font-black px-3 py-0.5 rounded-full shadow-xs">
                                আপনি
                              </span>
                            )}
                          </div>

                          {/* Subtitle: Subject • Question count • Accuracy (No Madrasa) */}
                          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium truncate">
                            {exam.subject} • প্রশ্ন: {exam.questions.length}টি • একুরেসি: {accuracy}%
                          </p>
                        </div>
                      </div>

                      {/* Right Columns: সঠিক (Green) | ভুল (Red) | নাম্বার (Amber) */}
                      <div className="flex items-center gap-3 sm:gap-5 shrink-0 text-center">
                        {/* সঠিক (Correct) */}
                        <div className="min-w-[34px] sm:min-w-[42px]">
                          <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold block">
                            সঠিক
                          </span>
                          <span className="text-xs sm:text-base font-black text-[#009b5a] dark:text-emerald-400 block mt-0.5">
                            {entry.correctAnswers}টি
                          </span>
                        </div>

                        {/* ভুল (Wrong) */}
                        <div className="min-w-[34px] sm:min-w-[42px]">
                          <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold block">
                            ভুল
                          </span>
                          <span className="text-xs sm:text-base font-black text-[#e11d48] dark:text-rose-400 block mt-0.5">
                            {entry.wrongAnswers}টি
                          </span>
                        </div>

                        {/* নাম্বার (Score) */}
                        <div className="min-w-[48px] sm:min-w-[60px] text-right sm:text-center">
                          <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold block">
                            নাম্বার
                          </span>
                          <span className="text-xs sm:text-base font-black text-[#d97706] dark:text-amber-400 block mt-0.5">
                            {entry.score.toFixed(0)} / {entry.totalMarks}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. Tab Content: SUB-TAB B - DETAILED EXPLANATION (ব্যাখ্যা সহ উত্তর) */}
      {resultSubTab === 'explanation' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Header Card for Question Solutions */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#004d2e] dark:text-emerald-400" />
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                সকল প্রশ্নের সঠিক উত্তর ও ব্যাখ্যা বিশ্লেষণ
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              মোট প্রশ্ন: {exam.questions.length}টি
            </span>
          </div>

          {/* Question Cards List */}
          {exam.questions.map((q, idx) => {
            const userChoice = viewingResult.userAnswers[q.id];
            const isCorrect = userChoice === q.correctIndex;
            const isSkipped = userChoice === undefined;
            const aiData = aiExplanations[q.id];
            const isBookmarked = bookmarks.includes(q.id);

            const defaultBnLabels = ['ক', 'খ', 'গ', 'ঘ'];
            const defaultArLabels = ['أ', 'ب', 'ج', 'দ'];
            const labels = q.optionLabels || (q.language === 'ar' ? defaultArLabels : defaultBnLabels);

            return (
              <div
                key={q.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border space-y-3.5 transition-all ${
                  isCorrect
                    ? 'border-emerald-300 dark:border-emerald-800/80 shadow-[0_4px_16px_rgba(5,150,105,0.06)]'
                    : isSkipped
                    ? 'border-slate-200 dark:border-slate-800'
                    : 'border-rose-300 dark:border-rose-800/80 shadow-[0_4px_16px_rgba(225,29,72,0.06)]'
                }`}
              >
                {/* Question Top Header Bar */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center justify-center">
                      {(idx + 1).toLocaleString('bn-BD')}
                    </span>
                    <span className="text-[11px] font-extrabold text-[#004d2e] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                      {q.subject}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-black flex items-center gap-1 border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> সঠিক (+১.০)
                      </span>
                    ) : isSkipped ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1">
                        <MinusCircle className="w-3.5 h-3.5 text-slate-400" /> উত্তর দেননি
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-xs font-black flex items-center gap-1 border border-rose-300 dark:border-rose-800">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" /> ভুল (-{(exam.negativeMarking || 0.25).toFixed(2)})
                      </span>
                    )}

                    <button
                      onClick={() => toggleBookmark(q.id)}
                      className="p-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-amber-50 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                      title="বুকমার্ক"
                    >
                      <Award className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Question Arabic / Bengali text */}
                {q.arabicQuestion && (
                  <p 
                    className="font-arabic text-lg sm:text-xl text-[#004d2e] dark:text-emerald-300 font-black text-right leading-relaxed"
                    dir="rtl"
                  >
                    {formatArabicText(q.arabicQuestion)}
                  </p>
                )}
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-relaxed">
                  {formatArabicText(q.question)}
                </h4>

                {/* 4 Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {q.options.map((opt: string, optIdx: number) => {
                    const isUserPick = userChoice === optIdx;
                    const isRightAnswer = q.correctIndex === optIdx;
                    const formattedOpt = formatArabicText(opt);

                    let badgeStyle = 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
                    if (isRightAnswer) {
                      badgeStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-[#004d2e] dark:border-emerald-500 text-[#004d2e] dark:text-emerald-200 font-black shadow-xs';
                    } else if (isUserPick && !isRightAnswer) {
                      badgeStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300 line-through';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-2xl border text-xs sm:text-sm flex items-center justify-between gap-2 transition-all ${badgeStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-700 shadow-xs">
                            {labels[optIdx] || defaultBnLabels[optIdx]}
                          </span>
                          <span className="font-medium">{formattedOpt}</span>
                        </div>
                        {isRightAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                        {isUserPick && !isRightAnswer && <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Inset Box */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-1">
                  <span className="font-extrabold text-[#004d2e] dark:text-emerald-400 block">ব্যাখ্যা ও নিয়ম:</span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-normal">{q.explanation}</p>
                </div>

                {/* AI Explanation Accordion / Card */}
                {aiData?.loading ? (
                  <div className="p-3 bg-[#004d2e] text-emerald-100 rounded-2xl text-xs flex items-center gap-2 animate-pulse">
                    <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                    <span>তামরীন এআই বিস্তারিত বিশ্লেষণ প্রস্তুত করছে...</span>
                  </div>
                ) : aiData?.text ? (
                  <div className="p-4 bg-gradient-to-br from-[#023b24] to-slate-950 text-emerald-100 rounded-2xl border border-emerald-500/40 shadow-md space-y-2">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300 border-b border-emerald-700/60 pb-1.5">
                      <Bot className="w-4 h-4 text-amber-300" />
                      <span>তামরীন এআই স্পেশাল বিশ্লেষণ ও নিয়ম কানুন</span>
                    </div>
                    <div className="text-xs sm:text-sm space-y-1 text-emerald-50 leading-relaxed font-sans">
                      <Markdown>{aiData.text}</Markdown>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAskAIExplanation(q)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 text-[#004d2e] dark:text-emerald-300 text-xs font-black transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>তামরীন AI দিয়ে বিস্তারিত ব্যাখ্যা দেখুন</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

