import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileCheck2, 
  Clock, 
  Award, 
  Zap, 
  RotateCcw, 
  CheckCircle2, 
  Calendar, 
  BookOpen, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { mockExams } from '../../data/mockData';
import { Exam } from '../../types';

export const ExamsView: React.FC = () => {
  const { startExam, examResults, setViewingResult } = useApp();
  const [examTab, setExamTab] = useState<'all' | 'live' | 'subject' | 'previous_year' | 'results'>('all');

  const filteredExams = mockExams.filter((e) => {
    if (examTab === 'all') return true;
    if (examTab === 'live') return e.category === 'live';
    if (examTab === 'subject') return e.category === 'subject';
    if (examTab === 'previous_year') return e.category === 'previous_year';
    return true;
  });

  return (
    <div className="space-y-6 pb-24 animate-fadeIn">
      {/* Header Banner with Neumorphic Styling */}
      <div className="p-5 sm:p-6 rounded-3xl neu-card">
        <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full shadow-xs">
          অনলাইন ওএমআর এক্সাম পোর্টাল
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 leading-tight">
          মডেল টেস্ট, লাইভ এক্সাম ও রেজাল্ট বিশ্লেষণ
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
          NTRCA স্ট্যান্ডার্ড নেগেティブ মার্কিংসহ রিয়েলটাইম ওএমআর পরীক্ষা দিয়ে আপনার মেধা স্থান ও সার্বিক প্রস্তুতি যাচাই করুন।
        </p>

        {/* Neumorphic Inset Tabs Switcher */}
        <div className="mt-5 p-2 rounded-2xl neu-inset flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'সব পরীক্ষা' },
            { id: 'live', label: 'লাইভ পরীক্ষা' },
            { id: 'subject', label: 'বিষয়ভিত্তিক টেস্ট' },
            { id: 'previous_year', label: 'বিগত বছরের প্রশ্ন' },
            { id: 'results', label: `আমার রেজাল্ট (${examResults.length})` },
          ].map((tab) => {
            const isSelected = examTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setExamTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-all ${
                  isSelected
                    ? 'neu-tab-active-amber bg-amber-400 text-slate-950 font-black shadow-[4px_4px_8px_#c2cfdf,-4px_-4px_8px_#ffffff]'
                    : 'text-slate-600 hover:text-emerald-900 font-bold hover:bg-white/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results View Tab */}
      {examTab === 'results' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-700" />
              আপনার দেওয়া পরীক্ষার তালিকা
            </h3>
            <span className="text-xs text-slate-500 font-semibold">মোট {examResults.length}টি পরীক্ষা</span>
          </div>

          {examResults.length === 0 ? (
            <div className="p-8 rounded-3xl neu-card text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl neu-btn text-slate-400 flex items-center justify-center mx-auto">
                <FileCheck2 className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">এখনো কোনো পরীক্ষায় অংশ নেননি</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                উপরে ‘লাইভ পরীক্ষা’ বা ‘সব পরীক্ষা’ ট্যাব থেকে যেকোনো একটি টেস্টে অংশগ্রহণ করুন।
              </p>
              <button
                onClick={() => setExamTab('all')}
                className="px-5 py-2.5 rounded-xl neu-btn-primary font-bold text-xs"
              >
                টেস্ট দিন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {examResults.map((result) => (
                <div
                  key={result.id}
                  className="p-5 rounded-3xl neu-card-hover flex flex-col justify-between h-full space-y-3"
                >
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs text-slate-400 font-medium">{result.date}</span>
                        <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-200">
                          মেধা স্থান: {result.rank || 5}তম
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug line-clamp-2 min-h-[2.5rem]">
                        {result.examTitle}
                      </h4>
                    </div>

                    {/* Stats pills */}
                    <div className="grid grid-cols-3 gap-2 mt-3.5 text-center neu-inset p-2.5 rounded-2xl text-xs font-medium">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">প্রাপ্ত নম্বর</span>
                        <strong className="text-emerald-800 font-extrabold text-sm">{result.score}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">সঠিক</span>
                        <strong className="text-emerald-600 font-extrabold text-sm">{result.correctAnswers}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">ভুল</span>
                        <strong className="text-red-600 font-extrabold text-sm">{result.wrongAnswers}</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setViewingResult(result)}
                    className="w-full py-2.5 neu-btn-primary font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 mt-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>পূর্ণাঙ্গ সমাধান ও AI ব্যাখ্যা দেখুন</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Exams List Grid with Neumorphic Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredExams.map((exam) => {
            const hasGiven = examResults.some((r) => r.examId === exam.id);

            return (
              <div
                key={exam.id}
                className="p-5 rounded-3xl neu-card-hover flex flex-col justify-between h-full space-y-4"
              >
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {exam.category === 'live' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span> লাইভ টেস্ট
                          </span>
                        ) : exam.category === 'previous_year' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-700 border border-purple-200">
                            বিগত প্রশ্ন
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700 border border-blue-200">
                            বিষয়ভিত্তিক
                          </span>
                        )}
                        <span className="text-xs text-slate-500 font-bold">{exam.subject}</span>
                      </div>

                      {hasGiven && (
                        <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> সম্পন্ন
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug line-clamp-2 min-h-[2.5rem]">
                      {exam.title}
                    </h3>
                  </div>

                  {/* Exam Specs Inset Grid */}
                  <div className="mt-3.5 grid grid-cols-3 gap-2 neu-inset p-2.5 rounded-2xl text-center text-xs text-slate-600 font-medium">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">পূর্ণমান</span>
                      <strong className="text-slate-900 font-extrabold">{exam.totalMarks}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">সময়</span>
                      <strong className="text-slate-900 font-extrabold">{exam.durationMinutes} মিনিট</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">নেগেটিভ মার্ক</span>
                      <strong className="text-red-600 font-extrabold">{exam.negativeMarking}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/60 flex items-center justify-between gap-3 mt-2">
                  <span className="text-xs text-slate-500 font-medium">
                    {exam.participantsCount}+ জন অংশগ্রহণ করেছে
                  </span>

                  <button
                    onClick={() => startExam(exam)}
                    className="px-5 py-2.5 rounded-xl neu-btn-primary font-black text-xs sm:text-sm flex items-center gap-1.5"
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>{hasGiven ? 'পুনরায় দিন' : 'পরীক্ষা শুরু'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
