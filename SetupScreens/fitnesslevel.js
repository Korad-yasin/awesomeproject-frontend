import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import SetupContext from '../SetupContext';
import Header from '../reusable/header';
import NextButton from '../reusable/button';
import Level from '../components/level';
import { updateFitnessLevel } from '../services/userService';
import useFonts from '../hooks/useFonts';



const Fitnesslevel = ({ navigation }) => {
    const { userId } = useContext(SetupContext);

    const [level, setLevel] = useState ([
        {text: 'beginner', key: '1'}, {text: 'intermediate', key: '2'}, {text: 'Pro', key: '3'}
    ]);

    const [selectedKey, setSelectedKey] = useState(null);
    const pressHandler = (key) => {
        setSelectedKey(key);
    };

    // hooks
    const fontLoaded = useFonts();

    if (!fontLoaded) {
        return <ActivityIndicator size="large" />;
    }

    const next = async () => {
        if (!selectedKey) {
            alert('Please select a fitness level.');
            return;
        }
        try {
            await updateFitnessLevel(userId, selectedKey);
            navigation.navigate('fitnesstime');
        } catch (error) {
            console.error('Failed to update fitness level:', error);
        }
    };

    const skip = async () => {
        // Navigate to the next screen
        navigation.navigate('fitnesstime');
    };


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Header
                    onBackPress={() => navigation.goBack()}
                    onSkipPress={skip}
                    />
                </View>
                <View style={styles.optionContainer}>
                <Text style={styles.text}>Your fitness level </Text>
                <Text style={styles.text2}>Based on your fitness choice, are you a: </Text>
                <FlatList
                        data={level}
                        renderItem={({ item }) => (
                            <Level item={item} pressHandler={pressHandler} isSelected={selectedKey === item.key} />
                        )}
                        keyExtractor={item => item.key}
                    />
                    
                </View>
                <View style={styles.bottomContainer}>
                    <NextButton
                    onButtonPress={next}
                    />
               </View>
            </View>
           
        </SafeAreaView>
        
    );
   
};

// stylesheet 

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 20,
    },
    header:{
        backgroundColor: 'white',
    }, 
    optionContainer: {
        flex: 4,
        padding: 30,
        backgroundColor: 'white',

    },
    text: {
        fontSize: 30,
        marginBottom: 5,

    },
    text2: {
        fontSize: 16,
        color: '#787878',
        marginBottom: 15,
    },
    bottomContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
    
    },
});

export default Fitnesslevel;