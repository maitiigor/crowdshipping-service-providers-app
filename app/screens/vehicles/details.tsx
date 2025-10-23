import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Vehicle } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../store';

interface DocumentStatusCardProps {
    title: string;
    status: string;
    expiryDate?: string;
    errorMessage?: string;
}

const DocumentStatusCard: React.FC<DocumentStatusCardProps> = ({
    title,
    status,
    // expiryDate,
    // errorMessage
}) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'approved':
                return {
                    bgColor: 'bg-green-50',
                    textColor: 'text-green-600',
                    borderColor: 'border-green-200',
                    badgeBg: 'bg-yellow-100',
                    badgeText: 'text-yellow-800',
                    statusText: 'APPROVED'
                };
            case 'not-approved':
                return {
                    bgColor: 'bg-red-50',
                    textColor: 'text-red-600',
                    borderColor: 'border-red-200',
                    badgeBg: 'bg-red-100',
                    badgeText: 'text-red-800',
                    statusText: 'NOT APPROVED'
                };
            case 'pending':
                return {
                    bgColor: 'bg-orange-50',
                    textColor: 'text-orange-600',
                    borderColor: 'border-orange-200',
                    badgeBg: 'bg-orange-100',
                    badgeText: 'text-orange-800',
                    statusText: 'PENDING'
                };
            default:
                return {
                    bgColor: 'bg-white',
                    textColor: 'text-gray-600',
                    borderColor: 'border-gray-200',
                    badgeBg: 'bg-gray-100',
                    badgeText: 'text-gray-800',
                    statusText: 'UNKNOWN'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <View className={`${config.bgColor} ${config.borderColor} border-2 border-dashed rounded-lg p-4 mb-4`}>
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900 mb-1">{title}</Text>

                    {/* {expiryDate && (
                        <Text className="text-gray-600 text-base mt-1">Expires: {expiryDate}</Text>
                    )}
                    {errorMessage && (
                        <Text className="text-red-600 text-base mt-1">{errorMessage}</Text>
                    )} */}
                </View>
                <View className={`${config.badgeBg} px-3 py-1 rounded-full`}>
                    <Text className={`${config.badgeText} text-xs font-medium`}>
                        {config.statusText}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default function VehicleDetailScreen() {
    const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
    const dispatch = useAppDispatch();
    const { vehicles, loading, } = useAppSelector((state) => state.vechile);
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);

    useEffect(() => {
        if (vehicleId && vehicles.length > 0) {
            const foundVehicle = vehicles.find(v => v._id === vehicleId);
            setVehicle(foundVehicle || null);
        }
    }, [vehicleId, vehicles]);

    const handleGoBack = () => {
        router.back();
    };

    const handleNotificationPress = () => {
        // TODO: Navigate to notifications
        console.log('Navigate to notifications');
    };




    if (loading) {
        return (
            <View className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#E75B3B" />
                <Text className="text-gray-500 mt-2">Loading vehicle details...</Text>
            </View>
        );
    }

    if (!vehicle) {
        return (
            <View className="flex-1 bg-white justify-center items-center px-6">
                <Text className="text-xl font-semibold text-gray-900 mb-2">Vehicle Not Found</Text>
                <Text className="text-gray-600 text-center mb-6">
                    The vehicle you're looking for could not be found.
                </Text>
                <TouchableOpacity
                    onPress={handleGoBack}
                    className="bg-[#E75B3B] px-6 py-3 rounded-lg"
                >
                    <Text className="text-white font-medium">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }


    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 pt-12 pb-6 bg-white">
                <TouchableOpacity
                    onPress={handleGoBack}
                    className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                >
                    <AntDesign name="arrowleft" size={24} color="#000" />
                </TouchableOpacity>

                <Text className="text-xl font-semibold text-gray-900">My Vehicle</Text>

                <TouchableOpacity
                    onPress={handleNotificationPress}
                    className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center relative"
                >
                    <TouchableOpacity className="p-2">
                        <MaterialIcons name="notifications-none" size={24} color="#000" />
                    </TouchableOpacity>
                    {/* Notification badge */}
                    <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center">
                        <Text className="text-white text-xs font-bold">3</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                {/* Vehicle Info */}
                <View className="items-center mb-8">
                    <Text className="text-2xl font-bold text-gray-900 mb-2">
                        {vehicle.make} {vehicle.model}
                    </Text>
                    <Text className="text-gray-500 text-lg mb-1">
                        Car Model: {vehicle.model}-{vehicle.make.substring(0, 3).toUpperCase()}
                    </Text>
                    <Text className="text-gray-500 text-lg">
                        {vehicle.licensePlate}
                    </Text>
                </View>

                {/* Document Status Cards */}
                <View className="mb-6">
                    {vehicle.vehicleDocuments.map((doc, index) => (
                        <DocumentStatusCard
                            key={index}
                            title={doc.name}
                            status={doc.status}
                        // expiryDate={doc.expiryDate}
                        // errorMessage={doc.errorMessage}
                        />
                    ))}
                </View>

                {/* Bottom spacing */}
                <View className="h-20" />
            </ScrollView>
        </View>
    );
}