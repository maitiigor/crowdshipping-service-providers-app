import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import NotificationIconComponent from '../../../components/NotificationIconComponent';
import ParallaxScrollView from '../../../components/ParallaxScrollView';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { Icon } from '../../../components/ui/icon';
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
        <ThemedView className={`${config.bgColor} ${config.borderColor} border-2 border-dashed rounded-lg p-4 mb-4`}>
            <ThemedView className="flex-row justify-between items-start mb-2">
                <ThemedView className="flex-1">
                    <ThemedText className="text-lg font-semibold text-gray-900 mb-1">{title}</ThemedText>

                    {/* {expiryDate && (
                        <ThemedText className="text-gray-600 text-base mt-1">Expires: {expiryDate}</ThemedText>
                    )}
                    {errorMessage && (
                        <ThemedText className="text-red-600 text-base mt-1">{errorMessage}</ThemedText>
                    )} */}
                </ThemedView>
                <ThemedView className={`${config.badgeBg} px-3 py-1 rounded-full`}>
                    <ThemedText className={`${config.badgeText} text-xs font-medium`}>
                        {config.statusText}
                    </ThemedText>
                </ThemedView>
            </ThemedView>
        </ThemedView>
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
            <ThemedView className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#E75B3B" />
                <ThemedText className="text-gray-500 mt-2">Loading vehicle details...</ThemedText>
            </ThemedView>
        );
    }

    if (!vehicle) {
        return (
            <ThemedView className="flex-1 bg-white justify-center items-center px-6">
                <ThemedText className="text-xl font-semibold text-gray-900 mb-2">Vehicle Not Found</ThemedText>
                <ThemedText className="text-gray-600 text-center mb-6">
                    The vehicle you're looking for could not be found.
                </ThemedText>
                <TouchableOpacity
                    onPress={handleGoBack}
                    className="bg-[#E75B3B] px-6 py-3 rounded-lg"
                >
                    <ThemedText className="text-white font-medium">Go Back</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: () => {
                return (
                    <ThemedText type="s1_subtitle" className="text-center">
                        Notifications
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
        <ThemedView className="flex-1 bg-white">


            <ParallaxScrollView headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}>
                {/* Vehicle Info */}
                <ThemedView className="items-center mb-8">
                    <ThemedText className="text-2xl font-bold text-gray-900 mb-2">
                        {vehicle.make} {vehicle.model}
                    </ThemedText>
                    <ThemedText className="text-gray-500 text-lg mb-1">
                        Car Model: {vehicle.model}-{vehicle.make.substring(0, 3).toUpperCase()}
                    </ThemedText>
                    <ThemedText className="text-gray-500 text-lg">
                        {vehicle.licensePlate}
                    </ThemedText>
                </ThemedView>

                {/* Document Status Cards */}
                <ThemedView className="mb-6">
                    {vehicle.vehicleDocuments.map((doc, index) => (
                        <DocumentStatusCard
                            key={index}
                            title={doc.name}
                            status={doc.status}
                        // expiryDate={doc.expiryDate}
                        // errorMessage={doc.errorMessage}
                        />
                    ))}
                </ThemedView>

                {/* Bottom spacing */}
                <ThemedView className="h-20" />
            </ParallaxScrollView>
        </ThemedView>
    );
}