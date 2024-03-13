// ChatScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import ChatProfile from './ChatProfile';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL } from '../config';

const ChatScreen = () => {
  const [chatProfiles, setChatProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const pgUserId = useSelector(state => state.loggedInUser.pgId);  // Get PostgreSQL ID directly from Redux state


  const fetchChatProfiles = async () => {
    try {
      const response = await axios.get(`${API_URL}/chat_rooms/${pgUserId}`);
      console.log("Fetched Chat Profiles:", response.data); 
      setChatProfiles(response.data);
    } catch (error) {
      console.error('There was an error fetching the chat profiles!', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchChatProfiles();
      setLoading(false);
    }, [pgUserId])
  );

  const removeHiddenChatProfile = (chatRoomId) => {
    setChatProfiles(currentProfiles => 
        currentProfiles.filter(profile => profile.chat_room_id !== chatRoomId)
    );
  };


  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <View>
      <FlatList
        data={chatProfiles}
        keyExtractor={(item) => item.chat_room_id.toString()}
        renderItem={({ item }) => (
          <ChatProfile
            name={item.other_user_name}
            chat_room_id={item.chat_room_id}
            date={item.last_message_timestamp}
            profileImageUrl={item.profileimageurl}
            otherUserId={item.other_user_id}
            onChatProfileHidden={removeHiddenChatProfile}
            
          />
        )}
      />
    </View>

    </View>
    
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 3,
  }
});

export default ChatScreen;
