// ResetPasswordScreen.js

import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import useFonts from '../hooks/useFonts';

import EmailTextInput from '../reusable/EmailAndName';
import NextButton from '../reusable/button';
import ScreenTitle from '../reusable/ScreenTitle';
import ClickableText from '../reusable/clickableText';


const ResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const fontLoaded = useFonts();
  if (!fontLoaded) {
    return <ActivityIndicator size="large" />;
  }

  const resetPassword = async () => {
    try {
      await auth().sendPasswordResetEmail(email);
      console.log('Password reset email sent');
      // Notify the user that the password reset email has been sent
      Alert.alert(
        'Success',
        'A password reset link has been sent to your email. Please check your inbox and follow the instructions to reset your password.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login') // Navigate to the login screen
          },
        ]
      ); 
    } catch (error) {
      console.error('Error in sending password reset email:', error);
      Alert.alert('Error', 'Failed to send password reset email. Please try again later.');
    }
  };

  const backToLogin = async () => {
    // Navigate to the next screen
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
           <View style={styles.container}>
               <View style={styles.header}>
                 <ScreenTitle  titleText="Some animation! " />  
               </View>
              <View style={styles.optionContainer}>
                  <EmailTextInput 
                     style={styles.email}
                     value={email}
                     onChangeText={setEmail}
                  />
                  <NextButton 
                     onButtonPress={resetPassword} 
                     buttonText='Submit'
                  />
                  <ClickableText 
                    style={styles.forgotPasswordText} 
                    actionText="Back to Login"
                    onActionPress={backToLogin}
                  />
        
                </View>
                <View style={styles.bottomContainer}>
                  
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
      flex: 1.5,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
  },
  optionContainer: {
      flex: 5,
      paddingVertical: 10,
      backgroundColor: 'white',  

  },
  email :{
      marginTop: 10,
      marginBottom: 20,

  },
  forgotPasswordText :{
      left: '18%',
      paddingVertical: 7,
      color: 'black',

  },
  bottomContainer: {
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'space-evenly',
  },
  
});


export default ResetPasswordScreen;
