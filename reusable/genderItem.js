import React from 'react'
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function GenderItem({ item, pressHandler, isSelected }) {
  return (
    <TouchableOpacity onPress={() => pressHandler(item.key)}  >
      <View style={[styles.item, isSelected ? styles.selected : {}]}>
         <Text style={styles.text}>{item.text}</Text>
         <AntDesign name="check" size={24}  style={[styles.icon, isSelected ? styles.selected2 : {}]} />
      </View>
      
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  item: {
    padding: 16,
    marginTop: 16,
    borderColor: '#bbb',
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    
  },
  selected: {
    backgroundColor: '#FFBB56'  // selected background
  },
  selected2: {
    color: 'white'
  },
  text: {
    fontWeight: 'normal',
    
  },
  icon: {
    color:'#5F6368',
  },

});