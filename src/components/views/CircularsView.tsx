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
  Download, 
  Clock, 
  Sparkles,
  Flame,
  FileText,
  X
} from 'lucide-react';
import { JobCircular } from '../../types';
import { useApp } from '../../context/AppContext';

export const CircularsView: React.FC = () => {
  const { setActiveTab } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ntrca' | 'madrasah' | 'primary'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['1']);
  const [selectedCircular, setSelectedCircular] = useState<JobCircular | null>(null);

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
      publishDate: '২৮ জুলাই, ২০২৬',
      isHot: false,
      salaryScale: 'গ্রেড ১০ থেকে ১৬',
      educationalReq: 'ফাজিল/স্নাতক/এইচএসসি (আলিম) সমমান',
      ageLimit: '১৮ থেকে ৩২ বছর',
      applyLink: 'http://tmed.teletalk.com.bd',
      description: 'কারিগরি ও মাদ্রাসা শিক্ষা বিভাগের বিভিন্ন শূন্য পদে কম্পিউটার অপারেটর, ল্যাব সহকারী, হিসাবরক্ষক ও অফিস সহকারী নিয়োগ।'
    }
  ];

  const filteredCirculars = circulars.filter(item => {
    const matchesFilter = selectedFilter === 'all' || item.category === selectedFilter;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter(bId => bId !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 animate-fadeIn max-w-4xl mx-auto pb-10">
      {/* 1. Hero Dark Banner matching Screenshot 1 */}
      <div className="bg-[#121c30] dark:bg-[#0b1424] text-white rounded-3xl p-5 sm:p-7 shadow-[0_10px_30px_rgba(15,23,42,0.25)] border border-slate-700/50 relative overflow-hidden">
        {/* Decorative ambient glow */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-amber-300 text-xs font-bold mb-3.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>শিক্ষক নিয়োগ ও সরকারি চাকরি আপডেট ২০২৬</span>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight mb-2">
          শিক্ষক নিয়োগ জব পোর্টাল ও সার্কুলার
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal mb-5">
          বেসরকারি শিক্ষক নিবন্ধন (NTRCA), মাদ্রাসা শিক্ষা অধিদপ্তর, প্রাথমিক সহকারী শিক্ষক ও সরকারি হাইস্কুল নিয়োগের সঠিক তথ্য ও আপডেট।
        </p>

        {/* 3 Stats Boxes inside Hero */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
          <div className="bg-[#1a2640]/80 rounded-2xl p-3 sm:p-4 text-center border border-slate-700/60">
            <h3 className="text-base sm:text-xl font-black text-amber-400 leading-tight">
              ৩৫,০০০+
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-300 mt-1 font-medium">NTRCA পদসংখ্যা</p>
          </div>

          <div className="bg-[#1a2640]/80 rounded-2xl p-3 sm:p-4 text-center border border-slate-700/60">
            <h3 className="text-base sm:text-xl font-black text-emerald-400 leading-tight">
              ৪,৫২০+
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-300 mt-1 font-medium">মাদ্রাসা শিক্ষক</p>
          </div>

          <div className="bg-[#1a2640]/80 rounded-2xl p-3 sm:p-4 text-center border border-slate-700/60">
            <h3 className="text-base sm:text-xl font-black text-sky-400 leading-tight">
              ১৩,৭৭০+
            </h3>
            <p className="text-[10px] sm:text-xs text-slate-300 mt-1 font-medium">প্রাথমিক শিক্ষক</p>
          </div>
        </div>
      </div>

      {/* 2. Search Box */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="পদ, প্রতিষ্ঠান বা সার্কুলার নাম লিখে খুঁজুন..."
          className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm neu-inset rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#005a36] font-medium"
        />
      </div>

      {/* 3. Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            selectedFilter === 'all'
              ? 'bg-[#005a36] text-white shadow-sm'
              : 'neu-btn text-slate-700 dark:text-slate-300'
          }`}
        >
          সকল সার্কুলার
        </button>

        <button
          onClick={() => setSelectedFilter('ntrca')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            selectedFilter === 'ntrca'
              ? 'bg-[#005a36] text-white shadow-sm'
              : 'neu-btn text-slate-700 dark:text-slate-300'
          }`}
        >
          NTRCA শিক্ষক নিবন্ধন
        </button>

        <button
          onClick={() => setSelectedFilter('madrasah')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            selectedFilter === 'madrasah'
              ? 'bg-[#005a36] text-white shadow-sm'
              : 'neu-btn text-slate-700 dark:text-slate-300'
          }`}
        >
          মাদ্রাসা ও কারিগরি
        </button>

        <button
          onClick={() => setSelectedFilter('primary')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
            selectedFilter === 'primary'
              ? 'bg-[#005a36] text-white shadow-sm'
              : 'neu-btn text-slate-700 dark:text-slate-300'
          }`}
        >
          প্রাথমিক ও অন্যান্য
        </button>
      </div>

      {/* 4. Section Header */}
      <div className="flex items-center justify-between pt-1">
        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
          <span>সর্বশেষ শিক্ষক নিয়োগ সার্কুলারসমূহ</span>
          <span className="text-xs text-slate-500 font-normal">({filteredCirculars.length}টি)</span>
        </h3>
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
          নিয়মিত হালনাগাদকৃত
        </span>
      </div>

      {/* 5. Circular Cards List */}
      <div className="space-y-3.5">
        {filteredCirculars.map((item) => {
          const isSaved = bookmarkedIds.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => setSelectedCircular(item)}
              className="p-4 sm:p-5 rounded-3xl neu-card hover:shadow-md transition-all cursor-pointer relative group"
            >
              {/* Hot badge & Tag */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700">
                  {item.tag}
                </span>

                {item.isHot && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#121c30] text-amber-300 border border-slate-700 flex items-center gap-1">
                    <span>হট সার্কুলার</span>
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  </span>
                )}
              </div>

              {/* Organization */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{item.organization}</span>
              </div>

              {/* Title */}
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-[#005a36] dark:group-hover:text-emerald-400 transition-colors leading-snug mb-3">
                {item.title}
              </h4>

              {/* Meta information row */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold mb-3.5">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 bg-[#e4e9f2] dark:bg-[#142033] px-2.5 py-1 rounded-xl">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                  <span>পদসংখ্যা: <strong className="text-slate-900 dark:text-slate-100">{item.vacancies}</strong></span>
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
                    <span>বিস্তারিত দেখুন</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Circular Details Modal */}
      {selectedCircular && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div 
            className="fixed inset-0" 
            onClick={() => setSelectedCircular(null)} 
          />

          <div className="relative w-full max-w-lg bg-[#e9edf5] dark:bg-[#101927] rounded-3xl neu-card shadow-2xl flex flex-col overflow-hidden z-10 max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#005a36] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                  <Briefcase className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.2 rounded-full">
                    {selectedCircular.tag}
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-white mt-0.5 line-clamp-1">
                    সার্কুলার বিস্তারিত
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedCircular(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 no-scrollbar">
              <div>
                <h4 className="font-black text-base sm:text-lg text-slate-900 dark:text-slate-100 leading-snug">
                  {selectedCircular.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  {selectedCircular.organization}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl neu-inset">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">মোট পদসংখ্যা</span>
                  <strong className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-extrabold">{selectedCircular.vacancies}</strong>
                </div>

                <div className="p-3 rounded-2xl neu-inset">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">আবেদনের শেষ সময়</span>
                  <strong className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-extrabold">{selectedCircular.deadline}</strong>
                </div>

                {selectedCircular.salaryScale && (
                  <div className="p-3 rounded-2xl neu-inset">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">বেতন স্কেল</span>
                    <strong className="text-xs text-slate-900 dark:text-slate-100 font-bold">{selectedCircular.salaryScale}</strong>
                  </div>
                )}

                {selectedCircular.ageLimit && (
                  <div className="p-3 rounded-2xl neu-inset">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">বয়সসীমা</span>
                    <strong className="text-xs text-slate-900 dark:text-slate-100 font-bold">{selectedCircular.ageLimit}</strong>
                  </div>
                )}
              </div>

              {selectedCircular.educationalReq && (
                <div className="p-3.5 rounded-2xl neu-card">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 block mb-1">
                    শিক্ষাগত যোগ্যতা ও শর্তাবলি:
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {selectedCircular.educationalReq}
                  </p>
                </div>
              )}

              {selectedCircular.description && (
                <div className="p-3.5 rounded-2xl neu-card">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 block mb-1">
                    বিবরণ:
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {selectedCircular.description}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 sm:p-4 bg-[#e4e9f2] dark:bg-[#0b121d] border-t border-white/60 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setSelectedCircular(null);
                  setActiveTab('exams');
                }}
                className="px-4 py-2 rounded-xl neu-btn text-xs font-bold text-[#005a36] dark:text-emerald-400 flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>মডেল টেস্ট দিন</span>
              </button>

              {selectedCircular.applyLink ? (
                <a
                  href={selectedCircular.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-xl neu-btn-primary text-xs font-extrabold flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span>অনলাইনে আবেদন করুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button
                  onClick={() => setSelectedCircular(null)}
                  className="px-5 py-2 rounded-xl neu-btn-primary text-xs font-bold"
                >
                  বন্ধ করুন
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
