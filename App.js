import React, { useState } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SetupProvider } from './SetupContext';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';  // Update the import here
import Icon from 'react-native-vector-icons/Ionicons';


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
import Setup1 from './SetupScreens/Setup1';

import Setup2 from './SetupScreens/Setup2';
import Setup2clone2 from './SetupScreens/Setup2clone2';
import Setup2x2 from './SetupScreens/Setup2x2';
import Setup2x3 from './SetupScreens/Setup2x3';
import Setup2x4 from './SetupScreens/Setup2x4';
import Setup3 from './SetupScreens/Setup3';
import Setup4 from './SetupScreens/Setup4';
import Setup5 from './SetupScreens/Setup5';


// import reusable screens

const Stack = createStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <SetupProvider>
         <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Setup1"
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
              <Stack.Screen name="Setup1" component={Setup1} />
              <Stack.Screen name="Setup2" component={Setup2}  />
              <Stack.Screen name="Setup2clone2" component={Setup2clone2}  />
              <Stack.Screen name="Setup2x2" component={Setup2x2} />
              <Stack.Screen name="Setup2x3" component={Setup2x3} />
              <Stack.Screen name="Setup2x4" component={Setup2x4} />
              <Stack.Screen name="Setup3" component={Setup3} />
              <Stack.Screen name="Setup4" component={Setup4}  />
              <Stack.Screen name="Setup5" component={Setup5} />
           </Stack.Navigator>
         </NavigationContainer>
       </SetupProvider>
      </PersistGate>
    </Provider>
  );  
};


export default App;

