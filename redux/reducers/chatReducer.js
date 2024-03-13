// redux/reducers/chatReducer.js
import { SET_CHAT_ROOM_ID } from '../actions/actionTypes';

const initialState = {
    chat_room_id: null,
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CHAT_ROOM_ID:
      return {
        ...state,
        chat_room_id: action.payload,
      };
    default:
      return state;
  }
};

export default chatReducer;

