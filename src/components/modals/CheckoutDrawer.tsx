import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShieldCheck, CheckCircle, Smartphone, CreditCard, Sparkles } from 'lucide-react';

export const CheckoutDrawer: React.FC = () => {
  const { checkoutCourse, setCheckoutCourse, enrollInCourse, setSelectedCourseDetails } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'card'>('bkash');
  const [trxId, setTrxId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!checkoutCourse) return null;

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await enrollInCourse(
        checkoutCourse.id, 
        selectedMethod.toUpperCase(), 
        trxId || `TXN${Date.now().toString().slice(-6)}`,
        checkoutCourse.price
      );
    } finally {
      setIsProcessing(false);
      setCheckoutCourse(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#e9edf5] w-full max-w-md rounded-3xl neu-card overflow-hidden flex flex-col border border-white/80">
        {/* Header */}
        <div className="p-4 px-5 flex items-center justify-between border-b border-white/60">
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full shadow-xs">
              নিরাপদ পেমেন্ট গেটওয়ে
            </span>
            <h3 className="font-extrabold text-base text-slate-900 mt-1">কোর্স এনরোলমেন্ট ও ভর্তি</h3>
          </div>
          <button
            onClick={() => setCheckoutCourse(null)}
            className="p-2 rounded-xl neu-btn text-slate-600 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleEnroll} className="p-5 overflow-y-auto space-y-4">
          {/* Course Summary Card */}
          <div className="p-4 rounded-2xl neu-inset">
            <h4 className="font-bold text-sm text-slate-900 leading-snug">{checkoutCourse.title}</h4>
            <p className="text-xs text-emerald-800 font-bold mt-0.5">{checkoutCourse.subtitle}</p>
            
            <div className="mt-3 pt-2.5 border-t border-slate-300/60 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">মোট প্রদেয় ফি:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-slate-400 line-through">৳{checkoutCourse.originalPrice}</span>
                <span className="text-lg font-black text-emerald-900">৳{checkoutCourse.price}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              পেমেন্ট মাধ্যম বেছে নিন:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedMethod('bkash')}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all ${
                  selectedMethod === 'bkash'
                    ? 'neu-inset text-pink-700 font-black scale-102 ring-2 ring-pink-500/40'
                    : 'neu-btn text-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                  bK
                </div>
                <span className="text-xs">বিকাশ</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('nagad')}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all ${
                  selectedMethod === 'nagad'
                    ? 'neu-inset text-orange-700 font-black scale-102 ring-2 ring-orange-500/40'
                    : 'neu-btn text-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center text-xs font-black shadow-xs">
                  নগদ
                </div>
                <span className="text-xs">নগদ</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('rocket')}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all ${
                  selectedMethod === 'rocket'
                    ? 'neu-inset text-purple-700 font-black scale-102 ring-2 ring-purple-500/40'
                    : 'neu-btn text-slate-700'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center text-xs font-black shadow-xs">
                  রকেট
                </div>
                <span className="text-xs">রকেট</span>
              </button>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="p-3.5 neu-card-sm rounded-2xl text-xs text-slate-600 space-y-1.5 font-normal">
            <p className="font-bold text-slate-900 flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
              {selectedMethod === 'bkash' && 'বিকাশ মার্চেন্ট একাউন্ট: ০১৭১১-০০২২৩৩'}
              {selectedMethod === 'nagad' && 'নগদ মার্চেন্ট একাউন্ট: ০১৮১১-৩৩৪৪৫৫'}
              {selectedMethod === 'rocket' && 'রকেট মার্চেন্ট একাউন্ট: ০১৯১১-৫৫৬৬৭৭'}
            </p>
            <p className="text-[11px] text-slate-500">
              * আপনার অ্যাপ থেকে পেমেন্ট অপশন ব্যবহার করে কোর্স ফি পাঠান অথবা নিচে ট্রানজেকশন নিশ্চিত করুন।
            </p>
          </div>

          {/* Trx ID input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ট্রানজেকশন আইডি (TrxID / মোবাইল নম্বর):
            </label>
            <input
              type="text"
              required
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="যেমন: 9J3K82LA অথবা আপনার নম্বর"
              className="w-full px-4 py-2.5 text-xs sm:text-sm neu-inset rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium"
            />
          </div>

          {/* Benefits badge */}
          <div className="flex items-center gap-2 text-xs text-emerald-900 neu-inset p-2.5 rounded-xl font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>ভর্তির সাথে সাথে সকল লেকচার ও তামরীন এআই সক্রিয় হবে।</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 neu-btn-primary font-black rounded-2xl flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isProcessing ? (
              <span>পেমেন্ট ভেরিফাই হচ্ছে...</span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-amber-300" />
                <span>৳{checkoutCourse.price} টাকা পরিশোধ করে ভর্তি নিশ্চিত করুন</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
