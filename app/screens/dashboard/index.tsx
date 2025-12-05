import { LogoutModal } from '@/components/ui/logout-modal';
import { Href, router } from 'expo-router';
import { Bell, Car, ChevronDown, Globe, Headset, Home, LogOut, MailPlus, Menu, MessageCircleMore, NotepadText, Plus, RotateCw, ScrollText, Search, SettingsIcon, VectorSquare, Wallet } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import GroundTripCard from '../../../components/Custom/GroundTripCard';
import {
  Aeroplane,
  Icon,
  Location,
  Sharpship,
  VechileCar
} from '../../../components/ui/icon';

import ParallaxScrollView from '../../../components/Custom/ParallaxScrollView';
import NotificationIconComponent from '../../../components/NotificationIconComponent';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { useShowToast } from '../../../hooks/useShowToast';
import { useThemeColor } from '../../../hooks/useThemeColor';
import { AirTrip, MarineTrip } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchAirTrips } from '../../../store/slices/airTripSlice';
import { logout } from '../../../store/slices/authSlice';
import { acceptBooking, fetchDeliveryBookings, rejectBooking } from '../../../store/slices/groundTripSlice';
import { fetchMarineTrips } from '../../../store/slices/marineTripSlice';
import { fetchNotifications } from '../../../store/slices/notificationSlice';
import { getUserProfile } from '../../../store/slices/profileSlice';


// UI Components

// Icons (using simple text/emoji for now, can be replaced with proper icons)
const SearchIcon = () => <Search className='text-[#9EA2AE]' />;
const LocationIcon = () => <Icon as={Location} size="xl" className="text-[#E75B3B]" />;

export const AirIcon = ({ isActive }: { isActive?: boolean }) => (
  <Icon as={Aeroplane} size="5xl" fill="red" className={isActive ? 'text-white' : 'text-black'} />
);
export const GroundIcon = ({ isActive }: { isActive?: boolean }) => (
  <Icon as={VechileCar} size="5xl" className={isActive ? 'text-white' : 'text-black'} />
);
export const MaritimeIcon = ({ isActive }: { isActive?: boolean }) => (
  <Icon as={Sharpship} size="5xl" className={isActive ? 'text-white' : 'text-black'} />
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
  weight: number;
  postedBy: string;
  timeAgo: string;
  onPlaceBid: () => void;
}

interface MarineTripCardProps {
  trip: MarineTrip;
  onRefresh?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose, onEditProfile, onLogout }) => {
  // All hooks must be called before any conditional returns
  const { t, i18n } = useTranslation();
  const [isOnline, setIsOnline] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const backgroundColor = useThemeColor({}, "background");
  const color = useThemeColor({}, "text");

  // Now we can do conditional rendering
  if (!isVisible) return null;

  const firstName = user.fullName.split(' ')[0];

  const setAvailablity = () => {
    setIsOnline(!isOnline);
  };

  const menuItems = [
    { icon: <Home color={color} />, label: t('sidebar.menu.home'), active: true, onPress: () => {
        router.push('/screens/dashboard');
     } },
    { icon: <Car color={color} />, label: t('sidebar.menu.my_vehicles'), onPress: () => router.push('/screens/vehicles') },

    { icon: <RotateCw color={color} />, label: t('sidebar.menu.booking_history'), onPress: () => router.push('/screens/bookings') },

    { icon: <VectorSquare color={color} />, label: t('sidebar.menu.trips_jobs'), onPress: () => router.push('/screens/trips') },

    { icon: <MailPlus color={color} />, label: t('sidebar.menu.inbox'), onPress: () => router.push('/screens/chats') },
    { icon: <Wallet color={color} />, label: t('sidebar.menu.payment_logs'), onPress: () => router.push('/screens/payments') },
    { icon: <MessageCircleMore color={color} />, label: t('sidebar.menu.complaints'), onPress: () => { router.push('/screens/reports'); } },
    { icon: <Headset color={color} />, label: t('sidebar.menu.support'), onPress: () => router.push('/screens/support') },
    { icon: <Bell color={color} />, label: t('sidebar.menu.notifications'), onPress: () => router.push('/screens/notifications') },
    {
      icon: <NotepadText color={color} />, label: t('sidebar.menu.terms_conditions'), onPress: () => {
        router.push('/screens/onboarding/terms-conditions');
      },
    },
    {
      icon: <ScrollText color={color} />, label: t('sidebar.menu.privacy_policy'), onPress: () => {
        router.push('/screens/onboarding/privacy-policy');
      },
    },
    {
      icon: <SettingsIcon color={color} />, label: t('sidebar.menu.app_settings'), onPress: () => {
        router.push('/screens/settings');
      },
    },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setShowLanguageMenu(false);
  };

  return (

    <ThemedView className="absolute inset-0 z-50">

      {/* Overlay */}
      <TouchableOpacity className="absolute inset-0 bg-black/50" onPress={onClose} activeOpacity={1} />

      {/* Sidebar */}
      <ThemedView className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl">
        <SafeAreaView className="flex-1">
          {/* Header */}
          <ThemedView className="px-6 py-4 border-b border-gray-200">
            <ThemedView className="flex-row items-center justify-between">
              <ThemedView className="flex-row items-center">
                <ThemedView className="w-12 h-12 bg-[#E75B3B] rounded-full items-center justify-center mr-3">
                  <ThemedText className="text-white text-lg font-bold">G</ThemedText>
                </ThemedView>
                <ThemedView>
                  <ThemedText className="text-lg font-semibold text-gray-900">{t('dashboard.sidebar.welcome_back')}</ThemedText>
                  <ThemedText className="text-lg font-semibold text-gray-900">{firstName}</ThemedText>
                </ThemedView>
              </ThemedView>
              <TouchableOpacity onPress={onClose}>
                <ThemedText className="text-2xl text-gray-500">×</ThemedText>
              </TouchableOpacity>
            </ThemedView>
            <TouchableOpacity className="mt-3" onPress={onEditProfile}>
              <ThemedText className="text-[#E75B3B] font-medium">{t('sidebar.view_profile')}</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Menu Items */}
          <ScrollView className="flex-1 px-6 py-4">
            <ThemedView className="flex-row items-center justify-around bg-[#F5F5F5] rounded-full  h-12">
              <ThemedText className="font-normal text-lg">{t('sidebar.availability')}</ThemedText>
              <Switch
                value={isOnline}
                onValueChange={setAvailablity}
                trackColor={{ false: '#E5E7EB', true: '#E75B3B' }}
                thumbColor="#FFFFFF"
                style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
              />
              <ThemedText>{isOnline ? t('sidebar.online') : t('sidebar.offline')}</ThemedText>
            </ThemedView>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                className={`flex-row items-center py-3  ${item.active ? 'opacity-100' : 'opacity-70'}`}
                onPress={item.onPress}
              >
                <ThemedView className="w-6 mr-4">{item.icon}</ThemedView>
                <ThemedText className={`text-lg ${item.active ? 'text-gray-900' : 'font-semibold text-gray-700'}`} style={{ fontFamily: 'Poppins-SemiBold' }}>
                  {item.label}
                </ThemedText>
              </TouchableOpacity>
            ))}

            {/* Language Switcher */}
            <ThemedView className="mt-4 pt-4 border-t border-gray-200">
              <ThemedText className="text-xs text-gray-500 mb-2 uppercase">{t('settings.main.language_title')}</ThemedText>
              <TouchableOpacity 
                className="flex-row items-center justify-between py-3 px-4 bg-gray-100 rounded-lg"
                onPress={() => setShowLanguageMenu(!showLanguageMenu)}
              >
                <ThemedView className="flex-row items-center" style={{ backgroundColor: 'transparent' }}>
                  <ThemedText className="text-2xl mr-2">{currentLanguage.flag}</ThemedText>
                  <ThemedText className="text-base font-medium text-gray-900">{currentLanguage.name}</ThemedText>
                </ThemedView>
                <ChevronDown color={color} size={20} />
              </TouchableOpacity>
              
              {showLanguageMenu && (
                <ThemedView className="mt-2 rounded-lg overflow-hidden" style={{ backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb' }}>
                  {languages.map((lang) => (
                    <TouchableOpacity
                      key={lang.code}
                      className="flex-row items-center justify-between py-3 px-4"
                      style={{
                        backgroundColor: i18n.language === lang.code ? '#FEF2F2' : '#ffffff',
                      }}
                      onPress={() => handleLanguageChange(lang.code)}
                    >
                      <ThemedView className="flex-row items-center" style={{ backgroundColor: 'transparent' }}>
                        <ThemedText className="text-2xl mr-3">{lang.flag}</ThemedText>
                        <ThemedText 
                          className="text-base"
                          style={{
                            fontWeight: i18n.language === lang.code ? '600' : '400',
                            color: i18n.language === lang.code ? '#E75B3B' : '#374151',
                          }}
                        >
                          {lang.name}
                        </ThemedText>
                      </ThemedView>
                      {i18n.language === lang.code && (
                        <Globe color="#E75B3B" size={18} />
                      )}
                    </TouchableOpacity>
                  ))}
                </ThemedView>
              )}
            </ThemedView>
          </ScrollView>

          {/* Logout */}
          <ThemedView className="px-6 py-4 border-t border-gray-200">
            <TouchableOpacity className="flex-row items-center py-3" onPress={onLogout}>
              <ThemedView className="w-6 mr-4"><LogOut color={color} /></ThemedView>
              <ThemedText className="text-base text-red-500 font-medium">{t('sidebar.logout')}</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </SafeAreaView>
      </ThemedView >

    </ThemedView >
  );
};




export const formatRelativeToToday = (value: string) => {
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

export const getMarineRoute = (trip: MarineTrip) => {
  const via = trip.route?.via ?? [];

  if (via.length >= 2) {
    return `${via[0]} → ${via[via.length - 1]}`;
  }

  if (via.length === 1) {
    return via[0];
  }

  return `${trip.containerNumber}  ${trip.departurePort} → ${trip.arrivalPort}`;
};

export const getAirRoute = (trip: AirTrip) => {


  return `${trip.departureAirport.city} (${trip.departureAirport.iata}) → ${trip.arrivalAirport.city} (${trip.arrivalAirport.iata})` || 'Marine trip';
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

export const MaritimeSummaryCard: React.FC<{ trip?: MarineTrip }> = ({ trip }) => {
  if (!trip) {
    return (
      <ThemedView className="bg-[#FDEFEB] h-[130px] rounded-xl p-5 shadow-sm border border-[#FDEFEB]">
        <ThemedText className="text-lg font-semibold text-gray-900">No maritime trip yet</ThemedText>
        <ThemedText className="text-gray-600 mt-2">
          Post a maritime trip to see it here and receive bids.
        </ThemedText>
      </ThemedView>
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

      <ThemedView className="bg-[#FDEFEB] rounded-2xl my-3 p-5 shadow-sm border border-[#FDEFEB]">
        <ThemedText className="text-xl font-semibold text-gray-900 mb-1">{routeSummary}</ThemedText>
        <ThemedText className="text-base text-gray-700 mb-3">
          Date: {formatRelativeToToday(trip.departureDate)}
        </ThemedText>
        <ThemedView className="bg-[#F8CCC2] px-4 py-2 rounded-full self-start">
          <ThemedText className="text-sm font-medium text-[#D25336]">Bids Received: {bidsReceived}</ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};


export const AirTripSummaryCard: React.FC<{ trip?: AirTrip }> = ({ trip }) => {
  if (!trip) {
    return (
      <ThemedView className="bg-[#FDEFEB] h-[130px] rounded-xl p-5 shadow-sm border border-[#FDEFEB]">
        <ThemedText className="text-lg font-semibold text-gray-900">No maritime trip yet</ThemedText>
        <ThemedText className="text-gray-600 mt-2">
          Post a maritime trip to see it here and receive bids.
        </ThemedText>
      </ThemedView>
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

      <ThemedView className="bg-[#FDEFEB] rounded-2xl my-3 p-5 shadow-sm border border-[#FDEFEB]">
        <ThemedText className="text-xl font-semibold text-gray-900 mb-1">{routeSummary}</ThemedText>
        <ThemedText className="text-base text-gray-700 mb-3">
          Date: {formatRelativeToToday(trip.departureDate)}
        </ThemedText>
        <ThemedView className="bg-[#F8CCC2] px-4 py-2 rounded-full self-start">
          <ThemedText className="text-sm font-medium text-[#D25336]">Bids Received: {bidsReceived}</ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};
export default function DashboardScreen() {
  const { t, i18n } = useTranslation();
  const [selectedTransportType, setSelectedTransportType] = useState<'Maritime' | 'Air' | 'Ground'>('Ground');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector((state) => state.auth.userProfile);
  const { trips: marineTrips, loadingTrips, error: marineTripsError } = useAppSelector((state) => state.marineTrip);

  const { airTrips, error: airTripsError, loading: airTripsLoading } = useAppSelector((state) => state.airTrip);

  const { groundTrips, error: groundTripError, loading: groundTripLoading } = useAppSelector((state) => state.groundTrip)

  const firstName = user.fullName.split(' ')[0];
  const transportTypes = [
    { type: 'Ground', IconComponent: GroundIcon },
    { type: 'Maritime', IconComponent: MaritimeIcon },
    { type: 'Air', IconComponent: AirIcon },
  ];

  const color = useThemeColor({}, 'text');


  const showToast = useShowToast();

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      await dispatch(acceptBooking(bookingId)).unwrap();
      // Refresh the ground trips list
      dispatch(fetchDeliveryBookings());
      router.push({
        pathname: '/screens/dashboard/trip-status-management',
        params: { tripId: bookingId }
      });
    } catch (error: any) {
      throw error;
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    try {
      await dispatch(rejectBooking(bookingId)).unwrap();
      // Refresh the ground trips list
      dispatch(fetchDeliveryBookings());
    } catch (error: any) {
      throw error;
    }
  };

  type TransportType = (typeof transportTypes)[number]['type'];

  const transportRoutes: Record<TransportType, Href> = {
    Ground: '/screens/dashboard/post-ground-trip',
    Maritime: '/screens/dashboard/post-maritime-trip',
    Air: '/screens/dashboard/post-air-trip',
  } as const;



  useEffect(() => {
    dispatch(fetchMarineTrips());
    dispatch(fetchAirTrips());
    dispatch(fetchDeliveryBookings())
    dispatch(fetchNotifications())
    dispatch(getUserProfile())
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
    setSidebarVisible(false);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  ];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setShowLanguageMenu(false);
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

    if (type == "Ground") {
      dispatch(fetchDeliveryBookings())
    }
    if (type == "Air") {
      dispatch(fetchAirTrips());
    }
  };

  const renderMyPostedTripContent = () => {

    if (selectedTransportType === 'Maritime') {
      if (loadingTrips) {
        return (
          <ThemedView className="items-center py-6">
            <ActivityIndicator size="small" color="#E75B3B" />
            <ThemedText className="text-gray-500 mt-2">{t('dashboard.loading.maritime_trips')}</ThemedText>
          </ThemedView>
        );
      }

      if (marineTripsError) {
        return (
          <ThemedView className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <ThemedText className="text-red-600 font-medium mb-2">{t('dashboard.errors.unable_to_load_maritime')}</ThemedText>
            <ThemedText className="text-red-600 mb-3">{marineTripsError.message}</ThemedText>
            <TouchableOpacity
              onPress={() => retryFetchTrips('Maritime')}
              className="self-start bg-[#E75B3B] px-5 py-2 rounded-lg"
            >
              <ThemedText className="text-white font-medium">{t('dashboard.errors.try_again')}</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        );
      }

      if (marineTrips.filter((trip) => trip.status == 'open').length === 0) {
        return (
          <ThemedView className="bg-white border border-dashed border-gray-300 rounded-2xl p-6 items-center">
            <ThemedText className="text-gray-600 text-center">
              {t('dashboard.empty_states.no_maritime_trips_near_you')}
            </ThemedText>
          </ThemedView>
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
          <ThemedView className="items-center py-6">
            <ActivityIndicator size="small" color="#E75B3B" />
            <ThemedText className="text-gray-500 mt-2">{t('dashboard.loading.air_trips')}</ThemedText>
          </ThemedView>
        );
      }

      if (airTripsError) {
        return (
          <ThemedView className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <ThemedText className="text-red-600 font-medium mb-2">{t('dashboard.errors.unable_to_load_air')}</ThemedText>
            <ThemedText className="text-red-600 mb-3">{airTripsError.message}</ThemedText>
            <TouchableOpacity
              onPress={() => retryFetchTrips('Maritime')}
              className="self-start bg-[#E75B3B] px-5 py-2 rounded-lg"
            >
              <ThemedText className="text-white font-medium">{t('dashboard.errors.try_again')}</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        );
      }

      if (airTrips.filter((trip) => trip.status == 'open').length === 0) {
        return (
          <ThemedView className="bg-white border border-dashed border-gray-300 rounded-2xl p-6 items-center">
            <ThemedText className="text-gray-600 text-center">
              {t('dashboard.empty_states.no_maritime_trips_near_you')}
            </ThemedText>
          </ThemedView>
        );
      }

      return airTrips.filter((trip) => trip.status == 'open').map((trip) => (
        <AirTripSummaryCard key={trip._id} trip={trip} />
      ));
    }

    if (selectedTransportType === 'Ground') {
      if (groundTripLoading) {
        return (
          <ThemedView className="items-center py-6">
            <ActivityIndicator size="small" color="#E75B3B" />
            <ThemedText className="text-gray-500 mt-2">{t('dashboard.loading.ground_trips')}</ThemedText>
          </ThemedView>
        );
      }

      if (groundTripError) {
        return (
          <ThemedView className="bg-red-50 border border-red-100 rounded-2xl p-5">
            <ThemedText className="text-red-600 font-medium mb-2">{t('dashboard.errors.unable_to_load_ground')}</ThemedText>
            <ThemedText className="text-red-600 mb-3">{groundTripError.message}</ThemedText>
            <TouchableOpacity
              onPress={() => retryFetchTrips('Ground')}
              className="self-start bg-[#E75B3B] px-5 py-2 rounded-lg"
            >
              <ThemedText className="text-white font-medium">{t('dashboard.errors.try_again')}</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        );
      }

      if (groundTrips.filter((trip) => trip.status == 'PENDING').length === 0) {
        return (
          <ThemedView className="bg-white border border-dashed border-gray-300 rounded-2xl p-6 items-center">
            <ThemedText className="text-gray-600 text-center">
              {t('dashboard.empty_states.no_ground_trips_near_you')}
            </ThemedText>
          </ThemedView>
        );
      }

      return groundTrips.filter((trip) => trip.status == 'PENDING').map((trip) => (
        <GroundTripCard
          key={trip.id}
          trip={trip}
          onAccept={handleAcceptBooking}
          onReject={handleRejectBooking}
        />
      ));
    }

    return (
      <ThemedView className="bg-white border border-dashed border-gray-300 rounded-2xl p-6 items-center">
        <ThemedText className="text-gray-600 text-center">
          {t('dashboard.empty_states.no_available_trips', { type: selectedTransportType.toLowerCase() })}
        </ThemedText>
      </ThemedView>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ParallaxScrollView headerBackgroundColor={{ light: "#FFFFFF", dark: "#353636" }}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />

        {/* Header */}
        <ThemedView className="bg-white h-24 ps-4 pr-4 flex-row items-center justify-between border-b border-gray-200">
          <TouchableOpacity onPress={() => setSidebarVisible(true)}>
            <ThemedView className="flex items-end mb-auto">
              <Menu color={color} />
            </ThemedView>
          </TouchableOpacity>

          <ThemedView className="flex-1 items-center">
            <ThemedView className="flex-row items-center">
              <ThemedText className="text-lg font-semibold text-gray-900">{t('dashboard.header.hello', { name: firstName })}</ThemedText>
            </ThemedView>
            <ThemedView className="flex-row items-center">
              <LocationIcon />
              <ThemedText className="text-sm text-gray-600 ml-1">{profile.profile?.address.length <= 20 ? profile.profile?.address : `${profile.profile?.address.substring(0, 20)}...`}</ThemedText>
              <ThemedText className="text-sm text-gray-400 ml-1">▼</ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView className="flex-row items-center gap-x-3">
            {/* Language Switcher Icon */}
            <TouchableOpacity onPress={() => setShowLanguageMenu(!showLanguageMenu)}>
              <ThemedView className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
                <Globe color="#E75B3B" size={20} />
              </ThemedView>
            </TouchableOpacity>
            
            <NotificationIconComponent />
          </ThemedView>
        </ThemedView>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <ThemedView className="px-4 pt-4">
            <ThemedView className="bg-white rounded-xl border-[#F4B4A5] h-[48px] border border-gray-200 flex-row px-3 items-center shadow-sm">
              <SearchIcon />
              <TextInput
                placeholder={t('dashboard.header.search_placeholder')}
                className="flex-1 ml-3 text-gray-700"
                placeholderTextColor="#9CA3AF"
              />
            </ThemedView>
          </ThemedView>





          {/* My Posted Trips */}
          <ThemedView className="px-4 mb-3">
            {/* <ThemedText className="text-xl font-bold text-gray-900 mb-4">My Posted Trips</ThemedText> */}

            {/* <MaritimeSummaryCard trip={marineTrips[0]} /> */}

            {/* Transport Tabs */}
            <ThemedView className="flex-row gap-3 mt-4">
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
                          {t(`dashboard.transport.${transport.type.toLowerCase()}`)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </>
                );
              })}
            </ThemedView>
          </ThemedView>

          {/* Posted Trips Content */}
          <ThemedView className="">
            {transportTypes.map((transport) => {

              return (
                <ThemedView className={`px-4 mb-6 ${transport.type === selectedTransportType ? '' : 'hidden'}`} key={transport.type}>
                  {transport.type === 'Ground' ? (
                    <ThemedView className="mb-2 ">
                      <ThemedText className="text-xl font-bold text-gray-900 mb-4">
                        {t('dashboard.sections.ground_trips_near_you')}
                      </ThemedText>

                      {renderMyPostedTripContent()}
                    </ThemedView>
                  ) : (
                    <ThemedView className="mb-6 mt-4">
                      <TouchableOpacity
                        className="bg-[#E75B3B] flex items-center justify-center h-[48px] rounded-xl py-4 shadow-sm"
                        onPress={() => router.push(transportRoutes[transport.type])}
                      >
                        <View className="flex-row items-center">
                          <Plus color="white" className='mr-3' />
                          <ThemedText className="text-white self-center font-semibold text-lg">{t('dashboard.sections.post_my_trip')}</ThemedText>
                        </View>
                      </TouchableOpacity>
                      {renderMyPostedTripContent()}
                    </ThemedView>
                  )}

                </ThemedView>
              )
            })}
          </ThemedView>

        </ScrollView>
      </ParallaxScrollView>

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

      {/* Language Selection Modal */}
      {showLanguageMenu && (
        <ThemedView className="absolute inset-0 z-50" style={{ backgroundColor: 'transparent' }}>
          <TouchableOpacity 
            className="absolute inset-0 bg-black/50" 
            onPress={() => setShowLanguageMenu(false)} 
            activeOpacity={1} 
          />
          <ThemedView className="absolute top-20 right-4 w-64 rounded-2xl shadow-2xl" style={{ backgroundColor: '#ffffff' }}>
            <ThemedView className="p-4 border-b border-gray-200" style={{ backgroundColor: 'transparent' }}>
              <ThemedText className="text-lg font-semibold text-gray-900">{t('settings.main.language_title')}</ThemedText>
            </ThemedView>
            <ScrollView className="max-h-96">
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  className="flex-row items-center justify-between py-3 px-4 border-b border-gray-100"
                  style={{
                    backgroundColor: i18n.language === lang.code ? '#FEF2F2' : '#ffffff',
                  }}
                  onPress={() => handleLanguageChange(lang.code)}
                >
                  <ThemedView className="flex-row items-center" style={{ backgroundColor: 'transparent' }}>
                    <ThemedText className="text-2xl mr-3">{lang.flag}</ThemedText>
                    <ThemedText 
                      className="text-base"
                      style={{
                        fontWeight: i18n.language === lang.code ? '600' : '400',
                        color: i18n.language === lang.code ? '#E75B3B' : '#374151',
                      }}
                    >
                      {lang.name}
                    </ThemedText>
                  </ThemedView>
                  {i18n.language === lang.code && (
                    <Globe color="#E75B3B" size={18} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </ThemedView>
        </ThemedView>
      )}
    </SafeAreaView>
  );
}