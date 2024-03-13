import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import ChatScreen from './ChatScreen';
import ProfileScreen from './ProfileScreen';
import HomeIcon from '../assets/images/HomeIcon'; // Adjusted the path based on your directory structure
import ChatIcon from '../assets/images/ChatIcon';
import ProfileIcon from '../assets/images/ProfileIcon';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ usersData, route }) => {
  const justCompletedSetup = route?.params?.justCompletedSetup || false;
  return (
    <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#FF6A4D',  // The color of the icon when the tab is active
      tabBarInactiveTintColor: 'black',  // The color of the icon when the tab is inactive
      headerTintColor: 'black', 
      headerStyle: {
        backgroundColor: '#fff', // Example background color
      },
      
    }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        initialParams={{ userData: usersData, justCompletedSetup }}  // Pass the first user's data as an example
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} width={size} height={size} />
          ),
          tabBarLabel: () => null,  // This line hides the label
          
        }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <ChatIcon color={color} width={size} height={size} />
          ),
          tabBarLabel: () => null,  // This line hides the label
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          tabBarIcon: ({ color, size }) => (
            <ProfileIcon color={color} width={size} height={size} />
          ),
          tabBarLabel: () => null,  // This line hides the label
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
