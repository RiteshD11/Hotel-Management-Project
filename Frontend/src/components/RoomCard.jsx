import React from 'react';
import { Link } from 'react-router-dom';
import { Wifi, Coffee, Wind, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const RoomCard = ({ room }) => {
  const { id, name, type, price, image, amenities = [], available } = room;

  const getIcon = (amenity) => {
    if (!amenity) return null;
    const key = amenity.toLowerCase();
    if (key.includes('wifi')) return <Wifi className="w-4 h-4" />;
    if (key.includes('breakfast') || key.includes('mini bar')) return <Coffee className="w-4 h-4" />;
    if (key.includes('ac')) return <Wind className="w-4 h-4" />;
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-500 transition-all duration-500"
    >
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-dark/20 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
        <img 
          src={image || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-md border ${
            available ? 'bg-white/90 text-slate-900 border-white/20' : 'bg-red-500/90 text-white border-red-500/20'
          }`}>
            {available ? 'Available' : 'Booked'}
          </span>
          <span className="px-3 py-1 bg-dark/80 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider border border-white/10">
            {type}
          </span>
        </div>
      </div>
      
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">{name}</h3>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-500 dark:text-primary-400">${price}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">per night</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {amenities.map((amenity, idx) => (
            <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-sm text-xs font-medium border border-slate-100 dark:border-slate-700">
              {getIcon(amenity)}
              <span>{amenity}</span>
            </div>
          ))}
        </div>

        <Link
          to={`/rooms/${id}`}
          className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold uppercase tracking-widest text-sm hover:bg-primary-500 dark:hover:bg-primary-400 hover:text-white transition-all duration-300 group/btn"
        >
          <span>Reserve Room</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default RoomCard;
