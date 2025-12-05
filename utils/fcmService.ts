import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const FCM_TOKEN_KEY = '@fcm_token';

/**
 * Initialize Firebase Cloud Messaging
 * Sets up background message handler and requests permissions
 */
export async function initializeFCM(): Promise<string | null> {
  try {
    // Request permission for iOS
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.warn('FCM: iOS notification permission not granted');
        return null;
      }
    }

    // Request permission for expo-notifications (required for local notifications)
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('FCM: Expo notification permission not granted');
      return null;
    }

    // Get FCM token
    const token = await messaging().getToken();
    console.log('FCM Token:', token);

    // Save token to AsyncStorage
    await AsyncStorage.setItem(FCM_TOKEN_KEY, token);

    return token;
  } catch (error) {
    console.error('FCM: Failed to initialize:', error);
    return null;
  }
}

/**
 * Get the current FCM token from AsyncStorage
 */
export async function getFCMToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(FCM_TOKEN_KEY);
  } catch (error) {
    console.error('FCM: Failed to get token from storage:', error);
    return null;
  }
}

/**
 * Remove FCM token from storage (call on logout)
 */
export async function removeFCMToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(FCM_TOKEN_KEY);
    await messaging().deleteToken();
    console.log('FCM: Token removed');
  } catch (error) {
    console.error('FCM: Failed to remove token:', error);
  }
}

/**
 * Set up background message handler
 * This must be called outside of the app component
 */
export function setupBackgroundMessageHandler(): void {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('FCM: Background message received:', remoteMessage);

    // Display local notification when app is in background
    if (remoteMessage.notification) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification.title || 'New Notification',
          body: remoteMessage.notification.body || '',
          data: remoteMessage.data,
          sound: true,
        },
        trigger: null,
      });
    }
  });
}

/**
 * Handle notification tap/press
 * Returns the screen to navigate to based on notification data
 */
export function getNavigationFromNotification(
  notification: FirebaseMessagingTypes.RemoteMessage
): string | null {
  const data = notification.data;

  if (!data) return null;

  // Check for explicit screen path in data
  if (data.screen) {
    return data.screen as string;
  }

  // Handle different notification types
  switch (data.type) {
    case 'booking_update':
    case 'booking_new':
      return data.bookingId
        ? `/screens/bookings/${data.bookingId}`
        : '/screens/bookings';

    case 'trip_update':
    case 'trip_new':
      return data.tripId ? `/screens/trips/${data.tripId}` : '/screens/trips';

    case 'message':
    case 'chat':
      return data.chatId ? `/screens/chats/${data.chatId}` : '/screens/chats';

    case 'payment':
      return '/screens/payments';

    case 'notification':
      return '/screens/notifications';

    default:
      return '/screens/dashboard';
  }
}

/**
 * Create notification channels for Android
 */
export async function createNotificationChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;

  try {
    // Default channel
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default Notifications',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E75B3B',
      sound: 'default',
    });

    // Booking updates channel
    await Notifications.setNotificationChannelAsync('bookings', {
      name: 'Booking Updates',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E75B3B',
      sound: 'default',
    });

    // Messages channel
    await Notifications.setNotificationChannelAsync('messages', {
      name: 'Messages',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E75B3B',
      sound: 'default',
    });

    // Trip updates channel
    await Notifications.setNotificationChannelAsync('trips', {
      name: 'Trip Updates',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E75B3B',
      sound: 'default',
    });

    console.log('FCM: Notification channels created');
  } catch (error) {
    console.error('FCM: Failed to create notification channels:', error);
  }
}
