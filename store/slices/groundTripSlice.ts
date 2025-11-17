import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../lib/api/client";
import { ApiError, ApiResponse, GroundTrip, GroundTripDetail } from "../../models";

interface GroundTripState {
    groundTrip: GroundTripDetail;
    groundTrips: GroundTrip[];
    loading: boolean;
    error: ApiError | null;
}
const initialState: GroundTripState = {
groundTrip: {
        id: "",
        trackingId: "",
        weight: 0,
        customer: "",
        price: 0,
        pickUpLocation: {
            address: "",
            coordinates: [0, 0],
            type: "",
        },
        dropOffLocation: {
            address: "",
            coordinates: [0, 0],
            type: "",
        },
        bookingRef: "",
        dateOfBooking: "",
        status: "",
        receiver: {
            name: "",
            phone: "",
            alternativePhone: ""
        },
        sender: {
            name: "",
            phoneNumber: "",
            email: ""
        },
        packages: []
    },
    groundTrips: [],
    loading: false,
    error: null,

}


const groundTripSlice = createSlice({
    name: "groundTrip",
    initialState,
    reducers: {
        setGroundTrip(state, action) {
            console.log("setting ground trip:", action.payload)
            state.groundTrip = action.payload;
            console.log("ground trip set:", state.groundTrip)
        },
        fetchGroundTrips(state, action) {
            state.loading = true;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchDeliveryBookings.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(fetchDeliveryBookings.fulfilled, (state, action) => {
            state.error = null
            state.loading = false;
            state.groundTrips = action.payload.data as GroundTrip[]

        }).addCase(fetchDeliveryBookings.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as ApiError
        }).addCase(fetchDeliveryBookingDetail.pending, (state) => {
            state.error = null;
            state.loading = true;
        }).addCase(fetchDeliveryBookingDetail.fulfilled, (state, action) => {
            state.error = null;
            state.loading = false;
            state.groundTrip = action.payload.data as GroundTripDetail
        }).addCase(fetchDeliveryBookingDetail.rejected, (state, action) => {
            state.error = null
            state.loading = false
            state.error = action.payload as ApiError
        }).addCase(acceptBooking.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(acceptBooking.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            // Update the specific trip status to accepted
            const bookingId = action.meta.arg;
            const tripIndex = state.groundTrips.findIndex(trip => trip.id === bookingId);
            if (tripIndex !== -1) {
                state.groundTrips[tripIndex].status = 'ACCEPTED';
            }
        }).addCase(acceptBooking.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as ApiError;
        }).addCase(rejectBooking.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(rejectBooking.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            // Update the specific trip status to rejected
            const bookingId = action.meta.arg;
            const tripIndex = state.groundTrips.findIndex(trip => trip.id === bookingId);
            if (tripIndex !== -1) {
                state.groundTrips[tripIndex].status = 'REJECTED';
            }
        }).addCase(rejectBooking.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as ApiError;
        }).addCase(updateTripStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(updateTripStatus.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            // Update the specific trip status
            const { id, status } = action.meta.arg;
            const tripIndex = state.groundTrips.findIndex(trip => trip.id === id);
            if (tripIndex !== -1) {
                state.groundTrips[tripIndex].status = status;
            }
            // Also update the single trip if it matches
            if (state.groundTrip.id === id) {
                state.groundTrip.status = status;
            }
        }).addCase(updateTripStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as ApiError;
        }).addCase(fetchActiveDeliveryBookings.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(fetchActiveDeliveryBookings.fulfilled, (state, action) => {
            state.error = null;
            state.loading = false;
            // Merge active bookings with existing bookings, avoiding duplicates
            const activeBookings = action.payload.data as GroundTrip[];
            const existingIds = state.groundTrips.map(trip => trip.id);
            const newBookings = activeBookings.filter(booking => !existingIds.includes(booking.id));
            state.groundTrips = [...state.groundTrips, ...newBookings];
        }).addCase(fetchActiveDeliveryBookings.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as ApiError;
        })
    }
})

export const fetchDeliveryBookings = createAsyncThunk(
    "groundTrip/fetchBookings",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ApiResponse<GroundTrip[]>>(
                "/orders/new/bookings",
            );

            return response.data
        } catch (error: any) {
            ///   console.log("fetch bookings error:", error)
            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : ({ code: 0, message: "Network error" } as ApiError)
            );
        }
    })

export const fetchActiveDeliveryBookings = createAsyncThunk(
    "groundTrip/fetchActiveBookings",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ApiResponse<GroundTrip[]>>(
                "/orders/active/bookings",
            );

            return response.data
        } catch (error: any) {
            ///   console.log("fetch bookings error:", error)
            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : ({ code: 0, message: "Network error" } as ApiError)
            );
        }
    })

export const fetchDeliveryBookingDetail = createAsyncThunk(
    "groundTrip/fetchBookingDetails",
    async (id: string, { rejectWithValue }) => {
        try {
            console.log("fetching booking detail:", id)
            const response = await apiClient.get<ApiResponse<GroundTripDetail>>(
                `/orders/booking/${id}`,
            );

            return response.data
        } catch (error: any) {
            console.log("fetch booking detail error:", error)

            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : ({ code: 0, message: "Network error" } as ApiError)
            );
        }
    })


export const acceptBooking = createAsyncThunk(
    "groundTrip/acceptBooking",
    async (bookingId: string, { rejectWithValue }) => {
        try {
            console.log("accepting booking:", bookingId)
            const response = await apiClient.patch<ApiResponse<any>>(
                `/orders/accept/booking/${bookingId}`,
            );

            return response.data
        } catch (error: any) {
            console.log("accept booking error:", error)
            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : ({ code: 0, message: "Network error" } as ApiError)
            );
        }
    });


export const rejectBooking = createAsyncThunk(
    "groundTrip/rejectBooking", async (bookingId: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.patch<ApiResponse<any>>(
                `/orders/reject/booking/${bookingId}`,
            );

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data ? { code: error.response.status, message: error.response.data.message } : ({
                    code: 0, message: "Network error"
                } as ApiError
                )
            )
        }
    })

export const updateTripStatus = createAsyncThunk(
    "groundTrip/updateTripStatus", async (payload: { id: string; status: string; deliveryImage?: string; expenses?: { amount: number; receipt: string; description: string }[]; otp?: string }, { rejectWithValue }) => {
        try {
            console.log("updating trip status:", payload.status)

            // Prepare request body
            const requestBody: { status: string; deliveredImageUrl?: string; expenses?: { amount: number; receipt: string ; description: string }[]; otp?: string } = { status: payload.status };
            if (payload.deliveryImage) {
                console.log("delivery image:", payload.deliveryImage)
                requestBody.deliveredImageUrl = payload.deliveryImage;
            }

            if (payload.expenses) {
                requestBody.expenses = payload.expenses;
            }

            if (payload.otp) {
                requestBody.otp = payload.otp;
            }

            const response = await apiClient.patch<ApiResponse<any>>(
                `/orders/road/status/update/${payload.id}`,
                requestBody // status can be GOING_TO_PICKUP, PICKED_UP, IN_TRANSIT, ARRIVED_DESTINATION, DELIVERED, TOLL_BILL_PENDING, TOLL_BILL_PAID, COMPLETED
            );

            console.log("trip status updated:", requestBody)

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data ? { code: error.response.status, message: error.response.data.message } : ({
                    code: 0, message: "Network error"
                } as ApiError
                )
            )
        }
    })


export const {
    setGroundTrip,
} = groundTripSlice.actions;

export default groundTripSlice.reducer