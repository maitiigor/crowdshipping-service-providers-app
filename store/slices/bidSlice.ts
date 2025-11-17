import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../lib/api/client";
import { ApiError, ApiResponse, MarineTrip } from "../../models";



export const negotiateBid = createAsyncThunk<ApiResponse<any>, { amount: string; note: string, bidId: string }, { rejectValue: ApiError }>(
    "bid/negotiateBid",
    async (negotiationData, { rejectWithValue }) => {
        try {
            const response = await apiClient.patch<any, ApiResponse<any>>(
                `/trip/renegotiate/bid/${negotiationData.bidId}`,
                {
                    amount: negotiationData.amount,
                    note: negotiationData.note,
                }
            );
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiError);
        }
    }
);


export const acceptBid = createAsyncThunk<ApiResponse<MarineTrip>, { bidId: string }, { rejectValue: ApiError }>(
    "bid/acceptBid",
    async ({ bidId }, { rejectWithValue }) => {
        try {
            const response = await apiClient.patch<null, ApiResponse<any>>(
                `/trip/accept/bid/${bidId}`
            );
        
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response.data as ApiError);
        }
    }
);


