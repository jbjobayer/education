import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Star, 
  Users, 
  Video, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  PlayCircle,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const CourseDetailsModal: React.FC = () => {
  const { 
    selectedCourseDetails, 
    setSelectedCourseDetails, 
    enrolledCourseIds, 
    setCheckoutCourse,
    setActiveTab,
    showToast 
  } = useApp();

  const [expandedModule, setExpandedModule] = useState<number>(0);

  if (!selectedCourseDetails) return null;

  const isEnrolled = enrolledCourseIds.includes(selectedCourseDetails.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-[#e9edf5] w-full max-w-2xl rounded-3xl neu-card overflow-hidden my-auto flex flex-col max-h-[92vh] border border-white/80">
        {/* Modal Top Header with image */}
        <div className="relative h-44 sm:h-52 bg-slate-900 overflow-hidden shrink-0">
          <img
            src={selectedCourseDetails.coverImage}
            alt={selectedCourseDetails.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          
          <button
            onClick={() => setSelectedCourseDetails(null)}
            className="absolute top-3.5 right-3.5 p-2 rounded-2xl bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-colors z-10 neu-btn border border-white/30"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
            {selectedCourseDetails.badge && (
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-950 text-xs font-black shadow-md">
                {selectedCourseDetails.badge}
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-800/90 text-emerald-100 text-xs font-bold backdrop-blur-xs">
              {selectedCourseDetails.duration}
            </span>
          </div>

          <div className="absolute bottom-3.5 left-4 right-4 text-white">
            <h2 className="text-lg sm:text-xl font-extrabold leading-snug drop-shadow-md">
              {selectedCourseDetails.title}
            </h2>
            <p className="text-xs text-emerald-200 mt-1 line-clamp-1 font-medium">
              {selectedCourseDetails.subtitle}
            </p>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1 bg-[#e9edf5]">
          {/* Quick Metrics Bar Inset Tray */}
          <div className="grid grid-cols-4 gap-2 neu-inset p-3 rounded-2xl text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-xs font-black text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{selectedCourseDetails.rating}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">রেটিং</span>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-xs font-black text-emerald-800">
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                <span>{selectedCourseDetails.totalStudents}+</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">শিক্ষার্থী</span>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-xs font-black text-emerald-800">
                <Video className="w-3.5 h-3.5 text-emerald-700" />
                <span>{selectedCourseDetails.totalClasses}টি</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">লাইভ ক্লাস</span>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-xs font-black text-emerald-800">
                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                <span>{selectedCourseDetails.totalExams}টি</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">মডেল টেস্ট</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-1">কোর্স সম্পর্কে</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {selectedCourseDetails.description}
            </p>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-2.5">এই কোর্সে যা যা থাকছে</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {selectedCourseDetails.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 neu-card-sm p-3 rounded-2xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mentors */}
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 mb-2.5">অভিজ্ঞ মেন্টর প্যানেল</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedCourseDetails.instructors.map((inst) => (
                <div key={inst.id} className="flex items-center gap-3 p-3 rounded-2xl neu-card-sm">
                  <img
                    src={inst.image}
                    alt={inst.name}
                    className="w-12 h-12 rounded-2xl object-cover shadow-xs"
                  />
                  <div className="min-w-0">
                    <h5 className="font-black text-xs text-slate-900 truncate">{inst.name}</h5>
                    <p className="text-[11px] text-emerald-800 font-bold truncate">{inst.designation}</p>
                    <p className="text-[10px] text-slate-400">{inst.experience}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Syllabus Modules */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="font-extrabold text-sm text-slate-900">পূর্ণাঙ্গ পাঠ্যক্রম ও সিলেবাস</h4>
              <span className="text-xs text-emerald-800 font-bold">
                {selectedCourseDetails.syllabus.length} টি মডিউল
              </span>
            </div>

            <div className="space-y-2.5">
              {selectedCourseDetails.syllabus.map((mod, idx) => {
                const isOpen = expandedModule === idx;
                return (
                  <div key={idx} className="neu-card-sm rounded-2xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setExpandedModule(isOpen ? -1 : idx)}
                      className="w-full p-3.5 flex items-center justify-between bg-transparent transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-xl bg-emerald-800 text-white text-xs font-black flex items-center justify-center shadow-xs">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          {mod.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">
                          {mod.classesCount} ক্লাস
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="p-3.5 pt-0 neu-inset rounded-xl m-2 space-y-2">
                        {mod.items.map((item, subIdx) => (
                          <div key={subIdx} className="flex items-center gap-2 text-xs text-slate-600 pl-2 pt-1">
                            <PlayCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span className="font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Bottom CTA */}
        <div className="p-4 bg-[#e9edf5] border-t border-white/60 flex items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">কোর্স ফি</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-emerald-950">৳{selectedCourseDetails.price}</span>
              <span className="text-xs text-slate-400 line-through">৳{selectedCourseDetails.originalPrice}</span>
            </div>
          </div>

          {isEnrolled ? (
            <button
              onClick={() => {
                showToast('আপনার কোর্সের ক্লাসরুমে প্রবেশ করছেন...', 'success');
                setSelectedCourseDetails(null);
                setActiveTab('profile');
              }}
              className="px-6 py-2.5 neu-btn-primary font-black text-xs sm:text-sm rounded-2xl flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>ক্লাসরুমে যান</span>
            </button>
          ) : (
            <button
              onClick={() => setCheckoutCourse(selectedCourseDetails)}
              className="px-6 py-2.5 neu-btn-amber font-black text-xs sm:text-sm rounded-2xl flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>এখনই ভর্তি হন</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
