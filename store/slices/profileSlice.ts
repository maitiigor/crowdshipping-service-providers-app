
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../lib/api/client";
import { ApiError, ApiResponse, CompleProfilePayload, RegistrationPayload } from "../../models";


interface EditProfileForm {
    profile: CompleProfilePayload;
    loading: boolean;
    error: ApiError | null;
    success: boolean;
}


const initialState: EditProfileForm = {

    profile: {
        accountType: "pathfinder",
        fullName: "",
        email: "",
        phoneNumber: "",
        countryCode: "",
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
        setProfile(state, action: PayloadAction<CompleProfilePayload>) {
            state.profile = action.payload;
        },
        setDocument(state, action: PayloadAction<Partial<CompleProfilePayload>>) {
            state.profile = { ...state.profile, ...action.payload };
        },
        initializeProfile(state, action: PayloadAction<Partial<CompleProfilePayload>>) {
            state.profile = { ...state.profile, ...action.payload };
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(compleProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.profile = {
                    accountType: "",
                    fullName: "",
                    email: "",
                    phoneNumber: "",
                    countryCode: "",
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
                };
            })
            .addCase(compleProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.profile = action.payload.data;
            })
            .addCase(compleProfile.rejected, (state, action) => {
                state.loading = false;
            }).addCase(uploadDocument.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;

                const { documentType, url } = action.payload;

                // Update the correct field dynamically
                state.profile = {
                    ...state.profile,
                    [documentType]: url,
                };
            })
            .addCase(uploadDocument.pending, (state) => {
                state.loading = true;
            })
            .addCase(uploadDocument.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiError;
            });


    },
});

export const compleProfile = createAsyncThunk(
    "profile/complete-profile",
    async (payload: RegistrationPayload, { rejectWithValue }) => {
        try {
            console.log("completing profile:", payload)
            setLoading(true);
            const response = await apiClient.post<ApiResponse<any>>(
                "/user/complete-profile",
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


export const uploadDocument = createAsyncThunk(
    "profile/upload-document",
    async (
        { documentType, file }: { documentType: "idFrontImage" | "idBackImage" | "selfieImage"; file: any },
        { rejectWithValue }
    ) => {
        try {
            console.log("uploading document:", documentType, file);
            const formData = new FormData();
            if (!file?.uri) throw new Error("File object missing uri");

            formData.append(
                "file",
                {
                    uri: file.uri,
                    type: file.type || "image/jpeg",
                    name: file.name || "document.jpg",
                } as any
            );

            // optionally include document type if API expects it
            formData.append("documentType", documentType);
            console.log("documente attached");
            const response = await apiClient.post<ApiResponse<any>>(
                "/storage-upload",
                formData,
                {
                    headers: {

                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("upload responsejjjjj:", response.data);

            return { documentType, url: response.data }; // assuming your API returns { url: "..." }
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






export const {
    setLoading,
    setProfile,
    setDocument,
    initializeProfile
} = profileSlice.actions;

export default profileSlice.reducer;