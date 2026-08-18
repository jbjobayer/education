import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Course, 
  CourseCategory, 
  Exam, 
  ExamResult, 
  MainTab, 
  Notice, 
  RoutineItem, 
  UserProfile, 
  EnrollmentStatus,
  CourseEnrollment 
} from '../types';
import { mockCourses, mockNotices, mockRoutines } from '../data/mockData';
import { supabaseService, getCurrentUserId } from '../services/supabaseService';
import { isSupabaseConfigured, testSupabaseConnection, getSupabase } from '../lib/supabase';

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
  pendingEnrollmentIds: string[];
  userEnrollments: Record<string, EnrollmentStatus>;
  enrollInCourse: (courseId: string, paymentMethod?: string, trxId?: string, amount?: number) => Promise<void>;
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
  subscribeToPackage: (planId: 'monthly' | 'quarterly' | 'half_yearly' | 'yearly', planName: string, durationMonths: number, paymentDetails?: { gateway: 'bkash' | 'nagad' | 'rocket'; trxId: string; phone: string }) => void;
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
  isSupabaseConnected: boolean;
  refreshFromDatabase: () => Promise<void>;
  isLoadingData: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory>('all');
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [exams, setExams] = useState<Exam[]>([]);
  const [notices, setNotices] = useState<Notice[]>(mockNotices);
  const [routines, setRoutines] = useState<RoutineItem[]>(mockRoutines);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(isSupabaseConfigured());
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  
  // Track user enrollments dictionary: { [courseId]: 'pending' | 'approved' | 'rejected' }
  const [userEnrollments, setUserEnrollments] = useState<Record<string, EnrollmentStatus>>(() => {
    const saved = localStorage.getItem('tamreen_user_enrollments');
    return saved ? JSON.parse(saved) : {};
  });

  const enrolledCourseIds = Object.keys(userEnrollments).filter(
    (id) => userEnrollments[id] === 'approved'
  );

  const pendingEnrollmentIds = Object.keys(userEnrollments).filter(
    (id) => userEnrollments[id] === 'pending'
  );

  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [examResults, setExamResults] = useState<ExamResult[]>(() => {
    const saved = localStorage.getItem('tamreen_results');
    return saved ? JSON.parse(saved) : [];
  });
  const [viewingResult, setViewingResult] = useState<ExamResult | null>(null);
  const [resultSubTab, setResultSubTab] = useState<'explanation' | 'leaderboard'>('explanation');

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

  const refreshFromDatabase = async () => {
    setIsLoadingData(true);
    try {
      const userId = await getCurrentUserId();
      const [remoteExams, remoteCourses, remoteNotices, remoteEnrollments, remoteProfile, remoteResults, remoteRoutines] = await Promise.all([
        supabaseService.getExams(),
        supabaseService.getCourses(),
        supabaseService.getNotices(),
        supabaseService.getUserEnrollments(userId),
        supabaseService.getProfile(userId),
        supabaseService.getExamResults(userId),
        supabaseService.getCourseRoutines()
      ]);

      setExams(remoteExams);
      if (remoteCourses && remoteCourses.length > 0) {
        setCourses(remoteCourses);
      }
      if (remoteNotices && remoteNotices.length > 0) {
        setNotices(remoteNotices);
      }
      if (remoteRoutines && remoteRoutines.length > 0) {
        setRoutines(remoteRoutines);
      }

      if (remoteEnrollments && remoteEnrollments.length > 0) {
        const enrollMap: Record<string, EnrollmentStatus> = {};
        remoteEnrollments.forEach((e: CourseEnrollment) => {
          enrollMap[e.courseId] = e.status;
        });
        setUserEnrollments((prev) => {
          const merged = { ...prev, ...enrollMap };
          localStorage.setItem('tamreen_user_enrollments', JSON.stringify(merged));
          return merged;
        });
      }

      if (remoteProfile) {
        setUserProfile((prev) => {
          const merged = { ...prev, ...remoteProfile };
          localStorage.setItem('tamreen_user_profile', JSON.stringify(merged));
          return merged;
        });
      }

      if (remoteResults && remoteResults.length > 0) {
        setExamResults(remoteResults);
        localStorage.setItem('tamreen_results', JSON.stringify(remoteResults));
      }

      const connCheck = await testSupabaseConnection();
      setIsSupabaseConnected(connCheck.success);
    } catch (err) {
      console.warn('Error refreshing data from database:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Load from Supabase on mount & listen to real-time changes
  useEffect(() => {
    refreshFromDatabase();

    const client = getSupabase();
    if (client) {
      const channel = client
        .channel('public:db-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'exams' }, () => {
          refreshFromDatabase();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, () => {
          refreshFromDatabase();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'course_routines' }, () => {
          refreshFromDatabase();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'course_enrollments' }, () => {
          refreshFromDatabase();
        })
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    }
  }, [isSupabaseConnected]);

  const handleSetActiveTab = (tab: MainTab) => {
    setViewingResult(null);
    setSelectedCourseDetails(null);
    setCheckoutCourse(null);
    setIsNotificationOpen(false);
    setIsRoutineOpen(false);
    setActiveTab(tab);
  };

  const enrollInCourse = async (
    courseId: string, 
    paymentMethod: string = 'bKash', 
    trxId: string = `TRX${Date.now().toString().slice(-6)}`,
    amount: number = 0
  ) => {
    const currentStatus = userEnrollments[courseId];
    if (currentStatus === 'approved') {
      showToast('আপনি ইতোমধ্যে এই কোর্সে ভর্তি আছেন', 'info');
      return;
    }
    if (currentStatus === 'pending') {
      showToast('আপনার আবেদনটি ইতোমধ্যে যাচাইাধীন রয়েছে। শীঘ্রই সক্রিয় হবে।', 'info');
      return;
    }

    try {
      const userId = await getCurrentUserId();
      const res = await supabaseService.submitCourseEnrollment({
        userId,
        courseId,
        amount,
        paymentMethod,
        transactionId: trxId,
        paymentNumber: userProfile.phone
      });

      const updatedEnrollments = {
        ...userEnrollments,
        [courseId]: 'pending' as EnrollmentStatus
      };
      setUserEnrollments(updatedEnrollments);
      localStorage.setItem('tamreen_user_enrollments', JSON.stringify(updatedEnrollments));

      showToast(res.message || 'আপনার ভর্তি আবেদন সফলভাবে জমা হয়েছে। Admin অনুমোদনের পর কোর্সটি চালু হবে।', 'success');
    } catch {
      const updatedEnrollments = {
        ...userEnrollments,
        [courseId]: 'pending' as EnrollmentStatus
      };
      setUserEnrollments(updatedEnrollments);
      localStorage.setItem('tamreen_user_enrollments', JSON.stringify(updatedEnrollments));
      showToast('আপনার ভর্তি আবেদন সফলভাবে জমা হয়েছে। Admin অনুমোদনের পর কোর্সটি চালু হবে।', 'success');
    }
  };

  const startExam = (exam: Exam) => {
    setActiveExam(exam);
  };

  const closeExam = () => {
    setActiveExam(null);
  };

  const saveExamResult = async (result: ExamResult) => {
    const newResults = [result, ...examResults];
    setExamResults(newResults);
    localStorage.setItem('tamreen_results', JSON.stringify(newResults));
    setViewingResult(result);
    showToast('পরীক্ষা সফলভাবে সম্পন্ন হয়েছে!', 'success');

    // Submit to Supabase
    try {
      const userId = await getCurrentUserId();
      await supabaseService.submitExamResult({
        userId,
        examId: result.examId,
        examTitle: result.examTitle,
        score: result.score,
        totalMarks: result.totalMarks,
        correctAnswers: result.correctAnswers,
        wrongAnswers: result.wrongAnswers,
        skippedAnswers: result.skippedAnswers,
        timeSpentSeconds: result.timeSpentSeconds,
        userAnswers: result.userAnswers
      });
    } catch {
      // Background submit
    }
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

  const updateUserProfile = async (profileUpdate: Partial<UserProfile>) => {
    const updated = { ...userProfile, ...profileUpdate };
    setUserProfile(updated);
    localStorage.setItem('tamreen_user_profile', JSON.stringify(updated));
    showToast('প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে');

    try {
      const userId = await getCurrentUserId();
      await supabaseService.updateProfile(userId, profileUpdate);
    } catch {
      // Local state is already updated
    }
  };

  const subscribeToPackage = (
    planId: 'monthly' | 'quarterly' | 'half_yearly' | 'yearly', 
    planName: string, 
    durationMonths: number,
    paymentDetails?: { gateway: 'bkash' | 'nagad' | 'rocket'; trxId: string; phone: string }
  ) => {
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
        pendingEnrollmentIds,
        userEnrollments,
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
        isSupabaseConnected,
        refreshFromDatabase,
        isLoadingData,
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
