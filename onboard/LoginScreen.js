// LoginScreen.js

import React, { useState, useContext } from 'react';
import { View, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';  // Importing useDispatch
import { setLoggedInUser } from '../redux/actions/userActions'; // Adjust the path accordingly
import auth from '@react-native-firebase/auth';
import SetupContext from '../SetupContext';
import useFonts from '../hooks/useFonts';

import EmailTextInput from '../reusable/EmailAndName';
import PasswordInput from '../reusable/PasswordInput';
import NextButton from '../reusable/button';
import ClickableText from '../reusable/clickableText';
import ErrorMessage from '../reusable/errorMessage';
import ScreenTitle from '../reusable/ScreenTitle';

import { getUserDetails  } from '../services/authService';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();  // Initializing dispatch
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserId, setIsReturningUser } = useContext(SetupContext);

  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  const fontLoaded = useFonts();
  if (!fontLoaded) {
    return <ActivityIndicator size="large" />;
  }


  const login = async () => {
    try {
      if (email === '' || password === '') {
        alert('Please fill in both fields');
        return;
      }
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      const firebaseUid = userCredential.user.uid;
      console.log('Logged in user:', user);

      const userDetails = await getUserDetails(firebaseUid);
      console.log("Fetched user details:", userDetails);


      const { avatar_url: avatarUrl, lastcompletedsetupstep, pg_id: pgId } = userDetails;
      // Dispatch user information to your Redux store
      dispatch(setLoggedInUser({
        id: userCredential.user.uid,
        email: userCredential.user.email,
        pgId,
        avatarUrl,
        lastcompletedsetupstep,
        // Add this line to store the PostgreSQL ID
        
      }));
      setUserId(pgId);
      console.log("Dispatching setLoggedInUser:", userDetails);

      let nextScreen = 'BottomTabNavigator';
      if (lastcompletedsetupstep !== undefined) {
        setIsReturningUser(true);
        switch(lastcompletedsetupstep) {
          case 0:
              nextScreen = 'birthdate'; // First setup step
              break;
          case 1:
              nextScreen = 'gender'; 
              break;
          case 2:
              nextScreen = 'genderpref'; 
              break;
          case 3:
              nextScreen = 'fitnesschoice'; // First setup step
              break;
          case 4:
              nextScreen = 'fitnesslevel'; 
              break;
          case 5:
              nextScreen = 'fitnesstime'; 
              break;

          case 6:
              nextScreen = 'college'; // First setup step
              break;
          case 7:
              nextScreen = 'age'; 
              break;
          case 8:
              nextScreen = 'Pictures'; 
              break;
      }

      } else {
        setIsReturningUser(false);
      }
      navigation.navigate(nextScreen);
    } catch (error) {
      let message = "Error: wrong password or email. Please try again";
      switch (error.code) {
        case 'auth/user-not-found':
          message = "No user with this email address found.";
          break;
        case 'auth/wrong-password':
          message = "Incorrect password. Please try again.";
          break;
        default:
          console.error("Firebase login failed:", error);
      }
      setErrorMessage(message);
      setShowError(true);
    }
  };

  // return and stylesheet

   return (
     <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
            <View style={styles.header}>
               <ScreenTitle  titleText="Welcome back! " />
            </View>
            <View style={styles.optionContainer}>
                  <ErrorMessage message={errorMessage} visible={showError} />
                  <EmailTextInput 
                     style={styles.email}
                     value={email}
                     onChangeText={setEmail}
                  />
                  <PasswordInput 
                     style={styles.password}
                     value={password}
                     onChangeText={setPassword}
                  />
                  <ClickableText 
                    style={styles.forgotPasswordText} 
                    actionText="Forgot Password?"
                    onActionPress={() => navigation.navigate('ResetPassword')}
                  />

            </View>
            <View style={styles.bottomContainer}>
                <NextButton 
                  onButtonPress={login} 
                  buttonText='Login'
                />
                <ClickableText
                  mainText='No Account?'
                  actionText="Register Now"
                  onActionPress={() => navigation.navigate('Registration')}
                />
           </View>
        </View>
      </SafeAreaView>
    );

  
  
  
};

// stylesheet code

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
      flex: 1.5,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
  },
  optionContainer: {
      flex: 6,
      paddingVertical: 20,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'flex-start',
  },
  email :{
      marginTop: 10,

  },
  password :{
      marginTop: 20,
      
  },
  forgotPasswordText :{
      left: '15%',
      color: 'black',
      paddingVertical: 5,

  },
  bottomContainer: {
      flex: 2,
      backgroundColor: 'white',
      justifyContent: 'space-evenly',
  },
  
});

export default LoginScreen;
