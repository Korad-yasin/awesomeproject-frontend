// stand in code new screens
import { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import SetupContext from '../SetupContext';
import axios from 'axios'; 
import { API_URL } from '../config';





const Practice = () => {

    const [fontLoaded, setFontLoaded] = useState(false);
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false); 
    const [selected, setSelected] = useState([]);

    const data = [
        { label: 'Smith College', value: '1' },
        { label: 'Amherst', value: '2' },
        { label: 'Brown University', value: '3' },
        { label: 'Tufts', value: '4' },
        { label: 'NewYork University', value: '5' },
        { label: 'Mount Holoyke', value: '6' },
        { label: 'Hampshire College', value: '7' },
        { label: 'Harvard', value: '8' },
    ];

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
    
    if (!fontLoaded) {
     return <ActivityIndicator size="large" />;
    }

    const renderItem = item => {
        return (
          <View style={styles.item}>
            <Text style={styles.selectedTextStyle1}>{item.label}</Text>
          </View>
        );
    };

    const SelectedItem = ({ item, onRemove }) => {
        return (
          <View style={styles.selectedStyle}>
            <Text style={styles.textSelectedStyle}>{item.label}</Text>
            <TouchableOpacity onPress={onRemove} style={{ padding: 4 }}>
              <AntDesign color="black" name="delete" size={17} />
            </TouchableOpacity>
          </View>
        );
    };
      

    

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <View style={styles.textContainer1}>
                        <Text style={styles.text1}>Connect with gym rats from your school.</Text>
                    </View>
                    <Dropdown
                      style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      data={data}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={!isFocus ? 'Select School' : '...'}
                      searchPlaceholder="Search..."
                      value={value}
                      onFocus={() => setIsFocus(true)}
                      onBlur={() => setIsFocus(false)}
                      onChange={item => {
                        setValue(item.value);
                        setIsFocus(false);
                      }}
                    />
                    <View style={styles.textContainer2}>
                        <Text style={styles.text2}>Want to see gym rats from other schools ? Select as many as you want.</Text>
                    </View>
                    <MultiSelect
                      style={[styles.dropdown2, isFocus && { borderColor: 'blue' }]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={data}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder="Select Schools"
                      searchPlaceholder="Search..."
                      value={selected}
                      onChange={item => {
                        setSelected(item);
                      }}
                      renderSelectedItem={(item, unSelect) => (
                        <SelectedItem item={item} onRemove={() => unSelect(item)} />
                      )}  
                    />
                    
                </View>
                <View style={styles.bottomContainer}>
                 <Pressable style={styles.buttonContainer}>
                     <View style={styles.nextButton}>
                         <Text style={styles.nextButtonText}>Next</Text>
                      </View>
                 </Pressable>
                </View>
             
           </View>
        </SafeAreaView>
        
    );
};

// stylesheet code

const { height } = Dimensions.get('window'); 
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'yellow',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
    }, 
    topContainer: {
        flex: 0.8,
        backgroundColor: 'white',
        padding: 20,

    },
    textContainer1: {
        alignItems: 'flex-start',
        padding: 10,
        backgroundColor: 'yellow',
        marginTop: 10,
    },
    text1: {
        fontSize: 16,
        fontFamily: 'Urbanist-VariableFont',
        fontWeight: 'bold',
        color: 'black',
    },
    textContainer2: {
        alignItems: 'flex-start',
        padding: 10,
        backgroundColor: 'yellow',
        top: height * 0.15,
    },
    text2: {
        fontSize: 16,
        fontFamily: 'Urbanist-VariableFont',
        fontWeight: 'bold',
        color: 'black',
    },
    dropdown: {
        height: 50,
        width: '80%',
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop: 15,

    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: { // text container color for the Dropdown and not the MultiSelect
        fontSize: 16,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        
    },
    dropdown2: {
        height: 50,
        width: '80%',
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop: 15,
        top: height * 0.15,
        marginBottom: 150,
    },
    selectedStyle: {    // oval containers for selected schools
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'pink',
        shadowColor: '#000',
        marginTop: 8,
        marginRight: 12,
        paddingHorizontal: 10,
        paddingVertical: 8,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        
    },
    textSelectedStyle: {
        padding: 2,
        color: 'black',
       

        
    },
    item: {
        backgroundColor: 'transparent',
    },
    selectedTextStyle1 : {   // text of the dropdown school list in the MultiSelect
        fontSize: 16,
        padding: 12,
    },
    
    
    bottomContainer: {
        flex: 0.2,
        backgroundColor: 'white',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        position: 'absolute',
        width: '80%',
        height: 56,
        backgroundColor: '#FFBB56',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: height * 0.1,
  
       
    },
      nextButtonText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        fontFamily: 'Urbanist-VariableFont',
    },
    
    
});

export default Practice;


