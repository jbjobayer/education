import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Sparkles, 
  Check, 
  Lock, 
  ShieldCheck, 
  Zap, 
  Smartphone, 
  CheckCircle2,
  Gift
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SUBSCRIPTION_PLANS } from '../../data/subscriptionPlans';
import { SubscriptionPlanId } from '../../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, subscribeToPackage, isPremiumMember, showToast } = useApp();
  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlanId>('quarterly');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket'>('bkash');
  const [trxId, setTrxId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const selectedPlan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[1];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      subscribeToPackage(selectedPlan.id, selectedPlan.name, selectedPlan.durationMonths);
      setIsProcessing(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-lg bg-[#e9edf5] dark:bg-[#101927] rounded-3xl neu-card border-2 border-emerald-600/30 dark:border-emerald-500/40 shadow-2xl flex flex-col overflow-hidden z-10 my-4 max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#005a36] via-[#00472a] to-[#005a36] text-white flex items-center justify-between border-b border-amber-400/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shadow-xs">
              <Crown className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full shadow-2xs">
                  প্রিমিয়াম মেম্বারশিপ
                </span>
                <span className="text-[10px] font-bold text-emerald-200">
                  ১৫টি বিষয় আনলক
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white mt-0.5">
                বিষয়ভিত্তিক অনুশীলন প্যাকেজ
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Highlight Notice */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-600/30 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-200 text-xs leading-relaxed font-medium">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="font-black text-[#005a36] dark:text-emerald-300 block mb-0.5">
                  কেন প্রিমিয়াম মেম্বারশিপ নিবেন?
                </strong>
                <p className="text-slate-700 dark:text-slate-300 text-[11px] sm:text-xs">
                  মাসিক, ত্রৈমাসিক, ষান্মাসিক বা বাৎসরিক মেম্বারশিপে আপনি পাবেন ১৫টি বিষয়ের সম্পূর্ণ প্রশ্নব্যাংক, কাস্টম টেস্ট ও বিশদ ব্যাখ্যা।
                </p>
              </div>
            </div>
          </div>

          {/* 4 Packages Grid */}
          <div>
            <label className="text-xs font-black text-[#005a36] dark:text-emerald-400 flex items-center gap-1.5 mb-2">
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              আপনার পছন্দের প্যাকেজ নির্বাচন করুন:
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all relative flex flex-col justify-between border-2 ${
                      isSelected
                        ? 'bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/60 dark:to-[#0f172a] border-emerald-600 dark:border-emerald-400 shadow-md ring-2 ring-emerald-500/30 scale-[1.02]'
                        : 'neu-btn border-emerald-600/20 dark:border-emerald-500/25 hover:border-amber-400/80 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {/* Badge */}
                    {plan.badge && (
                      <span className={`absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[9px] font-black shadow-xs ${
                        isSelected 
                          ? 'bg-amber-400 text-slate-950 border border-amber-300' 
                          : 'bg-emerald-700 text-white dark:bg-emerald-800'
                      }`}>
                        {plan.badge}
                      </span>
                    )}

                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-[#005a36] dark:text-emerald-300">
                        {plan.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-0.5">
                        {plan.durationLabel}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 line-through mr-1">
                          ৳{plan.originalPrice}
                        </span>
                        <span className="text-base sm:text-lg font-black text-[#005a36] dark:text-emerald-400">
                          ৳{plan.price}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#005a36] dark:bg-emerald-500 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Features Included List */}
          <div className="p-3 rounded-2xl neu-inset border border-emerald-600/15 dark:border-emerald-500/15 space-y-1.5 text-xs">
            <span className="text-[11px] font-black text-[#005a36] dark:text-emerald-400 block mb-1">
              প্যাকেজের অন্তর্ভুক্ত সকল সুবিধা:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>১৫টি বিষয়ের ৪০০০+ প্রশ্ন ব্যাংক</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>আনলিমিটেড বিষয়ভিত্তিক টেস্ট</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>বিশদ বাংলা ও আরবি ব্যাখ্যা</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>লিডারবোর্ড ও প্রগ্রেস ট্র্যাকিং</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <form onSubmit={handleSubscribe} className="space-y-3.5">
            <div>
              <label className="block text-xs font-black text-[#005a36] dark:text-emerald-400 mb-1.5">
                পেমেন্ট মাধ্যম বেছে নিন:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                    paymentMethod === 'bkash'
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 font-bold shadow-xs'
                      : 'neu-btn text-slate-700 dark:text-slate-300 border-slate-300/40 dark:border-slate-700/40'
                  }`}
                >
                  <div className="w-6 h-6 rounded-lg bg-pink-600 text-white flex items-center justify-center text-[10px] font-black">
                    bK
                  </div>
                  <span className="text-[11px]">বিকাশ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                    paymentMethod === 'nagad'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 font-bold shadow-xs'
                      : 'neu-btn text-slate-700 dark:text-slate-300 border-slate-300/40 dark:border-slate-700/40'
                  }`}
                >
                  <div className="w-6 h-6 rounded-lg bg-orange-600 text-white flex items-center justify-center text-[10px] font-black">
                    নগদ
                  </div>
                  <span className="text-[11px]">নগদ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('rocket')}
                  className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                    paymentMethod === 'rocket'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold shadow-xs'
                      : 'neu-btn text-slate-700 dark:text-slate-300 border-slate-300/40 dark:border-slate-700/40'
                  }`}
                >
                  <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">
                    রকেট
                  </div>
                  <span className="text-[11px]">রকেট</span>
                </button>
              </div>
            </div>

            {/* Merchant Number & Info */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-medium">মার্চেন্ট নম্বর (Send Money):</span>
                <strong className="text-slate-900 dark:text-slate-100 font-bold font-mono">০১৭৭২-৮৯৫৪০১</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-medium">নির্বাচিত প্যাকেজ:</span>
                <strong className="text-[#005a36] dark:text-emerald-400 font-bold">{selectedPlan.name} (৳{selectedPlan.price})</strong>
              </div>
            </div>

            {/* TrxID input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Transaction ID (TrxID) দিন (ঐচ্ছিক / সরাসরি অ্যাক্টিভ করুন):
              </label>
              <input
                type="text"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                placeholder="যেমন: TRXM98765432"
                className="w-full px-3.5 py-2.5 text-xs neu-inset rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005a36]"
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 rounded-2xl neu-btn-primary text-xs sm:text-sm font-black text-white flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer border border-amber-400/50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>প্যাকেজ অ্যাক্টিভেশন সম্পন্ন হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>{selectedPlan.name} নিশ্চিত করুন (৳{selectedPlan.price})</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
