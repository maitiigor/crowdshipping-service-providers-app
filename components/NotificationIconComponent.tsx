import { router } from "expo-router";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchNotifications } from "../store/slices/notificationSlice";
import { BellNotification, Icon } from "./ui/icon";

export default function NotificationIconComponent() {
  const dispatch = useAppDispatch();
  const { notifications, loading } = useAppSelector((state) => state.notification);
  useEffect(() => {
    dispatch(fetchNotifications());
  }, []);
  return <ThemedView>
    <TouchableOpacity onPress={() => router.push('/screens/notifications')}>
      <ThemedView className="relative">
        <Icon as={BellNotification} size="xl" />
        <ThemedView className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
          <ThemedText className="text-white text-xs">{notifications.length}</ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  </ThemedView>
    ;
}
