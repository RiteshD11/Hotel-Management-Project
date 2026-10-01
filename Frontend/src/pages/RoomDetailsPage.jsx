import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { roomService } from '../services/roomService';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import {
  Users, Maximize, Calendar, CheckCircle,
  ArrowLeft, Wifi, Tag, MapPin, Coffee, Shield, Sparkles, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';

const RoomDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking form state
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [booking, setBooking] = useState(false);   
  const [bookingMsg, setBookingMsg] = useState(''); 
  const [bookingErr, setBookingErr] = useState(''); 

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      try {
        if (user?.role === 'admin') {
          const data = await roomService.getRoomDetails(id);
          setRoom(data);
        } else {
          const allRooms = await roomService.getRooms();
          const matchedRoom = allRooms.find(r => r.id.toString() === id.toString());
          if (matchedRoom) {
            setRoom(matchedRoom);
          } else {
            setError('The requested suite could not be located in our catalog.');
          }
        }
      } catch (err) {
        setError('Failed to synchronize with our reservation system. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id, user]);

  const nights = checkin && checkout
    ? Math.max(0, Math.floor((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24)))
    : 0;

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingErr('');

    if (!user) {
      navigate('/login');
      return;
    }
    if (!checkin || !checkout) return setBookingErr('Select check-in and check-out dates.');
    if (nights <= 0) return setBookingErr('Check-out must follow check-in.');

    setBooking(true);
    try {
      const result = await bookingService.createBooking({
        roomId: parseInt(id),
        checkin: checkin,
        checkout: checkout,
      });
      setBookingMsg(result || 'Your stay has been successfully reserved.');

    } catch (err) {
      setBookingErr(err.response?.data || 'Reservation failed. Please check availability.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <MainLayout hideSidebar>
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfaf5]">
          <div className="w-16 h-16 border-4 border-[#8b6e3d]/10 border-t-[#8b6e3d] rounded-full animate-spin mb-6"></div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#8b6e3d]">Opening Suite Details...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !room) {
    return (
      <MainLayout hideSidebar>
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center bg-[#fdfaf5]">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-2">
             <MapPin className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-900">{error || 'Suite Not Found'}</h2>
          <button onClick={() => navigate('/rooms')}
            className="flex items-center gap-2 bg-[#1a237e] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition hover:bg-[#8b6e3d] shadow-xl">
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </button>
        </div>
      </MainLayout>
    );
  }

  if (bookingMsg) {
    return (
      <MainLayout hideSidebar>
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#fdfaf5]">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[3rem] p-16 text-center max-w-xl w-full shadow-2xl border border-slate-100"
          >
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Stay Reserved!</h2>
            <p className="text-slate-500 text-lg mb-10 font-light leading-relaxed italic">"{bookingMsg}"</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button onClick={() => navigate('/dashboard')}
                className="bg-[#1a237e] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] transition hover:bg-[#8b6e3d] shadow-xl">
                My Dashboard
              </button>
              <button onClick={() => navigate('/rooms')}
                className="bg-slate-100 text-slate-900 px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] transition hover:bg-slate-200">
                Browse More
              </button>
            </div>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <MainLayout hideSidebar>
      <PageTransition>
        <div className="min-h-screen bg-[#fdfaf5] pb-32">
          
          {/* ─── Hero Image ─── */}
          <section className="relative h-[75vh] overflow-hidden">
             <img
                src={room.image}
                alt={room.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200';
                }}
              />
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#fdfaf5] via-transparent to-transparent"></div>
              
              <div className="absolute top-32 left-10 z-20">
                 <button onClick={() => navigate('/rooms')}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#8b6e3d] transition-all">
                  <ArrowLeft className="w-5 h-5" /> Back to Collection
                </button>
              </div>

              <div className="absolute bottom-10 left-10 right-10 z-20">
                 <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-10">
                    <div>
                       <div className="flex items-center gap-3 mb-6">
                          <Sparkles className="w-4 h-4 text-[#8b6e3d] fill-[#8b6e3d]" />
                          <span className="text-white font-bold uppercase tracking-[0.4em] text-[10px] drop-shadow-md">Premier Signature Suite</span>
                       </div>
                       <h1 className="text-5xl md:text-8xl font-serif font-bold text-slate-900 leading-tight drop-shadow-sm">{room.name}</h1>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-3xl flex items-center justify-center text-[#8b6e3d] shadow-xl border border-white hover:bg-[#8b6e3d] hover:text-white transition-colors cursor-pointer">
                          <Heart className="w-6 h-6" />
                       </div>
                    </div>
                 </div>
              </div>
          </section>

          {/* ─── Content Grid ─── */}
          <div className="max-w-7xl mx-auto px-10 py-24">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
                
                {/* Details Section */}
                <div className="lg:col-span-8">
                   <div className="flex flex-wrap gap-12 mb-20 pb-20 border-b border-slate-200">
                      {[
                        { icon: Users, label: 'Capacity', val: `${room.capacity} Guests` },
                        { icon: Maximize, label: 'Suite Size', val: `${room.size} sq ft` },
                        { icon: Shield, label: 'Status', val: room.available ? 'Ready' : 'Reserved', color: room.available ? 'text-green-600' : 'text-red-500' },
                        { icon: Tag, label: 'Category', val: room.type || 'Signature' }
                      ].map((item, i) => (
                        <div key={i} className="flex gap-5 items-center">
                           <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#8b6e3d] border border-slate-100 shadow-sm">
                              <item.icon className="w-6 h-6" />
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                              <p className={`font-bold text-slate-900 text-lg ${item.color || ''}`}>{item.val}</p>
                           </div>
                        </div>
                      ))}
                   </div>

                   <h3 className="text-3xl font-serif font-bold text-slate-900 mb-10">The Experience</h3>
                   <p className="text-slate-500 text-2xl font-light leading-relaxed mb-16 italic">
                      "{room.description || "Immerse yourself in a world of refined elegance. This suite has been meticulously designed to offer the ultimate in luxury, featuring premium materials and world-class craftsmanship."}"
                   </p>

                   <h3 className="text-3xl font-serif font-bold text-slate-900 mb-10">Signature Amenities</h3>
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-16">
                      {(room.amenities.length > 0 ? room.amenities : ['High-Speed WiFi', 'Luxury Bathrobe', 'Smart TV', 'Mini Bar', 'Daily Housekeeping', '24/7 Service']).map((a, i) => (
                        <div key={i} className="flex items-center gap-5 p-6 bg-white rounded-[2rem] border border-slate-100 hover:border-[#8b6e3d]/30 transition-all group shadow-sm">
                           <div className="w-10 h-10 bg-[#fdfaf5] rounded-xl flex items-center justify-center text-[#8b6e3d] group-hover:bg-[#8b6e3d] group-hover:text-white transition-all">
                              <CheckCircle className="w-5 h-5" />
                           </div>
                           <span className="text-sm font-bold text-slate-700 tracking-wide uppercase tracking-widest">{a}</span>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Booking Sidebar */}
                <div className="lg:col-span-4">
                   <div className="bg-white border border-slate-100 rounded-[4rem] shadow-2xl p-12 sticky top-32 overflow-hidden border-t-8 border-t-[#8b6e3d]">
                      <div className="absolute top-0 right-0 p-10 opacity-5">
                         <Sparkles className="w-24 h-24 text-[#8b6e3d]" />
                      </div>
                      
                      <div className="mb-12 text-center">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Reserve This Masterpiece</p>
                         <h4 className="text-6xl font-serif font-bold text-[#8b6e3d]">₹{room.price}</h4>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">per night / royal inclusive</p>
                      </div>

                      {bookingErr && (
                        <div className="mb-10 p-5 bg-red-50 border border-red-100 rounded-[2rem] text-red-600 text-[10px] font-bold text-center uppercase tracking-widest">
                          {bookingErr}
                        </div>
                      )}

                      <form onSubmit={handleBook} className="space-y-8">
                        <div className="space-y-6">
                           <div className="relative group">
                              <Calendar className="absolute left-6 top-5 w-5 h-5 text-slate-300 group-focus-within:text-[#8b6e3d] transition-colors" />
                              <input
                                type="date"
                                value={checkin}
                                min={today}
                                onChange={(e) => {
                                  setCheckin(e.target.value);
                                  if (checkout && e.target.value >= checkout) setCheckout('');
                                }}
                                required
                                className="w-full pl-16 pr-6 py-5 bg-[#fdfaf5] border-none rounded-[2rem] text-sm font-bold text-slate-900 focus:ring-4 focus:ring-[#8b6e3d]/10 outline-none transition-all appearance-none"
                              />
                              <p className="absolute -top-3 left-6 px-2 bg-white text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Arrival</p>
                           </div>

                           <div className="relative group">
                              <Calendar className="absolute left-6 top-5 w-5 h-5 text-slate-300 group-focus-within:text-[#8b6e3d] transition-colors" />
                              <input
                                type="date"
                                value={checkout}
                                min={checkin || today}
                                onChange={(e) => setCheckout(e.target.value)}
                                required
                                className="w-full pl-16 pr-6 py-5 bg-[#fdfaf5] border-none rounded-[2rem] text-sm font-bold text-slate-900 focus:ring-4 focus:ring-[#8b6e3d]/10 outline-none transition-all appearance-none"
                              />
                              <p className="absolute -top-3 left-6 px-2 bg-white text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Departure</p>
                           </div>
                        </div>

                        <AnimatePresence>
                          {nights > 0 && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="bg-[#fdfaf5] rounded-[2rem] p-8 text-sm space-y-4 overflow-hidden border border-[#8b6e3d]/10"
                            >
                              <div className="flex justify-between text-slate-400 font-bold uppercase tracking-widest text-[9px]">
                                <span>₹{room.price} × {nights} Night{nights > 1 ? 's' : ''}</span>
                                <span>₹{room.price * nights}</span>
                              </div>
                              <div className="flex justify-between font-bold text-[#8b6e3d] border-t border-[#8b6e3d]/10 pt-4">
                                <span className="uppercase tracking-[0.2em] text-[10px]">Total Investment</span>
                                <span className="text-xl font-serif">₹{room.price * nights}</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <button
                          type="submit"
                          disabled={booking || !room.available}
                          className="w-full bg-[#1a237e] hover:bg-[#8b6e3d] text-white font-serif font-bold text-lg py-6 rounded-[2rem] transition-all duration-500 shadow-2xl disabled:opacity-40 disabled:cursor-not-allowed group scale-105 active:scale-95"
                        >
                          {booking ? 'Securing Stay...' : room.available ? 'Reserve Suite' : 'Currently Reserved'}
                        </button>
                        
                        <p className="text-[9px] text-slate-400 text-center font-bold uppercase tracking-[0.3em] mt-8 flex items-center justify-center gap-3">
                           <Shield className="w-4 h-4 text-[#8b6e3d]" /> Royal Secure Reservation
                        </p>
                      </form>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default RoomDetailsPage;
