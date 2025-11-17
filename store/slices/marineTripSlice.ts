import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../lib/api/client";
import { ApiError, ApiResponse, Booking, BookingDetail, MarineLocation, MarineTrip, MarineTripRequest, VesselOperator } from "../../models";

interface MarineTripState {
    marineTripForm: MarineTripRequest;
    marineTrip: MarineTrip;
    trips: MarineTrip[];
    loading: boolean;
    loadingTrips: boolean;
    isLoadingVessels: boolean;
    vesselOperators: VesselOperator[];
    loadingBookings: boolean;
    marineBookings: Booking[];
    marineBookingDetail: BookingDetail;
    loadingOrderLocation: boolean;
    orderLocations: MarineLocation[];
    error: ApiError | null;
}


interface MarineLocationResponse {
    locations: MarineLocation[]
}

const initialState: MarineTripState = {
    marineTripForm: {
        mmsiNumber: "",
        vesselName: "",
        vesselOperator: "",
        containerNumber: "",
        voyageNumber: "",
        departurePort: "",
        arrivalPort: "",
        departureDate: "",
        arrivalDate: "",
        capacity: {
            pounds: "",
            dimension: "",
        },

    },
    marineTrip: {
        _id: "",
        tripId: "",
        containerNumber: "",
        creatorId: "",
        shipId: "",
        status: "",
        vesselName: "",
        fleetType: "",
        departurePort: "",
        arrivalPort: "",
        departureDate: "",
        arrivalDate: "",
        createdAt: "",
        updatedAt: "",
        capacity: {
            pounds: 0,
            dimension: "",
        },
        route: {
            via: [],
        },
        bids_recieved: [],
    },
    loadingBookings: false,
    marineBookings: [],
    marineBookingDetail: {} as BookingDetail,
    isLoadingVessels: false,
    vesselOperators: [],
    trips: [],
    loading: false,
    loadingTrips: false,
    loadingOrderLocation: false,
    orderLocations: [],
    error: null,
};

export const fetchMarineTrips = createAsyncThunk(
    "marineTrip/fetchMarineTrips",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ApiResponse<MarineTrip[]>>(
                "/trip/maritimes",
            );



            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : ({ code: 0, message: "Network error" } as ApiError)
            );
        }
    }
);

export const saveMarineTrip = createAsyncThunk(
    "marineTrip/saveMarineTrip",
    async (payload: MarineTripRequest, { rejectWithValue }) => {
        try {
            const response = await apiClient.post<ApiResponse<MarineTrip>>(
                "/trip/maritimes",
                payload,
            );

            return response.data;
        } catch (error: any) {

            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : ({ code: 0, message: "Network error" } as ApiError)
            );
        }
    }
);


export const fetchMarineById = createAsyncThunk(
    "marineTrip/fetchMarineById",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ApiResponse<MarineTrip>>(`/trip/maritime/${id}`);

            return response.data;
        }
        catch (error: any) {
            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : ({ code: 0, message: "Network error" } as ApiError)
            );
        }
    }
);

const marineTripSlice = createSlice({
    name: "marineTrip",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMarineTrips.pending, (state) => {
                state.loadingTrips = true;
                state.error = null;
            })
            .addCase(fetchMarineTrips.fulfilled, (state, action) => {
                state.loadingTrips = false;
                state.trips = action.payload?.data ?? [];
            })
            .addCase(fetchMarineTrips.rejected, (state, action) => {
                state.loadingTrips = false;
                state.error =
                    (action.payload as ApiError) ?? {
                        code: 0,
                        message: "Unable to load marine trips",
                    };
            })
            .addCase(saveMarineTrip.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveMarineTrip.fulfilled, (state, action) => {
                state.loading = false;
                const newTrip = action.payload?.data as MarineTrip | undefined;

                if (newTrip) {
                    state.trips = [newTrip, ...state.trips];
                }
            })
            .addCase(saveMarineTrip.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as ApiError) ?? {
                        code: 0,
                        message: "Unable to save marine trip",
                    };
            }).addCase(fetchMarineById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMarineById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.data) {
                    state.marineTrip = action.payload.data;
                }
            })
            .addCase(fetchMarineById.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as ApiError) ?? {
                        code: 0,
                        message: "Unable to load marine trip",
                    };
            }).addCase(fetchMarineBookings.pending, (state) => {
                state.loadingBookings = true;
                state.error = null;
            })
            .addCase(fetchMarineBookings.fulfilled, (state, action) => {
                state.loadingBookings = false;
                state.marineBookings = action.payload.data ?? [];

            })
            .addCase(fetchMarineBookings.rejected, (state, action) => {
                state.loadingBookings = false;
                state.error = action.payload as ApiError;
            }).addCase(fetchMarineBookingDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMarineBookingDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.marineBookingDetail = action.payload.data as BookingDetail;
            })
            .addCase(fetchMarineBookingDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiError;
            }).addCase(fetchMarineOrderLocations.pending, (state) => {
                state.loadingOrderLocation = true;
                state.error = null;
            })
            .addCase(fetchMarineOrderLocations.fulfilled, (state, action) => {
                state.loadingOrderLocation = false;
                state.orderLocations = action.payload.data?.locations ?? [];

            })
            .addCase(fetchMarineOrderLocations.rejected, (state, action) => {
                state.loadingOrderLocation = false;;
                state.error = action.payload as ApiError;
            })
    },
});

export const fetchMarineBookings = createAsyncThunk(
    "marineTrip/fetchMarineBookings",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ApiResponse<Booking[]>>(
                "/trip/maritime/booking/history",
            );

            console.log("🚀 ~ fetchMarineBookings ~ response:", response.data);

            return response.data as ApiResponse<Booking[]>;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : { code: 0, message: "Network error" } as ApiError
            );
        }
    }
);

export const fetchMarineBookingDetail = createAsyncThunk(
    "marineTrip/fetchMarineBookingDetail",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ApiResponse<BookingDetail>>(
                `/trip/booking/detail//${id}`,
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
)


export const fetchMarineOrderLocations = createAsyncThunk(
    "marineTrip/fetchMarineOrderLocations",
    async (id: String, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/orders/maritime/${id}/locations`);

            console.log("🚀 ~ fetchMarineOrderLocations ~ response:", response.data);
            return response.data as ApiResponse<MarineLocationResponse>;
        }
        catch (error: any) {
            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : { code: 0, message: "Network error" } as ApiError
            );
        }
    }
);

export default marineTripSlice.reducer;