import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView, Dimensions } from 'react-native';
import * as Font from 'expo-font';
import Gym from '../assets/images/Gym.js';
import Gym2 from '../assets/images/Gym2.js';


const WelcomeScreen = ({ navigation }) => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isLifted, setIsLifted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLifted(prevIsLifted => !prevIsLifted); // Toggle the state every 3 seconds
    }, 2000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
         <View style={styles.welcomeContainer}>
           <Text style={styles.welcomeText}>trybe</Text>
           <View style={styles.icon}>
            {isLifted ? <Gym2 /> : <Gym /> }
           </View>
         </View>
        <View style={styles.buttonContainers}>
             <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
                 <Text style={styles.loginText}>Login</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Registration')}>
                 <Text style={styles.registerText}>Register</Text>
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
    backgroundColor: '#FFEEC4' 
  },
  container: {
    flex: 1,
    backgroundColor: '#FFEEC4',
    
  },
  welcomeContainer: {
    flex: 0.5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFEEC4',
    marginTop: 10,
    padding: 20,
    
  },
  welcomeText: {
    color: 'black',
    fontSize: 50,
    fontFamily: 'Chewy-Regular',
    fontWeight: 'bold',
    top: height * 0.05,
  },
  icon: {
    backgroundColor: '#FFEEC4',
    top: height * 0.1,

  },
  buttonContainers: {
    flex: 0.5,
    backgroundColor: '#FFEEC4',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  registerButton: {
    backgroundColor: '#FFBB56',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 10,

    
  },
  registerText: {
    color: '#202244',
    fontSize: 20,
    fontFamily: 'Urbanist-VariableFont',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    marginBottom: 10,
  },
  loginText: {
    color: '#000',
    fontSize: 20,
    fontFamily: 'Urbanist-VariableFont',
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
