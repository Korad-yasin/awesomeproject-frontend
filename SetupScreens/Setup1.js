import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Modal, Button, Dimensions, SafeAreaView} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import SetupContext from '../SetupContext';
import * as Font from 'expo-font';
import axios from 'axios'; // Import axios to make HTTP requests
import { API_URL } from '../config';
import Header from '../reusable/header';
import NextButton from '../reusable/button';


const Setup1 = ({ navigation }) => {
  const { userId } = useContext(SetupContext); // Add this line
  const [birthday, setBirthday] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);
  const { setupData, setSetupData } = useContext(SetupContext);

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

  if (!fontLoaded) {
    return <ActivityIndicator size="large" />;
  }

  const togglePicker = () => {
    setShowPicker(!showPicker);
  }

  const onDateChange = (_, selectedDate) => {
    setTempDate(selectedDate || tempDate);
  };

  const confirmDate = () => {
    setBirthday(tempDate);
    setShowPicker(false);
  };

  const next = () => {
    if (!birthday) {
      alert('Please enter your birthday.');
      return;
    }

    setSetupData({ ...setupData, birthday});

    // Send the data to the server
    axios.post(`${API_URL}/setup1`, {
      userId,
      birthday,
      lastcompletedsetupstep: 1,
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });

    navigation.navigate('Setup2');
  };

  const skip = async () => {
    // Navigate to the next screen
    navigation.navigate('Setup2');
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
      {showMessage && (
        <Text style={styles.continueText}>
          Continue setting up your Gym Rats profile.
        </Text>
      )}
      <View style={styles.topContainer}>
        <Text style={styles.label}>Your age?</Text>
        <View style={styles.inputContainer}>
           <TouchableOpacity onPress={togglePicker} style={styles.datePicker}>
             <Text style={styles.dateText}>{birthday.toLocaleDateString()}</Text>
           </TouchableOpacity>
           {showPicker && (
              <Modal transparent={true}>
              <View style={styles.modalContainer}>
              <View style={styles.pickerContainer}>
                 <DateTimePicker
                   mode='date'
                   display='spinner'
                   value={tempDate}
                   onChange={onDateChange}
                 />
                <Button title="Done" onPress={confirmDate} />
             </View>
          </View>
        </Modal>
      )}
    </View>
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

//stylesheet code

const { height } = Dimensions.get('window'); // Obtain the height of the screen
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white', // or any color that matches the background of your app
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20, // 20 padding on the sides
  },
  header: {
    backgroundColor: 'white',
  },
  topContainer: {
    flex: 5,
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  continueText: { // need to get rid of this and put it in a reusable file since its used across many different pages
    marginBottom: 20,
    marginTop: 10,
    fontSize: 16,
    textAlign: 'left',
    paddingHorizontal: 10,
    fontStyle: 'italic',
    fontWeight: 'bold',
    position: 'absolute',
    top: height * 0.02,
  },
  inputContainer: {
    width: '90%',
    height: 50,
    justifyContent: 'center',
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 1,
    borderRadius: 10,
    marginTop: 20,
  },
  label: {
    marginTop: 20,
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    right: '30%',
  },
  dateText: {
    textAlign: 'center',
  }, 
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Align to the bottom of the screen
    alignItems: 'center', // Center horizontally
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background when the modal Container pops up!
  },
  pickerContainer: {
    width: '100%', // Full width
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
  },  
  bottomContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',

  },
  
});

export default Setup1;