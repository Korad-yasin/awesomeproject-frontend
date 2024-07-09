import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Pressable, FlatList } from 'react-native';
import axios from 'axios'; 
import { API_URL } from '../config';
import * as Font from 'expo-font';
import Header from '../reusable/header';
import NextButton from '../reusable/button';
import Times from '../components/times';


const Setup2x4 = ({ navigation }) => {
    const [fontLoaded, setFontLoaded] = useState(false);




    useEffect(() => {
        const loadFont = async () => {
          await Font.loadAsync({
            'Chewy-Regular': require('../assets/fonts/Chewy-Regular.ttf'),
            'Urbanist-VariableFont': require('../assets/fonts/Urbanist-VariableFont.ttf')
          });
          setFontLoaded(true);
        };
        loadFont();
    }, []);





    const next = async () => {
        // Navigate to the next screen
        navigation.navigate('Setup3');
    };


    const skip = async () => {
        // Navigate to the next screen
        navigation.navigate('Setup3');
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
                    <Times
                    onSelectionChange={(selections) => console.log(selections)}
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
    header: {
        backgroundColor:'white',
    },
    optionContainer: {
        flex: 5,
        backgroundColor: 'white',
    },
    bottomContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',

    
    },
    
});

export default Setup2x4;