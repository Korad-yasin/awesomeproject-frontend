import React, { useContext, useState } from 'react';
import { View, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import SetupContext from '../SetupContext';
import Header from '../reusable/header';
import NextButton from '../reusable/button';
import Times from '../components/times';
import { updateFitnessTimes } from '../services/userService';
import useFonts from '../hooks/useFonts';



const Fitnesstime = ({ navigation }) => {
    const { userId } = useContext(SetupContext);

    const [selectedTime, setSelectedTime] = useState([]);
    const [selectedFrequency, setSelectedFrequency] = useState('');
    const handleTimeSelect = (time) => {
        setSelectedTime(prevTimes => {
            if (prevTimes.includes(time)) {
                // Remove time if already selected
                return prevTimes.filter(t => t !== time);
            } else if (prevTimes.length < 2) {
                // Add time if less than 2 times are selected
                return [...prevTimes, time];
            } else {
                // Replace feedback mechanism here, e.g., alert or toast
                alert("You can select up to 2 times.");
                return prevTimes; // Return current state if 2 times are already selected
            }
        });
    };

    const handleFrequencySelect = (frequency) => {
        setSelectedFrequency(frequency); // Set frequency
    };

    
    const fontLoaded = useFonts();

    if (!fontLoaded) {
        return <ActivityIndicator size="large" />;
    }




    

    const next = async () => {
        if (!selectedTime.length || !selectedFrequency) {
            alert("Please select both a time and frequency.");
            return;
        }
    
        try {
            // Execute the API call with the current userId, selectedTime, and selectedFrequency
            const response = await updateFitnessTimes(userId, selectedTime, selectedFrequency);
            console.log("Update successful:", response.data);
            navigation.navigate('college'); // Navigate to the next screen upon successful update
        } catch (error) {
            console.error("Failed to update fitness times:", error);
            alert("Failed to save your preferences. Please try again.");
        }
    };


    const skip = async () => {
        // Navigate to the next screen
        navigation.navigate('college');
    };


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Header
                    onBackPress={() => navigation.goBack()}
                    onSkipPress={skip}
                    />
                </View>
                <View style={styles.optionContainer}>
                    <Times
                      selectedTime={selectedTime}
                      handleTimeSelect={handleTimeSelect}
                      selectedFrequency={selectedFrequency}
                      setSelectedFrequency={handleFrequencySelect}
                    />
                </View>
                <View style={styles.bottomContainer}>
                    <NextButton
                    onButtonPress={next}
                    />
               </View>
            </View>
           
        </SafeAreaView>
        
    );



};

// stylesheet

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 20,
    }, 
    header: {
        backgroundColor:'white',
    },
    optionContainer: {
        flex: 5,
        backgroundColor: 'white',
    },
    bottomContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',

    
    },
    
});

export default Fitnesstime;