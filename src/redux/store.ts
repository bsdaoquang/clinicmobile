import { configureStore } from '@reduxjs/toolkit';
import { appReducer } from './reducers/appReducer';
import { authReducer } from './reducers/authReducer';

const store = configureStore({
  reducer: {
    appReducer,
    authReducer
  }
});

export default store;