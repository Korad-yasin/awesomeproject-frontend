import React, { useContext, useState, useEffect } from 'react'; // Import useContext and useState
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, SafeAreaView, Pressable } from 'react-native';
import SetupContext from '../SetupContext'; 
import { useSelector } from 'react-redux';
import axios from 'axios'; 
import { API_URL } from '../config';
import * as Font from 'expo-font';


const Setup2Screen = ({ navigation }) => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const { userId} = useContext(SetupContext);
  const { setupData, setSetupData } = useContext(SetupContext);
  const [gender, setGender] = useState(setupData.gender || '');
  const [lookingFor, setLookingFor] = useState([]);
  const [preferredGender, setPreferredGender] = useState(null);
  const [workoutTimePreference, setWorkoutTimePreference] = useState([]);
  const [workoutFrequency, setWorkoutFrequency] = useState(null);
  const [workoutFrequencyOption, setWorkoutFrequencyOption] = useState('');
  
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

  const genderOptions = ['male', 'female', 'non-binary', 'other'];
  const lookingForOptions = ['gym buddy', 'personal trainer', 'Im a personal trainer'];
  const preferredGenderOptions = ['gym girl', 'gym guy', 'any gym rat'];
  const workoutTimeOptions = ['early morning', 'before noon', 'afternoons', 'night'];
  const workoutFrequencyOptions = ['1 - 3', '3 - 5', 'more than 5'];

  // This function will be called when a gender option is pressed
  // Selection handlers for each option
  const selectGender = (selectedGender) => setGender(selectedGender);
  const selectPreferredGender = (selectedGender) => setPreferredGender(selectedGender);

  const selectWorkoutFrequency = (frequencyOption) => {
    // Map the user's selection to the numeric value for the database
    let frequencyValue;
    switch (frequencyOption) {
      case '1 - 3':
        frequencyValue = 3;
        break;
      case '3 - 5':
        frequencyValue = 5;
        break;
      case 'more than 5':
        frequencyValue = 7; // or whatever value you've decided represents "more than 5"
        break;
      default:
        frequencyValue = null; // or handle the default case appropriately
    }
    
    // Now, set the state with the numeric value
    setWorkoutFrequency(frequencyValue);
    setWorkoutFrequencyOption(frequencyOption);
  };
  
  const toggleLookingFor = (option) => {
    // Prevent selecting 'personal trainer' and 'I'm a personal trainer' together
    if ((option === 'personal trainer' && lookingFor.includes("Im a personal trainer")) ||
        (option === "Im a personal trainer" && lookingFor.includes('personal trainer'))) {
      alert("You cannot select 'personal trainer' and 'Im a personal trainer' together.");
      return; // Stop the function here
    }
  
    if (lookingFor.includes(option)) {
      // Option is already selected, remove it
      setLookingFor(lookingFor.filter(lf => lf !== option));
    } else {
      // Add the new option if less than 2 options are already selected
      if (lookingFor.length < 2) {
        setLookingFor(prev => [...prev, option]);
      } else {
        alert('You can only choose up to two options.');
        // Optionally, you could automatically manage the selections here,
        // like removing the first selected option and adding the new one:
        // setLookingFor(prev => [prev[1], option]);
      }
    }
  };

  const toggleWorkoutTime = (option) => {
    const isAlreadySelected = workoutTimePreference.includes(option);
  
    if (isAlreadySelected) {
      // Remove the option if it's already selected
      setWorkoutTimePreference(workoutTimePreference.filter(time => time !== option));
    } else {
      // Add the option if not already selected and less than 2 are selected
      if (workoutTimePreference.length < 2) {
        setWorkoutTimePreference([...workoutTimePreference, option]);
      } else {
        // Alert or handle cases where more than 2 selections are attempted
        alert('You can select up to two options for workout times.');
      }
    }
  };
  
  
  
  


  const sections = [
    { key: 'GenderSection' },
    { key: 'LookingForSection' },
    { key: 'PreferredGenderSection' },
    { key: 'WorkoutTimeSection' },
    { key: 'WorkoutFrequencySection' }
  ];

  const renderSection = ({ item }) => {
    switch (item.key) {
      case 'GenderSection':
        return (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>1. Choose your gender:</Text>
            <View style={styles.optionsWrapper}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => selectGender(option)}
                  style={[styles.individualOptionContainer, gender === option ? styles.optionSelected : {}]}
                >
                  <Text style={styles.optionLabel}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );      
        case 'LookingForSection':
          return (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>2. Looking for:</Text>
              <View style={styles.optionsWrapper}>
                {lookingForOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => toggleLookingFor(option)}
                    style={[styles.individualOptionContainer, lookingFor.includes(option) ? styles.optionSelected : {}]}
                  >
                    <Text style={styles.optionLabel}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
          case 'PreferredGenderSection':
            return (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>3. Gender preference:</Text>
                <View style={styles.optionsWrapper}>
                  {preferredGenderOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => selectPreferredGender(option)}
                      style={[styles.individualOptionContainer, preferredGender === option ? styles.optionSelected : {}]}
                    >
                      <Text style={styles.optionLabel}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
            case 'WorkoutTimeSection':
              return (
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>4. Time of the day you work out: </Text>
                  <View style={styles.optionsWrapper}>
                    {workoutTimeOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        onPress={() => toggleWorkoutTime(option)}
                        style={[styles.individualOptionContainer, workoutTimePreference.includes(option) ? styles.optionSelected : {}]}
                      >
                        <Text style={styles.optionLabel}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              );
              case 'WorkoutFrequencySection':
                return (
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>5. Days per week you work out: </Text>
                    <View style={styles.optionsWrapper}>
                      {workoutFrequencyOptions.map((option) => (
                        <TouchableOpacity
                          key={option}
                          onPress={() => selectWorkoutFrequency(option)}
                          style={[styles.individualOptionContainer, workoutFrequencyOption === option ? styles.optionSelected : {}]}
                        >
                          <Text style={styles.optionLabel}>{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                );
      default:
        return null;
    }
  };
  
  const next = () => {
    // Validate the input
    if (!gender || lookingFor.length === 0 || !preferredGender || !workoutTimePreference || !workoutFrequency) {
      alert('Please fill in all the preferences.');
      return;
    }

    
    // Construct the data object with new preferences
    const setupDataToSend = {
      userId,
      gender,
      looking_for: lookingFor.join(', '), // Join the array into a string
      preferred_gender: preferredGender,
      workout_time_preference: workoutTimePreference.join(', '),
      workout_frequency: workoutFrequency,
      lastcompletedsetupsteps: 2,
    };

    // Send the data to the server
    axios.post(`${API_URL}/setup2`, setupDataToSend)
    .then(function (response) {
      console.log('Response from Setup2: ', response.data);
      navigation.navigate('Setup3'); // Move this inside .then to ensure navigation happens after a successful post
    })
    .catch(function (error) {
      console.error('Error on setup2 submission:', error);
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      {showMessage && (
        <Text style={styles.continueText}>
          Continue setting up your Gym Rats profile.
        </Text>
      )}
      <View style={styles.optionContainer}>
        
        <FlatList
          data={sections}
          renderItem={renderSection}
          keyExtractor={item => item.key}
        />
      </View>
      <View style={styles.bottomContainer}>
         <Pressable onPress={next} style={styles.buttonContainer}>
            <View style={styles.button}>
             <Text style={styles.buttonText}>Next</Text>
           </View>
         </Pressable>
      </View>
    </View>

    </SafeAreaView>
  );
  
};

// stylesheet code.

const { height } = Dimensions.get('window'); // Obtain the height of the screen
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white', // or any color that matches the background of your app
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: height * 0.01, 
    paddingBottom: height * 0.01, 
    paddingHorizontal: 15, 
    backgroundColor: 'white',
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
  optionContainer: {
    flex: 5,
    padding: 5,
    backgroundColor: 'white',
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',

  },
  sectionContainer: {
    padding: 5,
    
    // Add other styling similar to your previous UI's container style
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    // Add other styling for the section title
  },
  optionLabel: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: '400',
    padding: 5,
    
  },
  optionSelected: {
    backgroundColor: '#FFD2C9', // Color for selected option
     
    
  },
  optionsWrapper: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Center items vertically
    marginVertical: 10, // Vertical space for the container
    flexWrap: 'wrap', 
    // ... other styles you need
  },
  individualOptionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 99,
    borderWidth: 0.5,
    borderColor: '#1E232C',
    backgroundColor: 'white',
    paddingVertical: 7, 
    paddingHorizontal: 12, 
    marginVertical: 7,
    marginHorizontal: 10,
    
  },
  buttonContainer: {
    backgroundColor: '#FFBB56',
    borderRadius: 8,
    padding: 15,
    width: '80%',
    alignItems: 'center',
    
    
  },
  buttonText: {
    color: '#202244',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Urbanist-VariableFont',
  },
});

export default Setup2Screen;