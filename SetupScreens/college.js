//
import { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, ActivityIndicator} from 'react-native';
import * as Font from 'expo-font';
import SetupContext from '../SetupContext';
import Header from '../reusable/header';
import NextButton from '../reusable/button';
import CollegeDropdown from '../components/collegeDropdown';
import UsaColleges from '../hooks/collegeService';
import { updateCollegeSelections } from '../services/userService';





const College = ({ navigation }) => {
    const { userId } = useContext(SetupContext);

    const [selectedCollege, setSelectedCollege] = useState(null);
    const [selectedOtherColleges, setSelectedOtherColleges] = useState([]);
    const { colleges, isLoading, error } = UsaColleges('MA');  // Assuming you pass a state abbreviation
    const [isFocus, setIsFocus] = useState(false);

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


    if (!fontLoaded) {
     return <ActivityIndicator size="large" />;
    }

    if (error) return <Text>Error fetching colleges: {error.message}</Text>;

    const next = async () => {
        if (!selectedCollege || !selectedOtherColleges.length) {
            alert("Please select your school and at least one other school.");
            return;
        }
        try {
            
            const response = await updateCollegeSelections(userId, selectedCollege, selectedOtherColleges);
            console.log("College selection updated successfully:", response.data);
            navigation.navigate('age'); 
        } catch (error) {
            console.error("Failed to update college selections:", error);
            alert("Failed to save your college preferences. Please try again.");
        }
    };


    const skip = async () => {
        
        navigation.navigate('age');
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
                <View style={styles.topContainer}>
                    <View style={styles.textContainer}>
                          <Text style={styles.text}>Connect with trybe from your school.</Text>
                    </View>
                    <View style={styles.dropdownContainer}>
                          <CollegeDropdown
                             data={colleges}
                             selectedValue={selectedCollege}
                             onSelect={setSelectedCollege}
                             placeholder="Select Your School"
                             isFocus={setIsFocus}
                             setIsFocus={setIsFocus}
                           />

                    </View>
                    <View style={styles.dropdownContainer2}>
                          <CollegeDropdown
                             data={colleges}
                             selectedValue={selectedOtherColleges}
                             onSelect={setSelectedOtherColleges}
                             placeholder="Select Other Schools"
                             isFocus={setIsFocus}  // This function needs to be defined
                             setIsFocus={setIsFocus}
                             multiple={true}
                           />

                    </View>
                    
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

// stylesheet code

const { height } = Dimensions.get('window'); 
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
    topContainer: {
        flex: 4,
        backgroundColor: 'white',
    },
    textContainer: {
        flex: 0.1,
        paddingVertical: 10,
        paddingHorizontal: 25,
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    dropdownContainer: {
        flex: 0.3,
        paddingTop: 10,

    },
    dropdownContainer2: {
        flex: 0.6,
        paddingTop: 10,
    },
    text: {
        fontSize: 16,
        color: 'black',
    },
    bottomContainer: {
        flex: 1,
        backgroundColor: 'white',
        padding: 5,
        justifyContent: 'center',
    },    
});

export default College;

