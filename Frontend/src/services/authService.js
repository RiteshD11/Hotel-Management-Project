import api from './api';

export const authService = {
  // Step 1 — POST /auth/send-otp   body: { email }
  sendOtp: async (email) => {
    const res = await api.post('/auth/send-otp', { email });
    return res.data;
  },

  // Step 2 — POST /auth/verify-otp  body: { email, otp }
  // Returns { status: "success", token } or { status: "error", message }
  verifyOtp: async (email, otp) => {
    const res = await api.post('/auth/verify-otp', { email, otp });
    return res.data;
  },

  // Step 3 — POST /auth/set-profile  body: User model fields
  // { userName, email, password, contact, adharNumber, gender }
  // gender must be one of: MALE | FEMALE | OTHER
  setProfile: async ({ name, email, password, contact, adharNumber, gender }) => {
    const res = await api.post('/auth/set-profile', {
      userName: name,
      email,
      password,
      contact,
      adharNumber,
      gender, // "MALE" | "FEMALE" | "OTHER"
    });
    return res.data;
  },

  // POST /auth/login  body: { email, password }
  // Returns { token, email, userName, role }
  login: async ({ email, password }) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
};
