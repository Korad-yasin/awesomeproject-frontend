// redux/reducers/messageReducer.js
import { SET_MESSAGES, ADD_MESSAGE, DELETE_MESSAGE, DELETE_MESSAGE_LOCALLY, ADD_LOCALLY_DELETED_MESSAGE_ID, FILTER_MESSAGES } from '../actions/actionTypes';

const initialState = {
  messages: [],
  chat_room_id: null,
  locallyDeletedMessageIds: []
};

const messageReducer = (state = initialState, action) => {
  
  
  switch (action.type) {
    case SET_MESSAGES:
      console.log("Setting messages:", action.payload);
      const messagesWithConsistentIds = action.payload.map(msg => ({
        ...msg,
        message_id: String(msg.message_id) // or Number(msg.message_id)
      }));
      return {
        ...state,
        messages: messagesWithConsistentIds,
      };
    case ADD_MESSAGE:
      console.log("Adding message:", action.payload);
      return {
        ...state,
        messages: [...state.messages, {
          ...action.payload,
          message_id: String(action.payload.message_id) // or Number(action.payload.message_id)
        }],
      };
    case DELETE_MESSAGE:
      // Ensure message_id is a string when deleting a message
      return {
        ...state,
        messages: state.messages.filter(message => message.message_id !== String(action.payload)), // or Number(action.payload)
      };
    case DELETE_MESSAGE_LOCALLY:
      console.log("Handling local delete in reducer for messageId:", action.payload);
      return {
        ...state,
        messages: state.messages.filter(message => message.message_id !== String(action.payload)),
      };
    
    case ADD_LOCALLY_DELETED_MESSAGE_ID:
      console.log("Current state before ADD_LOCALLY_DELETED_MESSAGE_ID:", state);

      let locallyDeletedMessageIds = Array.isArray(state.locallyDeletedMessageIds) 
                                    ? state.locallyDeletedMessageIds 
                                    : [];

      

      console.log("Payload for ADD_LOCALLY_DELETED_MESSAGE_ID:", action.payload);

      return {
        ...state,
        locallyDeletedMessageIds: [...locallyDeletedMessageIds, action.payload]
      };

    case FILTER_MESSAGES:
      // Payload already contains messages filtered for both blocked users and locally deleted messages
      return {
        ...state,
        messages: action.payload,
      };


    default:
      return state;
  }
};

export default messageReducer;

