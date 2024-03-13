import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import { API_URL } from '../config'; // Adjust the path to your config

export const requestNotificationPermission = async (userId) => {
  const authorizationStatus = await messaging().requestPermission();

  if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED || authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
    console.log('Notification permission authorized.');

    try {
        await messaging().registerDeviceForRemoteMessages(); // Register the device for remote messages
        const token = await messaging().getToken();
  
        if (token) {
          console.log('FCM Token:', token);
          sendTokenToBackend(userId, token);
        } else {
          console.log('Failed to get FCM token');
        }
      } catch (error) {
        console.error('Error with FCM registration or token retrieval:', error);
      }
    } else {
      console.log('Notification permission denied.');
    }
};

const sendTokenToBackend = async (userId, token) => {
  try {
    await axios.post(`${API_URL}/device-token`, {
      userId,
      token
    });
    console.log('Token sent to backend');
  } catch (error) {
    console.error('Error sending token to backend:', error);
  }
};
