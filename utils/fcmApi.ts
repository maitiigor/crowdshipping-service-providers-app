import { getFCMToken, removeFCMToken } from '@/utils/fcmService';
import axios from 'axios';

// TODO: Replace with your actual API base URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://your-api.com';

/**
 * Send FCM token to backend
 * Call this after user logs in
 */
export async function registerFCMToken(token: string, userId: string): Promise<boolean> {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/fcm/register`, {
      token,
      userId,
      platform: 'android', // or detect platform
    });

    console.log('FCM token registered:', response.data);
    return true;
  } catch (error) {
    console.error('Failed to register FCM token:', error);
    return false;
  }
}

/**
 * Remove FCM token from backend
 * Call this when user logs out
 */
export async function unregisterFCMToken(userId: string): Promise<boolean> {
  try {
    const token = await getFCMToken();
    if (!token) return true;

    await axios.delete(`${API_BASE_URL}/api/fcm/unregister`, {
      data: { token, userId },
    });

    // Remove from local storage
    await removeFCMToken();

    console.log('FCM token unregistered');
    return true;
  } catch (error) {
    console.error('Failed to unregister FCM token:', error);
    return false;
  }
}

/**
 * Update FCM token on backend
 * Call this when token is refreshed
 */
export async function updateFCMToken(newToken: string, userId: string): Promise<boolean> {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/fcm/refresh`, {
      token: newToken,
      userId,
    });

    console.log('FCM token updated:', response.data);
    return true;
  } catch (error) {
    console.error('Failed to update FCM token:', error);
    return false;
  }
}
