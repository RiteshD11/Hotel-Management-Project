import api from './api';

// Map backend room fields → frontend fields
// Backend: { roomId, roomName, roomType, roomRent, roomCapacity, roomSize, roomDescription, feature[], total, imageName }
const mapRoom = (r) => ({
  id: r.roomId,
  name: r.roomName,
  type: r.roomType || 'Standard',
  price: r.roomRent,
  description: r.roomDescription || '',
  capacity: r.roomCapacity || 2,
  size: r.roomSize || 0,
  amenities: Array.isArray(r.feature)
    ? r.feature.map((f) => f.featureName).filter(Boolean)
    : [],
  available: (r.total ?? 1) > 0,
  total: r.total ?? 1,
  image: r.imageName || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800',
});

export const roomService = {
  // GET /allrooms → List<room>
  getRooms: async () => {
    const res = await api.get('/allrooms');
    return res.data.map(mapRoom);
  },

  // GET /admin/findroom/{id} → room
  getRoomDetails: async (id) => {
    const res = await api.get(`/admin/findroom/${id}`);
    return mapRoom(res.data);
  },

  // POST /admin/addroom → String  (ADMIN only)
  addRoom: async (roomData) => {
    const res = await api.post('/admin/addroom', roomData);
    return res.data;
  },

  // POST /admin/updateroom → String (ADMIN only)
  updateRoom: async (roomData) => {
    const res = await api.post('/admin/updateroom', roomData);
    return res.data;
  },

  // GET /admin/deleteroom/{id} → String  (ADMIN only)
  deleteRoom: async (id) => {
    const res = await api.get(`/admin/deleteroom/${id}`);
    return res.data;
  },
};
