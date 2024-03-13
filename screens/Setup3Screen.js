import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Font from 'expo-font';
import SetupContext from '../SetupContext';
import axios from 'axios'; // Import axios
import { API_URL } from '../config';


const Setup3Screen = ({ navigation }) => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const { userId } = useContext(SetupContext);
  const { setupData, setSetupData } = useContext(SetupContext);
  const [location_preference, setLocation_preference] = useState(setupData.location_preference || 0);

  const { isReturningUser, setIsReturningUser } = useContext(SetupContext);
  const [showMessage, setShowMessage] = useState(isReturningUser);

  useEffect(() => {
    if (showMessage) {
      setShowMessage(true); 
      setIsReturningUser(false); 
    }
  }, [showMessage, setIsReturningUser]);

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        'Chewy-Regular': require('../assets/fonts/Chewy-Regular.ttf'),
        'Urbanist-VariableFont': require('../assets/fonts/Urbanist-VariableFont.ttf')
      });
      setFontLoaded(true);
    };
    loadFont();
  }, []);


  const next = async () => {
    if (location_preference === 0) {
      alert('Please set your location_preference.');
      return;
    }
  
    // Save the data to the context
    setSetupData({ ...setupData, location_preference });
  
    // Send the data to the server
    try {
      const response = await axios.post(`${API_URL}/setup3`, {
        userId, 
        location_preference,
        lastcompletedsetupstep: 3,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  
    // Navigate to the next screen
    navigation.navigate('Setup4');
  };  

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      {showMessage && (
        <Text style={styles.continueText}>
          Continue setting up your Gym Rats profile.
        </Text>
      )}
       <View style={styles.titleContainer}>
        <Text style={styles.title}>Distance - matching</Text>
       </View>
       <View style={styles.sliderContainer}>
         <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={50}
          onValueChange={(value) => setLocation_preference(Math.round(value))}
          minimumTrackTintColor="#FF775C"
          maximumTrackTintColor="#DADADA"
       />
       </View>
         <View style={styles.distanceContainer}>
           <Text style={styles.distanceText}>{location_preference} miles</Text>
        </View>
        <Pressable onPress={next} style={styles.buttonContainer}>
             <View style={styles.nextButton}>
               <Text style={styles.nextButtonText}>Next</Text>
            </View>
        </Pressable>
     </View>

    </SafeAreaView>

    
    );
  };

const { height } = Dimensions.get('window'); 
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',
    },
    continueText: {
      marginBottom: 10,
      marginTop: 10,
      fontSize: 16,
      textAlign: 'left',
      paddingHorizontal: 10,
      fontStyle: 'italic',
      fontWeight: 'bold',
    },
    safeArea: {
      flex: 1,
      backgroundColor: 'white',
    },
    titleContainer: {
      position: 'absolute',
      top: height * 0.07,
 
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      textAlign: 'center',
      fontFamily: 'Urbanist-VariableFont',
    },
    sliderContainer: {
      position: 'absolute',
      width: 279,
      height: 24,
      top: height * 0.2,
    },
    distanceContainer: {
      position: 'absolute',
      top: height * 0.15,
    
    },
    distanceText: {
      fontSize: 18,
      fontWeight: '500',
      textAlign: 'center',
      fontFamily: 'Urbanist-VariableFont',
    },
    buttonContainer: {
      position: 'absolute',
      width: '80%',
      height: 56,
      backgroundColor: '#FFBB56',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: height * 0.1,

     
    },
    nextButtonText: {
      fontSize: 20,
      fontWeight: '600',
      color: '#202244',
      fontFamily: 'Urbanist-VariableFont',
    },
  });
  

export default Setup3Screen;