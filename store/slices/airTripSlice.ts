
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../lib/api/client";
import { AirLocation, AirTrip, AirTripRequest, ApiError, ApiResponse, Booking, BookingDetail } from "../../models";


interface AvailableFlightNumber {
    flightNumber: string;
    departurePayload: DeparturePayload;
    arrivalPayload: ArrivalPayload;
    cancelled: boolean;
    diverted: boolean;
    blocked: boolean;

}

interface DeparturePayload {
    code: string;
    code_icao: string;
    code_iata: string;
    code_lid: null;
    timezone: string;
    name: string;
    city: string;
    airport_info_url: string;

}

interface ArrivalPayload {
    code: string;
    code_icao: string;
    code_iata: string;
    code_lid: null;
    timezone: string;
    name: string;
    city: string;
    airport_info_url: string;
}

interface AirTripState {
    airTrip: AirTrip;
    airTrips: AirTrip[];
    loading: boolean;
    availableFlightNumbers: AvailableFlightNumber[];
    error: ApiError | null;
    loadingBookings: boolean;
    airBookings: Booking[];
    airBookingDetail: BookingDetail;
    loadingOrderLocation: boolean;
    orderLocations: AirLocation[];
}

interface AirLocationResponse {
    locations: AirLocation[]
}


const initialState: AirTripState = {
    airTrip: {
        _id: "",
        creatorId: "",
        flightId: "",
        status: "",
        fleetType: "",
        departureCity: "",
        departureAirport: {
            iata: "",
            icao: "",
            name: "",
            city: "",
            country: "",
            latitude: 0,
            longitude: 0,
        },
        arrivalCity: "",
        arrivalAirport: {
            iata: "",
            icao: "",
            name: "",
            city: "",
            country: "",
            latitude: 0,
            longitude: 0,
        },
        bids_recieved: [],
        createdAt: "",
        updatedAt: "",
        tripId: "",
        airlineName: "",
        flightNumber: "",
        departureDate: "",
        arrivalDate: "",
        capacity: {
            pounds: "",
            dimension: "",
        },
        route: {
            via: [] // Add the necessary properties here
        },
    },
    airBookings: [],
    airBookingDetail: {} as BookingDetail,
    loadingBookings: false,
    // ...
    availableFlightNumbers: [] as AvailableFlightNumber[],
    airTrips: [],
    loading: false,
    loadingOrderLocation: false,
    orderLocations: [],
    error: null,
};

const airTripSlice = createSlice({
    name: "airTrip",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(saveAirTrip.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(saveAirTrip.fulfilled, (state, action) => {
                state.loading = false;
                state.airTrips.push(action.payload.data);

            })
            .addCase(saveAirTrip.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiError;
            }).addCase(availableFlightNumbers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(availableFlightNumbers.fulfilled, (state, action) => {
                state.loading = false;
                state.availableFlightNumbers = action.payload.data;

            })
            .addCase(availableFlightNumbers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiError;
            }).addCase(fetchAirTrips.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAirTrips.fulfilled, (state, action) => {
                state.loading = false;
                state.airTrips = action.payload.data ?? [];

            })
            .addCase(fetchAirTrips.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiError;
            }).addCase(fetchAirTripById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAirTripById.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.data) {

                    state.airTrip = action.payload.data;

                }

            })
            .addCase(fetchAirTripById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiError;
            }).addCase(fetchAirBookings.pending, (state) => {
                state.loadingBookings = true;
                state.error = null;
            })
            .addCase(fetchAirBookings.fulfilled, (state, action) => {
                state.loadingBookings = false;
                state.airBookings = action.payload.data ?? [];

            })
            .addCase(fetchAirBookings.rejected, (state, action) => {
                state.loadingBookings = false;
                state.error = action.payload as ApiError;
            }).addCase(fetchAirBookingDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAirBookingDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.airBookingDetail = action.payload.data as BookingDetail;
            })
            .addCase(fetchAirBookingDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiError;
            }).addCase(fetchAirOrderLocations.pending, (state) => {
                state.loadingOrderLocation = true;
                state.error = null;
            })
            .addCase(fetchAirOrderLocations.fulfilled, (state, action) => {
                state.loadingOrderLocation = false;
                state.orderLocations = action.payload.data?.locations ?? [];

                console.log("order location state",state.orderLocations);

            })
            .addCase(fetchAirOrderLocations.rejected, (state, action) => {
                ;
                state.loadingOrderLocation = false;;
                state.error = action.payload as ApiError;
            })
    },
});



export const saveAirTrip = createAsyncThunk(
    "airTrip/saveAirTrip",
    async (payload: AirTripRequest, { rejectWithValue }) => {
        try {
            const response = await apiClient.post<ApiResponse<any>>(
                "/trip/flights",
                payload,
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


export const availableFlightNumbers = createAsyncThunk(
    "airTrip/availableFlightNumbers",
    async (payload: { departureAirportIata: string; departureDate: string; arrivalDate: string }, { rejectWithValue }) => {
        try {

            const response = await apiClient.post<ApiResponse<any>>(
                "/trip/available/flight-numbers",
                payload,
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


export const fetchAirTrips = createAsyncThunk(
    "airTrip/fetchAirTrips",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ApiResponse<AirTrip[]>>(
                "/trip/flights",
            );


            return response.data as ApiResponse<AirTrip[]>;
        } catch (error: any) {


            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : { code: 0, message: "Network error" } as ApiError
            );
        }
    }
);

export const fetchAirTripById = createAsyncThunk(
    "airTrip/fetchAirTripById",
    async (tripId: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ApiResponse<AirTrip>>(
                `/trip/flight/${tripId}`,
            );


            return response.data as ApiResponse<AirTrip>;
        } catch (error: any) {

            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : { code: 0, message: "Network error" } as ApiError
            );
        }
    }
);


export const fetchAirBookings = createAsyncThunk(
    "airTrip/fetchAirBookings",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ApiResponse<Booking[]>>(
                "/trip/air/booking/history",
            );


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

export const fetchAirBookingDetail = createAsyncThunk(
    "airTrip/fetchAirBookingDetail",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ApiResponse<BookingDetail>>(
                `/trip/booking/detail/${id}`,
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

export const fetchAirOrderLocations = createAsyncThunk(
    "airTrip/fetchAirOrderLocations",
    async (id: String, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/orders/air/${id}/locations`);
          
            return response.data as ApiResponse<AirLocationResponse>;
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

export default airTripSlice.reducer;





