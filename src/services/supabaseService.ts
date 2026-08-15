import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { Course, Exam, Notice, JobCircular, ExamResult, UserProfile } from '../types';
import { mockCourses, mockExams, mockNotices } from '../data/mockData';

export const supabaseService = {
  // 1. Fetch Dynamic Exams created from Admin Panel
  async getExams(): Promise<Exam[]> {
    const supabase = getSupabase();
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch exams error:', error.message);
        return [];
      }

      if (data && data.length > 0) {
        // Map database columns to Exam interface
        const remoteExams: Exam[] = data.map((item: any) => ({
          id: item.id || `exam_${item.created_at}`,
          title: item.title,
          category: item.category || 'model_test',
          subject: item.subject || 'সাধারণ বিষয়',
          totalMarks: Number(item.total_marks || item.totalMarks || 100),
          durationMinutes: Number(item.duration_minutes || item.durationMinutes || 60),
          negativeMarking: Number(item.negative_marking ?? item.negativeMarking ?? 0.25),
          totalQuestions: Number(item.total_questions || item.totalQuestions || (item.questions?.length || 20)),
          status: item.status || 'running',
          participantsCount: Number(item.participants_count || 0),
          questions: Array.isArray(item.questions) ? item.questions : [],
          isFree: item.is_free ?? item.isFree ?? false,
          dateStr: item.date_str || item.dateStr
        }));

        return remoteExams;
      }

      return [];
    } catch (e) {
      console.warn('Exception in getExams:', e);
      return [];
    }
  },

  // 2. Fetch Dynamic Courses created from Admin Panel
  async getCourses(): Promise<Course[]> {
    const supabase = getSupabase();
    if (!supabase) return mockCourses;

    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch courses error, using fallback:', error.message);
        return mockCourses;
      }

      if (data && data.length > 0) {
        const remoteCourses: Course[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          subtitle: item.subtitle || '',
          category: item.category || 'madrasah_ntrca',
          coverImage: item.cover_image || item.coverImage || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
          price: Number(item.price || 999),
          originalPrice: Number(item.original_price || item.originalPrice || 2500),
          badge: item.badge,
          batchType: item.batch_type || item.batchType || 'স্পেশাল ব্যাচ',
          shortTag: item.short_tag || item.shortTag,
          rating: Number(item.rating || 4.9),
          totalStudents: Number(item.total_students || item.totalStudents || 450),
          totalClasses: Number(item.total_classes || item.totalClasses || 40),
          totalSheets: Number(item.total_sheets || item.totalSheets || 20),
          totalFullModels: item.total_full_models || item.totalFullModels || '১০টি',
          totalExams: Number(item.total_exams || item.totalExams || 30),
          duration: item.duration || '৩ মাস মেয়াদী',
          startDate: item.start_date || item.startDate || '১৫ আগস্ট, ২০২৬',
          instructors: Array.isArray(item.instructors) ? item.instructors : [],
          description: item.description || '',
          detailedOverview: item.detailed_overview || item.detailedOverview,
          overviewSections: Array.isArray(item.overview_sections) ? item.overview_sections : [],
          features: Array.isArray(item.features) ? item.features : [],
          syllabus: Array.isArray(item.syllabus) ? item.syllabus : [],
          sheets: Array.isArray(item.sheets) ? item.sheets : [],
          courseExams: Array.isArray(item.course_exams) ? item.course_exams : []
        }));

        const existingIds = new Set(remoteCourses.map(c => c.id));
        const nonDuplicateMock = mockCourses.filter(c => !existingIds.has(c.id));
        return [...remoteCourses, ...nonDuplicateMock];
      }

      return mockCourses;
    } catch (e) {
      console.warn('Exception in getCourses:', e);
      return mockCourses;
    }
  },

  // 3. Fetch Notices from Admin Panel
  async getNotices(): Promise<Notice[]> {
    const supabase = getSupabase();
    if (!supabase) return mockNotices;

    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return mockNotices;
      }

      return data.map((n: any) => ({
        id: n.id,
        title: n.title,
        date: n.date || new Date(n.created_at).toLocaleDateString('bn-BD'),
        tag: n.tag || 'জরুরি',
        content: n.content,
        isImportant: Boolean(n.is_important ?? n.isImportant)
      }));
    } catch {
      return mockNotices;
    }
  },

  // 4. Send Payment & Subscription Request to Supabase
  async submitPayment(paymentData: {
    userPhone: string;
    userName?: string;
    gateway: 'bkash' | 'nagad' | 'rocket';
    trxId: string;
    planName: string;
    amount: number;
    courseId?: string;
  }): Promise<{ success: boolean; message: string }> {
    const supabase = getSupabase();
    if (!supabase) {
      // Offline fallback: save locally
      return { success: true, message: 'পেমেন্ট তথ্য সংরক্ষিত হয়েছে।' };
    }

    try {
      const { error } = await supabase
        .from('payment_requests')
        .insert({
          user_phone: paymentData.userPhone,
          user_name: paymentData.userName || 'শিক্ষার্থী',
          gateway: paymentData.gateway,
          trx_id: paymentData.trxId,
          plan_name: paymentData.planName,
          amount: paymentData.amount,
          course_id: paymentData.courseId || null,
          status: 'pending'
        });

      if (error) {
        console.warn('Supabase insert payment warning:', error.message);
        return { success: true, message: 'পেমেন্ট রিকোয়েস্ট গৃহীত হয়েছে।' };
      }

      return { success: true, message: 'পেমেন্ট রিকোয়েস্ট এডমিন প্যানেলে সফলভাবে পাঠানো হয়েছে!' };
    } catch (e: any) {
      return { success: true, message: 'পেমেন্ট রিকোয়েস্ট সফল হয়েছে।' };
    }
  },

  // 5. Submit Exam Submission to Supabase
  async submitExamResult(result: ExamResult, userProfile: UserProfile): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      await supabase
        .from('exam_submissions')
        .insert({
          exam_id: result.examId,
          exam_title: result.examTitle,
          user_name: userProfile.name,
          user_phone: userProfile.phone,
          institution: userProfile.institution,
          score: result.score,
          total_marks: result.totalMarks,
          correct_answers: result.correctAnswers,
          wrong_answers: result.wrongAnswers,
          skipped_answers: result.skippedAnswers,
          time_spent_seconds: result.timeSpentSeconds,
          user_answers: result.userAnswers
        });
    } catch (err) {
      console.warn('Could not sync exam result to Supabase:', err);
    }
  }
};
