import { Text, TouchableOpacity, View } from "react-native";
import { BellNotification, Icon } from "./ui/icon";
import { useAppDispatch, useAppSelector } from "../store";
import { useEffect } from "react";
import { fetchNotifications } from "../store/slices/notificationSlice";
import { router } from "expo-router";

export default function NotificationIconComponent() {
    const dispatch = useAppDispatch();
    const { notifications, loading } = useAppSelector((state) => state.notification);
    useEffect(() => {
        dispatch(fetchNotifications());
    }, []);
    return <View>
          <TouchableOpacity onPress={() => router.push('/screens/notifications')}>
            <View className="relative">
              <Icon as={BellNotification} size="xl" />
              <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs">{notifications.length}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        ;
}
