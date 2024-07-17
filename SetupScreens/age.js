import React, { useContext, useState, useEffect } from 'react';
import { View, Text,  StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider'; 
import SetupContext from '../SetupContext';
import * as Font from 'expo-font';
import Header from '../reusable/header';
import NextButton from '../reusable/button';
import { updateAgePreferences } from '../services/userService';


const Age = ({ navigation }) => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const { userId} = useContext(SetupContext);
  const { setupData, setSetupData } = useContext(SetupContext);
  const [age_preference, setAge_preference] = useState([17, 100]); // Age is now an array
  
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
    if (age_preference[0] < 17 || age_preference[1] > 100) {
      alert('Please enter a valid age.');
      return;
    }

    // Update the setup data
    setSetupData(prevData => ({ ...prevData, age_preference }));

    // Send the data to the server
    try {
      const response = await updateAgePreferences(userId, age_preference);
      console.log("Age preference updated successfully:", response.data);
      navigation.navigate('Pictures'); 
    } catch (error) {
      console.error("Failed to update age preferences:", error);
      alert("Failed to save your age preferences. Please try again.");
    }
  };

  const skip = async () => {
    // Navigate to the next screen
    navigation.navigate('Pictures');
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
        <View style={styles.topContainer}>
          {showMessage && (
            <Text style={styles.continueText}>
              Continue setting up your Gym Rats profile.
            </Text>
          )}
          <Text style={styles.title}>Age Preference</Text>
         <View style={styles.sliderContainer}>
          <MultiSlider
            values={age_preference}
            sliderLength={280}
            onValuesChange={setAge_preference}
            min={17}
            max={100}
            step={1}
            allowOverlap={false}
            minMarkerOverlapDistance={10}
            selectedStyle={{backgroundColor: '#FF775C'}}
            unselectedStyle={{backgroundColor: '#DADADA'}}
            markerStyle={{backgroundColor: 'black'}}
          />
         </View>
           <Text style={styles.ageText}>{`${age_preference[0]} - ${age_preference[1]}`}</Text>
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



const { height } = Dimensions.get('window'); // Obtain the height of the screen
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
  topContainer :{
    flex: 5,
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingHorizontal: 15,

  },
  continueText: { // this should be under the reusable folder
    marginBottom: 10,
    marginTop: 10,
    fontSize: 16,
    textAlign: 'left',
    paddingHorizontal: 10,
    fontStyle: 'italic',
    fontWeight: 'bold',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    textAlign: 'left',
    marginTop: 20,
    paddingHorizontal: 25,
  },
  sliderContainer: {
    alignItems: 'left',
    backgroundColor: 'transparent',
    marginTop: 80,
    paddingHorizontal: 30,
  },
  ageText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Urbanist-VariableFont',
    textAlign: 'center',
    bottom: height * 0.09,
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
});

export default Age;
