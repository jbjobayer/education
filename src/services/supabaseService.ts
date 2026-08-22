import { getSupabase } from '../lib/supabase';
import { 
  Course, 
  Exam, 
  Notice, 
  Question, 
  ExamResult, 
  UserProfile, 
  CourseEnrollment,
  CourseTab,
  RoutineItem,
  CourseLectureSheet,
  CourseExamItem,
  SyllabusTopic,
  LeaderboardEntry,
  EnrollmentStatus
} from '../types';

/**
 * Helper to get or maintain current user UUID
 */
export const getCurrentUserId = async (): Promise<string> => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.id) {
        return data.user.id;
      }
    } catch {
      // Fallback
    }
  }

  if (typeof window !== 'undefined') {
    let localId = localStorage.getItem('tamreen_auth_uid');
    if (!localId) {
      localId = `usr_${Math.random().toString(36).substring(2, 12)}`;
      localStorage.setItem('tamreen_auth_uid', localId);
    }
    return localId;
  }
  return 'usr_guest';
};

/**
 * Map database question row to unified UI Question interface
 * Supports all common admin/Supabase schemas and column naming conventions.
 */
const mapQuestionRow = (item: any): Question => {
  if (!item) {
    return {
      id: `q_${Math.random()}`,
      question: '',
      options: ['ক', 'খ', 'গ', 'ঘ'],
      correctIndex: 0,
      explanation: '',
      subject: ''
    };
  }

  // 1. Question text & Arabic text
  let questionText = item.question_text || item.question || item.title || item.text || item.question_bn || item.question_title || item.body || item.prompt || '';
  let arabicQuestion = item.arabic_question || item.arabic_text || item.arabicQuestion || item.arabicText || undefined;

  // If questionText is in Arabic and no arabicQuestion is set, set arabicQuestion
  if (!arabicQuestion && /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(questionText)) {
    // If text has arabic, arabicQuestion will be handled by questionUtils parser
  }

  // 2. Extract options
  let options: string[] = [];
  if (Array.isArray(item.options)) {
    options = item.options.map((o: any) => String(o).trim()).filter(Boolean);
  } else if (typeof item.options === 'string' && item.options.trim()) {
    try {
      const parsed = JSON.parse(item.options);
      if (Array.isArray(parsed)) {
        options = parsed.map((o: any) => String(o).trim()).filter(Boolean);
      } else if (typeof parsed === 'object' && parsed !== null) {
        options = Object.values(parsed).map((o: any) => String(o).trim()).filter(Boolean);
      }
    } catch {
      if (item.options.includes('\n')) {
        options = item.options.split('\n').map((s: string) => s.trim()).filter(Boolean);
      } else if (item.options.includes(',')) {
        options = item.options.split(',').map((s: string) => s.trim()).filter(Boolean);
      } else {
        options = [item.options.trim()];
      }
    }
  } else if (typeof item.options === 'object' && item.options !== null) {
    options = Object.values(item.options).map((o: any) => String(o).trim()).filter(Boolean);
  }

  // If options array is empty, check discrete column names
  if (options.length === 0) {
    const optA = item.option_a ?? item.optionA ?? item.option_1 ?? item.option1 ?? item.opt1 ?? item.opt_a ?? item.op1 ?? item.a;
    const optB = item.option_b ?? item.optionB ?? item.option_2 ?? item.option2 ?? item.opt2 ?? item.opt_b ?? item.op2 ?? item.b;
    const optC = item.option_c ?? item.optionC ?? item.option_3 ?? item.option3 ?? item.opt3 ?? item.opt_c ?? item.op3 ?? item.c;
    const optD = item.option_d ?? item.optionD ?? item.option_4 ?? item.option4 ?? item.opt4 ?? item.opt_d ?? item.op4 ?? item.d;

    const list = [optA, optB, optC, optD].filter(v => v !== undefined && v !== null && String(v).trim() !== '');
    if (list.length > 0) {
      options = list.map(v => String(v).trim());
    }
  }

  // 3. Extract correct index
  let correctIndex = 0;
  const rawCorrect = item.correct_index ?? item.correct_option ?? item.correct_answer ?? item.correctOption ?? item.correctIndex ?? item.correctAnswer ?? item.answer ?? item.ans ?? item.right_answer ?? item.correct;

  if (typeof rawCorrect === 'number') {
    if (rawCorrect >= 1 && rawCorrect <= 4 && (item.correct_index === undefined || rawCorrect > (options.length > 0 ? options.length - 1 : 3))) {
      correctIndex = rawCorrect - 1;
    } else {
      correctIndex = rawCorrect;
    }
  } else if (typeof rawCorrect === 'string') {
    const trimmed = rawCorrect.trim().toLowerCase();
    if (trimmed === 'a' || trimmed === '1' || trimmed === 'ক' || trimmed === 'أ' || trimmed === '১' || trimmed === 'option_a' || trimmed === 'option1') {
      correctIndex = 0;
    } else if (trimmed === 'b' || trimmed === '2' || trimmed === 'খ' || trimmed === 'ب' || trimmed === '২' || trimmed === 'option_b' || trimmed === 'option2') {
      correctIndex = 1;
    } else if (trimmed === 'c' || trimmed === '3' || trimmed === 'গ' || trimmed === 'ج' || trimmed === '৩' || trimmed === 'option_c' || trimmed === 'option3') {
      correctIndex = 2;
    } else if (trimmed === 'd' || trimmed === '4' || trimmed === 'ঘ' || trimmed === 'د' || trimmed === '৪' || trimmed === 'option_d' || trimmed === 'option4') {
      correctIndex = 3;
    } else if (options.length > 0) {
      const idx = options.findIndex(opt => opt.trim().toLowerCase() === trimmed);
      if (idx !== -1) {
        correctIndex = idx;
      } else {
        const parsed = parseInt(trimmed, 10);
        if (!isNaN(parsed) && parsed >= 0) {
          correctIndex = parsed >= 1 && parsed <= options.length ? parsed - 1 : parsed;
        }
      }
    }
  }

  return {
    id: String(item.id || `q_${Math.random().toString(36).substring(2, 9)}`),
    question: questionText || 'প্রশ্ন বিবরণ',
    arabicQuestion: arabicQuestion,
    options: options.length > 0 ? options : ['ক', 'খ', 'গ', 'ঘ'],
    correctIndex: correctIndex >= 0 && correctIndex < (options.length || 4) ? correctIndex : 0,
    explanation: item.explanation || item.explain || item.solution || item.details || item.explanation_text || item.note || '',
    subject: item.subject || ''
  };
};

export const supabaseService = {
  // ==========================================
  // 1. COURSES & COURSE DETAILS
  // ==========================================

  /**
   * Fetch published courses from Supabase 'courses' table
   */
  async getCourses(): Promise<Course[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch courses error:', error.message);
        return [];
      }

      if (data && data.length > 0) {
        return data.map((item: any) => ({
          id: String(item.id),
          title: item.title || '',
          subtitle: item.subtitle || '',
          category: item.category || 'madrasah_ntrca',
          coverImage: item.cover_image || item.coverImage || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
          price: Number(item.price || 0),
          originalPrice: Number(item.original_price || item.originalPrice || item.price || 0),
          badge: item.badge,
          batchType: item.batch_type || item.batchType || 'স্পেশাল ব্যাচ',
          shortTag: item.short_tag || item.shortTag,
          rating: Number(item.rating || 4.9),
          totalStudents: Number(item.total_students || item.totalStudents || 0),
          totalClasses: Number(item.total_classes || item.totalClasses || 0),
          totalSheets: Number(item.total_sheets || item.totalSheets || 0),
          totalFullModels: item.total_full_models || item.totalFullModels || '১০টি',
          totalExams: Number(item.total_exams || item.totalExams || 0),
          duration: item.duration || '৩ মাস মেয়াদী',
          startDate: item.start_date || item.startDate || 'চলমান',
          instructors: Array.isArray(item.instructors) ? item.instructors : [],
          description: item.description || '',
          detailedOverview: item.detailed_overview || item.detailedOverview,
          overviewSections: Array.isArray(item.overview_sections) ? item.overview_sections : [],
          features: Array.isArray(item.features) ? item.features : [],
          syllabus: Array.isArray(item.syllabus) ? item.syllabus : [],
          sheets: Array.isArray(item.sheets) ? item.sheets : [],
          courseExams: Array.isArray(item.course_exams) ? item.course_exams : []
        }));
      }

      return [];
    } catch (e) {
      console.warn('Exception in getCourses:', e);
      return [];
    }
  },

  /**
   * Fetch single course by ID
   */
  async getCourseById(courseId: string): Promise<Course | null> {
    const supabase = getSupabase();
    if (!supabase || !courseId) return null;

    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error || !data) return null;

      return {
        id: String(data.id),
        title: data.title || '',
        subtitle: data.subtitle || '',
        category: data.category || 'madrasah_ntrca',
        coverImage: data.cover_image || data.coverImage || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
        price: Number(data.price || 0),
        originalPrice: Number(data.original_price || data.originalPrice || 0),
        badge: data.badge,
        batchType: data.batch_type || data.batchType || 'স্পেশাল ব্যাচ',
        shortTag: data.short_tag || data.shortTag,
        rating: Number(data.rating || 4.9),
        totalStudents: Number(data.total_students || 0),
        totalClasses: Number(data.total_classes || 0),
        totalSheets: Number(data.total_sheets || 0),
        totalFullModels: data.total_full_models || '১০টি',
        totalExams: Number(data.total_exams || 0),
        duration: data.duration || '৩ মাস মেয়াদী',
        startDate: data.start_date || 'চলমান',
        instructors: Array.isArray(data.instructors) ? data.instructors : [],
        description: data.description || '',
        detailedOverview: data.detailed_overview,
        overviewSections: Array.isArray(data.overview_sections) ? data.overview_sections : [],
        features: Array.isArray(data.features) ? data.features : [],
        syllabus: Array.isArray(data.syllabus) ? data.syllabus : [],
        sheets: Array.isArray(data.sheets) ? data.sheets : [],
        courseExams: Array.isArray(data.course_exams) ? data.course_exams : []
      };
    } catch (e) {
      console.warn('Exception in getCourseById:', e);
      return null;
    }
  },

  /**
   * Fetch Course Tabs
   */
  async getCourseTabs(courseId: string): Promise<CourseTab[]> {
    const supabase = getSupabase();
    if (!supabase || !courseId) return [];

    try {
      const { data, error } = await supabase
        .from('course_tabs')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error || !data) return [];
      return data.map((t: any) => ({
        id: String(t.id),
        courseId: t.course_id,
        title: t.title,
        tabKey: t.tab_key || t.tabKey,
        orderIndex: Number(t.order_index || 0),
        isActive: t.is_active ?? true,
        content: t.content
      }));
    } catch {
      return [];
    }
  },

  /**
   * Fetch Course Routines (by optional courseId or all)
   */
  async getCourseRoutines(courseId?: string): Promise<RoutineItem[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    try {
      let query = supabase.from('course_routines').select('*');
      if (courseId) {
        query = query.eq('course_id', courseId);
      }
      const { data, error } = await query.order('created_at', { ascending: true });

      if (error || !data) return [];

      return data.map((r: any) => ({
        id: String(r.id),
        day: r.day || 'শনিবার',
        time: r.time || 'রাত ৮:০০',
        subject: r.subject || '',
        topic: r.topic || '',
        instructor: r.instructor || 'মুফতী উস্তাদ',
        batchName: r.batch_name || r.batchName || 'স্পেশাল ব্যাচ',
        liveLink: r.live_link || r.liveLink,
        status: r.status || 'upcoming'
      }));
    } catch {
      return [];
    }
  },

  /**
   * Fetch Course Syllabus (Modules + Items)
   */
  async getCourseSyllabusModules(courseId: string): Promise<SyllabusTopic[]> {
    const supabase = getSupabase();
    if (!supabase || !courseId) return [];

    try {
      const { data: modules, error: modErr } = await supabase
        .from('course_syllabus_modules')
        .select('*')
        .eq('course_id', courseId)
        .order('module_order', { ascending: true });

      if (modErr || !modules || modules.length === 0) {
        return [];
      }

      const moduleIds = modules.map(m => m.id);
      const { data: items } = await supabase
        .from('course_syllabus_items')
        .select('*')
        .in('module_id', moduleIds)
        .order('item_order', { ascending: true });

      const itemsByModule: Record<string, string[]> = {};
      if (items) {
        items.forEach((it: any) => {
          if (!itemsByModule[it.module_id]) itemsByModule[it.module_id] = [];
          itemsByModule[it.module_id].push(it.title || it.item_text || '');
        });
      }

      return modules.map((m: any) => ({
        title: m.title || 'মডিউল',
        classesCount: Number(m.classes_count || (itemsByModule[m.id]?.length || 1)),
        items: itemsByModule[m.id] || []
      }));
    } catch (err) {
      console.warn('Error fetching syllabus:', err);
      return [];
    }
  },

  /**
   * Fetch Syllabus Items for a specific Module
   */
  async getCourseSyllabusItems(moduleId: string): Promise<string[]> {
    const supabase = getSupabase();
    if (!supabase || !moduleId) return [];

    try {
      const { data, error } = await supabase
        .from('course_syllabus_items')
        .select('title')
        .eq('module_id', moduleId)
        .order('item_order', { ascending: true });

      if (error || !data) return [];
      return data.map(item => item.title);
    } catch {
      return [];
    }
  },

  /**
   * Fetch Lecture Sheets & PDFs from 'course_materials'
   */
  async getCourseMaterials(courseId: string): Promise<CourseLectureSheet[]> {
    const supabase = getSupabase();
    if (!supabase || !courseId) return [];

    try {
      const { data, error } = await supabase
        .from('course_materials')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: true });

      if (error || !data) return [];

      return data.map((m: any, index: number) => ({
        id: String(m.id),
        title: m.title || `লেকচার শিট ${index + 1}.pdf`,
        subtitle: m.subtitle || `PDF Sheet ${String(index + 1).padStart(2, '0')}`,
        fileSize: m.file_size || m.fileSize || '২.৫ MB',
        pagesCount: Number(m.pages_count || m.pagesCount || 40),
        downloadUrl: m.download_url || m.downloadUrl,
        isFree: Boolean(m.is_free ?? m.isFree ?? false)
      }));
    } catch {
      return [];
    }
  },

  /**
   * Fetch Exams for a specific Course from 'course_exams' table
   * Questions are linked via questions.exam_id = course_exams.id
   */
  async getCourseExams(courseId: string): Promise<CourseExamItem[]> {
    const supabase = getSupabase();
    if (!supabase || !courseId) return [];

    try {
      // 1. Fetch from 'course_exams' table
      let { data, error } = await supabase
        .from('course_exams')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: true });

      // Fallback: try without created_at order if column differs
      if (error) {
        const fallback = await supabase
          .from('course_exams')
          .select('*')
          .eq('course_id', courseId);
        data = fallback.data;
        error = fallback.error;
      }

      if (error || !data || data.length === 0) {
        return [];
      }

      // 2. Fetch questions from 'questions' table to calculate real count & prefill
      let allQuestions: any[] = [];
      try {
        const { data: qData, error: qErr } = await supabase
          .from('questions')
          .select('*');
        if (!qErr && qData) {
          allQuestions = qData;
        }
      } catch {
        // Fallback
      }

      return data.map((item: any, idx: number) => {
        const examIdStr = String(item.id);
        
        // Find questions matching questions.exam_id = course_exams.id
        let matchedQuestions: Question[] = [];
        if (allQuestions.length > 0) {
          const matchedRows = allQuestions.filter((q: any) => 
            String(q.exam_id) === examIdStr || 
            String(q.examId) === examIdStr
          );
          if (matchedRows.length > 0) {
            matchedQuestions = matchedRows.map(mapQuestionRow);
          }
        }

        // Embedded fallback if stored inside JSON
        if (matchedQuestions.length === 0 && (item.questions || item.question_list)) {
          let embedded = item.questions || item.question_list;
          if (typeof embedded === 'string') {
            try { embedded = JSON.parse(embedded); } catch {}
          }
          if (Array.isArray(embedded)) {
            matchedQuestions = embedded.map(mapQuestionRow);
          }
        }

        const calculatedCount = matchedQuestions.length > 0 
          ? matchedQuestions.length 
          : Number(item.total_questions || item.totalQuestions || item.question_count || item.questionCount || 25);

        return {
          id: examIdStr,
          examNumber: item.exam_number || item.examNumber || `পরীক্ষা ${String(idx + 1).padStart(2, '0')}`,
          title: item.title || item.topic || `কোর্স পরীক্ষা ${idx + 1}`,
          topic: item.topic || item.subject || item.title || 'কোর্স বিষয়ভিত্তিক পরীক্ষা',
          dateStr: item.date_str || item.dateStr || 'চলমান',
          questionCount: calculatedCount,
          durationMinutes: Number(item.duration_minutes || item.durationMinutes || 30),
          isLocked: Boolean(item.is_locked ?? item.isLocked ?? false),
          examRefId: examIdStr,
          courseId: String(item.course_id || courseId),
          subject: item.subject || item.title || 'কোর্স বিষয়',
          totalMarks: Number(item.total_marks || item.totalMarks || calculatedCount),
          negativeMarking: Number(item.negative_marking ?? item.negativeMarking ?? 0.25),
          status: item.status || 'running',
          questions: matchedQuestions
        };
      });
    } catch (err) {
      console.warn('Exception in getCourseExams:', err);
      return [];
    }
  },

  // ==========================================
  // 2. EXAMS (FREE_EXAMS & COURSE_EXAMS) & QUESTIONS
  // ==========================================

  /**
   * Fetch all Free Exams / Model Tests from 'free_exams' table
   * Questions are linked via questions.free_exam_id = free_exams.id
   */
  async getFreeExams(): Promise<Exam[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    try {
      let { data, error } = await supabase
        .from('free_exams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        const fallback = await supabase.from('free_exams').select('*');
        data = fallback.data;
        error = fallback.error;
      }

      if (error || !data || data.length === 0) {
        return [];
      }

      // Fetch all questions from 'questions' table to match free_exam_id
      let allQuestionsData: any[] = [];
      try {
        const { data: qData, error: qError } = await supabase
          .from('questions')
          .select('*');
        if (!qError && qData) {
          allQuestionsData = qData;
        }
      } catch (err) {
        console.warn('Could not batch load questions for free_exams:', err);
      }

      return data.map((item: any) => {
        const freeExamIdStr = String(item.id);

        // Find questions matching questions.free_exam_id = free_exams.id
        let questions: Question[] = [];
        if (allQuestionsData.length > 0) {
          const matched = allQuestionsData.filter((q: any) => 
            String(q.free_exam_id) === freeExamIdStr || 
            String(q.freeExamId) === freeExamIdStr
          );
          if (matched.length > 0) {
            questions = matched.map(mapQuestionRow);
          }
        }

        // Check embedded JSON in free_exams row
        if (questions.length === 0) {
          let embedded = item.questions || item.question_list || item.data || item.quiz_questions;
          if (typeof embedded === 'string' && embedded.trim()) {
            try {
              embedded = JSON.parse(embedded);
            } catch {}
          }
          if (Array.isArray(embedded) && embedded.length > 0) {
            questions = embedded.map(mapQuestionRow);
          }
        }

        const totalQCount = questions.length > 0 
          ? questions.length 
          : Number(item.total_questions || item.totalQuestions || item.question_count || 20);

        return {
          id: freeExamIdStr,
          title: item.title || 'ফ্রি মডেল টেস্ট',
          category: item.category || 'free',
          subject: item.subject || 'সাধারণ বিষয়',
          totalMarks: Number(item.total_marks || item.totalMarks || 100),
          durationMinutes: Number(item.duration_minutes || item.durationMinutes || 60),
          negativeMarking: Number(item.negative_marking ?? item.negativeMarking ?? 0.25),
          totalQuestions: totalQCount,
          status: item.status || 'running',
          participantsCount: Number(item.participants_count || item.participantsCount || 0),
          questions: questions,
          isFree: true,
          examType: 'free_exam',
          dateStr: item.date_str || item.dateStr || 'চলমান'
        };
      });
    } catch (e) {
      console.warn('Exception in getFreeExams:', e);
      return [];
    }
  },

  /**
   * Fetch all Exams (Queries 'free_exams' table)
   */
  async getExams(): Promise<Exam[]> {
    return this.getFreeExams();
  },

  /**
   * Fetch a single Exam by ID (checks 'free_exams' and 'course_exams')
   * with full questions populated
   */
  async getExamById(examId: string): Promise<Exam | null> {
    const supabase = getSupabase();
    if (!supabase || !examId) return null;

    try {
      const examIdStr = String(examId);

      // 1. Try free_exams table
      const { data: freeRow, error: freeErr } = await supabase
        .from('free_exams')
        .select('*')
        .eq('id', examIdStr)
        .maybeSingle();

      if (!freeErr && freeRow) {
        const questions = await this.getFreeExamQuestions(examIdStr);
        const totalQ = questions.length > 0 ? questions.length : Number(freeRow.total_questions || freeRow.question_count || 20);
        return {
          id: String(freeRow.id),
          title: freeRow.title || 'ফ্রি মডেল টেস্ট',
          category: freeRow.category || 'free',
          subject: freeRow.subject || 'সাধারণ বিষয়',
          totalMarks: Number(freeRow.total_marks || totalQ),
          durationMinutes: Number(freeRow.duration_minutes || 30),
          negativeMarking: Number(freeRow.negative_marking ?? 0.25),
          totalQuestions: totalQ,
          status: freeRow.status || 'running',
          participantsCount: Number(freeRow.participants_count || freeRow.participantsCount || 0),
          questions: questions,
          isFree: true,
          examType: 'free_exam',
          dateStr: freeRow.date_str || freeRow.dateStr || 'চলমান'
        };
      }

      // 2. Try course_exams table
      const { data: courseRow, error: courseErr } = await supabase
        .from('course_exams')
        .select('*')
        .eq('id', examIdStr)
        .maybeSingle();

      if (!courseErr && courseRow) {
        const questions = await this.getCourseExamQuestions(examIdStr);
        const totalQ = questions.length > 0 ? questions.length : Number(courseRow.total_questions || courseRow.question_count || 25);
        return {
          id: String(courseRow.id),
          title: courseRow.title || 'কোর্স পরীক্ষা',
          category: 'subject',
          subject: courseRow.subject || courseRow.title || 'কোর্স বিষয়',
          totalMarks: Number(courseRow.total_marks || totalQ),
          durationMinutes: Number(courseRow.duration_minutes || 30),
          negativeMarking: Number(courseRow.negative_marking ?? 0.25),
          totalQuestions: totalQ,
          status: courseRow.status || 'running',
          participantsCount: Number(courseRow.participants_count || courseRow.participantsCount || 0),
          questions: questions,
          isFree: false,
          examType: 'course_exam',
          courseId: String(courseRow.course_id || ''),
          dateStr: courseRow.date_str || courseRow.dateStr || 'চলমান'
        };
      }

      return null;
    } catch (err) {
      console.warn('Error fetching exam by ID:', err);
      return null;
    }
  },

  /**
   * Fetch questions for a Course Exam from 'questions' table
   * WHERE exam_id = course_exams.id
   */
  async getCourseExamQuestions(courseExamId: string): Promise<Question[]> {
    const supabase = getSupabase();
    if (!supabase || !courseExamId) return [];

    try {
      const examIdStr = String(courseExamId);

      // Query questions table with exam_id = course_exams.id
      let { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('exam_id', examIdStr);

      if (error || !data || data.length === 0) {
        const alt = await supabase
          .from('questions')
          .select('*')
          .eq('examId', examIdStr);
        if (!alt.error && alt.data && alt.data.length > 0) {
          data = alt.data;
          error = null;
        }
      }

      // Try numeric if applicable
      if ((error || !data || data.length === 0) && !isNaN(Number(courseExamId))) {
        const numRes = await supabase
          .from('questions')
          .select('*')
          .eq('exam_id', Number(courseExamId));
        if (!numRes.error && numRes.data && numRes.data.length > 0) {
          data = numRes.data;
          error = null;
        }
      }

      if (!error && data && data.length > 0) {
        return data.map(mapQuestionRow);
      }

      // Check embedded questions in course_exams row
      const { data: examRow } = await supabase
        .from('course_exams')
        .select('*')
        .eq('id', courseExamId)
        .maybeSingle();

      if (examRow) {
        let embedded = examRow.questions || examRow.question_list || examRow.data;
        if (typeof embedded === 'string' && embedded.trim()) {
          try { embedded = JSON.parse(embedded); } catch {}
        }
        if (Array.isArray(embedded) && embedded.length > 0) {
          return embedded.map(mapQuestionRow);
        }
      }

      return [];
    } catch (err) {
      console.warn('Error fetching course exam questions:', err);
      return [];
    }
  },

  /**
   * Fetch questions for a Free Exam / Model Test from 'questions' table
   * WHERE free_exam_id = free_exams.id
   */
  async getFreeExamQuestions(freeExamId: string): Promise<Question[]> {
    const supabase = getSupabase();
    if (!supabase || !freeExamId) return [];

    try {
      const freeExamIdStr = String(freeExamId);

      // Query questions table with free_exam_id = free_exams.id
      let { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('free_exam_id', freeExamIdStr);

      if (error || !data || data.length === 0) {
        const alt = await supabase
          .from('questions')
          .select('*')
          .eq('freeExamId', freeExamIdStr);
        if (!alt.error && alt.data && alt.data.length > 0) {
          data = alt.data;
          error = null;
        }
      }

      // Try numeric if applicable
      if ((error || !data || data.length === 0) && !isNaN(Number(freeExamId))) {
        const numRes = await supabase
          .from('questions')
          .select('*')
          .eq('free_exam_id', Number(freeExamId));
        if (!numRes.error && numRes.data && numRes.data.length > 0) {
          data = numRes.data;
          error = null;
        }
      }

      if (!error && data && data.length > 0) {
        return data.map(mapQuestionRow);
      }

      // Check embedded questions in free_exams row
      const { data: examRow } = await supabase
        .from('free_exams')
        .select('*')
        .eq('id', freeExamId)
        .maybeSingle();

      if (examRow) {
        let embedded = examRow.questions || examRow.question_list || examRow.data || examRow.quiz_questions;
        if (typeof embedded === 'string' && embedded.trim()) {
          try { embedded = JSON.parse(embedded); } catch {}
        }
        if (Array.isArray(embedded) && embedded.length > 0) {
          return embedded.map(mapQuestionRow);
        }
      }

      return [];
    } catch (err) {
      console.warn('Error fetching free exam questions:', err);
      return [];
    }
  },

  /**
   * Unified question fetcher:
   * Dynamically loads by checking free_exam_id or exam_id according to examType or query match
   */
  async getExamQuestions(examId: string, examType?: 'course_exam' | 'free_exam'): Promise<Question[]> {
    if (!examId) return [];

    if (examType === 'course_exam') {
      return this.getCourseExamQuestions(examId);
    }
    if (examType === 'free_exam') {
      return this.getFreeExamQuestions(examId);
    }

    // If examType is not explicitly specified, try free_exams first then course_exams
    const freeQuestions = await this.getFreeExamQuestions(examId);
    if (freeQuestions.length > 0) {
      return freeQuestions;
    }

    const courseQuestions = await this.getCourseExamQuestions(examId);
    if (courseQuestions.length > 0) {
      return courseQuestions;
    }

    return [];
  },

  /**
   * Helper for Admin: Create a Free Exam and insert all its questions in 'questions' table
   * with free_exam_id = newExam.id
   */
  async createFreeExamWithQuestions(examData: {
    title: string;
    subject: string;
    category?: 'free' | 'daily' | 'model_test';
    totalMarks?: number;
    durationMinutes?: number;
    negativeMarking?: number;
    questions: Array<{
      question: string;
      arabicQuestion?: string;
      options: string[];
      correctIndex: number;
      explanation?: string;
      subject?: string;
    }>;
  }): Promise<{ success: boolean; examId?: string; message: string }> {
    const supabase = getSupabase();
    if (!supabase) return { success: false, message: 'Supabase কানেক্টেড নয়।' };

    try {
      // 1. Insert into free_exams table
      const { data: newExam, error: examError } = await supabase
        .from('free_exams')
        .insert({
          title: examData.title,
          subject: examData.subject,
          category: examData.category || 'free',
          total_marks: examData.totalMarks || examData.questions.length,
          duration_minutes: examData.durationMinutes || 30,
          negative_marking: examData.negativeMarking ?? 0.25,
          total_questions: examData.questions.length,
          status: 'running',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (examError || !newExam) {
        return { success: false, message: `পরীক্ষা তৈরিতে ব্যর্থ: ${examError?.message || 'অজানা ত্রুটি'}` };
      }

      const freeExamId = String(newExam.id);

      // 2. Prepare questions with free_exam_id
      const formattedQuestions = examData.questions.map((q) => ({
        free_exam_id: freeExamId,
        question_text: q.question,
        arabic_question: q.arabicQuestion || null,
        options: q.options,
        correct_index: q.correctIndex,
        explanation: q.explanation || '',
        subject: q.subject || examData.subject,
        created_at: new Date().toISOString()
      }));

      // 3. Insert questions into 'questions' table
      const { error: qError } = await supabase
        .from('questions')
        .insert(formattedQuestions);

      if (qError) {
        return { 
          success: false, 
          examId: freeExamId, 
          message: `পরীক্ষা যুক্ত হয়েছে কিন্তু প্রশ্নে ত্রুটি: ${qError.message}` 
        };
      }

      return { success: true, examId: freeExamId, message: 'পরীক্ষা ও প্রশ্ন সফলভাবে তৈরি হয়েছে!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'অপ্রত্যাশিত ত্রুটি ঘটেছে' };
    }
  },

  /**
   * Helper for Admin: Create a Course Exam and insert all its questions in 'questions' table
   * with exam_id = newExam.id
   */
  async createCourseExamWithQuestions(examData: {
    courseId: string;
    title: string;
    subject?: string;
    examNumber?: string;
    durationMinutes?: number;
    negativeMarking?: number;
    questions: Array<{
      question: string;
      arabicQuestion?: string;
      options: string[];
      correctIndex: number;
      explanation?: string;
    }>;
  }): Promise<{ success: boolean; examId?: string; message: string }> {
    const supabase = getSupabase();
    if (!supabase) return { success: false, message: 'Supabase কানেক্টেড নয়।' };

    try {
      // 1. Insert into course_exams table
      const { data: newExam, error: examError } = await supabase
        .from('course_exams')
        .insert({
          course_id: examData.courseId,
          title: examData.title,
          subject: examData.subject || examData.title,
          exam_number: examData.examNumber || 'পরীক্ষা ০১',
          total_marks: examData.questions.length,
          duration_minutes: examData.durationMinutes || 30,
          negative_marking: examData.negativeMarking ?? 0.25,
          total_questions: examData.questions.length,
          status: 'running',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (examError || !newExam) {
        return { success: false, message: `কোর্স পরীক্ষা তৈরিতে ব্যর্থ: ${examError?.message || 'অজানা ত্রুটি'}` };
      }

      const courseExamId = String(newExam.id);

      // 2. Prepare questions with exam_id
      const formattedQuestions = examData.questions.map((q) => ({
        exam_id: courseExamId,
        question_text: q.question,
        arabic_question: q.arabicQuestion || null,
        options: q.options,
        correct_index: q.correctIndex,
        explanation: q.explanation || '',
        subject: examData.subject || examData.title,
        created_at: new Date().toISOString()
      }));

      // 3. Insert questions into 'questions' table
      const { error: qError } = await supabase
        .from('questions')
        .insert(formattedQuestions);

      if (qError) {
        return { 
          success: false, 
          examId: courseExamId, 
          message: `পরীক্ষা যুক্ত হয়েছে কিন্তু প্রশ্নে ত্রুটি: ${qError.message}` 
        };
      }

      return { success: true, examId: courseExamId, message: 'কোর্স পরীক্ষা ও প্রশ্ন সফলভাবে তৈরি হয়েছে!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'অপ্রত্যাশিত ত্রুটি ঘটেছে' };
    }
  },

  // ==========================================
  // 3. PROFILES & USER AUTHENTICATION
  // ==========================================

  /**
   * Normalize email or phone number for Supabase authentication
   */
  normalizeIdentifier(rawIdentifier: string): { authEmail: string; isEmail: boolean; phone: string; displayIdentifier: string } {
    const trimmed = String(rawIdentifier || '').trim();
    // Convert Bengali numerals to English if any
    const converted = trimmed.replace(/[০-৯]/g, (d) => String('০১২৩৪৫৬৭৮৯'.indexOf(d)));

    if (converted.includes('@')) {
      return {
        authEmail: converted.toLowerCase(),
        isEmail: true,
        phone: '',
        displayIdentifier: converted.toLowerCase()
      };
    }

    // Extract digits for phone numbers
    const digitsOnly = converted.replace(/[^0-9]/g, '');
    let normalizedPhone = digitsOnly;
    if (normalizedPhone.startsWith('880')) {
      normalizedPhone = '0' + normalizedPhone.substring(3);
    } else if (normalizedPhone.startsWith('88') && normalizedPhone.length > 11) {
      normalizedPhone = normalizedPhone.substring(2);
    }

    const authEmail = normalizedPhone ? `phone_${normalizedPhone}@tamreen.academy` : `user_${Date.now()}@tamreen.academy`;

    return {
      authEmail: authEmail.toLowerCase(),
      isEmail: false,
      phone: normalizedPhone,
      displayIdentifier: normalizedPhone || converted
    };
  },

  /**
   * User Registration (Email or Phone + Password)
   */
  async registerUser(params: {
    name: string;
    identifier: string;
    password: string;
    institution?: string;
  }): Promise<{ success: boolean; message: string; user?: UserProfile; userId?: string }> {
    const { name, identifier, password, institution } = params;
    const cleanName = name.trim();
    const { authEmail, isEmail, phone, displayIdentifier } = this.normalizeIdentifier(identifier);

    if (!cleanName) {
      return { success: false, message: 'অনুগ্রহ করে আপনার নাম প্রদান করুন।' };
    }
    if (!displayIdentifier) {
      return { success: false, message: 'সঠিক ইমেইল অথবা মোবাইল নম্বর প্রদান করুন।' };
    }
    if (!password || password.length < 6) {
      return { success: false, message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' };
    }

    const supabase = getSupabase();

    // 1. Try Supabase Auth if connected
    if (supabase) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: authEmail,
          password: password,
          options: {
            data: {
              name: cleanName,
              phone: phone,
              institution: institution || 'মাদ্রাসা / কলেজ',
              display_identifier: displayIdentifier
            }
          }
        });

        if (authError) {
          if (authError.message.includes('already registered') || authError.message.includes('unique constraint')) {
            return { success: false, message: 'এই ইমেইল বা মোবাইল নম্বরে ইতোমধ্যে একাউন্ট খোলা আছে। অনুগ্রহ করে লগইন করুন।' };
          }
          console.warn('Supabase auth signUp error:', authError.message);
        }

        const userId = authData?.user?.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

        const profileData: UserProfile = {
          id: userId,
          name: cleanName,
          email: isEmail ? displayIdentifier : '',
          phone: phone || (!isEmail ? displayIdentifier : ''),
          rollNo: `TAM-${Math.floor(1000 + Math.random() * 9000)}`,
          institution: institution || 'মাদ্রাসা / কলেজ',
          targetExam: '১৯তম শিক্ষক নিবন্ধন ও মডেল টেস্ট',
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}`,
          bio: 'জ্ঞান ও সাধনার মাধ্যমে অভীষ্ট লক্ষ্যে পৌঁছানোই ব্রত।',
          district: 'ঢাকা',
          batchTag: 'রেজিস্টার্ড শিক্ষার্থী',
          joinDate: new Date().toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' }),
          dailyGoalQuestions: 30,
          studyStreakDays: 1,
          totalPoints: 50,
          isPremium: false
        };

        // Try writing profile to profiles table
        try {
          await supabase.from('profiles').upsert({
            id: userId,
            name: cleanName,
            email: profileData.email,
            phone: profileData.phone,
            institution: profileData.institution,
            avatar_url: profileData.avatar,
            target_exam: profileData.targetExam,
            bio: profileData.bio,
            district: profileData.district,
            roll_no: profileData.rollNo,
            updated_at: new Date().toISOString()
          });
        } catch {}

        // Save local session cache
        localStorage.setItem('tamreen_auth_uid', userId);
        localStorage.setItem('tamreen_is_logged_in', 'true');
        localStorage.setItem('tamreen_user_profile', JSON.stringify(profileData));

        return {
          success: true,
          message: 'অভিনন্দন! আপনার একাউন্ট সফলভাবে তৈরি হয়েছে।',
          user: profileData,
          userId
        };
      } catch (err: any) {
        console.warn('Supabase registration error:', err);
      }
    }

    // 2. Offline / Local fallback user creation
    const localUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const localProfile: UserProfile = {
      id: localUserId,
      name: cleanName,
      email: isEmail ? displayIdentifier : '',
      phone: phone || (!isEmail ? displayIdentifier : ''),
      rollNo: `TAM-${Math.floor(1000 + Math.random() * 9000)}`,
      institution: institution || 'মাদ্রাসা / কলেজ',
      targetExam: '১৯তম শিক্ষক নিবন্ধন ও মডেল টেস্ট',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}`,
      bio: 'জ্ঞান ও সাধনার মাধ্যমে অভীষ্ট লক্ষ্যে পৌঁছানোই ব্রত।',
      district: 'ঢাকা',
      batchTag: 'রেজিস্টার্ড শিক্ষার্থী',
      joinDate: new Date().toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' }),
      dailyGoalQuestions: 30,
      studyStreakDays: 1,
      totalPoints: 50,
      isPremium: false
    };

    // Store in local users registry for offline login
    try {
      const storedUsers = JSON.parse(localStorage.getItem('tamreen_local_users') || '[]');
      storedUsers.push({
        id: localUserId,
        identifier: displayIdentifier.toLowerCase(),
        authEmail: authEmail.toLowerCase(),
        password: password,
        profile: localProfile
      });
      localStorage.setItem('tamreen_local_users', JSON.stringify(storedUsers));
    } catch {}

    localStorage.setItem('tamreen_auth_uid', localUserId);
    localStorage.setItem('tamreen_is_logged_in', 'true');
    localStorage.setItem('tamreen_user_profile', JSON.stringify(localProfile));

    return {
      success: true,
      message: 'আপনার একাউন্ট সফলভাবে তৈরি হয়েছে!',
      user: localProfile,
      userId: localUserId
    };
  },

  /**
   * User Login (Email or Phone + Password)
   */
  async loginUser(params: {
    identifier: string;
    password: string;
  }): Promise<{ success: boolean; message: string; user?: UserProfile; userId?: string }> {
    const { identifier, password } = params;
    const { authEmail, isEmail, phone, displayIdentifier } = this.normalizeIdentifier(identifier);

    if (!displayIdentifier) {
      return { success: false, message: 'ইমেইল অথবা মোবাইল নম্বর প্রদান করুন।' };
    }
    if (!password) {
      return { success: false, message: 'পাসওয়ার্ড প্রদান করুন।' };
    }

    const supabase = getSupabase();

    // 1. Try Supabase Auth
    if (supabase) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: password
        });

        if (!authError && authData?.user) {
          const userId = authData.user.id;
          let profile = await this.getProfile(userId);

          if (!profile) {
            const userMeta = authData.user.user_metadata || {};
            profile = {
              id: userId,
              name: userMeta.name || 'মুহাম্মদ শিক্ষার্থী',
              email: isEmail ? displayIdentifier : (authData.user.email || ''),
              phone: phone || userMeta.phone || '',
              rollNo: `TAM-${Math.floor(1000 + Math.random() * 9000)}`,
              institution: userMeta.institution || 'মাদ্রাসা / কলেজ',
              targetExam: '১৯তম শিক্ষক নিবন্ধন ও মডেল টেস্ট',
              avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userMeta.name || userId)}`,
              bio: '',
              district: 'ঢাকা',
              batchTag: 'রেজিস্টার্ড শিক্ষার্থী',
              dailyGoalQuestions: 30,
              studyStreakDays: 1,
              totalPoints: 100,
              isPremium: false
            };
          }

          localStorage.setItem('tamreen_auth_uid', userId);
          localStorage.setItem('tamreen_is_logged_in', 'true');
          localStorage.setItem('tamreen_user_profile', JSON.stringify(profile));

          return {
            success: true,
            message: `স্বাগতম, ${profile.name}! লগইন সফল হয়েছে।`,
            user: profile,
            userId
          };
        }
      } catch (err) {
        console.warn('Supabase signIn exception:', err);
      }
    }

    // 2. Local users registry check (for offline/local testing)
    try {
      const storedUsers = JSON.parse(localStorage.getItem('tamreen_local_users') || '[]');
      const match = storedUsers.find((u: any) => 
        (u.identifier === displayIdentifier.toLowerCase() || u.authEmail === authEmail.toLowerCase()) && 
        u.password === password
      );

      if (match) {
        localStorage.setItem('tamreen_auth_uid', match.id);
        localStorage.setItem('tamreen_is_logged_in', 'true');
        localStorage.setItem('tamreen_user_profile', JSON.stringify(match.profile));

        return {
          success: true,
          message: `স্বাগতম, ${match.profile.name}! লগইন সফল হয়েছে।`,
          user: match.profile,
          userId: match.id
        };
      }
    } catch {}

    // 3. Fallback: If user had an existing stored profile with matching identifier or fresh login
    const localProfileStr = localStorage.getItem('tamreen_user_profile');
    if (localProfileStr) {
      try {
        const saved = JSON.parse(localProfileStr);
        if (saved && (saved.email === displayIdentifier || saved.phone === displayIdentifier || !saved.email)) {
          localStorage.setItem('tamreen_is_logged_in', 'true');
          return {
            success: true,
            message: `স্বাগতম, ${saved.name}! লগইন সফল হয়েছে।`,
            user: saved,
            userId: saved.id || 'usr_local'
          };
        }
      } catch {}
    }

    return {
      success: false,
      message: 'ইমেইল/মোবাইল নম্বর অথবা পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে পুনরায় চেষ্টা করুন।'
    };
  },

  /**
   * Request Password Reset (Email verification or recovery)
   */
  async requestPasswordReset(identifier: string): Promise<{ success: boolean; message: string; isEmail?: boolean }> {
    const { authEmail, isEmail, displayIdentifier, phone } = this.normalizeIdentifier(identifier);

    if (!displayIdentifier) {
      return { success: false, message: 'অনুগ্রহ করে আপনার ইমেইল অথবা মোবাইল নম্বর প্রদান করুন।' };
    }

    const supabase = getSupabase();

    if (isEmail) {
      if (supabase) {
        try {
          // Get current origin safely
          const redirectUrl = typeof window !== 'undefined' ? window.location.origin : '';
          const { error } = await supabase.auth.resetPasswordForEmail(authEmail, {
            redirectTo: redirectUrl
          });

          if (error) {
            console.warn('Supabase resetPasswordForEmail error:', error.message);
            // If rate limited or error
            if (error.message.includes('rate limit')) {
              return { success: false, message: 'অনেকগুলো অনুরোধ পাঠানো হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।' };
            }
          }

          return {
            success: true,
            isEmail: true,
            message: `পাসওয়ার্ড রিসেটের ভেরিফিকেশন লিংক আপনার ইমেইলে (${displayIdentifier}) পাঠানো হয়েছে। অনুগ্রহ করে ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।`
          };
        } catch (err: any) {
          console.warn('Reset password error:', err);
        }
      }

      return {
        success: true,
        isEmail: true,
        message: `পাসওয়ার্ড রিসেটের ভেরিফিকেশন নির্দেশনা (${displayIdentifier}) ইমেইলে প্রেরণ করা হয়েছে।`
      };
    } else {
      // Phone-based account password reset
      // Check if user exists in local or Supabase
      const storedUsers = JSON.parse(localStorage.getItem('tamreen_local_users') || '[]');
      const match = storedUsers.find((u: any) => u.identifier === displayIdentifier.toLowerCase() || u.authEmail === authEmail.toLowerCase());

      if (match || phone) {
        return {
          success: true,
          isEmail: false,
          message: `মোবাইল নম্বর (${displayIdentifier}) এর জন্য নতুন পাসওয়ার্ড সেট করার অনুমতি পাওয়া গেছে।`
        };
      }

      return {
        success: false,
        message: 'এই মোবাইল নম্বরে কোনো সক্রিয় একাউন্ট পাওয়া যায়নি।'
      };
    }
  },

  /**
   * Update or Reset Password (either with active recovery session or identifier verification)
   */
  async updatePassword(params: {
    newPassword: string;
    identifier?: string;
  }): Promise<{ success: boolean; message: string }> {
    const { newPassword, identifier } = params;

    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' };
    }

    const supabase = getSupabase();

    // 1. Try Supabase updateUser (for email recovery session or authenticated user)
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.updateUser({
          password: newPassword
        });

        if (!error && data?.user) {
          return {
            success: true,
            message: 'আপনার পাসওয়ার্ড সফলভাবে পরিবর্তিত ও হালনাগাদ হয়েছে! এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।'
          };
        }
      } catch (err) {
        console.warn('Supabase updateUser password error:', err);
      }
    }

    // 2. Local fallback update if identifier provided
    if (identifier) {
      const { authEmail, displayIdentifier } = this.normalizeIdentifier(identifier);
      try {
        const storedUsers = JSON.parse(localStorage.getItem('tamreen_local_users') || '[]');
        let updated = false;
        const newUsers = storedUsers.map((u: any) => {
          if (u.identifier === displayIdentifier.toLowerCase() || u.authEmail === authEmail.toLowerCase()) {
            updated = true;
            return { ...u, password: newPassword };
          }
          return u;
        });

        if (updated) {
          localStorage.setItem('tamreen_local_users', JSON.stringify(newUsers));
          return {
            success: true,
            message: 'পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে!'
          };
        }
      } catch {}
    }

    return {
      success: true,
      message: 'পাসওয়ার্ড সফলভাবে রিসেট হয়েছে।'
    };
  },

  /**
   * Resend signup verification email
   */
  async resendVerification(email: string): Promise<{ success: boolean; message: string }> {
    const { authEmail, displayIdentifier } = this.normalizeIdentifier(email);
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: authEmail
        });
        if (error) {
          return { success: false, message: error.message };
        }
        return {
          success: true,
          message: `ভেরিফিকেশন ইমেইল পুনরায় (${displayIdentifier}) ঠিকানায় পাঠানো হয়েছে।`
        };
      } catch (err: any) {
        return { success: false, message: err?.message || 'ভেরিফিকেশন পাঠানো সম্ভব হয়নি।' };
      }
    }
    return {
      success: true,
      message: 'ভেরিফিকেশন ইমেইল সফলভাবে পাঠানো হয়েছে।'
    };
  },

  /**
   * Log out user
   */
  async logoutUser(): Promise<void> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    localStorage.removeItem('tamreen_is_logged_in');
    localStorage.removeItem('tamreen_auth_uid');
  },

  /**
   * Fetch User Profile from 'profiles' table
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    const supabase = getSupabase();
    if (!supabase || !userId) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error || !data) return null;

      return {
        id: data.id,
        name: data.name || data.full_name || 'মুহাম্মদ শিক্ষার্থী',
        phone: data.phone || '',
        email: data.email || '',
        rollNo: data.roll_no || data.rollNo || '',
        institution: data.institution || 'মাদ্রাসা / কলেজ',
        targetExam: data.target_exam || data.targetExam || '',
        avatar: data.avatar_url || data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        bio: data.bio || '',
        district: data.district || '',
        batchTag: data.batch_tag || data.batchTag || '',
        joinDate: data.join_date || data.joinDate || '২০২৬',
        dailyGoalQuestions: Number(data.daily_goal_questions || 30),
        soundEnabled: data.sound_enabled ?? true,
        hapticEnabled: data.haptic_enabled ?? true,
        smsAlerts: data.sms_alerts ?? true,
        studyStreakDays: Number(data.study_streak_days || 0),
        totalPoints: Number(data.total_points || 0),
        isPremium: Boolean(data.is_premium ?? false),
        subscriptionPlanId: data.subscription_plan_id,
        subscriptionPlanName: data.subscription_plan_name,
        subscriptionExpiryDate: data.subscription_expiry_date
      };
    } catch {
      return null;
    }
  },

  /**
   * Update Profile in 'profiles' table
   */
  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase || !userId) return false;

    try {
      const dbPayload: any = {};
      if (data.name !== undefined) dbPayload.name = data.name;
      if (data.phone !== undefined) dbPayload.phone = data.phone;
      if (data.email !== undefined) dbPayload.email = data.email;
      if (data.institution !== undefined) dbPayload.institution = data.institution;
      if (data.targetExam !== undefined) dbPayload.target_exam = data.targetExam;
      if (data.avatar !== undefined) dbPayload.avatar_url = data.avatar;
      if (data.bio !== undefined) dbPayload.bio = data.bio;
      if (data.district !== undefined) dbPayload.district = data.district;
      if (data.rollNo !== undefined) dbPayload.roll_no = data.rollNo;

      const { error } = await supabase
        .from('profiles')
        .upsert({ id: userId, ...dbPayload });

      return !error;
    } catch {
      return false;
    }
  },

  // ==========================================
  // 4. COURSE ENROLLMENTS
  // ==========================================

  /**
   * Fetch Single Enrollment for Course
   */
  async getEnrollment(userId: string, courseId: string): Promise<CourseEnrollment | null> {
    const supabase = getSupabase();
    if (!supabase || !userId || !courseId) return null;

    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) return null;

      return {
        id: String(data.id),
        userId: data.user_id,
        courseId: data.course_id,
        amount: Number(data.amount || 0),
        paymentMethod: data.payment_method || 'bKash',
        transactionId: data.transaction_id || '',
        paymentNumber: data.payment_number || '',
        status: (data.status as EnrollmentStatus) || 'pending',
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch {
      return null;
    }
  },

  /**
   * Fetch All Enrollments for User
   */
  async getUserEnrollments(userId: string): Promise<CourseEnrollment[]> {
    const supabase = getSupabase();
    if (!supabase || !userId) return [];

    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) return [];

      return data.map((e: any) => ({
        id: String(e.id),
        userId: e.user_id,
        courseId: e.course_id,
        amount: Number(e.amount || 0),
        paymentMethod: e.payment_method || 'bKash',
        transactionId: e.transaction_id || '',
        paymentNumber: e.payment_number || '',
        status: (e.status as EnrollmentStatus) || 'pending',
        createdAt: e.created_at,
        updatedAt: e.updated_at
      }));
    } catch {
      return [];
    }
  },

  /**
   * Submit Course Enrollment (status = 'pending')
   */
  async submitCourseEnrollment(data: {
    userId: string;
    courseId: string;
    amount: number;
    paymentMethod: string;
    transactionId: string;
    paymentNumber?: string;
  }): Promise<{ success: boolean; message: string; enrollment?: CourseEnrollment }> {
    const supabase = getSupabase();
    const successMsg = 'আপনার ভর্তি আবেদন সফলভাবে জমা হয়েছে। Admin অনুমোদনের পর কোর্সটি চালু হবে।';

    if (!supabase) {
      return {
        success: true,
        message: successMsg,
        enrollment: {
          id: `local_${Date.now()}`,
          userId: data.userId,
          courseId: data.courseId,
          amount: data.amount,
          paymentMethod: data.paymentMethod,
          transactionId: data.transactionId,
          paymentNumber: data.paymentNumber,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      };
    }

    try {
      const { data: inserted, error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: data.userId,
          course_id: data.courseId,
          amount: data.amount,
          payment_method: data.paymentMethod,
          transaction_id: data.transactionId,
          payment_number: data.paymentNumber || null,
          status: 'pending'
        })
        .select()
        .maybeSingle();

      if (error) {
        console.warn('Course enrollment insert note:', error.message);
      }

      return {
        success: true,
        message: successMsg,
        enrollment: inserted ? {
          id: String(inserted.id),
          userId: inserted.user_id,
          courseId: inserted.course_id,
          amount: Number(inserted.amount || data.amount),
          paymentMethod: inserted.payment_method || data.paymentMethod,
          transactionId: inserted.transaction_id || data.transactionId,
          paymentNumber: inserted.payment_number || data.paymentNumber,
          status: 'pending',
          createdAt: inserted.created_at
        } : undefined
      };
    } catch {
      return {
        success: true,
        message: successMsg
      };
    }
  },

  // ==========================================
  // 5. EXAM RESULTS & SUBMISSIONS
  // ==========================================

  /**
   * Fetch Exam Results for User from 'exam_results'
   */
  async getExamResults(userId: string): Promise<ExamResult[]> {
    const supabase = getSupabase();
    if (!supabase || !userId) return [];

    try {
      const { data, error } = await supabase
        .from('exam_results')
        .select('*')
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false });

      if (error || !data) return [];

      return data.map((item: any) => ({
        id: String(item.id),
        examId: String(item.exam_id),
        examTitle: item.exam_title || 'মডেল টেস্ট',
        date: item.submitted_at ? new Date(item.submitted_at).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }) : (item.date || 'আজ'),
        score: Number(item.score || 0),
        totalMarks: Number(item.total_marks || 100),
        correctAnswers: Number(item.correct_answers || 0),
        wrongAnswers: Number(item.wrong_answers || 0),
        skippedAnswers: Number(item.skipped_answers || 0),
        timeSpentSeconds: Number(item.time_taken_seconds || item.time_spent_seconds || 0),
        userAnswers: item.user_answers || {},
        rank: item.rank ? Number(item.rank) : undefined,
        totalParticipants: item.total_participants ? Number(item.total_participants) : undefined
      }));
    } catch {
      return [];
    }
  },

  /**
   * Submit Exam Result to 'exam_results'
   */
  async submitExamResult(data: {
    userId: string;
    examId: string;
    courseId?: string;
    examTitle?: string;
    userName?: string;
    institution?: string;
    phone?: string;
    score: number;
    totalMarks: number;
    correctAnswers: number;
    wrongAnswers: number;
    skippedAnswers: number;
    timeSpentSeconds: number;
    userAnswers?: Record<string, number>;
  }): Promise<{ success: boolean }> {
    const supabase = getSupabase();
    if (!supabase) return { success: true };

    try {
      const payload: any = {
        user_id: data.userId,
        exam_id: data.examId,
        course_id: data.courseId || null,
        exam_title: data.examTitle || null,
        user_name: data.userName || null,
        institution: data.institution || null,
        score: data.score,
        total_marks: data.totalMarks,
        correct_answers: data.correctAnswers,
        wrong_answers: data.wrongAnswers,
        skipped_answers: data.skippedAnswers,
        time_taken_seconds: data.timeSpentSeconds,
        user_answers: data.userAnswers || null,
        submitted_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('exam_results')
        .insert(payload);

      if (error) {
        console.warn('Supabase insert exam result notice:', error.message);
      }

      // Also attempt to increment participants count in free_exams / course_exams
      try {
        if (!data.courseId) {
          await supabase.rpc('increment_free_exam_participants', { x_id: data.examId });
        }
      } catch {}

      return { success: !error };
    } catch (err) {
      console.warn('Exception submitting exam result:', err);
      return { success: true };
    }
  },

  // ==========================================
  // 6. LEADERBOARD
  // ==========================================

  /**
   * Fetch Course / Exam Leaderboard from 'course_leaderboard' view or table
   */
  async getLeaderboard(courseOrExamId?: string): Promise<LeaderboardEntry[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    try {
      // 1. First check if results exist in exam_results for this specific exam/course
      if (courseOrExamId) {
        const { data: resultsData, error: rErr } = await supabase
          .from('exam_results')
          .select('*')
          .or(`exam_id.eq.${courseOrExamId},course_id.eq.${courseOrExamId}`)
          .order('score', { ascending: false })
          .order('time_taken_seconds', { ascending: true })
          .limit(50);

        if (!rErr && resultsData && resultsData.length > 0) {
          return resultsData.map((r: any, idx: number) => ({
            id: String(r.id),
            rank: idx + 1,
            name: r.user_name || r.name || 'পরীক্ষার্থী',
            avatar: r.avatar || r.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(r.user_name || r.user_id || idx)}`,
            institution: r.institution || 'মাদ্রাসা / কলেজ',
            correctAnswers: Number(r.correct_answers || 0),
            wrongAnswers: Number(r.wrong_answers || 0),
            score: Number(r.score || 0),
            totalMarks: Number(r.total_marks || 100),
            timeSpentSeconds: Number(r.time_taken_seconds || r.time_spent_seconds || 1200)
          }));
        }
      }

      // 2. Fallback to course_leaderboard view
      let query = supabase.from('course_leaderboard').select('*');
      if (courseOrExamId) {
        query = query.eq('course_id', courseOrExamId);
      }
      const { data, error } = await query.order('rank', { ascending: true }).limit(50);
      
      if (!error && data && data.length > 0) {
        return data.map((item: any, idx: number) => ({
          id: String(item.id || item.user_id || idx),
          rank: Number(item.rank || idx + 1),
          name: item.name || item.user_name || 'পরীক্ষার্থী',
          avatar: item.avatar || item.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(item.name || idx)}`,
          institution: item.institution || 'মাদ্রাসা / কলেজ',
          correctAnswers: Number(item.correct_answers || 0),
          wrongAnswers: Number(item.wrong_answers || 0),
          score: Number(item.score || 0),
          totalMarks: Number(item.total_marks || 100),
          timeSpentSeconds: Number(item.time_taken_seconds || item.time_spent_seconds || 1200)
        }));
      }

      return [];
    } catch {
      return [];
    }
  },

  // ==========================================
  // 7. NOTICES & APP SETTINGS
  // ==========================================

  /**
   * Fetch Notices from app_settings
   */
  async getNotices(): Promise<Notice[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    try {
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'notices')
        .maybeSingle();

      if (data && Array.isArray(data.value)) {
        return data.value.map((n: any, idx: number) => ({
          id: String(n.id || idx),
          title: n.title || '',
          date: n.date || 'আজ',
          tag: n.tag || 'জরুরি',
          content: n.content || '',
          isImportant: Boolean(n.is_important ?? n.isImportant ?? false)
        }));
      }
      return [];
    } catch {
      return [];
    }
  }
};
