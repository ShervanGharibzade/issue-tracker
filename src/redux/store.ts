import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";

// A factory (instead of a module singleton) keeps state from leaking between
// server-side requests.
export const makeStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
