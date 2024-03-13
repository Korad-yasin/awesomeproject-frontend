// redux/actions/userActions.js
import { FETCH_USER_DATA } from './actionTypes';
import { SET_LOGGED_IN_USER, LOGOUT_USER } from './actionTypes';
import { SET_CHAT_ROOM_ID } from './actionTypes';
import { SET_MESSAGES, ADD_MESSAGE, DELETE_MESSAGE, DELETE_MESSAGE_LOCALLY, ADD_LOCALLY_DELETED_MESSAGE_ID, UPDATE_USER_DATA_GALLERY_IMAGES, SET_USER_AVATAR, SET_BLOCKED_USERS, FILTER_MESSAGES } from './actionTypes';
import axios from 'axios';
import { API_URL } from '../../config';



export const fetchUserData = (loggedInUserId) => async (dispatch) => {
  console.log("fetchUserData started with loggedInUserId:", loggedInUserId);
  try {
    const response = await axios.get(`${API_URL}/users`);
    console.log("API response:", response.data);
    

    // Aggregate user data with reduce, using groupedData as the accumulator
    const groupedData = response.data.reduce((acc, item) => {
      const userId = item.user_id;
      if (!acc[userId]) {
        acc[userId] = {
         ...item,
         id: userId, // Set the 'id' field to be the 'user_id' for consistent referencing
         avatarUrl: null, // Initialize avatarUrl as null
         galleryImages: [] // Initialize galleryImages array
        };
      }

      if (item.is_avatar) {
      // If is_avatar is true, set it as the avatarUrl
        acc[userId].avatarUrl = item.image_url;
      } else {
      // Otherwise, add it to galleryImages
        acc[userId].galleryImages.push({ id: item.image_id, url: item.image_url });
      }

      return acc;
    }, {});
 

    const transformedData = await Promise.all(Object.values(groupedData).map(async (user) => {
      try {
        
        
        const distanceResponse = await axios.get(`${API_URL}/distance/${loggedInUserId}?otherUserId=${user.id}`);
        const distance = distanceResponse.data.distance;
        // Process looking_for data

        let updatedGalleryImages = await Promise.all(user.galleryImages.map(async (image) => {
          // Fetch isLiked status for each image
          const likeResponse = await axios.get(`${API_URL}/isLiked`, {
            params: { userId: loggedInUserId, imageId: image.id }
          });
          return { ...image, isLiked: likeResponse.data.isLiked };
        }));
        
        let lookingForArray = user.looking_for.split(', '); // Split by comma and space
        let lookingForDescriptionArray = lookingForArray.map(preference => {
          switch (preference) {
            case 'gym buddy':
              return 'gym buddy';
            case 'personal trainer':
              return 'personal trainer';
            case 'Im a personal trainer':
              return 'Im a personal trainer';
            default:
              return ''; // Handle any unexpected cases
          }
        });
        // Filter out any empty strings and join the descriptions with a comma
        let lookingForDescription = lookingForDescriptionArray.filter(desc => desc !== '').join(', ');
    
        // Return the transformed user object

        // Return the user object with added distance and lookingForDescription
        return {
          ...user,
          distance, 
          lookingForDescription,
          galleryImages: updatedGalleryImages 
        };
      } catch (error) {
        console.error('Error fetching distance for user:', user.id, error);
        // Return the user object with fallback values if error occurs
        return {
          ...user,
          distance: 'Unavailable', 
          lookingForDescription,
          galleryImages: updatedGalleryImages
        };
      }
    }));

    dispatch({
      type: FETCH_USER_DATA,
      payload: transformedData, // Dispatch the transformed data
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};



export const setLoggedInUser = (userData) => {
  console.log(`Dispatching setLoggedInUser: ${userData.id}, ${userData.avatarUrl}`);
  return {
    type: SET_LOGGED_IN_USER,
    payload: userData, // userData should include avatarUrl
  };
};

export const logoutUser = () => ({
  type: LOGOUT_USER,
});

export const setChatRoomId = (chat_room_id) => ({
  type: SET_CHAT_ROOM_ID,
  payload: chat_room_id,
});

export const setMessages = (messages) => ({
  type: SET_MESSAGES,
  payload: messages,
});

export const addMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message,
});

export const deleteMessage = (messageId) => ({
  type: DELETE_MESSAGE,
  payload: messageId,
});

export const deleteMessageLocally = (messageId) => ({
  type: DELETE_MESSAGE_LOCALLY,
  payload: messageId,
});

export const addLocallyDeletedMessageId = (messageId) => {
  return {
    type: ADD_LOCALLY_DELETED_MESSAGE_ID,
    payload: messageId
  };
};

// This action creator updates the galleryImages in the userData
export const updateUserDataGalleryImages = (userId, imageId, isLiked) => ({
  type: UPDATE_USER_DATA_GALLERY_IMAGES,
  payload: {userId, imageId, isLiked }
});

export const setUserAvatar = (userId, avatarUrl) => (dispatch, getState) => {
  console.log(`Dispatching setUserAvatar: ${userId}, ${avatarUrl}`);
  
  // Update userData in userReducer
  dispatch({
    type: SET_USER_AVATAR,
    payload: { userId, avatarUrl },
  });

  // Get the current logged in user's ID from state
  const loggedInUserId = getState().loggedInUser.pgId;
  if (userId === loggedInUserId) {
    // Also update avatarUrl in loggedInUserReducer if the avatar being updated is for the logged-in user
    dispatch({
      type: SET_LOGGED_IN_USER,
      payload: { ...getState().loggedInUser, avatarUrl },
    });
  }
};


// Redux action to fetch and set blocked users
export const setBlockedUsers = (userId) => async (dispatch) => {
  console.log("Initiating fetchBlockedUsers action for userId:", userId);
  try {
    const response = await axios.get(`${API_URL}/blocked-users/${userId}`);
    console.log("Blocked users fetched successfully:", response.data.blockedUsers);
    dispatch({
      type: SET_BLOCKED_USERS,
      payload: response.data.blockedUsers,
    });
  } catch (error) {
    console.error('Error fetching blocked users:', error);
  }
};

export const filterMessages = (messages, locallyDeletedMessageIds) => {
  // Filter out messages from blocked users and locally deleted messages
  const filteredMessages = messages.filter(msg => 
    !locallyDeletedMessageIds.includes(String(msg.message_id))
  );

  return {
    type: FILTER_MESSAGES,
    payload: filteredMessages,
  };
};

// Add a corresponding reducer to handle SET_BLOCKED_USERS action

