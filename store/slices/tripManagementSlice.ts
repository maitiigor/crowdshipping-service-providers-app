
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../lib/api/client";
import { ApiError, ApiResponse, BookingDetail } from "../../models";


interface OrderLocationPayload {
  tripId: string;
  currentLocation: currentLocationPayload;
  speed?: number;
  heading?: number;
}

interface currentLocationPayload {
  lat: number;
  lng: number;
  address: string;
}

interface TripManagementState {
  loading: boolean;
  error: ApiError | null;
  bookingDetail: BookingDetail;
}


const initialState: TripManagementState = {
  loading: false,
  error: null,
  bookingDetail: {} as BookingDetail,
}

const tripManagementSlice = createSlice({
  name: "tripManagement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBookingDetail.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
      .addCase(fetchBookingDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingDetail = action.payload.data as BookingDetail;
      })
      .addCase(fetchBookingDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as ApiError;
      });
  },
});






export const updateOrderLocation = createAsyncThunk(
  "tripManagement/orderLocation",
  async (payload: OrderLocationPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/orders/road/${payload.tripId}/locations`, {
        currentLocation: payload.currentLocation,
        speed: payload.speed,
        heading: payload.heading
      });
    
      return response.data as ApiResponse<any>;
    }
    catch (error: any) {
      return rejectWithValue(
        error.response?.data
          ? { code: error.response.status, message: error.response.data.message }
          : { code: 0, message: "Network error" } as ApiError
      );
    }
  }
)

export const resendDeliveryOtp = createAsyncThunk(
  "tripManagement/resendDeliveryOtp",
  async (payload: { tripId: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/orders/road/resend-otp/${payload.tripId}`);
      return response.data as ApiResponse<any>;
    }
    catch (error: any) {
   
      return rejectWithValue(
        error.response?.data
          ? { code: error.response.status, message: error.response.data.message }
          : { code: 0, message: "Network error" } as ApiError
      );
    }
  }
)


export const fetchBookingDetail = createAsyncThunk(
  "marineTrip/fetchMarineBookingDetail",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<ApiResponse<BookingDetail>>(
        `/trip/booking/detail/${id}`,
      );
      console.log("fetch booking detail response:", response.data.data);
      return response.data;
    } catch (error: any) {
      console.log("fetch booking detail error:", error.response.data)
      return rejectWithValue(
        error.response?.data
          ? { code: error.response.status, message: error.response.data.message }
          : { code: 0, message: "Network error" } as ApiError
      );
    }
  }
)

export default tripManagementSlice.reducer;
