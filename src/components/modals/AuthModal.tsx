import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  School, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess
}) => {
  const { login, register, showToast, isSupabaseConnected } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form states
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [institution, setInstitution] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage('');
      setPassword('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার ইমেইল অথবা মোবাইল নম্বর প্রদান করুন।');
      return;
    }

    if (!password) {
      setErrorMessage('অনুগ্রহ করে পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMessage('অনুগ্রহ করে আপনার পূর্ণ নাম প্রদান করুন।');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        const result = await login(identifier.trim(), password);
        if (result.success) {
          showToast(result.message, 'success');
          onSuccess?.();
          onClose();
        } else {
          setErrorMessage(result.message);
        }
      } else {
        const result = await register(name.trim(), identifier.trim(), password, institution.trim());
        if (result.success) {
          showToast(result.message, 'success');
          onSuccess?.();
          onClose();
        } else {
          setErrorMessage(result.message);
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="auth-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-[#e9edf5] dark:bg-[#0f172a] rounded-3xl border border-white/60 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Banner Header */}
          <div className="bg-gradient-to-r from-[#004d2e] via-[#005a36] to-emerald-800 px-6 py-5 text-white relative">
            <button
              id="auth-modal-close-btn"
              onClick={onClose}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white/90 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center font-bold">
                {mode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <span>{mode === 'login' ? 'একাউন্টে লগইন করুন' : 'নতুন একাউন্ট খুলুন'}</span>
                  <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black">
                    তামরীন
                  </span>
                </h2>
                <p className="text-xs text-emerald-100/90 font-medium mt-0.5">
                  {mode === 'login' 
                    ? 'আপনার মোবাইল নম্বর বা ইমেইল দিয়ে প্রবেশ করুন' 
                    : 'এক ক্লিকে ওএমআর পরীক্ষা ও মেধা তালিকায় যুক্ত হোন'}
                </p>
              </div>
            </div>

            {/* Mode Switch Tabs */}
            <div className="flex gap-2 mt-4 bg-black/20 p-1 rounded-2xl border border-white/10">
              <button
                type="button"
                id="auth-tab-login"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>লগইন</span>
              </button>
              <button
                type="button"
                id="auth-tab-register"
                onClick={() => {
                  setMode('register');
                  setErrorMessage('');
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'register'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>নতুন একাউন্ট</span>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            {/* Error Notification */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5 font-medium leading-relaxed"
              >
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {/* Register: Full Name */}
            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5"
              >
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                  আপনার পূর্ণ নাম <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    id="auth-name-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন: মুহাম্মদ জোবায়ের হোসাইন"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm neu-inset rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005a36] font-medium"
                    required={mode === 'register'}
                  />
                </div>
              </motion.div>
            )}

            {/* Email or Phone Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                ইমেইল অথবা মোবাইল নম্বর <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
                  <Phone className="w-3.5 h-3.5" />
                  <span className="text-slate-300 dark:text-slate-600">/</span>
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  id="auth-identifier-input"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="যেমন: 01712345678 অথবা name@gmail.com"
                  className="w-full pl-16 pr-4 py-2.5 text-xs sm:text-sm neu-inset rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005a36] font-medium"
                  required
                />
              </div>
              <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                যেকোনো ১১ ডিজিটের মোবাইল নম্বর অথবা ইমেইল ব্যবহার করুন
              </p>
            </div>

            {/* Register: Institution (Optional) */}
            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5"
              >
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                  মাদ্রাসা / প্রতিষ্ঠানের নাম <span className="text-slate-400 font-normal">(ঐচ্ছিক)</span>
                </label>
                <div className="relative">
                  <School className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    id="auth-institution-input"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="যেমন: সরকারি মাদ্রাসা-ই-আলিয়া, ঢাকা"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm neu-inset rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005a36] font-medium"
                  />
                </div>
              </motion.div>
            )}

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                  পাসওয়ার্ড <span className="text-red-500">*</span>
                </label>
                {mode === 'register' && (
                  <span className="text-[10.5px] text-slate-500 dark:text-slate-400">
                    কমপক্ষে ৬ অক্ষর
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="auth-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'login' ? 'আপনার পাসওয়ার্ড লিখুন' : 'গোপন পাসওয়ার্ড দিন (৬+ অক্ষর)'}
                  className="w-full pl-10 pr-11 py-2.5 text-xs sm:text-sm neu-inset rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005a36] font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Feature Perks Box */}
            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>একাউন্ট থাকার সুবিধাসমূহ:</span>
              </div>
              <ul className="text-[10.5px] text-slate-600 dark:text-slate-400 space-y-1 pl-4 list-disc">
                <li>পরীক্ষা দেওয়ার সময় বারবার নাম লিখতে হবে না, স্বয়ংক্রিয়ভাবে ওএমআর শুরু হবে।</li>
                <li>দেশব্যাপী মেধা তালিকায় আপনার স্কোর ও র‍্যাংকিং স্থায়ীভাবে সংরক্ষিত থাকবে।</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="auth-submit-btn"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#004d2e] via-[#005a36] to-emerald-700 hover:from-[#004026] hover:to-emerald-800 text-amber-300 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>লগইন করুন</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>একাউন্ট তৈরি সম্পন্ন করুন</span>
                </>
              )}
            </button>

            {/* Toggle Footer */}
            <div className="text-center pt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
              {mode === 'login' ? (
                <p>
                  একাউন্ট নেই?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMessage('');
                    }}
                    className="text-[#005a36] dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    নতুন একাউন্ট খুলুন
                  </button>
                </p>
              ) : (
                <p>
                  ইতোমধ্যে একাউন্ট আছে?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage('');
                    }}
                    className="text-[#005a36] dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    লগইন করুন
                  </button>
                </p>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
