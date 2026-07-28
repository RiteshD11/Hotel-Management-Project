import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { motion } from 'framer-motion';
import { 
  Wifi, Coffee, Utensils, Waves, 
  Dumbbell, Sparkles, MapPin, Phone, Mail
} from 'lucide-react';

import luxuryLoungeImg from '../assets/luxury-lounge.png';
import hotelExperienceImg from '../assets/hotel-experience.png';
import wellnessSpaImg from '../assets/wellness-spa.png';

const AmenitiesPage = () => {

  const amenities = [
    { title: "Infinity Pool", icon: Waves, image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=800", desc: "A serene escape with panoramic horizon views." },
    { title: "Gourmet Dining", icon: Utensils, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800", desc: "Exquisite flavors from our Michelin-starred chefs." },
    { title: "Wellness Spa", icon: Sparkles, image: wellnessSpaImg, desc: "Rejuvenate your soul with royal treatment." },
    { title: "Fitness Center", icon: Dumbbell, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800", desc: "State-of-the-art equipment for your health." },
    { title: "Luxury Lounge", icon: Coffee, image: luxuryLoungeImg, desc: "Elegant spaces for relaxation and business." },
    { title: "High-Speed WiFi", icon: Wifi, image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800", desc: "Stay connected with ultra-fast connectivity." }
  ];

  return (
    <MainLayout hideSidebar>
      <div className="bg-[#fdfaf5] min-h-screen">
        {/* Header */}
        <div className="bg-[#1a237e] text-white py-32 px-4 relative overflow-hidden">
           <div className="absolute inset-0 opacity-10">
              <img 
                src={luxuryLoungeImg} 
                alt="Luxury Hotel" 
                className="w-full h-full object-cover"
              />
           </div>
           <div className="max-w-6xl mx-auto relative z-10 text-center">
              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">World-Class Amenities</h1>
              <p className="text-blue-100 text-xl font-light italic max-w-2xl mx-auto">
                Discover the finer details that make your stay at HotelMate an unforgettable legacy.
              </p>
           </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-24">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {amenities.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 group"
                >
                   <div className="relative h-64 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute top-6 left-6 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#8b6e3d] shadow-lg">
                         <item.icon className="w-6 h-6" />
                      </div>
                   </div>
                   <div className="p-10">
                      <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">{item.title}</h3>
                      <p className="text-slate-500 italic leading-relaxed text-sm">
                         "{item.desc}"
                      </p>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>

        {/* Floating Luxury Brand Image (Fixed the issue mentioned) */}
        <div className="max-w-7xl mx-auto px-6 pb-32">
           <div className="bg-white rounded-[3rem] p-12 shadow-2xl flex flex-col md:flex-row items-center gap-12 border border-slate-50">
              <div className="w-full md:w-1/3 aspect-square rounded-[2rem] overflow-hidden shadow-xl">
                 <img 
                   src={hotelExperienceImg} 
                   alt="Luxury Hotel Experience" 
                   className="w-full h-full object-cover"
                 />
              </div>
              <div className="flex-1">
                 <p className="text-[#8b6e3d] font-bold uppercase tracking-[0.4em] text-[10px] mb-6">Our Legacy</p>
                 <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">The Luxury Hotel Experience</h2>
                 <p className="text-slate-500 text-lg font-light leading-relaxed italic mb-8">
                    Since 1999, we have been setting the gold standard in hospitality. Every corner of HotelMate is designed to tell a story of elegance, comfort, and unmatched royal treatment.
                 </p>
                 <div className="flex gap-8">
                    <div className="text-center">
                       <p className="text-3xl font-serif font-bold text-[#8b6e3d]">25+</p>
                       <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Awards</p>
                    </div>
                    <div className="text-center">
                       <p className="text-3xl font-serif font-bold text-[#8b6e3d]">100%</p>
                       <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Privacy</p>
                    </div>
                    <div className="text-center">
                       <p className="text-3xl font-serif font-bold text-[#8b6e3d]">24/7</p>
                       <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Service</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AmenitiesPage;
