// reusable/errorMessage.js

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const ErrorMessage = ({message, visible, style }) => {
  if (!visible) return null;
  return (
       <View style={[styles.container, style]}>
             <Text style={styles.errorText}>{message}</Text>
       </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightpink',
    borderRadius: 5,
    width: '80%',
    padding: 15,
    marginBottom: 10,

  },
  errorText: {
    color: 'darkred', 
    textAlign: 'center',
  },
});

export default ErrorMessage;