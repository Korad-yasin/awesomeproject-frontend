import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Pressable, SafeAreaView} from 'react-native';
import SetupContext from '../SetupContext'; 
import { API_URL } from '../config';
import auth from '@react-native-firebase/auth';
import { useDispatch, useSelector } from 'react-redux'; 
import { setLoggedInUser } from '../redux/actions/userActions'; 
import * as Font from 'expo-font';
import Show from '../assets/images/Show.js';
import Hide from '../assets/images/Hide.js';



const RegistrationScreen = ({ navigation }) => {
  const { setUserId } = useContext(SetupContext); // Add this line
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRetypePasswordVisible, setisRetypePasswordVisible] = useState(false);
  const [passwordMismatchError, setPasswordMismatchError] = useState(false);



  const [fontLoaded, setFontLoaded] = useState(false);

  const loggedInUser = useSelector(state => state.loggedInUser); 

  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  const dispatch = useDispatch();  // Initialize useDispatch here

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

  const registerOrUpdate = async () => {
    // Check if returning to RegistrationScreen without changes
    if (loggedInUser && loggedInUser.email === email) {
      if (name !== loggedInUser.name) {
        console.log("Updating user's name in the database...");
        try {
          const response = await fetch(`${API_URL}/store-user-data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: loggedInUser.id, name, email }),
          });
          dispatch(setLoggedInUser({...loggedInUser, name}));
          if (!response.ok) throw new Error("Failed to update user's name");
          console.log("User's name updated successfully.");
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
      setPasswordMismatchError(true); // Show password mismatch error
      setErrorMessage("Passwords do not match."); // Update the error message
      setShowError(true); // Show the error message
      return; // Stop the registration process
    }
    setPasswordMismatchError(false);

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        console.log('User registered with Firebase');

        // Store additional user data
        const uid = user.uid;
        const response = await fetch(`${API_URL}/store-user-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uid, name, email }),
        });
        if (response.ok) {
            const data = await response.json();
            setUserId(data.id); // Setting the user ID in context
            console.log("User data stored in our database");
            // Dispatch the action to update the Redux store
            dispatch(setLoggedInUser({
              id: user.uid,  // Firebase UID
              pgId: data.id,  // PostgresSQL ID
              email: user.email,
              name: name,
            }));
            navigation.navigate('birthdate');
          } else {
            console.error("Failed to store user data");
          }
        } catch (error) {
          let message = "An unexpected error occurred. Please try again.";
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
          setErrorMessage(message);
          setShowError(true);
        }      
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcome}>find your trybe</Text>
        {showError && (
          <View style={styles.errorContainer}>
             <Text style={styles.errorText}>{errorMessage}</Text>
         </View>
        )}
        {passwordMismatchError && (
           <View style={styles.errorContainer}>
             <Text style={styles.errorText}>Passwords do not match.</Text>
           </View>
        )}
      </View>
      <View style={styles.allContainer}>
      <View style={styles.nameContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.emailContainer}>
        <TextInput
          style={styles.input}
          placeholder="Your email"
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
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input2}
          placeholder="Retype Password"
          secureTextEntry={!isRetypePasswordVisible}
          value={retypePassword}
          onChangeText={setRetypePassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
         onPress={() => setisRetypePasswordVisible(prevState => !prevState)}
         style={styles.visibilityToggle}
        >
         {isRetypePasswordVisible ? <Hide /> : <Show />}
       </TouchableOpacity>

      </View>
      <Pressable onPress={registerOrUpdate} style={styles.buttonContainer}>
        <View style={styles.button}>
          <Text style={styles.registerText}>Register</Text>
        </View>
      </Pressable>   
      <View style={styles.textSignin}>
      <Text style={styles.text1}>Already have an account?  </Text>
      <Text style={styles.text2} onPress={() => navigation.navigate('Login')}>Sign In</Text>
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
    backgroundColor: 'teal',
    paddingHorizontal: 20,
    
  },
  welcomeContainer: {
    flex: 0.2,
    alignItems: 'center',
    backgroundColor: 'pink',
    justifyContent: 'flex-start',

    
  },
  welcome: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center', 
    fontFamily: 'Urbanist-VariableFont',
    marginTop: 50,
    backgroundColor: 'white',

  },
  errorContainer: {
    backgroundColor: 'lightpink',
    borderRadius: 5,
    marginVertical: 5,
    padding: 5,
    marginTop: 20,
  },
  errorText: {
    color: 'darkred', 
    textAlign: 'center',
  },
  allContainer: {
    flex: 0.8,
    backgroundColor: 'azure',
    alignItems: 'center',
    
  },
  input: {
    fontSize: 18,
    fontFamily: 'Urbanist-VariableFont',
    fontWeight: '400',
    textAlign: 'left',  
    width: '100%',
    height: '70%',
    
    
  },
  nameContainer: {
    height: 55,
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center', 
    alignItems: 'flex-start', 
    marginTop: 20,
   
  
  },
  emailContainer: {
    height: 55,
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center', 
    alignItems: 'flex-start', 
    marginTop: 15,
    
  },
  passwordContainer: {
    height: 55,
    width: '80%',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: height * 0.01, 
    justifyContent: 'center', 
    alignItems: 'flex-start', 
    marginTop: 15,
   
    
  },
  visibilityToggle: {
    marginLeft: 10, 
    left: '90%',
    bottom: '15%',
  },
  input2: {
    fontSize: 18,
    fontFamily: 'Urbanist-VariableFont',
    fontWeight: '400',
    textAlign: 'left',  
    width: '90%',
    top: '25%',
    
  },
  buttonContainer: {
    backgroundColor: '#FFBB56',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: height * 0.1, 
    marginBottom: height * 0.23, 
  },
  registerText: {
    color: '#202244',
    fontSize: 20,
    fontFamily: 'Urbanist-VariableFont',
    fontWeight: '400',
  },
  textSignin: {
    backgroundColor: 'white',
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    bottom: height * 0.2,
  },
  text1 : {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Urbanist-VariableFont',
    fontWeight: '400',
  },
  text2 : {
    color: 'green',
    fontSize: 16,
    fontFamily: 'Urbanist-VariableFont',
    fontWeight: 'bold',
  },

});

export default RegistrationScreen;

