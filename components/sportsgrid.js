// SportsGrid.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



const sportsData = [
    { id: 'gym', name: 'Gym', icon: 'weight-lifter' },
    { id: 'running', name: 'Running', icon: 'run' },
    { id: 'boxing', name: 'Boxing', icon: 'boxing-glove' },
    { id: 'squash', name: 'Squash', icon: 'racquetball' },
    { id: 'basketball', name: 'Basketball', icon: 'basketball' },
    { id: 'tennis', name: 'Tennis', icon: 'tennis' }
    
];

const SportsGrid = ({ onSelectionChange }) => {
    const [selected, setSelected] = useState([]);

    const handleSelect = (id) => {
        setSelected(prevSelected => {
            if (prevSelected.includes(id)) {
                // Allow deselection
                return prevSelected.filter(item => item !== id);
            } else {
                // Allow selection only if less than 3 items are currently selected
                if (prevSelected.length < 3) {
                    return [...prevSelected, id];
                } else {
                    // Optionally provide feedback here if needed, e.g., a toast message
                    alert("You can select up to 3 fitness options.");
                }
            }
            return prevSelected; // Return previous state if no new selection is added
        });
    };

    useEffect(() => {
        onSelectionChange(selected);
    }, [selected, onSelectionChange]);


    return (
        <View style={styles.container}>
             <View style={styles.title}>
                  <Text style={styles.text}>Your fitness choice </Text>
                  <Text style={styles.text2}>Select 1-3 </Text>
              </View>
              <View style={styles.sportContainer}>
                  {sportsData.map(sport => (
                         <TouchableOpacity key={sport.id}  style={selected.includes(sport.id) ? [styles.option, styles.selected] : styles.option} onPress={() => handleSelect(sport.id)}>
                             <Icon name={sport.icon} size={20} color="#FF6347" />
                             <Text style={styles.text3}>{sport.name}</Text>     
                          </TouchableOpacity>
                    ))}
              </View>
              <View style={styles.bottomText}>
              <Text style={styles.text4}>More fitness options will be added soon! </Text>
              </View>

         </View>
        
    );
};

// stylesheet code

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    sportContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        backgroundColor: 'white'
    },
    option:{
        margin: 10,
        padding: 8,
        paddingVertical: 15,
        flexDirection: 'row',
        flexBasis: '40%', 
        borderColor: '#E8E6EA',
        borderWidth: 1,
        borderRadius: 15,  
        
    },
    selected: {
        // Additional styles for selected items
        backgroundColor: '#FFBB56',
        shadowColor: '#787878',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        borderColor: 'transparent'
    },
    title: {
        alignItems: 'left',
        padding: 20,
        flexDirection: ''
    },
    text: {
        fontSize: 30,

    },
    text2: {
        fontSize: 16,
        color: '#787878'
    },
    text3: {
        marginTop: 5,
        fontSize: 14,
        color: '#333',
        marginLeft: 10,
    },
    text4: {
        fontSize: 16,
        color: '#787878',
        alignSelf: 'center',
        marginTop: 70,

    },
});

export default SportsGrid;
