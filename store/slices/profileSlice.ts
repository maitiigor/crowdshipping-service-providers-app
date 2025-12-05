
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../lib/api/client";
import { ApiError, ApiResponse, CompleteProfilePayload } from "../../models";


interface EditProfileForm {
    profile: CompleteProfilePayload;
    loading: boolean;
    error: ApiError | null;
    success: boolean;
}


interface ProfileUpdatePayload {
    fullName?: string;
    phoneNumber?: string;
    location?: {
        lat: number;
        lng: number;
        address: string;
    };
    state?: string;
    city?: string;
    country?: string;
    gender?: string;
    dob?: Date;
    profilePicUrl?: string;
}


const initialState: EditProfileForm = {

    profile: {
        accountType: "pathfinder",
        fullName: "",
        email: "",
        phoneNumber: "",
        //  countryCode: "",
        country: "",
        gender: "",
        state: "",
        city: "",
        location: {
            lat: 0,
            lng: 0,
            address: "",
        },
        identificationType: "",
        licenseNumber: "",
        identificationPicture: "",
        proofOfAddress: "",
        insuranceResidenceProof: "",
        bankName: "",
        accountName: "",
        accountNumber: "",
        driverPassport: "",
    },
    loading: false,
    error: null,
    success: false,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setProfile(state, action: PayloadAction<CompleteProfilePayload>) {
            state.profile = action.payload;
        },
        setDocument(state, action: PayloadAction<Partial<CompleteProfilePayload>>) {
            state.profile = { ...state.profile, ...action.payload };
        },
        initializeProfile(state, action: PayloadAction<Partial<CompleteProfilePayload>>) {
            state.profile = { ...state.profile, ...action.payload };
        },
        setPaymentData(state, action: PayloadAction<Partial<CompleteProfilePayload>>) {
            state.profile.accountName = action.payload.accountName || state.profile.accountName;
            state.profile.accountNumber = action.payload.accountNumber || state.profile.accountNumber;
            state.profile.bankName = action.payload.bankName || state.profile.bankName;
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(completeProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(completeProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.profile = action.payload.data;
                console.log("completeing profile:", action.payload.data);
            })
            .addCase(completeProfile.rejected, (state, action) => {
                state.loading = false;
            }).addCase(uploadDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                const { documentType, url } = action.payload;

                // Update the correct field dynamically
                // state.profile = {
                //     ...state.profile,
                //     [documentType]: url,
                // };
                // console.log(state.profile, "profile datata jsjdjsj", documentType, url);
            })
            .addCase(uploadDocument.pending, (state) => {
                state.loading = true;
            })
            .addCase(uploadDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiError;
            }).addCase(getUserProfile.pending, (state, action) => {
                state.loading = true;
                state.error = null;

            }).addCase(getUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                // state.profile = action.payload?.data;
            }).addCase(getUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiError;
            }).addCase(updateProfile.pending, (state, action) => {
                state.loading = true;
                state.error = null;

            }).addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                //   state.profile = action.payload.data;
            }).addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiError;
            });


    },
});



const getFileType = (file: string) => {
    const extension = file.split(".").pop();
    return `image/${extension}`;
};


export const uploadDocument = createAsyncThunk(
    "profile/upload-document",
    async (
        { documentType, file }: { documentType: string; file: string },
        { rejectWithValue }
    ) => {
        try {
            console.log("uploading document:", documentType, file);
            const formData = new FormData();

            const extension = file.split(".").pop();


            formData.append(
                "file",
                {
                    uri: file,
                    type: `image/${extension}`,
                    name: `${documentType}.${extension}`,
                } as any
            );

            // optionally include document type if API expects it
            formData.append("documentType", documentType);

            const response = await apiClient.post<ApiResponse<any>>(
                "/storage-upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("upload responsejjjjj:", response.data.data.data);

            return { documentType, url: response.data.data.data }; // assuming your API returns { url: "..." }
        } catch (error: any) {
            console.log("upload error:", error);
            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : ({ code: 0, message: "Network error" } as ApiError)
            );
        }
    }
);


export const completeProfile = createAsyncThunk(
    "profile/complete-profile",
    async (payload: CompleteProfilePayload, { rejectWithValue }) => {
        try {
            //console.log("completing profile:", payload)
            setLoading(true);
            const response = await apiClient.patch<ApiResponse<any>>(
                "/user/complete-profile",
                payload,
            );
            //  console.log("completeing profile:", response.data);
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

export const getUserProfile = createAsyncThunk(
    "profile/get-user-profile",
    async () => {
        try {
            const response = await apiClient.get<ApiResponse<any>>(
                "/user/profile",
            );

            return response.data;
        } catch (error: any) {
            console.log("get user profile error:", error)
        }
    }
);

export const updateProfile = createAsyncThunk(
    "profile/update-profile",
    async (payload: ProfileUpdatePayload, { rejectWithValue }) => {
        try {
            //console.log("updating profile:", payload)
            setLoading(true);
            const response = await apiClient.patch<ApiResponse<any>>(
                "/user/update-profile",
                payload,
            );
            //  console.log("updateing profile:", response.data);
            return response.data;
        } catch (error: any) {
            console.log("update profile error:", error.response.data)

            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.code, message: error.response.data.message }
                    : { code: 0, message: "Network error" } as ApiError
            );
        }
    }
)







export const {
    setLoading,
    setProfile,
    setDocument,
    setPaymentData,
    initializeProfile
} = profileSlice.actions;

export default profileSlice.reducer;