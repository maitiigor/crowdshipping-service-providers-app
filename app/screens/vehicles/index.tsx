import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { CircleCheckIcon, Edit, HelpCircleIcon, LucideIcon, Plus, Trash2 } from "lucide-react-native";
import React, { useEffect } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import CustomToast from '../../../components/Custom/CustomToast';
import { Button, ButtonText } from "../../../components/ui/button";
import { useToast } from '../../../components/ui/toast';
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
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-100">
                <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                        <Text className="text-lg text-center font-semibold text-gray-900 mb-1">
                            {vehicle.make} {vehicle.model}
                        </Text>
                        <Text className="text-sm text-gray-500 mb-1">
                            Car Model: {vehicle.model}-{vehicle.year}
                        </Text>
                        <Text className="text-sm text-gray-500 mb-3">
                            {vehicle.licensePlate}
                        </Text>
                        <View className="flex-row items-center">
                            <Text className="text-sm text-gray-500 mr-2">Current Status</Text>
                            <View className={`px-3 py-1 rounded-full ${getStatusColor(vehicle.status)}`}>
                                <Text className={`text-xs font-medium ${getStatusTextColor(vehicle.status)}`}>
                                    {getStatusText(vehicle.status)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Vehicle Image */}
                    <View className="ml-4">
                        <Image
                            source={getVehicleImage()}
                            className="w-20 h-16 rounded-lg"
                            resizeMode="contain"
                        />
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row justify-end mt-4 space-x-2">
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
                </View>
            </View>
        </TouchableOpacity>

    );
};

export default function MyVehiclesScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const { vehicles, loading } = useAppSelector((state) => state.vechile);
    const toast = useToast();

    useEffect(() => {
        // For testing purposes, use mock data. In production, use fetchVehicles()
        dispatch(fetchVehicles());
        // dispatch(fetchVehicles());
    }, [dispatch]);

    const showNewToast = ({
        title,
        description,
        icon,
        action = "error",
        variant = "solid",
    }: {
        title: string;
        description: string;
        icon: LucideIcon;
        action: "error" | "success" | "info" | "muted" | "warning";
        variant: "solid" | "outline";
    }) => {
        const newId = Math.random();
        toast.show({
            id: newId.toString(),
            placement: "top",
            duration: 3000,
            render: ({ id }) => {
                const uniqueToastId = "toast-" + id;
                return (
                    <CustomToast
                        uniqueToastId={uniqueToastId}
                        icon={icon}
                        action={action}
                        title={title}
                        variant={variant}
                        description={description}
                    />
                );
            },
        });
    };

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
            showNewToast({
                title: "Success",
                description: "Vehicle deleted successfully",
                icon: CircleCheckIcon,
                action: "success",
                variant: "solid",
            });
        }).catch((error) => {
            showNewToast({
                title: "Error",
                description: error.message || "Failed to delete vehicle. Please try again.",
                icon: HelpCircleIcon,
                action: "error",
                variant: "solid",
            });
        });
    };

    const handleAddVehicle = () => {
        router.push('/screens/vehicles/add-vehicle');
    };

    const handleRefresh = () => {
        dispatch(fetchVehicles());
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 pt-10 py-4 bg-white">
                <TouchableOpacity className="p-2" onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={24} color="#000" />
                </TouchableOpacity>

                <Text className="text-lg font-semibold text-black">
                    My Vehicle
                </Text>

                <TouchableOpacity className="p-2" onPress={handleRefresh}>
                    <MaterialIcons name="notifications-none" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View className="flex-1 px-6 pt-4">
                {loading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#E75B3B" />
                        <Text className="mt-2 text-gray-600">Loading vehicles...</Text>
                    </View>
                ) : vehicles.length === 0 ? (
                    <View className="flex-1 justify-center items-center">
                        <MaterialIcons name="directions-car" size={64} color="#9CA3AF" />
                        <Text className="text-lg font-medium text-gray-900 mt-4 mb-2">
                            No Vehicles Added
                        </Text>
                        <Text className="text-gray-600 text-center mb-6">
                            You haven't added any vehicles yet. Add your first vehicle to get started.
                        </Text>
                        <Button
                            onPress={handleAddVehicle}
                            className="bg-[#E75B3B] rounded-lg px-6 py-2   flex-row items-center justify-center"
                        >
                            <ButtonText className="text-white font-medium">
                                Add Your First Vehicle
                            </ButtonText>
                        </Button>
                    </View>
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
                        <View className="absolute bottom-6 left-6 right-6">
                            <Button
                                onPress={handleAddVehicle}
                                className="bg-[#E75B3B] rounded-lg flex-row items-center justify-center"
                            >
                                <Plus size={20} color="white" className="mr-2" />
                                <ButtonText className="text-white font-medium  ml-2">
                                    Add Vehicle
                                </ButtonText>
                            </Button>
                        </View>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}