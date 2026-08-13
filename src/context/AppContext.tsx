import React, { createContext, useContext, useState, useEffect } from 'react';
import { MainTab, CourseCategory, Course, Exam, ExamResult, Notice, RoutineItem } from '../types';
import { mockCourses, mockExams, mockNotices, mockRoutines } from '../data/mockData';

interface UserProfile {
  name: string;
  phone: string;
  email: string;
  rollNo: string;
  institution: string;
  targetExam: string;
  avatar: string;
}

interface AppContextType {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  selectedCategory: CourseCategory;
  setSelectedCategory: (cat: CourseCategory) => void;
  courses: Course[];
  enrolledCourseIds: string[];
  enrollInCourse: (courseId: string, paymentMethod?: string) => void;
  activeExam: Exam | null;
  startExam: (exam: Exam) => void;
  closeExam: () => void;
  examResults: ExamResult[];
  saveExamResult: (result: ExamResult) => void;
  selectedCourseDetails: Course | null;
  setSelectedCourseDetails: (course: Course | null) => void;
  checkoutCourse: Course | null;
  setCheckoutCourse: (course: Course | null) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  isRoutineOpen: boolean;
  setIsRoutineOpen: (open: boolean) => void;
  notices: Notice[];
  routines: RoutineItem[];
  bookmarks: string[];
  toggleBookmark: (questionId: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  toastMessage: { text: string; type: string } | null;
  viewingResult: ExamResult | null;
  setViewingResult: (res: ExamResult | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory>('all');
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('tamreen_enrolled_courses');
    return saved ? JSON.parse(saved) : ['course-1'];
  });
  
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [examResults, setExamResults] = useState<ExamResult[]>(() => {
    const saved = localStorage.getItem('tamreen_exam_results');
    return saved ? JSON.parse(saved) : [];
  });
  const [viewingResult, setViewingResult] = useState<ExamResult | null>(null);

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

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'মুহাম্মদ আব্দুল্লাহ আল-মামুন',
    phone: '০১৭৭২-৮৯৫৪০১',
    email: 'abdullah.madrasah@gmail.com',
    rollNo: 'NTRCA-2026-9814',
    institution: 'সরকারি মাদ্রাসা-ই-আলিয়া, ঢাকা',
    targetExam: '১৯তম শিক্ষক নিবন্ধন (প্রভাষক আরবি ও সহকারী মৌলভী)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  });

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const enrollInCourse = (courseId: string, paymentMethod: string = 'bKash') => {
    if (!enrolledCourseIds.includes(courseId)) {
      const updated = [...enrolledCourseIds, courseId];
      setEnrolledCourseIds(updated);
      localStorage.setItem('tamreen_enrolled_courses', JSON.stringify(updated));
      showToast(`অভিনন্দন! ${paymentMethod} এর মাধ্যমে কোর্সে সফলভাবে ভর্তি সম্পন্ন হয়েছে।`, 'success');
    }
  };

  const startExam = (exam: Exam) => {
    setActiveExam(exam);
  };

  const closeExam = () => {
    setActiveExam(null);
  };

  const saveExamResult = (result: ExamResult) => {
    const updated = [result, ...examResults.filter(r => r.examId !== result.examId)];
    setExamResults(updated);
    localStorage.setItem('tamreen_exam_results', JSON.stringify(updated));
    setViewingResult(result);
    showToast('পরীক্ষা সফলভাবে জমা হয়েছে এবং ফলাফল প্রস্তুত!', 'success');
  };

  const toggleBookmark = (questionId: string) => {
    const updated = bookmarks.includes(questionId)
      ? bookmarks.filter(id => id !== questionId)
      : [...bookmarks, questionId];
    setBookmarks(updated);
    localStorage.setItem('tamreen_bookmarks', JSON.stringify(updated));
    showToast(
      bookmarks.includes(questionId) ? 'বুকমার্ক থেকে সরানো হয়েছে' : 'প্রশ্নটি রিভিউ সেকশনে সেভ করা হয়েছে',
      'info'
    );
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
    showToast('প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        courses,
        enrolledCourseIds,
        enrollInCourse,
        activeExam,
        startExam,
        closeExam,
        examResults,
        saveExamResult,
        selectedCourseDetails,
        setSelectedCourseDetails,
        checkoutCourse,
        setCheckoutCourse,
        isNotificationOpen,
        setIsNotificationOpen,
        isRoutineOpen,
        setIsRoutineOpen,
        notices: mockNotices,
        routines: mockRoutines,
        bookmarks,
        toggleBookmark,
        searchQuery,
        setSearchQuery,
        userProfile,
        updateUserProfile,
        showToast,
        toastMessage,
        viewingResult,
        setViewingResult,
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
