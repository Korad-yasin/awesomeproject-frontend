// In reusable/EmailAndName.js
import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

const EmailAndName = ({ value, onChangeText, nameValue, onChangeName, showName = false, style }) => {


  return (
    <View style={{ width: '100%' , alignItems: 'center'}}>
      {showName && (
       <View style={[styles.container, style]}>
         <TextInput
            style={styles.input}
            placeholder="Name"
            value={nameValue}
            onChangeText={onChangeName}
            autoCapitalize="none"

         />
       </View>
      )}
      <View style={[styles.container, style]}>
         <TextInput
            style={styles.input}
            placeholder="Your Email"
            value={value}
            onChangeText={onChangeText}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
         />
       </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    height: 55,
    width: '80%',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#DADADA',
    backgroundColor: '#F7F8F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    fontSize: 18,
    width: '100%',
  },
});

export default EmailAndName;
