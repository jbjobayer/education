import React, { useState } from 'react';
import { 
  Search, 
  Play, 
  Sparkles, 
  BookOpen, 
  Bookmark, 
  FileText, 
  CheckCircle2, 
  Scale, 
  Scroll, 
  PenTool, 
  Feather, 
  Landmark, 
  BookMarked, 
  Languages, 
  Calculator, 
  Globe2, 
  Laptop, 
  Brain,
  Sliders,
  Timer,
  X,
  Zap,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useFont } from '../../context/FontContext';
import { Exam, Question } from '../../types';

interface SubjectItem {
  id: string;
  buttonNo: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  totalQuestions: number;
  sampleQuestions: { q: string; arabic?: string; options: string[]; correctIndex: number; exp: string }[];
}

export const SubjectWiseView: React.FC = () => {
  const { startExam, exams } = useApp();
  const { formatArabicText } = useFont();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubjectForModal, setActiveSubjectForModal] = useState<SubjectItem | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [practiceMode, setPracticeMode] = useState<'exam' | 'practice'>('exam');

  const subjects: SubjectItem[] = [
    {
      id: 'quran_tafsir',
      buttonNo: 1,
      title: 'আল কুরআন ও তাফসির',
      subtitle: 'পবিত্র কুরআনের সূরা, তাফসির, আয়াত সংখ্যা ও সংশ্লিষ্ট তথ্য...',
      icon: BookOpen,
      totalQuestions: 450,
      sampleQuestions: [
        {
          q: 'কুরআন মজিদের সবচেয়ে বড় সূরার নাম কী এবং এতে কতটি আয়াত রয়েছে?',
          arabic: 'مَا هِيَ أَطْوَلُ سُورَةٍ فِي الْقُرْآنِ الْكَرِيمِ؟',
          options: ['সূরা আল-বাকারা (২৮৬ আয়াত)', 'সূরা আলে ইমরান (২০০ আয়াত)', 'সূরা আন-নিসা (১৭৬ আয়াত)', 'সূরা আল-মায়িদাহ (১২০ আয়াত)'],
          correctIndex: 0,
          exp: 'পবিত্র কুরআনের সর্ববৃহৎ সূরা হলো সূরা আল-বাকারা। এতে ২৮৬টি আয়াত এবং ৪০টি রুকু রয়েছে।'
        },
        {
          q: 'কুরআনের কোন সূরাটি পাঠ করলে এক-তৃতীয়াংশ কুরআন পাঠের সমপরিমাণ সওয়াব পাওয়া যায়?',
          arabic: 'أَيُّ سُورَةٍ تَعْدِلُ ثُلُثَ الْقُرْآنِ؟',
          options: ['সূরা আল-ফাতিহা', 'সূরা আল-ইখলাস', 'সূরা আল-ফালাক', 'সূরা ইয়াসিন'],
          correctIndex: 1,
          exp: 'সহীহ বুখারীর হাদিস অনুযায়ী সূরা আল-ইখলাস পাঠ এক-তৃতীয়াংশ কুরআন তিলাওয়াতের সমতুল্য।'
        }
      ]
    },
    {
      id: 'usul_tafsir',
      buttonNo: 2,
      title: 'উসুলুত তাফসির',
      subtitle: 'তাফসিরের নীতি ও সূত্রসমূহ, শানে নুযুল এবং তাফসির গ্রন্থাবলী...',
      icon: Bookmark,
      totalQuestions: 320,
      sampleQuestions: [
        {
          q: 'তাফসির বিল মা’ছুর (التفسير بالمأثور) এর ক্ষেত্রে প্রধান উৎস কোনটি?',
          arabic: 'مَا هُوَ الْمَصْدَرُ الأَوَّلُ فِي التَّفْسِيرِ بِالْمَأْثُورِ؟',
          options: ['কুরআন দ্বারা কুরআনের ব্যাখ্যা', 'ব্যক্তিগত রায় বা ইজতিহাদ', 'ইজমায়ে উম্মত', 'প্রাচীন আরবি কবিতা'],
          correctIndex: 0,
          exp: 'তাফসির বিল মাছুরের সর্বোৎকৃষ্ট স্তর হলো কুরআন দ্বারা কুরআনের অপর আয়াতের ব্যাখ্যা করা।'
        }
      ]
    },
    {
      id: 'hadith',
      buttonNo: 3,
      title: 'আল হাদিস',
      subtitle: 'সিহাহ সিত্তা, হাদিস সংকলনের ইতিহাস ও রাসুলুল্লাহ (সা:)...',
      icon: FileText,
      totalQuestions: 500,
      sampleQuestions: [
        {
          q: 'হাদিস শাস্ত্রের প্রসিদ্ধ ছয়টি গ্রন্থ (সিহাহ সিত্তা)-এর মধ্যে প্রধানতম কোনটি?',
          arabic: 'مَا هُوَ أَصَحُّ كِتَابٍ بَعْدَ كِتَابِ اللَّهِ تَعَالَى؟',
          options: ['সহীহ আল-বুখারী', 'সহীহ মুসলিম', 'সুনান আন-নাসায়ী', 'জামে আত-তিরমিযী'],
          correctIndex: 0,
          exp: 'ইমাম বুখারী (রহ.) সংকলিত ‘আল-জামি আস-সহীহ’ কিতাবুল্লাহর পর সর্বশ্রেষ্ঠ বিশুদ্ধ গ্রন্থ।'
        }
      ]
    },
    {
      id: 'usul_hadith',
      buttonNo: 4,
      title: 'উসুলুল হাদিস',
      subtitle: 'হাদিসের প্রকারভেদ (সহীহ, হাসান, জয়ীফ), সনদ ও রাবী পরিচয়...',
      icon: CheckCircle2,
      totalQuestions: 280,
      sampleQuestions: [
        {
          q: 'যে হাদিসের সনদে রাসুলুল্লাহ (সা.) পর্যন্ত নিরবচ্ছিন্ন সূত্র থাকে তাকে কী বলে?',
          arabic: 'مَا هُوَ الْحَدِيثُ الْمُتَّصِلُ السَّنَدِ؟',
          options: ['হাদিসে মুত্তাসিল / মারফু', 'হাদিসে মুরসাল', 'হাদিসে মুনকাতি', 'হাদিসে মুদাল্লাস'],
          correctIndex: 0,
          exp: 'যে হাদিসের বর্ণনাকারী সূত্র রাসুলুল্লাহ (সা.) পর্যন্ত অবিচ্ছিন্ন থাকে তাকে মারফু মুত্তাসিল হাদিস বলে।'
        }
      ]
    },
    {
      id: 'fiqh',
      buttonNo: 5,
      title: 'আল ফিকহ ও ফাতওয়া',
      subtitle: 'ইবাদাত, মুয়ামালাত, মুয়াশারাত ও সমসাময়িক ফিকহি মাসআলা...',
      icon: Scale,
      totalQuestions: 420,
      sampleQuestions: [
        {
          q: 'হানাফী মাজহাবের মূল প্রতিষ্ঠাতা কে এবং তাঁর ওফাত কত হিজরি সনে?',
          arabic: 'مَنْ هُوَ إِمَامُ الْمَذْهَبِ الْحَنَفِيِّ؟',
          options: ['ইমাম আবু হানিফা (১৫০ হি.)', 'ইমাম শাফেয়ী (২০৪ হি.)', 'ইমাম মালেক (১৭৯ হি.)', 'ইমাম আহমদ (২৪১ হি.)'],
          correctIndex: 0,
          exp: 'ইমাম আবু হানিফা নোমান ইবনে সাবিত (রহ.) হানাফি মাজহাবের প্রতিষ্ঠাতা। তিনি ১৫০ হিজরিতে ইন্তেকাল করেন।'
        }
      ]
    },
    {
      id: 'usul_fiqh',
      buttonNo: 6,
      title: 'উসুলুল ফিকহ',
      subtitle: 'ফিকহের উসুল, আদিল্লায়ে আরবাআ (কুরআন, সুন্নাহ, ইজমা, কিয়াস)...',
      icon: Scroll,
      totalQuestions: 260,
      sampleQuestions: [
        {
          q: 'শরীয়তের দলীলসমূহের মধ্যে ‘আদিল্লায়ে আরবাআ’ (চারটি মৌলিক দলীল) কোনগুলো?',
          arabic: 'مَا هِيَ الأَدِلَّةُ الشَّرْعِيَّةُ الأَرْبَعَةُ؟',
          options: ['কুরআন, সুন্নাহ, ইজমা ও কিয়াস', 'কুরআন, হাদিস, ইস্তিহসান ও উরফ', 'কুরআন, তাফসির, ফতোয়া ও কাযা', 'কুরআন, সুন্নাহ, মাসলাহাত ও রুখসাত'],
          correctIndex: 0,
          exp: 'ফিকহে ইসলামের চারটি প্রধান উৎস হলো কিতাবুল্লাহ, সুন্নাতে রাসুল, ইজমায়ে উম্মত ও কিয়াস।'
        }
      ]
    },
    {
      id: 'arabic_grammar',
      buttonNo: 7,
      title: 'আরবি ব্যাকরণ (নাহু ও সরফ)',
      subtitle: 'ইলমুন নাহু ও ইলমুস সরফের মৌলিক কাওয়াইদ ও তরিক...',
      icon: PenTool,
      totalQuestions: 380,
      sampleQuestions: [
        {
          q: 'আরবিতে ‘কালিমা’ প্রধানত কত প্রকার?',
          arabic: 'كَمْ أَقْسَامُ الْكَلِمَةِ فِي اللُّغَةِ الْعَرَبِيَّةِ؟',
          options: ['৩ প্রকার (ইসম, ফেল, হরফ)', '৪ প্রকার', '৫ প্রকার', '২ প্রকার'],
          correctIndex: 0,
          exp: 'আরবি ভাষায় কালিমা তিন প্রকার: ইসম (বিশেষ্য/সর্বনাম), ফেল (ক্রিয়া) ও হরফ (অব্যয়)।'
        }
      ]
    },
    {
      id: 'arabic_lit',
      buttonNo: 8,
      title: 'আরবি সাহিত্য ও অনুবাদ',
      subtitle: 'আরবি গদ্য ও পদ্যের ইতিহাস, শায়ের ও অনুবাদ কৌশল...',
      icon: Feather,
      totalQuestions: 290,
      sampleQuestions: [
        {
          q: 'জাহেলি যুগের সপ্ত ঝুলন্ত কবিতা (সাবআ মুয়াল্লাকা)-এর অন্যতম কবি কে?',
          arabic: 'مَنْ هُوَ شَاعِرُ الْمُعَلَّقَاتِ الشَّهِيرُ؟',
          options: ['ইমরুল কায়েস', 'আল-মুতানাব্বী', 'আহমদ শওকী', 'ইমরান ইবনে হিত্তান'],
          correctIndex: 0,
          exp: 'ইমরুল কায়েস জাহেলি যুগের অন্যতম প্রধান কবি এবং তাঁর মুয়াল্লাকা কাবাগৃহে ঝুলানো হয়েছিল।'
        }
      ]
    },
    {
      id: 'islamic_history',
      buttonNo: 9,
      title: 'ইসলামের ইতিহাস ও সংস্কৃতি',
      subtitle: 'খোলাফায়ে রাশেদীন, উমাইয়া, আব্বাসীয় ও মুসলিম সালতানাত...',
      icon: Landmark,
      totalQuestions: 340,
      sampleQuestions: [
        {
          q: 'হিজরি সনের প্রবর্তন করেন কোন খলিফা?',
          arabic: 'مَنْ هُوَ الْخَلِيفَةُ الَّذِي وَضَعَ التَّارِيخَ الْهِجْرِيَّ؟',
          options: ['হযরত ওমর ইবনুল খাত্তাব (রা.)', 'হযরত আবু বকর সিদ্দিক (রা.)', 'হযরত ওসমান গনি (রা.)', 'হযরত আলী (রা.)'],
          correctIndex: 0,
          exp: 'আমিরুল মুমিনীন হযরত ওমর ইবনুল খাত্তাব (রা.) ১৬ বা ১৭ হিজরিতে হিজরি সন গণনা শুরু করেন।'
        }
      ]
    },
    {
      id: 'bangla',
      buttonNo: 10,
      title: 'বাংলা ভাষা ও সাহিত্য',
      subtitle: 'বাংলা ব্যাকরণ, প্রাচীন, মধ্য ও আধুনিক যুগের সাহিত্য...',
      icon: BookMarked,
      totalQuestions: 400,
      sampleQuestions: [
        {
          q: 'বাংলা সাহিত্যের প্রাচীনতম নিদর্শন ‘চর্যাপদ’ কত সালে আবিষ্কৃত হয়?',
          options: ['১৯০৭ সালে (হরপ্রসাদ শাস্ত্রী কর্তৃক)', '১৯০৯ সালে', '১৯২০ সালে', '১৮৯৮ সালে'],
          correctIndex: 0,
          exp: 'মহামহোপাধ্যায় হরপ্রসাদ শাস্ত্রী ১৯০৭ সালে নেপালের রাজদরবারের রয়েল লাইব্রেরি থেকে চর্যাপদের পুথি আবিষ্কার করেন।'
        }
      ]
    },
    {
      id: 'english',
      buttonNo: 11,
      title: 'English Language & Grammar',
      subtitle: 'Grammar rules, Vocabulary, Idioms, Translation & Comprehension...',
      icon: Languages,
      totalQuestions: 380,
      sampleQuestions: [
        {
          q: 'What is the synonym of the word "Diligent"?',
          options: ['Hardworking / Industrious', 'Lazy', 'Careless', 'Arrogant'],
          correctIndex: 0,
          exp: '"Diligent" means showing care and conscientiousness in one’s work; synonymous with hardworking.'
        }
      ]
    },
    {
      id: 'math',
      buttonNo: 12,
      title: 'গণিত ও মানসিক দক্ষতা',
      subtitle: 'পাটিগণিত, বীজগণিত, জ্যামিতি ও মানসিক পারদর্শিতা...',
      icon: Calculator,
      totalQuestions: 350,
      sampleQuestions: [
        {
          q: 'কোনো সংখ্যার ৪০% এর সাথে ৪২ যোগ করলে যোগফল সংখ্যাটিই হয়। সংখ্যাটি কত?',
          options: ['৭০', '৬০', '৮০', '৯০'],
          correctIndex: 0,
          exp: 'ধরি সংখ্যাটি x। শর্তমতে, 0.40x + 42 = x => 0.60x = 42 => x = 42/0.60 = 70।'
        }
      ]
    },
    {
      id: 'gk',
      buttonNo: 13,
      title: 'বাংলাদেশ ও আন্তর্জাতিক বিষয়াবলি',
      subtitle: 'মুক্তিযুদ্ধ, সংবিধান, ভৌগোলিক বিষয় ও সাম্প্রতিক বিষয়াবলি...',
      icon: Globe2,
      totalQuestions: 420,
      sampleQuestions: [
        {
          q: 'গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধানের মূলনীতি কয়টি?',
          options: ['৪টি (জাতীয়তাবাদ, সমাজতন্ত্র, গণতন্ত্র ও ধর্মনিরপেক্ষতা)', '৩টি', '৫টি', '৭টি'],
          correctIndex: 0,
          exp: 'বাংলাদেশের সংবিধানের ৮(১) অনুচ্ছেদ অনুসারে রাষ্ট্রীয় মূলনীতি ৪টি।'
        }
      ]
    },
    {
      id: 'ict',
      buttonNo: 14,
      title: 'আইসিটি ও কম্পিউটার জ্ঞান',
      subtitle: 'কম্পিউটার হার্ডওয়্যার, নেটওয়ার্ক, ইন্টারনেট ও কৃত্রিম বুদ্ধিমত্তা...',
      icon: Laptop,
      totalQuestions: 250,
      sampleQuestions: [
        {
          q: 'কম্পিউটারের মস্তিষ্ক (Brain of Computer) কাকে বলা হয়?',
          options: ['CPU (Central Processing Unit)', 'RAM', 'Hard Disk', 'Motherboard'],
          correctIndex: 0,
          exp: 'CPU সমস্ত গাণিতিক ও যৌক্তিক নিয়ন্ত্রণ পরিচালনা করে বলে একে কম্পিউটারের মস্তিষ্ক বলা হয়।'
        }
      ]
    },
    {
      id: 'science',
      buttonNo: 15,
      title: 'সাধারণ বিজ্ঞান ও ভূগোল',
      subtitle: 'দৈনন্দিন বিজ্ঞান, স্বাস্থ্য, পরিবেশ ও দূর্যোগ ব্যবস্থাপনা...',
      icon: Brain,
      totalQuestions: 270,
      sampleQuestions: [
        {
          q: 'সূর্যের আলো থেকে মানুষ প্রধানত কোন ভিটামিন পায়?',
          options: ['ভিটামিন D', 'ভিটামিন A', 'ভিটামিন C', 'ভিটামিন B-12'],
          correctIndex: 0,
          exp: 'সূর্যালোকের অতিবেগুনি রশ্মির প্রভাবে মানব ত্বকে ভিটামিন ডি সংশ্লেষিত হয়।'
        }
      ]
    }
  ];

  const filteredSubjects = subjects.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartAllSubjects100Test = () => {
    // Check if there is an existing live 100-mark test in context
    const fullTest = exams.find(e => e.totalQuestions >= 50) || exams[0];
    if (fullTest) {
      startExam(fullTest);
    } else {
      // Generate a comprehensive 100 question mock exam
      const allSampleQs: Question[] = [];
      subjects.forEach((sub, sIdx) => {
        sub.sampleQuestions.forEach((sq, qIdx) => {
          allSampleQs.push({
            id: `gen_q_${sIdx}_${qIdx}`,
            question: sq.q,
            arabicQuestion: sq.arabic,
            options: sq.options,
            correctIndex: sq.correctIndex,
            explanation: sq.exp,
            subject: sub.title
          });
        });
      });

      const customExam: Exam = {
        id: 'all_subjects_100_test',
        title: 'সর্বদলীয় শিক্ষক নিবন্ধন পূর্ণাঙ্গ মডেল টেস্ট (১০০ প্রশ্ন)',
        category: 'model_test',
        subject: 'সকল বিষয় (মাদ্রাসা ও সাধারণ)',
        totalMarks: 100,
        durationMinutes: 60,
        negativeMarking: 0.25,
        totalQuestions: allSampleQs.length,
        status: 'running',
        participantsCount: 3840,
        questions: allSampleQs
      };
      startExam(customExam);
    }
  };

  const handleLaunchSubjectTest = () => {
    if (!activeSubjectForModal) return;

    const sub = activeSubjectForModal;
    const generatedQs: Question[] = [];
    
    // Duplicate or prepare questions up to selected count
    for (let i = 0; i < questionCount; i++) {
      const sample = sub.sampleQuestions[i % sub.sampleQuestions.length];
      generatedQs.push({
        id: `${sub.id}_q_${i + 1}`,
        question: `[প্রশ্ন ${i + 1}] ${sample.q}`,
        arabicQuestion: sample.arabic,
        options: sample.options,
        correctIndex: sample.correctIndex,
        explanation: sample.exp,
        subject: sub.title
      });
    }

    const duration = practiceMode === 'exam' ? Math.ceil(questionCount * 0.75) : Math.ceil(questionCount * 1.5);

    const customSubjectExam: Exam = {
      id: `exam_${sub.id}_${Date.now()}`,
      title: `${sub.title} — বিষয়ভিত্তিক বিশেষ প্রস্তুতি টেস্ট`,
      category: 'subject',
      subject: sub.title,
      totalMarks: questionCount,
      durationMinutes: duration,
      negativeMarking: practiceMode === 'exam' ? 0.25 : 0,
      totalQuestions: questionCount,
      status: 'running',
      participantsCount: 1420,
      questions: generatedQs
    };

    setActiveSubjectForModal(null);
    startExam(customSubjectExam);
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-fadeIn max-w-4xl mx-auto pb-10">
      {/* 1. Hero Neumorphic Card matching Screenshot 2 */}
      <div className="p-5 sm:p-7 rounded-3xl neu-card border border-white/60 dark:border-slate-800/80 transition-colors">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-black mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>১৫টি বিষয়ভিত্তিক বিশেষ প্রস্তুতি</span>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight mb-2">
          বিষয়ভিত্তিক প্রস্তুতি ও অনুশীলন
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-medium mb-5">
          নিচের বিষয়ের বাটন সমূহে ক্লিক করে আপনার সুবিধামতো প্রশ্ন সংখ্যা ও সময়সীমা সেট করুন।
        </p>

        {/* Action Button: All Subjects 100 Test */}
        <button
          onClick={handleStartAllSubjects100Test}
          className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl neu-btn text-slate-800 dark:text-slate-100 font-black text-xs sm:text-sm flex items-center gap-2 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer select-none active:scale-95 shadow-sm border border-amber-400/40"
        >
          <Play className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>সব বিষয়ের ১০০ প্রশ্নের টেস্ট</span>
        </button>
      </div>

      {/* 2. Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="বিষয় খুঁজুন (যেমন: ফিকহ, আরবি ব্যাকরণ, গণিত, কুরআন)..."
          className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm neu-inset rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#005a36] font-medium"
        />
      </div>

      {/* 3. Subject List Cards */}
      <div className="space-y-3">
        {filteredSubjects.map((sub) => {
          const Icon = sub.icon;

          return (
            <div
              key={sub.id}
              onClick={() => setActiveSubjectForModal(sub)}
              className="p-3.5 sm:p-4 rounded-3xl neu-card hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group select-none active:scale-[0.99]"
            >
              {/* Left Icon + Text */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl neu-btn flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:text-[#005a36] dark:group-hover:text-emerald-400 transition-colors shrink-0">
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-[#005a36] dark:group-hover:text-emerald-400 transition-colors truncate">
                    {sub.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                    {sub.subtitle}
                  </p>
                </div>
              </div>

              {/* Right Action Button matching Screenshot 2: [বাটন #X] */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSubjectForModal(sub);
                }}
                className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl neu-btn text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:bg-[#005a36] group-hover:text-white dark:group-hover:bg-emerald-600 transition-all shrink-0 whitespace-nowrap"
              >
                বাটন #{sub.buttonNo}
              </button>
            </div>
          );
        })}
      </div>

      {/* Subject Test Setup Modal */}
      {activeSubjectForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div 
            className="fixed inset-0" 
            onClick={() => setActiveSubjectForModal(null)} 
          />

          <div className="relative w-full max-w-md bg-[#e9edf5] dark:bg-[#101927] rounded-3xl neu-card shadow-2xl flex flex-col overflow-hidden z-10">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#005a36] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                  <BookOpen className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.2 rounded-full">
                    বাটন #{activeSubjectForModal.buttonNo}
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-white mt-0.5">
                    {activeSubjectForModal.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveSubjectForModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                {activeSubjectForModal.subtitle}
              </p>

              {/* Choose Question Count */}
              <div>
                <label className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mb-2">
                  <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                  প্রশ্ন সংখ্যা নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 20, 50].map((count) => (
                    <button
                      key={count}
                      onClick={() => setQuestionCount(count)}
                      className={`py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        questionCount === count
                          ? 'bg-[#005a36] text-white shadow-sm ring-1 ring-emerald-500'
                          : 'neu-btn text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {count}টি প্রশ্ন
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Selection */}
              <div>
                <label className="text-xs font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mb-2">
                  <Timer className="w-3.5 h-3.5 text-amber-500" />
                  অনুশীলন মোড:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPracticeMode('exam')}
                    className={`p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                      practiceMode === 'exam'
                        ? 'border-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 shadow-xs'
                        : 'neu-btn text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1 font-black text-xs">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>রিয়েল এক্সাম মোড</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">টাইমার ও নেগেটিভ মার্কিং সহ</p>
                  </button>

                  <button
                    onClick={() => setPracticeMode('practice')}
                    className={`p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                      practiceMode === 'practice'
                        ? 'border-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 shadow-xs'
                        : 'neu-btn text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1 font-black text-xs">
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>সেলফ স্টাডি মোড</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">তাৎক্ষণিক উত্তর ও ব্যাখ্যা</p>
                  </button>
                </div>
              </div>

              {/* Sample Question Preview */}
              {activeSubjectForModal.sampleQuestions.length > 0 && (
                <div className="p-3 rounded-2xl neu-inset">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    নমুনা প্রশ্ন প্রিভিউ:
                  </span>
                  {activeSubjectForModal.sampleQuestions[0].arabic && (
                    <p 
                      className="text-right text-xs text-[#005a36] dark:text-emerald-300 font-arabic font-bold mb-1"
                      dir="rtl"
                    >
                      {formatArabicText(activeSubjectForModal.sampleQuestions[0].arabic)}
                    </p>
                  )}
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                    {activeSubjectForModal.sampleQuestions[0].q}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 sm:p-4 bg-[#e4e9f2] dark:bg-[#0b121d] border-t border-white/60 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveSubjectForModal(null)}
                className="px-4 py-2 rounded-xl neu-btn text-xs font-bold text-slate-600 dark:text-slate-400 cursor-pointer"
              >
                বাতিল
              </button>

              <button
                onClick={handleLaunchSubjectTest}
                className="px-6 py-2 rounded-xl neu-btn-primary text-xs font-black flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>টেস্ট শুরু করুন ({questionCount}টি প্রশ্ন)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
