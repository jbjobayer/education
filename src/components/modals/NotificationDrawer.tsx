import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bell, AlertTriangle, BookOpen, Award, CheckCircle } from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const { isNotificationOpen, setIsNotificationOpen, notices, setActiveTab } = useApp();

  if (!isNotificationOpen) return null;

  const getTagIcon = (tag: string) => {
    switch (tag) {
      case 'জরুরি':
        return <AlertTriangle className="w-3.5 h-3.5 text-red-600" />;
      case 'পরীক্ষা':
        return <Award className="w-3.5 h-3.5 text-amber-600" />;
      case 'ক্লাস':
        return <BookOpen className="w-3.5 h-3.5 text-emerald-700" />;
      default:
        return <CheckCircle className="w-3.5 h-3.5 text-blue-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#e9edf5] w-full max-w-md h-full flex flex-col neu-card overflow-hidden border-l border-white/80 animate-slideLeft">
        {/* Header */}
        <div className="p-4 px-5 flex items-center justify-between border-b border-white/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 neu-btn rounded-xl flex items-center justify-center text-emerald-800">
              <Bell className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">নোটিশ ও বিজ্ঞপ্তি</h3>
              <p className="text-[11px] text-slate-500 font-medium">সর্বশেষ আপডেট এবং গুরুত্বপূর্ণ বার্তা</p>
            </div>
          </div>
          <button
            onClick={() => setIsNotificationOpen(false)}
            className="p-2 rounded-xl neu-btn text-slate-600 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notices list */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-[#e9edf5]">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`p-4 rounded-2xl transition-all ${
                notice.isImportant
                  ? 'neu-card border-l-4 border-l-amber-500'
                  : 'neu-card-sm'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 flex items-center gap-1">
                  {getTagIcon(notice.tag)} {notice.tag}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">{notice.date}</span>
              </div>

              <h4 className="font-extrabold text-sm text-slate-900 mb-1 leading-snug">{notice.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{notice.content}</p>

              {notice.tag === 'পরীক্ষা' && (
                <div className="mt-3 pt-2 border-t border-white/60 flex justify-end">
                  <button
                    onClick={() => {
                      setIsNotificationOpen(false);
                      setActiveTab('exams');
                    }}
                    className="text-xs font-black text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                  >
                    পরীক্ষা সেকশনে যান →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#e9edf5] border-t border-white/60">
          <button
            onClick={() => setIsNotificationOpen(false)}
            className="w-full py-2.5 neu-btn font-bold text-xs text-slate-700 rounded-xl"
          >
            ঠিক আছে
          </button>
        </div>
      </div>
    </div>
  );
};
