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
  totalExams: number;
  duration: string;
  startDate: string;
  instructors: Instructor[];
  description: string;
  features: string[];
  syllabus: SyllabusTopic[];
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

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  rollNo: string;
  institution: string;
  targetExam: string;
  avatar: string;
}
