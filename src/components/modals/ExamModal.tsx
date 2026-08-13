import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ExamResult } from '../../types';

export const ExamModal: React.FC = () => {
  const { activeExam, closeExam, saveExamResult, bookmarks, toggleBookmark } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activeExam) {
      setCurrentIndex(0);
      setAnswers({});
      setTimeLeft(activeExam.durationMinutes * 60);
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

  const currentQuestion = activeExam.questions[currentIndex];
  const totalQuestions = activeExam.questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    setAnswers((prev) => {
      // Toggle if already selected
      if (prev[currentQuestion.id] === optionIndex) {
        const copy = { ...prev };
        delete copy[currentQuestion.id];
        return copy;
      }
      return {
        ...prev,
        [currentQuestion.id]: optionIndex,
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

    const marksPerQuestion = activeExam.totalMarks / totalQuestions;
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
      rank: Math.floor(Math.random() * 15) + 3,
      totalParticipants: activeExam.participantsCount + 1,
    };

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // graceful fallback
    }

    setTimeout(() => {
      saveExamResult(result);
      closeExam();
      setIsSubmitting(false);
    }, 600);
  };

  const answeredCount = Object.keys(answers).length;
  const isBookmarked = bookmarks.includes(currentQuestion?.id);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#e9edf5] text-slate-800 animate-fadeIn">
      {/* Test Engine Top Bar */}
      <header className="bg-[#e9edf5] px-4 py-3 border-b border-white/60 shadow-[0_4px_12px_rgba(195,207,226,0.5)] flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
          <div>
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate max-w-[200px] sm:max-w-md">
              {activeExam.title}
            </h3>
            <span className="text-[10px] text-emerald-800 font-bold">
              নেগেটিভ মার্কিং: {activeExam.negativeMarking} • মোট প্রশ্ন: {totalQuestions}
            </span>
          </div>
        </div>

        {/* Live Timer & Submit */}
        <div className="flex items-center gap-3">
          <div className={`px-3.5 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-black flex items-center gap-1.5 ${
            timeLeft < 180
              ? 'neu-inset text-red-600 animate-pulse'
              : 'neu-inset text-emerald-800'
          }`}>
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="px-4 py-2 rounded-xl neu-btn-primary font-black text-xs sm:text-sm flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">সাবমিট করুন</span>
          </button>
        </div>
      </header>

      {/* Main Examination View */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Question Sheet */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between bg-[#e9edf5]">
          <div>
            {/* Subject Tag & Question Number */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-black">
                  প্রশ্ন {currentIndex + 1} / {totalQuestions}
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  {currentQuestion?.subject}
                </span>
              </div>

              <button
                onClick={() => toggleBookmark(currentQuestion.id)}
                className={`p-2 rounded-xl neu-btn flex items-center gap-1.5 text-xs font-bold ${
                  isBookmarked
                    ? 'text-amber-700 bg-amber-100 ring-1 ring-amber-400'
                    : 'text-slate-600'
                }`}
                title="রিভিউ করার জন্য সেভ করুন"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span className="hidden sm:inline">রিভিউ মার্ক</span>
              </button>
            </div>

            {/* Arabic / Bengali Question text with Neumorphic Plate */}
            <div className="neu-card p-5 sm:p-6 rounded-3xl mb-5 border border-white/80">
              {currentQuestion?.arabicQuestion && (
                <p className="font-arabic text-xl sm:text-2xl text-emerald-950 text-right leading-relaxed mb-3 dir-rtl font-extrabold">
                  {currentQuestion.arabicQuestion}
                </p>
              )}
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-relaxed">
                {currentQuestion?.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3.5">
              {currentQuestion?.options.map((opt, optIdx) => {
                const isSelected = answers[currentQuestion.id] === optIdx;
                const optionLetters = ['ক', 'খ', 'গ', 'ঘ'];

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-4 rounded-2xl text-left flex items-center gap-3.5 transition-all ${
                      isSelected
                        ? 'neu-inset text-emerald-950 font-black scale-101 border border-emerald-600/40'
                        : 'neu-btn text-slate-800 font-medium'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-emerald-800 text-amber-300 shadow-md'
                        : 'neu-icon text-slate-700'
                    }`}>
                      {optionLetters[optIdx]}
                    </div>
                    <span className="text-sm sm:text-base font-bold flex-1 leading-snug">
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Navigator Controls */}
          <div className="pt-6 border-t border-white/60 flex items-center justify-between gap-3 mt-6">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2.5 rounded-xl neu-btn disabled:opacity-30 text-slate-700 text-xs sm:text-sm font-bold flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              পূর্ববর্তী
            </button>

            <div className="text-xs text-slate-500 font-bold">
              উত্তর প্রদত্ত: <span className="text-emerald-800 font-extrabold">{answeredCount}</span>/{totalQuestions}
            </div>

            {isLastQuestion ? (
              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="px-5 py-2.5 rounded-xl neu-btn-primary text-xs sm:text-sm font-black flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                পরীক্ষা শেষ করুন
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl neu-btn font-bold text-slate-800 hover:text-emerald-900 text-xs sm:text-sm flex items-center gap-1.5"
              >
                পরবর্তী
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Side / Bottom: Question Palette */}
        <div className="w-full md:w-72 bg-[#e4ebf4] p-4 border-t md:border-t-0 md:border-l border-white/60 flex flex-col shrink-0 shadow-inner">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-black text-xs uppercase tracking-wider text-emerald-950">
              প্রশ্ন নেভিগেটর
            </h4>
            <span className="text-[11px] text-emerald-800 font-bold">
              {answeredCount}/{totalQuestions} সম্পন্ন
            </span>
          </div>

          {/* Palette grid */}
          <div className="grid grid-cols-5 md:grid-cols-4 gap-2 overflow-y-auto max-h-48 md:max-h-none flex-1 pr-1">
            {activeExam.questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = currentIndex === idx;
              const hasBookmark = bookmarks.includes(q.id);

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-10 rounded-xl font-bold text-xs flex items-center justify-center relative transition-all ${
                    isCurrent
                      ? 'ring-2 ring-amber-500 font-black'
                      : ''
                  } ${
                    isAnswered
                      ? 'bg-emerald-700 text-white font-black shadow-md'
                      : 'neu-btn text-slate-700'
                  }`}
                >
                  {idx + 1}
                  {hasBookmark && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="pt-3 border-t border-white/60 mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-700"></span> উত্তর প্রদত্ত
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded neu-btn"></span> বাকি আছে
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded ring-2 ring-amber-500 bg-[#e9edf5]"></span> বর্তমান
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> রিভিউ মার্ক
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal before Submit */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-[#e9edf5] neu-card rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4 border border-white/80">
            <div className="w-12 h-12 rounded-2xl neu-btn text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900">আপনি কি পরীক্ষা জমা দিতে চান?</h3>
              <p className="text-xs text-slate-600 mt-1.5 font-medium leading-relaxed">
                আপনি মোট <strong className="text-emerald-800 font-bold">{answeredCount}</strong>টি প্রশ্নের উত্তর দিয়েছেন এবং <strong className="text-amber-700 font-bold">{totalQuestions - answeredCount}</strong>টি প্রশ্ন এখনো বাকি আছে।
              </p>
            </div>

            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl neu-btn text-slate-700 text-xs font-bold"
              >
                আরো লিখব
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitExam}
                className="flex-1 py-2.5 rounded-xl neu-btn-primary text-xs font-black"
              >
                {isSubmitting ? 'প্রক্রিয়াধীন...' : 'হ্যাঁ, সাবমিট করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
