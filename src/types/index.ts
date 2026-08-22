export type MainTab = 'home' | 'courses' | 'exams' | 'ai' | 'profile' | 'circular' | 'subject_wise';

export interface JobCircular {
  id: string;
  title: string;
  organization: string;
  category: 'ntrca' | 'madrasah' | 'primary' | 'other';
  tag: string;
  vacancies: string;
  deadline: string;
  publishDate: string;
  isHot?: boolean;
  salaryScale?: string;
  educationalReq?: string;
  ageLimit?: string;
  applyLink?: string;
  description?: string;
  pdfUrl?: string;
}

export type CourseCategory = 
  | 'all'
  | 'madrasah_ntrca' 
  | 'general_ntrca' 
  | 'arabic_language' 
  | 'subject_wise'
  | 'special_batch';

export interface CourseLectureSheet {
  id: string;
  title: string;
  subtitle: string; // e.g. 'PDF Sheet 01'
  fileSize?: string;
  pagesCount?: number;
  downloadUrl?: string;
  isFree?: boolean;
}

export interface CourseExamItem {
  id: string;
  examNumber: string; // e.g. 'পরীক্ষা ০১'
  title: string;
  topic: string;
  dateStr: string; // e.g. '১৫ আগস্ট, ২০২৬ (শনিবার)'
  questionCount: number;
  durationMinutes: number;
  isLocked?: boolean;
  examRefId?: string;
  courseId?: string;
  subject?: string;
  totalMarks?: number;
  negativeMarking?: number;
  status?: 'upcoming' | 'running' | 'completed';
  questions?: Question[];
}

export interface CourseOverviewSection {
  title: string;
  items: string[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  category: CourseCategory;
  coverImage: string;
  price: number;
  originalPrice: number;
  badge?: string;
  batchType?: string; // e.g. 'রেকর্ড ব্যাচ', 'ফ্রি এক্সাম ব্যাচ', 'লাইভ ব্যাচ'
  shortTag?: string; // e.g. 'সহকারী মৌলভী...', 'আরবি প্রভাষক...'
  rating: number;
  totalStudents: number;
  totalClasses: number;
  totalSheets?: number;
  totalFullModels?: number | string;
  totalExams: number;
  duration: string;
  startDate: string;
  instructors: Instructor[];
  description: string;
  detailedOverview?: string;
  overviewSections?: CourseOverviewSection[];
  features: string[];
  syllabus: SyllabusTopic[];
  sheets?: CourseLectureSheet[];
  courseExams?: CourseExamItem[];
  isEnrolled?: boolean;
}

export interface Instructor {
  id: string;
  name: string;
  designation: string;
  institution: string;
  image: string;
  experience: string;
}

export interface SyllabusTopic {
  title: string;
  classesCount: number;
  items: string[];
}

export interface Question {
  id: string;
  question: string;
  arabicQuestion?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subject: string;
  language?: 'ar' | 'bn' | 'en' | 'mixed';
  optionLabels?: string[];
}

export interface Exam {
  id: string;
  title: string;
  category: 'live' | 'model_test' | 'previous_year' | 'subject' | 'free' | 'daily';
  subject: string;
  totalMarks: number;
  durationMinutes: number;
  negativeMarking: number;
  totalQuestions: number;
  startTime?: string;
  endTime?: string;
  questions: Question[];
  status: 'upcoming' | 'running' | 'completed';
  participantsCount: number;
  dateStr?: string;
  isFree?: boolean;
  examType?: 'course_exam' | 'free_exam';
  courseId?: string;
  course_id?: string;
  authorName?: string;
  institution?: string;
  shareUrl?: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  date: string;
  score: number;
  totalMarks: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  timeSpentSeconds: number;
  userAnswers: Record<string, number>; // questionId -> optionIndex
  rank?: number;
  totalParticipants?: number;
  examType?: 'course_exam' | 'free_exam';
  courseId?: string;
  participantName?: string;
  participantInstitution?: string;
  participantPhone?: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  institution?: string;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  totalMarks: number;
  timeSpentSeconds: number;
  isCurrentUser?: boolean;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  tag: 'জরুরি' | 'পরীক্ষা' | 'ভর্তি' | 'ক্লাস';
  content: string;
  isImportant?: boolean;
}

export interface RoutineItem {
  id: string;
  day: string;
  time: string;
  subject: string;
  topic: string;
  instructor: string;
  batchName: string;
  liveLink?: string;
  status: 'live' | 'upcoming' | 'completed';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export type SubscriptionPlanId = 'monthly' | 'quarterly' | 'half_yearly' | 'yearly';

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  nameEn: string;
  durationMonths: number;
  durationLabel: string;
  price: number;
  originalPrice: number;
  badge?: string;
  isPopular?: boolean;
  savings?: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  phone: string;
  email: string;
  loginIdentifier?: string;
  loginType?: 'email' | 'phone';
  rollNo: string;
  institution: string;
  targetExam: string;
  avatar: string;
  bio?: string;
  district?: string;
  batchTag?: string;
  joinDate?: string;
  dailyGoalQuestions?: number;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
  smsAlerts?: boolean;
  studyStreakDays?: number;
  totalPoints?: number;
  isPremium?: boolean;
  subscriptionPlanId?: SubscriptionPlanId;
  subscriptionPlanName?: string;
  subscriptionExpiryDate?: string;
}

export type EnrollmentStatus = 'pending' | 'approved' | 'rejected';

export interface CourseEnrollment {
  id?: string;
  userId: string;
  courseId: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  paymentNumber?: string;
  status: EnrollmentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseTab {
  id: string;
  courseId: string;
  title: string;
  tabKey: string;
  orderIndex: number;
  isActive?: boolean;
  content?: string;
}

export interface CourseRoutine {
  id: string;
  courseId: string;
  day: string;
  time: string;
  subject: string;
  topic: string;
  instructor: string;
  batchName: string;
  liveLink?: string;
  status: 'live' | 'upcoming' | 'completed';
}

export interface CourseSyllabusModule {
  id: string;
  courseId: string;
  title: string;
  moduleOrder: number;
  classesCount?: number;
  items?: CourseSyllabusItem[];
}

export interface CourseSyllabusItem {
  id: string;
  moduleId: string;
  title: string;
  itemOrder: number;
}

export interface CourseMaterial {
  id: string;
  courseId: string;
  title: string;
  subtitle?: string;
  fileSize?: string;
  pagesCount?: number;
  downloadUrl?: string;
  isFree?: boolean;
  materialType?: string;
}
