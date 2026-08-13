import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  BookOpen, 
  Award, 
  FileCheck2, 
  Bookmark, 
  Phone, 
  Mail, 
  Edit3, 
  CheckCircle2, 
  Headphones, 
  Share2, 
  Calendar,
  ExternalLink,
  ShieldCheck,
  Video
} from 'lucide-react';
import { mockQuestions } from '../../data/mockData';

export const ProfileView: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    enrolledCourseIds, 
    courses, 
    examResults, 
    bookmarks, 
    toggleBookmark,
    setSelectedCourseDetails,
    setIsRoutineOpen,
    showToast 
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [institution, setInstitution] = useState(userProfile.institution);
  const [targetExam, setTargetExam] = useState(userProfile.targetExam);

  const enrolledCourses = courses.filter((c) => enrolledCourseIds.includes(c.id));
  const bookmarkedQuestions = (mockQuestions.exam1 || []).filter((q) => bookmarks.includes(q.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, institution, targetExam });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 pb-24 animate-fadeIn">
      {/* Student Profile Neumorphic Card */}
      <div className="p-5 sm:p-6 rounded-3xl neu-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-1 rounded-2xl neu-btn">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-[10px] text-white font-black">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">{userProfile.name}</h2>
                <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black shadow-xs">
                  ভেরিফাইড স্টুডেন্ট
                </span>
              </div>
              <p className="text-xs text-emerald-800 font-bold mt-0.5">{userProfile.institution}</p>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                <span>রোল: <strong className="text-slate-800">{userProfile.rollNo}</strong></span> • 
                <span>লক্ষ্য: <strong className="text-slate-800">{userProfile.targetExam}</strong></span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl neu-btn text-xs font-bold text-slate-700 hover:text-emerald-800 flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'বাতিল' : 'প্রোফাইল এডিট'}</span>
          </button>
        </div>

        {/* Edit Form Drawer */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-4 pt-4 border-t border-white/60 space-y-3 neu-inset p-4 rounded-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-600 block mb-1 font-bold">পূর্ণ নাম:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 block mb-1 font-bold">মাদ্রাসা / প্রতিষ্ঠান:</label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-600 block mb-1 font-bold">টার্গেট পদবী / পরীক্ষা:</label>
                <input
                  type="text"
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-5 py-2 neu-btn-amber font-bold text-xs rounded-xl"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </form>
        )}

        {/* Quick Performance Metrics Inset Tray */}
        <div className="mt-5 grid grid-cols-4 gap-2 pt-4 border-t border-white/60 text-center">
          <div className="p-3 rounded-2xl neu-inset">
            <span className="text-[10px] text-slate-500 block font-semibold">ভর্তি কোর্স</span>
            <strong className="text-base sm:text-lg font-black text-emerald-800">{enrolledCourses.length}টি</strong>
          </div>
          <div className="p-3 rounded-2xl neu-inset">
            <span className="text-[10px] text-slate-500 block font-semibold">পরীক্ষা দিয়েছেন</span>
            <strong className="text-base sm:text-lg font-black text-slate-800">{examResults.length}টি</strong>
          </div>
          <div className="p-3 rounded-2xl neu-inset">
            <span className="text-[10px] text-slate-500 block font-semibold">সংরক্ষিত প্রশ্ন</span>
            <strong className="text-base sm:text-lg font-black text-slate-800">{bookmarks.length}টি</strong>
          </div>
          <div className="p-3 rounded-2xl neu-inset">
            <span className="text-[10px] text-slate-500 block font-semibold">মেধা র‍্যাংক</span>
            <strong className="text-base sm:text-lg font-black text-amber-700">টপ ৫%</strong>
          </div>
        </div>
      </div>

      {/* Enrolled Courses & Classrooms */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            আমার ভর্তিকৃত কোর্সসমূহ ({enrolledCourses.length})
          </h3>
          <button
            onClick={() => setIsRoutineOpen(true)}
            className="px-3 py-1.5 rounded-xl neu-btn text-xs font-bold text-emerald-800 flex items-center gap-1"
          >
            <Calendar className="w-3.5 h-3.5" /> ক্লাস রুটিন দেখুন
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrolledCourses.map((course) => (
            <div
              key={course.id}
              className="p-4 rounded-3xl neu-card flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={course.coverImage}
                  alt={course.title}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-xs"
                />
                <div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    চলমান ব্যাচ
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-1 leading-snug">
                    {course.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    {course.totalClasses}টি ক্লাস • {course.totalExams}টি এক্সাম
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => setIsRoutineOpen(true)}
                  className="flex-1 py-2 neu-btn-primary text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5 text-amber-300" />
                  <span>লাইভ ক্লাসে যোগ দিন</span>
                </button>
                <button
                  onClick={() => setSelectedCourseDetails(course)}
                  className="px-3.5 py-2 neu-btn text-slate-700 text-xs font-bold rounded-xl"
                >
                  সিলেবাস
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bookmarked Questions / Saved Review */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-600" />
            রিভিউ ও বুকমার্ক করা প্রশ্নসমূহ ({bookmarkedQuestions.length})
          </h3>
        </div>

        {bookmarkedQuestions.length === 0 ? (
          <div className="p-6 rounded-3xl neu-card text-center text-xs text-slate-500 font-medium">
            কোনো সংরক্ষিত প্রশ্ন নেই। পরীক্ষার সময় বা রিভিউতে বুকমার্ক আইকনে ক্লিক করে প্রশ্ন সেভ করুন।
          </div>
        ) : (
          <div className="space-y-3.5">
            {bookmarkedQuestions.map((q) => (
              <div key={q.id} className="p-5 rounded-3xl neu-card space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                    {q.subject}
                  </span>
                  <button
                    onClick={() => toggleBookmark(q.id)}
                    className="text-xs text-red-600 hover:underline font-bold"
                  >
                    সরান
                  </button>
                </div>
                {q.arabicQuestion && (
                  <p className="font-arabic text-lg text-emerald-950 font-bold text-right leading-relaxed dir-rtl">
                    {q.arabicQuestion}
                  </p>
                )}
                <h4 className="font-bold text-sm text-slate-900">{q.question}</h4>
                <div className="p-3 neu-inset rounded-2xl text-xs text-slate-800">
                  <strong className="text-emerald-800">সঠিক উত্তর:</strong> {q.options[q.correctIndex]} — <span className="text-slate-600">{q.explanation}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Helpline & Support Neumorphic Card */}
      <div className="p-5 sm:p-6 rounded-3xl neu-card space-y-3">
        <h4 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
          <Headphones className="w-4 h-4 text-emerald-700" />
          আত-তামরীন একাডেমি স্টুডেন্ট সাপোর্ট
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed font-normal">
          ভর্তি সংক্রান্ত তথ্য, লাইভ ক্লাসের লিংক অথবা টেকনিক্যাল সমস্যার জন্য আমাদের অফিসিয়াল সাপোর্ট টিমের সাথে সরাসরি যোগাযোগ করুন।
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <a
            href="tel:+8801772895401"
            onClick={(e) => {
              e.preventDefault();
              showToast('কল সাপোর্ট: ০১৭৭২-৮৯৫৪০১ (সকাল ১০টা - রাত ১০টা)', 'info');
            }}
            className="p-3.5 rounded-2xl neu-btn flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl neu-icon flex items-center justify-center text-emerald-700">
              <Phone className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-slate-900 block">কল করুন সরাসরি</span>
              <span className="text-[11px] text-emerald-800 font-bold">০১৭৭২-৮৯৫৪০১</span>
            </div>
          </a>

          <a
            href="#whatsapp"
            onClick={(e) => {
              e.preventDefault();
              showToast('হোয়াটসঅ্যাপ সাপোর্ট গ্রুপে যুক্ত হচ্ছেন...', 'success');
            }}
            className="p-3.5 rounded-2xl neu-btn flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl neu-icon flex items-center justify-center text-emerald-700">
              <Share2 className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-slate-900 block">WhatsApp স্টুডেন্ট গ্রুপ</span>
              <span className="text-[11px] text-emerald-800 font-bold">২৪/৭ আলোচনার ফোরাম</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
