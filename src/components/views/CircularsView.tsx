import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Building2, 
  Calendar, 
  Users, 
  ExternalLink, 
  ChevronRight, 
  Bookmark, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Flame,
  FileText,
  ArrowLeft,
  Share2,
  Check,
  Award,
  AlertCircle
} from 'lucide-react';
import { JobCircular } from '../../types';
import { useApp } from '../../context/AppContext';

export const CircularsView: React.FC = () => {
  const { setActiveTab } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ntrca' | 'madrasah' | 'primary'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['1']);
  const [selectedCircular, setSelectedCircular] = useState<JobCircular | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const circulars: JobCircular[] = [
    {
      id: '1',
      title: '১৯তম শিক্ষক নিবন্ধন পরীক্ষা (NTRCA) বিজ্ঞপ্তি ২০২৬',
      organization: 'বেসরকারি শিক্ষক নিবন্ধন ও প্রত্যয়ন কর্তৃপক্ষ (NTRCA)',
      category: 'ntrca',
      tag: 'NTRCA',
      vacancies: 'প্রায় ৩৫,০০০+',
      deadline: '৩১ আগস্ট, ২০২৬',
      publishDate: '০৫ আগস্ট, ২০২৬',
      isHot: true,
      salaryScale: 'গ্রেড ৯ থেকে ১১ (জাতীয় বেতন স্কেল ২০১৫)',
      educationalReq: 'সংশ্লিষ্ট বিষয়ে ফাজিল/কামিল/স্নাতক (সম্মান) বা সমমান ডিগ্রি',
      ageLimit: 'অনূর্ধ্ব ৩৫ বছর',
      applyLink: 'http://ntrca.teletalk.com.bd',
      description: 'দেশের সকল বেসরকারি স্কুল, কলেজ, মাদ্রাসা ও কারিগরি শিক্ষা প্রতিষ্ঠানে এন্ট্রি লেভেলে শিক্ষক পদে নিয়োগের লক্ষ্যে ১৯তম শিক্ষক নিবন্ধন পরীক্ষা ২০২৬ এর বিজ্ঞপ্তি প্রকাশ করা হয়েছে। মাদ্রাসা সহকারী মৌলভী, আরবি প্রভাষক, এবং স্কুল ও কলেজের সহকারী শিক্ষক পদের আবেদন চলছে।'
    },
    {
      id: '2',
      title: 'মাদ্রাসা শিক্ষা অধিদপ্তর (DME) সহকারী শিক্ষক নিয়োগ ২০২৬',
      organization: 'মাদ্রাসা শিক্ষা অধিদপ্তর, কারিগরি ও মাদ্রাসা শিক্ষা বিভাগ',
      category: 'madrasah',
      tag: 'মাদ্রাসা অধিদপ্তর',
      vacancies: '৪,৫২০+ জন',
      deadline: '১৫ সেপ্টেম্বর, ২০২৬',
      publishDate: '০১ আগস্ট, ২০২৬',
      isHot: true,
      salaryScale: 'গ্রেড ১০ ও ১১',
      educationalReq: 'ফাজিল/কামিল/ইসলামিক স্টাডিজ বা আরবিতে অনার্স',
      ageLimit: '১৮ থেকে ৩৫ বছর',
      applyLink: 'http://dme.teletalk.com.bd',
      description: 'সরকারি ও এমপিওভুক্ত মাদ্রাসাসমূহে শূন্য পদে সহকারী শিক্ষক (কুরআন ও হাদিস, আরবি, ফিকহ, ইংরেজি, গণিত ও সমাজবিজ্ঞান) পদে নিয়োগের বিশাল বিজ্ঞপ্তি।'
    },
    {
      id: '3',
      title: 'প্রাথমিক সহকারী শিক্ষক নিয়োগ পরীক্ষা (৩য় ধাপ) ২০২৬',
      organization: 'প্রাথমিক শিক্ষা অধিদপ্তর (DPE)',
      category: 'primary',
      tag: 'প্রাথমিক শিক্ষা',
      vacancies: '১৩,৭৭০+ জন',
      deadline: '২৫ আগস্ট, ২০২৬',
      publishDate: '২৭ জুলাই, ২০২৬',
      isHot: false,
      salaryScale: 'গ্রেড ১৩',
      educationalReq: 'যে কোনো বিষয়ে ন্যূনতম ২য় শ্রেণি বা সমমানের সিজিপিএ সহ স্নাতক ডিগ্রি',
      ageLimit: '২১ থেকে ৩০ বছর (কোটাভুক্তদের ক্ষেত্রে ৩২ বছর)',
      applyLink: 'http://dpe.teletalk.com.bd',
      description: 'সরকারি প্রাথমিক বিদ্যালয়ের রাজস্ব খাতভুক্ত সহকারী শিক্ষক পদে বিশাল নিয়োগ বিজ্ঞপ্তি। লিখিত ও মৌখিক পরীক্ষার মাধ্যমে প্রার্থী নির্বাচন সম্পন্ন হবে।'
    },
    {
      id: '4',
      title: 'সরকারি আলিয়া ও কামিল মাদ্রাসা প্রভাষক নিয়োগ ২০২৬',
      organization: 'বাংলাদেশ পাবলিক সার্ভিস কমিশন (BPSC)',
      category: 'madrasah',
      tag: 'বিপিএসসি মাদ্রাসা',
      vacancies: '৮৫০+ জন',
      deadline: '১০ অক্টোবর, ২০২৬',
      publishDate: '০৪ আগস্ট, ২০২৬',
      isHot: true,
      salaryScale: 'গ্রেড ৯ (২২,০০০ - ৫৩,০৬০ টাকা)',
      educationalReq: 'সংশ্লিষ্ট বিষয়ে কামিল বা মাস্টার্স ডিগ্রি (ন্যূনতম ২য় শ্রেণি)',
      ageLimit: 'অনূর্ধ্ব ৩৫ বছর',
      applyLink: 'http://bpsc.teletalk.com.bd',
      description: 'সরকারি আলিয়া মাদ্রাসা সমূহে আরবি সাহিত্য, তাফসির, হাদিস, ফিকহ ও ইসলামিক স্টাডিজ বিষয়ে ৯ম গ্রেডে প্রভাষক নিয়োগ বিজ্ঞপ্তি।'
    },
    {
      id: '5',
      title: 'কারিগরি ও মাদ্রাসা শিক্ষা বিভাগ বিশেষ নিয়োগ বিজ্ঞপ্তি',
      organization: 'শিক্ষা মন্ত্রণালয়, গণপ্রজাতন্ত্রী বাংলাদেশ সরকার',
      category: 'madrasah',
      tag: 'কারিগরি ও মাদ্রাসা',
      vacancies: '১,২০০+ জন',
      deadline: '২০ সেপ্টেম্বর, ২০২৬',
      publishDate: '০৩ আগস্ট, ২০২৬',
      isHot: false,
      salaryScale: 'গ্রেড ১০, ১১ ও ১২',
      educationalReq: 'ফাজিল/স্নাতক সমমান ডিগ্রি',
      ageLimit: '১৮ থেকে ৩২ বছর',
      applyLink: 'http://tmed.teletalk.com.bd',
      description: 'কারিগরি ও মাদ্রাসা শিক্ষা বিভাগের অধীনস্থ বিভিন্ন প্রকল্প ও শিক্ষা প্রতিষ্ঠানে অস্থায়ী ভিত্তিতে বিভিন্ন ক্যাটাগরিতে শিক্ষক ও কর্মকর্তা নিয়োগ।'
    }
  ];

  const filteredCirculars = circulars.filter((item) => {
    if (selectedFilter !== 'all' && item.category !== selectedFilter) {
      return false;
    }
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.organization.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleShare = (circular: JobCircular) => {
    if (navigator.share) {
      navigator.share({
        title: circular.title,
        text: `${circular.title}\nপ্রতিষ্ঠান: ${circular.organization}\nপদসংখ্যা: ${circular.vacancies}\nশেষ তারিখ: ${circular.deadline}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${circular.title} - ${circular.organization}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // DIRECT INLINE DETAILS VIEW (No popups)
  if (selectedCircular) {
    const isSaved = bookmarkedIds.includes(selectedCircular.id);

    return (
      <div className="space-y-4 sm:space-y-5 pb-24 animate-fadeIn max-w-4xl mx-auto">
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-3.5 shadow-sm border border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setSelectedCircular(null)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>সকল সার্কুলারে ফিরে যান</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmark(selectedCircular.id)}
              className="p-2 rounded-xl neu-btn text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors cursor-pointer"
              title={isSaved ? "বুকমার্ক মুছে ফেলুন" : "বুকমার্ক করুন"}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'text-amber-500 fill-amber-500' : ''}`} />
            </button>
            <button
              onClick={() => handleShare(selectedCircular)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-[#005a36] dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800/60 transition-all active:scale-95 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'কপি হয়েছে' : 'শেয়ার'}</span>
            </button>
          </div>
        </div>

        {/* Main Circular Details Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 neu-card border border-emerald-600/20 dark:border-emerald-500/20 shadow-md space-y-5">
          {/* Header Area */}
          <div className="border-b border-slate-200/70 dark:border-slate-800 pb-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-extrabold bg-[#005a36] text-white">
                {selectedCircular.tag}
              </span>
              {selectedCircular.isHot && (
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 border border-amber-300 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-slate-950" />
                  <span>হট নিয়োগ বিজ্ঞপ্তি</span>
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-2xl font-black text-[#004d2e] dark:text-emerald-400 leading-snug">
              {selectedCircular.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 flex items-center gap-1.5 font-bold">
              <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{selectedCircular.organization}</span>
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 sm:p-3.5 rounded-2xl neu-inset">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">মোট পদসংখ্যা</span>
              <strong className="text-sm sm:text-base text-[#005a36] dark:text-emerald-400 font-extrabold block mt-0.5">
                {selectedCircular.vacancies}
              </strong>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl neu-inset border border-red-500/20">
              <span className="text-[11px] text-red-600 dark:text-red-400 block font-semibold">আবেদনের শেষ সময়</span>
              <strong className="text-sm sm:text-base text-red-600 dark:text-red-400 font-extrabold block mt-0.5">
                {selectedCircular.deadline}
              </strong>
            </div>

            {selectedCircular.salaryScale && (
              <div className="p-3 sm:p-3.5 rounded-2xl neu-inset">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">বেতন স্কেল</span>
                <strong className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-bold block mt-0.5">
                  {selectedCircular.salaryScale}
                </strong>
              </div>
            )}

            {selectedCircular.ageLimit && (
              <div className="p-3 sm:p-3.5 rounded-2xl neu-inset">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold">বয়সসীমা</span>
                <strong className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-bold block mt-0.5">
                  {selectedCircular.ageLimit}
                </strong>
              </div>
            )}
          </div>

          {/* Educational Requirements */}
          {selectedCircular.educationalReq && (
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-600/20 dark:border-emerald-500/20 space-y-1">
              <span className="text-xs sm:text-sm font-black text-[#005a36] dark:text-emerald-300 block flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                শিক্ষাগত যোগ্যতা ও শর্তাবলি
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium pt-1">
                {selectedCircular.educationalReq}
              </p>
            </div>
          )}

          {/* Full Description */}
          {selectedCircular.description && (
            <div className="p-4 rounded-2xl neu-card space-y-1">
              <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 block mb-1">
                সার্কুলার বিস্তারিত বিবরণ
              </span>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {selectedCircular.description}
              </p>
            </div>
          )}

          {/* Direct Actions Plate */}
          <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => setActiveTab('exams')}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl neu-btn text-xs sm:text-sm font-bold text-[#005a36] dark:text-emerald-400 flex items-center justify-center gap-2 cursor-pointer border border-emerald-600/30 hover:border-emerald-600 active:scale-95 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>এই সার্কুলারের মডেল টেস্ট দিন</span>
            </button>

            {selectedCircular.applyLink && (
              <a
                href={selectedCircular.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#005a36] hover:bg-[#004227] text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all border border-emerald-400/40"
              >
                <span>অফিসিয়াল সাইটে আবেদন করুন</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 pb-24 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="p-4 sm:p-5 rounded-3xl neu-card border border-emerald-600/30 dark:border-emerald-500/30 relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-transparent to-amber-500/10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-black bg-[#005a36] text-amber-300 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-xs border border-emerald-400/30">
              <Briefcase className="w-3 h-3 text-amber-300" />
              জব সার্কুলার বুলেটিন
            </span>
            <h3 className="font-extrabold text-base sm:text-lg text-[#005a36] dark:text-emerald-400 mt-1.5">
              মাদ্রাসা ও শিক্ষা নিয়োগ বিজ্ঞপ্তি ২০২৬
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              ১৯তম শিক্ষক নিবন্ধন (NTRCA), মাদ্রাসা অধিদপ্তর ও অন্যান্য চলমান চাকরির সকল তথ্য সরাসরি দেখুন
            </p>
          </div>
        </div>
      </div>

      {/* 2. Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedFilter === 'all'
              ? 'neu-btn-primary text-white shadow-xs'
              : 'neu-btn text-slate-700 dark:text-slate-300'
          }`}
        >
          সকল সার্কুলার ({circulars.length})
        </button>

        <button
          onClick={() => setSelectedFilter('ntrca')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedFilter === 'ntrca'
              ? 'neu-btn-primary text-white shadow-xs'
              : 'neu-btn text-slate-700 dark:text-slate-300'
          }`}
        >
          NTRCA শিক্ষক নিবন্ধন
        </button>

        <button
          onClick={() => setSelectedFilter('madrasah')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedFilter === 'madrasah'
              ? 'neu-btn-primary text-white shadow-xs'
              : 'neu-btn text-slate-700 dark:text-slate-300'
          }`}
        >
          মাদ্রাসা অধিদপ্তর ও বিপিএসসি
        </button>

        <button
          onClick={() => setSelectedFilter('primary')}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedFilter === 'primary'
              ? 'neu-btn-primary text-white shadow-xs'
              : 'neu-btn text-slate-700 dark:text-slate-300'
          }`}
        >
          প্রাথমিক ও অন্যান্য
        </button>
      </div>

      {/* 3. Search Box */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="সার্কুলার খুঁজুন (যেমন: শিক্ষক নিবন্ধন, সহকারী মৌলভী, প্রভাষক)..."
          className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm neu-inset rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#005a36] font-medium"
        />
      </div>

      {/* 4. Circular Cards List */}
      <div className="space-y-3.5">
        {filteredCirculars.map((item) => {
          const isSaved = bookmarkedIds.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => setSelectedCircular(item)}
              className="p-4 sm:p-5 rounded-3xl neu-card hover:shadow-md transition-all cursor-pointer relative group border border-slate-200/60 dark:border-slate-800/80 hover:border-emerald-600/40"
            >
              {/* Hot badge & Tag */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#005a36]/10 dark:bg-emerald-950/60 text-[#005a36] dark:text-emerald-300 border border-emerald-600/30">
                  {item.tag}
                </span>

                {item.isHot && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-400 text-slate-950 border border-amber-300 flex items-center gap-1 shadow-2xs">
                    <span>হট সার্কুলার</span>
                    <Flame className="w-3.5 h-3.5 fill-slate-950" />
                  </span>
                )}
              </div>

              {/* Organization */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">
                <Building2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                <span className="truncate">{item.organization}</span>
              </div>

              {/* Title */}
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-[#005a36] dark:group-hover:text-emerald-400 transition-colors leading-snug mb-3">
                {item.title}
              </h4>

              {/* Meta information row */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-semibold mb-3.5">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 bg-[#e4e9f2] dark:bg-[#142033] px-2.5 py-1 rounded-xl">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                  <span>পদসংখ্যা: <strong className="text-[#005a36] dark:text-emerald-400">{item.vacancies}</strong></span>
                </div>

                <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded-xl border border-red-200 dark:border-red-900/50">
                  <Clock className="w-3.5 h-3.5 text-red-500" />
                  <span>শেষ সময়: <strong>{item.deadline}</strong></span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2.5 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  প্রকাশিত: {item.publishDate}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => toggleBookmark(item.id, e)}
                    className="p-1.5 rounded-lg neu-btn text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-colors"
                    title={isSaved ? "বুকমার্ক মুছে ফেলুন" : "বুকমার্ক করুন"}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'text-amber-500 fill-amber-500' : ''}`} />
                  </button>

                  <div className="flex items-center gap-0.5 font-bold text-[#005a36] dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                    <span>সরাসরি দেখুন</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
