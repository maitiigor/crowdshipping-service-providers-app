import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../lib/api/client";
import { ApiError, ApiResponse, Notification as AppNotification } from "../../models";

// State interface
interface NotificationState {
    notifications: AppNotification[];
    notification: AppNotification;
    loading: boolean;
    error: ApiError | null;
}

const initialState: NotificationState = {
    notifications: [],
    notification: {
        __v: 0,
        _id: "",
        channel: "",
        createdAt: "",
        data: [],
        delivered: false,
        id: "",
        isRead: false,
        message: "",
        title: "",
        triggeredById: "",
        type: "",
        updatedAt: "",
        userId: "",
    },
    loading: false,
    error: null,
};

// ✅ Define thunks *before* using them in createSlice

export const fetchNotifications = createAsyncThunk<
    ApiResponse<AppNotification[]>, // Return type
    void,                           // Argument type
    { rejectValue: ApiError }       // Rejection type
>(
    "notification/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ApiResponse<AppNotification[]>>("/notification");

            return response.data;
        } catch (error: any) {

            return rejectWithValue(

                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : { code: 0, message: "Network error" }
            );
        }
    }
);

export const fetchNotificationById = createAsyncThunk<
    ApiResponse<AppNotification>, // Return type
    string,                       // Argument type
    { rejectValue: ApiError }     // Rejection type
>(
    "notification/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ApiResponse<AppNotification>>(`/notification/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : { code: 0, message: "Network error" }
            );
        }
    }
);

export const markNotificationAsRead = createAsyncThunk<
    ApiResponse<string>, // Return type
    string,                       // Argument type
    { rejectValue: ApiError }     // Rejection type
>(
    "notification/markAsRead",
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.patch<ApiResponse<Object>>(
                `/notification/${id}`
            );


            return { ...response.data, data: id };
        } catch (error: any) {

            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : { code: 0, message: "Network error" }
            );
        }
    }
);

// ✅ Create slice
const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<AppNotification[]>) => {
            state.notifications = action.payload;
        },
        setError: (state, action: PayloadAction<ApiError | null>) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload.data ?? [];
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? { code: 0, message: "Unknown error" };
            })
            .addCase(fetchNotificationById.fulfilled, (state, action) => {
                const index = state.notifications.findIndex(
                    (n) => n.id === action.payload.data?.id
                );

            })
            .addCase(fetchNotificationById.rejected, (state, action) => {
                state.error = action.payload ?? { code: 0, message: "Unknown error" };
            }).addCase(markNotificationAsRead.fulfilled, (state, action) => {

                const notification = state.notifications.find((notification) => notification.id === action.payload.data);
               
                if (notification) {
                    notification.isRead = true;
                }
            });
    },
});

export const { setNotifications, setError } = notificationSlice.actions;
export default notificationSlice.reducer;
