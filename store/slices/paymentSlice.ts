
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../lib/api/client";
import { ApiError, ApiResponse, Bank } from "../../models";

interface PaymentState {
    loading: boolean;
    banks: Bank[];
    loadingResolve: boolean;
    loadingWithdrawal: boolean;
    error: ApiError | null;
}

const initialState: PaymentState = {
    loading: false,
    banks: [],
    loadingResolve: false,
    loadingWithdrawal: false,
    error: null,
};


interface VerificationResponse {
    wallet: {
        _id: string;
        walletId: string;
        userId: string;
        status: string;
        balance: number;
        availableBalance: number;
        createdAt: string;
        updatedAt: string;
        __v: number;
        accountName: string;
        accountNumber: number;
        bankName: string;
        bankCode: string;
        recipientCode: string;
        id: string;
    },
    transaction: {
        _id: string;
        userId: string;
        walletId: string;
        type: string;
        amount: number;
        previousBalance: number;
        currentBalance: number;
        currency: string;
        purpose: string;
        referenceId: string;
        provider: string;
        status: string;
        title: string;
        description: string;
        createdAt: string;
        updatedAt: string;
        __v: number;
        id: string;
    }
}


interface InitiationResponse {
    amount: number,
    currency: string,
    trxReference: string,
    transferCode: string
}


interface VerificationPayload {
    otp: string,
    currency: string, //NGN | USD
    trxReference: string,
    transferCode: string,
    amount: number
}

interface BankVerificationResponse {
    account_name: string,
    account_number: string,
    bank_id: number
}


const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBankList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBankList.fulfilled, (state, action) => {
                state.loading = false;
                state.banks = action.payload.data as Bank[];
            })
            .addCase(fetchBankList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiError;
            }).addCase(verifyBankAccount.pending, (state) => {
                state.loadingResolve = true;
                state.error = null;
            })
            .addCase(verifyBankAccount.fulfilled, (state, action) => {
                state.loadingResolve = false;
            })
            .addCase(verifyBankAccount.rejected, (state, action) => {
                state.loadingResolve = false;
                state.error = action.payload as ApiError;
            })
            .addCase(initiateWithdrawal.pending, (state) => {
                state.loadingWithdrawal = true;
                state.error = null;
            })
            .addCase(initiateWithdrawal.fulfilled, (state, action) => {
                state.loadingWithdrawal = false;
            })
            .addCase(initiateWithdrawal.rejected, (state, action) => {
                state.loadingWithdrawal = false;
                state.error = action.payload as ApiError;
            });
    },
});


export const fetchBankList = createAsyncThunk(
    "payment/fetchBankList",
    async () => {
        try {
            const response = await apiClient.get<ApiResponse<Bank[]>>(
                "/wallet/fetch-banks"
            );
            return response.data;
        } catch (error) {
            console.log("fetch bank list error:", error);
            throw new Error("Failed to fetch bank list");
        }
    }
)

export const verifyBankAccount = createAsyncThunk<
    ApiResponse<BankVerificationResponse>,
    { accountNumber: string; bankCode: string },
    { rejectValue: ApiError }
>(
    "payment/resolveBankAccount",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await apiClient.post<ApiResponse<BankVerificationResponse>>(
                "/wallet/resolve-account",
                payload
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : { code: 0, message: "Network error" } as ApiError
            );
        }
    }
);

export const initiateWithdrawal = createAsyncThunk<
    ApiResponse<InitiationResponse>,
    any,
    { rejectValue: ApiError }
>(
    "payment/initiateWithdrawal",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await apiClient.post<ApiResponse<InitiationResponse>>(
                "/wallet/initiate-withdrawal",
                payload
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : { code: 0, message: "Network error" } as ApiError
            );
        }
    }
);

export const verifyWithdrawal = createAsyncThunk<
    ApiResponse<VerificationResponse>,
    { trxReference: string },
    { rejectValue: ApiError }
>(
    "payment/verifyWithdrawal",
    async ({ trxReference }, { rejectWithValue }) => {
        try {
            const response = await apiClient.patch<ApiResponse<VerificationResponse>>(
                "/wallet/verify-withdrawal",
                {
                    trxReference,
                }
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : { code: 0, message: "Network error" } as ApiError
            );
        }
    }
);



export default paymentSlice.reducer;




