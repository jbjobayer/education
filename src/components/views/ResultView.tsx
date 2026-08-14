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

  // Helper to render Avatar without default stock photos
  const renderAvatar = (entry: LeaderboardEntry, size = 'w-8 h-8 sm:w-11 sm:h-11', ringColor = 'border-emerald-500') => {
    const hasCustomPhoto = entry.avatar && entry.avatar.trim() !== '' && !entry.avatar.includes('unsplash');
    
    return (
      <div className={`${size} rounded-full border-2 ${ringColor} p-0.5 shrink-0 bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center`}>
        {hasCustomPhoto ? (
          <img
            src={entry.avatar}
            alt={entry.name}
            className="w-full h-full rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-600 to-[#004d2e] text-white flex items-center justify-center font-black text-xs sm:text-sm">
            {entry.name.slice(0, 1) || <UserIcon className="w-3.5 h-3.5" />}
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-[#004d2e] dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800/60 transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'কপি হয়েছে' : 'ফলাফল শেয়ার করুন'}</span>
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
        <div className="space-y-3 animate-fadeIn">
          {/* Top Info Bar */}
          <div className="flex items-center justify-between px-1.5 py-1">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
              <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                অংশগ্রহণকারীদের মেধা তালিকা
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                ({leaderboardList.length.toLocaleString('bn-BD')} জন)
              </span>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[#004d2e] dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-black">
              আপনার অবস্থান: {userRankEntry.rank}তম
            </div>
          </div>

          {/* List of Neumorphic Cards with Stylish Top 3 Styling */}
          <div className="space-y-2.5 sm:space-y-3">
            {leaderboardList.map((entry) => {
              const isUser = entry.isCurrentUser;
              const accuracy = Math.round((entry.correctAnswers / (entry.correctAnswers + entry.wrongAnswers || 1)) * 100);

              const isRank1 = entry.rank === 1;
              const isRank2 = entry.rank === 2;
              const isRank3 = entry.rank === 3;

              // Card Border & Background Theme
              let cardStyle = "border-2 border-emerald-500 dark:border-emerald-500/80 bg-[#eef4f8] dark:bg-[#111c27] shadow-[4px_4px_10px_rgba(160,175,195,0.45),-4px_-4px_10px_rgba(255,255,255,0.9)] dark:shadow-[4px_4px_10px_rgba(0,0,0,0.5),-3px_-3px_8px_rgba(25,40,55,0.4)]";
              let ringColor = "border-emerald-500";
              let serialCircleStyle = "bg-gradient-to-br from-[#005a36] via-[#006e42] to-[#004227] text-white border-2 border-emerald-400/80 shadow-[2px_2px_5px_rgba(0,70,35,0.35),-1px_-1px_3px_rgba(255,255,255,0.7)]";

              if (isRank1) {
                cardStyle = "border-2 border-amber-400 dark:border-amber-400/90 bg-gradient-to-r from-amber-500/10 via-[#eef4f8] to-amber-500/10 dark:from-amber-950/35 dark:via-[#111c27] dark:to-amber-950/25 shadow-[0_4px_16px_rgba(245,158,11,0.22)]";
                ringColor = "border-amber-400";
                serialCircleStyle = "bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 text-slate-950 border-2 border-yellow-200 shadow-[0_0_12px_rgba(245,158,11,0.6)]";
              } else if (isRank2) {
                cardStyle = "border-2 border-sky-400/90 dark:border-sky-400 bg-gradient-to-r from-sky-400/15 via-[#eef4f8] to-indigo-400/15 dark:from-sky-950/40 dark:via-[#111c27] dark:to-indigo-950/30 shadow-[0_4px_18px_rgba(56,189,248,0.25)]";
                ringColor = "border-sky-400";
                serialCircleStyle = "bg-gradient-to-br from-slate-100 via-sky-200 to-slate-400 text-slate-950 border-2 border-sky-300 shadow-[0_0_14px_rgba(56,189,248,0.6)]";
              } else if (isRank3) {
                cardStyle = "border-2 border-amber-700/80 dark:border-amber-600/70 bg-gradient-to-r from-amber-800/10 via-[#eef4f8] to-amber-800/10 dark:from-amber-950/25 dark:via-[#111c27] dark:to-amber-950/15 shadow-[0_4px_14px_rgba(180,83,9,0.18)]";
                ringColor = "border-amber-700";
                serialCircleStyle = "bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 text-amber-100 border-2 border-amber-500 shadow-[0_0_10px_rgba(180,83,9,0.4)]";
              }

              return (
                <div
                  key={entry.id}
                  className="w-full"
                >
                  {/* Neumorphic Bordered Card Frame */}
                  <div
                    className={`w-full rounded-[20px] sm:rounded-[28px] p-2.5 sm:p-4 flex items-center justify-between gap-2.5 sm:gap-4 transition-all hover:scale-[1.006] ${cardStyle} ${
                      isUser ? 'ring-2 ring-emerald-400/60' : ''
                    }`}
                  >
                    {/* Left: Serial Number Badge + Avatar + Full Name + Subtitle */}
                    <div className="flex items-center gap-2 sm:gap-3.5 min-w-0 flex-1">
                      {/* Serial Number inside Circular Badge */}
                      <div 
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center font-black text-xs sm:text-sm select-none ${serialCircleStyle}`}
                      >
                        <span className="font-sans font-bold drop-shadow-xs">
                          {entry.rank.toLocaleString('bn-BD')}
                        </span>
                      </div>

                      {/* Avatar Image with dynamic rank ring */}
                      {renderAvatar(entry, 'w-8 h-8 sm:w-11 sm:h-11', ringColor)}

                      {/* Name & Meta (Shows FULL name without truncation) */}
                      <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
                        {/* Neumorphic Name Button + Rank Badge + 'আপনি' Badge */}
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
                          <div 
                            className={`px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm tracking-wide inline-flex items-center shadow-[2px_2px_4px_rgba(160,175,195,0.5),-2px_-2px_4px_rgba(255,255,255,0.9)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.5),-2px_-2px_3px_rgba(35,50,70,0.4)] ${
                              isRank1
                                ? 'bg-[#fef9c3]/90 dark:bg-[#281b08] border border-amber-400/80 dark:border-amber-500/60 text-amber-950 dark:text-amber-200'
                                : isRank2
                                ? 'bg-gradient-to-r from-slate-100 to-sky-50 dark:from-slate-800 dark:to-sky-950/40 border border-sky-400/70 dark:border-sky-500/60 text-sky-950 dark:text-sky-200'
                                : isRank3
                                ? 'bg-amber-50/90 dark:bg-amber-950/40 border border-amber-600/50 dark:border-amber-700/50 text-amber-900 dark:text-amber-300'
                                : 'bg-[#e4ebf3] dark:bg-[#1a2736] border border-slate-200/80 dark:border-slate-700/60 text-slate-900 dark:text-slate-100'
                            }`}
                          >
                            <span className="break-words">{entry.name}</span>
                          </div>

                          {/* 1st, 2nd, 3rd Stylish Rank Pill */}
                          {isRank1 && (
                            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs shrink-0 whitespace-nowrap">
                              <Crown className="w-3 h-3 fill-slate-950" />
                              <span>১ম স্থান</span>
                            </span>
                          )}
                          {isRank2 && (
                            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm shrink-0 whitespace-nowrap">
                              <Medal className="w-3 h-3 text-white" />
                              <span>২য় স্থান</span>
                            </span>
                          )}
                          {isRank3 && (
                            <span className="inline-flex items-center gap-1 bg-amber-700 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs shrink-0 whitespace-nowrap">
                              <Medal className="w-3 h-3 text-amber-200" />
                              <span>৩য় স্থান</span>
                            </span>
                          )}

                          {isUser && (
                            <span className="bg-[#004d2e] text-white text-[9px] sm:text-[11px] font-black px-2 sm:px-2.5 py-0.5 rounded-full shadow-xs shrink-0 whitespace-nowrap">
                              আপনি
                            </span>
                          )}
                        </div>

                        {/* Subtitle: Subject • Question count • Accuracy */}
                        <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium">
                          {exam.subject} • প্রশ্ন: {exam.questions.length}টি • একুরেসি: {accuracy}%
                        </p>
                      </div>
                    </div>

                    {/* Right Columns: সঠিক (Green) | ভুল (Red) | নাম্বার (Amber) */}
                    <div className="flex items-center gap-1.5 xs:gap-2.5 sm:gap-5 shrink-0 text-center">
                      {/* সঠিক (Correct) */}
                      <div className="min-w-[28px] xs:min-w-[34px] sm:min-w-[42px]">
                        <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold block">
                          সঠিক
                        </span>
                        <span className="text-[11px] xs:text-xs sm:text-base font-black text-[#009b5a] dark:text-emerald-400 block mt-0.5 whitespace-nowrap">
                          {entry.correctAnswers}টি
                        </span>
                      </div>

                      {/* ভুল (Wrong) */}
                      <div className="min-w-[28px] xs:min-w-[34px] sm:min-w-[42px]">
                        <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold block">
                          ভুল
                        </span>
                        <span className="text-[11px] xs:text-xs sm:text-base font-black text-[#e11d48] dark:text-rose-400 block mt-0.5 whitespace-nowrap">
                          {entry.wrongAnswers}টি
                        </span>
                      </div>

                      {/* নাম্বার (Score) */}
                      <div className="min-w-[40px] xs:min-w-[48px] sm:min-w-[60px] text-right sm:text-center">
                        <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-semibold block">
                          নাম্বার
                        </span>
                        <span className="text-[11px] xs:text-xs sm:text-base font-black text-[#d97706] dark:text-amber-400 block mt-0.5 whitespace-nowrap">
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

