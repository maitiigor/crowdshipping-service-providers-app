import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import appReducer from "./slices/appSlice";
import authReducer from "./slices/authSlice";
import formsReducer from "./slices/formsSlice";
import profileReducer from "./slices/profileSlice";
import airTripReducer from "./slices/airTripSlice";
import marineTripReducer from "./slices/marineTripSlice";
import vechileReducer from "./slices/vechileSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    profile: profileReducer,
    auth: authReducer,
    airTrip: airTripReducer,
    marineTrip: marineTripReducer,
    vechile: vechileReducer,
    forms: formsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setLastVerificationAttempt'],
        ignoredPaths: ['auth.lastVerificationAttempt'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
