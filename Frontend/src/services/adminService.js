import api from './api';

export const adminService = {
  // Fetch all users
  getUsers: async () => {
    const res = await api.get('/admin/viewallusers');
    return res.data;
  },

  // Fetch all bookings
  getAllBookings: async () => {
    const res = await api.get('/bookings/all');
    return res.data;
  },

  // Register new admin
  registerAdmin: async (adminData) => {
    const res = await api.post('/auth/register-admin', adminData);
    return res.data;
  },

  // Fetch all features
  getFeatures: async () => {
    const res = await api.get('/admin/allfeatures');
    return res.data;
  },

  // Checkout a booking
  checkoutBooking: async (orderId) => {
    const res = await api.post(`/bookings/checkoutroom/${orderId}`);
    return res.data;
  }
};
