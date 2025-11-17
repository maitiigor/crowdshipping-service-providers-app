import { router } from 'expo-router';
import { CheckCircleIcon, MapPinIcon, PlayIcon, XCircleIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { useShowToast } from '../../hooks/useShowToast';
import { GroundTrip } from '../../models';
import { setGroundTrip } from '../../store/slices/groundTripSlice';

interface GroundTripCardProps {
  trip: GroundTrip;
  onAccept: (tripId: string) => Promise<void> | null;
  onReject: (tripId: string) => Promise<void> | null;
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
  const dispatch = useDispatch();

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
    console.log("Starting trip:", trip);
    dispatch(setGroundTrip(trip));
    router.push(`/screens/dashboard/trip-status-management?tripId=${trip.id}&type=Ground`);
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
    <ThemedView className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100">
      {/* Header with tracking ID and status */}
      <ThemedView className="flex-row items-center justify-between mb-3">
        <ThemedText className="text-lg font-semibold text-gray-900">{trip.trackingId}</ThemedText>
        <ThemedView className={`px-2 py-1 rounded-full ${getStatusColor(trip.status)}`}>
          <ThemedText className="text-xs font-medium">{trip.status}</ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Location info */}
      <ThemedView className="flex-row items-center mb-2">
        <LocationIcon />
        <ThemedText className="text-gray-600 ml-2 flex-1">
          {trip.pickUpLocation.address} → {trip.dropOffLocation.address}
        </ThemedText>
      </ThemedView>

      {/* Weight and price */}
      <ThemedView className="flex-row items-center justify-between mb-3">
        <ThemedText className="text-gray-600">
          <ThemedText className="font-medium">Weight:</ThemedText> {trip.weight}kg
        </ThemedText>
        <ThemedText className="text-gray-600">
          <ThemedText className="font-medium">Price:</ThemedText> ₦{trip.price?.toLocaleString() || 'N/A'}
        </ThemedText>
      </ThemedView>

      {/* Customer and date info */}
      <ThemedView className="flex-row items-center justify-between mb-4">
        <ThemedView>
          <ThemedText className="text-gray-500 text-sm">Customer: {trip.customer}</ThemedText>
          <ThemedText className="text-gray-500 text-sm">
            Booked: {formatDate(trip.dateOfBooking)}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Action buttons - only show for pending bookings */}
      {
        showActions && trip.status.toUpperCase() === 'PENDING' && (
          <ThemedView className="flex-row space-x-3 gap-3">
            <TouchableOpacity
              onPress={handleReject}
              disabled={isRejecting || isAccepting}
              className={`flex-1 border-red-500 border-[1.5px] rounded-xl py-3 items-center ${isRejecting || isAccepting ? 'opacity-50' : ''
                }`}
            >
              {isRejecting ? (
                <ActivityIndicator size="small" color="#EF4444" />
              ) : (
                <ThemedText className="text-red-500 font-medium">Reject</ThemedText>
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
                <ThemedText className="text-white font-medium">Accept</ThemedText>
              )}
            </TouchableOpacity>
          </ThemedView>
        )
      }

      {/* Start Trip button for accepted bookings */}
      {
        [
          'going_to_pickup',
          'picked_up',
          'in_transit',
          'arrived_destination',
          'delivered',
          'toll_bill_pending',
          'toll_bill_paid',
          'in_progress',
        ].includes(trip.status.toLowerCase()) && (
          <TouchableOpacity
            onPress={handleStartTrip}
            className="bg-[#E75B3B] rounded-xl py-3 items-center flex-row justify-center"
          >
            <PlayIcon size={16} color="#FFFFFF" />
            <ThemedText className="text-white font-medium ml-2"> Manage Trip</ThemedText>
          </TouchableOpacity>
        )
      }

      {/* Show status message for other non-pending bookings */}
      {
        trip.status.toUpperCase() !== 'PENDING' && trip.status.toUpperCase() !== 'ACCEPTED' && (
          <ThemedView className="bg-gray-50 rounded-lg p-3">
            <ThemedText className="text-gray-600 text-center text-sm">
              Status: {trip.status.replace(/_/g, ' ').toLowerCase()}
            </ThemedText>
          </ThemedView>
        )
      }

      {/* Show rejected message */}
      {
        trip.status.toUpperCase() === 'REJECTED' && (
          <ThemedView className="bg-red-50 rounded-lg p-3">
            <ThemedText className="text-red-600 text-center text-sm">
              This booking has been rejected
            </ThemedText>
          </ThemedView>
        )
      }
    </ThemedView >
  );
};

export default GroundTripCard;
