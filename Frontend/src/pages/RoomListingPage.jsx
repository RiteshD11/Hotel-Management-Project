import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { roomService } from '../services/roomService';
import { 
  Wifi, Coffee, Wind, Users, Maximize, 
  CheckCircle, XCircle, ArrowRight, Star,
  Search, SlidersHorizontal, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/common/PageTransition';

const RoomCard = React.forwardRef(({ room, onClick }, ref) => {
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -10 }}
      onClick={() => onClick(room.id)}
      className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-80 bg-[#fdfaf5] overflow-hidden">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a237e]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md shadow-lg ${
          room.available ? 'bg-white/90 text-green-600' : 'bg-white/90 text-red-500'
        }`}>
          {room.available ? 'Available' : 'Reserved'}
        </div>
        
        {room.type && (
          <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#8b6e3d] backdrop-blur-md text-white shadow-lg">
            {room.type}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-10">
        <div className="flex items-start justify-between mb-6">
          <div>
             <h3 className="font-serif font-bold text-slate-900 text-2xl group-hover:text-[#8b6e3d] transition-colors">{room.name}</h3>
          </div>
          <div className="text-right shrink-0">
            <span className="text-2xl font-bold text-[#8b6e3d] font-serif">₹{room.price}</span>
            <span className="text-[10px] text-slate-400 block uppercase tracking-widest font-bold">/ night</span>
          </div>
        </div>

        {room.description && (
          <p className="text-slate-500 text-sm mb-10 line-clamp-2 leading-relaxed font-light italic">"{room.description}"</p>
        )}

        <div className="flex flex-wrap gap-4 mb-10">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#fdfaf5] rounded-xl text-slate-600 border border-slate-100">
            <Users className="w-4 h-4 text-[#8b6e3d]" /> <span className="text-xs font-bold uppercase tracking-widest">Cap: {room.capacity}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-[#fdfaf5] rounded-xl text-slate-600 border border-slate-100">
            <Maximize className="w-4 h-4 text-[#8b6e3d]" /> <span className="text-xs font-bold uppercase tracking-widest">{room.size} ft²</span>
          </div>
        </div>

        <button
          disabled={!room.available}
          className="w-full flex items-center justify-center gap-3 bg-[#1a237e] hover:bg-[#8b6e3d] text-white text-[10px] font-bold uppercase tracking-widest py-5 rounded-2xl transition-all duration-500 disabled:opacity-30 shadow-xl group-hover:shadow-[#8b6e3d]/20"
        >
          View Residence <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
});

const RoomListingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await roomService.getRooms(); 
        setRooms(data);
      } catch (err) {
        setError('Our room catalog is currently offline. Please try again in a moment.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const filteredRooms = filter === 'All' ? rooms : rooms.filter(r => r.type === filter);

  if (loading) {
    return (
      <MainLayout hideSidebar>
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfaf5]">
          <div className="relative w-20 h-20">
             <div className="absolute inset-0 border-4 border-[#8b6e3d]/10 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-[#8b6e3d] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-8 text-[#8b6e3d] font-bold uppercase tracking-widest text-[10px]">Curating Catalog...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout hideSidebar>
      <PageTransition>
        <div className="min-h-screen bg-[#fdfaf5] pt-40 pb-40">
          <div className="max-w-7xl mx-auto px-6">

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
               <div>
                  <div className="flex items-center gap-3 mb-6">
                     <div className="h-px w-12 bg-[#8b6e3d]"></div>
                     <p className="text-[#8b6e3d] font-bold uppercase tracking-[0.4em] text-[10px]">The Signature Collection</p>
                  </div>
                  <h1 className="text-6xl md:text-8xl font-serif font-bold text-slate-900 leading-tight">Exquisite <br /> <span className="italic font-light text-[#8b6e3d]">Residences</span></h1>
               </div>
               
               <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex bg-white p-2 rounded-[2rem] shadow-sm border border-slate-100">
                     {['All', 'Standard', 'Deluxe', 'Suite'].map(t => (
                        <button 
                          key={t}
                          onClick={() => setFilter(t)}
                          className={`px-8 py-3.5 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${filter === t ? 'bg-[#1a237e] text-white shadow-xl' : 'text-slate-400 hover:text-slate-900'}`}
                        >
                           {t}
                        </button>
                     ))}
                  </div>
                  <button className="p-5 bg-white rounded-[1.5rem] shadow-sm border border-slate-100 hover:border-[#8b6e3d] text-slate-400 transition-all">
                     <SlidersHorizontal className="w-5 h-5" />
                  </button>
               </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-16 p-12 bg-red-50 border border-red-100 rounded-[3rem] text-red-600 text-sm text-center shadow-sm">
                <XCircle className="w-12 h-12 mx-auto mb-6 opacity-20" />
                <p className="font-bold tracking-widest uppercase text-xs">{error}</p>
              </div>
            )}

            {/* Content Area */}
            <div className="relative">
              {filteredRooms.length === 0 && !error ? (
                <div className="text-center py-40">
                   <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-10 border border-slate-100 shadow-xl">
                      <Search className="w-10 h-10 text-slate-200" />
                   </div>
                   <h3 className="text-3xl font-serif font-bold text-slate-900 mb-4">No matching residences</h3>
                   <p className="text-slate-400 italic max-w-sm mx-auto">"Every choice is a reflection of your refined taste. Try adjusting your preferences."</p>
                </div>
              ) : (
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredRooms.map((room) => (
                      <RoomCard key={room.id} room={room} onClick={(id) => navigate(`/rooms/${id}`)} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* Support Callout */}
            <div className="mt-48 p-20 bg-[#1a237e] rounded-[4rem] text-white flex flex-col lg:flex-row items-center justify-between gap-12 shadow-[0_50px_100px_rgba(0,0,0,0.2)] overflow-hidden relative border border-white/5">
               <div className="absolute top-0 right-0 p-40 opacity-5 pointer-events-none">
                  <MapPin className="w-96 h-96" />
               </div>
               <div className="relative z-10 text-center lg:text-left">
                  <h3 className="text-4xl font-serif font-bold mb-6">Personalized Concierge</h3>
                  <p className="text-blue-100/60 font-light max-w-xl text-lg italic leading-relaxed">Our master concierges are at your service 24/7 to curate a stay that perfectly aligns with your expectations.</p>
               </div>
               <a href="#" className="relative z-10 bg-[#8b6e3d] text-white px-16 py-6 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-[#7a6035] transition-all shadow-2xl scale-105">
                 Contact Concierge
               </a>
            </div>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default RoomListingPage;
