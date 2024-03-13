import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Alert, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setChatRoomId } from '../redux/actions/userActions'; // adjust the path accordingly 
import moment from 'moment';
import Modal from 'react-native-modal';
import axios from 'axios';
import { API_URL } from '../config';
import FastImage from 'react-native-fast-image';



const ChatProfile = ({ name, chat_room_id, date, profileImageUrl, otherUserId, onChatProfileHidden }) => {
  console.log('ChatProfile - otherUserId:', otherUserId); // Log to check otherUserId
  console.log('Profile Image URL in ChatProfile:', profileImageUrl);
  const loggedInUserId = useSelector(state => state.loggedInUser.pgId);
  const navigation = useNavigation();
  const dispatch = useDispatch(); // You need to invoke useDispatch to get the dispatch method

  const [isBlockModalVisible, setBlockModalVisible] = useState(false);
 

  const handleLongPress = () => {
    setBlockModalVisible(true);
  };


  const blockUser = async (userIdToBlock) => {
    try {
      console.log('Blocking User ID:', userIdToBlock);
      const response = await axios.post(`${API_URL}/block`, {
        blockerId: loggedInUserId,
        blockedId: userIdToBlock
      });

      console.log('Block User Response:', response.data);
  
      Alert.alert(response.data.message);
      setBlockModalVisible(false);
    } catch (error) {
      console.error('Error blocking user:', error);
      Alert.alert("Error", "Failed to block the user.");
      setBlockModalVisible(false);
    }
  };

  const hideChatProfile = async () => {
    console.log("Sending request to hide chat profile:", { userId: loggedInUserId, chat_room_id });
    try {
      const response = await axios.post(`${API_URL}/hideChatProfile`, {
        userId: loggedInUserId,
        chat_room_id
      });

      console.log("Response from hideChatProfile:", response.data);

      
      onChatProfileHidden(chat_room_id); // Call the callback
      // Additional UI update logic goes here if needed
      setBlockModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to hide the chat profile.");
      setBlockModalVisible(false);
    }
  };
  

  const handleProfileClick = () => {
    console.log('chat_room_id in ChatProfile:', chat_room_id); // Log the value of chat_room_id
    dispatch(setChatRoomId(chat_room_id)); // Dispatch the action with chat_room_id
    navigation.navigate('ChatInterface', { name, chat_room_id, otherUserId }); // Pass the name or any other data you need
  };

  const formatDate = (timestamp) => {
    return moment(timestamp).calendar(null, {
      sameDay: '     HH:mm',
      lastDay: '[Yesterday]',
      lastWeek: 'DD/MM/YY',
      sameElse: 'DD/MM/YY'
    });
  };

  const CustomButton = ({ title, onPress, color }) => (
    <TouchableOpacity onPress={onPress} style={[styles.customButton, { backgroundColor: color }]}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  

  return (
    <>
     <TouchableOpacity onPress={handleProfileClick} onLongPress={handleLongPress} style={styles.container}>
       <View style={styles.container}>
         <View style={styles.line} />
         <View style={styles.profileContainer}>
           <FastImage style={styles.profileImage} source={profileImageUrl ? { uri: profileImageUrl } : require('../assets/icon.png')} />
         </View>
         <Text style={styles.nameText}>{name}</Text>
         <Text style={styles.dateText}>{formatDate(date)}</Text>
       </View>
     </TouchableOpacity>
     <Modal isVisible={isBlockModalVisible}>
      <View style={styles.modalContent}>
        <CustomButton title="Block" onPress={() => blockUser(otherUserId)}  />
        <CustomButton title="Delete" onPress={() => hideChatProfile()} />
        <CustomButton title="Cancel" onPress={() => setBlockModalVisible(false)} />
      </View>
    </Modal>
    </>
    
    
  );
};

// code for the styles objects 

const { height } = Dimensions.get('window'); // Obtain the height of the screen
const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 0,
    flexDirection: 'column',
    alignItems: 'left',
    padding: 3,
    flex: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    width: '80%',
    left: '10%',
  
  },
  customButton: {
    margin: 10,
   
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    // You can add more styling here if needed
  },
  line: {
    width: '85%',
    height: 0.5,
    backgroundColor: 'rgba(0, 0, 0, 0.50)',
    left: '20%',
    
  },
  profileContainer: {
    width: 50,
    height: 50,
    position: 'relative',
    backgroundColor: 'black',
    borderRadius: 150, // Making it circular
    alignItems: 'center',
    justifyContent: 'center',
    top: height * 0.01,
    
    
  },
  profileImage: {
    width: 47,
    height: 47,
    borderRadius: 150,
  },
  nameText: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Arial',
    fontWeight: '400',
    bottom: height * 0.04,
    left: '20%',
  },
  dateText: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Arial',
    fontWeight: '400',
    left:'83%',
    bottom: height * 0.06,
    paddingRight: 20,
  
    
 
  },

});

export default ChatProfile;

