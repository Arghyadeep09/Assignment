import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null, // Stores user information
    rememberMe: false, // Tracks "Remember Me" state
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; 
    },
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser, setRememberMe } = authSlice.actions;
export default authSlice.reducer; // Export the reducer directly
export { authSlice }; // Named export for the slice itself
