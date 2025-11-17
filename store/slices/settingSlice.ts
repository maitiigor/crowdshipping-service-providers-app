import { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../lib/api/client";
import { ApiError } from "../../models";


interface SettingState {
    enableEmail: boolean;
    enableSms: boolean;
    theme: string;
    isLoading: boolean;
    error: ApiError | null;
}

const initialState: SettingState = {
    enableEmail: false,
    enableSms: false,
    theme: "system",
    isLoading: false,
    error: null,
};

const settingSlice = createSlice({
    name: "setting",
    initialState,
    reducers: {
        setEnableEmail(state, action) {
            state.enableEmail = action.payload;
        },
        setEnableSms(state, action) {
            state.enableSms = action.payload;
        },
        setTheme(state, action) {
            state.theme = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(updateUserPreference.fulfilled, (state, action) => {
            state.enableEmail = action.payload.enableEmail;
            state.enableSms = action.payload.enableSms;
            state.theme = action.payload.theme;
        });
        builder.addCase(fetchUserPreference.fulfilled, (state, action) => {
            state.enableEmail = action.payload.enableEmail;
            state.enableSms = action.payload.enableSms;
            state.theme = action.payload.theme;
        });
    },
});


export const updateUserPreference = createAsyncThunk(
  "setting/fetchUserPreference",
  async (preference: any, { rejectWithValue }) => {
    try {
          const response =  await apiClient.patch("/user/preferences", preference);

            // dispatch(setEnableEmail(preference.enableEmail));
            // dispatch(setEnableSms(preference.enableSms));
            // dispatch(setTheme(preference.theme));
            console.log("save user preference response:", response.data);
            return response.data;

        } catch (error: any) {
            console.log("save user preference error:", error);

        }
    }
);

export const fetchUserPreference = createAsyncThunk(
  "setting/fetchUserPreference",
  async (_, { rejectWithValue }) => {
    try {
          const response =  await apiClient.get("/user/preferences");
            console.log("fetch user preference response:", response.data);
            return response.data;

        } catch (error: any) {
            console.log("fetch user preference error:", error);
            return rejectWithValue(error.response.data);
        }
    }
);






export const { setEnableEmail, setEnableSms, setTheme } = settingSlice.actions;
export default settingSlice.reducer;
