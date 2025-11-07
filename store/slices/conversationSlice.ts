
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../lib/api/client";
import { ApiError, ApiResponse, Conversation, ISingleChatData } from "../../models";

interface ConversationState {
    conversation: Conversation;
    conversations: Conversation[];
    chatDetail: ISingleChatData | null;
    loading: boolean;
    isFetching: boolean;
    isRefetching: boolean;
    sendingMessage: boolean;
    uploadingFile: boolean;
    error: ApiError | null;
}

const initialState: ConversationState = {
    conversation: {
        conversationId: "",
        lastMessage: "",
        lastMessageType: "",
        lastMessageAt: "",
        unreadCount: 0,
        participant: {
            _id: "",
            fullName: "",
            profileImage: "",
            userType: "",
        },
    },
    conversations: [],
    chatDetail: null,
    isFetching: false,
    isRefetching: false,
    loading: false,
    sendingMessage: false,
    uploadingFile: false,
    error: null,
};

export const fetchConversations = createAsyncThunk<
    ApiResponse<Conversation[]>, // Return type
    void,                           // Argument type
    { rejectValue: ApiError }       // Rejection type
>(
    "conversation/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ApiResponse<Conversation[]>>("/conversations");
            console.log("conversation response:", response.data);
            return response.data;
        } catch (error: any) {
            console.log("conversation error:", error);
            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : { code: 0, message: "Network error" }
            );
        }
    }
);

export const fetchConversationById = createAsyncThunk<
    ApiResponse<Conversation>, // Return type
    string,                       // Argument type
    { rejectValue: ApiError }     // Rejection type
>(
    "conversation/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ApiResponse<Conversation>>(`/conversation/${id}`);
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

export const fetchChatDetail = createAsyncThunk<
    ApiResponse<ISingleChatData>, // Return type
    string,          // Argument type (conversationId)
    { rejectValue: ApiError }
>(
    "conversation/fetchChatDetail",
    async (conversationId, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ApiResponse<ISingleChatData>>(`/conversation/${conversationId}`);
            console.log("chat detail response:", response.data);
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

export const sendMessage = createAsyncThunk<
    any, // Return type
    { conversationId: string; type: string; content?: string; attachments?: string[] },
    { rejectValue: ApiError }
>(
    "conversation/sendMessage",
    async ({ conversationId, ...messageData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.patch(`/conversation/${conversationId}`, messageData);
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

export const uploadFile = createAsyncThunk<
    { url: string }, // Return type
    FormData,        // Argument type
    { rejectValue: ApiError }
>(
    "conversation/uploadFile",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await apiClient.post<{ data: { data: string } }>("/storage-upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return { url: response.data.data.data };
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : { code: 0, message: "Network error" }
            );
        }
    }
);

const conversationSlice = createSlice({
    name: "conversation",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchConversations.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.isFetching = true;
        })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.loading = false;
                state.conversations = action.payload.data ?? [];
                state.isFetching = false;
              
            })
            .addCase(fetchConversations.rejected, (state, action) => {
                state.loading = false;
                state.isFetching = false;
                state.error = action.payload ?? { code: 0, message: "Unknown error" };
            })
            .addCase(fetchConversationById.fulfilled, (state, action) => {
                state.conversation = action.payload.data ?? state.conversation;
            })
            // Chat detail reducers
            .addCase(fetchChatDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChatDetail.fulfilled, (state, action) => {
                state.loading = false;
                
                 state.chatDetail = action.payload.data ?? null;
                 console.log("chat detail:", state.chatDetail);
            })
            .addCase(fetchChatDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? { code: 0, message: "Unknown error" };
            })
            // Send message reducers
            .addCase(sendMessage.pending, (state) => {
                state.sendingMessage = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state) => {
                state.sendingMessage = false;
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.sendingMessage = false;
                state.error = action.payload ?? { code: 0, message: "Unknown error" };
            })
            // Upload file reducers
            .addCase(uploadFile.pending, (state) => {
                state.uploadingFile = true;
                state.error = null;
            })
            .addCase(uploadFile.fulfilled, (state) => {
                state.uploadingFile = false;
            })
            .addCase(uploadFile.rejected, (state, action) => {
                state.uploadingFile = false;
                state.error = action.payload ?? { code: 0, message: "Unknown error" };
            });
    },
});

export default conversationSlice.reducer;
