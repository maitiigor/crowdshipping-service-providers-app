import { LogoutModal } from '@/components/ui/logout-modal';
import { Href, router } from 'expo-router';
import { Car, Plus, Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Aeroplane,
  BellNotification,
  ChatBubble,
  HomeAlt,
  Icon,
  Inbox,
  Location,
  Logout,
  MenuScale,
  Notes,
  PrivacyPolicy,
  Refresh,
  Settings,
  Sharpship,
  VechileCar,
  Wallet
} from '../../../components/ui/icon';
import { AirTrip, MarineTrip } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchAirTrips } from '../../../store/slices/airTripSlice';
import { logout } from '../../../store/slices/authSlice';
import { fetchMarineTrips } from '../../../store/slices/marineTripSlice';

// UI Components

// Icons (using simple text/emoji for now, can be replaced with proper icons)
const MenuIcon = () => <Icon as={MenuScale} size="2xl" />;
const NotificationIcon = () => <Icon as={Location} size="xl" className="#E75B3B" />;
const SearchIcon = () => <Search className='text-[#9EA2AE]' />;
const LocationIcon = () => <Icon as={Location} size="xl" className="text-[#E75B3B]" />;
const HomeIcon = () => <Icon as={HomeAlt} size="xl" />;
const BookingIcon = () => <Icon as={Refresh} size="xl" />;
const InboxIcon = () => <Icon as={Inbox} size='xl' className="text-typography-900 text-gray-800" />;
const PaymentIcon = () => <Icon as={Wallet} size="xl" />;
const ComplaintsIcon = () => <Icon as={ChatBubble} size="xl" />;
const SupportIcon = () => <Icon as={ChatBubble} size="xl" />;
const NotificationsIcon = () => <Icon as={BellNotification} size="xl" />;
const TermsIcon = () => <Icon as={Notes} size="xl" />;
const PrivacyIcon = () => <Icon as={PrivacyPolicy} size="xl" />;
const SettingsIcon = () => <Icon as={Settings} size="xl" />;
const LogoutIcon = () => <Icon as={Logout} size="xl" className="text-red-500" />;
const AirIcon = ({ isActive }: { isActive?: boolean }) => (
  <Icon as={Aeroplane} size="2xl" fill="red" className={isActive ? 'text-white' : 'text-black'} />
);
const GroundIcon = ({ isActive }: { isActive?: boolean }) => (
  <Icon as={VechileCar} size="2xl" className={isActive ? 'text-white' : 'text-black'} />
);
const MaritimeIcon = ({ isActive }: { isActive?: boolean }) => (
  <Icon as={Sharpship} size="2xl" className={isActive ? 'text-white' : 'text-black'} />
);

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
}

interface TripCardProps {
  title: string;
  location: string;
  weight: string;
  postedBy: string;
  timeAgo: string;
  onPlaceBid: () => void;
}

interface MarineTripCardProps {
  trip: MarineTrip;
  onRefresh?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose, onEditProfile, onLogout }) => {
  if (!isVisible) return null;

  const [isOnline, setIsOnline] = useState(false);

  const user = useAppSelector((state) => state.auth.user);

  const firstName = user.fullName.split(' ')[0];

  const setAvailablity = () => {
    setIsOnline(!isOnline);
  };

  const menuItems = [
    { icon: <HomeIcon />, label: 'Home', active: true, onPress: () => { } },
    { icon: <Car />, label: 'My Vehicles', onPress: () => router.push('/screens/vehicles') },
    { icon: <BookingIcon />, label: 'Booking History', onPress: () => router.push('/screens/bookings') },
    { icon: <InboxIcon />, label: 'Inbox', onPress: () => router.push('/screens/chats') },
    { icon: <PaymentIcon />, label: 'Payment logs', onPress: () => router.push('/screens/payments') },
    { icon: <ComplaintsIcon />, label: 'Complaints', onPress: () => { router.push('/screens/reports'); } },
    { icon: <SupportIcon />, label: 'Support', onPress: () => router.push('/screens/support') },
    { icon: <NotificationsIcon />, label: 'Notifications', onPress: () => router.push('/screens/notifications') },
    {
      icon: <TermsIcon />, label: 'Terms & Conditions', onPress: () => {
        router.push('/screens/onboarding/terms-conditions');
      },
    },
    {
      icon: <PrivacyIcon />, label: 'Privacy Policy', onPress: () => {
        router.push('/screens/onboarding/privacy-policy');
      },
    },
    {
      icon: <SettingsIcon />, label: 'App Settings', onPress: () => { },
    },
  ];

  return (
    <View className="absolute inset-0 z-50">
      {/* Overlay */}
      <TouchableOpacity className="absolute inset-0 bg-black/50" onPress={onClose} activeOpacity={1} />

      {/* Sidebar */}
      <View className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl">
        <SafeAreaView className="flex-1">
          {/* Header */}
          <View className="px-6 py-4 border-b border-gray-200">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-[#E75B3B] rounded-full items-center justify-center mr-3">
                  <Text className="text-white text-lg font-bold">G</Text>
                </View>
                <View>
                  <Text className="text-lg font-semibold text-gray-900">Welcome back,</Text>
                  <Text className="text-lg font-semibold text-gray-900">{firstName}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose}>
                <Text className="text-2xl text-gray-500">×</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity className="mt-3" onPress={onEditProfile}>
              <Text className="text-[#E75B3B] font-medium">View Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <ScrollView className="flex-1 px-6 py-4">
            <View className="flex-row items-center justify-around bg-[#F5F5F5] rounded-full  h-12">
              <Text className="font-normal text-lg">Availability</Text>
              <Switch
                value={isOnline}
                onValueChange={setAvailablity}
                trackColor={{ false: '#E5E7EB', true: '#E75B3B' }}
                thumbColor="#FFFFFF"
                style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
              />
              <Text>{isOnline ? 'Online' : 'Offline'}</Text>
            </View>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                className={`flex-row items-center py-3  ${item.active ? 'opacity-100' : 'opacity-70'}`}
                onPress={item.onPress}
              >
                <View className="w-6 mr-4">{item.icon}</View>
                <Text className={`text-lg ${item.active ? 'text-gray-900' : 'font-semibold text-gray-700'}`} style={{ fontFamily: 'Poppins-SemiBold' }}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Logout */}
          <View className="px-6 py-4 border-t border-gray-200">
            <TouchableOpacity className="flex-row items-center py-3" onPress={onLogout}>
              <View className="w-6 mr-4"><LogoutIcon /></View>
              <Text className="text-base text-red-500 font-medium">Log out</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};

// const TripCard: React.FC<TripCardProps> = ({ title, location, weight, postedBy, timeAgo, onPlaceBid }) => (
//   <View className="bg-white  rounded-lg p-4 mb-3 shadow-sm">
//     <Text className="text-lg font-semibold text-gray-900 mb-2">{title}</Text>

//     <View className="flex-row items-center mb-2">
//       <LocationIcon />
//       <Text className="text-gray-600 ml-1 flex-1">{location}</Text>
//     </View>

//     <Text className="text-gray-600 mb-3">
//       <Text className="font-medium">Weight</Text> {weight}
//     </Text>

//     <View className="flex-row items-center justify-between">
//       <View>
//         <Text className="text-gray-500 text-sm">Posted by {postedBy}</Text>
//         <Text className="text-gray-500 text-sm">• {timeAgo}</Text>
//       </View>

//       <TouchableOpacity
//         onPress={onPlaceBid}
//         className="bg-[#E75B3B] px-6 py-2 rounded-lg shadow-sm"
//       >
//         <Text className="text-white font-medium">Place Bid</Text>
//       </TouchableOpacity>
//     </View>
//   </View>
// );

const formatDate = (value: string) => {
  if (!value) {
    return 'Date not available';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date not available';
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatRelativeToToday = (value: string) => {
  if (!value) {
    return 'Date not available';
  }

  const targetDate = new Date(value);

  if (Number.isNaN(targetDate.getTime())) {
    return 'Date not available';
  }

  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 1) {
    return `in ${diffDays} days`;
  }

  if (diffDays === 1) {
    return 'tomorrow';
  }

  if (diffDays === 0) {
    return 'today';
  }

  if (diffDays === -1) {
    return 'yesterday';
  }

  return `${Math.abs(diffDays)} days ago`;
};

const getMarineRoute = (trip: MarineTrip) => {
  const via = trip.route?.via ?? [];

  if (via.length >= 2) {
    return `${via[0]} → ${via[via.length - 1]}`;
  }

  if (via.length === 1) {
    return via[0];
  }

  return trip.tripId || 'Marine trip';
};

const getAirRoute = (trip: AirTrip) => {
  const via = trip.route?.via ?? [];

  if (via.length >= 2) {
    return `${via[0]} → ${via[via.length - 1]}`;
  }

  if (via.length === 1) {
    return via[0];
  }

  return trip.tripId || 'Marine trip';
};

const formatCapacity = (trip: MarineTrip) => {
  const pounds = trip.capacity?.pounds;
  const dimension = trip.capacity?.dimension;

  if (!pounds && !dimension) {
    return 'Capacity details unavailable';
  }

  if (!pounds) {
    return `${dimension}`;
  }

  if (!dimension) {
    return `${pounds} lbs`;
  }

  return `${pounds} lbs • ${dimension}`;
};

const MaritimeSummaryCard: React.FC<{ trip?: MarineTrip }> = ({ trip }) => {
  if (!trip) {
    return (
      <View className="bg-[#FDEFEB] h-[130px] rounded-xl p-5 shadow-sm border border-[#FDEFEB]">
        <Text className="text-lg font-semibold text-gray-900">No maritime trip yet</Text>
        <Text className="text-gray-600 mt-2">
          Post a maritime trip to see it here and receive bids.
        </Text>
      </View>
    );
  }

  const routeSummary = getMarineRoute(trip);
  const bidsReceived = typeof trip.bids_recieved === 'number' ? trip.bids_recieved : 0;

  return (
    <TouchableOpacity
      onPress={() => router.push({
        pathname: '/screens/dashboard/review-bids',
        params: { tripId: trip._id, type: 'Maritime' }
      })}
    >

      <View className="bg-[#FDEFEB] rounded-2xl my-3 p-5 shadow-sm border border-[#FDEFEB]">
        <Text className="text-xl font-semibold text-gray-900 mb-1">{routeSummary}</Text>
        <Text className="text-base text-gray-700 mb-3">
          Date: {formatRelativeToToday(trip.departureDate)}
        </Text>
        <View className="bg-[#F8CCC2] px-4 py-2 rounded-full self-start">
          <Text className="text-sm font-medium text-[#D25336]">Bids Received: {bidsReceived}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};


const AirTripSummaryCard: React.FC<{ trip?: AirTrip }> = ({ trip }) => {
  if (!trip) {
    return (
      <View className="bg-[#FDEFEB] h-[130px] rounded-xl p-5 shadow-sm border border-[#FDEFEB]">
        <Text className="text-lg font-semibold text-gray-900">No maritime trip yet</Text>
        <Text className="text-gray-600 mt-2">
          Post a maritime trip to see it here and receive bids.
        </Text>
      </View>
    );
  }

  const routeSummary = getAirRoute(trip);
  const bidsReceived = typeof trip.bids_recieved === 'number' ? trip.bids_recieved : 0;

  return (
    <TouchableOpacity
      onPress={() => router.push({
        pathname: '/screens/dashboard/review-bids',
        params: { tripId: trip._id, type: 'Air' }
      })}
    >

      <View className="bg-[#FDEFEB] rounded-2xl my-3 p-5 shadow-sm border border-[#FDEFEB]">
        <Text className="text-xl font-semibold text-gray-900 mb-1">{routeSummary}</Text>
        <Text className="text-base text-gray-700 mb-3">
          Date: {formatRelativeToToday(trip.departureDate)}
        </Text>
        <View className="bg-[#F8CCC2] px-4 py-2 rounded-full self-start">
          <Text className="text-sm font-medium text-[#D25336]">Bids Received: {bidsReceived}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default function DashboardScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedTransportType, setSelectedTransportType] = useState('Air');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector((state) => state.auth.userProfile);
  const { trips: marineTrips, loadingTrips, error: marineTripsError } = useAppSelector((state) => state.marineTrip);

  const { airTrips, error: airTripsError, loading: airTripsLoading } = useAppSelector((state) => state.airTrip);

  const firstName = user.fullName.split(' ')[0];
  const transportTypes = [
    { type: 'Ground', IconComponent: GroundIcon },
    { type: 'Maritime', IconComponent: MaritimeIcon },
    { type: 'Air', IconComponent: AirIcon },
  ];

  type TransportType = (typeof transportTypes)[number]['type'];

  const transportRoutes: Record<TransportType, Href> = {
    Ground: '/screens/dashboard/post-ground-trip',
    Maritime: '/screens/dashboard/post-maritime-trip',
    Air: '/screens/dashboard/post-air-trip',
  } as const;



  useEffect(() => {
    dispatch(fetchMarineTrips());
    dispatch(fetchAirTrips());
  }, [dispatch]);

  const handlePlaceBid = () => {
    // TODO: Navigate to bid placement screen
    router.push('/screens/dashboard/review-bids');
  };

  const handleEditProfile = () => {
    setSidebarVisible(false);
    router.push('/screens/profile');
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    setSidebarVisible(false);
    dispatch(logout());
    router.replace('/screens/onboarding/login');
  };

  const retryFetchTrips = (type: string) => {
    if (type == 'Maritime') {
      dispatch(fetchMarineTrips());
    }
  };

  const renderMyPostedTripContent = () => {
    if (selectedTransportType === 'Air') {
      return airTrips.map((trip, index) => (
        <AirTripSummaryCard key={trip._id} trip={trip} />
      ));
    }

    if (selectedTransportType === 'Maritime') {
      if (loadingTrips) {
        return (
          <View className="items-center py-6">
            <ActivityIndicator size="small" color="#E75B3B" />
            <Text className="text-gray-500 mt-2">Loading maritime trips near you...</Text>
          </View>
        );
      }

      if (marineTripsError) {
        return (
          <View className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <Text className="text-red-600 font-medium mb-2">Unable to load maritime trips</Text>
            <Text className="text-red-600 mb-3">{marineTripsError.message}</Text>
            <TouchableOpacity
              onPress={() => retryFetchTrips('Maritime')}
              className="self-start bg-[#E75B3B] px-5 py-2 rounded-lg"
            >
              <Text className="text-white font-medium">Try again</Text>
            </TouchableOpacity>
          </View>
        );
      }

      if (marineTrips.filter((trip) => trip.status == 'open').length === 0) {
        return (
          <View className="bg-white border border-dashed border-gray-300 rounded-2xl p-6 items-center">
            <Text className="text-gray-600 text-center">
              No maritime trips near you yet. Check back soon.
            </Text>
          </View>
        );
      }

      console.log(marineTrips[0] ? marineTrips[0] : 'No trips');

      return marineTrips.filter((trip) => trip.status == 'open').map((trip) => (
        <MaritimeSummaryCard key={trip._id} trip={trip} />
      ));
    }


    if (selectedTransportType === 'Air') {
      if (airTripsLoading) {
        return (
          <View className="items-center py-6">
            <ActivityIndicator size="small" color="#E75B3B" />
            <Text className="text-gray-500 mt-2">Loading your air trips..</Text>
          </View>
        );
      }

      if (airTripsError) {
        return (
          <View className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <Text className="text-red-600 font-medium mb-2">Unable to load maritime trips</Text>
            <Text className="text-red-600 mb-3">{airTripsError.message}</Text>
            <TouchableOpacity
              onPress={() => retryFetchTrips('Maritime')}
              className="self-start bg-[#E75B3B] px-5 py-2 rounded-lg"
            >
              <Text className="text-white font-medium">Try again</Text>
            </TouchableOpacity>
          </View>
        );
      }

      if (airTrips.filter((trip) => trip.status == 'open').length === 0) {
        return (
          <View className="bg-white border border-dashed border-gray-300 rounded-2xl p-6 items-center">
            <Text className="text-gray-600 text-center">
              No maritime trips near you yet. Check back soon.
            </Text>
          </View>
        );
      }

      return marineTrips.filter((trip) => trip.status == 'open').map((trip) => (
        <MaritimeSummaryCard key={trip._id} trip={trip} />
      ));
    }

    return (
      <View className="bg-white border border-dashed border-gray-300 rounded-2xl p-6 items-center">
        <Text className="text-gray-600 text-center">
          No avaliable posted {selectedTransportType.toLowerCase()} trips yet by you.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View className="bg-white h-24 ps-4 pr-4 flex-row items-center justify-between border-b border-gray-200">
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <View className="flex items-end mb-auto">
            <MenuIcon />
          </View>
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <View className="flex-row items-center">
            <Text className="text-lg font-semibold text-gray-900">Hello, {firstName}</Text>
          </View>
          <View className="flex-row items-center">
            <LocationIcon />
            <Text className="text-sm text-gray-600 ml-1">{profile.profile.address}</Text>
            <Text className="text-sm text-gray-400 ml-1">▼</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => router.push('/screens/notifications')}>
          <View className="relative">
            <NotificationIcon />
            <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
              <Text className="text-white text-xs">0</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View className="px-4 pt-4">
          <View className="bg-white rounded-xl border-[#F4B4A5] h-[48px] border border-gray-200 flex-row px-3 items-center shadow-sm">
            <SearchIcon />
            <TextInput
              placeholder="Search for jobs..."
              className="flex-1 ml-3 text-gray-700"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>



        {/* Active Trip */}
        {/* <View className="px-4 mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">Active Trip</Text>

          <TouchableOpacity
            className="bg-[#E75B3B] rounded-lg p-4"
            onPress={() => router.push('/screens/dashboard/depart-port')}
          >
            <Text className="text-lg font-semibold text-white mb-2">
              Driving To Drop Package
            </Text>
            <Text className="text-white/80 mb-2">On the way • June 24</Text>
            <View className="bg-white/20 px-3 py-1 rounded-full self-start">
              <Text className="text-white text-sm font-medium">₦13,500</Text>
            </View>
          </TouchableOpacity>
        </View> */}

        {/* My Posted Trips */}
        <View className="px-4 mb-6">
          {/* <Text className="text-xl font-bold text-gray-900 mb-4">My Posted Trips</Text> */}

          {/* <MaritimeSummaryCard trip={marineTrips[0]} /> */}

          {/* Transport Tabs */}
          <View className="flex-row gap-3 mt-6">
            {transportTypes.map((transport) => {
              const isActive = selectedTransportType === transport.type;
              const IconComponent = transport.IconComponent;

              return (
                <>

                  <TouchableOpacity
                    key={transport.type}
                    onPress={() => setSelectedTransportType(transport.type)}
                    className={`flex-1 items-center justify-center py-5 rounded-2xl ${isActive ? 'bg-[#E75B3B]' : 'bg-white'}`}
                    activeOpacity={isActive ? 0.8 : 1}
                  >
                    <View className="items-center">
                      <IconComponent isActive={isActive} />
                      <Text className={`mt-2 text-sm capitalize ${isActive ? 'text-white font-medium' : 'text-gray-700'}`}>
                        {transport.type}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              );
            })}
          </View>
        </View>

        {/* Posted Trips Content */}
        <View className="mt-6">
          {transportTypes.map((transport) => {

            return (
              <View className={`px-4 mb-6 ${transport.type === selectedTransportType ? '' : 'hidden'}`} key={transport.type}>
                {transport.type === 'Ground' ? (
                  <View className="mb-6 mt-4">
                    <Text className="text-xl font-bold text-gray-900 mb-4">
                      My Posted {`${selectedTransportType} Trips`}
                    </Text>

                    {renderMyPostedTripContent()}
                  </View>
                ) : (
                  <View className="mb-6 mt-4">
                    <TouchableOpacity
                      className="bg-[#E75B3B] flex items-center justify-center h-[48px] rounded-xl py-4 shadow-sm"
                      onPress={() => router.push(transportRoutes[transport.type])}
                    >
                      <View className="flex-row items-center">
                        <Plus color="white" className='mr-3' />
                        <Text className="text-white self-center font-semibold text-lg">Post My Trip</Text>
                      </View>
                    </TouchableOpacity>
                    {renderMyPostedTripContent()}
                  </View>
                )}

              </View>
            )
          })}
        </View>

      </ScrollView>

      {/* Sidebar */}
      <Sidebar
        isVisible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onEditProfile={handleEditProfile}
        onLogout={handleLogout}
      />

      {/* Logout Modal */}
      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </SafeAreaView>
  );
}