import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useSelector } from 'react-redux';
import axios from 'axios'; // Import axios
import { API_URL } from '../config';

const Preferences = ({navigation}) => {

  const loggedInUserId = useSelector(state => state.loggedInUser.pgId);

  useEffect(() => {
    const fetchCurrentPreferences = async () => {
      try {
        const response = await axios.get(`${API_URL}/currentPreferences`, { params: { userId: loggedInUserId } });
        const prefs = response.data;
        console.log('Fetched preferences:', prefs);
  
        setLocation_preference(prefs.location_preference);
        const ageRange = prefs.age_preference.slice(1, -1).split(',').map(Number);
        setAge_preference(ageRange);
        setGender(prefs.gender);
        setLookingFor(prefs.looking_for ? prefs.looking_for.split(', ') : []);
        setPreferredGender(prefs.preferred_gender);
        setWorkoutTimePreference(prefs.workout_time_preference);
        setWorkoutFrequency(prefs.workout_frequency);


      } catch (error) {
        console.error('Error fetching preferences:', error);
      }
    };
  
    fetchCurrentPreferences();
  }, [loggedInUserId]);


  const updatePreferences = async () => {
    console.log('Current age_preference state:', age_preference);
    try {
      const agePreferenceStr = `[${age_preference[0]},${age_preference[1]})`;
      const preferencesData = {
        userId: loggedInUserId,
        location_preference,
        age_preference: agePreferenceStr,
        gender,
        looking_for: lookingFor.join(', '),
        preferred_gender: preferredGender,
        workout_time_preference: workoutTimePreference,
        workout_frequency: workoutFrequency

        // ... other preferences
      };

      console.log('Sending preferences data:', preferencesData);


      const response = await axios.patch(`${API_URL}/updatePreferences`, preferencesData);
      console.log('Preferences updated:', response.data);
      // Navigate to Settings upon successful update
      navigation.navigate('Settings');
    } catch (error) {
      console.error('Error updating preferences:', error);
      // Handle error (show an alert or message)
    }
  };


 

  const [location_preference, setLocation_preference] = useState(0);
  const [age_preference, setAge_preference] = useState([15, 100]);

  const [gender, setGender] = useState('');
  const genderOptions = ['male', 'female', 'non-binary', 'other'];
  const selectGender = (selectedGender) => setGender(selectedGender);

  const [lookingFor, setLookingFor] = useState([]);
  const lookingForOptions = ['gym buddy', 'personal trainer', 'Im a personal trainer'];
  const toggleLookingFor = (option) => {
    if (lookingFor.includes(option)) {
      // If the option is already selected, remove it
      setLookingFor(lookingFor.filter(lf => lf !== option));
    } else {
      // If the option is not selected, add it only if there are fewer than 2 already selected
      if (lookingFor.length < 2) {
        setLookingFor([...lookingFor, option]);
      } else {
        // Here you can alert the user that they can only select two options, or automatically remove the first and add the new one
        alert('You can only choose two options.');
        // Or uncomment the next line to replace the first selected with the new one
        // setLookingFor([lookingFor[1], option]);
      }
    }
  };

  const [preferredGender, setPreferredGender] = useState(null);
  const preferredGenderOptions = ['gym gal', 'gym guy', 'any gym rat'];
  const selectPreferredGender = (selectedGender) => setPreferredGender(selectedGender);


  const [workoutTimePreference, setWorkoutTimePreference] = useState(null);
  const workoutTimeOptions = ['early morning', 'before noon', 'afternoons', 'night'];
  const selectWorkoutTime = (time) => setWorkoutTimePreference(time);

  const [workoutFrequencyOption, setWorkoutFrequencyOption] = useState('');
  const [workoutFrequency, setWorkoutFrequency] = useState(null);
  const workoutFrequencyOptions = ['1 - 3', '3 - 5', 'more than 5'];
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


  const preferenceItems = [
    {
      key: 'distance',
      title: 'Distance',
      render: () => (
        <View style={styles.preferenceContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={50}
            onValueChange={(value) => setLocation_preference(Math.round(value))}
            minimumTrackTintColor="#B10404"
            maximumTrackTintColor="#DADADA"   
            thumbTintColor="#B10404"
            
          />
          <Text style={styles.distanceText}>{location_preference} mi</Text>
        </View>
      ),
    },
    {
      key: 'age',
      title: 'Age',
      render: () => (
        <View style={styles.preferenceContainer}>
          <MultiSlider
            style={styles.slider}
            values={age_preference}
            sliderLength={240}
            onValuesChange={setAge_preference}
            min={15}
            max={100}
            step={1}
            allowOverlap={false}
            minMarkerOverlapDistance={1}
            selectedStyle={{backgroundColor: '#B10404'}}
            unselectedStyle={{backgroundColor: '#DADADA'}}
            markerStyle={{backgroundColor: '#B10404'}}
          />
          <Text style={styles.ageText}>{`${age_preference[0]} - ${age_preference[1]}`}</Text>
        </View>
      ),
    },
    {
      key: 'gender',
      title: 'Choose your gender',
      render: () => (
        <View style={styles.preferenceContainer}>
          <View style={styles.optionsWrapper}>
          {genderOptions.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => selectGender(option)}
              style={[
                styles.individualOptionContainer,
                gender === option && styles.optionSelected,
              ]}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
          </View>
          
        </View>
      ),
    },
    {
      key: 'lookingFor',
      title: 'Looking For',
      render: () => (
        <View style={styles.preferenceContainer}>
          <View style={styles.optionsWrapper}>
          {lookingForOptions.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => toggleLookingFor(option)}
              style={[
                styles.individualOptionContainer,
                lookingFor.includes(option) && styles.optionSelected,
              ]}
            >
              <Text style={styles.lookingForOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
          </View>
        </View>
      ),
    },
    {
      key: 'preferredGender',
      title: 'Preferred Gender',
      render: () => (
        <View style={styles.preferenceContainer}>
          <View style={styles.optionsWrapper}>
          {preferredGenderOptions.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => selectPreferredGender(option)}
              style={[
                styles.individualOptionContainer,
                preferredGender === option && styles.optionSelected,
              ]}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
          </View>    
        </View>
      ),
    },
    {
      key: 'workoutTime',
      title: 'Workout Time',
      render: () => (
        <View style={styles.preferenceContainer}>
          <View style={styles.optionsWrapper}>
          {workoutTimeOptions.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => selectWorkoutTime(option)}
              style={[
                styles.individualOptionContainer,
                workoutTimePreference === option && styles.optionSelected,
              ]}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
          </View>   
        </View>
      ),
    },
    {
      key: 'workoutFrequency',
      title: 'Workout Frequency',
      render: () => (
        <View style={styles.preferenceContainer}>
          <View style={styles.optionsWrapper}>
          {workoutFrequencyOptions.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => selectWorkoutFrequency(option)}
              style={[
                styles.individualOptionContainer,
                workoutFrequencyOption === option && styles.optionSelected,
              ]}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
          </View>
        </View>
      ),
    },
    


    // Add more preference objects here
  ];

  const renderPreferenceItem = ({ item }) => (
    <View>
      <Text style={styles.title}>{item.title}</Text>
      {item.render()}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.topContainer}>
             <FlatList
               data={preferenceItems}
               renderItem={renderPreferenceItem}
               keyExtractor={item => item.key}
               contentContainerStyle={styles.listContainer}
           />
          </View>
          <View style={styles.bottomContainer}>
           <View style={styles.nextButtonContainer}>
             <TouchableOpacity onPress={updatePreferences} style={styles.nextButton}>
               <Text style={styles.nextButtonText}>Update</Text>
             </TouchableOpacity>
           </View>
          </View>
       </View>
    </SafeAreaView>
    
  );
    
};
// stylesheet code

const { height } = Dimensions.get('window'); // Obtain the height of the screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',

  }, 
  topContainer: {
    flex: 5/6,


  },
  bottomContainer: {
    flex: 1/6,
    backgroundColor: 'white',

  },
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  nextButtonContainer: {
    width: '80%',
    height: 56,
    backgroundColor: '#FFBB56',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    top: height * 0.03,
    left: '10%',

   
  },
  nextButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202244',
    fontFamily: 'Urbanist-VariableFont',

  },
  listContainer: {
    padding: 10,
    backgroundColor: 'white',
   
    
  },
  preferenceContainer: {
    
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    

    
    
    // Apply additional styles if needed
  }, 
  title: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Arial',
    padding: 5,
    left: '2%',
    // your title styles
  },
  slider: {
    width: '86%',
    
   
    // your slider styles
  },
  distanceText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'Arial',
    left: '86%',
    bottom: height * 0.033,


  },
  ageText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: 'Arial',
    left: '85%',
    bottom: height * 0.04,

  },
  optionsWrapper: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Center items vertically
    marginVertical: 10, // Vertical space for the container
    flexWrap: 'wrap', 

    // ... other styles you need
  },
  optionSelected: {
    backgroundColor: '#FFD2C9', 
    
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
    marginHorizontal: 7,
    right: '15%',
    
  },

    
});

export default Preferences;
