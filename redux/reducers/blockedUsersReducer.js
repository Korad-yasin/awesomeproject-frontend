const initialState = {
    blockedUsers: [], // Array to store IDs of blocked users
  };
  
  const blockedUsersReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_BLOCKED_USERS':
        return {
          ...state,
          blockedUsers: action.payload, // Update the list of blocked users
        };
      default:
        return state;
    }
  };
  
  export default blockedUsersReducer;
  
  