import React, {useState, useContext} from 'react'; // Import useContext and useState
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import SetupContext from '../SetupContext';
import GenderItem from '../reusable/genderItem';
import Header from '../reusable/header';
import NextButton from '../reusable/button';
import { updateUserGender } from '../services/userService';
import useFonts from '../hooks/useFonts';




const Gender = ({navigation}) => {
    const { userId } = useContext(SetupContext);

    const [gender, setGender] = useState ([
        {text: 'woman', key: '1'}, {text: 'man', key: '2'}, {text: 'non-binary', key: '3'}
    ]);

    const [selectedKey, setSelectedKey] = useState(null);
    const pressHandler = (key) => {
        setSelectedKey(key);
    };

    const fontLoaded = useFonts();
    
    if (!fontLoaded) {
        return <ActivityIndicator size="large" />;
    }



    const next = async () => {
        if (selectedKey) {
          const selectedGender = gender.find(item => item.key === selectedKey).text;
          await updateUserGender(userId, selectedGender) // Replace 'userId' with actual user ID variable
            .then(() => {
              navigation.navigate('genderpref');
            })
            .catch(error => {
              console.error('Failed to update gender:', error);
            });
        } else {
          alert('Please select a gender.');
        }
    };

    const skip = async () => {
        // Navigate to the next screen
        navigation.navigate('genderpref');
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
                    <Text style={styles.text}>I am </Text>
                    <FlatList
                        data={gender}
                        renderItem={({ item }) => (
                            <GenderItem item={item} pressHandler={pressHandler} isSelected={selectedKey === item.key} />
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

export default Gender;