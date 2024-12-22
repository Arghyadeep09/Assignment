// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // Stores user information
    rememberMe: false, // Tracks "Remember Me" state
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Update the user
    },
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload; // Update the rememberMe state
    },
    clearUser: (state) => {
      state.user = null; // Clear user information
      state.rememberMe = false; // Reset rememberMe state
    },
  },
});

export const { setUser, clearUser, setRememberMe } = authSlice.actions;
export default authSlice.reducer;

