import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function Sandbox() {

    const [selected, setSelected] = useState(null);  // State to track the selected box


    // Function to handle press on a box
    const handlePress = (boxNumber) => {
        setSelected(boxNumber);  // Set the selected box number

    };


    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => handlePress(1)} style={[styles.box, styles.boxOne, selected === 1 ? styles.selected : {}]}>
                <Text>one</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePress(2)} style={[styles.box, styles.boxTwo, selected === 2 ? styles.selected : {}]}>
                <Text>two</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePress(3)} style={[styles.box, styles.boxThree, selected === 3 ? styles.selected : {}]}>
                <Text>three</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePress(4)} style={[styles.box, styles.boxFour, selected === 4 ? styles.selected : {}]}>
                <Text>four</Text>
            </TouchableOpacity>
        </View>
    );
    
}

const styles = StyleSheet.create({
    container: {
        flexWrap: 'wrap',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        
    },
    box: {
        flexBasis: '30%',  // Each box will take about one-third of container's width
        margin: 20,  
        padding: 20,  
        justifyContent: 'center',  
        alignItems: 'center',  

    },
    boxOne: {
        backgroundColor: 'violet', 

    },
    boxTwo: {
        backgroundColor: 'gold',
    },
    boxThree: {
        backgroundColor: 'coral',
    },
    boxFour: {
        backgroundColor: 'skyblue',
    },
    selected: {  
        color: '#E379E0',  
        backgroundColor: '#E94057',
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 15}, 
        shadowOpacity: 0.5, 
        shadowRadius: 5,
        transform: [
            { perspective: 200 }, // Lower numbers can be more dramatic
            { rotateX: '45deg' }
          ]

    },
});