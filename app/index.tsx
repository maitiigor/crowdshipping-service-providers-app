import { Redirect } from "expo-router";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { loadHasLaunched, restoreSession } from "../store/slices/authSlice";

export default function AppIndex() {
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth);
    // useEffect(() => {
    //     const clearSession = async () => {
    //         await AsyncStorage.removeItem("user");
    //     };
    //     clearSession();
    // }, []); // 👈 runs only once, not every render
    // restore session on mount
    useEffect(() => {
        dispatch(restoreSession());
        dispatch(loadHasLaunched());
    }, [dispatch]);

    // don't call router.replace() here, let Redirect handle it

    if (auth.isRestoring) {
        return null;
    }

    if (!auth.hasLaunched) {
        // first launch → go onboarding
        return <Redirect href="/screens/language-selection" />;
    }

    if (auth.isAuthenticated && (auth.user.kycStatus !== "pending" || auth.userProfile.isVerfied)) {
        return <Redirect href="/screens/dashboard" />;
    }

    if (auth.isAuthenticated && (auth.user.kycStatus === "pending" || !auth.userProfile.isVerfied)) {
      
        return <Redirect href="/screens/onboarding/edit-profile" />;
    }

    return <Redirect href="/screens/onboarding/login" />;
}
