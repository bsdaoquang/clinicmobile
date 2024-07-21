import { createSlice } from "@reduxjs/toolkit";

const posisionSlice = createSlice({
  name: 'posision',
  initialState: {
    data: {

    }
  },
  reducers: {
    addPosision: (state, action) => {
      state.data = action.payload;
    }
  }
});

export const positionReducer = posisionSlice.reducer;
export const { addPosision } = posisionSlice.actions;

export const positionSelector = (state: any) => state.positionReducer.data;