import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Mail, Lock, User, Phone, CreditCard, ArrowRight, ArrowLeft, RefreshCw, CheckCircle, Hotel, Sparkles } from 'lucide-react';
import { authService } from '../services/authService';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = ['Enter Email', 'Verify OTP', 'Complete Profile'];

const RegisterPage = () => {
  const [step, setStep] = useState(1);

  // Step 1
  const [email, setEmail] = useState('');

  // Step 2
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  // Step 3 — all fields the backend User model expects
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [contact, setContact] = useState('');
  const [adharNumber, setAdharNumber] = useState('');
  const [gender, setGender] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ─── Step 1: Send OTP ─────────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return setError('Please enter your email address.');
    setError('');
    setLoading(true);
    try {
      await authService.sendOtp(email); // POST /auth/send-otp { email }
      setStep(2);
    } catch (err) {
      setError(err.response?.data || err.message || 'Failed to send OTP. Check if email already exists.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 2: Verify OTP ───────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return setError('Enter the full 6-digit OTP.');
    setError('');
    setLoading(true);
    try {
      const res = await authService.verifyOtp(email, code); // POST /auth/verify-otp { email, otp }
      if (res.status === 'success') {
        setStep(3);
      } else {
        setError(res.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 3: Set Profile ──────────────────────────────────────────────────
  const handleSetProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Full name is required.');
    if (!gender) return setError('Please select your gender.');
    if (!contact.trim()) return setError('Contact number is required.');
    if (!adharNumber.trim()) return setError('Aadhaar number is required.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');

    setError('');
    setLoading(true);
    try {
      // POST /auth/set-profile  body: { userName, email, password, contact, adharNumber, gender }
      await authService.setProfile({ name, email, password, contact, adharNumber, gender });
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data || err.message || 'Profile setup failed.');
    } finally {
      setLoading(false);
    }
  };

  // ─── OTP input helpers ────────────────────────────────────────────────────
  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const slide = {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.2 } },
    exit:    { x: -20, opacity: 0, transition: { duration: 0.15 } },
  };

  const inputClass = 'w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-4 focus:ring-[#8b6e3d]/5 focus:border-[#8b6e3d] focus:bg-white transition-all';
  const labelClass = 'block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1';

  return (
    <MainLayout hideSidebar>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">

          {/* Title */}
          <div className="text-center mb-10">
             <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8b6e3d]/10 rounded-3xl mb-6">
                <Hotel className="w-8 h-8 text-[#8b6e3d]" />
             </div>
            <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Heritage Membership</h1>
            <p className="text-slate-500 font-light italic">"Curating your entry into a world of timeless luxury."</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center mb-6">
            {STEPS.map((label, i) => {
              const s = i + 1;
              const done = step > s;
              const active = step === s;
              return (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold border-2 transition-all duration-500 ${
                      done   ? 'bg-[#8b6e3d] border-[#8b6e3d] text-white shadow-lg' :
                      active ? 'bg-[#1a237e] border-[#1a237e] text-white shadow-xl scale-110'  :
                               'bg-white border-slate-200 text-slate-300'
                    }`}>
                      {done ? <CheckCircle className="w-5 h-5" /> : s}
                    </div>
                    <span className={`text-[9px] uppercase font-bold tracking-widest mt-3 ${active ? 'text-[#1a237e]' : 'text-slate-400'}`}>
                      {label}
                    </span>
                  </div>
                  {s < 3 && (
                    <div className={`h-0.5 w-12 mb-4 mx-1 transition-all ${step > s ? 'bg-green-400' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <AnimatePresence mode="wait">

              {/* ── Step 1 ── */}
              {step === 1 && (
                <motion.form key="s1" {...slide} onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input
                        type="email" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required autoFocus
                        className={inputClass}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">A 6-digit OTP will be sent to this email.</p>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-[#1a237e] hover:bg-blue-900 text-white font-bold py-4 rounded-2xl transition-all shadow-lg text-[10px] uppercase tracking-widest disabled:opacity-50">
                    {loading ? 'Sending Request…' : 'Send Invitation'} {!loading && <ArrowRight className="w-4 h-4 text-[#8b6e3d]" />}
                  </button>
                </motion.form>
              )}

              {/* ── Step 2 ── */}
              {step === 2 && (
                <motion.form key="s2" {...slide} onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">OTP sent to <span className="font-semibold text-gray-800">{email}</span></p>
                  </div>
                  <div className="flex justify-center gap-2">
                    {otp.map((d, i) => (
                      <input key={i}
                        ref={(el) => (otpRefs.current[i] = el)}
                        type="text" inputMode="numeric" maxLength={1} value={d}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKey(i, e)}
                        className="w-11 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <button type="button"
                      onClick={() => { setStep(1); setOtp(['','','','','','']); setError(''); }}
                      className="px-6 py-4 border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button type="submit" disabled={loading || otp.join('').length < 6}
                      className="flex-1 flex items-center justify-center gap-3 bg-[#1a237e] hover:bg-blue-900 text-white font-bold py-4 rounded-2xl transition-all shadow-lg text-[10px] uppercase tracking-widest disabled:opacity-50">
                      {loading ? 'Authenticating…' : 'Verify Credentials'} {!loading && <ArrowRight className="w-4 h-4 text-[#8b6e3d]" />}
                    </button>
                  </div>
                  <button type="button" onClick={handleSendOtp} disabled={loading}
                    className="w-full text-[10px] font-bold uppercase tracking-widest text-[#8b6e3d] hover:underline flex items-center justify-center gap-2 disabled:opacity-50">
                    <RefreshCw className="w-3 h-3" /> Resend Verification
                  </button>
                </motion.form>
              )}

              {/* ── Step 3 ── */}
              {step === 3 && (
                <motion.form key="s3" {...slide} onSubmit={handleSetProfile} className="space-y-3">

                  {/* Full Name */}
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe" required autoFocus className={inputClass} />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className={labelClass}>Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} required
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#8b6e3d]/5 focus:border-[#8b6e3d] focus:bg-white transition-all appearance-none cursor-pointer">
                      <option value="">Select gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  {/* Contact */}
                  <div>
                    <label className={labelClass}>Contact Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input type="tel" value={contact} onChange={(e) => setContact(e.target.value)}
                        placeholder="9876543210" required className={inputClass} />
                    </div>
                  </div>

                  {/* Aadhaar */}
                  <div>
                    <label className={labelClass}>Aadhaar Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input type="text" value={adharNumber} onChange={(e) => setAdharNumber(e.target.value)}
                        placeholder="1234 5678 9012" required className={inputClass} />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className={labelClass}>Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 6 characters" required className={inputClass} />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className={labelClass}>Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat password" required className={inputClass} />
                    </div>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-[#8b6e3d] hover:bg-[#7a6035] text-white font-bold py-5 rounded-2xl transition-all shadow-xl text-[11px] uppercase tracking-[0.2em] mt-6 disabled:opacity-50">
                    {loading ? 'Initializing Legacy…' : 'Complete Registration'} {!loading && <ArrowRight className="w-5 h-5" />}
                  </button>
                </motion.form>
              )}

            </AnimatePresence>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default RegisterPage;
