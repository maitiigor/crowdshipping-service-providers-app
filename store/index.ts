import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import airTripReducer from "./slices/airTripSlice";
import appReducer from "./slices/appSlice";
import authReducer from "./slices/authSlice";
import conversationReducer from "./slices/conversationSlice";
import countryReducer from "./slices/countrySlice";
import formsReducer from "./slices/formsSlice";
import groundTripReducer from "./slices/groundTripSlice";
import marineTripReducer from "./slices/marineTripSlice";
import notificationReducer from "./slices/notificationSlice";
import paymentReducer from "./slices/paymentSlice";
import profileReducer from "./slices/profileSlice";
import tripManagementReducer from "./slices/tripManagementSlice";
import vechileReducer from "./slices/vechileSlice";
import walletReducer from "./slices/walletSlice";
import settingReducer from "./slices/settingSlice";
import reportReducer from "./slices/reportSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    profile: profileReducer,
    auth: authReducer,
    airTrip: airTripReducer,
    marineTrip: marineTripReducer,
    payment: paymentReducer,
    report: reportReducer,
    wallet: walletReducer,
    setting: settingReducer,
    groundTrip: groundTripReducer,
    country: countryReducer,
    notification: notificationReducer,
    conversation: conversationReducer,
    tripManagement: tripManagementReducer,
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
