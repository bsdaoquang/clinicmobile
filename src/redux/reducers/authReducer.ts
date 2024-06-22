import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: 'auth',
  initialState: {
    data: {}
  },
  reducers: {
    addAuth: (state, action) => {
      state.data = action.payload;
    }
  }
});

export const authReducer = slice.reducer;
export const { addAuth } = slice.actions;
export const authSelector = (state: any) => state.authReducer.data;