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
  startExam: (exam: Exam, participant?: { name?: string; institution?: string; phone?: string }) => void;
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
  landingExam: Exam | null;
  setLandingExam: (exam: Exam | null) => void;
  openExamLanding: (examOrId: Exam | string) => Promise<void>;
  shareExam: (exam: Exam) => void;
  participantInfo: { name: string; institution: string; phone: string };
  setParticipantInfo: (info: { name: string; institution: string; phone: string }) => void;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  login: (identifier: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, identifier: string, password: string, institution?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
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

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tamreen_is_logged_in') === 'true';
    }
    return false;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };
  
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

  const [landingExam, setLandingExam] = useState<Exam | null>(null);
  const [participantInfo, setParticipantInfo] = useState<{ name: string; institution: string; phone: string }>(() => {
    return {
      name: localStorage.getItem('tamreen_guest_name') || '',
      institution: localStorage.getItem('tamreen_guest_institution') || '',
      phone: localStorage.getItem('tamreen_guest_phone') || ''
    };
  });

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

  const openExamLanding = async (examOrId: Exam | string) => {
    if (typeof examOrId === 'object' && examOrId !== null) {
      setLandingExam(examOrId);
      setActiveTab('exams');
      if (window.history.pushState) {
        const newUrl = `${window.location.pathname}?exam=${examOrId.id}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
      }
      return;
    }

    const examId = String(examOrId);
    // First search in local exams
    const localExam = exams.find((e) => e.id === examId);
    if (localExam) {
      setLandingExam(localExam);
      setActiveTab('exams');
      return;
    }

    // Fetch from Supabase
    setIsLoadingData(true);
    try {
      const fetched = await supabaseService.getExamById(examId);
      if (fetched) {
        setLandingExam(fetched);
        setActiveTab('exams');
      } else {
        showToast('দুঃখিত, পরীক্ষাটি খুঁজে পাওয়া যায়নি', 'error');
      }
    } catch {
      showToast('পরীক্ষা লোড করতে সমস্যা হয়েছে', 'error');
    } finally {
      setIsLoadingData(false);
    }
  };

  const shareExam = (exam: Exam) => {
    const origin = window.location.origin || '';
    const pathname = window.location.pathname || '/';
    const shareUrl = `${origin}${pathname}?exam=${exam.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${exam.title} - আত-তামরীন একাডেমি`,
        text: `আত-তামরীন একাডেমিতে '${exam.title}' ওএমআর পরীক্ষায় অংশ নিয়ে আপনার প্রস্তুতি যাচাই করুন!`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareUrl);
      showToast(`'${exam.title}' পরীক্ষার সরাসরি লিংক কপি করা হয়েছে!`, 'success');
    }
  };

  // Check URL deep links on mount and popstate (e.g. ?exam=123 or ?free_exam=123)
  useEffect(() => {
    const checkUrlParams = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const examId = params.get('exam') || params.get('free_exam') || params.get('model_test') || params.get('examId');
        if (examId) {
          openExamLanding(examId);
        }
      } catch (e) {
        console.warn('Failed to parse URL query:', e);
      }
    };

    checkUrlParams();
    window.addEventListener('popstate', checkUrlParams);
    return () => window.removeEventListener('popstate', checkUrlParams);
  }, []);

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
        .on('postgres_changes', { event: '*', schema: 'public', table: 'course_exams' }, () => {
          refreshFromDatabase();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'free_exams' }, () => {
          refreshFromDatabase();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'questions' }, () => {
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
        .on('postgres_changes', { event: '*', schema: 'public', table: 'exam_results' }, () => {
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

  const login = async (identifier: string, pass: string): Promise<{ success: boolean; message: string }> => {
    const res = await supabaseService.loginUser({ identifier, password: pass });
    if (res.success && res.user) {
      setIsLoggedIn(true);
      setUserProfile(res.user);
      localStorage.setItem('tamreen_is_logged_in', 'true');
      localStorage.setItem('tamreen_user_profile', JSON.stringify(res.user));
    }
    return { success: res.success, message: res.message };
  };

  const register = async (name: string, identifier: string, pass: string, inst?: string): Promise<{ success: boolean; message: string }> => {
    const res = await supabaseService.registerUser({ name, identifier, password: pass, institution: inst });
    if (res.success && res.user) {
      setIsLoggedIn(true);
      setUserProfile(res.user);
      localStorage.setItem('tamreen_is_logged_in', 'true');
      localStorage.setItem('tamreen_user_profile', JSON.stringify(res.user));
    }
    return { success: res.success, message: res.message };
  };

  const logout = async () => {
    await supabaseService.logoutUser();
    setIsLoggedIn(false);
    localStorage.removeItem('tamreen_is_logged_in');
    showToast('সফলভাবে লগআউট সম্পন্ন হয়েছে', 'info');
  };

  const startExam = (exam: Exam, participant?: { name?: string; institution?: string; phone?: string }) => {
    const activeName = (isLoggedIn && userProfile.name) ? userProfile.name : (participant?.name || participantInfo.name || 'শিক্ষার্থী');
    const activeInstitution = (isLoggedIn && userProfile.institution) ? userProfile.institution : (participant?.institution || participantInfo.institution || '');
    const activePhone = (isLoggedIn && userProfile.phone) ? userProfile.phone : (participant?.phone || participantInfo.phone || '');

    setParticipantInfo({
      name: activeName,
      institution: activeInstitution,
      phone: activePhone
    });
    setActiveExam(exam);
  };

  const closeExam = () => {
    setActiveExam(null);
  };

  const saveExamResult = async (result: ExamResult) => {
    const finalParticipantName = (isLoggedIn && userProfile.name) ? userProfile.name : (result.participantName || participantInfo.name || 'শিক্ষার্থী');
    const finalParticipantInstitution = (isLoggedIn && userProfile.institution) ? userProfile.institution : (result.participantInstitution || participantInfo.institution || '');
    const finalParticipantPhone = (isLoggedIn && userProfile.phone) ? userProfile.phone : (result.participantPhone || participantInfo.phone || '');

    const enrichedResult: ExamResult = {
      ...result,
      participantName: finalParticipantName,
      participantInstitution: finalParticipantInstitution,
      participantPhone: finalParticipantPhone
    };

    const newResults = [enrichedResult, ...examResults];
    setExamResults(newResults);
    localStorage.setItem('tamreen_results', JSON.stringify(newResults));
    setViewingResult(enrichedResult);
    showToast('পরীক্ষা সফলভাবে সম্পন্ন হয়েছে!', 'success');

    // Submit to Supabase with custom participant details
    try {
      const userId = await getCurrentUserId();
      await supabaseService.submitExamResult({
        userId,
        examId: enrichedResult.examId,
        courseId: enrichedResult.courseId,
        examTitle: enrichedResult.examTitle,
        score: enrichedResult.score,
        totalMarks: enrichedResult.totalMarks,
        correctAnswers: enrichedResult.correctAnswers,
        wrongAnswers: enrichedResult.wrongAnswers,
        skippedAnswers: enrichedResult.skippedAnswers,
        timeSpentSeconds: enrichedResult.timeSpentSeconds,
        userAnswers: enrichedResult.userAnswers,
        userName: finalParticipantName,
        institution: finalParticipantInstitution,
        phone: finalParticipantPhone
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

  // Initial auth sync with Supabase
  useEffect(() => {
    const syncAuth = async () => {
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data?.session?.user) {
            setIsLoggedIn(true);
            localStorage.setItem('tamreen_is_logged_in', 'true');
            const p = await supabaseService.getProfile(data.session.user.id);
            if (p) {
              setUserProfile(p);
              localStorage.setItem('tamreen_user_profile', JSON.stringify(p));
            }
          }
        } catch {}
      }
    };
    syncAuth();
  }, [isSupabaseConnected]);

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
        landingExam,
        setLandingExam,
        openExamLanding,
        shareExam,
        participantInfo,
        setParticipantInfo,
        isLoggedIn,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        login,
        register,
        logout,
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
