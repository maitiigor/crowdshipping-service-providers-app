import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../lib/api/client";
import { AddVehicleRequest, ApiError, ApiResponse, Vehicle, VehicleCategory } from "../../models";


interface VehicleState {
    vehicle: Vehicle;
    vehicles: Vehicle[];
    vehicleCategories: VehicleCategory[];
    loading: boolean;
    error: ApiError | null;
}


const initialState: VehicleState = {
    vehicle: {
        make: "",
        model: "",
        year: 0,
        licensePlate: "",
        color: "",
        image: "",
        vehicleDocuments: [],
        _id: "",
        ownerId: "",
        categoryId: "",
        type: "",
        status: "",
        createdAt: "",
        updatedAt: "",
    },
    vehicleCategories: [],
    vehicles: [],
    loading: false,
    error: null,
};


const vehicleSlice = createSlice({
    name: "vehicle",
    initialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setVehicle(state, action) {
            console.log("Setting vehicle in slice:", action.payload);
            state.vehicle = action.payload;
        },
        setVehicles(state, action) {
            state.vehicles = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
        setMockVehicles(state) {
            state.vehicles = [
                {
                    _id: "1",
                    ownerId: "user1",
                    categoryId: "cat1",
                    type: "road",
                    make: "Toyota",
                    model: "Prius",
                    year: 2020,
                    licensePlate: "kJA233TY",
                    color: "Blue",
                    image: "",
                    vehicleDocuments: [],
                    status: "approved",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                },
                {
                    _id: "2",
                    ownerId: "user1",
                    categoryId: "cat2",
                    type: "road",
                    make: "Toyota",
                    model: "Prius",
                    year: 2019,
                    licensePlate: "IDG233IY",
                    color: "White",
                    image: "",
                    vehicleDocuments: [],
                    status: "disabled",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                },
                {
                    _id: "3",
                    ownerId: "user1",
                    categoryId: "cat3",
                    type: "road",
                    make: "Toyota",
                    model: "Corrola",
                    year: 2021,
                    licensePlate: "AGW233kf",
                    color: "Orange",
                    image: "",
                    vehicleDocuments: [],
                    status: "pending",
                    createdAt: "2024-01-01",
                    updatedAt: "2024-01-01",
                },
            ];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addVehicle.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(addVehicle.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.data)
                    state.vehicles.push(action.payload.data);
            })
            .addCase(addVehicle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiError;
            })
            .addCase(fetchVehicles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVehicles.fulfilled, (state, action) => {
                state.loading = false;
                state.vehicles = action.payload.data ?? [];
            })
            .addCase(fetchVehicles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiError;
            }).addCase(fetchVehicleCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVehicleCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.vehicleCategories = action.payload.data ?? [];
            })
            .addCase(fetchVehicleCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiError;
            })
            .addCase(deleteVehicle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteVehicle.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted vehicle from the vehicles array
                state.vehicles = state.vehicles.filter(vehicle => vehicle._id !== action.meta.arg);
            })
            .addCase(deleteVehicle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as ApiError;
            });
    },
});





export const addVehicle = createAsyncThunk(
    "trip/add-vehicle",
    async (payload: AddVehicleRequest, { rejectWithValue }) => {
        try {
            const response = await apiClient.post<ApiResponse<any>>(
                "/trip/add-vehicle",
                payload,
            );

            return response.data as ApiResponse<Vehicle>;

        } catch (error: any) {
            console.log("fjdjfdj:", error);

            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : { code: 0, message: "Network error" } as ApiError
            );
        }
    });

export const fetchVehicles = createAsyncThunk(
    "trip/my-vehicles",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ApiResponse<Vehicle[]>>(
                "/trip/my-vehicles",
            );

            return response.data;

        } catch (error: any) {


            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : { code: 0, message: "Network error" } as ApiError
            );
        }
    });


export const fetchVehicleCategories = createAsyncThunk(
    "trip/vehicle-categories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<ApiResponse<VehicleCategory[]>>(
                "/trip/vehicle-categories",
            );

            return response.data;

        } catch (error: any) {

            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : { code: 0, message: "Network error" } as ApiError
            );
        }
    });

export const deleteVehicle = createAsyncThunk(
    "trip/delete-vehicle",
    async (vehicleId: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete<ApiResponse<any>>(
                `/trip/delete-vehicle/${vehicleId}`,
            );

            return response.data;

        } catch (error: any) {
            console.log("Delete vehicle error:", error);

            return rejectWithValue(
                error.response?.data
                    ? { code: error.response.status, message: error.response.data.message }
                    : { code: 0, message: "Network error" } as ApiError
            );
        }
    });

export const { setLoading, setVehicle, setVehicles, setError, clearError, setMockVehicles } = vehicleSlice.actions;

export default vehicleSlice.reducer;