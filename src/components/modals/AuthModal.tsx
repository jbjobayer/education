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
  KeyRound,
  ArrowLeft,
  Send,
  HelpCircle,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot' | 'update-password';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess
}) => {
  const { 
    login, 
    register, 
    resetPasswordRequest, 
    updateUserPassword, 
    showToast 
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'update-password'>(initialMode);

  // Form states
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [institution, setInstitution] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Reset or initialize form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage('');
      setSuccessInfo(null);
      setPassword('');
      setConfirmPassword('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessInfo(null);

    // 1. FORGOT PASSWORD FLOW
    if (mode === 'forgot') {
      if (!identifier.trim()) {
        setErrorMessage('অনুগ্রহ করে আপনার নিবন্ধিত ইমেইল অথবা মোবাইল নম্বর প্রদান করুন।');
        return;
      }

      setIsLoading(true);
      try {
        const res = await resetPasswordRequest(identifier.trim());
        if (res.success) {
          setSuccessInfo(res.message);
          showToast(res.message, 'success');
          if (!res.isEmail) {
            // For phone/offline, directly advance to new password setup
            setTimeout(() => {
              setMode('update-password');
              setSuccessInfo(null);
            }, 1200);
          }
        } else {
          setErrorMessage(res.message);
        }
      } catch (err: any) {
        setErrorMessage(err?.message || 'পাসওয়ার্ড রিসেট লিংক পাঠানো সম্ভব হয়নি।');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // 2. UPDATE PASSWORD FLOW
    if (mode === 'update-password') {
      if (!password || password.length < 6) {
        setErrorMessage('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
        return;
      }
      if (confirmPassword && password !== confirmPassword) {
        setErrorMessage('উভয় পাসওয়ার্ড হুবহু একই হতে হবে।');
        return;
      }

      setIsLoading(true);
      try {
        const res = await updateUserPassword(password, identifier.trim());
        if (res.success) {
          showToast(res.message, 'success');
          setSuccessInfo(res.message);
          setTimeout(() => {
            setMode('login');
            setPassword('');
            setConfirmPassword('');
            setSuccessInfo(null);
          }, 1500);
        } else {
          setErrorMessage(res.message);
        }
      } catch (err: any) {
        setErrorMessage(err?.message || 'পাসওয়ার্ড আপডেট ব্যর্থ হয়েছে।');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // 3. LOGIN & REGISTER FLOWS
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

  const getHeaderTitle = () => {
    switch (mode) {
      case 'forgot':
        return 'পাসওয়ার্ড পুনরুদ্ধার';
      case 'update-password':
        return 'নতুন পাসওয়ার্ড নির্ধারণ';
      case 'register':
        return 'নতুন একাউন্ট খুলুন';
      case 'login':
      default:
        return 'একাউন্টে লগইন করুন';
    }
  };

  const getHeaderSubtitle = () => {
    switch (mode) {
      case 'forgot':
        return 'Supabase ভেরিফিকেশনের মাধ্যমে ইমেইলে রিসেট লিংক পাঠানো হবে';
      case 'update-password':
        return 'আপনার একাউন্টের জন্য নতুন একটি শক্তিশালী পাসওয়ার্ড দিন';
      case 'register':
        return 'এক ক্লিকে ওএমআর পরীক্ষা ও মেধা তালিকায় যুক্ত হোন';
      case 'login':
      default:
        return 'আপনার মোবাইল নম্বর বা ইমেইল দিয়ে প্রবেশ করুন';
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
          className="relative w-full max-w-md bg-[#e9edf5] dark:bg-[#0f172a] rounded-3xl border border-white/60 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden my-auto"
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
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/40 text-amber-300 flex items-center justify-center font-bold shrink-0">
                {mode === 'forgot' ? (
                  <KeyRound className="w-5 h-5" />
                ) : mode === 'update-password' ? (
                  <Lock className="w-5 h-5" />
                ) : mode === 'login' ? (
                  <LogIn className="w-5 h-5" />
                ) : (
                  <UserPlus className="w-5 h-5" />
                )}
              </div>
              <div className="min-w-0 pr-6">
                <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2 truncate">
                  <span>{getHeaderTitle()}</span>
                  <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black shrink-0">
                    তামরীন
                  </span>
                </h2>
                <p className="text-xs text-emerald-100/90 font-medium mt-0.5 line-clamp-1">
                  {getHeaderSubtitle()}
                </p>
              </div>
            </div>

            {/* Mode Switch Tabs (Only for login & register) */}
            {(mode === 'login' || mode === 'register') && (
              <div className="flex gap-2 mt-4 bg-black/20 p-1 rounded-2xl border border-white/10">
                <button
                  type="button"
                  id="auth-tab-login"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                    setSuccessInfo(null);
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
                    setSuccessInfo(null);
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
            )}

            {/* Back to login banner for forgot / update password modes */}
            {(mode === 'forgot' || mode === 'update-password') && (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                  setSuccessInfo(null);
                }}
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 font-bold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>লগইন স্ক্রিনে ফিরে যান</span>
              </button>
            )}
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

            {/* Success Notification */}
            {successInfo && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-start gap-2.5 font-medium leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-900 dark:text-emerald-100">সফলভাবে প্রেরিত!</p>
                  <p className="mt-0.5">{successInfo}</p>
                </div>
              </motion.div>
            )}

            {/* 1. Register: Full Name */}
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

            {/* 2. Identifier Input (Email or Phone) - for login, register, and forgot password */}
            {mode !== 'update-password' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                  {mode === 'forgot' ? 'নিবন্ধিত ইমেইল অথবা মোবাইল নম্বর' : 'ইমেইল অথবা মোবাইল নম্বর'} <span className="text-red-500">*</span>
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
                  {mode === 'forgot' 
                    ? 'ইমেইল দিলে সরাসরি Supabase পাসওয়ার্ড রিসেট লিঙ্ক যাবে'
                    : 'যেকোনো ১১ ডিজিটের মোবাইল নম্বর অথবা ইমেইল ব্যবহার করুন'}
                </p>
              </div>
            )}

            {/* 3. Register: Institution (Optional) */}
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

            {/* 4. Password (for login, register, and update-password) */}
            {mode !== 'forgot' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                    {mode === 'update-password' ? 'নতুন পাসওয়ার্ড' : 'পাসওয়ার্ড'} <span className="text-red-500">*</span>
                  </label>
                  {mode === 'login' ? (
                    <button
                      type="button"
                      id="auth-forgot-password-link"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMessage('');
                        setSuccessInfo(null);
                      }}
                      className="text-[11px] font-bold text-[#005a36] dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      পাসওয়ার্ড ভুলে গেছেন?
                    </button>
                  ) : (
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
                    placeholder={
                      mode === 'login' 
                        ? 'আপনার পাসওয়ার্ড লিখুন' 
                        : mode === 'update-password'
                          ? 'নতুন পাসওয়ার্ড লিখুন (৬+ অক্ষর)'
                          : 'গোপন পাসওয়ার্ড দিন (৬+ অক্ষর)'
                    }
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
            )}

            {/* 5. Confirm Password (Only for update-password mode) */}
            {mode === 'update-password' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                  নতুন পাসওয়ার্ড পুনরায় লিখুন <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="auth-confirm-password-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="হুবহু একই পাসওয়ার্ড লিখুন"
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm neu-inset rounded-2xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005a36] font-medium"
                    required
                  />
                </div>
              </div>
            )}

            {/* 6. Feature Perks Box (Only on login / register) */}
            {(mode === 'login' || mode === 'register') && (
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
            )}

            {/* Forgot Password Security Notice */}
            {mode === 'forgot' && (
              <div className="p-3 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-[11px] font-bold text-amber-800 dark:text-amber-300">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>পাসওয়ার্ড নিরাপত্তা ও ভেরিফিকেশন:</span>
                </div>
                <p className="text-[10.5px] text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                  Supabase ক্লাউড অথেনটিকেশনের মাধ্যমে আপনার ইমেইলে একটি ওয়ান-টাইম ভেরিফিকেশন লিংক পাঠানো হবে। সেই লিংকে ক্লিক করে পাসওয়ার্ড রিসেট করতে পারবেন।
                </p>
              </div>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              id="auth-submit-btn"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#004d2e] via-[#005a36] to-emerald-700 hover:from-[#004026] hover:to-emerald-800 text-amber-300 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
              ) : mode === 'forgot' ? (
                <>
                  <Send className="w-4 h-4" />
                  <span>ভেরিফিকেশন লিংক পাঠান</span>
                </>
              ) : mode === 'update-password' ? (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>পাসওয়ার্ড পরিবর্তন করুন</span>
                </>
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

            {/* Footer Navigation */}
            <div className="text-center pt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
              {mode === 'login' ? (
                <p>
                  একাউন্ট নেই?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setErrorMessage('');
                      setSuccessInfo(null);
                    }}
                    className="text-[#005a36] dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    নতুন একাউন্ট খুলুন
                  </button>
                </p>
              ) : mode === 'register' ? (
                <p>
                  ইতোমধ্যে একাউন্ট আছে?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage('');
                      setSuccessInfo(null);
                    }}
                    className="text-[#005a36] dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    লগইন করুন
                  </button>
                </p>
              ) : (
                <p>
                  মনে পড়েছে?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMessage('');
                      setSuccessInfo(null);
                    }}
                    className="text-[#005a36] dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    লগইনে ফিরে যান
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
