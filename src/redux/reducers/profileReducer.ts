import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice} from '@reduxjs/toolkit';
import {localNames} from '../../constants/localNames';

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: {},
  },
  reducers: {
    addProfile: (state, action) => {
      state.data = action.payload;
      updateStore(action.payload);
    },
  },
});

export const profileReducer = profileSlice.reducer;
export const {addProfile} = profileSlice.actions;
export const profileSelector = (state: any) => state.profileReducer.data;

const updateStore = async (data: any) => {
  await AsyncStorage.setItem(localNames.profile, JSON.stringify(data));
};
