import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';  // If using SVG directly



const backButtonSvg = `
<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="51" height="51" rx="14.5" fill="white" stroke="#E8E6EA"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M29.2071 32.7071C28.8166 33.0976 28.1834 33.0976 27.7929 32.7071L21.7929 26.7071C21.4024 26.3166 21.4024 25.6834 21.7929 25.2929L27.7929 19.2929C28.1834 18.9024 28.8166 18.9024 29.2071 19.2929C29.5976 19.6834 29.5976 20.3166 29.2071 20.7071L23.9142 26L29.2071 31.2929C29.5976 31.6834 29.5976 32.3166 29.2071 32.7071Z" fill="black"/>
</svg>
`;


export default function Header({onBackPress, onSkipPress}) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress} style={styles.button}>
        <SvgXml xml={backButtonSvg} width="52" height="52" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onSkipPress} style={styles.button}>
        <Text>Skip</Text>
      </TouchableOpacity>

    </View>
  );
}


const styles = StyleSheet.create({
  header: {
    height: 80,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 10, 

  },
  button: {
    padding: 10,
  },
});