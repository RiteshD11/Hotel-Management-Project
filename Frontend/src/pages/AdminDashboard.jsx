import React, { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { 
  Users, Bed, UserPlus, Shield, Plus, Trash2, Home, Edit2, 
  Calendar, CheckCircle, Clock, ChevronRight, Filter, Search, Camera
} from 'lucide-react';
import { roomService } from '../services/roomService';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Sync tab with URL
  const getTabFromPath = (path) => {
    if (path.includes('/admin/rooms')) return 'rooms';
    if (path.includes('/admin/bookings')) return 'bookings';
    if (path.includes('/admin/users')) return 'users';
    if (path.includes('/admin/add-room')) return 'addRoom';
    if (path.includes('/admin/add-admin')) return 'addAdmin';
    return 'rooms';
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname)); 
  
  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);
  const [rooms, setRooms] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [allFeatures, setAllFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin Form State
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  // Add/Edit Room State
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [roomForm, setRoomForm] = useState({
    roomName: '',
    roomType: 'Standard',
    roomRent: '',
    roomCapacity: '',
    roomSize: '',
    roomDescription: '',
    imageName: '',
    total: 1,
    selectedFeatures: [] // IDs of selected features
  });
  const [roomError, setRoomError] = useState('');
  const [roomSuccess, setRoomSuccess] = useState('');
  const [roomLoading, setRoomLoading] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/rooms');
    }
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'rooms') {
        const data = await roomService.getRooms();
        setRooms(data);
      } else if (activeTab === 'users') {
        const data = await adminService.getUsers();
        setUsersList(data);
      } else if (activeTab === 'bookings') {
        const data = await adminService.getAllBookings();
        setAllBookings(data);
      } else if (activeTab === 'addRoom') {
        const data = await adminService.getFeatures();
        setAllFeatures(data);
      }
    } catch (error) {
      console.error(`Failed to fetch ${activeTab}`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // ─── Image Upload ────────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRoomForm({ ...roomForm, imageName: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // ─── Add Admin ────────────────────────────────────────────────────────────
  const handleAdminRegistration = async (e) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');

    if (adminForm.password !== adminForm.confirmPassword) {
      return setAdminError('Passwords do not match');
    }
    if (adminForm.password.length < 6) {
      return setAdminError('Password must be at least 6 characters long');
    }

    setAdminLoading(true);
    try {
      await adminService.registerAdmin({
        userName: adminForm.name,
        email: adminForm.email,
        password: adminForm.password
      });

      setAdminSuccess('Admin account created successfully!');
      setAdminForm({ name: '', email: '', password: '', confirmPassword: '' });
      setTimeout(() => setActiveTab('users'), 2000);
    } catch (err) {
      setAdminError(err.response?.data || 'Failed to create admin account');
    } finally {
      setAdminLoading(false);
    }
  };

  // ─── Add / Edit Room ─────────────────────────────────────────────────────────────
  const handleSaveRoom = async (e) => {
    e.preventDefault();
    setRoomError('');
    setRoomSuccess('');
    setRoomLoading(true);
    try {
      const roomPayload = {
        roomName: roomForm.roomName,
        roomType: roomForm.roomType,
        roomRent: parseFloat(roomForm.roomRent),
        roomCapacity: parseInt(roomForm.roomCapacity) || 2,
        roomSize: parseInt(roomForm.roomSize) || 350,
        roomDescription: roomForm.roomDescription,
        imageName: roomForm.imageName,
        total: parseInt(roomForm.total) || 1,
        feature: roomForm.selectedFeatures.map(id => ({ featureId: id }))
      };

      if (editingRoomId) {
        roomPayload.roomId = editingRoomId;
        await roomService.updateRoom(roomPayload);
        setRoomSuccess('Room updated successfully!');
      } else {
        await roomService.addRoom(roomPayload);
        setRoomSuccess('Room added successfully!');
      }

      setRoomForm({
        roomName: '', roomType: 'Standard', roomRent: '',
        roomCapacity: '', roomSize: '', roomDescription: '', imageName: '', total: 1,
        selectedFeatures: []
      });
      setEditingRoomId(null);
      fetchData(); 
      setTimeout(() => setActiveTab('rooms'), 1500);
    } catch (err) {
      if (err.response?.status === 403) {
        setRoomError('Access Denied: You are logged in as a standard User. Please register an Admin account or log in with administrator credentials.');
      } else {
        setRoomError(err.response?.data || 'Failed to save room. Check all required fields.');
      }
    } finally {
      setRoomLoading(false);
    }
  };

  const startEditRoom = (room) => {
    setEditingRoomId(room.id);
    setRoomForm({
      roomName: room.name,
      roomType: room.type,
      roomRent: room.price,
      roomCapacity: room.capacity,
      roomSize: room.size,
      roomDescription: room.description,
      imageName: room.image,
      total: room.total,
      selectedFeatures: Array.isArray(room.feature) ? room.feature.map(f => f.featureId) : []
    });
    setRoomError('');
    setRoomSuccess('');
    setActiveTab('addRoom');
  };

  const cancelEdit = () => {
    setEditingRoomId(null);
    setRoomForm({
      roomName: '', roomType: 'Standard', roomRent: '',
      roomCapacity: '', roomSize: '', roomDescription: '', imageName: '', total: 1,
      selectedFeatures: []
    });
    setActiveTab('rooms');
  };

  // ─── Delete Room ──────────────────────────────────────────────────────────
  const handleDeleteRoom = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await roomService.deleteRoom(id);
      fetchData();
    } catch (err) {
      alert('Failed to delete room. It might be booked.');
    }
  };

  // ─── UI Components ────────────────────────────────────────────────────────
  const TabButton = ({ id, icon: Icon, label }) => {
    const pathMap = {
      rooms: '/admin/rooms',
      bookings: '/admin/bookings',
      users: '/admin/users',
      addRoom: '/admin/add-room',
      addAdmin: '/admin/add-admin'
    };

    return (
      <button
        onClick={() => {
          if (id !== 'addRoom') {
            setEditingRoomId(null);
            setRoomForm({
              roomName: '', roomType: 'Standard', roomRent: '',
              roomCapacity: '', roomSize: '', roomDescription: '', imageName: '', total: 1,
              selectedFeatures: []
            });
          }
          if (pathMap[id]) {
            navigate(pathMap[id]);
          } else {
            setActiveTab(id);
          }
        }}
        className={`flex items-center gap-2 px-6 py-3.5 rounded-full font-serif font-bold text-sm transition-all duration-300 ${
          activeTab === id 
            ? 'bg-[#8b6e3d] text-white shadow-lg scale-105' 
            : 'bg-white text-slate-600 hover:bg-[#fdfaf5] border border-slate-200'
        }`}
      >
        <Icon className="w-4 h-4" /> {label}
      </button>
    );
  };

  const StatusBadge = ({ status }) => (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
      status ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
    }`}>
      {status ? 'Active' : 'Pending'}
    </span>
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#fdfaf5] pb-20">
        
        {/* Hero Header */}
        <div className="bg-[#1a237e] text-white py-24 px-6 mb-16 relative overflow-hidden">
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8b6e3d] rounded-full blur-[150px] opacity-20 -mr-64 -mt-64"></div>
           <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400 rounded-full blur-[120px] opacity-10 -ml-48 -mb-48"></div>
           <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#8b6e3d 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

           <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-4 mb-6">
                 <div className="h-px w-10 bg-[#8b6e3d]"></div>
                 <p className="text-[#8b6e3d] font-bold uppercase tracking-[0.5em] text-[10px]">Royal Concierge Portal</p>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">The <span className="italic font-light text-[#8b6e3d]">Registry</span></h1>
              <p className="text-blue-100/60 text-xl font-light tracking-wide max-w-2xl italic leading-relaxed">
                "Upholding the legacy of timeless hospitality through precise orchestration of the heritage residences."
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-4 mb-12 justify-center lg:justify-start">
            <TabButton id="rooms" icon={Home} label="Manage Rooms" />
            <TabButton id="bookings" icon={Calendar} label="All Bookings" />
            <TabButton id="users" icon={Users} label="Guest List" />
            <TabButton id="addRoom" icon={editingRoomId ? Edit2 : Plus} label={editingRoomId ? "Edit Suite" : "Add New Suite"} />
            <TabButton id="addAdmin" icon={Shield} label="Register Admin" />
          </div>

          <AnimatePresence mode="wait">
            {/* ── MANAGE ROOMS ── */}
            {activeTab === 'rooms' && (
              <motion.div 
                key="rooms"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {loading ? (
                  Array(6).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-3xl h-96 animate-pulse border border-slate-100"></div>
                  ))
                ) : rooms.map((room) => (
                  <div key={room.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 group">
                    <div className="relative h-64 overflow-hidden">
                      <img src={room.image} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-6 right-6">
                        <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-[#8b6e3d] uppercase tracking-widest shadow-sm">
                          {room.type}
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-serif font-bold text-slate-900">{room.name}</h3>
                        <p className="text-[#8b6e3d] font-bold">₹{room.price}</p>
                      </div>
                      <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed italic">"{room.description}"</p>
                      <div className="flex items-center gap-6 mb-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                         <span className="flex items-center gap-2"><Users className="w-4 h-4 text-[#8b6e3d]" /> Cap: {room.capacity}</span>
                         <span className="flex items-center gap-2"><Bed className="w-4 h-4 text-[#8b6e3d]" /> Left: {room.total}</span>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => startEditRoom(room)} className="flex-1 py-3 bg-slate-50 hover:bg-[#8b6e3d] hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300">
                          Edit Suite
                        </button>
                        <button onClick={() => handleDeleteRoom(room.id, room.name)} className="px-4 py-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* ── ALL BOOKINGS ── */}
            {activeTab === 'bookings' && (
              <motion.div 
                key="bookings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden"
              >
                <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-[#1a237e]/5">
                   <h2 className="text-2xl font-serif font-bold text-slate-900">Live Reservations</h2>
                   <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Filter className="w-4 h-4" /> Filter by Date
                   </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 bg-slate-50">
                        <th className="px-10 py-6">Guest</th>
                        <th className="px-10 py-6">Suite</th>
                        <th className="px-10 py-6">Period</th>
                        <th className="px-10 py-6">Status</th>
                        <th className="px-10 py-6">Bill</th>
                        <th className="px-10 py-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {loading ? (
                        Array(5).fill(0).map((_, i) => (
                          <tr key={i} className="animate-pulse"><td colSpan="6" className="h-16 bg-slate-50/50"></td></tr>
                        ))
                      ) : allBookings.length === 0 ? (
                        <tr><td colSpan="6" className="p-20 text-center text-slate-400 italic">No bookings recorded yet.</td></tr>
                      ) : allBookings.map((bk) => (
                        <tr key={bk.orderId} className="hover:bg-[#fdfaf5] transition-colors">
                          <td className="px-10 py-8">
                             <p className="font-bold text-slate-900">{bk.user?.userName}</p>
                             <p className="text-xs text-slate-400">{bk.user?.email}</p>
                          </td>
                          <td className="px-10 py-8">
                             <p className="font-bold text-[#8b6e3d]">{bk.roomm?.roomName}</p>
                             <p className="text-[10px] text-slate-400 uppercase font-bold">Room #{bk.roomNo}</p>
                          </td>
                          <td className="px-10 py-8 font-medium text-sm text-slate-600">
                             {new Date(bk.checkIn).toLocaleDateString()} - {new Date(bk.checkOut).toLocaleDateString()}
                          </td>
                          <td className="px-10 py-8">
                             <StatusBadge status={bk.status} />
                          </td>
                          <td className="px-10 py-8 font-serif font-bold text-slate-900">
                             ₹{bk.roomm?.roomRent || 0}
                          </td>
                          <td className="px-10 py-8 text-right">
                             {bk.status && (
                               <button 
                                 onClick={() => {
                                   if(window.confirm('Forcibly checkout this guest?')) {
                                     adminService.checkoutBooking(bk.orderId).then(() => fetchData());
                                   }
                                 }}
                                 className="text-[9px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors border-b border-red-100"
                               >
                                 Force Checkout
                               </button>
                             )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── GUEST LIST ── */}
            {activeTab === 'users' && (
              <motion.div 
                key="users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {loading ? (
                  Array(8).fill(0).map((_, i) => (
                    <div key={i} className="bg-white rounded-3xl h-40 animate-pulse"></div>
                  ))
                ) : usersList.map((usr) => (
                  <div key={usr.userId} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                     <div className="w-12 h-12 bg-[#8b6e3d]/10 rounded-2xl flex items-center justify-center mb-6 text-[#8b6e3d] group-hover:bg-[#8b6e3d] group-hover:text-white transition-all">
                        <Users className="w-6 h-6" />
                     </div>
                     <h4 className="font-serif font-bold text-lg text-slate-900 mb-1">{usr.userName}</h4>
                     <p className="text-xs text-slate-400 mb-4">{usr.email}</p>
                     <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                       usr.role === 'ADMIN' ? 'bg-[#1a237e] text-white' : 'bg-slate-100 text-slate-600'
                     }`}>
                       {usr.role}
                     </span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* ── ADD / EDIT SUITE ── */}
            {activeTab === 'addRoom' && (
              <motion.div 
                key="addRoom"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden"
              >
                <div className="p-12">
                   <div className="flex justify-between items-center mb-12">
                      <div>
                        <h2 className="text-3xl font-serif font-bold text-slate-900">{editingRoomId ? 'Refine Suite' : 'Introduce New Suite'}</h2>
                        <p className="text-slate-400 italic">"Curating the standard for modern luxury."</p>
                      </div>
                      {editingRoomId && (
                        <button onClick={cancelEdit} className="text-[#8b6e3d] font-bold text-xs uppercase tracking-widest hover:underline">
                          Cancel Modification
                        </button>
                      )}
                   </div>

                   {roomError && <div className="mb-8 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100">{roomError}</div>}
                   {roomSuccess && <div className="mb-8 p-4 bg-green-50 text-green-700 text-sm rounded-2xl border border-green-100">{roomSuccess}</div>}

                   <form onSubmit={handleSaveRoom} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 px-2">Suite Name</label>
                           <input type="text" required value={roomForm.roomName} onChange={(e) => setRoomForm({...roomForm, roomName: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#8b6e3d] outline-none text-slate-900 font-medium" placeholder="Deluxe Ocean Suite" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 px-2">Suite Category</label>
                           <select value={roomForm.roomType} onChange={(e) => setRoomForm({...roomForm, roomType: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#8b6e3d] outline-none text-slate-900 font-medium appearance-none">
                              <option value="Standard">Standard</option>
                              <option value="Deluxe">Deluxe</option>
                              <option value="Royal">Royal Suite</option>
                              <option value="Presidential">Presidential</option>
                           </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 px-2">Rate / Night</label>
                           <input type="number" required value={roomForm.roomRent} onChange={(e) => setRoomForm({...roomForm, roomRent: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#8b6e3d] outline-none text-slate-900 font-medium" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 px-2">Inventory Count</label>
                           <input type="number" required value={roomForm.total} onChange={(e) => setRoomForm({...roomForm, total: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#8b6e3d] outline-none text-slate-900 font-medium" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 px-2">Guest Capacity</label>
                           <input type="number" required value={roomForm.roomCapacity} onChange={(e) => setRoomForm({...roomForm, roomCapacity: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#8b6e3d] outline-none text-slate-900 font-medium" />
                        </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 px-2">Suite Portrait</label>
                         <div className="relative group">
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="suite-image" />
                            <label htmlFor="suite-image" className="cursor-pointer block w-full h-48 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#8b6e3d] transition-all flex flex-col items-center justify-center gap-4 bg-slate-50/50">
                               {roomForm.imageName ? (
                                  <div className="relative w-full h-full p-2">
                                     <img src={roomForm.imageName} className="w-full h-full object-cover rounded-xl" alt="Preview" />
                                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity rounded-xl">
                                        <Camera className="w-8 h-8" />
                                     </div>
                                  </div>
                               ) : (
                                  <>
                                     <Camera className="w-10 h-10 text-slate-300" />
                                     <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Upload Premium Image</span>
                                  </>
                               )}
                            </label>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 px-2">Select Facilities</label>
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {allFeatures.map(f => (
                               <label key={f.featureId} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-white border border-transparent hover:border-[#8b6e3d]/20 transition-all group">
                                  <input 
                                    type="checkbox" 
                                    className="w-5 h-5 accent-[#8b6e3d]"
                                    checked={roomForm.selectedFeatures.includes(f.featureId)}
                                    onChange={(e) => {
                                       const updated = e.target.checked 
                                          ? [...roomForm.selectedFeatures, f.featureId]
                                          : roomForm.selectedFeatures.filter(id => id !== f.featureId);
                                       setRoomForm({...roomForm, selectedFeatures: updated});
                                    }}
                                  />
                                  <span className="text-xs font-bold text-slate-700 group-hover:text-[#8b6e3d] transition-colors">{f.featureName}</span>
                               </label>
                            ))}
                         </div>
                         {allFeatures.length === 0 && <p className="text-[10px] text-slate-400 italic px-2">No facilities defined in system.</p>}
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 px-2">Narrative</label>
                         <textarea required rows="4" value={roomForm.roomDescription} onChange={(e) => setRoomForm({...roomForm, roomDescription: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#8b6e3d] outline-none text-slate-900 font-medium resize-none" placeholder="Craft a compelling description..." />
                      </div>

                      <button type="submit" disabled={roomLoading} className="w-full py-5 bg-[#8b6e3d] text-white rounded-2xl font-serif font-bold text-xl hover:bg-[#7a6035] shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-60">
                        {roomLoading ? 'Publishing...' : (editingRoomId ? 'Update Masterpiece' : 'Publish to Catalog')}
                      </button>
                   </form>
                </div>
              </motion.div>
            )}

            {/* ── REGISTER ADMIN ── */}
            {activeTab === 'addAdmin' && (
              <motion.div 
                key="addAdmin"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl mx-auto bg-white rounded-[3rem] p-12 shadow-xl border border-slate-100"
              >
                 <div className="text-center mb-12">
                    <Shield className="w-16 h-16 text-[#1a237e] mx-auto mb-6 p-4 bg-blue-50 rounded-3xl" />
                    <h2 className="text-3xl font-serif font-bold text-slate-900">Privileged Access</h2>
                    <p className="text-slate-400 italic mt-2">Grant administrative authority to new personnel.</p>
                 </div>

                 {adminError && <div className="mb-8 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100">{adminError}</div>}
                 {adminSuccess && <div className="mb-8 p-4 bg-green-50 text-green-700 text-sm rounded-2xl border border-green-100">{adminSuccess}</div>}

                 <form onSubmit={handleAdminRegistration} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 px-2">Official Name</label>
                       <input type="text" required value={adminForm.name} onChange={(e) => setAdminForm({...adminForm, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a237e] outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 px-2">Official Email</label>
                       <input type="email" required value={adminForm.email} onChange={(e) => setAdminForm({...adminForm, email: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a237e] outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 px-2">Secure Key</label>
                          <input type="password" required value={adminForm.password} onChange={(e) => setAdminForm({...adminForm, password: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a237e] outline-none" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400 px-2">Verify Key</label>
                          <input type="password" required value={adminForm.confirmPassword} onChange={(e) => setAdminForm({...adminForm, confirmPassword: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1a237e] outline-none" />
                       </div>
                    </div>
                    <button type="submit" disabled={adminLoading} className="w-full py-5 bg-[#1a237e] text-white rounded-2xl font-serif font-bold text-lg hover:bg-blue-900 transition-all shadow-lg mt-4 disabled:opacity-60">
                       {adminLoading ? 'Authenticating...' : 'Authorize Personnel'}
                    </button>
                 </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
