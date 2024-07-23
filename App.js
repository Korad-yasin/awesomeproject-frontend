import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SetupProvider } from './SetupContext';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';  // Update the import here



import BottomTabNavigator from './screens/BottomTabNavigator';
import ChatInterface from './screens/ChatInterface';

import Settings from './screens/Settings';
import Preferences from './screens/Preferences';
import ChangePictures from './screens/ChangePictures';
import Practice from './screens/Practice';

import RegistrationScreen from './onboard/RegistrationScreen';
import LoginScreen from './onboard/LoginScreen';
import ResetPasswordScreen from './onboard/ResetPasswordScreen';


import WelcomeScreen from './onboard/WelcomeScreen';

// Import the setup screens
import birthdate from './SetupScreens/birthdate';

import gender from './SetupScreens/gender';
import genderpref from './SetupScreens/genderpref';
import fitnesschoice from './SetupScreens/fitnesschoice';
import fitnesslevel from './SetupScreens/fitnesslevel';
import fitnesstime from './SetupScreens/fitnesstime';
import college from './SetupScreens/college';
import age from './SetupScreens/age';
import Pictures from './SetupScreens/Pictures';



// import reusable screens

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <SetupProvider>
         <NavigationContainer>
            <Stack.Navigator
              initialRouteName=""
              screenOptions={{
                headerBackTitleVisible: false, // Hide the back button text
                headerBackImage: () => null,
                headerStyle: {
                  backgroundColor: '#FFEEC4', // Example background color
                },
                headerTintColor: '#202244', // Color of the back button and title
                headerTitleStyle: {
                  fontWeight: 'bold', // Style for the title
                },
                
              }}



            >
              <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: true }} />
              <Stack.Screen
               name="BottomTabNavigator" 
               options={{ headerShown: false }} 
              >
               {props => <BottomTabNavigator {...props} />}
              </Stack.Screen> 
              <Stack.Screen 
               name="ChatInterface" 
               component={ChatInterface} 
               options={{ headerShown: false }}
              />
              <Stack.Screen name="Settings" component={Settings}  />
              <Stack.Screen name="Preferences" component={Preferences}  />
              <Stack.Screen name="ChangePictures" component={ChangePictures}  />
              <Stack.Screen name="Practice" component={Practice}  />
              <Stack.Screen name="Registration" component={RegistrationScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
              <Stack.Screen name="birthdate" component={birthdate} />
              <Stack.Screen name="gender" component={gender}  />
              <Stack.Screen name="genderpref" component={genderpref}  />
              <Stack.Screen name="fitnesschoice" component={fitnesschoice} />
              <Stack.Screen name="fitnesslevel" component={fitnesslevel} />
              <Stack.Screen name="fitnesstime" component={fitnesstime} />
              <Stack.Screen name="college" component={college} />
              <Stack.Screen name="age" component={age}  />
              <Stack.Screen name="Pictures" component={Pictures} />
           </Stack.Navigator>
         </NavigationContainer>
       </SetupProvider>
      </PersistGate>
    </Provider>
  );  
};


export default App;

