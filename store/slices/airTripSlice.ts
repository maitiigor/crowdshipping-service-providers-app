
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../lib/api/client";
import { AirTrip, AirTripRequest, ApiError, ApiResponse } from "../../models";


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
    // ...
    availableFlightNumbers: [] as AvailableFlightNumber[],
    airTrips: [],
    loading: false,
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
                    console.log("fetched air trip: ", state.airTrip);
                }

            })
            .addCase(fetchAirTripById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiError;
            });
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
            console.log("save air trip error:", error)

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
            console.log("available flight numbers error:", error)

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

            console.log("ftch air trips data: ", response.data);

            return response.data as ApiResponse<AirTrip[]>;
        } catch (error: any) {
            console.log("fetch air trips error:", error)

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
            console.log("fetch air trip by id error:", error)

            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : { code: 0, message: "Network error" } as ApiError
            );
        }
    }
);

export default airTripSlice.reducer;





