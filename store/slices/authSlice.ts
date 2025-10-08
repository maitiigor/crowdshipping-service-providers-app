import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient, { setAuthToken } from "../../lib/api/client";
import { ApiError, ApiResponse, AuthState, ForgotPasswordRequest, LoginFormValues, OTPVerificationRequest, RegistrationPayload, ResendOTPRequest, ResetPasswordRequest, User, UserProfile } from "../../models";



const initialState: AuthState = {
    isAuthenticated: false,
    email: "",
    pin: "",
    hasLaunched: false,
    isVerified: false,
    verificationCode: "",
    verificationCountdown: 0,
    lastVerificationAttempt: undefined,
    loginError: undefined,
    loading: false,
    success: false,
    error: null,
    token: null,
    user: {
        id: "",
        email: "",
        fullName: "",
        lastLogin: "",
        phoneNumber: "",
        profilePicUrl: null,
        role: "",
        kycStatus: "",
        status: "",
    },
    resetToken: "",
    userProfile: {
        _id: "",
        deviceTokens: [],
        email: "",
        fullName: "",
        isVerfied: false,
        phoneNumber: "",
        profile: {
            // _id: "",
            location: {
                lat: 0,
                lng: 0,
                address: "",
            },
            address: "",
            city: "",
            country: "",
            gender: "",
            profilePicUrl: "",
            state: "",
        },
        profileId: "",
        role: "",
        status: "",
        userId: "",
        wallet: {
            _id: "",
            availableBalance: 0,
            balance: 0,
            walletId: ""
        },
        walletId: ""
        //  profileCompletion: 0,
        //isOnboardingComplete: false,
    },

};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },

        setAuthenticated(state, action: PayloadAction<boolean>) {
            state.isAuthenticated = action.payload;
        },

        setHasLaunched(state, action: PayloadAction<boolean>) {
            state.hasLaunched = action.payload;
        },
        setEmail(state, action: PayloadAction<string>) {
            state.email = action.payload;
        },
        setPin(state, action: PayloadAction<string>) {
            state.pin = action.payload;
        },
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
        setUserProfile(state, action: PayloadAction<UserProfile>) {
            state.userProfile = action.payload;

            AsyncStorage.setItem("userProfile", JSON.stringify(state.userProfile));
        },
        clearPin(state) {
            state.pin = "";
        },
        setVerified(state, action: PayloadAction<boolean>) {
            state.isVerified = action.payload;
        },
        setVerificationCode(state, action: PayloadAction<string>) {
            state.verificationCode = action.payload;
        },
        setVerificationCountdown(state, action: PayloadAction<number>) {
            state.verificationCountdown = action.payload;
        },
        decrementCountdown(state) {
            if (state.verificationCountdown > 0) {
                state.verificationCountdown -= 1;
            }
        },
        setLastVerificationAttempt(state, action: PayloadAction<Date>) {
            state.lastVerificationAttempt = action.payload;
        },
        startVerificationCountdown(state, action: PayloadAction<number>) {
            state.verificationCountdown = action.payload;
            state.lastVerificationAttempt = new Date();
        },
        setLoginError(state, action: PayloadAction<string | undefined>) {
            state.loginError = action.payload;
        },
        clearLoginError(state) {
            state.loginError = undefined;
        },
        resetAuth(state) {
            return initialState;
        },
        logout(state) {
            AsyncStorage.removeItem("user");
            state.isAuthenticated = false;
            state.email = "";
            state.pin = "";
            state.isVerified = false;
            state.verificationCode = "";
            state.verificationCountdown = 0;
            state.loginError = undefined;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.userProfile = action.payload.data;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

            }).addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.user = {
                    id: "",
                    email: "",
                    fullName: "",
                    lastLogin: "",
                    phoneNumber: "",
                    profilePicUrl: null,
                    kycStatus: "",
                    role: "",
                    status: "",
                };
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                console.log("user info", action.payload.data.user);
                state.user = action.payload.data.user;
                state.userProfile._id = state.user.id
                state.userProfile.email = state.user.email,
                    state.userProfile.fullName = state.user.fullName,
                    state.userProfile.role = state.user.role
                state.userProfile.status = state.user.status
                state.userProfile.phoneNumber = state.user.phoneNumber,
                    state.token = action.payload.data.token
                const match = action.payload.data.user.phoneNumber.match(/\(\+?(\d+)\)\s*(\d+)/);;
                setAuthToken(action.payload.data.token);

                // state.userProfile.personalInfo.countryCode = match && match[1] ? match[1] : "";
                //state.userProfile.personalInfo.phoneNumber = match && match[2] ? match[2] : "";
                state.isAuthenticated = true;
                AsyncStorage.setItem("user", JSON.stringify(state.user));


            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;

            })
            .addCase(verifyOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            }).addCase(verifyOTP.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                if (action.payload.data.resetType == "sign-up") {
                    state.isVerified = true;
                    state.user = action.payload.data.user
                    state.userProfile._id = state.user.id
                    state.userProfile.email = state.user.email,
                        state.userProfile.fullName = state.user.fullName,
                        state.userProfile.role = state.user.role
                    state.userProfile.status = state.user.status
                    state.userProfile.phoneNumber = state.user.phoneNumber,
                        state.token = action.payload.data.token
                    setAuthToken(action.payload.data.token);

                    state.isAuthenticated = true;
                    AsyncStorage.setItem("user", JSON.stringify(state.user));
                    AsyncStorage.setItem("token", action.payload.data.token);
                    AsyncStorage.setItem("userProfile", JSON.stringify(state.userProfile));
                    AsyncStorage.setItem("isVerified", "true");
                } else {
                    state.resetToken = action.payload.data.token;
                }


            }).addCase(verifyOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(resendOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            }).addCase(resendOTP.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            }).addCase(resendOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(loadHasLaunched.fulfilled, (state, action) => {
                state.hasLaunched = action.payload;
            }).addCase(resetPassword.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            }).addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            }).addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(forgotPassword.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            }).addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            }).addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

export const register = createAsyncThunk(
    "auth/register",
    async (payload: RegistrationPayload, { rejectWithValue }) => {
        try {
            console.log(payload)
            setLoading(true);
            const response = await apiClient.post<ApiResponse<any>>(
                "/auth/sign-up",
                payload,
            );
            console.log("signup response:", response.data);
            return response.data;
        } catch (error: any) {
            console.log("signup error:", error.response.data)

            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.code, message: error.response.data.message }
                    : { code: 0, message: "Network error" } as ApiError
            );
        }
    }
);


export const login = createAsyncThunk(
    "auth/login",
    async (payload: LoginFormValues, { rejectWithValue }) => {
        try {
            console.log(payload)
            setLoading(true);
            const response = await apiClient.post<ApiResponse<any>>(
                "/auth/sign-in",
                payload,
            );
            console.log("sigin response:", response.data);
            return response.data;
        } catch (error: any) {
            console.log("signin error:", error.response.data)

            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.code, message: error.response.data.message }
                    : { code: 0, message: "Network error" } as ApiError
            );
        }
    }
);


export const restoreSession = createAsyncThunk(
    "auth/restoreSession",
    async () => {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token");
        const storedUserProfile = await AsyncStorage.getItem("userProfile");
        if (storedToken) {
            setAuthToken(storedToken);
            setAuthenticated(true);
            setUser(JSON.parse(storedUser ? storedUser : ""));
            setUserProfile(JSON.parse(storedUserProfile ? storedUserProfile : ""));

        }
    }
);


export const verifyOTP = createAsyncThunk(
    "auth/otp",
    async (payload: OTPVerificationRequest, { rejectWithValue }) => {
        try {
            console.log("verify otp payload:", payload)
            const response = await apiClient.post<ApiResponse<any>>(
                "/auth/verify-otp",
                payload,
            );

            console.log("verify otp response:", payload, response.data);

            return { ...response.data, "resetType": payload.type };
        } catch (error: any) {
            console.log("verify otp error:", error)
            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : { code: 0, message: "Network error" } as ApiError
            );
        }
    }
);






export const resendOTP = createAsyncThunk(
    "auth/send-otp",
    async (payload: ResendOTPRequest, { rejectWithValue }) => {
        try {
            console.log("verify otp payload:", payload)
            const response = await apiClient.post<ApiResponse<any>>(
                "/auth/resend-otp",
                payload,
            );

            return response.data;
        } catch (error: any) {
            console.log("resend otp error:", error)
            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : { code: 0, message: "Network error" } as ApiError
            );
        }
    }
);


export const forgotPassword = createAsyncThunk(
    "auth/forgot-password",
    async (payload: ForgotPasswordRequest, { rejectWithValue }) => {
        try {
            console.log("forgot password:", payload)
            const response = await apiClient.post<ApiResponse<any>>(
                "/auth/forgot-password",
                payload,
            );

            return response.data;
        } catch (error: any) {
            console.log("resend otp error:", error)
            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : { code: 0, message: "Network error" } as ApiError
            );
        }
    }
);


export const resetPassword = createAsyncThunk(
    "auth/password-reset",
    async (
        payload: ResetPasswordRequest,
        { getState, rejectWithValue }
    ) => {
        try {
            // 👇 get the state and extract token from your auth slice
            const state: any = getState();
            const resetToken = state.auth.resetToken; // adjust to your slice

            console.log("resteToken", resetToken)

            const response = await apiClient.patch<ApiResponse<any>>(
                `/auth/reset-password/${resetToken}`,
                payload
            );

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data
                    ? {
                        code: error.response.status,
                        message: error.response.data.message,
                    }
                    : ({ code: 0, message: "Network error" } as ApiError)
            );
        }
    }
);

export const loadHasLaunched = createAsyncThunk(
    "auth/loadHasLaunched",
    async () => {
        const stored = await AsyncStorage.getItem("hasLaunched");
        return stored === "true";
    }
);






export const {
    setAuthenticated,
    setEmail,
    setLoading,
    setHasLaunched,
    setPin,
    setUser,
    clearPin,
    setVerified,
    setUserProfile,
    setVerificationCode,
    setVerificationCountdown,
    decrementCountdown,
    setLastVerificationAttempt,
    startVerificationCountdown,
    setLoginError,
    clearLoginError,
    resetAuth,
    logout,
} = authSlice.actions;

export default authSlice.reducer;