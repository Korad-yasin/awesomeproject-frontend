import React, { useContext, useState } from 'react';
import { View, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import SetupContext from '../SetupContext';
import Header from '../reusable/header';
import NextButton from '../reusable/button';
import SportsGrid from '../components/sportsgrid';
import { updateFitnessChoices } from '../services/userService';
import useFonts from '../hooks/useFonts';



const Fitnesschoice = ({ navigation }) => {
    const { userId } = useContext(SetupContext);
    const [selectedSports, setSelectedSports] = useState([]);

    // hooks
    const fontLoaded = useFonts();

    if (!fontLoaded) {
        return <ActivityIndicator size="large" />;
    }




    const next = async () => {
        if (selectedSports.length === 0 || selectedSports.length > 3) {
            alert('Please select 1 to 3 fitness options.');
            return;
        }
        // Assuming updateFitnessChoices is already defined in userService.js
        try {
            await updateFitnessChoices(userId, selectedSports); // Replace 'userId' with actual user ID
            navigation.navigate('fitnesslevel');
        } catch (error) {
            console.error('Failed to update fitness choices:', error);
        }
    };

    const skip = async () => {
        // Navigate to the next screen
        navigation.navigate('fitnesslevel');
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
                    <SportsGrid
                      onSelectionChange={setSelectedSports} 
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


// stylesheets 
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
        backgroundColor: 'white',
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

export default Fitnesschoice;