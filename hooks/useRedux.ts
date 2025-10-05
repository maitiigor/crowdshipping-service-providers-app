import { useCallback } from "react";
import type { DocumentInfo, PaymentInfo, PersonalInfo } from "../models";
import { useAppDispatch, useAppSelector } from "../store";
import {
  clearPin,
  decrementCountdown,
  setAuthenticated,
  setPin,
  setVerificationCode,
  setVerified,
  startVerificationCountdown,
} from "../store/slices/authSlice";
import {
  clearEditProfileError,
  closeAllSheets,
  nextEditProfileStep,
  previousEditProfileStep,
  setActiveSheet,
  setEditProfileError,
  setEditProfileLoading,
  setEditProfileStep,
} from "../store/slices/formsSlice";





// Authentication Hooks
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const updatePin = useCallback((pin: string) => {
    dispatch(setPin(pin));
  }, [dispatch]);

  const resetPin = useCallback(() => {
    dispatch(clearPin());
  }, [dispatch]);

  const updateVerificationCode = useCallback((code: string) => {
    dispatch(setVerificationCode(code));
  }, [dispatch]);

  const startCountdown = useCallback((seconds: number = 20) => {
    dispatch(startVerificationCountdown(seconds));
  }, [dispatch]);

  const tickCountdown = useCallback(() => {
    dispatch(decrementCountdown());
  }, [dispatch]);

  const authenticate = useCallback((isAuth: boolean) => {
    dispatch(setAuthenticated(isAuth));
  }, [dispatch]);

  const verify = useCallback((isVerified: boolean) => {
    dispatch(setVerified(isVerified));
  }, [dispatch]);

  return {
    ...auth,
    updatePin,
    resetPin,
    updateVerificationCode,
    startCountdown,
    tickCountdown,
    authenticate,
    verify,
  };
};

// Forms Hooks
export const useEditProfileForm = () => {
  const dispatch = useAppDispatch();
  const editProfile = useAppSelector((state) => state.forms.editProfile);
  const dropdownOptions = useAppSelector((state) => state.forms.dropdownOptions);
  const activeSheets = useAppSelector((state) => state.forms.activeSheets);

  const setStep = useCallback((step: number) => {
    dispatch(setEditProfileStep(step));
  }, [dispatch]);

  const nextStep = useCallback(() => {
    dispatch(nextEditProfileStep());
  }, [dispatch]);

  const previousStep = useCallback(() => {
    dispatch(previousEditProfileStep());
  }, [dispatch]);

  const setLoading = useCallback((loading: boolean) => {
    dispatch(setEditProfileLoading(loading));
  }, [dispatch]);

  const setError = useCallback((field: string, error: string) => {
    dispatch(setEditProfileError({ field, error }));
  }, [dispatch]);

  const clearError = useCallback((field: string) => {
    dispatch(clearEditProfileError(field));
  }, [dispatch]);

  const openSheet = useCallback((sheet: keyof typeof activeSheets) => {
    dispatch(setActiveSheet({ sheet, isOpen: true }));
  }, [dispatch]);

  const closeSheet = useCallback((sheet: keyof typeof activeSheets) => {
    dispatch(setActiveSheet({ sheet, isOpen: false }));
  }, [dispatch]);

  const closeAllActionSheets = useCallback(() => {
    dispatch(closeAllSheets());
  }, [dispatch]);

  return {
    editProfile,
    dropdownOptions,
    activeSheets,
    setStep,
    nextStep,
    previousStep,
    setLoading,
    setError,
    clearError,
    openSheet,
    closeSheet,
    closeAllActionSheets,
  };
};