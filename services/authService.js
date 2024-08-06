// services/authServices.js

import axios from 'axios';
import { API_URL } from '../config';
import auth from '@react-native-firebase/auth';

export const registerUser = async (email, password, name) => {
  const userCredential = await auth().createUserWithEmailAndPassword(email, password);
  const user = userCredential.user;

  // Assuming your backend correctly returns a 'pgId' along with other data
  const response = await axios.post(`${API_URL}/store-user-data`, {
    uid: user.uid,
    name,
    email,
  });

  console.log("API Response:", response.data);

  if (response.status === 200 && response.data.id) {
    return { 
      uid: user.uid, 
      email: user.email, 
      name: name, 
      pgId: response.data.id 
    };
    
  } else {
    throw new Error('Failed to store user data or pgId is missing');
  }
};

// Function to update user's name
export const updateUserData = async (userId, name, email) => {
    const response = await axios.post(`${API_URL}/store-user-data`, {
      uid: userId,
      name,
      email,
    });
  
    if (response.status === 200) {
      console.log("User's name updated successfully.");
      return response.data;
    } else {
      throw new Error("Failed to update user's name");
    }
};

// authService.js


export const getUserDetails = async (firebaseUid) => {
  try {
    const response = await axios.get(`${API_URL}/users/firebase/${firebaseUid}`);
    console.log("Fetched user details:", response.data);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Failed to fetch user data');
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};




 