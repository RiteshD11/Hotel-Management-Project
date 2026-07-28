import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Hotel, User, LogOut, Menu, Sparkles, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = ({ onMenuClick }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navClass = `fixed w-full z-50 transition-all duration-500 ${
    scrolled || !isHome
      ? 'bg-white/90 backdrop-blur-md shadow-sm py-3 border-b border-gray-100'
      : 'bg-transparent py-5'
  }`;

  const textClass = scrolled || !isHome ? 'text-gray-900' : 'text-white';
  const logoClass = scrolled || !isHome ? 'text-blue-600' : 'text-blue-400';

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Left section: Mobile menu & Logo */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className={`lg:hidden p-2 mr-2 rounded-md transition-colors ${textClass} hover:bg-black/5`}
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.1 }} 
                className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#8b6e3d] to-[#7a6035] rounded-xl shadow-lg"
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>
              <div className="flex flex-col -space-y-1">
                <span className={`text-xl sm:text-2xl font-serif font-bold tracking-tighter ${textClass} transition-colors duration-300`}>
                  HotelMate<span className="text-[#8b6e3d]">.</span>
                </span>
                <span className="text-[8px] uppercase tracking-[0.4em] font-bold text-[#8b6e3d]">Signature</span>
              </div>
            </Link>
          </div>

          {/* Center section: Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            {['Rooms', 'Amenities', 'Contact'].map((item) => (
              <Link
                key={item}
                to={item === 'Rooms' ? '/rooms' : (item === 'Amenities' ? '/amenities' : `/#${item.toLowerCase()}`)}
                className={`text-sm font-medium uppercase tracking-widest hover:text-[#8b6e3d] transition-colors ${textClass}`}
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Right section: Auth */}
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                  className={`hidden sm:flex items-center space-x-2 text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-xl bg-[#8b6e3d]/10 text-[#8b6e3d] hover:bg-[#8b6e3d] hover:text-white transition-all duration-500`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 text-sm font-medium hover:text-[#8b6e3d] transition-colors ${textClass}`}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <span className="hidden lg:inline text-[11px] font-bold uppercase tracking-widest">{user?.name || user?.email}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link
                  to="/login"
                  className={`text-[10px] font-bold uppercase tracking-widest hover:text-[#8b6e3d] transition-colors ${textClass}`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-[10px] font-bold uppercase tracking-[0.3em] rounded-xl text-white bg-[#8b6e3d] hover:bg-[#7a6035] shadow-lg shadow-[#8b6e3d]/20 transition-all duration-500"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

