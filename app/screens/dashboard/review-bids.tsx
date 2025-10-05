import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ButtonText } from '../../../components/ui/button';
import { ArrowLeftIcon, BellIcon, CheckCircleIcon, Icon, Location } from '../../../components/ui/icon';

interface BidData {
    id: string;
    bidderName: string;
    bidderImage: string;
    route: string;
    space: string;
    amount: string;
}

interface BidCardProps {
    bid: BidData;
    onRenegotiate: (bidId: string) => void;
    onAccept: (bidId: string) => void;
}

const BidCard: React.FC<BidCardProps> = ({ bid, onRenegotiate, onAccept }) => (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-100">
        {/* Bidder Info */}
        <View className="flex-row items-center mb-3">
            <View className="w-12 h-12 rounded-full mr-3 bg-[#E75B3B] items-center justify-center">
                <Text className="text-white text-lg font-bold">
                    {bid.bidderName.charAt(0)}
                </Text>
            </View>
            <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900 mb-1">
                    {bid.bidderName}
                </Text>
                <View className="flex-row items-center">
                    <Icon as={Location} size="sm" className="text-gray-500 mr-1" />
                    <Text className="text-gray-600 text-sm">{bid.route}</Text>
                </View>
            </View>
        </View>

        {/* Bid Details */}
        <View className="mb-4">
            <Text className="text-gray-700 mb-1">
                <Text className="font-medium">Space:</Text> {bid.space}
            </Text>
            <Text className="text-gray-700">
                <Text className="font-medium">Amount:</Text> {bid.amount}
            </Text>
        </View>

        {/* Action Buttons */}
        <View className="flex-row space-x-3 gap-3">
            <TouchableOpacity
                onPress={() => onRenegotiate(bid.id)}
                className="flex-1 border-[#E75B3B] border-[1.5px] rounded-xl py-3 items-center"
            >
                <Text className="text-[#E75B3B] font-medium">Renegotiate</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => onAccept(bid.id)}
                className="flex-1 bg-[#E75B3B] rounded-xl py-3 items-center"
            >
                <Text className="text-white font-medium">Accept</Text>
            </TouchableOpacity>
        </View>
    </View>
);

interface SuccessModalProps {
    visible: boolean;
    onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ visible, onClose }) => (
    <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
    >
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
            <View className="bg-white rounded-2xl p-8 w-full max-w-sm items-center">
                {/* Success Icon */}
                <View className="w-16 h-16 bg-white rounded-full items-center justify-center mb-6 border-4 border-green-500">
                    <Icon as={CheckCircleIcon} size="xl" className="text-green-500" />
                </View>

                {/* Success Message */}
                <Text className="text-xl font-semibold text-gray-900 text-center mb-2">
                    Success
                </Text>
                <Text className="text-gray-500 text-center mb-8 text-base">
                    Air booking #ID230297 accepted!
                </Text>

                {/* Close Button */}
                <Button
                    size="xl"
                    className="bg-[#E75B3B] rounded-lg w-full"
                    onPress={onClose}
                >
                    <ButtonText className="text-white font-semibold text-lg">
                        Close
                    </ButtonText>
                </Button>
            </View>
        </View>
    </Modal>
);

export default function ReviewBidsScreen() {
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Mock data - in real app this would come from props or API
    const tripInfo = {
        route: "Lagos (LOS) → Atlanta (ATL)",
        date: "in 3 days"
    };

    const bids: BidData[] = [
        {
            id: '1',
            bidderName: 'Kemi Johnson',
            bidderImage: '', // Will use default image
            route: 'Lagos (LOS) → Atlanta (ATL)',
            space: '12kg, 12x34x45cm',
            amount: '₦3,500'
        },
        {
            id: '2',
            bidderName: 'Temitope Joyce',
            bidderImage: '', // Will use default image
            route: 'Lagos (LOS) → Atlanta (ATL)',
            space: '12kg, 12x34x45cm',
            amount: '₦3,800'
        }
    ];

    const handleRenegotiate = (bidId: string) => {
        console.log('Renegotiate bid:', bidId);
        // TODO: Implement renegotiation logic
    };

    const handleAccept = (bidId: string) => {
        console.log('Accept bid:', bidId);
        setShowSuccessModal(true);

        setTimeout(() => {
            router.navigate('/screens/dashboard/depart-port');
        }, 2000);
        // TODO: Implement bid acceptance logic
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header */}
            <View className="bg-white h-16 px-4 flex-row items-center justify-between border-b border-gray-200">
                <TouchableOpacity className="p-2" onPress={() => router.back()}>
                    <Icon as={ArrowLeftIcon} size="lg" className="text-gray-700" />
                </TouchableOpacity>

                <Text className="text-lg font-semibold text-gray-900">Review Bids</Text>

                <TouchableOpacity className="p-2">
                    <View className="relative">
                        <Icon as={BellIcon} size="lg" className="text-[#E75B3B]" />
                        <View className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Trip Info Card */}
                <View className="mx-4 mt-4 mb-6">
                    <View className="bg-[#FEF7E6] rounded-lg p-4 border border-[#F5E6A3]">
                        <Text className="text-lg font-semibold text-gray-900 mb-1">
                            {tripInfo.route}
                        </Text>
                        <Text className="text-gray-700">
                            Date: {tripInfo.date}
                        </Text>
                    </View>
                </View>

                {/* Bids List */}
                <View className="px-4">
                    {bids.map((bid) => (
                        <BidCard
                            key={bid.id}
                            bid={bid}
                            onRenegotiate={handleRenegotiate}
                            onAccept={handleAccept}
                        />
                    ))}
                </View>

                {/* Empty State - Show when no bids */}
                {bids.length === 0 && (
                    <View className="flex-1 items-center justify-center px-4 py-20">
                        <Text className="text-gray-500 text-center text-lg mb-2">
                            No bids received yet
                        </Text>
                        <Text className="text-gray-400 text-center">
                            Bids will appear here when travelers are interested in your trip
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Success Modal */}
            <SuccessModal
                visible={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
            />
        </SafeAreaView>
    );
}