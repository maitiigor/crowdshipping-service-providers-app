import { MaterialIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { ChevronLeft, CircleCheckIcon, Edit, HelpCircleIcon, Plus, Trash2 } from "lucide-react-native";
import React, { useEffect } from "react";
import {
    Alert,
    Image,
    ScrollView,
    TouchableOpacity
} from "react-native";
import { useDispatch } from "react-redux";
import NotificationIconComponent from "../../../components/NotificationIconComponent";
import ParallaxScrollView from "../../../components/ParallaxScrollView";
import { ThemedText } from "../../../components/ThemedText";
import { ThemedView } from "../../../components/ThemedView";
import { Box } from "../../../components/ui/box";
import { Button, ButtonText } from "../../../components/ui/button";
import { HStack } from "../../../components/ui/hstack";
import { Icon } from "../../../components/ui/icon";
import { Skeleton, SkeletonText } from "../../../components/ui/skeleton";
import { useShowToast } from '../../../hooks/useShowToast';
import { Vehicle } from "../../../models";
import { AppDispatch, useAppSelector } from "../../../store";
import { deleteVehicle, fetchVehicles, setVehicle } from "../../../store/slices/vechileSlice";

interface VehicleCardProps {
    vehicle: Vehicle;
    onEdit: (vehicle: Vehicle) => void;
    onDelete: (vehicleId: string) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onEdit, onDelete }) => {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'bg-green-100';
            case 'disabled':
                return 'bg-red-100';
            case 'pending':
            case 'pending approval':
                return 'bg-orange-100';
            default:
                return 'bg-gray-100';
        }
    };

    const getStatusTextColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'text-green-800';
            case 'disabled':
                return 'text-red-800';
            case 'pending':
            case 'pending approval':
                return 'text-orange-800';
            default:
                return 'text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'Approved';
            case 'disabled':
                return 'Disabled';
            case 'pending':
                return 'Pending Approval';
            default:
                return status;
        }
    };

    const getVehicleImage = () => {
        if (vehicle.image) {
            return { uri: vehicle.image };
        }
        // Return placeholder based on vehicle type or make
        const make = vehicle.make.toLowerCase();
        if (make.includes('truck') || make.includes('lorry')) {
            return require('../../../assets/home/road-delivery.png');
        } else if (make.includes('bike') || make.includes('motorcycle')) {
            return require('../../../assets/home/bike.png');
        } else {
            return require('../../../assets/home/road-delivery.png');
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Vehicle",
            "Are you sure you want to delete this vehicle?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => onDelete(vehicle._id)
                }
            ]
        );
    };

    return (
        <TouchableOpacity onPress={() => {

            setVehicle(vehicle)
            router.push({
                pathname: `/screens/vehicles/details`, params: { vehicleId: vehicle._id }

            })
        }}>
            <ThemedView className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-100">
                <ThemedView className="flex-row justify-between items-start">
                    <ThemedView className="flex-1">
                        <ThemedText className="text-lg text-center font-semibold text-gray-900 mb-1">
                            {vehicle.make} {vehicle.model}
                        </ThemedText>
                        <ThemedText className="text-sm text-gray-500 mb-1">
                            Car Model: {vehicle.model}-{vehicle.year}
                        </ThemedText>
                        <ThemedText className="text-sm text-gray-500 mb-3">
                            {vehicle.licensePlate}
                        </ThemedText>
                        <ThemedView className="flex-row items-center">
                            <ThemedText className="text-sm text-gray-500 mr-2">Current Status</ThemedText>
                            <ThemedView className={`px-3 py-1 rounded-full ${getStatusColor(vehicle.status)}`}>
                                <ThemedText className={`text-xs font-medium ${getStatusTextColor(vehicle.status)}`}>
                                    {getStatusText(vehicle.status)}
                                </ThemedText>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>

                    {/* Vehicle Image */}
                    <ThemedView className="ml-4">
                        <Image
                            source={getVehicleImage()}
                            className="w-20 h-16 rounded-lg"
                            resizeMode="contain"
                        />
                    </ThemedView>
                </ThemedView>

                {/* Action Buttons */}
                <ThemedView className="flex-row justify-end mt-4 space-x-2">
                    {/* Delete Button */}
                    <TouchableOpacity
                        onPress={handleDelete}
                        className="bg-red-500 p-3 rounded-lg"
                    >
                        <Trash2 size={20} color="white" />
                    </TouchableOpacity>

                    {/* Edit Button - only show for pending status */}
                    {vehicle.status.toLowerCase() === 'pending' && (
                        <TouchableOpacity
                            onPress={() => onEdit(vehicle)}
                            className="bg-blue-500 p-3 rounded-lg ml-2"
                        >
                            <Edit size={20} color="white" />
                        </TouchableOpacity>
                    )}
                </ThemedView>
            </ThemedView>
        </TouchableOpacity>

    );
};

export default function MyVehiclesScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const { vehicles, loading } = useAppSelector((state) => state.vechile);
    const showToast: any = useShowToast();

    useEffect(() => {
        // For testing purposes, use mock data. In production, use fetchVehicles()
        dispatch(fetchVehicles());
        // dispatch(fetchVehicles());
    }, [dispatch]);



    const handleEditVehicle = (vehicle: Vehicle) => {
        // Navigate to edit vehicle screen with vehicle data
        // For now, we'll navigate to add-vehicle screen
        // You might want to create a separate edit screen or modify add-vehicle to handle editing
        router.push({
            pathname: '/screens/vehicles/add-vehicle',
            params: { vehicleId: vehicle._id }
        });
    };

    const handleDeleteVehicle = (vehicleId: string) => {
        dispatch(deleteVehicle(vehicleId)).unwrap().then(() => {
            showToast({
                title: "Success",
                description: "Vehicle deleted successfully",
                icon: CircleCheckIcon,
                action: "success",
            });
        }).catch((error) => {
            showToast({
                title: "Error",
                description: error.message || "Failed to delete vehicle. Please try again.",
                icon: HelpCircleIcon,
                action: "error",
            });
        });
    };

    const handleAddVehicle = () => {
        router.push('/screens/vehicles/add-vehicle');
    };

    const handleRefresh = () => {
        dispatch(fetchVehicles());
    };

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: () => {
                return (
                    <ThemedText type="s1_subtitle" className="text-center">
                        My Vehicles
                    </ThemedText>
                );
            },
            headerTitleAlign: "center",
            headerTitleStyle: { fontSize: 20 }, // Increased font size
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: "#FFFFFF",
                elevation: 0, // Android
                shadowOpacity: 0, // iOS
                shadowColor: "transparent", // iOS
                borderBottomWidth: 0,
            },
            headerLeft: () => (
                <ThemedView
                    style={{
                        shadowColor: "#FDEFEB1A",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.102,
                        shadowRadius: 3,
                        elevation: 4,
                    }}
                >
                    <ThemedView
                        style={{
                            shadowColor: "#0000001A",
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.102,
                            shadowRadius: 2,
                            elevation: 2,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="p-2 rounded   flex justify-center items-center"
                        >
                            <Icon
                                as={ChevronLeft}
                                size="3xl"
                                className="text-typography-900"
                            />
                        </TouchableOpacity>
                    </ThemedView>
                </ThemedView>
            ),
            headerRight: () => <NotificationIconComponent />,
        });
    }, [navigation, router]);

    return (
        <ParallaxScrollView headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}>



            {/* Content */}
            <ThemedView className="flex-1 px-6 pt-4">
                {loading ? (
                    Array.from({ length: 7 }).map((_: any, index: number) => (
                        <ThemedView key={index} className="w-full">
                            <Box className="w-full gap-4 p-3 rounded-md ">
                                <SkeletonText _lines={3} className="h-2" />
                                <HStack className="gap-1 align-middle">
                                    <Skeleton
                                        variant="circular"
                                        className="h-[24px] w-[28px] mr-2"
                                    />
                                    <SkeletonText _lines={2} gap={1} className="h-2 w-2/5" />
                                </HStack>
                            </Box>
                        </ThemedView>
                    ))
                ) : vehicles.length === 0 ? (
                    <ThemedView className="flex-1 justify-center items-center">
                        <MaterialIcons name="directions-car" size={64} color="#9CA3AF" />
                        <ThemedText className="text-lg font-medium text-gray-900 mt-4 mb-2">
                            No Vehicles Added
                        </ThemedText>
                        <ThemedText className="text-gray-600 text-center mb-6">
                            You haven't added any vehicles yet. Add your first vehicle to get started.
                        </ThemedText>
                        <Button
                            onPress={handleAddVehicle}
                            className="bg-[#E75B3B] rounded-lg px-6 py-2   flex-row items-center justify-center"
                        >
                            <ButtonText className="text-white font-medium">
                                Add Your First Vehicle
                            </ButtonText>
                        </Button>
                    </ThemedView>
                ) : (
                    <>
                        <ScrollView
                            className="flex-1"
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 100 }}
                        >
                            {vehicles.map((vehicle) => (
                                <VehicleCard
                                    key={vehicle._id}
                                    vehicle={vehicle}
                                    onEdit={handleEditVehicle}
                                    onDelete={handleDeleteVehicle}
                                />
                            ))}
                        </ScrollView>

                        {/* Add Vehicle Button */}
                        <ThemedView className="absolute bottom-6 left-6 right-6">
                            <Button
                                onPress={handleAddVehicle}
                                className="bg-[#E75B3B] rounded-lg flex-row items-center justify-center"
                            >
                                <Plus size={20} color="white" className="mr-2" />
                                <ButtonText className="text-white font-medium  ml-2">
                                    Add Vehicle
                                </ButtonText>
                            </Button>
                        </ThemedView>
                    </>
                )}
            </ThemedView>
        </ParallaxScrollView>
    );
}