import { configureStore } from '@reduxjs/toolkit';
import { appReducer } from './reducers/appReducer';

const store = configureStore({
  reducer: {
    appReducer
  }
});

export default store;