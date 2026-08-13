import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useFont } from '../../context/FontContext';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  Sparkles,
  Inbox
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExamResult } from '../../types';

// Helper to detect if a string contains Arabic characters
const isArabic = (text?: string): boolean => {
  if (!text) return false;
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicPattern.test(text);
};

export const ExamModal: React.FC = () => {
  const { activeExam, closeExam, saveExamResult } = useApp();
  const { formatArabicText } = useFont();

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activeExam) {
      setAnswers({});
      setTimeLeft(activeExam.durationMinutes * 60);
      setShowExitConfirm(false);
      setShowSubmitConfirm(false);
    }
  }, [activeExam]);

  // Countdown timer
  useEffect(() => {
    if (!activeExam || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeExam, timeLeft]);

  if (!activeExam) return null;

  const totalQuestions = activeExam.questions.length;
  const answeredCount = Object.keys(answers).length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => {
      // Toggle or select
      if (prev[questionId] === optionIndex) {
        const copy = { ...prev };
        delete copy[questionId];
        return copy;
      }
      return {
        ...prev,
        [questionId]: optionIndex,
      };
    });
  };

  const handleSubmitExam = () => {
    setIsSubmitting(true);

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    activeExam.questions.forEach((q) => {
      const selected = answers[q.id];
      if (selected === undefined) {
        skippedCount += 1;
      } else if (selected === q.correctIndex) {
        correctCount += 1;
      } else {
        wrongCount += 1;
      }
    });

    const marksPerQuestion = activeExam.totalMarks / (totalQuestions || 1);
    const score = Math.max(
      0,
      correctCount * marksPerQuestion - wrongCount * (activeExam.negativeMarking || 0.25)
    );

    const timeSpent = activeExam.durationMinutes * 60 - timeLeft;

    const result: ExamResult = {
      id: `res-${Date.now()}`,
      examId: activeExam.id,
      examTitle: activeExam.title,
      date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
      score: Number(score.toFixed(2)),
      totalMarks: activeExam.totalMarks,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      skippedAnswers: skippedCount,
      timeSpentSeconds: timeSpent > 0 ? timeSpent : 30,
      userAnswers: answers,
      rank: Math.floor(Math.random() * 10) + 1,
      totalParticipants: activeExam.participantsCount + 1,
    };

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback
    }

    setTimeout(() => {
      saveExamResult(result);
      closeExam();
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f0f4f9] dark:bg-slate-950 text-slate-900 dark:text-slate-100 animate-fadeIn select-none">
      {/* 1. Sticky Header Bar (Matching Screenshots) */}
      <header className="sticky top-0 z-30 bg-[#004d2e] text-white px-3 sm:px-5 py-3 shadow-md flex items-center justify-between gap-2 shrink-0">
        {/* Left: Exit button */}
        <button
          onClick={() => setShowExitConfirm(true)}
          className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white flex items-center gap-1.5 text-xs font-bold"
          title="পরীক্ষা থেকে বের হন"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">প্রস্থান</span>
        </button>

        {/* Center: Live Timer & Answer Count */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Timer */}
          <div className={`px-3 py-1 rounded-full font-mono text-xs sm:text-sm font-black flex items-center gap-1.5 border ${
            timeLeft < 120
              ? 'bg-red-600/90 text-white border-red-400 animate-pulse'
              : 'bg-[#02331f] text-emerald-300 border-emerald-500/40'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {/* Answer Count Pill */}
          <div className="bg-[#02331f] border border-emerald-500/40 text-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
            {answeredCount.toLocaleString('bn-BD')}/{totalQuestions.toLocaleString('bn-BD')} উত্তর
          </div>
        </div>

        {/* Right: Submit Button */}
        <button
          onClick={() => setShowSubmitConfirm(true)}
          className="bg-[#fbbf24] hover:bg-[#f59e0b] active:scale-95 text-[#02331f] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-md transition-all"
        >
          <Inbox className="w-4 h-4" />
          <span>জমা দিন</span>
        </button>
      </header>

      {/* 2. Scrollable Question Sheet (Continuous upward/downward vertical scroll) */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 space-y-4 max-w-3xl w-full mx-auto pb-28">
        {/* Exam Title Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 text-center space-y-1">
          <h2 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100">
            {activeExam.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            বিষয়: {activeExam.subject} • মোট নম্বর: {activeExam.totalMarks} • মোট প্রশ্ন: {totalQuestions}
          </p>
        </div>

        {/* Question Cards List */}
        {activeExam.questions.map((question, qIndex) => {
          const selectedOption = answers[question.id];
          const hasSelected = selectedOption !== undefined;
          
          // Detect if question is in Arabic or has arabic question text
          const questionIsArabic = question.language === 'ar' || isArabic(question.arabicQuestion) || isArabic(question.question);
          const defaultBnLabels = ['ক', 'খ', 'গ', 'ঘ'];
          const defaultEnLabels = ['A', 'B', 'C', 'D'];
          const defaultArLabels = ['أ', 'ب', 'ج', 'د'];

          // Determine option letter labels
          const optionLabels = question.optionLabels || (
            questionIsArabic 
              ? defaultArLabels 
              : (question.language === 'en' ? defaultEnLabels : defaultBnLabels)
          );

          return (
            <div
              key={question.id}
              id={`question-card-${qIndex}`}
              className={`bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border transition-all ${
                hasSelected 
                  ? 'border-emerald-500/60 dark:border-emerald-600/60 shadow-[0_4px_16px_rgba(5,150,105,0.08)]' 
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Top Question Row */}
              <div className={`flex items-start gap-3 mb-4 ${questionIsArabic ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                {/* Question Index Badge */}
                <div className="w-8 h-8 rounded-full bg-[#1e293b] dark:bg-slate-700 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  {questionIsArabic ? (qIndex + 1).toLocaleString('ar-EG') : (qIndex + 1).toLocaleString('bn-BD')}
                </div>

                {/* Question Text (Arabic right-aligned, Bengali/English left-aligned) */}
                <div className={`flex-1 ${questionIsArabic ? 'text-right' : 'text-left'}`}>
                  {/* Arabic question text if available */}
                  {question.arabicQuestion && (
                    <p 
                      className="font-arabic text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 leading-relaxed mb-1.5"
                      dir="rtl"
                    >
                      {formatArabicText(question.arabicQuestion)}
                    </p>
                  )}

                  {/* Main question statement */}
                  <h3 
                    className={`font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed ${
                      questionIsArabic ? 'font-arabic text-base sm:text-lg' : ''
                    }`}
                    dir={questionIsArabic ? 'rtl' : 'ltr'}
                  >
                    {formatArabicText(question.question)}
                  </h3>
                </div>
              </div>

              {/* Options Grid / List */}
              <div className="space-y-2.5">
                {question.options.map((opt, optIdx) => {
                  const isOptSelected = selectedOption === optIdx;
                  const optIsArabic = isArabic(opt) || questionIsArabic;
                  const label = optionLabels[optIdx] || defaultBnLabels[optIdx];

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(question.id, optIdx)}
                      className={`w-full p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer text-sm font-bold ${
                        optIsArabic 
                          ? 'flex-row-reverse text-right' 
                          : 'flex-row text-left'
                      } ${
                        isOptSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-[#004d2e] dark:border-emerald-500 text-[#004d2e] dark:text-emerald-300 shadow-xs scale-[1.005]'
                          : 'bg-slate-50/70 dark:bg-slate-800/60 hover:bg-slate-100/90 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {/* Option Letter Indicator */}
                      <div className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center shrink-0 transition-colors ${
                        isOptSelected
                          ? 'bg-[#004d2e] text-white shadow-xs'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {label}
                      </div>

                      {/* Option Text */}
                      <span 
                        className={`flex-1 leading-snug font-medium ${
                          optIsArabic ? 'font-arabic text-base font-bold' : 'text-xs sm:text-sm'
                        }`}
                        dir={optIsArabic ? 'rtl' : 'ltr'}
                      >
                        {formatArabicText(opt)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Bottom Submit Action Plate */}
        <div className="pt-4 text-center">
          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="w-full max-w-sm mx-auto py-3.5 rounded-2xl bg-[#004d2e] hover:bg-[#003d24] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
          >
            <CheckCircle2 className="w-5 h-5 text-amber-300" />
            <span>পরীক্ষা সম্পূর্ণ করুন ও জমা দিন</span>
          </button>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            সর্বমোট {answeredCount}টি প্রশ্নের উত্তর নির্বাচন করেছেন
          </p>
        </div>
      </main>

      {/* 3. Exit Confirmation Modal (Matching Screenshot 6) */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-scaleUp">
            {/* Warning Icon Badge in Soft Yellow Circle */}
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            {/* Warning Text */}
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100">
                আপনি কি পরীক্ষা থেকে বের হয়ে যেতে চান?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                এখন বের হয়ে গেলে আপনার পরীক্ষাটি বাতিল হবে এবং দেয়া উত্তরগুলো সংরক্ষিত হবে না।
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              {/* Stay in exam button */}
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="w-full py-3 rounded-2xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-98"
              >
                পরীক্ষায় থাকুন
              </button>

              {/* Exit button */}
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false);
                  closeExam();
                }}
                className="w-full py-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-400 font-bold text-xs sm:text-sm border border-rose-200 dark:border-rose-900/60 transition-all"
              >
                বের হয়ে যান
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Final Submit Confirmation Dialog */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100 dark:border-slate-800 space-y-4 animate-scaleUp">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-[#004d2e] dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                আপনি কি পরীক্ষা জমা দিতে চান?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                আপনি মোট <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{answeredCount}</strong>টি প্রশ্নের উত্তর দিয়েছেন এবং <strong className="text-amber-600 font-bold">{totalQuestions - answeredCount}</strong>টি বাকি আছে।
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
              >
                আরো লিখব
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitExam}
                className="flex-1 py-2.5 rounded-xl bg-[#004d2e] hover:bg-[#003822] text-white text-xs font-black shadow-md transition-all active:scale-98"
              >
                {isSubmitting ? 'জমা হচ্ছে...' : 'হ্যাঁ, জমা দিন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
