import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../lib/api/client";
import { ApiError, ApiResponse, Booking, MarineTrip, MarineTripRequest, VesselOperator } from "../../models";

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
    error: ApiError | null;
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
    isLoadingVessels: false,
    vesselOperators: [],
    trips: [],
    loading: false,
    loadingTrips: false,
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
            console.log("fetched marine trip by id response:", response.data);
            console.log("fetched marine trip by id response. bbbbb:", response.data.data);
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
            });
    },
});

export const fetchMarineBookings = createAsyncThunk(
    "marineTrip/fetchMarineBookings",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ApiResponse<Booking[]>>(
                "/trip/maritime/booking/history",
            );

            console.log("list of trips booked", response.data)

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

export default marineTripSlice.reducer;