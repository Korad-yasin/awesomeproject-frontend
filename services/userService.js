// userService.js
import axios from 'axios';
import { API_URL } from '../config';

// birthdate.js
export const updateUserSetupStep = (userId, birthday) => {
  return axios.post(`${API_URL}/birthdate`, {
    userId,
    birthday,
    lastcompletedsetupstep: 0,
  });
};

// gender.js
export const updateUserGender = (userId, gender) => {
  return axios.post(`${API_URL}/updateGender`, {
    userId,
    gender,
    lastcompletedsetupstep: 1,
  });
};

// genderpref.js
export const updateGenderPreferences = (userId, selectedGenders) => {
  return axios.post(`${API_URL}/updateGenderPreferences`, {
    userId,
    selectedGenders,
    lastcompletedsetupstep: 2,
  });
};

// fitnesschoice.js
export const updateFitnessChoices = (userId, selectedSports) => {
  return axios.post(`${API_URL}/updateFitnessChoices`, {
    userId,
    selectedSports,
    lastcompletedsetupstep: 3,
  });
};

// fitnesslevel.js
export const updateFitnessLevel = (userId, selectedLevel) => {
  return axios.post(`${API_URL}/updateFitnessLevel`, {
    userId,
    fitnessLevel: selectedLevel,
    lastcompletedsetupstep: 4,
  });
};

// fitnesstime.js
export const updateFitnessTimes = (userId, selectedTime, selectedFrequency) => {
  return axios.post(`${API_URL}/updateFitnessTimes`, {
    userId,
    selectedTime,
    selectedFrequency,
    lastcompletedsetupstep: 5,
  });
};

// college.js
export const updateCollegeSelections = (userId, selectedCollege, selectedOtherColleges) => {
  return axios.post(`${API_URL}/updateCollegeSelections`, {
    userId,
    selectedCollege,
    selectedOtherColleges,
    lastcompletedsetupstep: 6,
  });
};

// age.js
export const updateAgePreferences = (userId, age_preference) => {
  return axios.post(`${API_URL}/setup4`, {
    userId,
    age_preference,
    lastcompletedsetupstep: 7,
  });
};

// Pictures.js
export const completeUserProfileSetup = async (userId, avatarUrl, galleryUrls) => {
  try {
    const response = await axios.post(`${API_URL}/setup5`, {
      userId, 
      avatarUrl, 
      galleryUrls,
      lastcompletedsetupstep: 8,
    });
    return response.data;
  } catch (error) {
    console.error('Error during setup5:', error);
    throw error; // Re-throw the error so you can catch it in the component and handle it accordingly
  }
};

