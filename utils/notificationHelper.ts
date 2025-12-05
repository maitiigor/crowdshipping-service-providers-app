import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Display a local notification
 * Used for both local notifications and displaying FCM messages when app is in foreground
 */
export async function displayLocalNotification(
  title: string,
  body: string,
  data?: any
) {
  // Request permissions (required for iOS)
  const { status } = await Notifications.requestPermissionsAsync();
  
  if (status !== "granted") {
    console.warn("Notification permissions not granted");
    return;
  }

  // Create a channel for Android (required for Android 8.0+)
  if (Platform.OS === "android") {
    // Determine channel based on notification type
    const channelId = data?.type === 'booking_update' || data?.type === 'booking_new'
      ? 'bookings'
      : data?.type === 'message' || data?.type === 'chat'
      ? 'messages'
      : data?.type === 'trip_update' || data?.type === 'trip_new'
      ? 'trips'
      : 'default';

    await Notifications.setNotificationChannelAsync(channelId, {
      name: channelId === 'bookings' ? 'Booking Updates' 
          : channelId === 'messages' ? 'Messages'
          : channelId === 'trips' ? 'Trip Updates'
          : 'Default Channel',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#E75B3B",
    });
  }

  // Display a notification
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: null, // null means show immediately
  });
}

/**
 * Set up notification response listener
 * This handles what happens when a user taps on a notification
 */
export function setupNotificationResponseListener(
  onNotificationTap: (data: any) => void
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    console.log('Notification tapped with data:', data);
    onNotificationTap(data);
  });
}

