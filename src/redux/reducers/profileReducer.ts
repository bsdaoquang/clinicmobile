import {createSlice} from '@reduxjs/toolkit';

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: {},
  },
  reducers: {
    addProfile: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const profileReducer = profileSlice.reducer;
export const {addProfile} = profileSlice.actions;
export const profileSelector = (state: any) => state.profileReducer.data;
