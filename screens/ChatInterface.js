import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Image, Dimensions, SafeAreaView  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Font from 'expo-font';
import { useState, useEffect, useRef } from 'react';
import { ActivityIndicator } from 'react-native';
import AddIcon from '../assets/images/addIcon.js';
import SendIcon from '../assets/images/sendIcon.js';
import ScrollArrow from '../assets/images/scrollArrow.js';
import ImagePicker from 'react-native-image-crop-picker';
import { FlatList } from 'react-native-gesture-handler';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { API_URL } from '../config';
import { setMessages, addMessage, deleteMessage, deleteMessageLocally, addLocallyDeletedMessageId  } from '../redux/actions/userActions'; 
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';





const ChatInterface = ({ route }) => {
  const navigation = useNavigation();
  const { name} = route.params; // Retrieve the name parameter passed from ChatProfile
  const chat_room_id = useSelector((state) => state.chat.chat_room_id); // Get chat_room_id from Redux state
  const pgUserId = useSelector(state => state.loggedInUser.pgId);
  const messages = useSelector(state => state.messages.messages);  // Use global messages state
  const [messageText, setMessageText] = useState('');
  const [fontLoaded, setFontLoaded] = useState(false);
  const dispatch = useDispatch();  // Use dispatch
  const [socket, setSocket] = useState(null);
  const locallyDeletedMessageIds = useSelector(state => state.messages.locallyDeletedMessageIds);
  const flatListRef = useRef(null);
  const blockedUsers = useSelector(state => state.blockedUsers.blockedUsers);
  const [isScrolledUp, setIsScrolledUp] = useState(false);




  // Function to scroll to the bottom
  const scrollToBottom = () => {
    flatListRef.current.scrollToEnd({ animated: true });
    setIsScrolledUp(false); // Reset the state when scrolled to bottom
  };

  const handleScroll = (event) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const viewHeight = event.nativeEvent.layoutMeasurement.height;

    // Check if the user has scrolled up from the bottom
    if (contentHeight - yOffset - viewHeight > 60) { 
      setIsScrolledUp(true);
    } else {
      setIsScrolledUp(false);
    }
  };

  const inspectAsyncStorage = async () => {
    try {
        const storedState = await AsyncStorage.getItem('persist:root');  // 'persist:root' is the key we used in the persistConfig.
        console.log("Stored state in AsyncStorage:", JSON.parse(storedState));
    } catch (error) {
        console.error("Error reading from AsyncStorage:", error);
    }
  };
 
  // Render function for individual messages
  const renderMessage = ({ item }) => {
    // Check if the message is of type 'image'
    if (item.message_type === 'image') {
      return (
        <TouchableOpacity onLongPress={() => handleDeleteMessage(item.message_id, item.sender_id)}>
          <View style={item.sender_id === pgUserId ? styles.sentMessage : styles.receivedMessage}>
            <FastImage source={{ uri: item.message_content, cache: FastImage.cacheControl.web }} style={{ width: 200, height: 200 }} resizeMode={FastImage.resizeMode.contain}  />
            <Text style={[styles.timestamp, { alignSelf: item.sender_id === pgUserId ? 'flex-end' : 'flex-start' }]}>{formatTime(item.timestamp)}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  
    // For text messages, use the existing rendering logic
    return (
      <TouchableOpacity onLongPress={() => handleDeleteMessage(item.message_id, item.sender_id)}>
        <View style={item.sender_id === pgUserId ? styles.sentMessage : styles.receivedMessage}>
          <Text>{item.message_content}</Text>
          <Text style={[styles.timestamp, { alignSelf: item.sender_id === pgUserId ? 'flex-end' : 'flex-start' }]}>{formatTime(item.timestamp)}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  

  useEffect(() => {
    console.log('ChatInterface mounted with chat_room_id:', chat_room_id);
    const newSocket = io(API_URL);
    setSocket(newSocket);
    
    newSocket.emit('joinRoom', chat_room_id);
    
    newSocket.on('receiveMessage', (message) => {
      dispatch(addMessage(message)); // Update Redux state (or local state)
      flatListRef.current?.scrollToEnd({ animated: true });
    });

    newSocket.on('messageDeleted', (messageId) => {
      console.log(`Received messageDeleted for messageId: ${messageId}`);
      dispatch(deleteMessage(messageId));
    });

    // Add the blockAlert event listener

    newSocket.on('blockAlert', (data) => {
      if (data.isBlocker) {
        // Show an alert with the option to unblock
        Alert.alert(
          "Blocked",
          data.message,
          [
            { text: "Cancel", style: "cancel" },
            { text: "Unblock", onPress: () => unblockUser(data.blockedUserId) }
          ]
        );
      } else {
        Alert.alert("Blocked", data.message);
      }
    });




    const fetchMessages = async () => {
      console.log('Fetching messages for chat_room_id:', chat_room_id);
      try {
        const response = await axios.get(`${API_URL}/messages/${chat_room_id}`);
        console.log(`Fetched messages for chat_room_id ${chat_room_id}:`, response.data);
        
        const serverMessages = response.data;
        console.log("Fetched messages:", serverMessages);
        console.log("Server Messages:", serverMessages);
        console.log("Locally Deleted Message IDs:", locallyDeletedMessageIds);

        // Apply filtering for locally deleted messages
        const filteredMessages = serverMessages.filter(msg => 
          !locallyDeletedMessageIds.includes(String(msg.message_id))
        );

        // Dispatch action to filter messages
        dispatch(setMessages(filteredMessages));
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages(); // Execute the function to fetch messages

    const loadFont = async () => {
      await Font.loadAsync({
        'Urbanist-VariableFont': require('../assets/fonts/Urbanist-VariableFont.ttf'), // Adjust the path
      });
      setFontLoaded(true);
    };
    loadFont();

    // Cleanup: Disconnect socket on component unmount
    return () => newSocket.disconnect();
  }, [chat_room_id, dispatch, locallyDeletedMessageIds, blockedUsers, unblockUser]); // Ensure chat_room_id and dispatch are dependencies


  const unblockUser = async (userIdToUnblock) => {
    try {
      const response = await axios.post(`${API_URL}/unblock`, {
        blockerId: pgUserId,
        blockedId: userIdToUnblock
      });
      
      console.log('Unblock User Response:', response.data);
      Alert.alert("User unblocked");
      // You may also want to implement additional logic to update the UI
    } catch (error) {
      console.error('Error unblocking user:', error);
      Alert.alert("Error", "Failed to unblock the user.");
    }
  };

  // useEffect just for logging updated messages
  useEffect(() => {
    console.log("Messages updated:", messages);

  }, [messages]);

  useEffect(() => {
    // Add listener for keyboard opening
    const keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }
    );

    // Cleanup
    return () => {
      keyboardDidShowListener.remove();
    };
  },[]);


  if (!fontLoaded) {
    return <ActivityIndicator size="large" />;
  };

  const sendMessage = (content = messageText, type = 'text') => {
    console.log('Sending message with content:', content, 'and type:', type);

    let trimmedContent = type === 'text' ? content.trim() : content;

    if (type === 'text' && !trimmedContent) return; // For text messages, don't send if empty

    let messageData = {
        chat_room_id,
        sender_id: pgUserId,
        message_content: trimmedContent,
        message_type: type,
        timestamp: new Date().toISOString(),
    };

    // Send message through socket
    socket.emit('sendMessage', messageData);

    // Clear input if it's a text message
    if (type === 'text') {
        setMessageText('');
    }

    flatListRef.current?.scrollToEnd({ animated: true });
  };



  const handleBackClick = () => {
    navigation.navigate('Chat'); // Navigate back to the previous screen
  };

  const handleAddImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 400,
        height: 380,
        cropping: true
      });

      console.log('Selected image:', image);

      const formData = new FormData();
      formData.append('image', {
        uri: image.path,
        name: image.filename || `image_${Date.now()}`, // Fallback for filename
        type: image.mime
      });

      const response = await axios.post(`${API_URL}/uploadImage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      console.log('Image uploaded, URL:', response.data.imageUrl);
  
      // Send the image URL as a chat message
      sendMessage(response.data.imageUrl, 'image');
  
    } catch (error) {
      console.error('Error in handleAddImage:', error);
      // Optionally, show an alert or toast to the user
    }
  };


  const handleDeleteMessage = (messageId, sender_id) => {
    // Trigger a confirmation dialog and, if confirmed, dispatch an action to Redux
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: () => {
            if(sender_id === pgUserId) {
              // The user is the sender: Delete globally (all users)
              deleteMessageGlobal(messageId);
            } else {
              // The user is NOT the sender: Delete locally (only this user)
              deleteMessageLocal(messageId);
              inspectAsyncStorage();  // <-- Call the function here
            }
          } 
        }
      ]
    );
  };

  const deleteMessageLocal = (messageId) => {
    console.log("Dispatching local delete for messageId:", messageId);
    dispatch(deleteMessageLocally(messageId)); 
    dispatch(addLocallyDeletedMessageId(String(messageId)));
  };
  
  const deleteMessageGlobal = (messageId) => {
    // Dispatch an action to Redux to delete the message client-side
    dispatch(deleteMessage(messageId));
    
    // Send a request to the server to delete the message server-side
    axios.delete(`${API_URL}/messages/${messageId}`)
      .then(response => {
        console.log("Message deleted:", response.data);
      })
      .catch(error => {
        console.error("Error deleting message:", error);
        // Handle error (e.g., show error message to user)
      });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
  
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12;
    hours = hours ? hours : 12; 
  
    const minutesFormatted = minutes < 10 ? '0' + minutes : minutes;
  
    return `${hours}:${minutesFormatted} ${amOrPm}`;
  };

 
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior='padding'
        keyboardVerticalOffset={0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.topNavigator}>
                    <TouchableOpacity onPress={handleBackClick} style={styles.backButton}> 
                        <Icon name="arrow-back" size={30} color="black" /> 
                    </TouchableOpacity>
                    <Text style={styles.nameText}>{name}</Text>
                </View>
                {isScrolledUp && (
                  <TouchableOpacity 
                    style={styles.scrollArrow} 
                    onPress={scrollToBottom}
                  >
                    <ScrollArrow />
                  </TouchableOpacity>
                )}

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.message_id.toString()}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    onScroll={handleScroll}
                />

                <View style={styles.bottomNavigator}>
                    <TouchableOpacity onPress={handleAddImage} style={styles.iconContainer}>
                        <AddIcon  size={26} color="rgba(35.17, 11.17, 52.06, 0.75)" />
                    </TouchableOpacity>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={messageText}
                            onChangeText={(text) => setMessageText(text)}
                            placeholder="Write your message"
                            placeholderTextColor="#A1A1A1"
                            multiline={true} // Allows multiple lines of text
                            scrollEnabled={true}
                           
                         
                        />
                    </View>
                    <TouchableOpacity onPress={() => sendMessage()} style={styles.iconContainer}>
                        <SendIcon width={25} height={25} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

    </SafeAreaView>

    
);

};


const { height } = Dimensions.get('window'); // Obtain the height of the screen
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 0,
      backgroundColor: 'black',
    },
    safeAreaContainer: {
      flex: 1,
      backgroundColor: 'white', // or any color that matches your app's background
    },
    topNavigator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between', // Align elements with space between them
      paddingHorizontal: 25, // Horizontal padding
      paddingTop: '5%',
      backgroundColor: 'white',
      
    },
    backButton: {
      width: 30,
      height: 30,
      bottom: '4%',
      right: '20%',
   

    },
    nameText: {
      color: 'black',
      fontSize: 20,
      fontFamily: 'Urbanist-VariableFont',
      fontWeight: '400',
      right: '500%',
      bottom: '3%',
     
    },
    bottomNavigator: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      paddingHorizontal: '5%',
      paddingVertical: '4%',
      width: '100%', // Full width
      bottom: 0, // Distance from the bottom
      paddingTop: 10,
    },
    iconContainer: {
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      top: "0%",
    },
    scrollArrow: {
      position: 'absolute',
      right: '1%', // adjust as needed
      bottom: '15%',
      zIndex: 1, // Ensures the arrow is above other elements
    },
    inputContainer: { // New container for the text input
      flex: 1,
      backgroundColor: '#DCDCDC',
      borderRadius: 10, // Curved corners
      paddingHorizontal: '5%', // Padding inside the container
      paddingVertical: 1,
      top: '1%',
      marginLeft: '5%',
      marginRight: '5%',
      borderColor: 'black',
      minHeight: 40,
      maxHeight: 120,
      
    },
    input: {
      fontSize: 16,
      fontFamily: 'Arial',
      fontWeight: '400',
      textAlignVertical: 'top',
      padding: 3,
      
      
    },
    sentMessage: {
      backgroundColor: 'white',
      alignSelf: 'flex-end',
      margin: 5,
      padding: 5,
      borderRadius: 10,
      maxWidth: '80%',
    },
    receivedMessage: {
      backgroundColor: '#F3E5F5',
      alignSelf: 'flex-start',
      margin: 5,
      padding: 5,
      borderRadius: 10,
      maxWidth: '70%',
    },
    timestamp: {
      fontSize: 10,
      color: '#888',
      marginTop: 5,
    }, 
  });
    

  
  // ... rest of the code
  
  
  export default ChatInterface;

