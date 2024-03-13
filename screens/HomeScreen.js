import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData, setChatRoomId, updateUserDataGalleryImages } from '../redux/actions/userActions';
import { View, Text, FlatList, StyleSheet, RefreshControl,Dimensions, TouchableOpacity } from 'react-native';
import Chat from '../assets/images/Chat.js';  
import HeartIcon from '../assets/images/heartIcon';
import Swiper from 'react-native-swiper';
import { ScreenHeight } from 'react-native-elements/dist/helpers/index.js';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../config';
import { fetchAndUpdateLocation } from './Location';
import { requestNotificationPermission } from './Notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withDelay, withTiming } from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';



const HomeScreen = ({ route }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userData = useSelector((state) => state.user.userData); // Select user data from the store
  console.log("User data in HomeScreen:", userData); // Log the userData
  const loggedInUser = useSelector((state) => state.loggedInUser); // Corrected this line
  console.log("Logged In User ID:", loggedInUser);
  const [refreshing, setRefreshing] = useState(false);
  const [localLikes, setLocalLikes] = useState({});
 



  
  const checkFirstVisit = async () => {
    const { justCompletedSetup } = route.params || {};
    const hasCompletedSetup = await AsyncStorage.getItem('hasCompletedSetup');
    return hasCompletedSetup !== 'true' || justCompletedSetup;
  };

  useEffect(() => {
    console.log("useEffect triggered in HomeScreen");
    const userId = loggedInUser && loggedInUser.pgId ? loggedInUser.pgId : null;
    if (userId) {
        console.log('Dispatching fetchUserData with loggedInUserId:', userId);
        dispatch(fetchUserData(userId));
        console.log('User Data in HomeScreen: ', userData);
        console.log('Logged In User in HomeScreen: ', loggedInUser); // Log the value of loggedInUser
    // Check if it's the user's first visit after setup
    } else {
        console.log('loggedInUser or loggedInUser.pgId is undefined');
    }

    checkFirstVisit().then(isFirstVisit => {
      const userId = loggedInUser.pgId;
      console.log("isFirstVisit:", isFirstVisit, "userId:", userId);
      if (isFirstVisit) {
        console.log("Calling fetchAndUpdateLocation...");
        fetchAndUpdateLocation(userId);
        requestNotificationPermission(userId); // Request notification permission
      }
    }).catch(error => {
      console.error("Error in checkFirstVisit:", error);
    });
    


  }, [dispatch, loggedInUser.pgId]);

  useEffect(() => {
    // Sync localLikes with userData from Redux
    const newLocalLikes = {};
    userData.forEach(user => {
      user.galleryImages.forEach(image => {
        newLocalLikes[image.id] = image.isLiked;
      });
    });
    console.log("Syncing localLikes with Redux state", newLocalLikes);
    setLocalLikes(newLocalLikes);
  }, [userData]); // Depend on userData


  // Create Refresh Function
  const onRefresh = async () => {
    setRefreshing(true); // Set refreshing to true to show the spinner
    try {
      await dispatch(fetchUserData()); // Fetch the user data
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
    setRefreshing(false); // Set refreshing to false to hide the spinner
  };

  const handleChatIconClick = async (otherUserId, otherUserName) => {
    console.log('Other user ID:', otherUserId, 'Other user name:', otherUserName);
    try {
      if (!loggedInUser || !loggedInUser.pgId) {
        console.error('loggedInUser or loggedInUser.pgId is undefined');
        return;
      }
      const response = await axios.post(`${API_URL}/chat_rooms`, {
        user1_id: loggedInUser.pgId, // Replace with the actual user ID
        user2_id: otherUserId,
      });
      console.log('Chat Room Created: ', response.data);
      console.log('Navigating to ChatInterface with chat_room_id:', response.data.chat_room_id);

      dispatch(setChatRoomId(response.data.chat_room_id));
      navigation.navigate('ChatInterface', {
        chat_room_id: response.data.chat_room_id,
        name: otherUserName, // Pass the other user's name here
        // Include other chat room details as needed
      });

    } catch (error) {
      console.error('Error creating chat room: ', error);
    }
  };
 
  // Add this part to fetch the isLiked status for each image
  
  const heartScale = useSharedValue(0);

  const handleHeartPress = async (imageId,  isLiked) => {
    console.log("handleHeartPress called with", { imageId, isLiked });
    console.log("userData at the start of handleHeartPress", userData);
    

    const newIsLiked = !isLiked;
    console.log("Updated localLikes:", { ...localLikes, [imageId]: !isLiked });

    try {
      let response;
     if (isLiked) {
      response = await axios.post(`${API_URL}/unlike`, {
        userId: loggedInUser.pgId,
        imageId: imageId,
      });
      // If the image is already liked, send a request to unlike it
      } else {
        // If the image is not liked, send a request to like it
        response = await axios.post(`${API_URL}/like`, {
          userId: loggedInUser.pgId,
          imageId: imageId,
        });
      }
      console.log('Response from server on like/unlike:', response.data);
      // Dispatch action to update the isLiked status in Redux
      dispatch(updateUserDataGalleryImages(loggedInUser.pgId, imageId, !isLiked));
      setLocalLikes({ ...localLikes, [imageId]: newIsLiked });

      if (!isLiked) {
        heartScale.value = withSequence(
          withTiming(1, { duration: 150 }),
          withDelay(500, withTiming(0))
        );
      }

    } catch (error) {
      console.error('Error in handleHeartPress:', error);
      console.log('Error details:', error.response ? error.response.data : 'No additional error info');
      alert('An error occurred while trying to update the like status of the image.');
    }
       
  };

  return (
    <View style={styles.contentContainer}>
      <FlatList
        data={userData}
        keyExtractor={item => item.id} // Assuming 'id' is unique for each user
        renderItem={({ item }) => (
            <View style={styles.middleContainer}>
              <View style={styles.horizontalLine1} />
              <Swiper showsPagination={true} paginationStyle={{ top: '80%'  }}>
               {item.galleryImages
                 .filter(galleryImage => galleryImage.url !== item.avatarUrl)
                 .map((image, index) => (
                 <FastImage key={index} source={{ uri: image.url }} style={styles.slide} />
               ))}
              </Swiper>
             <View style={styles.avatarAndNameContainer}>
               <View style={styles.avatarContainer}>
                 <FastImage source={{ uri:  item.avatarUrl }} style={styles.avatar} />
               </View>
               <Text style={styles.nameAndAge}>{item.name}, {item.age}</Text>
             </View>
             <Text style={styles.looking_for}>{item.lookingForDescription}</Text>
               {item.id !== loggedInUser.pgId && 
               <Text style={styles.distance}>
                 {item.distance ? `${item.distance} miles` : 'Distance unavailable'}
               </Text> 
              }
             <View style={styles.chatIconContainer} onTouchEnd={() => handleChatIconClick(item.id, item.name)}>
               <Chat />
             </View>
             {item.galleryImages.map((image) => (
               <TouchableOpacity key={image.id} style={styles.HeartIconContainer} onPress={() => handleHeartPress(image.id, localLikes[image.id] || false)}>
                 <HeartIcon filled={localLikes[image.id]}/>
               </TouchableOpacity>
              ))}
           </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
  
};         

// stylesheet code

const { height } = Dimensions.get('window'); 
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
   
    
  
  },
  middleContainer: {
    height: ScreenHeight * 0.55, 
    
    
  },
  horizontalLine1: {
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.50)',
    height: 1,
  },
  slide: {
    height: '95%',
    width: '100%',
    borderRadius: 10, 
    overflow: 'hidden', // Ensures the images don't bleed outside the border radius
    
    
  },
  avatarContainer: {
    width: 60,
    height: 60,
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderRadius: 30,
  },
  avatar: {
    width: '90%',
    aspectRatio: 1,
    borderRadius: 30,
    
  },
  nameAndAge: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Arial',
    left: 80,
    fontWeight: '700',
    flexWrap: 'wrap',
    left:10,

  },
  looking_for: {
    left: '3%',
    bottom: height * 0.015,
    color: 'black',
    fontSize: 16,
    fontFamily: 'Arial',
    padding: 5,
    width: '60%',

    
  },
  distance: {
    left: '3%',
    bottom: height * 0.015,
    color: 'black',
    fontSize: 16,
    fontFamily: 'Arial',
    padding: 3,
    width: '50%',
   
  
  },
  avatarAndNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: '2%',  // Adjust this value as needed
    left: '2%',  // Adjust this value as needed
  },
  chatIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    flexDirection: 'row',
    position: 'absolute',
    bottom: height * 0.02,
    right: '4%',
    color: 'black',  
  },
  HeartIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    flexDirection: 'row',
    position: 'absolute',
    bottom: height * 0.02,
    right: '13%',
    color: 'white',
    
  },
});

export default HomeScreen;