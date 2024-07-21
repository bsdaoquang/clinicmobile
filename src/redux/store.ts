import { configureStore } from "@reduxjs/toolkit";
import { positionReducer } from "./reducers/positionReducer";
import { authReducer } from "./reducers/authReducer";

const store = configureStore({
  reducer: {
    positionReducer,
    authReducer
  }
});

export default store;