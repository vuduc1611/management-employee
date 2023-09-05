// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // isAuthenticated: false,
    username: null,
    // token: null,
  },
  reducers: {
    login: (state, action) => {
      // state.isAuthenticated = true;
      state.username = action.payload;
      // state.token = action.payload;
    },
    logout: (state) => {
      // state.isAuthenticated = false;
      state.username = null;
      // state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
