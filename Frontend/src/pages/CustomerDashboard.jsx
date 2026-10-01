import React, { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { 
  Users, Bed, Shield, LogOut, Clock, Calendar, 
  Star, Award, Hotel, ArrowRight, History, Settings, Bell,
  ChevronRight, Sparkles, MapPin, Loader2, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { bookingService } from '../services/bookingService';
import PageTransition from '../components/common/PageTransition';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(null);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getMyBookings();
      // Backend returns List<orders>
      const formatted = data.map(b => ({
        orderId: b.orderId,
        roomName: b.roomm?.roomName || 'Luxury Suite',
        roomImage: b.roomm?.imageName || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80',
        checkin: new Date(b.checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        checkout: new Date(b.checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        totalPrice: b.roomm?.roomRent || 0,
        status: b.status ? 'Active' : 'Completed' // backend status is boolean
      }));
      setBookings(formatted);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (orderId) => {
    if (!window.confirm('Are you sure you wish to settle your folio and checkout?')) return;
    
    setCheckoutLoading(orderId);
    try {
      await bookingService.checkoutBooking(orderId);
      await fetchBookings();
      alert('Checkout successful! An invoice has been sent to your email.');
    } catch (error) {
      console.error('Checkout failed', error);
      alert('Checkout failed. Please contact the front desk.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const activeBooking = bookings.find(b => b.status === 'Active');
  const pastBookings = bookings.filter(b => b.status === 'Completed');

  const displayUser = user || { name: 'Valued Guest', email: 'guest@hotelmate.com' };

  if (loading) {
    return (
      <MainLayout hideSidebar>
        <div className="min-h-screen bg-[#fdfaf5] flex flex-col items-center justify-center">
          <div className="relative w-24 h-24 mb-8">
             <div className="absolute inset-0 rounded-full border-4 border-[#8b6e3d]/20"></div>
             <div className="absolute inset-0 rounded-full border-4 border-[#8b6e3d] border-t-transparent animate-spin"></div>
             <Hotel className="absolute inset-0 m-auto w-8 h-8 text-[#8b6e3d]" />
          </div>
          <p className="text-[#8b6e3d] font-serif italic text-xl">Preparing your royal suite...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout hideSidebar>
      <PageTransition>
        <div className="min-h-screen bg-[#fdfaf5] py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-6">
            
            {/* ─── PREMIUM HEADER ─── */}
            <motion.div 
              initial="hidden" animate="visible" variants={fadeInUp}
              className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 pb-12 border-b border-[#8b6e3d]/10"
            >
              <div>
                <div className="flex items-center gap-4 mb-6">
                   <div className="h-px w-10 bg-[#8b6e3d]"></div>
                   <p className="text-[#8b6e3d] font-bold uppercase tracking-[0.4em] text-[10px]">Royal Guest Portal</p>
                </div>
                <h1 className="text-6xl md:text-7xl font-serif font-bold text-slate-900 leading-tight">
                  Welcome Back, <br /> <span className="italic font-light text-[#8b6e3d]">{(displayUser.name || 'Valued Guest').split(' ')[0]}</span>
                </h1>
              </div>
              <div className="flex gap-4">
                 <button className="w-16 h-16 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#8b6e3d] transition-all duration-500 shadow-sm hover:shadow-xl group">
                    <Bell className="w-6 h-6 group-hover:scale-110 transition-transform" />
                 </button>
                 <button className="w-16 h-16 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#8b6e3d] transition-all duration-500 shadow-sm hover:shadow-xl group">
                    <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                 </button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

              {/* ─── LEFT: MAIN CONTENT ─── */}
              <div className="lg:col-span-8 space-y-20">
                
                {/* UPCOMING / ACTIVE RESERVATION */}
                <motion.section initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.1 }}>
                  <div className="flex items-center justify-between mb-12">
                     <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.5em] flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-[#8b6e3d] animate-pulse"></div>
                        Current Residency
                     </h2>
                     {activeBooking && (
                        <span className="text-[10px] font-bold text-[#8b6e3d] bg-[#8b6e3d]/5 border border-[#8b6e3d]/20 px-6 py-2 rounded-full uppercase tracking-[0.3em]">
                           {activeBooking.status}
                        </span>
                     )}
                  </div>

                  {activeBooking ? (
                    <div className="bg-white rounded-[4rem] border border-[#8b6e3d]/10 shadow-[0_50px_100px_-20px_rgba(139,110,61,0.08)] overflow-hidden group relative">
                      <div className="grid grid-cols-1 md:grid-cols-5 min-h-[500px]">
                        <div className="md:col-span-2 relative overflow-hidden">
                           <img src={activeBooking.roomImage} alt="Room" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/5"></div>
                           <div className="absolute bottom-8 left-8 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-white" />
                              <span className="text-white text-xs font-bold uppercase tracking-widest">East Wing, Level 4</span>
                           </div>
                        </div>
                        <div className="md:col-span-3 p-16 flex flex-col justify-between bg-gradient-to-br from-[#fdfaf5] to-white">
                           <div>
                              <div className="flex items-center gap-3 mb-6">
                                 {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-[#8b6e3d] text-[#8b6e3d]" />)}
                              </div>
                              <h3 className="font-serif font-bold text-5xl text-slate-900 mb-6 tracking-tight">
                                {activeBooking.roomName}
                              </h3>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-12">Folio Ref: <span className="text-slate-900">#IMPERIAL-{activeBooking.orderId}</span></p>

                              <div className="grid grid-cols-2 gap-16 py-12 border-y border-[#8b6e3d]/10">
                                <div>
                                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.3em] mb-4">Arrival</p>
                                  <div className="flex items-center gap-4">
                                     <Calendar className="w-5 h-5 text-[#8b6e3d]" />
                                     <p className="text-2xl font-bold text-slate-900 font-serif">{activeBooking.checkin}</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.3em] mb-4">Departure</p>
                                  <div className="flex items-center gap-4">
                                     <Clock className="w-5 h-5 text-[#8b6e3d]" />
                                     <p className="text-2xl font-bold text-slate-900 font-serif">{activeBooking.checkout}</p>
                                  </div>
                                </div>
                              </div>
                           </div>
                           
                           <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8">
                              <div>
                                 <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.3em] mb-3">Sovereign Investment</p>
                                 <p className="text-4xl font-bold text-[#1a237e] font-serif">₹{activeBooking.totalPrice.toLocaleString()}</p>
                              </div>
                              <button 
                                onClick={() => handleCheckout(activeBooking.orderId)}
                                disabled={checkoutLoading === activeBooking.orderId}
                                className="w-full md:w-auto px-12 py-6 bg-[#1a237e] hover:bg-[#8b6e3d] text-white rounded-3xl text-[11px] font-bold uppercase tracking-[0.4em] transition-all duration-700 shadow-2xl shadow-[#1a237e]/30 flex items-center justify-center gap-5 hover:-translate-y-2 active:translate-y-0"
                              >
                                {checkoutLoading === activeBooking.orderId ? (
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                  <LogOut className="w-5 h-5" />
                                )}
                                {checkoutLoading === activeBooking.orderId ? 'Settling Folio...' : 'Settle & Checkout'}
                              </button>
                           </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-24 bg-[#fdfaf5] border border-[#8b6e3d]/20 rounded-[4rem] text-center relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-125 transition-transform duration-[5s]">
                          <Hotel className="w-80 h-80 text-[#8b6e3d]" />
                       </div>
                      <div className="w-28 h-28 bg-white rounded-[2rem] border border-[#8b6e3d]/10 flex items-center justify-center mx-auto mb-12 shadow-2xl group-hover:rotate-[15deg] transition-transform duration-700">
                        <Hotel className="w-12 h-12 text-[#8b6e3d]" />
                      </div>
                      <p className="text-slate-400 font-serif italic mb-16 text-3xl max-w-lg mx-auto leading-relaxed">
                         "The halls are silent. Your royal journey awaits its next chapter."
                      </p>
                      <button
                        onClick={() => navigate('/rooms')}
                        className="inline-flex items-center justify-center gap-5 bg-[#8b6e3d] text-white px-16 py-7 rounded-3xl font-bold uppercase tracking-[0.4em] text-[11px] hover:bg-[#7a6035] transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(139,110,61,0.4)] group"
                      >
                        Explore Royal Suites <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
                      </button>
                    </div>
                  )}
                </motion.section>

                {/* PAST BOOKINGS */}
                <motion.section initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.2 }}>
                  <div className="flex items-center justify-between mb-12">
                    <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.5em] flex items-center gap-4">
                       <History className="w-5 h-5 text-[#8b6e3d]" /> Heritage Record
                    </h2>
                    <div className="h-px flex-1 bg-[#8b6e3d]/10 ml-8"></div>
                  </div>

                  <div className="space-y-8">
                    {pastBookings.length > 0 ? (
                      pastBookings.map((b, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="flex flex-col md:flex-row justify-between items-center p-12 bg-white border border-slate-100 rounded-[3rem] hover:shadow-2xl hover:shadow-[#8b6e3d]/5 transition-all duration-500 group"
                        >
                          <div className="flex flex-col md:flex-row gap-10 items-center w-full md:w-auto text-center md:text-left">
                             <div className="w-24 h-24 rounded-[2rem] overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-700">
                                <img src={b.roomImage} alt="Room" className="w-full h-full object-cover" />
                             </div>
                             <div>
                                <p className="font-serif font-bold text-3xl text-slate-900 mb-3">{b.roomName}</p>
                                <div className="flex flex-col sm:flex-row items-center gap-6 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                                  <span className="flex items-center gap-2"><Calendar className="w-3 h-3 text-[#8b6e3d]" /> {b.checkin}</span>
                                  <span className="hidden sm:block text-[#8b6e3d]/30">•</span>
                                  <span className="flex items-center gap-2"><Clock className="w-3 h-3 text-[#8b6e3d]" /> {b.checkout}</span>
                                </div>
                             </div>
                          </div>
                          <div className="mt-8 md:mt-0 text-center md:text-right">
                            <p className="text-3xl font-bold text-slate-900 font-serif mb-3">₹{b.totalPrice.toLocaleString()}</p>
                            <div className="flex items-center justify-center md:justify-end gap-3">
                               <Award className="w-3 h-3 text-green-500" />
                               <span className="text-[10px] font-bold uppercase tracking-[0.3em] px-5 py-2 rounded-full bg-green-50 text-green-600 border border-green-100">
                                 {b.status}
                               </span>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="p-24 bg-white/50 border-2 border-dashed border-slate-100 rounded-[4rem] text-center text-slate-300 font-serif italic text-2xl">
                         "A new chapter is yet to be written in your royal history."
                      </div>
                    )}
                  </div>
                </motion.section>
              </div>

              {/* ─── RIGHT: SIDEBAR ─── */}
              <div className="lg:col-span-4 space-y-12">
                 
                 {/* MEMBER CARD */}
                 <motion.div 
                   initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.3 }}
                   className="bg-[#1a237e] text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group"
                 >
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                       <Award className="w-32 h-32 text-white" />
                    </div>
                    <div className="flex items-center gap-4 mb-10">
                       <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                          <User className="w-8 h-8 text-[#8b6e3d]" />
                       </div>
                       <div>
                          <p className="text-blue-200 text-[10px] font-bold uppercase tracking-[0.3em]">Heritage Member</p>
                          <h4 className="text-xl font-serif font-bold">{(displayUser.name || 'Valued Guest')}</h4>
                       </div>
                    </div>
                    <div className="space-y-8 mb-10">
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-blue-200/60 font-light italic">Member Since</span>
                          <span className="font-bold font-serif">April 2026</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-blue-200/60 font-light italic">Loyalty Points</span>
                          <span className="font-bold font-serif text-[#8b6e3d]">4,850 Pts</span>
                       </div>
                       <div className="h-px bg-white/10"></div>
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-blue-200/60 font-light italic">Account Status</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">Verified</span>
                       </div>
                    </div>
                    <button onClick={() => navigate('/profile')} className="w-full py-5 bg-white text-[#1a237e] rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#8b6e3d] hover:text-white transition-all duration-500 shadow-xl">
                       Edit Registry
                    </button>
                 </motion.div>

                 {/* QUICK ACTIONS */}
                 <motion.div 
                   initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.4 }}
                   className="space-y-6"
                 >
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-8">Bespoke Services</h3>
                    {[
                       { label: 'Room Service', icon: Hotel, color: 'text-[#8b6e3d]' },
                       { label: 'Royal Concierge', icon: Shield, color: 'text-[#1a237e]' },
                       { label: 'Dining Reservations', icon: Sparkles, color: 'text-rose-400' }
                    ].map((act, i) => (
                       <button key={i} className="w-full flex items-center justify-between p-8 bg-white border border-slate-100 rounded-3xl hover:shadow-xl transition-all duration-500 group">
                          <div className="flex items-center gap-6">
                             <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center ${act.color} group-hover:scale-110 transition-transform`}>
                                <act.icon className="w-6 h-6" />
                             </div>
                             <span className="font-bold text-slate-900 text-sm tracking-wide">{act.label}</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-[#8b6e3d] group-hover:translate-x-2 transition-all" />
                       </button>
                    ))}
                 </motion.div>

                 {/* LOGOUT */}
                 <button 
                   onClick={logout}
                   className="w-full p-10 flex items-center justify-center gap-4 text-red-400 hover:text-red-600 font-bold uppercase tracking-[0.4em] text-[10px] transition-all duration-500 hover:bg-red-50 rounded-[3rem] border border-transparent hover:border-red-100"
                 >
                    <LogOut className="w-4 h-4" /> Terminate Session
                 </button>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default CustomerDashboard;