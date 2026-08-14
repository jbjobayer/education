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
  HelpCircle,
  ChevronRight,
  Lock,
  Crown,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useFont } from '../../context/FontContext';
import { Exam, Question } from '../../types';
import { SubscriptionModal } from '../modals/SubscriptionModal';
import { SUBSCRIPTION_PLANS } from '../../data/subscriptionPlans';

interface SubjectItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  totalQuestions: number;
  sampleQuestions: { q: string; arabic?: string; options: string[]; correctIndex: number; exp: string }[];
}

export const SubjectWiseView: React.FC = () => {
  const { startExam, exams, userProfile, isPremiumMember } = useApp();
  const { formatArabicText } = useFont();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubjectForModal, setActiveSubjectForModal] = useState<SubjectItem | null>(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [practiceMode, setPracticeMode] = useState<'exam' | 'practice'>('exam');

  const subjects: SubjectItem[] = [
    {
      id: 'quran_tafsir',
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

  const handleSubjectClick = (sub: SubjectItem) => {
    if (!isPremiumMember) {
      setIsSubscriptionModalOpen(true);
      return;
    }
    setActiveSubjectForModal(sub);
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
      {/* 1. Hero Neumorphic Card with Green Typography & Premium Status */}
      <div className="p-5 sm:p-7 rounded-3xl neu-card border-2 border-emerald-600/30 dark:border-emerald-500/30 transition-colors relative overflow-hidden">
        {/* Background Subtle Gradient */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {isPremiumMember ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/40 text-[#005a36] dark:text-emerald-300 text-xs font-black shadow-xs">
              <Crown className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>সক্রিয় প্যাকেজ: {userProfile.subscriptionPlanName || 'প্রিমিয়াম মেম্বার'}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-400/50 text-amber-900 dark:text-amber-300 text-xs font-black shadow-xs">
              <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>প্রিমিয়াম মেম্বারশিপ ফিচার</span>
            </div>
          )}

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-600/20 text-[#005a36] dark:text-emerald-300 text-[11px] font-bold">
            <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            ১৫টি বিষয়ভিত্তিক বিশেষ প্রস্তুতি
          </span>
        </div>

        {/* Title in Rich Green */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#005a36] dark:text-emerald-400 tracking-tight leading-tight mb-2">
          বিষয়ভিত্তিক প্রস্তুতি ও অনুশীলন
        </h2>

        {/* Subtitle in Green / Emerald Tone */}
        <p className="text-xs sm:text-sm text-emerald-900/85 dark:text-emerald-200/90 leading-relaxed max-w-2xl font-medium mb-4">
          {isPremiumMember ? (
            <>
              আপনার প্রিমিয়াম প্যাকেজের আওতায় সকল বিষয়ের ৫,০০০+ প্রশ্নব্যাংক সম্পূর্ণ আনলক রয়েছে। নিচের যেকোনো বিষয়ে ক্লিক করে কাস্টম প্রশ্ন সংখ্যা ও মোড অনুযায়ী অনুশীলন শুরু করুন।
            </>
          ) : (
            <>
              এই বিষয়ভিত্তিক অনুশীলন সুবিধাটি <strong className="text-[#005a36] dark:text-emerald-300 font-black">মাসিক, ত্রৈমাসিক, ষান্মাসিক ও বাৎসরিক প্যাকেজ</strong> ক্রয়কারী প্রিমিয়াম মেম্বারদের জন্য সংরক্ষিত। প্যাকেজ সাবস্ক্রাইব করে সকল বিষয়ের পূর্ণ এক্সেস আনলক করুন।
            </>
          )}
        </p>

        {/* Plan Cards / Action Strip */}
        {isPremiumMember ? (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-emerald-600/15 dark:border-emerald-500/20">
            <div className="flex items-center gap-2 text-xs font-bold text-[#005a36] dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>১৫টি বিষয়ের সকল প্রশ্ন ও ব্যাখ্যা সম্পূর্ণ আনলকড</span>
              {userProfile.subscriptionExpiryDate && (
                <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium ml-1">
                  (মেয়াদ: {userProfile.subscriptionExpiryDate})
                </span>
              )}
            </div>
            <button
              onClick={() => setIsSubscriptionModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl neu-btn text-[11px] font-bold text-[#005a36] dark:text-emerald-300 border border-emerald-600/20 hover:border-amber-400 transition-all cursor-pointer flex items-center gap-1"
            >
              <Crown className="w-3 h-3 text-amber-500" />
              <span>প্যাকেজ পরিবর্তন / রিনিউ</span>
            </button>
          </div>
        ) : (
          <div className="pt-3 border-t border-emerald-600/15 dark:border-emerald-500/20 space-y-3">
            {/* Quick 4 Package Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div 
                onClick={() => setIsSubscriptionModalOpen(true)}
                className="p-2 sm:p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-emerald-600/20 hover:border-emerald-600 cursor-pointer transition-all text-center"
              >
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">মাসিক</span>
                <span className="text-xs sm:text-sm font-black text-[#005a36] dark:text-emerald-400">৳১৯৯</span>
              </div>
              <div 
                onClick={() => setIsSubscriptionModalOpen(true)}
                className="p-2 sm:p-2.5 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-500 hover:border-amber-400 cursor-pointer transition-all text-center relative"
              >
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded-full">
                  জনপ্রিয় 🔥
                </span>
                <span className="text-[10px] text-emerald-900 dark:text-emerald-300 block font-bold">ত্রৈমাসিক (৩ মাস)</span>
                <span className="text-xs sm:text-sm font-black text-[#005a36] dark:text-emerald-400">৳৪৯৯</span>
              </div>
              <div 
                onClick={() => setIsSubscriptionModalOpen(true)}
                className="p-2 sm:p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-emerald-600/20 hover:border-emerald-600 cursor-pointer transition-all text-center"
              >
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-bold">ষান্মাসিক (৬ মাস)</span>
                <span className="text-xs sm:text-sm font-black text-[#005a36] dark:text-emerald-400">৳৮৯৯</span>
              </div>
              <div 
                onClick={() => setIsSubscriptionModalOpen(true)}
                className="p-2 sm:p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-400/50 hover:border-amber-400 cursor-pointer transition-all text-center"
              >
                <span className="text-[10px] text-amber-800 dark:text-amber-300 block font-bold">বাৎসরিক (১ বছর)</span>
                <span className="text-xs sm:text-sm font-black text-[#005a36] dark:text-emerald-400">৳১৪৯৯ 👑</span>
              </div>
            </div>

            {/* Unlock CTA Button */}
            <button
              onClick={() => setIsSubscriptionModalOpen(true)}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-2xl neu-btn-primary text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer border border-amber-400/50"
            >
              <Crown className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>প্যাকেজসমূহ দেখুন ও সম্পূর্ণ আনলক করুন</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Search Input in Emerald Styling */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="বিষয় খুঁজুন (যেমন: ফিকহ, আরবি ব্যাকরণ, গণিত, কুরআন)..."
          className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm neu-inset rounded-2xl text-emerald-950 dark:text-emerald-100 placeholder-emerald-800/50 dark:placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-[#005a36] font-medium border border-emerald-600/20 dark:border-emerald-500/20"
        />
      </div>

      {/* 3. Subject List Cards */}
      <div className="space-y-3">
        {filteredSubjects.map((sub) => {
          const Icon = sub.icon;

          return (
            <div
              key={sub.id}
              onClick={() => handleSubjectClick(sub)}
              className={`p-3.5 sm:p-4 rounded-3xl neu-card border transition-all cursor-pointer flex items-center justify-between gap-3 group select-none active:scale-[0.99] ${
                isPremiumMember
                  ? 'border-emerald-600/20 hover:border-emerald-600/60 dark:border-emerald-500/25 dark:hover:border-amber-400/70 hover:shadow-md'
                  : 'border-slate-300/60 dark:border-slate-800/80 hover:border-amber-400/70 bg-gradient-to-r from-transparent via-emerald-50/20 to-transparent dark:via-emerald-950/10'
              }`}
            >
              {/* Left Icon + Text in Green Typography */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl neu-btn flex items-center justify-center transition-all shrink-0 border ${
                  isPremiumMember
                    ? 'border-emerald-600/30 dark:border-emerald-500/30 text-[#005a36] dark:text-emerald-400 group-hover:text-amber-500 dark:group-hover:text-amber-300 group-hover:border-amber-400/60'
                    : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 group-hover:text-[#005a36]'
                }`}>
                  {isPremiumMember ? (
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  ) : (
                    <div className="relative">
                      <Icon className="w-5 h-5 stroke-[1.8] opacity-70" />
                      <Lock className="w-3 h-3 text-amber-500 absolute -bottom-1 -right-1 stroke-[2.5]" />
                    </div>
                  )}
                </div>
                
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-sm sm:text-base text-[#005a36] dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors truncate">
                      {sub.title}
                    </h4>
                    
                    {isPremiumMember ? (
                      <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-[#005a36] dark:text-emerald-300 border border-emerald-400/30 shrink-0">
                        {sub.totalQuestions}টি প্রশ্ন
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300/40 dark:border-amber-700/40 shrink-0">
                        <Lock className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                        <span>লক করা</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-emerald-900/70 dark:text-emerald-200/70 truncate mt-0.5 font-medium">
                    {sub.subtitle}
                  </p>
                </div>
              </div>

              {/* Right Action Button */}
              {isPremiumMember ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSubjectForModal(sub);
                  }}
                  className="px-3.5 sm:px-4 py-2 rounded-xl neu-btn text-xs font-bold text-[#005a36] dark:text-emerald-300 border border-emerald-600/35 hover:border-amber-400 dark:border-emerald-500/40 dark:hover:border-amber-400/80 group-hover:bg-[#005a36] group-hover:text-white dark:group-hover:bg-emerald-600 dark:group-hover:text-white transition-all shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                >
                  <span>অনুশীলন শুরু</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all" />
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSubscriptionModalOpen(true);
                  }}
                  className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl neu-btn text-xs font-bold text-amber-800 dark:text-amber-300 border border-amber-400/60 hover:border-amber-500 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  <Lock className="w-3 h-3 text-amber-600 dark:text-amber-400 group-hover:text-slate-950" />
                  <span>আনলক করুন</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
      />

      {/* Subject Test Setup Modal */}
      {activeSubjectForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div 
            className="fixed inset-0" 
            onClick={() => setActiveSubjectForModal(null)} 
            aria-hidden="true"
          />

          <div className="relative w-full max-w-md bg-[#e9edf5] dark:bg-[#101927] rounded-3xl neu-card border border-emerald-600/30 dark:border-emerald-500/30 shadow-2xl flex flex-col overflow-hidden z-10">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#005a36] text-white flex items-center justify-between border-b border-amber-400/30">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                  <BookOpen className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full border border-amber-300 shadow-xs inline-flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    {activeSubjectForModal.totalQuestions}+ প্রশ্ন ব্যাংক
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
              <p className="text-xs text-emerald-950 dark:text-emerald-200 font-medium">
                {activeSubjectForModal.subtitle}
              </p>

              {/* Choose Question Count */}
              <div>
                <label className="text-xs font-black text-[#005a36] dark:text-emerald-400 flex items-center gap-1.5 mb-2">
                  <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                  প্রশ্ন সংখ্যা নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 20, 50].map((count) => (
                    <button
                      key={count}
                      onClick={() => setQuestionCount(count)}
                      className={`py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                        questionCount === count
                          ? 'bg-[#005a36] text-white shadow-sm border-emerald-400 ring-1 ring-emerald-400'
                          : 'neu-btn text-[#005a36] dark:text-emerald-300 border-emerald-600/20 dark:border-emerald-500/20 hover:border-amber-400'
                      }`}
                    >
                      {count}টি প্রশ্ন
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Selection */}
              <div>
                <label className="text-xs font-black text-[#005a36] dark:text-emerald-400 flex items-center gap-1.5 mb-2">
                  <Timer className="w-3.5 h-3.5 text-amber-500" />
                  অনুশীলন মোড:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPracticeMode('exam')}
                    className={`p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                      practiceMode === 'exam'
                        ? 'border-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 shadow-xs'
                        : 'neu-btn text-slate-700 dark:text-slate-300 border border-emerald-600/20 dark:border-emerald-500/20 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center gap-1 font-black text-xs text-[#005a36] dark:text-emerald-300">
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
                        : 'neu-btn text-slate-700 dark:text-slate-300 border border-emerald-600/20 dark:border-emerald-500/20 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center gap-1 font-black text-xs text-[#005a36] dark:text-emerald-300">
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>সেলফ স্টাডি মোড</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">তাৎক্ষণিক উত্তর ও ব্যাখ্যা</p>
                  </button>
                </div>
              </div>

              {/* Sample Question Preview */}
              {activeSubjectForModal.sampleQuestions.length > 0 && (
                <div className="p-3 rounded-2xl neu-inset border border-emerald-600/15 dark:border-emerald-500/15">
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
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
                  <p className="text-xs font-bold text-emerald-950 dark:text-emerald-100 leading-snug">
                    {activeSubjectForModal.sampleQuestions[0].q}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 sm:p-4 bg-[#e4e9f2] dark:bg-[#0b121d] border-t border-white/60 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveSubjectForModal(null)}
                className="px-4 py-2 rounded-xl neu-btn text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:border-amber-400 cursor-pointer"
              >
                বাতিল
              </button>

              <button
                onClick={handleLaunchSubjectTest}
                className="px-6 py-2 rounded-xl neu-btn-primary text-xs font-black flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer border border-amber-400/40"
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
