// redux/reducers/userReducer.js
import { FETCH_USER_DATA, UPDATE_USER_DATA_GALLERY_IMAGES, SET_USER_AVATAR } from '../actions/actionTypes';

const initialState = {
  userData: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER_DATA_GALLERY_IMAGES:
      console.log("Updating gallery images in Redux", action.payload);
      // Update the galleryImages for the specific user
      const newState = {
        ...state,
        userData: state.userData.map(user => {
          if (user.id === action.payload.userId) {
            return {
              ...user,
              galleryImages: user.galleryImages.map(image => 
                image.id === action.payload.imageId ? 
                  { ...image, isLiked: action.payload.isLiked } : image
              )
            };
          }
          return user;
        })
      };
      console.log("New Redux state after UPDATE_USER_DATA_GALLERY_IMAGES:", newState);
      return newState;

    case FETCH_USER_DATA:
      return {
        ...state,
        userData: action.payload,
      };
    case SET_USER_AVATAR:
      // Update the avatar URL for the specific user
      return {
        ...state,
        userData: state.userData.map(user => {
          if (user.id === action.payload.userId) {
            return {
              ...user,
              avatarUrl: action.payload.avatarUrl,
            };
          }
          return user;
        }),
      }; 
      
    default:
      return state;
  }
};

export default userReducer;

