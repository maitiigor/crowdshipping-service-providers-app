
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../lib/api/client";
import { ApiError, ApiResponse, Transaction, PaymentWallet } from "../../models";

interface WalletState {
    wallet: PaymentWallet | null;
    transactions: Transaction[];
    loadingWallet: boolean;
    resolveData: any;
    error: ApiError | null;
}

const initialState: WalletState = {
    wallet: null,
    transactions: [],
    loadingWallet: false,
    resolveData: null,
    error: null,
};


interface WalletFetchResponse {
    wallet: PaymentWallet;
    transactions: Transaction[];
}
const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWallet.pending, (state) => {
                state.loadingWallet = true;
                state.error = null;
            })
            .addCase(fetchWallet.fulfilled, (state, action) => {
                state.loadingWallet = false;
                if (action.payload?.data === undefined) {
                    state.wallet = null;
                    state.transactions = [];
                    return;
                }
                state.transactions = action.payload?.data.transactions;
                state.wallet = action.payload?.data.wallet;
            })
            .addCase(fetchWallet.rejected, (state, action) => {
                state.loadingWallet = false;
                state.error = action.payload as ApiError;
            });
    },
});

export const fetchWallet = createAsyncThunk(
    "wallet/fetchWallet",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ApiResponse<WalletFetchResponse>>(
                "/wallet/fetch"
            );
            console.log(response.data);
            return response.data;
        } catch (error: any) {
            console.log("fetch wallet error:", error.response?.data);
            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : { code: 0, message: "Network error" } as ApiError
            );
        }
    }
);


export default walletSlice.reducer