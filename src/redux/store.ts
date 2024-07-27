import {configureStore} from '@reduxjs/toolkit';
import {positionReducer} from './reducers/positionReducer';
import {authReducer} from './reducers/authReducer';
import {profileReducer} from './reducers/profileReducer';

const store = configureStore({
  reducer: {
    positionReducer,
    authReducer,
    profileReducer,
  },
});

export default store;
