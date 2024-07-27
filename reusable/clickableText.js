// In reusable/clickableText.js

import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const ClickableText = ({ mainText, actionText, onActionPress, style }) => {
  return (
    <TouchableOpacity style={[styles.textContainer, style]} onPress={onActionPress}>
      {mainText && <Text style={styles.mainText}>{mainText}</Text>}
      <Text style={[styles.actionText, style]}>{actionText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Urbanist-VariableFont',
    fontWeight: '400',
  },
  actionText: {
    fontSize: 16,
    color: 'green',
    fontFamily: 'Urbanist-VariableFont',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default ClickableText;
