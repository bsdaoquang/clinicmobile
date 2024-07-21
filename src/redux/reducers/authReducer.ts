import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    data: {
      uid: '',
      accesstoken: ''
    },

  },
  reducers: {
    login: (state, action) => {
      state.data = action.payload;
    },
    logout: (state, action) => {
      state.data = {
        uid: '',
        accesstoken: ''
      };
    }
  }
});

export const authReducer = authSlice.reducer;
export const { login, logout } = authSlice.actions;
export const authSelector = (state: any) => state.authReducer.data;