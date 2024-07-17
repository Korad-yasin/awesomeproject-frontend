// genderpre.js

import React, {useState, useContext} from 'react'; // Import useContext and useState
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, SafeAreaView } from 'react-native';
import SetupContext from '../SetupContext';
import GenderItem from '../reusable/genderItem';
import Header from '../reusable/header';
import NextButton from '../reusable/button';
import { updateGenderPreferences } from '../services/userService';


const Genderpref = ({navigation}) => {
    const { userId } = useContext(SetupContext);

    const [gender, setGender] = useState ([
        {text: 'woman', key: '1'}, {text: 'man', key: '2'}, {text: 'non-binary', key: '3'}
    ]);

    const [selectedKeys, setSelectedKeys] = useState([]);

    const pressHandler = (key) => {
        if (selectedKeys.includes(key)) {
            setSelectedKeys(selectedKeys.filter(item => item !== key)); // Remove key if already selected
        } else {
            setSelectedKeys([...selectedKeys, key]); // Add key if not already selected
        }
    };

    const next = async () => {
        if (!selectedKeys.length) {
            alert('Please select at least one option.');
            return;
        }
    
        try {
            const response = await updateGenderPreferences(userId, selectedKeys); // Replace 'userId' with actual user ID variable
            console.log('Preferences updated:', response.data);
            navigation.navigate('fitnesschoice');
        } catch (error) {
            console.error('Failed to update gender preferences:', error);
        }
    };

    const skip = async () => {
        // Navigate to the next screen
        navigation.navigate('fitnesschoice');
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
                <View style={styles.list}>
                    <Text style={styles.text}>I prefer </Text>
                    <FlatList
                        data={gender}
                        renderItem={({ item }) => (
                            <GenderItem item={item} pressHandler={() => pressHandler(item.key)} isSelected={selectedKeys.includes(item.key)} />
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
        backgroundColor: 'white',
    },
    list: {
        flex:4,
        padding: 30,
        backgroundColor: 'white',
        
        
    },
    text:{
        fontWeight: 'bold',
        marginBottom: 30,

    },
    bottomContainer: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',

    
    },


});

export default Genderpref;