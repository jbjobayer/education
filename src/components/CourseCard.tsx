import React from 'react';
import { Course } from '../types';
import { 
  Clock, 
  FileText, 
  CheckCircle2, 
  Users, 
  Landmark, 
  Play, 
  Check
} from 'lucide-react';

interface CourseCardProps {
  course: Course;
  isEnrolled: boolean;
  onSelect: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isEnrolled,
  onSelect,
}) => {
  // Determine styling based on enrolled or batch type
  const isEnrolledStyle = isEnrolled;
  const isGreenTheme = isEnrolledStyle;

  return (
    <div
      onClick={() => onSelect(course)}
      className="bg-white rounded-3xl p-3.5 sm:p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-slate-100/90 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] transition-all cursor-pointer group"
    >
      {/* Left Icon Aspect Container (Exact match to screenshot) */}
      <div
        className={`rounded-2xl w-full sm:w-28 p-2.5 sm:p-3 flex flex-row sm:flex-col items-center justify-between sm:justify-center shrink-0 text-center gap-2 transition-transform group-hover:scale-[1.02] ${
          isGreenTheme
            ? 'bg-[#e8f6f0] border border-[#c4ebdc]'
            : 'bg-[#fffbf0] border border-[#fde8bb]'
        }`}
      >
        <div className="flex items-center sm:flex-col gap-2 sm:gap-2">
          {/* Circular Badge Icon */}
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center shadow-xs shrink-0 ${
              isGreenTheme
                ? 'bg-[#084b2c] text-amber-300'
                : 'bg-[#0b1c3d] text-amber-300'
            }`}
          >
            <Landmark className="w-5 h-5" />
          </div>

          {/* Pill Badge */}
          <span
            className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-xs ${
              isGreenTheme
                ? 'bg-[#084b2c] text-white'
                : 'bg-[#0b1c3d] text-white'
            }`}
          >
            {course.batchType || course.badge || 'রেকর্ড ব্যাচ'}
          </span>
        </div>

        {/* Short category tag underneath */}
        <span
          className={`text-[10.5px] font-bold truncate max-w-[120px] sm:max-w-full ${
            isGreenTheme ? 'text-[#087f47]' : 'text-slate-600'
          }`}
        >
          {course.shortTag || course.subtitle.split(' ')[0] + '...'}
        </span>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Title */}
          <h3 className="font-black text-sm sm:text-base text-slate-900 group-hover:text-emerald-900 transition-colors leading-snug">
            {course.title}
          </h3>

          {/* Enrolled Students Tag (shown on non-enrolled cards like in screenshot) */}
          {!isEnrolled && (
            <div className="mt-1.5 mb-1">
              <span className="bg-[#f0ebfa] text-[#6b3fc5] text-[11px] font-black px-2.5 py-0.5 rounded-md inline-flex items-center gap-1 border border-[#e2d5f8]">
                <Users className="w-3.5 h-3.5" />
                <span>{course.totalStudents} জন ভর্তি</span>
              </span>
            </div>
          )}

          {/* Stats / Specs row: Clock / Sheet / Exam icons */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-bold my-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{course.totalClasses} ক্লাস</span>
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>{course.totalSheets || course.totalClasses} শিট</span>
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
              <span>{course.totalExams} পরীক্ষা</span>
            </span>
          </div>
        </div>

        {/* Bottom Action Row (Exact match to screenshot) */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100/80 mt-1">
          {isEnrolled ? (
            <>
              {/* Enrolled Badge Button */}
              <div className="bg-[#e6f8ef] text-[#087f47] border border-[#a2e5c2] px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 shadow-xs">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>ভর্তি সম্পন্ন</span>
              </div>

              {/* Enter Course Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(course);
                }}
                className="bg-[#075e38] hover:bg-[#064e2e] text-white px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>প্রবেশ করুন</span>
              </button>
            </>
          ) : (
            <>
              {/* Price */}
              <div className="flex items-baseline gap-1">
                <span className="font-extrabold text-sm sm:text-base text-slate-900">
                  ৳{course.price}
                </span>
                {course.originalPrice > course.price && (
                  <span className="text-[11px] text-slate-400 line-through">
                    ৳{course.originalPrice}
                  </span>
                )}
              </div>

              {/* Details Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(course);
                }}
                className="bg-[#0b1b38] hover:bg-slate-900 text-white px-5 py-1.5 rounded-xl text-xs font-black transition-all shadow-sm active:scale-95"
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
