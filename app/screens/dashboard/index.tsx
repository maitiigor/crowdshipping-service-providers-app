import { LogoutModal } from '@/components/ui/logout-modal';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Aeroplane, BellNotification, ChatBubble, HomeAlt, Icon, Location, Logout, MailIn, MenuScale, Notes, PrivacyPolicy, Refresh, Settings, Sharpship, VechileCar, Wallet } from '../../../components/ui/icon';
import { useAppDispatch, useAppSelector } from '../../../store';
import { logout } from '../../../store/slices/authSlice';

// UI Components

// Icons (using simple text/emoji for now, can be replaced with proper icons)
const MenuIcon = () => <Icon as={MenuScale} size="2xl" />
const NotificationIcon = () => <Icon as={Location} size="xl" className='#E75B3B' />;
const SearchIcon = () => <Text className="text-gray-400 text-lg">🔍</Text>;
const LocationIcon = () => <Icon as={Location} size="xl" className='text-[#E75B3B]' />
const HomeIcon = () => <Icon as={HomeAlt} size="xl" />;
const BookingIcon = () => <Icon as={Refresh} size="xl" />;
const InboxIcon = () => <Icon as={MailIn} size="xl" />;
const PaymentIcon = () => <Icon as={Wallet} size="xl" />;
const ComplaintsIcon = () => <Icon as={ChatBubble} size="xl" />;
const SupportIcon = () => <Icon as={ChatBubble} size="xl" />;
const NotificationsIcon = () => <Icon as={BellNotification} size="xl" />;
const TermsIcon = () => <Icon as={Notes} size="xl" />;
const PrivacyIcon = () => <Icon as={PrivacyPolicy} size="xl" />;
const SettingsIcon = () => <Icon as={Settings} size="xl" />;
const LogoutIcon = () => <Icon as={Logout} size="xl" className='text-red-500' />;
const AirIcon = ({ isActive }: { isActive?: boolean }) => <Icon as={Aeroplane} size='2xl' fill='red' className={isActive ? 'text-white' : 'text-black'} />;
const GroundIcon = ({ isActive }: { isActive?: boolean }) => <Icon as={VechileCar} size='2xl' className={isActive ? 'text-white' : 'text-black'} />;
const MaritimeIcon = ({ isActive }: { isActive?: boolean }) => <Icon as={Sharpship} size='2xl' className={isActive ? 'text-white' : 'text-black'} />;;

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

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose, onEditProfile, onLogout }) => {
  if (!isVisible) return null;


  const [isOnline, setIsOnline] = useState(false);

  const user = useAppSelector((state) => state.auth.user);

  const firstName = user.fullName.split(' ')[0];

  const setAvailablity = () => {
    setIsOnline(!isOnline);
  }

  const menuItems = [
    { icon: <HomeIcon />, label: 'Home', active: true, onPress: () => { } },
    { icon: <BookingIcon />, label: 'Booking History', onPress: () => router.push('/screens/bookings') },
    { icon: <InboxIcon />, label: 'Inbox', onPress: () => router.push('/screens/chats') },
    { icon: <PaymentIcon />, label: 'Payment logs', onPress: () => router.push('/screens/payments') },
    { icon: <ComplaintsIcon />, label: 'Complaints', onPress: () => { router.push('/screens/reports') } },
    { icon: <SupportIcon />, label: 'Support', onPress: () => router.push('/screens/support') },
    { icon: <NotificationsIcon />, label: 'Notifications', onPress: () => router.push('/screens/notifications') },
    {
      icon: <TermsIcon />, label: 'Terms & Conditions', onPress: () => {
        router.push('/screens/onboarding/terms-conditions')
      }
    },
    {
      icon: <PrivacyIcon />, label: 'Privacy Policy', onPress: () => {
        router.push('/screens/onboarding/privacy-policy')
      }
    },
    {
      icon: <SettingsIcon />, label: 'App Settings', onPress: () => {

      }
    },
  ];

  return (
    <View className="absolute inset-0 z-50">
      {/* Overlay */}
      <TouchableOpacity
        className="absolute inset-0 bg-black/50"
        onPress={onClose}
        activeOpacity={1}
      />

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
            <View className='flex-row items-center justify-around bg-[#F5F5F5] rounded-full  h-12'>
              <Text className='font-normal, font-poppins text-lg'>
                Availability
              </Text>
              <Switch
                value={isOnline}
                onValueChange={setAvailablity}
                trackColor={{ false: '#E5E7EB', true: '#E75B3B' }}
                thumbColor="#FFFFFF"
                style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
              />
              <Text>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
            </View>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                className={`flex-row items-center py-3 ${item.active ? 'opacity-100' : 'opacity-70'}`}
                onPress={item.onPress}
              >
                <View className="w-6 mr-4">{item.icon}</View>
                <Text className={`text-base ${item.active ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
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

const TripCard: React.FC<TripCardProps> = ({ title, location, weight, postedBy, timeAgo, onPlaceBid }) => (
  <View className="bg-white  rounded-lg p-4 mb-3 shadow-sm">
    <Text className="text-lg font-semibold text-gray-900 mb-2">{title}</Text>

    <View className="flex-row items-center mb-2">
      <LocationIcon />
      <Text className="text-gray-600 ml-1 flex-1">{location}</Text>
    </View>

    <Text className="text-gray-600 mb-3">
      <Text className="font-medium">Weight</Text> {weight}
    </Text>

    <View className="flex-row items-center justify-between">
      <View>
        <Text className="text-gray-500 text-sm">Posted by {postedBy}</Text>
        <Text className="text-gray-500 text-sm">• {timeAgo}</Text>
      </View>

      <TouchableOpacity
        onPress={onPlaceBid}
        className="bg-[#E75B3B] px-6 py-2 rounded-lg shadow-sm"
      >
        <Text className="text-white font-medium">Place Bid</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function DashboardScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedTransportType, setSelectedTransportType] = useState('Air');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector((state) => state.auth.userProfile);

  console.log(user.fullName);
  const firstName = user.fullName.split(' ')[0];
  const auth = useAppSelector
  const transportTypes = [
    { type: 'Ground', IconComponent: GroundIcon },
    { type: 'Maritime', IconComponent: MaritimeIcon },
    { type: 'Air', IconComponent: AirIcon },
  ];

  const trips = [
    {
      title: 'Urgent Documents to VI',
      location: 'Surulere, Lagos → Ibadan, Oyo',
      weight: '0.5kg',
      postedBy: 'Amina Bello',
      timeAgo: '35m ago',
    },
    {
      title: 'Box of Clothes',
      location: 'Ikeja, Lagos → Victoria Island, Lagos',
      weight: '5kg',
      postedBy: 'John Doe',
      timeAgo: '35m ago',
    },
    {
      title: 'Medical Supplies',
      location: 'Apapa, Lagos → Port Harcourt, Rivers',
      weight: '15kg',
      postedBy: 'PharmaCo',
      timeAgo: '35m ago',
    },
  ];

  const handlePlaceBid = () => {
    console.log('Place bid pressed');
    // TODO: Navigate to bid placement screen
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
    // Handle logout logic here
    dispatch(logout());

    router.replace('/screens/onboarding/login');
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
        <View className="px-4 py-4">
          <View className="bg-white rounded-lg border border-gray-200 flex-row items-center px-4 py-3 shadow-sm">
            <SearchIcon />
            <TextInput
              placeholder="Search for jobs..."
              className="flex-1 ml-3 text-gray-700"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>


        {/* Post My Trip Button */}
        <View className="px-4 mb-6">
          <TouchableOpacity
            className="bg-[#E75B3B] rounded-lg py-4 items-center shadow-sm"
            onPress={() => router.push('/screens/dashboard/post-trip')}
          >
            <Text className="text-white font-semibold text-lg">+ Post My Trip</Text>
          </TouchableOpacity>
        </View>

        {/* Active Trip */}
        <View className="px-4 mb-6">
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
        </View>

        {/* My Posted Trips */}
        <View className="px-4 mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">My Posted Trips</Text>

          <TouchableOpacity
            className="bg-gray-100 rounded-lg p-4"
            onPress={() => router.push('/screens/dashboard/review-bids')}
          >
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Lagos (LOS) → Atlanta (ATL)
            </Text>
            <Text className="text-gray-600 mb-2">Date: in 3 days</Text>
            <View className="bg-red-100 px-3 py-1 rounded-full self-start">
              <Text className="text-red-600 text-sm">Bids Received: 2</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Transport Type Selector */}
        <View className="px-4 mb-6">
          <View className="flex-row gap-3">
            {transportTypes.map((transport, index) => {
              const isActive = selectedTransportType === transport.type;
              const IconComponent = transport.IconComponent;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedTransportType(transport.type)}
                  className={`p-4 border border-[#FDEFEB] flex-1 justify-center rounded-xl ${isActive ? 'bg-[#E75B3B]' : 'bg-transparent'
                    }`}
                >
                  <View className='flex-col items-center justify-center'>

                    <View className={isActive ? 'opacity-100' : 'opacity-60'}>
                      <IconComponent isActive={isActive} />
                    </View>
                    <Text className={`mb-3 text-md mt-2 ${isActive ? 'text-white font-medium' : 'text-gray-600'
                      }`}>
                      {transport.type}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Air Trips Near You */}
        <View className="px-4 mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-4">Air Trips Near You</Text>

          {trips.map((trip, index) => (
            <TripCard
              key={index}
              title={trip.title}
              location={trip.location}
              weight={trip.weight}
              postedBy={trip.postedBy}
              timeAgo={trip.timeAgo}
              onPlaceBid={handlePlaceBid}
            />
          ))}
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