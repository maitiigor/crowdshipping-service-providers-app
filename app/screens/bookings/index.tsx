import { router } from 'expo-router';
import { useEffect } from 'react';

export default function BookingsIndex() {
    useEffect(() => {
        // Redirect to history by default
        router.replace('/screens/bookings/history');
    }, []);

    return null;
}