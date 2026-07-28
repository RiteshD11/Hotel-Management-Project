import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../layouts/MainLayout';
import { Mail, Lock, ArrowRight, Hotel } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Show success message if redirected from registration
  const registered = location.state?.registered;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await login({ email, password });
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/rooms');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid email or password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout hideSidebar>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-20 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -ml-48 -mb-48"></div>

        <div className="w-full max-w-md relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
             <Link to="/" className="inline-flex items-center space-x-2 mb-6 group">
                <Hotel className="h-10 w-10 text-[#8b6e3d]" />
                <span className="text-3xl font-serif font-bold tracking-tight text-slate-900">HotelMate<span className="text-[#8b6e3d]">.</span></span>
             </Link>
            <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500 font-light">Enter your credentials to access your luxury sanctuary.</p>
          </div>

          {/* Registration success banner */}
          {registered && (
            <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-2xl text-green-700 text-sm flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">✓</div>
              Account created successfully! Please sign in.
            </div>
          )}

          {/* Card */}
          <div className="bg-white border border-slate-100 rounded-[2rem] shadow-2xl p-10">
            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-300 group-focus-within:text-[#8b6e3d] transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoFocus
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#8b6e3d]/5 focus:bg-white focus:border-[#8b6e3d] transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 ml-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                  <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-bold transition-colors">Forgot?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-300 group-focus-within:text-[#8b6e3d] transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your secret passphrase"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#8b6e3d]/5 focus:bg-white focus:border-[#8b6e3d] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-[#1a237e] hover:bg-[#151c63] text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-blue-500/10 disabled:opacity-60 active:scale-[0.98] group"
              >
                {loading ? 'Authenticating...' : 'Sign Into Account'}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-[#8b6e3d]" />}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-slate-500 mt-10">
            New to our hotel?{' '}
            <Link to="/register" className="text-[#8b6e3d] font-bold hover:underline transition-colors">
              Request Membership
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
