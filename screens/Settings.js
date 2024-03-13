import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import PreferencesIcon from '../assets/images/PreferencesIcon.js';
import LocationIcon from '../assets/images/LocationIcon.js';
import Geolocation from 'react-native-geolocation-service';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '../config';

const Settings = ({ navigation }) => {
    const [updating, setUpdating] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const loggedInUserId = useSelector(state => state.loggedInUser.pgId);

    const requestPermissionAndUpdateLocation = async () => {
        setUpdating(true);
        const permission = await Geolocation.requestAuthorization("whenInUse");
        
        console.log("Location permission status:", permission); // Check permission status

        if (permission === 'granted') {
            updateLocation(); // Call updateLocation only if permission is granted
        } else {
            setUpdating(false);
            setFeedbackMessage('Location permission denied. Please enable it in settings.');
            console.log("Location permission denied or not granted");
        }
    };

    const updateLocation = async () => {
        setUpdating(true);
        
        Geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                console.log("Current position before update:", latitude, longitude);
    
                try {
                    // Make the API call to update the location in your database
                    await axios.put(`${API_URL}/user-location/${loggedInUserId}`, {
                        latitude,
                        longitude,
                    });
                    console.log("Location updated successfully to:", latitude, longitude);
                    setUpdating(false); // Stop updating (hide ActivityIndicator)
                    setFeedbackMessage('Location updated successfully.');
                    // Optionally navigate back or do something else
                } catch (error) {
                    setUpdating(false); // Stop updating (hide ActivityIndicator)
                    setFeedbackMessage('Failed to update location. Please try again.');
                    console.error('Error updating location:', error);
                }
            },
            (error) => {
                setUpdating(false); // Stop updating (hide ActivityIndicator)
                setFeedbackMessage('Failed to fetch location. Please try again.');
                console.error('Error fetching location:', error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    const navigateToPreferences = () => {
        navigation.navigate('Preferences');
    };




    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
              <TouchableOpacity style={styles.preferencesButton} onPress={navigateToPreferences}>
                 <PreferencesIcon />
              </TouchableOpacity>
              <Text style={styles.preferencesText} onPress={navigateToPreferences} >preferences</Text>
              {updating ? (
                <ActivityIndicator size="large" />
            ) : (
                <>
                 <TouchableOpacity style={styles.locationButton} onPress={requestPermissionAndUpdateLocation}>
                     <LocationIcon />
                 </TouchableOpacity>
                 <Text style={styles.locationText} onPress={requestPermissionAndUpdateLocation} > update location</Text>
                </>
            )}
            {!!feedbackMessage && <Text style={styles.feedbackText}>{feedbackMessage}</Text>}
           </View>
        </SafeAreaView>
        
    );
};

// stylesheet code

const { height } = Dimensions.get('window'); 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
    }, 
    safeArea: {
        flex: 1,
       
    },
    preferencesButton : {
        position: 'absolute',
        top: height * 0.03,
        left: '5%',
    },
    preferencesText : {
        position: 'absolute',
        top: height * 0.038,
        left: '17%',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: '400',

    },
    locationButton : {
        position: 'absolute',
        top: height * 0.09,
        left: '5%',
    },
    locationText : {
        position: 'absolute',
        top: height * 0.095,
        left: '16%',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: '400',

    },


    
});

export default Settings;
