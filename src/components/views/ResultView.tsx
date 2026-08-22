import React, { useState, useEffect, useMemo } from 'react';
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
import { mockExams } from '../../data/mockData';
import { LeaderboardEntry, Question } from '../../types';
import { generateExamLeaderboard } from '../../utils/leaderboardUtils';
import { 
  getUnifiedQuestionText, 
  getTextDirection, 
  getOptionsConfig,
  parseQuestionData 
} from '../../utils/questionUtils';
import { supabaseService } from '../../services/supabaseService';

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
  const [dynamicQuestions, setDynamicQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (viewingResult?.examId) {
      supabaseService.getExamQuestions(viewingResult.examId).then((qs) => {
        if (qs && qs.length > 0) {
          setDynamicQuestions(qs);
        }
      }).catch(() => {});
    }
  }, [viewingResult?.examId]);

  if (!viewingResult) return null;

  // Find or reconstruct the exact target exam matching viewingResult.examId and totalMarks
  const exam = useMemo(() => {
    const found = mockExams.find((e) => e.id === viewingResult.examId);
    if (found) {
      return {
        ...found,
        questions: dynamicQuestions.length > 0 ? dynamicQuestions : found.questions
      };
    }

    const totalQ = (viewingResult.correctAnswers + viewingResult.wrongAnswers + (viewingResult.skippedAnswers || 0)) || viewingResult.totalMarks || 20;
    const totalM = viewingResult.totalMarks || totalQ;

    return {
      id: viewingResult.examId,
      title: viewingResult.examTitle,
      category: 'subject' as const,
      subject: 'পরীক্ষা',
      totalMarks: totalM,
      durationMinutes: Math.ceil(totalQ * 0.75),
      negativeMarking: 0.25,
      totalQuestions: totalQ,
      status: 'running' as const,
      participantsCount: 1250,
      questions: dynamicQuestions
    };
  }, [viewingResult, dynamicQuestions]);

  const percentage = Math.round((viewingResult.score / (viewingResult.totalMarks || 1)) * 100);
  const isPassed = percentage >= 40;

  // Build Isolated Exam-specific Leaderboard List strictly based on this exam's total questions & total marks
  const leaderboardList: LeaderboardEntry[] = useMemo(() => {
    return generateExamLeaderboard(exam, viewingResult, userProfile);
  }, [exam, viewingResult, userProfile]);

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

  const formatDuration = (seconds: number) => {
    const s = Math.max(0, Math.floor(seconds || 0));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 text-sky-700 dark:text-sky-300 text-xs font-bold border border-sky-200 dark:border-sky-800/60 transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-sky-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'কপি হয়েছে' : 'ফলাফল শেয়ার করুন'}</span>
          </button>
        </div>
      </div>

      {/* 2. Top Profile Header Banner Card (Vibrant Cyan / Sky Blue Premium Layout) */}
      <div className="bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#0ea5e9] dark:from-[#0369a1] dark:via-[#075985] dark:to-[#0c4a6e] text-white rounded-3xl p-4 sm:p-5 shadow-lg border border-sky-400/30 flex items-center justify-between gap-3 sm:gap-4 relative overflow-hidden">
        {/* Subtle Ambient Lighting */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-sky-300/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-cyan-300/15 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center gap-3.5 sm:gap-4 z-10 min-w-0">
          {/* Avatar Container in Clean White Box */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white dark:bg-slate-900 p-1 flex items-center justify-center shadow-md shrink-0 border border-white/60">
            {userProfile.avatar && userProfile.avatar.trim() !== '' && !userProfile.avatar.includes('unsplash') ? (
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-full h-full rounded-xl object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center shadow-inner">
                <UserIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
            )}
          </div>

          {/* User Name & Exam Information */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-sky-200 shrink-0" />
              <h2 className="text-base sm:text-xl font-black text-white truncate leading-tight">
                {viewingResult.participantName || userProfile.name || 'মুহাম্মদ শিক্ষার্থী'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-sky-100/90 font-medium truncate mt-1">
              পরীক্ষা: {viewingResult.examTitle}
            </p>
          </div>
        </div>

        {/* Evaluation Pill Badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black text-white border border-white/30 shrink-0 shadow-xs">
          <Award className="w-4 h-4 text-amber-300" />
          <span>মূল্যায়নপত্র</span>
        </div>
      </div>

      {/* 3. Structured 2-Column Statistics Table Card (Exact format as provided image) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-2.5 sm:p-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-200/90 dark:border-slate-800 space-y-1.5">
        {/* Row 1: মোট প্রশ্ন */}
        <div className="bg-[#f1f5f9] dark:bg-slate-800/70 hover:bg-[#e8eef5] dark:hover:bg-slate-800 transition-colors rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between text-sm sm:text-base font-bold">
          <span className="text-slate-800 dark:text-slate-200">মোট প্রশ্ন</span>
          <span className="text-slate-800 dark:text-slate-200 font-black">
            {exam.questions.length || viewingResult.totalMarks}
          </span>
        </div>

        {/* Row 2: অংশ গ্রহণকারী */}
        <div className="bg-[#f8fafc] dark:bg-slate-800/40 hover:bg-[#e8eef5] dark:hover:bg-slate-800 transition-colors rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between text-sm sm:text-base font-bold">
          <span className="text-slate-800 dark:text-slate-200">অংশ গ্রহণকারী</span>
          <span className="text-slate-800 dark:text-slate-200 font-black">
            {leaderboardList.length}
          </span>
        </div>

        {/* Row 3: সঠিক উত্তর */}
        <div className="bg-[#f1f5f9] dark:bg-slate-800/70 hover:bg-[#e8eef5] dark:hover:bg-slate-800 transition-colors rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between text-sm sm:text-base font-bold">
          <span className="text-emerald-600 dark:text-emerald-400 font-black">সঠিক উত্তর</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-black text-base sm:text-lg">
            {viewingResult.correctAnswers}
          </span>
        </div>

        {/* Row 4: ভুল উত্তর */}
        <div className="bg-[#f8fafc] dark:bg-slate-800/40 hover:bg-[#e8eef5] dark:hover:bg-slate-800 transition-colors rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between text-sm sm:text-base font-bold">
          <span className="text-rose-600 dark:text-rose-400 font-black">ভুল উত্তর</span>
          <span className="text-rose-600 dark:text-rose-400 font-black text-base sm:text-lg">
            {viewingResult.wrongAnswers}
          </span>
        </div>

        {/* Row 5: নেগেটিভ মার্ক */}
        <div className="bg-[#f1f5f9] dark:bg-slate-800/70 hover:bg-[#e8eef5] dark:hover:bg-slate-800 transition-colors rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between text-sm sm:text-base font-bold">
          <span className="text-rose-600 dark:text-rose-400 font-black">নেগেটিভ মার্ক</span>
          <span className="text-rose-600 dark:text-rose-400 font-black text-base sm:text-lg">
            {((viewingResult.wrongAnswers || 0) * (exam.negativeMarking || 0.25)).toFixed(2)}
          </span>
        </div>

        {/* Row 6: বর্তমান পজিশন */}
        <div className="bg-[#f8fafc] dark:bg-slate-800/40 hover:bg-[#e8eef5] dark:hover:bg-slate-800 transition-colors rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between text-sm sm:text-base font-bold">
          <span className="text-blue-600 dark:text-sky-400 font-black">বর্তমান পজিশন</span>
          <span className="text-blue-600 dark:text-sky-400 font-black">
            {userRankEntry.rank}th of {leaderboardList.length}
          </span>
        </div>

        {/* Row 7: প্রাপ্ত নম্বর */}
        <div className="bg-[#f1f5f9] dark:bg-slate-800/70 hover:bg-[#e8eef5] dark:hover:bg-slate-800 transition-colors rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between text-sm sm:text-base font-bold">
          <span className="text-cyan-600 dark:text-cyan-400 font-black">প্রাপ্ত নম্বর</span>
          <span className="text-cyan-600 dark:text-cyan-400 font-black text-base sm:text-lg">
            {viewingResult.score}
          </span>
        </div>

        {/* Row 8: রেজাল্ট */}
        <div className="bg-[#f8fafc] dark:bg-slate-800/40 hover:bg-[#e8eef5] dark:hover:bg-slate-800 transition-colors rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between text-sm sm:text-base font-bold">
          <span className="text-slate-900 dark:text-slate-100 font-black">রেজাল্ট</span>
          <span className={`font-black text-base sm:text-lg ${isPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {isPassed ? 'Passed' : 'Failed'}
          </span>
        </div>

        {/* Row 9: সময় গ্রহণ */}
        <div className="bg-[#f1f5f9] dark:bg-slate-800/70 hover:bg-[#e8eef5] dark:hover:bg-slate-800 transition-colors rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between text-sm sm:text-base font-bold">
          <span className="text-slate-800 dark:text-slate-200">সময় গ্রহণ</span>
          <span className="text-slate-800 dark:text-slate-200 font-mono font-black">
            {formatDuration(viewingResult.timeSpentSeconds || 76)}
          </span>
        </div>
      </div>

      {/* 4. Sub-Tab Switcher (Leaderboard vs Detailed Solutions) */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-200/70 dark:bg-slate-800/80 rounded-2xl max-w-md mx-auto shadow-inner">
        <button
          onClick={() => setResultSubTab('leaderboard')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
            resultSubTab === 'leaderboard'
              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md scale-102'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4 fill-current" />
          <span>মেধাতালিকা</span>
        </button>

        <button
          onClick={() => setResultSubTab('explanation')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
            resultSubTab === 'explanation'
              ? 'bg-white dark:bg-slate-900 text-[#004d2e] dark:text-emerald-400 shadow-md scale-102 border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>ব্যাখ্যা সহ উত্তর</span>
        </button>
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
                          {exam.subject} • প্রশ্ন: {(exam.totalQuestions || exam.questions.length)}টি • একুরেসি: {accuracy}%
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
                          {entry.score % 1 === 0 ? entry.score.toFixed(0) : entry.score.toFixed(2)} / {entry.totalMarks}
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

            // Question parsing & direction config
            const parsedQ = parseQuestionData(q);

            // Options majority configuration
            const optionsConfig = getOptionsConfig(q.options, q.optionLabels);

            // Explanation direction config
            const expUnified = formatArabicText(q.explanation);
            const expDirConfig = getTextDirection(q.explanation);

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
                {/* Question Top Header Bar (Subject & Status) */}
                <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-100 dark:border-slate-800/70">
                  <div className="flex items-center gap-2">
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

                {/* Top Question Row: Number Badge leading directly into Question Text */}
                <div 
                  className={`flex items-start gap-3 my-2 ${
                    parsedQ.isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'
                  }`}
                >
                  {/* Question Index Badge (Matching Exam Card!) */}
                  <div className="w-8 h-8 rounded-full bg-[#1e293b] dark:bg-slate-700 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs mt-0.5 select-none">
                    {parsedQ.isArabicNumbering ? (idx + 1).toLocaleString('ar-EG') : (idx + 1).toLocaleString('bn-BD')}
                  </div>

                  {/* Question Content */}
                  <div className={`flex-1 ${parsedQ.primaryTextAlign}`}>
                    {parsedQ.isArabicWithBengali ? (
                      <div className="space-y-1">
                        <h4 
                          className="font-arabic text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 leading-relaxed" 
                          dir="rtl"
                        >
                          {formatArabicText(parsedQ.arabicText)}
                        </h4>
                        <p 
                          className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 leading-relaxed text-right" 
                          dir="ltr"
                        >
                          {parsedQ.bengaliTranslation}
                        </p>
                      </div>
                    ) : (
                      <h4 
                        className={`leading-relaxed text-slate-900 dark:text-slate-100 ${parsedQ.primaryTextAlign} ${
                          parsedQ.isRTL 
                            ? 'font-arabic text-lg sm:text-xl font-black' 
                            : 'font-bold text-sm sm:text-base'
                        }`}
                        dir={parsedQ.primaryDir}
                      >
                        {formatArabicText(parsedQ.singleText)}
                      </h4>
                    )}
                  </div>
                </div>

                {/* 4 Options Grid with Majority Language Direction */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {q.options.map((opt: string, optIdx: number) => {
                    const isUserPick = userChoice === optIdx;
                    const isRightAnswer = q.correctIndex === optIdx;
                    const formattedOpt = formatArabicText(opt);
                    const label = optionsConfig.labels[optIdx] || (optionsConfig.isRTL ? ['أ', 'ب', 'ج', 'د'][optIdx] : ['ক', 'খ', 'গ', 'ঘ'][optIdx]);

                    let badgeStyle = 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
                    if (isRightAnswer) {
                      badgeStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-[#004d2e] dark:border-emerald-500 text-[#004d2e] dark:text-emerald-200 font-black shadow-xs';
                    } else if (isUserPick && !isRightAnswer) {
                      badgeStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300 line-through';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-2xl border text-xs sm:text-sm flex items-center justify-between gap-2 transition-all ${
                          optionsConfig.isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'
                        } ${badgeStyle}`}
                      >
                        <div className={`flex items-center gap-2 flex-1 min-w-0 ${optionsConfig.isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                          <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-700 shadow-xs">
                            {label}
                          </span>
                          <span 
                            className={`font-medium leading-snug flex-1 ${optionsConfig.textAlign} ${
                              optionsConfig.isRTL ? 'font-arabic text-sm sm:text-base font-bold' : ''
                            }`}
                            dir={optionsConfig.dir}
                          >
                            {formattedOpt}
                          </span>
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
                  <p 
                    className={`text-slate-600 dark:text-slate-400 leading-relaxed ${expDirConfig.textAlign} ${
                      expDirConfig.isPureArabic ? 'font-arabic text-sm sm:text-base font-medium' : 'font-normal'
                    }`}
                    dir={expDirConfig.dir}
                  >
                    {expUnified}
                  </p>
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

