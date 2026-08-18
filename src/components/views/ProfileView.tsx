import React, { useState, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  BookOpen, 
  Award, 
  FileCheck2, 
  Bookmark, 
  Phone, 
  Mail, 
  Edit3, 
  CheckCircle2, 
  Headphones, 
  Share2, 
  Calendar,
  ExternalLink,
  ShieldCheck,
  Video,
  Camera,
  Sparkles,
  TrendingUp,
  Flame,
  Target,
  Clock,
  ChevronRight,
  Settings,
  Bell,
  Volume2,
  VolumeX,
  Smartphone,
  Download,
  Trash2,
  BarChart3,
  CheckSquare,
  Square,
  Layers,
  HelpCircle,
  Zap,
  Globe,
  Star,
  RefreshCw,
  Eye,
  AlertTriangle,
  Trophy,
  Crown,
  LayoutGrid,
  History,
  ArrowLeft,
  GraduationCap,
  Sliders,
  Check,
  Database,
  Server,
  Radio,
  Lock
} from 'lucide-react';
import { mockQuestions } from '../../data/mockData';
import { useFont, BanglaFont, ArabicFont } from '../../context/FontContext';
import { getUnifiedQuestionText, getTextDirection, parseQuestionData, getOptionsConfig } from '../../utils/questionUtils';
import { Exam, ExamResult, LeaderboardEntry } from '../../types';
import { generateExamLeaderboard } from '../../utils/leaderboardUtils';
import { 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  testSupabaseConnection, 
  isSupabaseConfigured,
  cleanSupabaseUrl,
  cleanSupabaseKey
} from '../../lib/supabase';

type ProfileSection = 
  | 'menu' 
  | 'profile_info' 
  | 'dashboard' 
  | 'courses' 
  | 'bookmarks' 
  | 'wrong_bank' 
  | 'history' 
  | 'leaderboard' 
  | 'premium' 
  | 'settings';

export const ProfileView: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    enrolledCourseIds, 
    courses, 
    exams,
    examResults, 
    bookmarks, 
    toggleBookmark,
    setSelectedCourseDetails,
    setIsRoutineOpen,
    setViewingResult,
    setResultSubTab,
    startExam,
    showToast,
    isSupabaseConnected,
    refreshFromDatabase,
    isLoadingData
  } = useApp();

  const { 
    settings, 
    setBanglaFont, 
    setArabicFont, 
    setFontSize, 
    formatArabicText 
  } = useFont();

  const [activeSection, setActiveSection] = useState<ProfileSection>('menu');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [selectedLeaderboardExamId, setSelectedLeaderboardExamId] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Supabase Database Connection Configuration State
  const initialDbConfig = useMemo(() => getSupabaseConfig(), []);
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(initialDbConfig.supabaseUrl);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(initialDbConfig.supabaseAnonKey);
  const [isTestingDb, setIsTestingDb] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Profile Edit Form State
  const [editName, setEditName] = useState(userProfile.name || 'মুহাম্মদ জোবায়ের হোসাইন');
  const [editPhone, setEditPhone] = useState(userProfile.phone || '০১৭৭২-৮৯৫৪০১');
  const [editEmail, setEditEmail] = useState(userProfile.email || 'jobayer.tamreen@gmail.com');
  const [editRollNo, setEditRollNo] = useState(userProfile.rollNo || 'NTRCA-2026-9814');
  const [editInstitution, setEditInstitution] = useState(userProfile.institution || 'সরকারি মাদ্রাসা-ই-আলিয়া, ঢাকা');
  const [editTargetExam, setEditTargetExam] = useState(userProfile.targetExam || '১৯তম শিক্ষক নিবন্ধন প্রস্তুতি');
  const [editDistrict, setEditDistrict] = useState(userProfile.district || 'ঢাকা');
  const [editBio, setEditBio] = useState(userProfile.bio || 'পরিশ্রম ও নিয়মানুবর্তিতার মাধ্যমে ১৯তম শিক্ষক নিবন্ধনে প্রথম সারিতে উত্তীর্ণ হওয়াই মূল লক্ষ্য। ইনশাআল্লাহ!');
  const [editBatchTag, setEditBatchTag] = useState(userProfile.batchTag || 'সহকারী শিক্ষক (আরবি)');

  // Preset Avatars for quick selection
  const presetAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  ];

  const enrolledCourses = courses.filter((c) => enrolledCourseIds.includes(c.id));
  
  // Collect all all questions across exams for bookmarks & wrong answer lookup
  const allAvailableQuestions = useMemo(() => {
    const list: any[] = [];
    Object.values(mockQuestions).forEach(arr => {
      arr.forEach(q => {
        if (!list.some(existing => existing.id === q.id)) {
          list.push(q);
        }
      });
    });
    return list;
  }, []);

  const bookmarkedQuestions = useMemo(() => {
    return allAvailableQuestions.filter(q => bookmarks.includes(q.id));
  }, [allAvailableQuestions, bookmarks]);

  // Aggregate questions that user got wrong in taken exams
  const wrongAnswerQuestions = useMemo(() => {
    const wrongList: { question: any; examTitle: string; selectedAnswerText: string; correctAnswerText: string }[] = [];
    
    examResults.forEach(res => {
      const exam = exams.find(e => e.id === res.examId);
      if (exam && res.userAnswers) {
        exam.questions.forEach((q, idx) => {
          const userSelectedIdx = res.userAnswers[q.id];
          if (userSelectedIdx !== undefined && userSelectedIdx !== q.correctIndex) {
            wrongList.push({
              question: q,
              examTitle: exam.title,
              selectedAnswerText: q.options[userSelectedIdx] || 'ভুল উত্তর',
              correctAnswerText: q.options[q.correctIndex] || '',
            });
          }
        });
      }
    });

    // If no real mistakes made yet, supply default sample mistakes for revision practice
    if (wrongList.length === 0) {
      const sampleQ1 = mockQuestions.examArabicLecturer[1];
      const sampleQ2 = mockQuestions.examHadith[2];
      if (sampleQ1) {
        wrongList.push({
          question: sampleQ1,
          examTitle: 'আরবি প্রভাষক নিবন্ধন প্রস্তুতি',
          selectedAnswerText: sampleQ1.options[0],
          correctAnswerText: sampleQ1.options[sampleQ1.correctIndex],
        });
      }
      if (sampleQ2) {
        wrongList.push({
          question: sampleQ2,
          examTitle: 'নিবন্ধন (হাদিস)',
          selectedAnswerText: sampleQ2.options[0],
          correctAnswerText: sampleQ2.options[sampleQ2.correctIndex],
        });
      }
    }

    return wrongList;
  }, [examResults]);

  // Analytics Metrics
  const totalExamsTaken = examResults.length;
  const avgScore = totalExamsTaken > 0 
    ? Math.round(examResults.reduce((acc, r) => acc + (r.score / (r.totalMarks || 100)) * 100, 0) / totalExamsTaken)
    : 92;
  const totalQuestionsAnswered = totalExamsTaken > 0
    ? examResults.reduce((acc, r) => acc + r.correctAnswers + r.wrongAnswers, 0)
    : 1420;
  const totalCorrect = totalExamsTaken > 0
    ? examResults.reduce((acc, r) => acc + r.correctAnswers, 0)
    : 1306;
  const accuracyRate = totalQuestionsAnswered > 0 ? Math.round((totalCorrect / totalQuestionsAnswered) * 100) : 92;

  // Selected Exam for Leaderboard Tab
  const selectedLeaderboardExam = useMemo(() => {
    return exams.find(e => e.id === selectedLeaderboardExamId) || exams[0] || null;
  }, [exams, selectedLeaderboardExamId]);

  const userExamResultForSelected = useMemo(() => {
    if (!selectedLeaderboardExam) return undefined;
    return examResults.find(r => r.examId === selectedLeaderboardExam.id);
  }, [examResults, selectedLeaderboardExam]);

  const examLeaderboardEntries = useMemo(() => {
    if (!selectedLeaderboardExam) return [];
    return generateExamLeaderboard(selectedLeaderboardExam, userExamResultForSelected, userProfile);
  }, [selectedLeaderboardExam, userExamResultForSelected, userProfile]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        showToast('ছবি ৩ মেগাবাইটের চেয়ে ছোট হতে হবে', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target?.result as string;
        if (dataUrl) {
          updateUserProfile({ avatar: dataUrl });
          showToast('প্রোফাইল ছবি সফলভাবে পরিবর্তিত হয়েছে', 'success');
          setIsAvatarPickerOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName.trim() || userProfile.name,
      phone: editPhone.trim() || userProfile.phone,
      email: editEmail.trim() || userProfile.email,
      rollNo: editRollNo.trim() || userProfile.rollNo,
      institution: editInstitution.trim() || userProfile.institution,
      targetExam: editTargetExam.trim() || userProfile.targetExam,
      district: editDistrict.trim() || userProfile.district,
      bio: editBio.trim() || userProfile.bio,
      batchTag: editBatchTag.trim() || userProfile.batchTag,
    });
    setIsEditModalOpen(false);
  };

  // Helper to render Avatar without stock photo fallback
  const renderAvatar = (entry: LeaderboardEntry, size = 'w-9 h-9 sm:w-11 sm:h-11', ringColor = 'border-emerald-500') => {
    const hasCustomPhoto = entry.avatar && entry.avatar.trim() !== '' && !entry.avatar.includes('placeholder');
    return (
      <div className={`${size} rounded-full border-2 ${ringColor} p-0.5 shrink-0 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-center`}>
        {hasCustomPhoto ? (
          <img
            src={entry.avatar}
            alt={entry.name}
            className="w-full h-full rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-600 to-[#004d2e] text-white flex items-center justify-center font-black text-xs sm:text-sm">
            {entry.name.slice(0, 1) || <User className="w-3.5 h-3.5" />}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-28 animate-fadeIn max-w-4xl mx-auto">
      {/* 🌟 1. Top Dark Emerald Hero Card (Matching Screenshot 1) */}
      <div className="bg-gradient-to-br from-[#064e3b] via-[#043d2e] to-[#02281d] text-white rounded-[26px] sm:rounded-3xl p-5 sm:p-6 shadow-[0_10px_28px_rgba(2,40,29,0.35)] border border-emerald-500/25 relative overflow-hidden">
        {/* Subtle Decorative Ambient Shapes */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-40 h-40 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Top Row: Avatar + Email + Tag Badge + Edit */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              {/* User Avatar with Gold Crown Badge on bottom-right */}
              <div className="relative shrink-0">
                <div 
                  onClick={() => setIsAvatarPickerOpen(true)}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-emerald-400/80 p-0.5 bg-slate-900/60 shadow-md cursor-pointer hover:opacity-90 transition-all overflow-hidden"
                  title="ছবি পরিবর্তন করুন"
                >
                  <img
                    src={userProfile.avatar || presetAvatars[0]}
                    alt={userProfile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>

                {/* Gold Crown Badge Overlaid at Bottom-Right */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center shadow-md border border-amber-100">
                  <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-slate-950 text-slate-950" />
                </div>
              </div>

              {/* User Email & Verified Role Pill */}
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="text-sm sm:text-base font-extrabold text-white truncate tracking-wide">
                    {userProfile.email || 'jobayer.tamreen@gmail.com'}
                  </h2>
                </div>

                {/* Green Pill: ✓ সহকারী শিক্ষক (আরবি) */}
                <div className="inline-flex items-center gap-1 bg-[#059669] hover:bg-[#047857] text-white px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold shadow-xs transition-colors">
                  <Check className="w-3 h-3 text-emerald-200 stroke-[3]" />
                  <span>{userProfile.batchTag || 'সহকারী শিক্ষক (আরবি)'}</span>
                </div>
              </div>
            </div>

            {/* Quick Profile Edit Action Button */}
            <button
              onClick={() => {
                setEditName(userProfile.name || 'মুহাম্মদ জোবায়ের হোসাইন');
                setEditPhone(userProfile.phone || '০১৭৭২-৮৯৫৪০১');
                setEditEmail(userProfile.email || 'jobayer.tamreen@gmail.com');
                setEditRollNo(userProfile.rollNo || 'NTRCA-2026-9814');
                setEditInstitution(userProfile.institution || 'সরকারি মাদ্রাসা-ই-আলিয়া, ঢাকা');
                setEditTargetExam(userProfile.targetExam || '১৯তম শিক্ষক নিবন্ধন প্রস্তুতি');
                setEditDistrict(userProfile.district || 'ঢাকা');
                setEditBio(userProfile.bio || '');
                setEditBatchTag(userProfile.batchTag || 'সহকারী শিক্ষক (আরবি)');
                setIsEditModalOpen(true);
              }}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center gap-1.5 text-xs font-bold border border-white/10 transition-all shrink-0 cursor-pointer"
              title="প্রোফাইল এডিট"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">এডিট</span>
            </button>
          </div>

          {/* Bottom Row: 3 Dark Green Metric Boxes (স্ট্রিক | সমাধান | লক্ষ্য) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
            {/* 1. স্ট্রিক */}
            <div 
              onClick={() => {
                const newStreak = (userProfile.studyStreakDays || 14) + 1;
                updateUserProfile({ studyStreakDays: newStreak });
                showToast(`🔥 অভিনন্দন! আপনার স্ট্রিক ${newStreak} দিনে উন্নীত হয়েছে!`);
              }}
              className="bg-[#023324]/90 hover:bg-[#023d2b] border border-emerald-600/30 rounded-2xl p-2.5 sm:p-3 text-center transition-all cursor-pointer shadow-inner active:scale-98"
            >
              <span className="text-[10px] sm:text-xs text-emerald-300/80 font-medium block">
                স্ট্রিক
              </span>
              <span className="text-xs sm:text-sm font-black text-amber-300 flex items-center justify-center gap-1 mt-0.5">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-500 animate-pulse" />
                <span>{userProfile.studyStreakDays || 14} দিন</span>
              </span>
            </div>

            {/* 2. সমাধান */}
            <div className="bg-[#023324]/90 border border-emerald-600/30 rounded-2xl p-2.5 sm:p-3 text-center shadow-inner">
              <span className="text-[10px] sm:text-xs text-emerald-300/80 font-medium block">
                সমাধান
              </span>
              <span className="text-xs sm:text-sm font-black text-emerald-100 block mt-0.5">
                {(totalQuestionsAnswered || 1420).toLocaleString('bn-BD')}টি
              </span>
            </div>

            {/* 3. লক্ষ্য */}
            <div className="bg-[#023324]/90 border border-emerald-600/30 rounded-2xl p-2.5 sm:p-3 text-center shadow-inner truncate">
              <span className="text-[10px] sm:text-xs text-emerald-300/80 font-medium block">
                লক্ষ্য
              </span>
              <span className="text-[11px] sm:text-xs font-black text-amber-200 block mt-0.5 truncate px-1">
                {userProfile.targetExam || '১৯তম শিক্ষক নিবন্ধন প্রস্তুতি'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 2. SECTION CONTENT ROUTING */}

      {/* A. MAIN MENU LIST (Matching Screenshot 1) */}
      {activeSection === 'menu' && (
        <div className="space-y-2 sm:space-y-2.5 animate-fadeIn">
          {/* 1. আমার প্রোফাইল */}
          <div 
            onClick={() => setActiveSection('profile_info')}
            className="w-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center justify-between gap-3 transition-all cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-[#004d2e] dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  আমার প্রোফাইল
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  ব্যক্তিগত তথ্য, শিক্ষাপ্রতিষ্ঠান, জেলা ও ছবি পরিবর্তন
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>

          {/* 2. পারফরম্যান্স ড্যাশবোর্ড */}
          <div 
            onClick={() => setActiveSection('dashboard')}
            className="w-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center justify-between gap-3 transition-all cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0 shadow-xs">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  পারফরম্যান্স ড্যাশবোর্ড
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  বিষয়ভিত্তিক দক্ষতা, নির্ভুলতা ও গ্রাফ অ্যানালিটিক্স
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 text-[10px] font-black">
                {accuracyRate}% একুরেসি
              </span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </div>

          {/* 3. আমার কোর্সসমূহ */}
          <div 
            onClick={() => setActiveSection('courses')}
            className="w-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center justify-between gap-3 transition-all cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  আমার কোর্সসমূহ
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  ভর্তিকৃত কোর্স তালিকা, লাইভ ক্লাস শিডিউল ও রুটিন
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-black">
                {enrolledCourses.length}টি কোর্স
              </span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </div>

          {/* 4. বুকমার্ককৃত প্রশ্ন */}
          <div 
            onClick={() => setActiveSection('bookmarks')}
            className="w-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center justify-between gap-3 transition-all cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                <Bookmark className="w-5 h-5 fill-amber-500/30 text-amber-600" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  বুকমার্ককৃত প্রশ্ন
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  সংরক্ষিত গুরুত্বপূর্ণ প্রশ্নসমূহ ও আরবি ব্যাখ্যা
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-black">
                {bookmarkedQuestions.length}টি প্রশ্ন
              </span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </div>

          {/* 5. ভুল উত্তরের ব্যাংক */}
          <div 
            onClick={() => setActiveSection('wrong_bank')}
            className="w-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center justify-between gap-3 transition-all cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  ভুল উত্তরের ব্যাংক
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  মডেল টেস্টে ভুল হওয়া প্রশ্নগুলোর রিভিশন ব্যাংক ও সমাধান
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-black">
                {wrongAnswerQuestions.length}টি ভুল
              </span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </div>

          {/* 6. পরীক্ষার আর্কাইভ */}
          <div 
            onClick={() => setActiveSection('history')}
            className="w-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center justify-between gap-3 transition-all cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-xs">
                <History className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  পরীক্ষার আর্কাইভ
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  পূর্বের সকল পরীক্ষার ফলাফল, ওএমআর শিট ও বিস্তারিত উত্তর
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-black">
                {totalExamsTaken}টি পরীক্ষা
              </span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </div>

          {/* 7. মেধা তালিকা */}
          <div 
            onClick={() => setActiveSection('leaderboard')}
            className="w-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center justify-between gap-3 transition-all cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                <Trophy className="w-5 h-5 fill-amber-400 text-amber-600" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  মেধা তালিকা
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  বিষয়ভিত্তিক ও লাইভ পরীক্ষার স্বতন্ত্র সঠিক মেধা তালিকা
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-black">
                লাইভ র‍্যাঙ্কিং
              </span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </div>

          {/* 8. প্রিমিয়াম মেম্বারশিপ */}
          <div 
            onClick={() => setActiveSection('premium')}
            className="w-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center justify-between gap-3 transition-all cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-lime-50 dark:bg-lime-950/50 text-lime-700 dark:text-lime-400 flex items-center justify-center shrink-0 shadow-xs">
                <Crown className="w-5 h-5 text-amber-500 fill-amber-400" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  প্রিমিয়াম মেম্বারশিপ
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  ভিআইপি ব্যাচ স্ট্যাটাস, আনলিমিটেড এআই ডাউট সলভ ও অফার
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black shadow-xs">
                সক্রিয় ভিআইপি
              </span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </div>

          {/* 9. সেটিংস ও পছন্দ */}
          <div 
            onClick={() => setActiveSection('settings')}
            className="w-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-100 dark:border-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center justify-between gap-3 transition-all cursor-pointer active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 shadow-xs">
                <Settings className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  সেটিংস ও পছন্দ
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  আরবি ও বাংলা ফন্ট স্টাইল, সাউন্ড ও অ্যালার্ট নিয়ন্ত্রণ
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* B. SUB-VIEW: আমার প্রোফাইল (PROFILE INFO) */}
      {activeSection === 'profile_info' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveSection('menu')}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>মেনুতে ফিরে যান</span>
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#004d2e] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-300" />
              <span>তথ্য সংশোধন</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-[#004d2e]" />
              <span>ব্যক্তিগত ও অ্যাকাডেমিক তথ্য</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl space-y-1">
                <span className="text-slate-400 font-medium block text-xs">পূর্ণ নাম</span>
                <strong className="text-slate-800 dark:text-slate-100 text-sm font-bold block">{userProfile.name}</strong>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl space-y-1">
                <span className="text-slate-400 font-medium block text-xs">ইমেইল ঠিকানা</span>
                <strong className="text-slate-800 dark:text-slate-100 text-sm font-bold block">{userProfile.email}</strong>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl space-y-1">
                <span className="text-slate-400 font-medium block text-xs">মোবাইল নম্বর</span>
                <strong className="text-slate-800 dark:text-slate-100 text-sm font-bold block">{userProfile.phone}</strong>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl space-y-1">
                <span className="text-slate-400 font-medium block text-xs">রোল / রেজিস্ট্রেশন নম্বর</span>
                <strong className="text-slate-800 dark:text-slate-100 text-sm font-bold block">{userProfile.rollNo}</strong>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl space-y-1">
                <span className="text-slate-400 font-medium block text-xs">শিক্ষাপ্রতিষ্ঠান</span>
                <strong className="text-slate-800 dark:text-slate-100 text-sm font-bold block">{userProfile.institution}</strong>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl space-y-1">
                <span className="text-slate-400 font-medium block text-xs">নিজ জেলা</span>
                <strong className="text-slate-800 dark:text-slate-100 text-sm font-bold block">{userProfile.district || 'ঢাকা'}</strong>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl space-y-1 sm:col-span-2">
                <span className="text-slate-400 font-medium block text-xs">টার্গেট পদ ও ব্যাচ</span>
                <strong className="text-slate-800 dark:text-slate-100 text-sm font-bold block">{userProfile.targetExam} • {userProfile.batchTag}</strong>
              </div>

              {userProfile.bio && (
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl space-y-1 sm:col-span-2">
                  <span className="text-slate-400 font-medium block text-xs">ব্যক্তিগত লক্ষ্য ও উক্তি</span>
                  <p className="text-slate-700 dark:text-slate-300 italic text-xs leading-relaxed">"{userProfile.bio}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* C. SUB-VIEW: পারফরম্যান্স ড্যাশবোর্ড (DASHBOARD) */}
      {activeSection === 'dashboard' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveSection('menu')}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>মেনুতে ফিরে যান</span>
            </button>
            <span className="text-xs font-bold text-slate-500">পারফরম্যান্স রিপোর্ট</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Overall Preparation Gauge */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  NTRCA সামগ্রিক প্রস্তুতি
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black">
                  শীর্ষ ৫%
                </span>
              </div>

              <div className="flex items-center justify-center py-2">
                <div className="relative w-32 h-32 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 p-2">
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-emerald-800 to-teal-600 flex flex-col items-center justify-center text-white shadow-md">
                    <span className="text-2xl font-black text-amber-300 tracking-tight">{avgScore}%</span>
                    <span className="text-[9px] font-bold text-emerald-100">প্রস্তুতি স্কোর</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                আপনার প্রস্তুতি অত্যন্ত চমৎকার। বিগত বছরগুলোর তুলনায় আপনার উত্তীর্ণ হওয়ার সম্ভাবনা <strong>৯৪%+</strong>।
              </p>
            </div>

            {/* Subject Mastery Breakdown */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm md:col-span-2 space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-700" />
                  বিষয়ভিত্তিক দক্ষতা বিশ্লেষণ
                </h3>
                <span className="text-[10px] text-slate-500 font-semibold">মডেল টেস্ট ভিত্তিক</span>
              </div>

              <div className="space-y-3 pt-1">
                {[
                  { subject: 'আরবি সাহিত্য ও ব্যাকরণ (নাহু-সরফ)', score: 94, color: 'bg-emerald-600' },
                  { subject: 'হাদিস ও উসূলে হাদিস', score: 88, color: 'bg-teal-600' },
                  { subject: 'আল-কুরআন ও তাফসির', score: 91, color: 'bg-emerald-700' },
                  { subject: 'জেনারেল বাংলা ব্যাকরণ ও সাহিত্য', score: 82, color: 'bg-amber-600' },
                  { subject: 'ইংরেজি ও NTRCA সাধারণ জ্ঞান', score: 76, color: 'bg-blue-600' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-800 dark:text-slate-200">{item.subject}</span>
                      <span className="text-slate-600 dark:text-slate-400">{item.score}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className={`h-full rounded-full ${item.color} transition-all duration-500`} style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* D. SUB-VIEW: আমার কোর্সসমূহ (COURSES) */}
      {activeSection === 'courses' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveSection('menu')}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>মেনুতে ফিরে যান</span>
            </button>
            <span className="text-xs font-bold text-slate-500">ভর্তিকৃত কোর্স ({enrolledCourses.length})</span>
          </div>

          <div className="space-y-3">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-[#004d2e] dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate">
                      {course.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      প্রভাষক: {course.instructors?.[0]?.name || 'শিক্ষক প্যানেল'} • {course.category || 'NTRCA'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => setSelectedCourseDetails(course)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#004d2e] font-bold text-xs transition-colors"
                  >
                    ক্লাসরুম দেখুন
                  </button>
                  <button
                    onClick={() => setIsRoutineOpen(true)}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#004d2e] text-white font-bold text-xs shadow-sm transition-all"
                  >
                    রুটিন
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* E. SUB-VIEW: বুকমার্ককৃত প্রশ্ন (BOOKMARKS) */}
      {activeSection === 'bookmarks' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveSection('menu')}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>মেনুতে ফিরে যান</span>
            </button>
            <span className="text-xs font-bold text-amber-600">{bookmarkedQuestions.length}টি প্রশ্ন সংরক্ষিত</span>
          </div>

          {bookmarkedQuestions.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center space-y-3 border border-slate-100 dark:border-slate-800">
              <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">কোনো প্রশ্ন বুকমার্ক করা নেই</p>
              <p className="text-xs text-slate-400">মডেল টেস্ট দেওয়ার সময় গুরুত্বপূর্ণ প্রশ্নে বুকমার্ক আইকনে চাপুন।</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarkedQuestions.map((q, idx) => {
                const parsedQ = parseQuestionData(q);
                return (
                  <div
                    key={q.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#004d2e] dark:text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-500">{q.subject}</span>
                      </div>
                      <button
                        onClick={() => toggleBookmark(q.id)}
                        className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                        title="বুকমার্ক মুছুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      {parsedQ.isArabicWithBengali ? (
                        <div className="space-y-1 text-right" dir="rtl">
                          <h4 className="font-arabic text-lg font-bold text-slate-900 dark:text-slate-100">
                            {formatArabicText(parsedQ.arabicText)}
                          </h4>
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400" dir="ltr">
                            {parsedQ.bengaliTranslation}
                          </p>
                        </div>
                      ) : (
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                          {q.question}
                        </h4>
                      )}
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-300">
                      <strong>সঠিক উত্তর:</strong> {q.options[q.correctIndex]}
                      {q.explanation && (
                        <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                          <strong>ব্যাখ্যা:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* F. SUB-VIEW: ভুল উত্তরের ব্যাংক (WRONG ANSWERS BANK) */}
      {activeSection === 'wrong_bank' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveSection('menu')}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>মেনুতে ফিরে যান</span>
            </button>
            <span className="text-xs font-bold text-rose-600">{wrongAnswerQuestions.length}টি দুর্বল প্রশ্ন</span>
          </div>

          <div className="space-y-3">
            {wrongAnswerQuestions.map((item, idx) => {
              const parsedQ = parseQuestionData(item.question);
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-rose-100 dark:border-rose-950/60 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-bold">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                      {item.examTitle}
                    </span>
                    <span className="text-slate-400">প্রশ্ন #{idx + 1}</span>
                  </div>

                  <div>
                    {parsedQ.isArabicWithBengali ? (
                      <div className="space-y-1 text-right" dir="rtl">
                        <h4 className="font-arabic text-lg font-bold text-slate-900 dark:text-slate-100">
                          {formatArabicText(parsedQ.arabicText)}
                        </h4>
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400" dir="ltr">
                          {parsedQ.bengaliTranslation}
                        </p>
                      </div>
                    ) : (
                      <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                        {item.question.question}
                      </h4>
                    )}
                  </div>

                  {/* Wrong vs Correct Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-300">
                      <span className="font-bold block text-rose-600">আপনার প্রদত্ত উত্তর (ভুল):</span>
                      <span className="mt-0.5 block">{item.selectedAnswerText}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-300">
                      <span className="font-bold block text-emerald-700">সঠিক উত্তর:</span>
                      <span className="mt-0.5 block">{item.correctAnswerText}</span>
                    </div>
                  </div>

                  {item.question.explanation && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      <strong>বিশ্লেষণ:</strong> {item.question.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* G. SUB-VIEW: পরীক্ষার আর্কাইভ (EXAM HISTORY) */}
      {activeSection === 'history' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveSection('menu')}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>মেনুতে ফিরে যান</span>
            </button>
            <span className="text-xs font-bold text-purple-600">{examResults.length}টি পরীক্ষা দেওয়া হয়েছে</span>
          </div>

          {examResults.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center space-y-3 border border-slate-100 dark:border-slate-800">
              <History className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">এখনও কোনো পরীক্ষা দেওয়া হয়নি</p>
              <p className="text-xs text-slate-400">মডেল টেস্ট সম্পন্ন করলে আপনার ওএমআর ফলাফল এখানে জমা হবে।</p>
            </div>
          ) : (
            <div className="space-y-3">
              {examResults.map((result) => {
                const percentage = Math.round((result.score / (result.totalMarks || 1)) * 100);
                return (
                  <div
                    key={result.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                        {result.examTitle}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        তারিখ: {result.date} • স্কোর: <strong className="text-emerald-700 dark:text-emerald-400">{result.score}/{result.totalMarks}</strong> ({percentage}%)
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                      <button
                        onClick={() => {
                          setResultSubTab('explanation');
                          setViewingResult(result);
                        }}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#004d2e] font-bold text-xs transition-colors"
                      >
                        ব্যাখ্যা দেখুন
                      </button>
                      <button
                        onClick={() => {
                          setResultSubTab('leaderboard');
                          setViewingResult(result);
                        }}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200 transition-colors"
                      >
                        মেধাতালিকা
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* H. SUB-VIEW: মেধা তালিকা (EXAM SPECIFIC LEADERBOARD) */}
      {activeSection === 'leaderboard' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveSection('menu')}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>মেনুতে ফিরে যান</span>
            </button>
            <span className="text-xs font-bold text-amber-600">স্বতন্ত্র পরীক্ষা ভিত্তিক মেধা তালিকা</span>
          </div>

          {/* Exam Selector Carousel / Pill Switcher */}
          {exams.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 text-center text-slate-500">
              <p className="text-xs font-bold">এখনো কোনো পরীক্ষা যুক্ত করা হয়নি।</p>
            </div>
          ) : (
            <>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-100 dark:border-slate-800 shadow-xs space-y-2">
                <label className="text-xs font-bold text-slate-500 block">পরীক্ষা নির্বাচন করুন:</label>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  {exams.map((exam) => (
                    <button
                      key={exam.id}
                      onClick={() => setSelectedLeaderboardExamId(exam.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                        (selectedLeaderboardExamId === exam.id || (!selectedLeaderboardExamId && exams[0]?.id === exam.id))
                          ? 'bg-[#004d2e] text-white shadow-sm scale-102'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {exam.title} ({exam.subject})
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Exam Meta Card */}
              {selectedLeaderboardExam && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 rounded-2xl p-3.5 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-[#004d2e] dark:text-emerald-300">
                      {selectedLeaderboardExam.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      বিষয়: {selectedLeaderboardExam.subject} • মোট প্রশ্ন: {selectedLeaderboardExam.totalQuestions}টি • পূর্ণমান: {selectedLeaderboardExam.totalMarks}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {userExamResultForSelected ? (
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                        আপনার প্রাপ্ত নম্বর: {userExamResultForSelected.score}/{selectedLeaderboardExam.totalMarks}
                      </span>
                    ) : (
                      <button
                        onClick={() => startExam(selectedLeaderboardExam)}
                        className="bg-[#004d2e] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs"
                      >
                        পরীক্ষায় অংশ নিন
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Render Isolated Leaderboard Entries List */}
          <div className="space-y-2.5">
            {examLeaderboardEntries.map((entry) => {
              const isRank1 = entry.rank === 1;
              const isRank2 = entry.rank === 2;
              const isRank3 = entry.rank === 3;
              const isUser = entry.isCurrentUser;

              let cardStyle = "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800";
              let ringColor = "border-emerald-500";

              if (isRank1) {
                cardStyle = "border-2 border-amber-400 bg-amber-50/40 dark:bg-amber-950/30";
                ringColor = "border-amber-400";
              } else if (isRank2) {
                cardStyle = "border-2 border-sky-400 bg-sky-50/40 dark:bg-sky-950/30";
                ringColor = "border-sky-400";
              } else if (isRank3) {
                cardStyle = "border-2 border-amber-700/70 bg-amber-900/10 dark:bg-amber-950/20";
                ringColor = "border-amber-700";
              }

              return (
                <div
                  key={entry.id}
                  className={`rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-xs ${cardStyle} ${
                    isUser ? 'ring-2 ring-emerald-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {entry.rank.toLocaleString('bn-BD')}
                    </div>

                    {renderAvatar(entry, 'w-9 h-9 sm:w-10 sm:h-10', ringColor)}

                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <strong className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                          {entry.name}
                        </strong>
                        {isRank1 && <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">১ম স্থান</span>}
                        {isRank2 && <span className="text-[10px] bg-sky-400 text-white font-black px-1.5 py-0.2 rounded-full">২য় স্থান</span>}
                        {isRank3 && <span className="text-[10px] bg-amber-700 text-white font-black px-1.5 py-0.2 rounded-full">৩য় স্থান</span>}
                        {isUser && <span className="text-[10px] bg-emerald-700 text-white font-black px-2 py-0.2 rounded-full">আপনি</span>}
                      </div>
                      <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                        {entry.institution || 'সরকারি মাদ্রাসা-ই-আলিয়া, ঢাকা'} • প্রশ্ন: {selectedLeaderboardExam.totalQuestions}টি
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-4 shrink-0 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">সঠিক</span>
                      <span className="font-black text-emerald-600 block">{entry.correctAnswers}টি</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">ভুল</span>
                      <span className="font-black text-rose-600 block">{entry.wrongAnswers}টি</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">নম্বর</span>
                      <span className="font-black text-amber-600 block">
                        {entry.score % 1 === 0 ? entry.score.toFixed(0) : entry.score.toFixed(2)}/{entry.totalMarks}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* I. SUB-VIEW: প্রিমিয়াম মেম্বারশিপ (PREMIUM STATUS) */}
      {activeSection === 'premium' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveSection('menu')}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>মেনুতে ফিরে যান</span>
            </button>
            <span className="text-xs font-bold text-amber-600">ভিআইপি সুবিধা</span>
          </div>

          <div className="bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 text-slate-950 p-6 rounded-3xl shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-7 h-7 fill-slate-950" />
                <h3 className="text-lg font-black tracking-tight">তামরীন গোল্ড মেম্বারশিপ</h3>
              </div>
              <span className="bg-slate-950 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                আজীবন মেয়াদ
              </span>
            </div>

            <p className="text-xs font-bold text-slate-900 leading-relaxed">
              আপনি আত-তামরীন একাডেমির সক্রিয় প্রিমিয়াম শিক্ষার্থী। আপনার অ্যাকাউন্টে নিম্নের সকল ফিচার সক্রিয় রয়েছে:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-900 pt-2">
              <div className="flex items-center gap-1.5">✓ আনলিমিটেড তামরীন এআই ডাউট সলভার</div>
              <div className="flex items-center gap-1.5">✓ সকল লাইভ মেগা মডেল টেস্ট ও ওএমআর</div>
              <div className="flex items-center gap-1.5">✓ বিগত ১০ বছরের NTRCA ব্যাখ্যাসহ সমাধান</div>
              <div className="flex items-center gap-1.5">✓ লেকচার শিট ও শর্টকাট টেকনিক নোটস</div>
            </div>
          </div>
        </div>
      )}

      {/* J. SUB-VIEW: সেটিংস ও পছন্দ (SETTINGS) */}
      {activeSection === 'settings' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveSection('menu')}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-xs hover:bg-slate-50 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>মেনুতে ফিরে যান</span>
            </button>
            <span className="text-xs font-bold text-slate-500">অ্যাপ সেটিংস</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-5">
            {/* Arabic Font Selection */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>আরবি ফন্ট স্টাইল নির্বাচন করুন</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'Amiri' as ArabicFont, name: 'আমিরি (Amiri)' },
                  { id: 'Scheherazade New' as ArabicFont, name: 'শেহরাজাদ' },
                  { id: 'Noto Naskh Arabic' as ArabicFont, name: 'নাসখ' },
                  { id: 'Lateef' as ArabicFont, name: 'লতিফ (Lateef)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setArabicFont(f.id);
                      showToast(`আরবি ফন্ট '${f.name}' সেট করা হয়েছে`);
                    }}
                    className={`p-3 rounded-2xl text-xs font-bold border transition-all ${
                      settings.arabicFont === f.id
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-[#004d2e] dark:text-emerald-300 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Bangla Font Selection */}
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-600" />
                <span>বাংলা ফন্ট স্টাইল</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'Hind Siliguri' as BanglaFont, name: 'হিন্দ শিলিগুড়ি' },
                  { id: 'Tiro Bangla' as BanglaFont, name: 'তিরো বাংলা' },
                  { id: 'Noto Serif Bengali' as BanglaFont, name: 'নোটো সেরিফ' },
                  { id: 'Anek Bangla' as BanglaFont, name: 'অনেক বাংলা' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setBanglaFont(f.id);
                      showToast(`বাংলা ফন্ট '${f.name}' সেট করা হয়েছে`);
                    }}
                    className={`p-3 rounded-2xl text-xs font-bold border transition-all ${
                      settings.banglaFont === f.id
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-950 text-teal-900 dark:text-teal-300 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound & Haptic Toggles */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block">ওএমআর ক্লিক সাউন্ড ইফেক্ট</strong>
                  <span className="text-xs text-slate-500">পরীক্ষায় উত্তর বৃত্ত ভরাটের সময় সাউন্ড বাজবে</span>
                </div>
                <button
                  onClick={() => {
                    updateUserProfile({ soundEnabled: !userProfile.soundEnabled });
                    showToast(userProfile.soundEnabled ? 'সাউন্ড বন্ধ করা হয়েছে' : 'সাউন্ড চালু করা হয়েছে');
                  }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    userProfile.soundEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${userProfile.soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block">এসএমএস ও নোটিফিকেশন অ্যালার্ট</strong>
                  <span className="text-xs text-slate-500">লাইভ ক্লাসের ১৫ মিনিট পূর্বে অ্যালার্ট পাবেন</span>
                </div>
                <button
                  onClick={() => {
                    updateUserProfile({ smsAlerts: !userProfile.smsAlerts });
                    showToast(userProfile.smsAlerts ? 'অ্যালার্ট বন্ধ করা হয়েছে' : 'অ্যালার্ট চালু করা হয়েছে');
                  }}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    userProfile.smsAlerts ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${userProfile.smsAlerts ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            {/* Supabase & Admin Panel Sync Configuration */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isSupabaseConnected 
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400' 
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                  }`}>
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                      সুপাবেস (Supabase) ও এডমিন কানেকশন
                    </h4>
                    <span className="text-[11px] text-slate-500 block">
                      এডমিন প্যানেলে তৈরি করা প্রশ্ন, পরীক্ষা ও কোর্স লাইভ সিন্ক
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full ${
                    isSupabaseConnected
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    {isSupabaseConnected ? 'সক্রিয় (Live)' : 'ফলব্যাক (Offline/Mock)'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    value={supabaseUrlInput}
                    onChange={(e) => setSupabaseUrlInput(cleanSupabaseUrl(e.target.value))}
                    placeholder="https://your-project.supabase.co"
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Supabase Anon / Public Key
                  </label>
                  <input
                    type="password"
                    value={supabaseKeyInput}
                    onChange={(e) => setSupabaseKeyInput(cleanSupabaseKey(e.target.value))}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono focus:outline-emerald-600"
                  />
                </div>

                {dbTestResult && (
                  <div className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    dbTestResult.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  }`}>
                    {dbTestResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                    <span>{dbTestResult.message}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={async () => {
                      const cleanedUrl = cleanSupabaseUrl(supabaseUrlInput);
                      const cleanedKey = cleanSupabaseKey(supabaseKeyInput);
                      setSupabaseUrlInput(cleanedUrl);
                      setSupabaseKeyInput(cleanedKey);
                      saveSupabaseConfig(cleanedUrl, cleanedKey);
                      setIsTestingDb(true);
                      setDbTestResult(null);
                      const res = await testSupabaseConnection();
                      setDbTestResult(res);
                      setIsTestingDb(false);
                      if (res.success) {
                        showToast('ডাটাবেজ কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে!');
                        await refreshFromDatabase();
                      } else {
                        showToast(res.message, 'error');
                      }
                    }}
                    disabled={isTestingDb}
                    className="px-4 py-2 rounded-xl bg-[#004d2e] hover:bg-[#003822] text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {isTestingDb ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Server className="w-3.5 h-3.5" />}
                    <span>{isTestingDb ? 'যাচাই করা হচ্ছে...' : 'সেভ ও কানেকশন টেস্ট'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      await refreshFromDatabase();
                      showToast('এডমিন প্যানেলের সাথে ডাটা সিন্ক সম্পন্ন হয়েছে!');
                    }}
                    disabled={isLoadingData}
                    className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
                    <span>{isLoadingData ? 'লোড হচ্ছে...' : 'ডাটা রিফ্রেশ করুন'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 3. MODAL: PROFILE EDIT */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#004d2e]" />
                <span>প্রোফাইল তথ্য সংশোধন</span>
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">পূর্ণ নাম</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold focus:outline-emerald-600 text-slate-900 dark:text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">ইমেইল</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold focus:outline-emerald-600 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">মোবাইল নম্বর</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold focus:outline-emerald-600 text-slate-900 dark:text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">শিক্ষাপ্রতিষ্ঠান</label>
                  <input
                    type="text"
                    value={editInstitution}
                    onChange={(e) => setEditInstitution(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold focus:outline-emerald-600 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">নিজ জেলা</label>
                  <input
                    type="text"
                    value={editDistrict}
                    onChange={(e) => setEditDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold focus:outline-emerald-600 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">টার্গেট পদ (পদবী ট্যাগ)</label>
                  <input
                    type="text"
                    value={editBatchTag}
                    onChange={(e) => setEditBatchTag(e.target.value)}
                    placeholder="যেমন: সহকারী শিক্ষক (আরবি)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold focus:outline-emerald-600 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">লক্ষ্য (Target Exam)</label>
                  <input
                    type="text"
                    value={editTargetExam}
                    onChange={(e) => setEditTargetExam(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold focus:outline-emerald-600 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">বায়ো / লক্ষ্য উক্তি</label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium focus:outline-emerald-600 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition-all"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#004d2e] hover:bg-[#003822] text-white font-black shadow-md transition-all active:scale-98"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🌟 4. MODAL: AVATAR PICKER / UPLOAD */}
      {isAvatarPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-scaleUp text-center">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
              প্রোফাইল ছবি পরিবর্তন
            </h3>

            {/* Custom Device File Upload */}
            <div className="p-4 rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
              <Camera className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">ডিভাইস থেকে নিজের ছবি আপলোড করুন</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-[#004d2e] text-white text-xs font-bold shadow-xs hover:bg-[#003d25] transition-all"
              >
                ছবি বেছে নিন
              </button>
            </div>

            {/* Preset Avatars */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-500 block">অথবা নিচের যেকোনো একটি অ্যাভাটার বেছে নিন:</span>
              <div className="grid grid-cols-3 gap-2.5">
                {presetAvatars.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      updateUserProfile({ avatar: url });
                      showToast('প্রোফাইল ছবি সফলভাবে পরিবর্তিত হয়েছে');
                      setIsAvatarPickerOpen(false);
                    }}
                    className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:scale-105 transition-all mx-auto"
                  >
                    <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsAvatarPickerOpen(false)}
                className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
