// redux/reducers/index.js
import { combineReducers } from 'redux';
import userReducer from './userReducer';
import loggedInUserReducer from './loggedInUser';
import chatReducer from './chatReducer';
import messageReducer from './messageReducer'; 
import blockedUsersReducer from './blockedUsersReducer';


const rootReducer = combineReducers({
  user: userReducer,
  loggedInUser: loggedInUserReducer, 
  chat: chatReducer,
  messages: messageReducer,
  blockedUsers: blockedUsersReducer,
});

export default rootReducer;
