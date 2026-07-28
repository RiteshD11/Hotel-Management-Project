import api from './api';

export const bookingService = {
  // POST /bookings/bookroom
  // Backend bookingclass: { roomId (int), checkin (Date), checkout (Date) }
  // JWT token automatically identifies the logged-in user on backend
  createBooking: async ({ roomId, checkin, checkout }) => {
    const res = await api.post('/bookings/bookroom', {
      roomId: parseInt(roomId),
      checkin,   // exact field name backend expects
      checkout,  // exact field name backend expects
    });
    return res.data; // returns String like "Order Placed Successfully\nYour Order Id is X"
  },

  // POST /bookings/checkoutroom/{orderId}
  checkoutBooking: async (orderId) => {
    const res = await api.post(`/bookings/checkoutroom/${orderId}`);
    return res.data;
  },

  // GET /bookings/my-bookings
  getMyBookings: async () => {
    const res = await api.get('/bookings/my-bookings');
    return res.data;
  },
};
