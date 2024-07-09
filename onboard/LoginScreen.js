import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Pressable, SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';  // Importing useDispatch
import { setLoggedInUser } from '../redux/actions/userActions'; // Adjust the path accordingly
import auth from '@react-native-firebase/auth';
import { API_URL } from '../config';
import axios from 'axios';
import * as Font from 'expo-font';
import Show from '../assets/images/Show.js';
import Hide from '../assets/images/Hide.js';
import SetupContext from '../SetupContext';



const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();  // Initializing dispatch
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { setUserId, setIsReturningUser } = useContext(SetupContext);

  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);


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

      const response = await axios.get(`${API_URL}/users/firebase/${firebaseUid}`); // Fetch PostgreSQL ID using Firebase UID
      console.log("Login response data:", response.data);
      const { pg_id: pgId, avatar_url: avatarUrl, lastcompletedsetupstep } = response.data;

      // Dispatch user information to your Redux store
      dispatch(setLoggedInUser({
        id: userCredential.user.uid,
        email: userCredential.user.email,
        pgId, // Correctly setting pgId
        avatarUrl,
        lastcompletedsetupstep,
        // Add this line to store the PostgreSQL ID
        
      }));
      setUserId(pgId);
      console.log("Dispatching setLoggedInUser:", response.data);

      let nextScreen = 'BottomTabNavigator';
      if (lastcompletedsetupstep !== undefined && lastcompletedsetupstep < 5) {
        setIsReturningUser(true);
        // If the user has not completed all setup steps, navigate to the next incomplete setup screen
        nextScreen = `Setup${lastcompletedsetupstep + 1}`;
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcome}>Welcome back! Glad to see you, Again!</Text>
        {showError && (
          <View style={styles.errorContainer}>
           <Text style={styles.errorText}>{errorMessage}</Text>
         </View>
        )}
      </View>
      <View style={styles.otherContainer}>
      <View style={styles.emailContainer}>
        <TextInput
          style={styles.input}
          placeholder="Your Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input2}
          placeholder="Password"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
         onPress={() => setIsPasswordVisible(prevState => !prevState)}
         style={styles.visibilityToggle}
        >
         {isPasswordVisible ? <Hide /> : <Show />}
       </TouchableOpacity>
      </View>
      <Pressable onPress={login} style={styles.loginButton}>
         <View style={styles.buttonText}>
           <Text style={styles.buttonText}>Login</Text>
         </View>
       </Pressable>
      <View style={styles.forgotPasswordContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.registerContainer}>
        <TouchableOpacity style={styles.registerText} onPress={() => navigation.navigate('Registration')}>
          <Text style={styles.registerText1}>No Account?  </Text>
          <Text style={styles.registerText2}>Register Now</Text>
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
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFEEC4',
  },
  welcomeContainer: {
    flex: 0.3,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    borderTopLeftRadius: 60, 
    borderTopRightRadius: 60, 
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    fontFamily: 'Urbanist-VariableFont',
    marginTop: 50,
    
    
  },
  errorContainer: {
    backgroundColor: 'lightpink',
    padding: 20,
    borderRadius: 5,
    marginVertical: 5,
    marginTop: 30,
  },
  errorText: {
    color: 'darkred', 
    textAlign: 'center',
  },
  otherContainer: {
    flex: 0.7,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  emailContainer: {
    height: 55,
    width: '80%',
    borderRadius: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#000000',
    marginTop: 10,
    marginBottom: 10,

    
  },
  passwordContainer: {
    height: 55,
    width: '80%',
    paddingHorizontal: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#000000',
    marginTop: 10,

  },
  loginButton: {
    width: '80%',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFBB56',
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: height * 0.15, 
    marginBottom: height * 0.1, 
  },
  visibilityToggle: {
    marginLeft: 10, 
    left: '90%',
    bottom: '15%',

  },
  input: {    
    fontSize: 18,
    fontFamily: 'Urbanist-VariableFont',
    fontWeight: '400',
    width: '100%',
  },
  input2: {
    fontSize: 18,
    fontFamily: 'Urbanist-VariableFont',
    fontWeight: '400',
    width: '90%',
    top: '25%',

  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'Urbanist-VariableFont',
    fontWeight: '400',
    color: '#202244',
    
  },
  registerText: {
    flexDirection: 'row',
  },
  registerText1: {
    fontSize: 16,
    fontFamily: 'Urbanist-VariableFont',
    fontWeight: '400',
    color: 'black',
    marginTop: 5,
  },
  registerText2: {
    fontSize: 16,
    fontFamily: 'Urbanist-VariableFont',
    fontWeight: '400',
    color: 'green',
    marginTop: 5,

  },
  registerContainer: {
    marginTop: height * 0.05, 
    alignSelf: 'center', 

  },
  forgotPasswordContainer: {
    position: 'absolute', 
    right: '10%', 
    top: height * 0.18, 
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Urbanist-VariableFont',
    fontWeight: '400',
    color: 'black',
    
  },
});

export default LoginScreen;
