import { router } from 'expo-router';
import { CheckCircleIcon, MapPinIcon, XCircleIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useShowToast } from '../../hooks/useShowToast';
import { GroundTrip } from '../../models';

interface GroundTripCardProps {
  trip: GroundTrip;
  onAccept: (tripId: string) => Promise<void>;
  onReject: (tripId: string) => Promise<void>;
  showActions?: boolean;
}

const LocationIcon = () => (
  <MapPinIcon size={16} color="#6B7280" />
);

export const GroundTripCard: React.FC<GroundTripCardProps> = ({
  trip,
  onAccept,
  onReject,
  showActions = true
}) => {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const showToast = useShowToast();

  const handleAccept = async () => {
    try {
      setIsAccepting(true);
      await onAccept(trip.id);
      showToast({
        title: "Booking Accepted",
        description: `Successfully accepted booking ${trip.trackingId}`,
        icon: CheckCircleIcon,
        action: "success"
      });
    } catch (error: any) {
      showToast({
        title: "Accept Failed",
        description: error.message || "Failed to accept booking. Please try again.",
        icon: XCircleIcon,
        action: "error"
      });
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsRejecting(true);
      await onReject(trip.id);
      showToast({
        title: "Booking Rejected",
        description: `Successfully rejected booking ${trip.trackingId}`,
        icon: CheckCircleIcon,
        action: "success"
      });
    } catch (error: any) {
      showToast({
        title: "Reject Failed",
        description: error.message || "Failed to reject booking. Please try again.",
        icon: XCircleIcon,
        action: "error"
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const handleStartTrip = () => {
    router.push(`/screens/dashboard/trip-status-management?tripId=${trip.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'GOING_TO_PICKUP':
      case 'PICKED_UP':
      case 'IN_TRANSIT':
      case 'ARRIVED_DESTINATION':
      case 'DELIVERED':
      case 'TOLL_BILL_PENDING':
      case 'TOLL_BILL_PAID':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100">
      {/* Header with tracking ID and status */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-semibold text-gray-900">{trip.trackingId}</Text>
        <View className={`px-2 py-1 rounded-full ${getStatusColor(trip.status)}`}>
          <Text className="text-xs font-medium">{trip.status}</Text>
        </View>
      </View>

      {/* Location info */}
      <View className="flex-row items-center mb-2">
        <LocationIcon />
        <Text className="text-gray-600 ml-2 flex-1">
          {trip.pickUpLocation} → {trip.dropOffLocation}
        </Text>
      </View>

      {/* Weight and price */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-gray-600">
          <Text className="font-medium">Weight:</Text> {trip.weight}kg
        </Text>
        <Text className="text-gray-600">
          <Text className="font-medium">Price:</Text> ₦{trip.price?.toLocaleString() || 'N/A'}
        </Text>
      </View>

      {/* Customer and date info */}
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-gray-500 text-sm">Customer: {trip.customer}</Text>
          <Text className="text-gray-500 text-sm">
            Booked: {formatDate(trip.dateOfBooking)}
          </Text>
        </View>
      </View>

      {/* Action buttons - only show for pending bookings */}
      {showActions && trip.status.toUpperCase() === 'PENDING' && (
        <View className="flex-row space-x-3 gap-3">
          <TouchableOpacity
            onPress={handleReject}
            disabled={isRejecting || isAccepting}
            className={`flex-1 border-red-500 border-[1.5px] rounded-xl py-3 items-center ${isRejecting || isAccepting ? 'opacity-50' : ''
              }`}
          >
            {isRejecting ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <Text className="text-red-500 font-medium">Reject</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAccept}
            disabled={isAccepting || isRejecting}
            className={`flex-1 bg-[#E75B3B] rounded-xl py-3 items-center ${isAccepting || isRejecting ? 'opacity-50' : ''
              }`}
          >
            {isAccepting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text className="text-white font-medium">Accept</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Start Trip button for accepted bookings */}
      {trip.status.toUpperCase() === 'ACCEPTED' && (
        <TouchableOpacity
          onPress={handleStartTrip}
          className="bg-[#E75B3B] rounded-xl py-3 items-center flex-row justify-center"
        >
          <PlayIcon size={20} color="#FFFFFF" />
          <Text className="text-white font-medium ml-2">Start Trip</Text>
        </TouchableOpacity>
      )}

      {/* Show status message for other non-pending bookings */}
      {trip.status.toUpperCase() !== 'PENDING' && trip.status.toUpperCase() !== 'ACCEPTED' && (
        <View className="bg-gray-50 rounded-lg p-3">
          <Text className="text-gray-600 text-center text-sm">
            Status: {trip.status.replace(/_/g, ' ').toLowerCase()}
          </Text>
        </View>
      )}

      {/* Show rejected message */}
      {trip.status.toUpperCase() === 'REJECTED' && (
        <View className="bg-red-50 rounded-lg p-3">
          <Text className="text-red-600 text-center text-sm">
            This booking has been rejected
          </Text>
        </View>
      )}
    </View>
  );
};

export default GroundTripCard;
