import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../layouts/MainLayout';
import { 
  User, Mail, Phone, MapPin, Camera, 
  Shield, Bell, CreditCard, ChevronRight, 
  Star, Award, Heart, Sparkles, LogOut, Loader2, Hotel
} from 'lucide-react';
import { motion } from 'framer-motion';
import { bookingService } from '../services/bookingService';
import PageTransition from '../components/common/PageTransition';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('personal');
  const [activeResidency, setActiveResidency] = React.useState(null);
  const [loadingResidency, setLoadingResidency] = React.useState(false);
  const [checkoutLoading, setCheckoutLoading] = React.useState(false);

  React.useEffect(() => {
    if (user?.role !== 'admin') {
      fetchActiveResidency();
    }
  }, [user]);

  const fetchActiveResidency = async () => {
    setLoadingResidency(true);
    try {
      const data = await bookingService.getMyBookings();
      const active = data.find(b => b.status === true || b.status === 'Active');
      if (active) {
        setActiveResidency({
          orderId: active.orderId,
          roomName: active.roomm?.roomName || 'Luxury Suite',
          roomRent: active.roomm?.roomRent || 0
        });
      }
    } catch (e) {
      console.error("Failed to load residency");
    } finally {
      setLoadingResidency(false);
    }
  };

  const handleCheckout = async () => {
    if (!activeResidency) return;
    if (!window.confirm('Settle your folio and checkout?')) return;
    
    setCheckoutLoading(true);
    try {
      await bookingService.checkoutBooking(activeResidency.orderId);
      setActiveResidency(null);
      alert('Checkout successful! We hope to see you again soon.');
    } catch (e) {
      alert('Checkout failed. Please contact concierge.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <MainLayout hideSidebar>
      <PageTransition>
        <div className="min-h-screen bg-[#fdfaf5] py-32 pb-40">
          <div className="max-w-6xl mx-auto px-6">
            
            {/* ─── HEADER ─── */}
            <motion.div 
              initial="hidden" animate="visible" variants={fadeInUp}
              className="mb-20"
            >
              <div className="flex items-center gap-3 mb-6">
                 <div className="h-px w-12 bg-[#8b6e3d]"></div>
                 <p className="text-[#8b6e3d] font-bold uppercase tracking-[0.4em] text-[10px]">Royal Membership</p>
              </div>
              <h1 className="text-6xl font-serif font-bold text-slate-900 mb-4 leading-tight">Your <span className="italic font-light text-[#8b6e3d]">Sanctuary</span></h1>
              <p className="text-slate-500 font-light text-xl italic leading-relaxed max-w-2xl">Manage your exclusive HotelMate heritage and bespoke preferences in our secure vault.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              
              {/* ─── LEFT: PROFILE CARD ─── */}
              <motion.div 
                initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.1 }}
                className="lg:col-span-4"
              >
                <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-12 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Sparkles className="w-20 h-20 text-[#8b6e3d]" />
                  </div>
                  
                  <div className="relative inline-block mb-10">
                    <div className="w-40 h-40 bg-[#fdfaf5] rounded-full flex items-center justify-center text-[#8b6e3d] border-4 border-white shadow-2xl relative z-10">
                      <User className="w-20 h-20" />
                    </div>
                    <button className="absolute bottom-2 right-2 p-3.5 bg-[#8b6e3d] rounded-full shadow-2xl border-4 border-white text-white hover:bg-[#1a237e] transition-all z-20 scale-110">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <h3 className="text-3xl font-serif font-bold text-slate-900 mb-3">{user?.name || 'Valued Guest'}</h3>
                  <div className="flex items-center justify-center gap-2 mb-10">
                    <Award className="w-4 h-4 text-[#8b6e3d]" />
                    <p className="text-[#8b6e3d] font-bold uppercase tracking-[0.2em] text-[10px]">Platinum Heritage Member</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 py-10 border-t border-slate-50">
                    <div>
                      <p className="text-3xl font-serif font-bold text-slate-900 mb-1">12</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Royal Nights</p>
                    </div>
                    <div className="border-l border-slate-50">
                      <p className="text-3xl font-serif font-bold text-slate-900 mb-1">8</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Residences</p>
                    </div>
                  </div>

                  <div className="mt-10 space-y-4">
                    {[
                      { id: 'personal', label: 'Personal Registry', icon: User },
                      { id: 'security', label: 'Security Vault', icon: Shield },
                      { id: 'preferences', label: 'Bespoke Taste', icon: Heart },
                      { id: 'billing', label: 'Finance & Invoices', icon: CreditCard }
                    ].map((sec) => (
                      <button 
                        key={sec.id}
                        onClick={() => setActiveSection(sec.id)}
                        className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] transition-all duration-500 ${activeSection === sec.id ? 'bg-[#1a237e] text-white shadow-2xl scale-105' : 'bg-[#fdfaf5] text-slate-500 hover:bg-white border border-transparent hover:border-slate-100'}`}
                      >
                         <div className="flex items-center gap-4">
                           <sec.icon className={`w-5 h-5 ${activeSection === sec.id ? 'text-[#8b6e3d]' : 'text-slate-300'}`} />
                           <span className="text-[10px] font-bold uppercase tracking-widest">{sec.label}</span>
                         </div>
                         <ChevronRight className={`w-4 h-4 transition-transform ${activeSection === sec.id ? 'text-white rotate-90' : 'text-slate-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* ─── RIGHT: FORM SECTION ─── */}
              <motion.div 
                initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.2 }}
                className="lg:col-span-8"
              >
                <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl p-16 relative overflow-hidden border-t-8 border-t-[#8b6e3d]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
                       <div className="flex items-center gap-6">
                          <button 
                            onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/dashboard')}
                            className="p-5 bg-[#fdfaf5] border border-[#8b6e3d]/10 rounded-2xl text-[#8b6e3d] hover:bg-[#8b6e3d] hover:text-white transition-all shadow-sm group/dash flex flex-col items-center gap-2"
                          >
                             <Sparkles className="w-6 h-6" />
                             <span className="text-[9px] font-bold uppercase tracking-widest">Dashboard</span>
                          </button>
                          <div>
                             <h3 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-4">
                                <Shield className="w-8 h-8 text-[#8b6e3d]" /> The Registry
                             </h3>
                             <p className="text-slate-400 text-xs mt-2 font-light italic">Role: <span className="text-[#8b6e3d] font-bold uppercase">{user?.role}</span> • Last updated: Today</p>
                          </div>
                       </div>
                       <button className="px-10 py-4 bg-[#1a237e] text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#8b6e3d] transition-all shadow-xl">
                         Update Registry
                       </button>
                    </div>

                   {/* ACTIVE RESIDENCY ALERT */}
                   {activeResidency && (
                     <motion.div 
                       initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                       className="mb-12 p-8 bg-[#1a237e] rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-[#1a237e]/20"
                     >
                        <div className="flex items-center gap-6">
                           <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                              <Hotel className="w-6 h-6 text-[#8b6e3d]" />
                           </div>
                           <div>
                              <p className="text-[9px] font-bold uppercase tracking-widest text-blue-200/60 mb-1">Current Residency</p>
                              <p className="font-serif font-bold text-xl">{activeResidency.roomName}</p>
                           </div>
                        </div>
                        <button 
                          onClick={handleCheckout}
                          disabled={checkoutLoading}
                          className="px-10 py-4 bg-[#8b6e3d] hover:bg-white hover:text-[#1a237e] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all duration-500 shadow-lg flex items-center gap-3"
                        >
                          {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                          {checkoutLoading ? 'Processing...' : 'Settle & Checkout'}
                        </button>
                     </motion.div>
                   )}

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {[
                        { label: 'Royal Full Name', val: user?.name, icon: User },
                        { label: 'Secure Email Address', val: user?.email, icon: Mail },
                        { label: 'Private Contact', val: '+91 98765 43210', icon: Phone },
                        { label: 'Identification Code', val: 'XXXX XXXX 1234', icon: Award },
                        { label: 'Gender Refinement', val: 'Unspecified', icon: Heart },
                        { label: 'Mailing Domain', val: 'Emerald Palace, Mumbai, India', icon: MapPin }
                      ].map((field, i) => (
                        <div key={i} className="space-y-4 group">
                           <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">{field.label}</label>
                           <div className="relative">
                              <field.icon className="absolute left-6 top-5 w-5 h-5 text-slate-200 group-hover:text-[#8b6e3d] transition-colors" />
                              <div className="w-full pl-16 pr-6 py-5 bg-[#fdfaf5] border border-transparent rounded-[2rem] text-slate-800 text-sm font-bold tracking-wide shadow-sm group-hover:bg-white group-hover:border-[#8b6e3d]/10 transition-all">
                                 {field.val || 'Awaiting entry...'}
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>

                   <div className="mt-20 pt-12 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-10">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 bg-[#fdfaf5] text-[#8b6e3d] rounded-[1.5rem] flex items-center justify-center border border-[#8b6e3d]/10 shadow-sm">
                            <Star className="w-8 h-8 fill-[#8b6e3d]" />
                         </div>
                         <div>
                            <h4 className="font-serif font-bold text-slate-900 text-xl">Verification Status</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Fully Certified Member</p>
                         </div>
                      </div>
                      <button className="text-red-400 font-bold uppercase tracking-[0.3em] text-[10px] hover:text-red-600 transition-all border-b border-red-100 pb-1">
                        Deactivate Sanctuary Access
                      </button>
                   </div>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="bg-[#1a237e] text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group border border-white/5">
                      <Bell className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform w-32 h-32" />
                      <h4 className="font-serif font-bold text-2xl mb-4">Royal Bulletins</h4>
                      <p className="text-blue-100/60 text-sm font-light mb-10 leading-relaxed italic">"Be the first to know of new residences and limited-time royal invitations."</p>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-7 bg-[#8b6e3d] rounded-full flex items-center justify-end px-1 cursor-pointer">
                           <div className="w-5 h-5 bg-white rounded-full shadow-lg"></div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Enabled</span>
                      </div>
                   </div>
                   <div className="bg-[#8b6e3d] text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                      <CreditCard className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform w-32 h-32" />
                      <h4 className="font-serif font-bold text-2xl mb-4">Financial Vault</h4>
                      <p className="text-white/70 text-sm font-light mb-10 leading-relaxed italic">"Securely manage your royal treasury and download historic invoices."</p>
                      <button className="bg-white text-[#8b6e3d] px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#1a237e] hover:text-white transition-all shadow-xl">Enter Vault</button>
                   </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default ProfilePage;
