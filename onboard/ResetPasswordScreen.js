import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, SafeAreaView } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import * as Font from 'expo-font';




const ResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [fontLoaded, setFontLoaded] = useState(false);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcome}>Gym Rats</Text>
      </View>
      <View style={styles.allContainers}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Your Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={resetPassword} style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>

    </SafeAreaView>
    
  );
  
};



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFEEC4',
    

  },
  welcomeContainer: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 60, 
    borderTopRightRadius: 60, 
  },
  welcome: {
    fontSize: 36,
    textAlign: 'center',
    color: '#1E232C',
    fontFamily: 'Urbanist-VariableFont',
    fontWeight: 'bold',
  },
  allContainers: {
    flex: 0.8,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  inputContainer: {
    height: 55,
    width: '80%',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#000000',
    marginTop: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  input: {
    fontSize: 18,
    fontFamily: 'Urbanist-VariableFont',
    fontWeight: '400',
    
    width: '100%',

  }, 
  buttonContainer: {
    width: '80%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#FFBB56',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Urbanist-VariableFont',
    fontWeight: '400',
    color: '#202244',
    textAlign: 'center',
  },
});

export default ResetPasswordScreen;
