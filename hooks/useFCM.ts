import { getFCMToken } from "@/utils/fcmService";
import { displayLocalNotification } from "@/utils/notificationHelper";
import messaging from "@react-native-firebase/messaging";
import { useEffect, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";

export function useFCM() {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    console.log("🔵 useFCM: Hook initialized");
    
    const requestUserPermission = async () => {
      console.log("🔵 useFCM: Requesting permissions...");
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        console.log("🔵 useFCM: Android permission result:", granted);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setPermissionGranted(true);
          console.log("✅ useFCM: Permissions granted");
        } else {
          console.log("❌ useFCM: Permissions denied");
        }
      } else {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        setPermissionGranted(enabled);
        console.log("🔵 useFCM: iOS permission result:", enabled);
      }
    };

    requestUserPermission();
  }, []);

  useEffect(() => {
    if (!permissionGranted) {
      console.log("⚠️ useFCM: Permissions not granted, skipping token fetch");
      return;
    }

    console.log("🔵 useFCM: Fetching FCM token...");

    const getToken = async () => {
      try {
        // Get token from storage first (set by FCM service)
        const storedToken = await getFCMToken();
        if (storedToken) {
          console.log("✅ useFCM: Token from storage:", storedToken);
          setFcmToken(storedToken);
          return;
        }

        // If not in storage, get from messaging
        const token = await messaging().getToken();
        console.log("✅ useFCM: Token from Firebase:", token);
        setFcmToken(token);
      } catch (error) {
        console.error("❌ useFCM: Failed to get FCM token:", error);
      }
    };

    getToken();

    // Listen to whether the token changes
    return messaging().onTokenRefresh((token) => {
      console.log("🔄 useFCM: Token refreshed:", token);
      setFcmToken(token);
    });
  }, [permissionGranted]);

  useEffect(() => {
    console.log("🔵 useFCM: Setting up foreground message listener...");
    
    // Handle foreground messages (when app is open)
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("📨 useFCM: FOREGROUND MESSAGE RECEIVED!");
      console.log("📨 Message data:", JSON.stringify(remoteMessage, null, 2));

      // Display local notification when app is in foreground
      try {
        await displayLocalNotification(
          remoteMessage.notification?.title || "New Notification",
          remoteMessage.notification?.body || "You have a new message",
          remoteMessage.data
        );
        console.log("✅ useFCM: Local notification displayed");
      } catch (error) {
        console.error("❌ useFCM: Failed to display notification:", error);
      }
    });

    console.log("✅ useFCM: Foreground message listener registered");

    return () => {
      console.log("🔴 useFCM: Unsubscribing from foreground messages");
      unsubscribe();
    };
  }, []);

  return { fcmToken, permissionGranted };
}
