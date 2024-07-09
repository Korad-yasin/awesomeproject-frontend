import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const timeOptions = ["6:00 - 9:00 am", "9:00 - 12:00 pm", "noon - 3:00 pm", "3:00 - 6:00 pm", "6:00 - 9:00 pm", "9:00 - 11:59 pm"];
const frequencyOptions = ["   1 - 3   ", "   3 - 5   ", "more than 5"];

const Times = ({ onSelectionChange }) => {
    const [selectedTime, setSelectedTime] = useState([]);
    const [selectedFrequency, setSelectedFrequency] = useState([]);

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        onSelectionChange({ selectedTime: time, selectedFrequency });
    };

    const handleFrequencySelect = (frequency) => {
        setSelectedFrequency(frequency);
        onSelectionChange({ selectedTime, selectedFrequency: frequency });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Time of the day</Text>
            <Text style={styles.text}>Select your peak times aka when you workout </Text>
            <View style={styles.times}>
            {timeOptions.map(time => (
                <TouchableOpacity key={time} style={[styles.option, selectedTime === time && styles.selected]} onPress={() => handleTimeSelect(time)}>
                    <Text>{time}</Text>
                </TouchableOpacity>
            ))}
            </View>
            <Text style={styles.heading}>Days per week</Text>
            <View style={styles.days}>
            {frequencyOptions.map(freq => (
                <TouchableOpacity key={freq} style={[styles.option, selectedFrequency === freq && styles.selected]} onPress={() => handleFrequencySelect(freq)}>
                    <Text>{freq}</Text>
                </TouchableOpacity>
            ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,

    },
    times: {
        flex: 0.5,
        padding: 8,
        flexWrap: 'wrap',
        flexDirection: 'row',
        margin: 4,  
        justifyContent: 'space-between',
        marginBottom: 10,

    },
    days: {
        flex: 0.3,
        padding: 8,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    option: {    
        padding: 10,
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        flexBasis: '45%',
        paddingVertical: 15,
        borderColor: '#E8E6EA',
        borderWidth: 1,
        
        
    },
    selected: {
        backgroundColor: '#FFBB56',
        shadowColor: '#787878',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        borderColor: 'transparent'
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        marginHorizontal: 10,
    },
    text: {
        fontSize: 14,
        color: '#787878',
        marginHorizontal: 10,

    },
});

export default Times;