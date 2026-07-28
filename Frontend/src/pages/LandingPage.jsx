import React, { useEffect, useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Star, Shield, Clock, Wifi, Coffee, 
  ChevronDown, Check, Award, MapPin, Phone, 
  Search, Users, Sparkles, Heart, Hotel, Mail, Play
} from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { roomService } from '../services/roomService';
import PageTransition from '../components/common/PageTransition';

import heritageModern from '../assets/heritage-modern.png';
import wellnessSpa from '../assets/wellness-spa.png';

const LandingPage = () => {

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.1]);

  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await roomService.getRooms();
        setFeaturedRooms(data.slice(0, 3)); 
      } catch (error) {
        console.error("Failed to fetch featured rooms");
      }
    };
    fetchRooms();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const features = [
    { title: "Infinity Pool", image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1000&auto=format&fit=crop", desc: "A serene escape with panoramic ocean views." },
    { title: "Michelin Dining", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop", desc: "Exquisite flavors crafted by world-renowned chefs." },
    { title: "Royal Wellness", image: wellnessSpa, desc: "Rejuvenate your soul in our award-winning spa." }
  ];

  return (
    <MainLayout hideSidebar>
      <PageTransition>
        <div className="relative bg-[#fdfaf5] min-h-screen text-slate-900 selection:bg-[#8b6e3d] selection:text-white">
          
          {/* ─── 1. LUXURY HERO SECTION ─── */}
          <section className="relative h-[100vh] flex items-center justify-center overflow-hidden bg-[#fdfaf5]">
            <div className="absolute inset-0 z-0 flex items-center justify-center">
               {/* Decorative background element instead of broken image */}
               <div className="absolute top-0 right-0 p-40 opacity-[0.03] pointer-events-none">
                  <Hotel className="w-[800px] h-[800px] text-[#8b6e3d]" />
               </div>
               <div className="absolute bottom-0 left-0 p-40 opacity-[0.03] pointer-events-none">
                  <Sparkles className="w-[600px] h-[600px] text-[#8b6e3d]" />
               </div>
            </div>

            <div className="relative z-20 text-center px-6 max-w-6xl mx-auto pt-20">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="inline-flex items-center gap-3 bg-[#8b6e3d]/5 border border-[#8b6e3d]/20 px-8 py-3 rounded-full mb-12 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-[#8b6e3d]" />
                  <span className="text-[#8b6e3d] uppercase tracking-[0.5em] text-[11px] font-bold">The World's Finest Stay</span>
                </motion.div>
                
                <h1 className="text-7xl md:text-9xl font-serif font-bold text-slate-900 mb-12 leading-[0.9] tracking-tighter">
                   Luxury is <br /> <span className="italic font-light text-[#8b6e3d]">A Legacy</span>
                </h1>
                
                <p className="text-slate-500 text-xl font-light leading-relaxed mb-16 max-w-2xl mx-auto italic">
                   "Where heritage meets hospitality in a dance of timeless elegance."
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-12">
                  <Link
                    to="/rooms"
                    className="w-full sm:w-auto px-16 py-7 bg-[#1a237e] text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-[11px] transition-all duration-500 hover:bg-[#8b6e3d] shadow-[0_30px_60px_-15px_rgba(26,35,126,0.3)] group flex items-center justify-center gap-4 hover:-translate-y-2"
                  >
                    Reserve Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
                  </Link>
                  <button className="w-full sm:w-auto px-16 py-7 bg-white border border-slate-100 text-slate-900 rounded-2xl font-bold uppercase tracking-[0.3em] text-[11px] transition-all duration-500 hover:shadow-2xl flex items-center justify-center gap-3 group hover:-translate-y-2">
                    <Play className="w-4 h-4 text-[#8b6e3d] group-hover:scale-125 transition-transform" /> Watch Film
                  </button>
                </div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
            >
              <div className="w-6 h-10 border-2 border-[#8b6e3d]/20 rounded-full flex justify-center p-1">
                <motion.div 
                  animate={{ y: [0, 12, 0] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-1.5 h-1.5 bg-[#8b6e3d] rounded-full"
                />
              </div>
            </motion.div>
          </section>

          {/* ─── 2. SEARCH & DISCOVER BAR ─── */}
          <div className="relative z-30 max-w-6xl mx-auto -mt-16 px-4">
             <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                <div className="px-6 py-2 border-r border-slate-100">
                   <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Check In</p>
                   <p className="text-sm font-bold text-slate-900 flex items-center gap-2"><MapPin className="w-4 h-4 text-[#8b6e3d]" /> Current Location</p>
                </div>
                <div className="px-6 py-2 border-r border-slate-100">
                   <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Guests</p>
                   <p className="text-sm font-bold text-slate-900 flex items-center gap-2"><Users className="w-4 h-4 text-[#8b6e3d]" /> 2 Adults, 0 Child</p>
                </div>
                <div className="px-6 py-2">
                   <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Room Type</p>
                   <p className="text-sm font-bold text-slate-900 flex items-center gap-2"><Heart className="w-4 h-4 text-[#8b6e3d]" /> Royal Suite</p>
                </div>
                <Link to="/rooms" className="bg-[#1a237e] text-white h-full flex items-center justify-center rounded-2xl gap-3 font-bold uppercase tracking-widest text-[10px] hover:bg-[#8b6e3d] transition-all duration-300">
                  <Search className="w-4 h-4" /> Discover Availability
                </Link>
             </div>
          </div>

          {/* ─── 3. OUR STORY SECTION ─── */}
          <section className="py-48 px-4 bg-[#fdfaf5] relative">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <motion.div 
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeInUp}
                className="relative"
              >
                <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-2xl border-[16px] border-white">
                   <img src={heritageModern} alt="Exterior" className="w-full h-full object-cover aspect-[4/5]" />
                </div>
                <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-[#8b6e3d]/10 rounded-full -z-10 blur-3xl"></div>
                <div className="absolute -top-10 -left-10 p-12 bg-[#1a237e] shadow-2xl rounded-[3rem] z-20 max-w-[300px] hidden md:block text-white">
                   <p className="text-5xl font-serif font-bold mb-3 text-[#8b6e3d]">25</p>
                   <p className="text-[10px] font-bold uppercase tracking-[0.3em] leading-relaxed opacity-80">Years of Royal Hospitality Heritage</p>
                </div>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <p className="text-[#8b6e3d] font-bold uppercase tracking-[0.4em] text-[10px] mb-8">The Essence of Elegance</p>
                <h2 className="text-5xl md:text-8xl font-serif font-bold text-slate-900 mb-10 leading-[1.1]">Where History <br /> <span className="italic font-light text-[#8b6e3d]">Meets Modernity</span></h2>
                <p className="text-slate-600 text-xl font-light leading-relaxed mb-12 italic">
                  "At HotelMate, we don't just offer a stay; we offer a sanctuary. Every detail is curated to evoke the majesty of a royal palace."
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
                  {['Private Butler Service', 'Artisanal Cuisine', 'Regal Wellness Spa', 'Heritage Architecture'].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-[#8b6e3d]/10 text-[#8b6e3d] rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-slate-800 tracking-widest text-[10px] uppercase">{item}</span>
                    </div>
                  ))}
                </div>
                <Link to="/register" className="inline-flex items-center gap-6 px-10 py-5 bg-[#1a237e] text-white rounded-full font-bold uppercase tracking-widest text-[10px] group transition-all hover:bg-[#8b6e3d]">
                  Join the Club <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </section>

          {/* ─── 4. SIGNATURE SUITES ─── */}
          <section className="py-48 bg-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-40 opacity-5 pointer-events-none">
                <Hotel className="w-96 h-96 text-[#8b6e3d]" />
             </div>
             
             <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-10">
                   <div className="max-w-2xl">
                      <p className="text-[#8b6e3d] font-bold uppercase tracking-[0.4em] text-[10px] mb-8">Curated Collection</p>
                      <h2 className="text-5xl md:text-8xl font-serif font-bold text-slate-900 leading-[1.1]">Signature <br /> Suites</h2>
                   </div>
                   <Link to="/rooms" className="px-12 py-6 bg-[#fdfaf5] border border-[#8b6e3d]/20 text-[#8b6e3d] rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-[#1a237e] hover:text-white transition-all duration-500">
                     Explore All Residences
                   </Link>
                </div>

                <motion.div 
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                  variants={staggerContainer}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-16"
                >
                  {featuredRooms.map((room) => (
                    <motion.div 
                      key={room.id} 
                      variants={fadeInUp}
                      className="group relative"
                    >
                      <div className="relative rounded-[3rem] overflow-hidden aspect-[4/5] shadow-2xl group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)] transition-all duration-700 border-8 border-white">
                        <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                        
                        <div className="absolute bottom-12 left-10 right-10">
                          <p className="text-[#8b6e3d] text-[10px] uppercase font-bold tracking-[0.3em] mb-4">Starting from ₹{room.price}</p>
                          <h3 className="text-4xl font-serif font-bold text-white mb-8 leading-tight">{room.name}</h3>
                          <Link to={`/rooms/${room.id}`} className="inline-flex items-center gap-3 text-white text-[10px] uppercase font-bold tracking-widest group/btn">
                             View Details <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform text-[#8b6e3d]" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
             </div>
          </section>

          {/* ─── 5. FEATURES INTERACTIVE ─── */}
          <section className="py-48 bg-[#fdfaf5]">
             <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
                   <div className="lg:col-span-5">
                      <p className="text-[#8b6e3d] font-bold uppercase tracking-[0.4em] text-[10px] mb-8">The Royal Lifestyle</p>
                      <h2 className="text-6xl font-serif font-bold text-slate-900 mb-16 leading-tight">Crafting Your <br /> Memories</h2>
                      <div className="space-y-6">
                         {features.map((f, i) => (
                            <button 
                              key={i} 
                              onClick={() => setActiveFeature(i)}
                              className={`w-full text-left p-10 rounded-[2.5rem] transition-all border duration-500 ${activeFeature === i ? 'bg-[#1a237e] border-[#1a237e] text-white shadow-2xl scale-105' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                            >
                               <div className="flex justify-between items-center mb-4">
                                  <h4 className={`font-serif font-bold text-2xl ${activeFeature === i ? 'text-[#8b6e3d]' : 'text-slate-900'}`}>{f.title}</h4>
                                  <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${activeFeature === i ? 'rotate-180 text-[#8b6e3d]' : 'text-slate-300'}`} />
                               </div>
                               {activeFeature === i && (
                                 <motion.p 
                                   initial={{ opacity: 0, height: 0 }}
                                   animate={{ opacity: 1, height: 'auto' }}
                                   className="text-sm text-blue-100 font-light leading-relaxed italic"
                                 >
                                   "{f.desc}"
                                 </motion.p>
                               )}
                            </button>
                         ))}
                      </div>
                   </div>
                   <div className="lg:col-span-7">
                      <AnimatePresence mode="wait">
                         <motion.div 
                           key={activeFeature}
                           initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                           animate={{ opacity: 1, scale: 1, rotate: 0 }}
                           exit={{ opacity: 0, scale: 1.1, rotate: 2 }}
                           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                           className="relative rounded-[4rem] overflow-hidden aspect-[4/3] shadow-[0_50px_100px_rgba(0,0,0,0.2)] border-[12px] border-white"
                         >
                            <img src={features[activeFeature].image} alt="Feature" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a237e]/40 to-transparent"></div>
                         </motion.div>
                      </AnimatePresence>
                   </div>
                </div>
             </div>
          </section>

          {/* ─── 6. LUXURIOUS CONTACT SECTION ─── */}
          <section id="contact" className="py-64 bg-[#1a237e] relative overflow-hidden">
             {/* Abstract Royal Patterns */}
             <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#8b6e3d] rounded-full blur-[150px] opacity-10 -mr-96 -mt-96"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400 rounded-full blur-[150px] opacity-5 -ml-48 -mb-48"></div>
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#8b6e3d 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
             </div>

             <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                   
                   <div>
                      <motion.div 
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                      >
                         <div className="flex items-center gap-4 mb-8">
                            <div className="h-px w-12 bg-[#8b6e3d]"></div>
                            <p className="text-[#8b6e3d] font-bold uppercase tracking-[0.4em] text-[10px]">Royal Registry</p>
                         </div>
                         <h2 className="text-6xl md:text-8xl font-serif font-bold text-white mb-12 leading-tight">Your Legacy <br /> <span className="italic font-light text-[#8b6e3d]">Awaits</span></h2>
                         <p className="text-blue-100/60 text-xl font-light italic leading-relaxed mb-16 max-w-xl">
                           "From the moment you reach out, our master concierges begin crafting your bespoke heritage experience."
                         </p>

                         <div className="space-y-10">
                            {[
                              { icon: MapPin, title: 'Heritage Address', detail: '123 Imperial Boulevard, Mumbai, India' },
                              { icon: Phone, title: 'Royal Concierge', detail: '+91 (800) ROYAL-STAY' },
                              { icon: Mail, title: 'Digital Registry', detail: 'concierge@hotelmate.luxury' }
                            ].map((item, i) => (
                              <div key={i} className="flex gap-6 items-center group">
                                 <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#8b6e3d] group-hover:border-[#8b6e3d] transition-all duration-500 shadow-xl">
                                    <item.icon className="w-5 h-5 text-[#8b6e3d] group-hover:text-white transition-colors" />
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-bold text-blue-100/40 uppercase tracking-widest mb-1">{item.title}</p>
                                    <p className="text-lg font-serif font-bold text-white tracking-wide">{item.detail}</p>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </motion.div>
                   </div>

                   <motion.div 
                     initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                     className="relative"
                   >
                      <div className="absolute -inset-4 bg-[#8b6e3d]/20 blur-2xl rounded-[4rem]"></div>
                      <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 p-16 rounded-[4rem] shadow-2xl">
                         <div className="mb-12">
                            <h3 className="text-2xl font-serif font-bold text-white mb-2">Send an Invitation</h3>
                            <p className="text-blue-100/40 text-xs uppercase tracking-widest font-bold">Our curators will respond within the hour</p>
                         </div>
                         
                         <form className="space-y-10">
                            <div className="space-y-4">
                               <label className="text-[10px] font-bold text-blue-100/40 uppercase tracking-widest ml-1">The Name of Your Highness</label>
                               <input type="text" className="w-full bg-white/5 border-b border-white/10 p-4 text-white font-serif text-lg focus:border-[#8b6e3d] outline-none transition-all placeholder:text-white/10" placeholder="e.g. Maharajah Singh" />
                            </div>
                            <div className="space-y-4">
                               <label className="text-[10px] font-bold text-blue-100/40 uppercase tracking-widest ml-1">Digital Correspondence</label>
                               <input type="email" className="w-full bg-white/5 border-b border-white/10 p-4 text-white font-serif text-lg focus:border-[#8b6e3d] outline-none transition-all placeholder:text-white/10" placeholder="your@legacy.com" />
                            </div>
                            <div className="space-y-4">
                               <label className="text-[10px] font-bold text-blue-100/40 uppercase tracking-widest ml-1">Bespoke Requests</label>
                               <textarea rows="4" className="w-full bg-white/5 border-b border-white/10 p-4 text-white font-serif text-lg focus:border-[#8b6e3d] outline-none transition-all resize-none placeholder:text-white/10" placeholder="How may we serve you?"></textarea>
                            </div>
                            <button className="w-full py-6 bg-[#8b6e3d] text-white rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-[#7a6035] shadow-[0_20px_40px_rgba(139,110,61,0.3)] transition-all duration-500 scale-105 hover:scale-110 active:scale-95">
                               Transmit Inquiry
                            </button>
                         </form>
                      </div>
                   </motion.div>

                </div>
             </div>
          </section>

          {/* ─── 7. FOOTER ─── */}
          <footer className="bg-[#1a237e] text-white pt-48 pb-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8b6e3d] to-transparent opacity-30"></div>
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-24 mb-32">
                <div className="col-span-1 md:col-span-2">
                  <span className="text-5xl font-serif font-bold tracking-tighter mb-12 block">
                    HotelMate<span className="text-[#8b6e3d]">.</span>
                  </span>
                  <p className="text-blue-100/60 font-light max-w-sm leading-loose mb-16 text-lg italic">
                    "Where every guest is treated as royalty, and every stay becomes a timeless legacy."
                  </p>
                  <div className="flex gap-8">
                     {[MapPin, Phone, Mail].map((Icon, i) => (
                        <div key={i} className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-[#8b6e3d] hover:border-[#8b6e3d] transition-all duration-500 cursor-pointer group">
                           <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        </div>
                     ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-12 text-[#8b6e3d]">Navigation</h4>
                  <ul className="space-y-8 text-blue-100/80 font-medium text-[10px] uppercase tracking-widest">
                    <li><Link to="/rooms" className="hover:text-[#8b6e3d] transition-colors">Royal Suites</Link></li>
                    <li><Link to="/amenities" className="hover:text-[#8b6e3d] transition-colors">Grand Amenities</Link></li>
                    <li><a href="#" className="hover:text-[#8b6e3d] transition-colors">Wellness Spa</a></li>
                    <li><Link to="/register" className="hover:text-[#8b6e3d] transition-colors">Elite Membership</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-12 text-[#8b6e3d]">Inquiries</h4>
                  <p className="text-blue-100/60 text-sm leading-relaxed mb-10 font-light italic">
                    123 Imperial Boulevard,<br />
                    Royal Coast Heritage, NY 10001
                  </p>
                  <p className="text-[#8b6e3d] font-serif font-bold text-2xl tracking-tighter">+1 (800) ROYAL-STAY</p>
                </div>
              </div>
              <div className="pt-20 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10">
                <p className="text-[10px] text-blue-100/40 uppercase tracking-[0.4em] font-bold">
                  &copy; {new Date().getFullYear()} HotelMate Luxury Group. Crafted with Elegance.
                </p>
                <div className="flex gap-16 text-[10px] uppercase tracking-[0.4em] font-bold text-blue-100/40">
                  <a href="#" className="hover:text-[#8b6e3d] transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-[#8b6e3d] transition-colors">Terms of Stay</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default LandingPage;
