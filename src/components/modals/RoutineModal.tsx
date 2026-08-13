import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Clock, Video, BookOpen, CheckCircle, UserCheck } from 'lucide-react';

export const RoutineModal: React.FC = () => {
  const { isRoutineOpen, setIsRoutineOpen, routines, showToast } = useApp();

  if (!isRoutineOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#e9edf5] rounded-3xl max-w-lg w-full max-h-[88vh] flex flex-col neu-card overflow-hidden border border-white/80">
        {/* Header */}
        <div className="p-4 px-5 flex items-center justify-between border-b border-white/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 neu-btn rounded-xl flex items-center justify-center text-emerald-800">
              <Calendar className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">সাপ্তাহিক লাইভ ক্লাস রুটিন</h3>
              <p className="text-[11px] text-emerald-800 font-semibold">১৯তম শিক্ষক নিবন্ধন ও মাদ্রাসা স্পেশাল ব্যাচ</p>
            </div>
          </div>
          <button
            onClick={() => setIsRoutineOpen(false)}
            className="p-2 rounded-xl neu-btn text-slate-600 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-[#e9edf5]">
          {routines.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl transition-all ${
                item.status === 'live'
                  ? 'neu-card border-l-4 border-l-red-500'
                  : item.status === 'upcoming'
                  ? 'neu-card-sm'
                  : 'neu-inset opacity-85'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{item.day} • {item.time}</span>
                </div>
                {item.status === 'live' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center gap-1 animate-pulse shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span> লাইভ চলছে
                  </span>
                )}
                {item.status === 'upcoming' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black shadow-xs">
                    আসন্ন
                  </span>
                )}
                {item.status === 'completed' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-300 text-slate-700 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-700" /> সম্পন্ন
                  </span>
                )}
              </div>

              <h4 className="font-extrabold text-sm text-slate-900 mb-1">{item.subject}</h4>
              <p className="text-xs text-slate-600 mb-2 flex items-center gap-1 font-normal">
                <BookOpen className="w-3.5 h-3.5 text-emerald-700" /> টপিক: <span className="font-bold text-slate-800">{item.topic}</span>
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-white/60 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-800" /> {item.instructor}
                </span>
                {item.status === 'live' ? (
                  <button
                    onClick={() => {
                      showToast('লাইভ ক্লাসরুমে যুক্ত হচ্ছেন...', 'success');
                      setIsRoutineOpen(false);
                    }}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1 shadow-sm"
                  >
                    <Video className="w-3.5 h-3.5" /> জয়েন করুন
                  </button>
                ) : item.status === 'completed' ? (
                  <button
                    onClick={() => {
                      showToast('রেকর্ডেড ভিডিও প্লেয়ার লোড হচ্ছে...', 'info');
                    }}
                    className="px-3 py-1 neu-btn text-slate-700 hover:text-emerald-900 font-bold rounded-xl text-xs"
                  >
                    রেকর্ড দেখুন
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-900 font-bold bg-emerald-100 px-2 py-0.5 rounded-lg">
                    {item.batchName}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#e9edf5] border-t border-white/60 text-center">
          <button
            onClick={() => setIsRoutineOpen(false)}
            className="w-full py-2.5 neu-btn font-bold text-xs text-slate-700 rounded-xl"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
