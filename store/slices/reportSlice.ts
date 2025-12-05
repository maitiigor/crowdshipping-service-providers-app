
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../lib/api/client";
import { ApiError, ApiResponse, Report, } from "../../models";

interface ReportState {
    loading: boolean;
    reports: Report[];
    error: ApiError | null;
}

const initialState: ReportState = {
    loading: false,
    reports: [],
    error: null,
};


export interface ReportPayload {
    reportType: string,
    natureOfReport: string,
    otherOption?: string,
    reportAmount: number,
    trackingId: string,
    description: string,
    evidence: string,
}

export const fetchReports = createAsyncThunk(
    "report/fetchReports",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ApiResponse<Report[]>>(
                "/issue/pending/reports",
            );

            console.log("fetch reports response:", response.data);

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
export const submitReport = createAsyncThunk(
    "issue/log/report",
    async (payload: ReportPayload, { rejectWithValue }) => {
        try {
            const response = await apiClient.post<ApiResponse<Report>>(
                "/issue/log/report",
                payload,
            );

            return response.data;
        }
        catch (error: any) {
            console.log(error);
            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : { code: 0, message: "Network error" } as ApiError
            );
        }
    }
)




const reportSlice = createSlice({
    name: "report",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(fetchReports.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(fetchReports.fulfilled, (state, action) => {
                state.loading = false;
                state.reports = action.payload.data ?? [];
            })
            .addCase(fetchReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiError;
            }).addCase(submitReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitReport.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(submitReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiError;
            });
    },
});

export default reportSlice.reducer;