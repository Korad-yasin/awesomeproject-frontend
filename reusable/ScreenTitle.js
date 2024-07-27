// In reusable/ScreenTitle.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ScreenTitle = ({ titleText, style }) => {
  return (
    <View style={[styles.header, style]}>
      <Text style={styles.welcome}>{titleText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    fontFamily: 'Urbanist-VariableFont',
  }
});

export default ScreenTitle;
