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

import RegistrationScreen from './screens/RegistrationScreen';
import LoginScreen from './screens/LoginScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';


import WelcomeScreen from './screens/WelcomeScreen';

// Import the setup screens
import Setup1Screen from './screens/Setup1Screen';
import Setup2Screen from './screens/Setup2Screen';
import Setup3Screen from './screens/Setup3Screen';
import Setup4Screen from './screens/Setup4Screen';
import Setup5Screen from './screens/Setup5Screen';


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
                headerBackImage: () => (
                  <View style={{ paddingLeft: 10 }}>
                    <Icon name="arrow-back" size={25} color="#202244" />
                  </View>
                ),
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
              <Stack.Screen name="Setup1" component={Setup1Screen} options={{ title: '' }}/>
              <Stack.Screen name="Setup2" component={Setup2Screen} options={{ title: '' }} />
              <Stack.Screen name="Setup3" component={Setup3Screen} options={{ title: '' }} />
              <Stack.Screen name="Setup4" component={Setup4Screen} options={{ title: '' }} />
              <Stack.Screen name="Setup5" component={Setup5Screen} options={{ title: '' }} />
           </Stack.Navigator>
         </NavigationContainer>
       </SetupProvider>
      </PersistGate>
    </Provider>
  );  
};


export default App;

