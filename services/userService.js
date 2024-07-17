// userService.js
import axios from 'axios';
import { API_URL } from '../config';

export const updateUserSetupStep = (userId, birthday) => {
  return axios.post(`${API_URL}/birthdate`, {
    userId,
    birthday,
    lastcompletedsetupstep: 1,
  });
};

export const updateUserGender = (userId, gender) => {
  return axios.post(`${API_URL}/updateGender`, {
    userId,
    gender
  });
};

export const updateGenderPreferences = (userId, selectedGenders) => {
  return axios.post(`${API_URL}/updateGenderPreferences`, {
    userId,
    selectedGenders
  });
};

export const updateFitnessChoices = (userId, selectedSports) => {
  return axios.post(`${API_URL}/updateFitnessChoices`, {
    userId,
    selectedSports
  });
};

export const updateFitnessLevel = (userId, selectedLevel) => {
  return axios.post(`${API_URL}/updateFitnessLevel`, {
    userId,
    fitnessLevel: selectedLevel
  });
};

export const updateFitnessTimes = (userId, selectedTime, selectedFrequency) => {
  return axios.post(`${API_URL}/updateFitnessTimes`, {
    userId,
    selectedTime,
    selectedFrequency
  });
};

export const updateCollegeSelections = (userId, selectedCollege, selectedOtherColleges) => {
  return axios.post(`${API_URL}/updateCollegeSelections`, {
    userId,
    selectedCollege,
    selectedOtherColleges
  });
};

export const updateAgePreferences = (userId, age_preference) => {
  return axios.post(`${API_URL}/setup4`, {
    userId,
    age_preference,
    lastcompletedsetupstep: 4,
  });
};

export const completeUserProfileSetup = async (userId, avatarUrl, galleryUrls) => {
  try {
    const response = await axios.post(`${API_URL}/setup5`, {
      userId, 
      avatarUrl, 
      galleryUrls,
      lastcompletedsetupstep: 5,
    });
    return response.data;
  } catch (error) {
    console.error('Error during setup5:', error);
    throw error; // Re-throw the error so you can catch it in the component and handle it accordingly
  }
};

