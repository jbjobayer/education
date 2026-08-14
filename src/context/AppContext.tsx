import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, CourseCategory, Exam, ExamResult, MainTab, Notice, RoutineItem, UserProfile } from '../types';
import { mockCourses, mockExams, mockNotices, mockRoutines } from '../data/mockData';

interface AppContextType {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  selectedCategory: CourseCategory;
  setSelectedCategory: (cat: CourseCategory) => void;
  courses: Course[];
  exams: Exam[];
  notices: Notice[];
  routines: RoutineItem[];
  enrolledCourseIds: string[];
  enrollInCourse: (courseId: string, paymentMethod?: string) => void;
  selectedCourseDetails: Course | null;
  setSelectedCourseDetails: (course: Course | null) => void;
  checkoutCourse: Course | null;
  setCheckoutCourse: (course: Course | null) => void;
  activeExam: Exam | null;
  startExam: (exam: Exam) => void;
  closeExam: () => void;
  saveExamResult: (result: ExamResult) => void;
  examResults: ExamResult[];
  bookmarks: string[];
  toggleBookmark: (questionId: string) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  subscribeToPackage: (planId: 'monthly' | 'quarterly' | 'half_yearly' | 'yearly', planName: string, durationMonths: number) => void;
  isPremiumMember: boolean;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  isRoutineOpen: boolean;
  setIsRoutineOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  toastMessage: { text: string; type: string } | null;
  viewingResult: ExamResult | null;
  setViewingResult: (res: ExamResult | null) => void;
  resultSubTab: 'explanation' | 'leaderboard';
  setResultSubTab: (tab: 'explanation' | 'leaderboard') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory>('all');
  const [courses] = useState<Course[]>(mockCourses);
  const [exams] = useState<Exam[]>(mockExams);
  const [notices] = useState<Notice[]>(mockNotices);
  const [routines] = useState<RoutineItem[]>(mockRoutines);
  
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('tamreen_enrolled');
    return saved ? JSON.parse(saved) : ['course-1'];
  });

  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [examResults, setExamResults] = useState<ExamResult[]>(() => {
    const saved = localStorage.getItem('tamreen_results');
    return saved ? JSON.parse(saved) : [];
  });
  const [viewingResult, setViewingResult] = useState<ExamResult | null>(null);
  const [resultSubTab, setResultSubTab] = useState<'explanation' | 'leaderboard'>('explanation');

  const handleSetActiveTab = (tab: MainTab) => {
    setViewingResult(null);
    setActiveTab(tab);
  };

  const [selectedCourseDetails, setSelectedCourseDetails] = useState<Course | null>(null);
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isRoutineOpen, setIsRoutineOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('tamreen_bookmarks');
    return saved ? JSON.parse(saved) : ['q1', 'q4'];
  });

  const [toastMessage, setToastMessage] = useState<{ text: string; type: string } | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('tamreen_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user profile:', e);
      }
    }
    return {
      name: 'মুহাম্মদ আব্দুল্লাহ আল-মামুন',
      phone: '০১৭৭২-৮৯৫৪০১',
      email: 'abdullah.madrasah@gmail.com',
      rollNo: 'NTRCA-2026-9814',
      institution: 'সরকারি মাদ্রাসা-ই-আলিয়া, ঢাকা',
      targetExam: '১৯তম শিক্ষক নিবন্ধন (প্রভাষক আরবি ও সহকারী মৌলভী)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      bio: 'পরিশ্রম ও নিয়মানুবর্তিতার মাধ্যমে ১৯তম শিক্ষক নিবন্ধনে প্রথম সারিতে উত্তীর্ণ হওয়াই মূল লক্ষ্য। ইনশাআল্লাহ!',
      district: 'ঢাকা',
      batchTag: 'স্পেশাল গোল্ডেন ব্যাচ ২০২৬',
      joinDate: 'জানুয়ারি ২০২৬',
      dailyGoalQuestions: 30,
      soundEnabled: true,
      hapticEnabled: true,
      smsAlerts: true,
      studyStreakDays: 7,
      totalPoints: 1450,
    };
  });

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const enrollInCourse = (courseId: string, paymentMethod?: string) => {
    if (!enrolledCourseIds.includes(courseId)) {
      const updated = [...enrolledCourseIds, courseId];
      setEnrolledCourseIds(updated);
      localStorage.setItem('tamreen_enrolled', JSON.stringify(updated));
      showToast(`অভিনন্দন! ${paymentMethod ? `${paymentMethod} পেমেন্টের মাধ্যমে ` : ''}কোর্সটিতে সফলভাবে ভর্তি সম্পন্ন হয়েছে।`);
    } else {
      showToast('আপনি ইতোমধ্যে এই কোর্সে ভর্তি আছেন', 'info');
    }
  };

  const startExam = (exam: Exam) => {
    setActiveExam(exam);
  };

  const closeExam = () => {
    setActiveExam(null);
  };

  const saveExamResult = (result: ExamResult) => {
    const newResults = [result, ...examResults];
    setExamResults(newResults);
    localStorage.setItem('tamreen_results', JSON.stringify(newResults));
    setViewingResult(result);
    showToast('পরীক্ষা সফলভাবে সম্পন্ন হয়েছে!', 'success');
  };

  const toggleBookmark = (questionId: string) => {
    setBookmarks((prev) => {
      const exists = prev.includes(questionId);
      const updated = exists
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId];
      localStorage.setItem('tamreen_bookmarks', JSON.stringify(updated));
      showToast(exists ? 'বুকমার্ক সরানো হয়েছে' : 'প্রশ্নটি বুকমার্ক করা হয়েছে', 'info');
      return updated;
    });
  };

  const updateUserProfile = (profileUpdate: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...profileUpdate };
      localStorage.setItem('tamreen_user_profile', JSON.stringify(updated));
      return updated;
    });
    showToast('প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে');
  };

  const subscribeToPackage = (planId: 'monthly' | 'quarterly' | 'half_yearly' | 'yearly', planName: string, durationMonths: number) => {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + durationMonths);
    const expiryDateStr = expiryDate.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const updatedProfile: UserProfile = {
      ...userProfile,
      isPremium: true,
      subscriptionPlanId: planId,
      subscriptionPlanName: planName,
      subscriptionExpiryDate: expiryDateStr
    };

    setUserProfile(updatedProfile);
    localStorage.setItem('tamreen_user_profile', JSON.stringify(updatedProfile));
    showToast(`অভিনন্দন! আপনার ${planName} সাবস্ক্রিপশন সফলভাবে সক্রিয় হয়েছে।`, 'success');
  };

  const isPremiumMember = Boolean(userProfile.isPremium || userProfile.subscriptionPlanId);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab: handleSetActiveTab,
        selectedCategory,
        setSelectedCategory,
        courses,
        exams,
        notices,
        routines,
        enrolledCourseIds,
        enrollInCourse,
        selectedCourseDetails,
        setSelectedCourseDetails,
        checkoutCourse,
        setCheckoutCourse,
        activeExam,
        startExam,
        closeExam,
        saveExamResult,
        examResults,
        bookmarks,
        toggleBookmark,
        userProfile,
        updateUserProfile,
        subscribeToPackage,
        isPremiumMember,
        isNotificationOpen,
        setIsNotificationOpen,
        isRoutineOpen,
        setIsRoutineOpen,
        searchQuery,
        setSearchQuery,
        showToast,
        toastMessage,
        viewingResult,
        setViewingResult,
        resultSubTab,
        setResultSubTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
