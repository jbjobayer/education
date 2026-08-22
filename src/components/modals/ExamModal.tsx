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
  Inbox,
  Lock,
  Check,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExamResult, Question } from '../../types';
import { 
  getUnifiedQuestionText, 
  getTextDirection, 
  getOptionsConfig,
  parseQuestionData 
} from '../../utils/questionUtils';
import { supabaseService } from '../../services/supabaseService';

export const ExamModal: React.FC = () => {
  const { activeExam, closeExam, saveExamResult, showToast, participantInfo, userProfile } = useApp();
  const { formatArabicText } = useFont();

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadedQuestions, setLoadedQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  useEffect(() => {
    if (activeExam) {
      setAnswers({});
      setTimeLeft(activeExam.durationMinutes * 60);
      setShowExitConfirm(false);
      setShowSubmitConfirm(false);

      if (activeExam.questions && activeExam.questions.length > 0) {
        setLoadedQuestions(activeExam.questions);
      } else {
        setIsLoadingQuestions(true);
        supabaseService.getExamQuestions(activeExam.id, activeExam.examType).then((qs) => {
          setLoadedQuestions(qs);
          setIsLoadingQuestions(false);
        }).catch(() => {
          setIsLoadingQuestions(false);
        });
      }
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

  const questionsList = loadedQuestions.length > 0 ? loadedQuestions : activeExam.questions;
  const totalQuestions = questionsList.length;
  const answeredCount = Object.keys(answers).length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    // STRICT LOCK: Once an option is selected for a question, it CANNOT be changed or deselected
    if (answers[questionId] !== undefined) {
      showToast('একবার উত্তর নির্বাচন করার পর তা লক হয়ে যায় এবং আর পরিবর্তন করা যায় না।', 'info');
      return;
    }
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitExam = () => {
    setIsSubmitting(true);

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    questionsList.forEach((q) => {
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

    const participantName = participantInfo?.name?.trim() || userProfile?.name || 'মুহাম্মদ শিক্ষার্থী';
    const participantInstitution = participantInfo?.institution?.trim() || userProfile?.institution || '';
    const participantPhone = participantInfo?.phone?.trim() || userProfile?.phone || '';

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
      examType: activeExam.examType,
      courseId: activeExam.courseId || activeExam.course_id,
      participantName,
      participantInstitution,
      participantPhone
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
        {isLoadingQuestions ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <Loader2 className="w-8 h-8 text-[#005a36] animate-spin" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-400">প্রশ্নপত্র লোড হচ্ছে...</p>
          </div>
        ) : questionsList.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 text-center space-y-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                এই পরীক্ষায় এখনও কোনো প্রশ্ন পাওয়া যায়নি
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Supabase ডাটাবেজের <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-emerald-700 dark:text-emerald-400">questions</code> টেবিলে এই পরীক্ষার জন্য প্রশ্ন যুক্ত করুন।
              </p>
              <div className="pt-2 text-[11px] font-mono bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                exam_id: <span className="font-bold text-emerald-600 dark:text-emerald-400">{activeExam.id}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={async () => {
                  setIsLoadingQuestions(true);
                  const qs = await supabaseService.getExamQuestions(activeExam.id);
                  setLoadedQuestions(qs);
                  setIsLoadingQuestions(false);
                  if (qs.length > 0) {
                    showToast(`${qs.length}টি প্রশ্ন লোড হয়েছে`, 'success');
                  } else {
                    showToast('এখনও প্রশ্ন পাওয়া যায়নি। টেবিলে রো যুক্ত করা হয়েছে কিনা দেখুন।', 'info');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-[#004d2e] hover:bg-[#003d24] text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Loader2 className={`w-3.5 h-3.5 ${isLoadingQuestions ? 'animate-spin' : ''}`} />
                <span>পুনরায় রিফ্রেশ করুন</span>
              </button>
              <button
                type="button"
                onClick={closeExam}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer"
              >
                ফিরে যান
              </button>
            </div>
          </div>
        ) : (
          questionsList.map((question, qIndex) => {
          const selectedOption = answers[question.id];
          const hasSelected = selectedOption !== undefined;
          
          // Parse question text, sub-translation, and direction configuration
          const parsedQ = parseQuestionData(question);

          // Get options majority configuration
          const optionsConfig = getOptionsConfig(question.options, question.optionLabels);

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
              {/* Top Question Row: Question index directly followed by the question */}
              <div 
                className={`flex items-start gap-3 mb-4 ${
                  parsedQ.isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'
                }`}
              >
                {/* Question Index Badge */}
                <div className="w-8 h-8 rounded-full bg-[#1e293b] dark:bg-slate-700 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs mt-0.5 select-none">
                  {parsedQ.isArabicNumbering ? (qIndex + 1).toLocaleString('ar-EG') : (qIndex + 1).toLocaleString('bn-BD')}
                </div>

                {/* Question Content */}
                <div className={`flex-1 ${parsedQ.primaryTextAlign}`}>
                  {parsedQ.isArabicWithBengali ? (
                    <div className="space-y-1">
                      <h3 
                        className="font-arabic text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 leading-relaxed"
                        dir="rtl"
                      >
                        {formatArabicText(parsedQ.arabicText)}
                      </h3>
                      <p 
                        className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 leading-relaxed text-right"
                        dir="ltr"
                      >
                        {parsedQ.bengaliTranslation}
                      </p>
                    </div>
                  ) : (
                    <h3 
                      className={`font-bold leading-relaxed text-slate-900 dark:text-slate-100 ${
                        parsedQ.isRTL 
                          ? 'font-arabic text-lg sm:text-xl font-black' 
                          : 'text-sm sm:text-base'
                      }`}
                      dir={parsedQ.primaryDir}
                    >
                      {formatArabicText(parsedQ.singleText)}
                    </h3>
                  )}
                </div>
              </div>

              {/* Options Grid / List adhering to Majority Language Direction */}
              <div className="space-y-2.5">
                {question.options.map((opt, optIdx) => {
                  const isOptSelected = selectedOption === optIdx;
                  const label = optionsConfig.labels[optIdx] || (optionsConfig.isRTL ? ['أ', 'ب', 'ج', 'د'][optIdx] : ['ক', 'খ', 'গ', 'ঘ'][optIdx]);

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={hasSelected && !isOptSelected}
                      onClick={() => handleSelectOption(question.id, optIdx)}
                      className={`w-full p-3 sm:p-3.5 rounded-2xl border transition-all flex items-center gap-3 text-sm font-bold ${
                        optionsConfig.isRTL 
                          ? 'flex-row-reverse text-right' 
                          : 'flex-row text-left'
                      } ${
                        isOptSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 dark:border-emerald-500 text-[#004d2e] dark:text-emerald-300 shadow-xs ring-1 ring-emerald-500/40 cursor-default'
                          : hasSelected
                          ? 'bg-slate-100/50 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-60 cursor-not-allowed'
                          : 'bg-slate-50/70 dark:bg-slate-800/60 hover:bg-slate-100/90 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer active:scale-[0.99]'
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
                        className={`flex-1 leading-snug font-medium ${optionsConfig.textAlign} ${
                          optionsConfig.isRTL ? 'font-arabic text-base font-bold' : 'text-xs sm:text-sm'
                        }`}
                        dir={optionsConfig.dir}
                      >
                        {formatArabicText(opt)}
                      </span>

                      {/* Selected Lock Badge */}
                      {isOptSelected && (
                        <span className="shrink-0 flex items-center gap-1 text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-2xs">
                          <Lock className="w-2.5 h-2.5" />
                          <span>লকড</span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Locked Answer Feedback Bar */}
              {hasSelected && (
                <div className="mt-3 pt-2.5 border-t border-emerald-500/20 flex items-center justify-between text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>উত্তর চূড়ান্তভাবে সংরক্ষিত ও লক করা হয়েছে (পরিবর্তন অযোগ্য)</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-500/30 text-emerald-900 dark:text-emerald-300 font-bold">
                    লকড ✓
                  </span>
                </div>
              )}
            </div>
          );
        }))}

        {/* Bottom Submit Action Plate */}
        {questionsList.length > 0 && (
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
        )}
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
