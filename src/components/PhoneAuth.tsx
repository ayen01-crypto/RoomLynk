import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Phone, Lock, User as UserIcon, CheckCircle2, MessageSquare, GraduationCap, Home, ChevronDown, Mail } from 'lucide-react';
import { UserRole, User } from '../types';

interface PhoneAuthProps {
  role: UserRole;
  onBack: () => void;
  onSuccess: (user: User) => void;
}

export default function PhoneAuth({ role: initialRole, onBack, onSuccess }: PhoneAuthProps) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [smsToast, setSmsToast] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Keep role state synchronized with props if they change
  useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

  // Countdown timer for OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleSendOtp = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    // Role-specific email restriction
    if (role === 'student') {
      if (!email.trim().toLowerCase().endsWith('@kab.ac.ug')) {
        setError('Kabale University students can only register using their official email ending with @kab.ac.ug');
        return;
      }
    }

    if (!phoneNumber || phoneNumber.length < 9) {
      setError('Please enter a valid phone number');
      return;
    }

    // Generate random 6-digit code
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomCode);

    // Transition to OTP screen
    setStep('otp');
    setCountdown(60);

    // Simulate sending SMS via standard modern system notifications
    setTimeout(() => {
      setSmsToast(`[SMS Gateway] Your 6-digit RoomLynk OTP code is ${randomCode}`);
    }, 1500);
  };

  const handleVerifyOtp = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (otpCode !== generatedOtp && otpCode !== '123456') { // Allow 123456 override for convenience
      setError('Invalid verification code. Please check and try again.');
      return;
    }

    // Successfully verified! Create the user profile
    const newUser: User = {
      id: role === 'student' ? 'student_aryatuha' : 'landlord_john',
      phone: `+256 ${phoneNumber}`,
      role: role,
      name: fullName,
      email: email.trim(),
      avatarUrl: role === 'student' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      verified: true,
      trustedContact: role === 'student' ? '+256 701 123 456' : undefined
    };

    onSuccess(newUser);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 p-6 relative overflow-hidden">
      {/* Mock SMS Gate Toast Notification */}
      <AnimatePresence>
        {smsToast && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-4 left-4 right-4 z-50 bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700/50 flex items-start space-x-3"
          >
            <div className="p-2 bg-blue-500 rounded-lg shrink-0">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-blue-400 tracking-wider uppercase">Africa's Talking Gate</span>
                <button 
                  onClick={() => setSmsToast(null)} 
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Dismiss
                </button>
              </div>
              <p className="text-xs text-slate-200 mt-1 font-medium">{smsToast}</p>
              <button 
                onClick={() => {
                  setOtpCode(generatedOtp);
                  setSmsToast(null);
                }}
                className="text-[11px] text-blue-300 font-bold underline mt-2 hover:text-blue-100"
              >
                Auto-fill Code
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center mt-2 mb-8">
        <button
          onClick={onBack}
          className="p-2 -ml-2 bg-white rounded-full border border-slate-100 shadow-sm text-slate-600 hover:text-slate-900 hover:shadow"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="ml-3 text-sm font-bold text-slate-600">Go Back</span>
      </div>

      {step === 'input' ? (
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Sign In / Register</h2>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                Provide your details to register or sign in. Accounts are verified immediately via secure SMS OTP.
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-600">
                  {error}
                </div>
              )}

              {/* Account Type Custom Dropdown Selector */}
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Account Type
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-white text-slate-800 text-sm px-4 py-3.5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-500 focus:outline-none transition-all font-bold"
                  >
                    <div className="flex items-center space-x-2.5">
                      {role === 'student' ? (
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Home className="w-5 h-5 text-amber-500" />
                      )}
                      <span>{role === 'student' ? 'Student' : 'Landlord'}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-200/50 rounded-xl shadow-lg overflow-hidden py-1"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setRole('student');
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm font-bold flex items-center space-x-2.5 hover:bg-slate-50 transition-colors ${
                            role === 'student' ? 'text-blue-600 bg-blue-50/40' : 'text-slate-700'
                          }`}
                        >
                          <GraduationCap className="w-5 h-5 text-blue-600" />
                          <span>Student</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRole('landlord');
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm font-bold flex items-center space-x-2.5 hover:bg-slate-50 transition-colors ${
                            role === 'landlord' ? 'text-amber-500 bg-amber-50/40' : 'text-slate-700'
                          }`}
                        >
                          <Home className="w-5 h-5 text-amber-500" />
                          <span>Landlord</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Full Name field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aryatuha Kenneth"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white text-slate-800 placeholder-slate-400 text-sm pl-11 pr-4 py-3.5 rounded-xl border border-slate-100 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              {/* Email Address field with Kabale verification notice */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    required
                    placeholder={role === 'student' ? 'e.g. k.aryatuha@kab.ac.ug' : 'e.g. landlord@gmail.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white text-slate-800 placeholder-slate-400 text-sm pl-11 pr-4 py-3.5 rounded-xl border border-slate-100 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-medium"
                  />
                </div>
                <p className="text-[10px] font-bold text-slate-400">
                  {role === 'student' ? (
                    <span className="text-blue-600 font-extrabold uppercase tracking-wide">
                      * Required: Official @kab.ac.ug Student Email
                    </span>
                  ) : (
                    <span>Any valid personal or business email address</span>
                  )}
                </p>
              </div>

              {/* Phone Number field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Phone Number</label>
                <div className="relative flex">
                  {/* Uganda Code Badge */}
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center space-x-1.5 pointer-events-none">
                    <span className="text-sm">🇺🇬</span>
                    <span className="text-sm font-bold text-slate-500 border-r border-slate-200 pr-2.5">+256</span>
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="771 234 567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-white text-slate-800 placeholder-slate-400 text-sm pl-24 pr-4 py-3.5 rounded-xl border border-slate-100 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-mono font-medium"
                  />
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center space-x-2 cursor-pointer mt-6"
              >
                <span>Send OTP Code</span>
              </motion.button>
            </form>
          </div>

          <div className="text-center mt-6">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              By continuing, you agree to our <span className="underline font-semibold text-slate-500 cursor-pointer">Terms of Service</span> and <span className="underline font-semibold text-slate-500 cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Enter Verification Code</h2>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                We've sent a 6-digit confirmation code to <span className="font-bold text-slate-800">+256 {phoneNumber}</span>.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-600">
                  {error}
                </div>
              )}

              <div className="space-y-2 text-center">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-left">OTP Code</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    pattern="\d*"
                    maxLength={6}
                    required
                    placeholder="Enter 6-digit code"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-white text-slate-800 placeholder-slate-400 text-center tracking-[1em] font-mono text-lg pl-11 pr-4 py-4 rounded-xl border border-slate-100 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Verify & Complete Registration</span>
              </motion.button>
            </form>
          </div>

          <div className="text-center mt-6 space-y-4">
            <p className="text-xs text-slate-500">
              Didn't receive the code?{' '}
              {countdown > 0 ? (
                <span className="font-semibold text-slate-400 font-mono">Resend in {countdown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
                    setGeneratedOtp(randomCode);
                    setCountdown(60);
                    setSmsToast(`[SMS Gateway] Resending OTP code: ${randomCode}`);
                  }}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Resend Code
                </button>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
