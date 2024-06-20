import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: 'app',
  initialState: {
    data: {}
  },
  reducers: {
    addAppsettings: (state, action) => {
      state.data = action.payload;
    }
  }
});

export const appReducer = slice.reducer;
export const { addAppsettings } = slice.actions;
export const appSettings = (state: any) => state.appReducer.data;