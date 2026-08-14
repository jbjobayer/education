import React, { useState, useRef } from 'react';
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
  Eye
} from 'lucide-react';
import { mockQuestions } from '../../data/mockData';
import { useFont } from '../../context/FontContext';
import { getUnifiedQuestionText, getTextDirection, parseQuestionData } from '../../utils/questionUtils';
import { ExamResult } from '../../types';

type ProfileTab = 'dashboard' | 'courses' | 'history' | 'bookmarks' | 'settings';

export const ProfileView: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    enrolledCourseIds, 
    courses, 
    examResults, 
    bookmarks, 
    toggleBookmark,
    setSelectedCourseDetails,
    setIsRoutineOpen,
    setViewingResult,
    showToast 
  } = useApp();
  const { 
    settings, 
    setBanglaFont, 
    setArabicFont, 
    setFontSize, 
    formatArabicText 
  } = useFont();

  const [activeTab, setActiveTab] = useState<ProfileTab>('dashboard');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Edit Form State
  const [editName, setEditName] = useState(userProfile.name);
  const [editPhone, setEditPhone] = useState(userProfile.phone);
  const [editEmail, setEditEmail] = useState(userProfile.email);
  const [editRollNo, setEditRollNo] = useState(userProfile.rollNo);
  const [editInstitution, setEditInstitution] = useState(userProfile.institution);
  const [editTargetExam, setEditTargetExam] = useState(userProfile.targetExam);
  const [editDistrict, setEditDistrict] = useState(userProfile.district || 'ঢাকা');
  const [editBio, setEditBio] = useState(userProfile.bio || '');

  // Daily Study Goals State
  const [dailyGoals, setDailyGoals] = useState([
    { id: 1, text: 'আজকের ১টি বিষয়ভিত্তিক মডেল টেস্ট সম্পন্ন করা', completed: true },
    { id: 2, text: 'নাহু ও সরফের ২০টি আরবি প্রশ্ন অনুশীলন', completed: true },
    { id: 3, text: 'লেকচার শিট ০৩ (বালাগাত ও আদব) রিভিশন', completed: false },
    { id: 4, text: 'তামরীন এআই মেন্টর দিয়ে ২টি সন্দেহ সমাধান', completed: false },
    { id: 5, text: 'বিগত বছরের NTRCA সাধারণ জ্ঞান প্রশ্ন দেখা', completed: false },
  ]);

  const presetAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  ];

  const enrolledCourses = courses.filter((c) => enrolledCourseIds.includes(c.id));
  const bookmarkedQuestions = (mockQuestions.exam1 || []).filter((q) => bookmarks.includes(q.id));

  // Analytics Metrics
  const totalExamsTaken = examResults.length;
  const avgScore = totalExamsTaken > 0 
    ? Math.round(examResults.reduce((acc, r) => acc + (r.score / (r.totalMarks || 100)) * 100, 0) / totalExamsTaken)
    : 84;
  const totalQuestionsAnswered = totalExamsTaken > 0
    ? examResults.reduce((acc, r) => acc + r.correctAnswers + r.wrongAnswers, 0)
    : 180;
  const totalCorrect = totalExamsTaken > 0
    ? examResults.reduce((acc, r) => acc + r.correctAnswers, 0)
    : 152;
  const accuracyRate = totalQuestionsAnswered > 0 ? Math.round((totalCorrect / totalQuestionsAnswered) * 100) : 85;

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
    });
    setIsEditModalOpen(false);
  };

  const toggleGoal = (id: number) => {
    setDailyGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  return (
    <div className="space-y-6 pb-28 animate-fadeIn max-w-5xl mx-auto">
      {/* 🌟 Modern VIP Profile Header Card */}
      <div className="p-5 sm:p-7 rounded-3xl neu-card relative overflow-hidden">
        {/* Subtle Decorative Background Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          {/* Avatar & User Details */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            {/* Interactive Avatar with Upload Trigger */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl neu-inset p-1.5 flex items-center justify-center bg-[#e5ebf4] dark:bg-[#121c2c]">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-full h-full rounded-2xl object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Photo Edit Badge Button */}
              <button
                onClick={() => setIsAvatarPickerOpen(true)}
                className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-800 to-teal-700 hover:from-emerald-700 hover:to-teal-600 text-white flex items-center justify-center shadow-md cursor-pointer border-2 border-white dark:border-slate-800 transition-all hover:scale-110"
                title="প্রোফাইল ছবি পরিবর্তন করুন"
              >
                <Camera className="w-4 h-4 text-amber-300" />
              </button>

              {/* Verified Online Pip */}
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[9px] text-white font-black shadow-xs">
                ✓
              </span>
            </div>

            {/* Profile Info Text */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {userProfile.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  ভেরিফাইড শিক্ষার্থী
                </span>
              </div>

              <p className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                {userProfile.institution}
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 dark:text-slate-300 pt-0.5">
                <span className="font-semibold">
                  রোল: <strong className="text-slate-900 dark:text-white">{userProfile.rollNo}</strong>
                </span>
                <span>•</span>
                <span className="font-semibold">
                  লক্ষ্য: <strong className="text-slate-900 dark:text-white">{userProfile.targetExam}</strong>
                </span>
                <span>•</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                  {userProfile.district || 'ঢাকা'}
                </span>
              </div>

              {userProfile.bio && (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic pt-1 max-w-lg leading-relaxed">
                  "{userProfile.bio}"
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons: Edit Profile & Status */}
          <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-end shrink-0">
            <button
              onClick={() => {
                setEditName(userProfile.name);
                setEditPhone(userProfile.phone);
                setEditEmail(userProfile.email);
                setEditRollNo(userProfile.rollNo);
                setEditInstitution(userProfile.institution);
                setEditTargetExam(userProfile.targetExam);
                setEditDistrict(userProfile.district || 'ঢাকা');
                setEditBio(userProfile.bio || '');
                setIsEditModalOpen(true);
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl neu-btn text-xs font-black text-slate-800 dark:text-slate-100 hover:text-emerald-800 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>প্রোফাইল এডিট</span>
            </button>

            <button
              onClick={() => {
                updateUserProfile({ studyStreakDays: (userProfile.studyStreakDays || 7) + 1 });
                showToast('🔥 আজকের স্ট্রিক সফলভাবে সক্রিয় করা হয়েছে!');
              }}
              className="px-3.5 py-2.5 rounded-2xl neu-inset text-xs font-black text-amber-700 dark:text-amber-400 flex items-center gap-1.5 shadow-inner"
              title="স্টাডি স্ট্রিক সক্রিয় করুন"
            >
              <Flame className="w-4 h-4 fill-amber-500 text-amber-600 animate-pulse" />
              <span>{userProfile.studyStreakDays || 7} দিন স্ট্রিক</span>
            </button>
          </div>
        </div>

        {/* Quick Performance Metric Pills */}
        <div className="mt-6 pt-5 border-t border-white/60 dark:border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 sm:p-3.5 rounded-2xl neu-inset">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold flex items-center justify-center gap-1 mb-0.5">
              <BookOpen className="w-3 h-3 text-emerald-700" /> ভর্তিকৃত কোর্স
            </span>
            <strong className="text-base sm:text-xl font-black text-emerald-800 dark:text-emerald-400">
              {enrolledCourses.length}টি
            </strong>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl neu-inset">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold flex items-center justify-center gap-1 mb-0.5">
              <FileCheck2 className="w-3 h-3 text-blue-600" /> পরীক্ষা সম্পন্ন
            </span>
            <strong className="text-base sm:text-xl font-black text-slate-800 dark:text-slate-100">
              {totalExamsTaken}টি
            </strong>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl neu-inset">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold flex items-center justify-center gap-1 mb-0.5">
              <Target className="w-3 h-3 text-amber-600" /> গড় নির্ভুলতা
            </span>
            <strong className="text-base sm:text-xl font-black text-amber-700 dark:text-amber-400">
              {accuracyRate}%
            </strong>
          </div>

          <div className="p-3 sm:p-3.5 rounded-2xl neu-inset">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold flex items-center justify-center gap-1 mb-0.5">
              <Award className="w-3 h-3 text-emerald-700" /> অর্জিত পয়েন্ট
            </span>
            <strong className="text-base sm:text-xl font-black text-emerald-800 dark:text-emerald-400">
              {userProfile.totalPoints || 1450} ⭐
            </strong>
          </div>
        </div>
      </div>

      {/* 🧭 Horizontal Smart Dashboard Navigation Bar */}
      <div className="p-1.5 rounded-2xl neu-card flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'dashboard'
              ? 'neu-btn-primary text-white shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:text-emerald-800'
          }`}
        >
          <BarChart3 className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-amber-300' : ''}`} />
          <span>ড্যাশবোর্ড</span>
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'courses'
              ? 'neu-btn-primary text-white shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:text-emerald-800'
          }`}
        >
          <BookOpen className={`w-4 h-4 ${activeTab === 'courses' ? 'text-amber-300' : ''}`} />
          <span>আমার কোর্স ({enrolledCourses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'history'
              ? 'neu-btn-primary text-white shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:text-emerald-800'
          }`}
        >
          <FileCheck2 className={`w-4 h-4 ${activeTab === 'history' ? 'text-amber-300' : ''}`} />
          <span>ফলাফল ও হিস্ট্রি</span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'bookmarks'
              ? 'neu-btn-primary text-white shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:text-emerald-800'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${activeTab === 'bookmarks' ? 'text-amber-300' : ''}`} />
          <span>বুকমার্ক ({bookmarkedQuestions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'neu-btn-primary text-white shadow-md'
              : 'text-slate-700 dark:text-slate-300 hover:text-emerald-800'
          }`}
        >
          <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-amber-300' : ''}`} />
          <span>সেটিংস</span>
        </button>
      </div>

      {/* 📊 TAB 1: PERSONAL DASHBOARD & ANALYTICS */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Exam Readiness & Preparation Radar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Overall Preparation Gauge */}
            <div className="p-5 sm:p-6 rounded-3xl neu-card flex flex-col justify-between space-y-4">
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
                <div className="relative w-36 h-36 rounded-full flex items-center justify-center neu-inset p-3">
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-emerald-800 to-teal-600 flex flex-col items-center justify-center text-white shadow-md">
                    <span className="text-3xl font-black text-amber-300 tracking-tight">{avgScore}%</span>
                    <span className="text-[10px] font-bold text-emerald-100">প্রস্তুতি স্কোর</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                আপনার ধারাবাহিকতা চমৎকার! প্রভাষক আরবি ও সাধারণ বিষয়ের অগ্রগতি সন্তোষজনক।
              </p>
            </div>

            {/* Subject Mastery Breakdown */}
            <div className="p-5 sm:p-6 rounded-3xl neu-card md:col-span-2 space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-700" />
                  বিষয়ভিত্তিক দক্ষতা ও পারফরম্যান্স মেট্রিক্স
                </h3>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                  সর্বশেষ আপডেট: আজ
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {/* Arabic Grammar & Studies */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800 dark:text-slate-200">আরবি ভাষা ও ব্যাকরণ (নাহু, সরফ, বালাগাত)</span>
                    <span className="text-emerald-800 dark:text-emerald-400 font-black">৮৮% (দক্ষ)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full neu-inset overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>

                {/* Islamic Studies & Hadith */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800 dark:text-slate-200">ইসলামিক স্টাডিজ (কুরআন, হাদিস, ফিকহ)</span>
                    <span className="text-emerald-800 dark:text-emerald-400 font-black">৯৪% (মাস্টার)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full neu-inset overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-700 to-emerald-500 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>

                {/* Bengali Language & Literature */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800 dark:text-slate-200">বাংলা ভাষা ও সাহিত্য</span>
                    <span className="text-teal-800 dark:text-teal-400 font-black">৮২% (সন্তোষজনক)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full neu-inset overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>

                {/* English Language & Grammar */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800 dark:text-slate-200">ইংরেজি ব্যাকরণ ও ভোকাবুলারি</span>
                    <span className="text-amber-700 dark:text-amber-400 font-black">৭০% (আরও অনুশীলন প্রয়োজন)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full neu-inset overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>

                {/* General Knowledge & Math */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800 dark:text-slate-200">গণিত ও সাধারণ জ্ঞান (বাংলাদেশ ও আন্তর্জাতিক)</span>
                    <span className="text-blue-800 dark:text-blue-400 font-black">৭৮% (উন্নতিশীল)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full neu-inset overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Study Goals & Checklist */}
          <div className="p-5 sm:p-6 rounded-3xl neu-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-600" />
                  আজকের ব্যক্তিগত পড়ার লক্ষ্য ও চেকলিস্ট
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  প্রতিদিনের নির্দিষ্ট লক্ষ্য পূরণ করে নিজের স্টাডি স্ট্রিক ও মেধা পয়েন্ট বৃদ্ধি করুন
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black">
                {dailyGoals.filter((g) => g.completed).length}/{dailyGoals.length} সম্পন্ন
              </span>
            </div>

            <div className="space-y-2.5 pt-1">
              {dailyGoals.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    goal.completed
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'neu-inset text-slate-800 dark:text-slate-200 hover:bg-slate-200/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {goal.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-lg border-2 border-slate-400 shrink-0" />
                    )}
                    <span className={`text-xs sm:text-sm font-bold ${goal.completed ? 'line-through opacity-80' : ''}`}>
                      {goal.text}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 shrink-0">
                    {goal.completed ? '+৫০ পয়েন্ট' : 'বাকি আছে'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges & Achievements Gallery */}
          <div className="p-5 sm:p-6 rounded-3xl neu-card space-y-4">
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              অর্জিত ব্যাজ ও মেধা মেডেল
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-4 rounded-2xl neu-inset flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
                  🎖️
                </div>
                <strong className="text-xs font-black text-slate-900 dark:text-white">প্রথম পরীক্ষা সম্পন্ন</strong>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">আনলক হয়েছে</span>
              </div>

              <div className="p-4 rounded-2xl neu-inset flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-xl shadow-md">
                  🌟
                </div>
                <strong className="text-xs font-black text-slate-900 dark:text-white">ব্যাকরণ বিশারদ</strong>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">৯০%+ স্কোর</span>
              </div>

              <div className="p-4 rounded-2xl neu-inset flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-black text-xl shadow-md">
                  🔥
                </div>
                <strong className="text-xs font-black text-slate-900 dark:text-white">৭ দিন স্ট্রিক চ্যাম্পিয়ন</strong>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">সক্রিয় স্ট্রিক</span>
              </div>

              <div className="p-4 rounded-2xl neu-inset flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-black text-xl shadow-md">
                  👑
                </div>
                <strong className="text-xs font-black text-slate-900 dark:text-white">টপ ৫% র‍্যাংক</strong>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">গোল্ড লিগ</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📚 TAB 2: ENROLLED COURSES & CLASSROOM */}
      {activeTab === 'courses' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-700" />
              আমার ভর্তিকৃত কোর্সসমূহ ({enrolledCourses.length})
            </h3>
            <button
              onClick={() => setIsRoutineOpen(true)}
              className="px-3.5 py-2 rounded-xl neu-btn text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4" /> ক্লাস রুটিন দেখুন
            </button>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="p-8 rounded-3xl neu-card text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                আপনি এখনও কোনো কোর্সে ভর্তি হননি।
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                কোর্স সেকশন থেকে আপনার কাঙ্ক্ষিত শিক্ষক নিবন্ধন বা আরবি ভাষা কোর্সে ভর্তি হন।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-5 rounded-3xl neu-card flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0 shadow-sm"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black">
                          চলমান ব্যাচ
                        </span>
                        <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                          ★ {course.rating}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                        {course.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {course.totalClasses}টি ক্লাস • {course.totalExams}টি পরীক্ষা • {course.totalSheets || 30}টি শিট
                      </p>
                    </div>
                  </div>

                  {/* Course Quick Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      <span>কোর্স সম্পন্নতা</span>
                      <span className="text-emerald-800 dark:text-emerald-400">৬৫%</span>
                    </div>
                    <div className="w-full h-2 rounded-full neu-inset overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/60 dark:border-slate-700/60 flex items-center justify-between gap-2.5">
                    <button
                      onClick={() => setIsRoutineOpen(true)}
                      className="flex-1 py-2.5 neu-btn-primary text-xs font-black rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Video className="w-3.5 h-3.5 text-amber-300" />
                      <span>লাইভ ক্লাসে যোগ দিন</span>
                    </button>
                    <button
                      onClick={() => setSelectedCourseDetails(course)}
                      className="px-4 py-2.5 neu-btn text-slate-700 dark:text-slate-200 text-xs font-black rounded-xl cursor-pointer hover:text-emerald-800"
                    >
                      বিস্তারিত
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 📝 TAB 3: EXAM RESULTS & SCORECARDS */}
      {activeTab === 'history' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-700" />
              সম্পন্নকৃত পরীক্ষার ফলাফল ও স্কোরকার্ড ({examResults.length})
            </h3>
          </div>

          {examResults.length === 0 ? (
            <div className="p-8 rounded-3xl neu-card text-center space-y-3">
              <FileCheck2 className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                আপনি এখনও কোনো অনলাইন পরীক্ষা দেননি।
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                পরীক্ষা সেকশন থেকে লাইভ বা মডেল টেস্টে অংশগ্রহণ করে আপনার প্রস্তুতি যাচাই করুন।
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {examResults.map((result, idx) => (
                <div
                  key={result.id || idx}
                  className="p-5 rounded-3xl neu-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-md">
                      {result.date || 'আজ'}
                    </span>
                    <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                      {result.examTitle}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium pt-0.5">
                      <span>প্রাপ্ত নম্বর: <strong className="text-emerald-800 dark:text-emerald-400 font-black">{result.score}/{result.totalMarks}</strong></span>
                      <span>•</span>
                      <span>সঠিক: <strong className="text-emerald-700">{result.correctAnswers}</strong></span>
                      <span>•</span>
                      <span>ভুল: <strong className="text-rose-600">{result.wrongAnswers}</strong></span>
                      <span>•</span>
                      <span>সময়: <strong className="text-slate-800 dark:text-slate-200">{Math.round(result.timeSpentSeconds / 60)} মিনিট</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => setViewingResult(result)}
                    className="w-full sm:w-auto px-4 py-2.5 neu-btn-primary text-xs font-black rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-md"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-300" />
                    <span>উত্তরমালা ও সমাধান দেখুন</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 🔖 TAB 4: BOOKMARKED QUESTIONS BANK */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-600" />
              সংরক্ষিত প্রশ্ন ও রিভিশন ব্যাংক ({bookmarkedQuestions.length})
            </h3>
          </div>

          {bookmarkedQuestions.length === 0 ? (
            <div className="p-8 rounded-3xl neu-card text-center space-y-3">
              <Bookmark className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                কোনো সংরক্ষিত প্রশ্ন নেই।
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                মডেল টেস্ট দেওয়ার সময় বা উত্তরমালা দেখার সময় বুকমার্ক আইকনে ক্লিক করে কঠিন প্রশ্নগুলো সেভ করুন।
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {bookmarkedQuestions.map((q, qIdx) => {
                const parsedQ = parseQuestionData(q);

                return (
                  <div key={q.id} className="p-5 rounded-3xl neu-card space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-900 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-md">
                        {q.subject}
                      </span>
                      <button
                        onClick={() => toggleBookmark(q.id)}
                        className="text-xs text-rose-600 hover:underline font-bold cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>মুছুন</span>
                      </button>
                    </div>

                    {/* Question Row */}
                    <div className={`flex items-start gap-3 my-1.5 ${parsedQ.isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                      <div className="w-7 h-7 rounded-full bg-[#1e293b] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs mt-0.5 select-none">
                        {parsedQ.isArabicNumbering ? (qIdx + 1).toLocaleString('ar-EG') : (qIdx + 1).toLocaleString('bn-BD')}
                      </div>

                      <div className={`flex-1 ${parsedQ.primaryTextAlign}`}>
                        {parsedQ.isArabicWithBengali ? (
                          <div className="space-y-1">
                            <h4 
                              className="font-arabic text-lg font-black text-slate-900 dark:text-white leading-relaxed" 
                              dir="rtl"
                            >
                              {formatArabicText(parsedQ.arabicText)}
                            </h4>
                            <p 
                              className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed text-right" 
                              dir="ltr"
                            >
                              {parsedQ.bengaliTranslation}
                            </p>
                          </div>
                        ) : (
                          <h4 
                            className={`font-bold leading-relaxed text-slate-900 dark:text-white ${parsedQ.primaryTextAlign} ${
                              parsedQ.isRTL ? 'font-arabic text-lg' : 'text-sm'
                            }`}
                            dir={parsedQ.primaryDir}
                          >
                            {formatArabicText(parsedQ.singleText)}
                          </h4>
                        )}
                      </div>
                    </div>

                    <div className="p-3 neu-inset rounded-2xl text-xs text-slate-800 dark:text-slate-200">
                      <strong className="text-emerald-800 dark:text-emerald-400">সঠিক উত্তর:</strong> {formatArabicText(q.options[q.correctIndex])} — <span className="text-slate-600 dark:text-slate-400">{formatArabicText(q.explanation)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ⚙️ TAB 5: APP SETTINGS & PREFERENCES */}
      {activeTab === 'settings' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Typography & Font Settings */}
          <div className="p-5 sm:p-6 rounded-3xl neu-card space-y-4">
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-700" />
              টাইপোগ্রাফি ও ফন্ট সেটিংস
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1.5 font-bold">
                  আরবি ফন্ট ফ্যামিলি:
                </label>
                <select
                  value={settings.arabicFont}
                  onChange={(e) => setArabicFont(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs neu-inset rounded-xl font-arabic font-bold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Amiri">Amiri (আমিরি - ক্লাসিক্যাল)</option>
                  <option value="Scheherazade New">Scheherazade New (শেহেরজাদ)</option>
                  <option value="Noto Naskh Arabic">Noto Naskh Arabic (নাখস)</option>
                  <option value="Lateef">Lateef (লতীফ ফন্ট)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1.5 font-bold">
                  বাংলা ফন্ট ফ্যামিলি:
                </label>
                <select
                  value={settings.banglaFont}
                  onChange={(e) => setBanglaFont(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs neu-inset rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Hind Siliguri">হিন্দ শিলিগুড়ি (Hind Siliguri)</option>
                  <option value="Tiro Bangla">তিরো বাংলা (Tiro Bangla)</option>
                  <option value="Noto Serif Bengali">নোটো সেরিফ বাংলা</option>
                  <option value="Anek Bangla">অনেক বাংলা (Anek Bangla)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1.5 font-bold">
                  টেক্সট আকার:
                </label>
                <select
                  value={settings.fontSize}
                  onChange={(e) => setFontSize(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs neu-inset rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="normal">স্বাভাবিক (Normal)</option>
                  <option value="medium">মাঝারি (Medium)</option>
                  <option value="large">বড় (Large)</option>
                  <option value="xlarge">অনেক বড় (Extra Large)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Exam Audio & Alerts Preferences */}
          <div className="p-5 sm:p-6 rounded-3xl neu-card space-y-4">
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-600" />
              নোটিফিকেশন ও পরীক্ষা অ্যালার্ট পছন্দসমূহ
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl neu-inset">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 text-emerald-700" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      পরীক্ষার ওএমআর সাউন্ড এফেক্ট
                    </span>
                    <span className="text-[10px] text-slate-500">উত্তর বৃত্ত ভরাটের সময় মৃদু সাউন্ড বাজবে</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={userProfile.soundEnabled ?? true}
                  onChange={(e) => updateUserProfile({ soundEnabled: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl neu-inset">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      লাইভ ক্লাস ও এক্সাম এসএমএস অ্যালার্ট
                    </span>
                    <span className="text-[10px] text-slate-500">পরীক্ষার ১৫ মিনিট পূর্বে রিমাইন্ডার পাবেন</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={userProfile.smsAlerts ?? true}
                  onChange={(e) => updateUserProfile({ smsAlerts: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Helpline & Student Community Support */}
          <div className="p-5 sm:p-6 rounded-3xl neu-card space-y-3">
            <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Headphones className="w-4 h-4 text-emerald-700" />
              আত-তামরীন একাডেমি স্টুডেন্ট সাপোর্ট ও হটলাইন
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              ভর্তি সংক্রান্ত তথ্য, লাইভ ক্লাসের লিংক অথবা টেকনিক্যাল সমস্যার জন্য আমাদের অফিসিয়াল সাপোর্ট টিমের সাথে সরাসরি যোগাযোগ করুন।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href="tel:+8801772895401"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('কল সাপোর্ট: ০১৭৭২-৮৯৫৪০১ (সকাল ১০টা - রাত ১০টা)', 'info');
                }}
                className="p-3.5 rounded-2xl neu-btn flex items-center gap-3 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl neu-icon flex items-center justify-center text-emerald-700">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">কল করুন সরাসরি</span>
                  <span className="text-[11px] text-emerald-800 dark:text-emerald-400 font-bold">০১৭৭২-৮৯৫৪০১</span>
                </div>
              </a>

              <a
                href="#whatsapp"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('হোয়াটসঅ্যাপ সাপোর্ট গ্রুপে যুক্ত হচ্ছেন...', 'success');
                }}
                className="p-3.5 rounded-2xl neu-btn flex items-center gap-3 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl neu-icon flex items-center justify-center text-emerald-700">
                  <Share2 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">WhatsApp স্টুডেন্ট গ্রুপ</span>
                  <span className="text-[11px] text-emerald-800 dark:text-emerald-400 font-bold">২৪/৭ আলোচনার ফোরাম</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 🖼️ AVATAR PICKER / PHOTO CHANGE MODAL */}
      {isAvatarPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-[#e9edf5] dark:bg-[#0f172a] rounded-3xl p-6 neu-card space-y-5 border border-white/60 dark:border-slate-700">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-700" />
                প্রোফাইল ছবি পরিবর্তন করুন
              </h3>
              <button
                onClick={() => setIsAvatarPickerOpen(false)}
                className="w-7 h-7 rounded-full neu-btn flex items-center justify-center text-slate-500 font-bold hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            {/* Custom Upload Button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3.5 neu-btn-primary rounded-2xl text-xs font-black flex items-center justify-center gap-2 text-white shadow-md cursor-pointer"
              >
                <Camera className="w-4 h-4 text-amber-300" />
                <span>ডিভাইস থেকে নতুন ছবি আপলোড করুন</span>
              </button>
              <p className="text-[10px] text-slate-500 text-center mt-1.5">
                PNG, JPG বা WEBP (সর্বোচ্চ ৩ মেগাবাইট)
              </p>
            </div>

            {/* Preset Avatars Selection */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                অথবা পছন্দের অ্যাভাটার নির্বাচন করুন:
              </label>
              <div className="grid grid-cols-3 gap-3">
                {presetAvatars.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      updateUserProfile({ avatar: url });
                      setIsAvatarPickerOpen(false);
                      showToast('প্রোফাইল অ্যাভাটার আপডেট হয়েছে');
                    }}
                    className={`p-1 rounded-2xl neu-btn transition-transform hover:scale-105 ${
                      userProfile.avatar === url ? 'ring-2 ring-emerald-600' : ''
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Avatar ${idx + 1}`}
                      className="w-full h-16 rounded-xl object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsAvatarPickerOpen(false)}
                className="px-4 py-2 rounded-xl neu-btn text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✏️ EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="w-full max-w-lg bg-[#e9edf5] dark:bg-[#0f172a] rounded-3xl p-6 neu-card space-y-4 border border-white/60 dark:border-slate-700 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-700" />
                শিক্ষার্থী প্রোফাইল তথ্য এডিট
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-7 h-7 rounded-full neu-btn flex items-center justify-center text-slate-500 font-bold hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1 font-bold">পূর্ণ নাম:</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs neu-inset rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1 font-bold">মোবাইল নম্বর:</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs neu-inset rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1 font-bold">ইমেইল অ্যাড্রেস:</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs neu-inset rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1 font-bold">রোল / রেজিস্ট্রেশন নং:</label>
                  <input
                    type="text"
                    value={editRollNo}
                    onChange={(e) => setEditRollNo(e.target.value)}
                    className="w-full px-3 py-2 text-xs neu-inset rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1 font-bold">মাদ্রাসা / বিশ্ববিদ্যালয় / প্রতিষ্ঠান:</label>
                <input
                  type="text"
                  value={editInstitution}
                  onChange={(e) => setEditInstitution(e.target.value)}
                  className="w-full px-3 py-2 text-xs neu-inset rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1 font-bold">টার্গেট পদবী / পরীক্ষা:</label>
                  <input
                    type="text"
                    value={editTargetExam}
                    onChange={(e) => setEditTargetExam(e.target.value)}
                    className="w-full px-3 py-2 text-xs neu-inset rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1 font-bold">নিজ জেলা / বিভাগ:</label>
                  <input
                    type="text"
                    value={editDistrict}
                    onChange={(e) => setEditDistrict(e.target.value)}
                    className="w-full px-3 py-2 text-xs neu-inset rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 dark:text-slate-400 block mb-1 font-bold">স্টাডি মোটো / বায়ো:</label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="আপনার পরীক্ষার লক্ষ্য বা প্রিয় উক্তি লিখুন..."
                  className="w-full px-3 py-2 text-xs neu-inset rounded-xl text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl neu-btn text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 neu-btn-primary rounded-xl text-xs font-black text-white shadow-md cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
