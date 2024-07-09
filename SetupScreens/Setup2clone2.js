import React, {useState} from 'react'; // Import useContext and useState
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions, SafeAreaView } from 'react-native';
import GenderItem from '../reusable/genderItem';
import Header from '../reusable/header';
import NextButton from '../reusable/button';


const Setup2clone2 = ({navigation}) => {
    const [gender, setGender] = useState ([
        {text: 'woman', key: '1'}, {text: 'man', key: '2'}, {text: 'non-binary', key: '3'}
    ]);

    const [selectedKey, setSelectedKey] = useState(null);

    const pressHandler = (key) => {
        setSelectedKey(key);
    };

    const next = async () => {
        // Navigate to the next screen
        navigation.navigate('Setup2x2');
    };

    

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                <Header
                onBackPress={() => navigation.goBack()}
                onSkipPress={next}
                />
                </View>
                <View style={styles.list}>
                    <Text style={styles.text}>I prefer </Text>
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

export default Setup2clone2;