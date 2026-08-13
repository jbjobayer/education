import React from 'react';
import { 
  Landmark, 
  Clock, 
  FileText, 
  CheckCircle2, 
  Play, 
  Users,
  Check
} from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
  onClick: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isEnrolled = false,
  onClick,
}) => {
  // Convert number to Bengali for price
  const toBn = (num: number | string) => {
    return String(num).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);
  };

  const isGreenTheme = isEnrolled;
  const batchLabel = course.batchType || course.badge || 'রেকর্ড ব্যাচ';
  const tagLabel = course.shortTag || course.title.slice(0, 12) + '...';

  return (
    <div
      onClick={onClick}
      className="rounded-3xl bg-[#e9edf5] dark:bg-[#111b2b] shadow-[4px_4px_12px_rgba(195,207,226,0.85),-4px_-4px_12px_rgba(255,255,255,0.95)] dark:shadow-[4px_4px_12px_rgba(0,0,0,0.5),-4px_-4px_12px_rgba(255,255,255,0.04)] border border-white/60 dark:border-slate-800/80 p-3 sm:p-4 cursor-pointer hover:shadow-[2px_2px_6px_rgba(195,207,226,0.7),-2px_-2px_6px_rgba(255,255,255,0.9)] dark:hover:shadow-[2px_2px_6px_rgba(0,0,0,0.7),-2px_-2px_6px_rgba(255,255,255,0.06)] transition-all active:scale-[0.99] flex items-center gap-3 sm:gap-4 select-none group"
    >
      {/* Left Plate */}
      <div
        className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex flex-col items-center justify-center p-2 text-center shrink-0 shadow-xs transition-transform group-hover:scale-102 ${
          isGreenTheme
            ? 'bg-[#e6f7ef] dark:bg-[#064e3b]/30 border border-[#a7f3d0] dark:border-emerald-700/50'
            : 'bg-[#fef9c3]/75 dark:bg-[#78350f]/20 border border-[#fde047] dark:border-amber-700/40'
        }`}
      >
        {/* Top Circle with Building Icon */}
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-xs shrink-0 ${
            isGreenTheme
              ? 'bg-[#005a36] text-emerald-100'
              : 'bg-[#0f172a] text-amber-400'
          }`}
        >
          <Landmark className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
        </div>

        {/* Middle Badge */}
        <div
          className={`text-[9.5px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md mt-1.5 whitespace-nowrap shadow-2xs leading-tight ${
            isGreenTheme
              ? 'bg-[#005a36] text-white'
              : 'bg-[#0f172a] text-white'
          }`}
        >
          {batchLabel}
        </div>

        {/* Bottom Short Title */}
        <span
          className={`text-[9.5px] sm:text-[10px] font-bold truncate max-w-[82px] sm:max-w-[95px] mt-1 leading-none ${
            isGreenTheme ? 'text-[#005a36] dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'
          }`}
        >
          {tagLabel}
        </span>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 h-full">
        <div>
          {/* Course Title */}
          <h3 className="font-extrabold text-sm sm:text-base text-[#111827] dark:text-slate-100 group-hover:text-emerald-900 dark:group-hover:text-emerald-400 transition-colors leading-tight line-clamp-1">
            {course.title}
          </h3>

          {/* Student Count Badge (Shown if not enrolled or if has students count) */}
          {!isEnrolled && (
            <div className="mt-1">
              <span className="inline-flex items-center gap-1 bg-[#f3e8ff] dark:bg-[#3b0764]/40 text-[#7e22ce] dark:text-[#c084fc] border border-[#e9d5ff] dark:border-[#581c87]/50 px-2.5 py-0.5 rounded-full text-[10.5px] sm:text-[11px] font-bold leading-none">
                <Users className="w-3 h-3 stroke-[2.4]" />
                <span>{course.totalStudents} জন ভর্তি</span>
              </span>
            </div>
          )}

          {/* Meta Info Row: Classes, Sheets, Exams */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-[#4b5563] dark:text-slate-400 font-medium mt-1.5">
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>{course.totalClasses} ক্লাস</span>
            </span>

            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>{course.totalSheets || course.totalClasses} শিট</span>
            </span>

            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>{course.totalExams} পরীক্ষা</span>
            </span>
          </div>
        </div>

        {/* Bottom Action Row */}
        <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-slate-200/50 dark:border-slate-800/60">
          {isEnrolled ? (
            <>
              {/* Enrolled Status Pill */}
              <span className="bg-[#e6f7ef] dark:bg-[#064e3b]/30 text-[#059669] dark:text-[#34d399] border border-[#a7f3d0] dark:border-emerald-700/50 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 shadow-xs">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>ভর্তি সম্পন্ন</span>
              </span>

              {/* Enter Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className="bg-[#005a36] text-white px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1 shadow-sm hover:bg-[#004d2e] active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>প্রবেশ করুন</span>
              </button>
            </>
          ) : (
            <>
              {/* Price in Bengali */}
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-black text-[#111827] dark:text-slate-100">
                  ৳{toBn(course.price)}
                </span>
                {course.originalPrice > course.price && (
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 line-through">
                    ৳{toBn(course.originalPrice)}
                  </span>
                )}
              </div>

              {/* Details Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className="bg-[#0f172a] dark:bg-slate-800 text-white px-4 sm:px-5 py-1.5 rounded-full text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 transition-all shadow-sm cursor-pointer"
              >
                বিস্তারিত
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
