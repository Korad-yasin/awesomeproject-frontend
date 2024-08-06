// RegistrationScreen.js

import React, { useState, useContext } from 'react';
import { View, StyleSheet, ActivityIndicator, SafeAreaView} from 'react-native';
import SetupContext from '../SetupContext'; 
import { useDispatch, useSelector } from 'react-redux'; 
import { setLoggedInUser } from '../redux/actions/userActions'; 
import useFonts from '../hooks/useFonts';

import EmailTextInput from '../reusable/EmailAndName';
import PasswordInput from '../reusable/PasswordInput';
import NextButton from '../reusable/button';
import ClickableText from '../reusable/clickableText';
import ErrorMessage from '../reusable/errorMessage';
import ScreenTitle from '../reusable/ScreenTitle';

import { registerUser, updateUserData } from '../services/authService';



const RegistrationScreen = ({ navigation }) => {
  const { setUserId } = useContext(SetupContext); // Add this line

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  

  const loggedInUser = useSelector(state => state.loggedInUser); 

  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  const dispatch = useDispatch();  // Initialize useDispatch here

  const fontLoaded = useFonts();
  if (!fontLoaded) {
    return <ActivityIndicator size="large" />;
  }

  const registerOrUpdate = async () => {
    // Check if returning to RegistrationScreen without changes
    if (loggedInUser && loggedInUser.email === email) {
      if (name !== loggedInUser.name) {
        console.log("Updating user's name in the database...");
        try {
          const data = await updateUserData(loggedInUser.id, name, email);
          dispatch(setLoggedInUser({...loggedInUser, name}));
          // Optionally, refresh logged-in user info in your state here
        } catch (error) {
          console.error("Error updating user's name:", error);
        }
      }
      console.log("Navigating back to setup screens...");
      navigation.navigate('birthdate');
      return; // Prevent the registration logic from proceeding
    }

    if (password !== retypePassword) {
      setErrorMessage("Passwords do not match."); // Update the error message
      setShowError(true); // Show the error message
      return; // Stop the registration process
    }
    setShowError(false);

    try {
      const userData = await registerUser(email, password, name);
      setUserId(userData.id);
      console.log("User Data returned to RegistrationScreen:", userData);
      // Handle user data and navigation after successful registration
      dispatch(setLoggedInUser({
        id: userData.uid,
        pgId: userData.pgId,
        email: userData.email,
        name: name,
      }));
      navigation.navigate('birthdate');
    } catch (error) {
      let message = "An unexpected error occurred. Please try again.";
      if (error.code) { // Check if error code exists to determine if it's a Firebase auth error
        switch (error.code) {
          case 'auth/email-already-in-use':
            message = "The email address is already in use by another account.";
            break;
          case 'auth/weak-password':
            message = "The password is too weak. At least 6 characters must be used.";
            break;
          case 'auth/invalid-email':
            message = "Please enter a valid email address.";
            break;
          default:
            console.error("Firebase registration failed:", error);
        }
      } else {
        console.error("API call failed:", error);
      }
      setErrorMessage(message);
      setShowError(true);
    }    
  };

  // return and stylesheet

  // return and stylesheet

  return (
      <SafeAreaView style={styles.safeArea}>
           <View style={styles.container}>
               <View style={styles.header}>
                 <ScreenTitle  titleText="find your trybe " />
               </View>
              <View style={styles.optionContainer}>
                  <ErrorMessage 
                    message={errorMessage}
                    visible={showError}
                  />
                  <EmailTextInput 
                     style={styles.email}
                     value={email}
                     onChangeText={setEmail}
                     showName={true}
                     nameValue={name}
                     onChangeName={setName}
                  />
                  <PasswordInput 
                     style={styles.password}
                     value={password}
                     onChangeText={setPassword}
                     showRetype={true}
                     retypeValue={retypePassword}
                     onRetypeChange={setRetypePassword}
                  />

                </View>
                <View style={styles.bottomContainer}>
                      <NextButton 
                         onButtonPress={registerOrUpdate} 
                         buttonText='Register'
                       />
                      <ClickableText
                         mainText='Already have an account?'
                         actionText="Sign In"
                         onActionPress={() => navigation.navigate('Login')}
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
      flex: 1.3,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
  },
  optionContainer: {
      flex: 6,
      paddingVertical: 10,
      backgroundColor: 'white',
      alignItems: 'center',

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


export default RegistrationScreen;

