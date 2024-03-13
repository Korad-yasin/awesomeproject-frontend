import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider'; // Import MultiSlider here
import SetupContext from '../SetupContext';
import * as Font from 'expo-font';
import axios from 'axios'; // Import axios
import { API_URL } from '../config';


const Setup4Screen = ({ navigation }) => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const { userId} = useContext(SetupContext);
  const { setupData, setSetupData } = useContext(SetupContext);
  const [age_preference, setAge_preference] = useState([10, 100]); // Age is now an array
  
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
    if (age_preference[0] < 15 || age_preference[1] > 100) {
      alert('Please enter a valid age.');
      return;
    }

    // Update the setup data
    setSetupData(prevData => ({ ...prevData, age_preference }));

    // Send the data to the server
    try {
      const response = await axios.post(`${API_URL}/setup4`, {
        userId,  // replace "id" with the actual variable where you're storing the user's ID
        age_preference,
        lastcompletedsetupstep: 4, 
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

    // Navigate to the next screen
    navigation.navigate('Setup5');
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
        <Text style={styles.title}>Age Preference</Text>
      </View>
      <View style={styles.sliderContainer}>
        <MultiSlider
        values={age_preference}
        sliderLength={280}
        onValuesChange={setAge_preference}
        min={15}
        max={100}
        step={1}
        allowOverlap={false}
        minMarkerOverlapDistance={10}
        selectedStyle={{backgroundColor: '#FF775C'}}
        unselectedStyle={{backgroundColor: '#DADADA'}}
        markerStyle={{backgroundColor: '#FF775C'}}
        />
      </View>
      <View style={styles.distanceContainer}>
      <Text style={styles.distanceText}>{`${age_preference[0]} - ${age_preference[1]}`}</Text>
      </View>
      <View style={styles.nextButtonContainer}> 
        <TouchableOpacity onPress={next} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>

    </SafeAreaView>
    
  );
};

const { height } = Dimensions.get('window'); // Obtain the height of the screen
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
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
  titleContainer: {
    position: 'absolute',
    top: height * 0.08,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'Urbanist-VariableFont',
  },
  sliderContainer: {
    position: 'absolute',
    alignItems: 'center',
    top: height * 0.25,
  },
  distanceContainer: {
    position: 'absolute',
    top: height * 0.2,
  },
  distanceText: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Urbanist-VariableFont',
    
  },
  nextButtonContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    bottom: height * 0.1,
  },
  nextButton: {
    width: '80%',
    height: 56,
    backgroundColor: '#FF6A4D',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202244',
    fontFamily: 'Urbanist-VariableFont',
  },
});

export default Setup4Screen;
