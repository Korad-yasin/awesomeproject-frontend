// components/UserDetails.js

import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';

const UserDetails = () => {
  // Step 1: Fetching Data from the Store
  const userData = useSelector((state) => state.user.userData);

  // Step 2: Parsing Obsessions
  const obsessions = userData ? JSON.parse(userData.obsessions) : [];

  // Step 3: Displaying Data
  return (
    <View>
      {userData ? (
        <>
          <Text>Name: {userData.name}</Text>
          <Text>Birthday: {userData.birthday}</Text>
          <Text>Obsessions: {obsessions.join(', ')}</Text>
          {/* ... other data fields ... */}
        </>
      ) : (
        <Text>Loading...</Text>  // Step 4: Error Handling (this is a simple example, you might want more robust error handling)
      )}
    </View>
  );
};

export default UserDetails;
