import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { restoreSession } from "../store/slices/authSlice";

export default function AppIndex() {
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth);
    useEffect(() => {
        const clearSession = async () => {
            await AsyncStorage.removeItem("user");
        };
        clearSession();
    }, []); // 👈 runs only once, not every render
    // restore session on mount
    useEffect(() => {
        dispatch(restoreSession());
    }, []);

    // don't call router.replace() here, let Redirect handle it

    if (!auth.hasLaunched) {
        // first launch → go onboarding
        return <Redirect href="/screens/language-selection" />;
    }

    if (auth.isAuthenticated) {
        return <Redirect href="/screens/dashboard" />;
    }

    return <Redirect href="/screens/onboarding/login" />;
}
