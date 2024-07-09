import React from 'react';
import { View, Text, StyleSheet, Pressable} from 'react-native';


export default function NextButton ({onButtonPress}) {
    return (
        <View style={styles.bottomContainer}>
             <Pressable onPress={onButtonPress} style={styles.buttonContainer}>
                 <View style={styles.button}>
                     <Text style={styles.buttonText}>Next</Text>
               </View>
         </Pressable>
      </View>
    );

}

const styles = StyleSheet.create({
    bottomContainer: {
        alignItems: 'center',
    },
    
    buttonContainer: {
        backgroundColor: '#FFBB56',
        borderRadius: 8,
        padding: 15,
        width: '80%',
        alignItems: 'center',
        
        
    },
    buttonText: {
        color: '#202244',
        fontSize: 20,
        fontWeight: '600',
        fontFamily: 'Urbanist-VariableFont',
    },



});