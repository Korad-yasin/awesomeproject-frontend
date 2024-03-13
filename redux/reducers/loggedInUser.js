// redux/reducers/loggedInUser.js
import { SET_LOGGED_IN_USER, LOGOUT_USER } from '../actions/actionTypes';

const initialState = {
  id: null,
  pgId: null,
  avatarUrl: null, 
  name: null, 
  lastcompletedsetupstep: null,
 
};

const loggedInUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOGGED_IN_USER:
      console.log("loggedInUserReducer new state:", { ...state, ...action.payload });
      return {
        ...state,
        ...action.payload,
      };
    case LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
};

export default loggedInUserReducer;
