import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import { API_URL } from '../config';

export const fetchAndUpdateLocation = async (userId) => {
  console.log("fetchAndUpdateLocation function started for userId:", userId);

  // Check and request location permission
  const permission = await Geolocation.requestAuthorization("whenInUse");
  console.log("Location permission status:", permission);

  if (permission === 'granted') {
    // Permission granted, fetch the current position
    console.log("Permission granted, attempting to fetch position...");
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Got position:", latitude, longitude);

        try {
          // Make the API call to update the location in your database
          console.log("Attempting to update location on server...");
          await axios.put(`${API_URL}/user-location/${userId}`, {
            latitude,
            longitude,
          });
          console.log("Location updated successfully");
        } catch (error) {
          console.error('Error updating location:', error);
        }
      },
      (error) => {
        // Error callback for getCurrentPosition
        console.error('Error fetching location:', error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  } else {
    // Location permission denied or not granted
    console.error("Location permission denied or not granted");
  }
};
