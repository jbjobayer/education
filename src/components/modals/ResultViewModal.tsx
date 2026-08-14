import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useFont } from '../../context/FontContext';
import { 
  X, 
  Award, 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  BookOpen, 
  RotateCcw,
  Bot
} from 'lucide-react';
import Markdown from 'react-markdown';
import { mockExams } from '../../data/mockData';
import { 
  getUnifiedQuestionText, 
  getTextDirection, 
  getOptionsConfig,
  parseQuestionData 
} from '../../utils/questionUtils';

export const ResultViewModal: React.FC = () => {
  const { viewingResult, setViewingResult, startExam, bookmarks, toggleBookmark } = useApp();
  const { formatArabicText } = useFont();
  const [aiExplanations, setAiExplanations] = useState<Record<string, { loading: boolean; text?: string }>>({});

  if (!viewingResult) return null;

  // Find the original exam to match full questions
  const exam = mockExams.find((e) => e.id === viewingResult.examId) || mockExams[0];

  const handleAskAIExplanation = async (question: any) => {
    setAiExplanations((prev) => ({
      ...prev,
      [question.id]: { loading: true },
    }));

    try {
      const res = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.question,
          options: question.options,
          correctAnswer: question.options[question.correctIndex],
          subject: question.subject,
        }),
      });
      const data = await res.json();
      setAiExplanations((prev) => ({
        ...prev,
        [question.id]: { loading: false, text: data.explanation || question.explanation },
      }));
    } catch {
      setAiExplanations((prev) => ({
        ...prev,
        [question.id]: { loading: false, text: question.explanation },
      }));
    }
  };

  const percentage = Math.round((viewingResult.score / viewingResult.totalMarks) * 100);
  const isPassed = percentage >= 40;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-[#e9edf5] w-full max-w-3xl rounded-3xl neu-card overflow-hidden my-auto flex flex-col max-h-[92vh] border border-white/80">
        {/* Header with Score Ribbon */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/60 bg-[#e9edf5]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl shadow-md">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-emerald-950 bg-emerald-100 px-2.5 py-0.5 rounded-full shadow-xs">
                পরীক্ষার ফলাফল ও রিভিউ
              </span>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-900 mt-1 leading-snug">
                {viewingResult.examTitle}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                তারিখ: {viewingResult.date} • সময় ব্যয়: {Math.floor(viewingResult.timeSpentSeconds / 60)} মিনিট
              </p>
            </div>
          </div>

          <button
            onClick={() => setViewingResult(null)}
            className="p-2 rounded-xl neu-btn text-slate-600 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Summary Inset Metrics */}
        <div className="p-4 bg-[#e9edf5] border-b border-white/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 neu-card-sm rounded-2xl">
            <span className="text-xs text-slate-400 font-semibold block">প্রাপ্ত নম্বর</span>
            <div className="text-xl font-black text-emerald-900">
              {viewingResult.score} <span className="text-xs font-normal text-slate-400">/ {viewingResult.totalMarks}</span>
            </div>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full mt-1 inline-block ${
              isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
            }`}>
              {isPassed ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ'} ({percentage}%)
            </span>
          </div>

          <div className="p-3 neu-card-sm rounded-2xl">
            <span className="text-xs text-slate-400 font-semibold block">সঠিক উত্তর</span>
            <div className="text-xl font-black text-emerald-700 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{viewingResult.correctAnswers}</span>
            </div>
            <span className="text-[10px] text-slate-400">প্রশ্ন</span>
          </div>

          <div className="p-3 neu-card-sm rounded-2xl">
            <span className="text-xs text-slate-400 font-semibold block">ভুল উত্তর</span>
            <div className="text-xl font-black text-red-600 flex items-center justify-center gap-1">
              <XCircle className="w-4 h-4" />
              <span>{viewingResult.wrongAnswers}</span>
            </div>
            <span className="text-[10px] text-red-500 font-semibold">(-{(viewingResult.wrongAnswers * 0.25).toFixed(2)})</span>
          </div>

          <div className="p-3 neu-card-sm rounded-2xl">
            <span className="text-xs text-slate-400 font-semibold block">মেধা স্থান (Rank)</span>
            <div className="text-xl font-black text-amber-600 flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{viewingResult.rank || 5}তম</span>
            </div>
            <span className="text-[10px] text-slate-400">/{viewingResult.totalParticipants || 450} জনের মধ্যে</span>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1 bg-[#e9edf5]">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-800" />
              প্রশ্নোত্তর বিশ্লেষণ ও সঠিক ব্যাখ্যা
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              মোট প্রশ্ন: {exam.questions.length}টি
            </span>
          </div>

          {exam.questions.map((q, idx) => {
            const userChoice = viewingResult.userAnswers[q.id];
            const isCorrect = userChoice === q.correctIndex;
            const isSkipped = userChoice === undefined;
            const aiData = aiExplanations[q.id];
            const isBookmarked = bookmarks.includes(q.id);

            const parsedQ = parseQuestionData(q);
            const optConfig = getOptionsConfig(q.options, q.optionLabels);
            const expDir = getTextDirection(q.explanation);

            return (
              <div
                key={q.id}
                className={`p-4 sm:p-5 rounded-3xl neu-card space-y-3.5 ${
                  isCorrect
                    ? 'border-l-4 border-l-emerald-600'
                    : isSkipped
                    ? ''
                    : 'border-l-4 border-l-red-500'
                }`}
              >
                {/* Question Top Header (Subject & Status) */}
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-900 bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-0.5 rounded-md">
                      {q.subject}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 text-xs font-black flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" /> সঠিক (+১.০)
                      </span>
                    ) : isSkipped ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1">
                        <MinusCircle className="w-3.5 h-3.5 text-slate-500" /> উত্তর দেননি
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-rose-950/60 text-red-700 dark:text-rose-300 text-xs font-black flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-red-600 dark:text-rose-400" /> ভুল উত্তর (-০.২৫)
                      </span>
                    )}

                    <button
                      onClick={() => toggleBookmark(q.id)}
                      className="p-1.5 rounded-lg neu-btn text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                      title="বুকমার্ক"
                    >
                      <Award className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Top Question Row: Number badge followed immediately by question text */}
                <div 
                  className={`flex items-start gap-3 my-2 ${
                    parsedQ.isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'
                  }`}
                >
                  {/* Question Index Badge */}
                  <div className="w-8 h-8 rounded-full bg-[#1e293b] dark:bg-slate-700 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs mt-0.5 select-none">
                    {parsedQ.isArabicNumbering ? (idx + 1).toLocaleString('ar-EG') : (idx + 1).toLocaleString('bn-BD')}
                  </div>

                  {/* Question Content */}
                  <div className={`flex-1 ${parsedQ.primaryTextAlign}`}>
                    {parsedQ.isArabicWithBengali ? (
                      <div className="space-y-1">
                        <h4 
                          className="font-arabic text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 leading-relaxed" 
                          dir="rtl"
                        >
                          {formatArabicText(parsedQ.arabicText)}
                        </h4>
                        <p 
                          className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 leading-relaxed text-right" 
                          dir="ltr"
                        >
                          {parsedQ.bengaliTranslation}
                        </p>
                      </div>
                    ) : (
                      <h4 
                        className={`leading-relaxed text-slate-900 dark:text-slate-100 ${parsedQ.primaryTextAlign} ${
                          parsedQ.isRTL ? 'font-arabic text-lg sm:text-xl font-black' : 'font-bold text-sm sm:text-base'
                        }`}
                        dir={parsedQ.primaryDir}
                      >
                        {formatArabicText(parsedQ.singleText)}
                      </h4>
                    )}
                  </div>
                </div>

                      {/* Options List */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {q.options.map((opt: string, optIdx: number) => {
                          const isUserPick = userChoice === optIdx;
                          const isRightAnswer = q.correctIndex === optIdx;
                          const formattedOpt = formatArabicText(opt);
                          const label = optConfig.labels[optIdx] || (optConfig.isRTL ? ['أ', 'ب', 'ج', 'د'][optIdx] : ['ক', 'খ', 'গ', 'ঘ'][optIdx]);

                          let badgeStyle = 'neu-btn text-slate-700 dark:text-slate-200';
                          if (isRightAnswer) {
                            badgeStyle = 'bg-emerald-100/90 dark:bg-emerald-950/60 border border-emerald-600 dark:border-emerald-500 text-emerald-950 dark:text-emerald-200 font-black shadow-xs';
                          } else if (isUserPick && !isRightAnswer) {
                            badgeStyle = 'bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 line-through';
                          }

                          return (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-2xl text-xs sm:text-sm flex items-center justify-between gap-2 ${
                                optConfig.isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'
                              } ${badgeStyle}`}
                            >
                              <div className={`flex items-center gap-2 flex-1 min-w-0 ${optConfig.isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                                <span className="w-6 h-6 rounded-lg bg-white/90 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-black flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-700">
                                  {label}
                                </span>
                                <span 
                                  className={`font-medium leading-snug flex-1 ${optConfig.textAlign} ${
                                    optConfig.isRTL ? 'font-arabic text-sm sm:text-base font-bold' : ''
                                  }`}
                                  dir={optConfig.dir}
                                >
                                  {formattedOpt}
                                </span>
                              </div>
                              {isRightAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />}
                              {isUserPick && !isRightAnswer && <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>

                      {/* Static Explanation Inset */}
                      <div className="p-3.5 neu-inset rounded-2xl text-xs sm:text-sm text-slate-800 space-y-1">
                        <span className="font-bold text-emerald-950 block">ব্যাখ্যা ও নিয়ম:</span>
                        <p 
                          className={`text-slate-600 leading-relaxed ${expDir.textAlign} ${
                            expDir.isPureArabic ? 'font-arabic text-sm sm:text-base font-medium' : 'font-normal'
                          }`}
                          dir={expDir.dir}
                        >
                          {formatArabicText(q.explanation)}
                        </p>
                      </div>

                {/* Tamreen AI Instant Deep Explanation */}
                {aiData?.loading ? (
                  <div className="p-3 bg-emerald-950 text-emerald-200 rounded-2xl text-xs flex items-center gap-2 animate-pulse">
                    <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                    <span>তামরীন এআই গভীর অ্যাকাডেমিক বিশ্লেষণ প্রস্তুত করছে...</span>
                  </div>
                ) : aiData?.text ? (
                  <div className="p-4 bg-gradient-to-br from-emerald-950 to-slate-950 text-emerald-100 rounded-2xl border border-emerald-600/50 shadow-md space-y-2">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300 border-b border-emerald-800 pb-1.5">
                      <Bot className="w-4 h-4 text-amber-300" />
                      <span>তামরীন এআই স্পেশাল বিশ্লেষণ ও নিয়ম কানুন</span>
                    </div>
                    <div className="text-xs sm:text-sm space-y-1 text-emerald-50 leading-relaxed font-sans">
                      <Markdown>{aiData.text}</Markdown>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAskAIExplanation(q)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl neu-btn text-emerald-900 text-xs font-black transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>তামরীন AI দিয়ে বিস্তারিত ব্যাখ্যা দেখুন</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#e9edf5] border-t border-white/60 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              setViewingResult(null);
              startExam(exam);
            }}
            className="px-4 py-2.5 neu-btn text-slate-800 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
            <span>আবার পরীক্ষা দিন</span>
          </button>

          <button
            onClick={() => setViewingResult(null)}
            className="px-6 py-2.5 neu-btn font-bold text-xs sm:text-sm rounded-xl text-slate-700 hover:text-slate-900"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
