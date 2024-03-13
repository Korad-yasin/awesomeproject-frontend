import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, SafeAreaView , Image } from 'react-native';
import Swiper from 'react-native-swiper';
import { ScreenHeight } from 'react-native-elements/dist/helpers/index.js';
import FastImage from 'react-native-fast-image';
import storage from '@react-native-firebase/storage';
import axios from 'axios'; 
import { API_URL } from '../config';

const ChangePictures = ({ navigation }) => {

    const loggedInUserId = useSelector(state => state.loggedInUser.pgId);
    const userGalleryImages = useSelector(state =>
        state.user.userData.find(user => user.id === loggedInUserId)?.galleryImages || []
    );


    const handleDonePress = () => {
        navigation.goBack(); // Navigate back to the previous screen
    };

    const handleEditPress = () => {
        navigation.navigate('Practice'); // Navigate back to the previous screen
    };


    
    


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
             {userGalleryImages.length > 0 ? (
                <Swiper loop={true} activeDotColor="black"  dotColor="grey" >
                    {userGalleryImages.map((image, index) => (
                        <View key={index} style={styles.slide}>
                         <FastImage source={{ uri: image.url }} style={styles.image}  />
                      </View>
                    ))}
              </Swiper>
             ): (
                <View style={styles.noImagesContainer}>
                    <Text style={styles.noImagesText}>No Images Available</Text>
                </View>
              )}  
              <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleEditPress} style={styles.button}>
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDonePress} style={styles.button}>
                        <Text style={styles.buttonText}>Done</Text>
                    </TouchableOpacity>
                </View>        
             </View>
        </SafeAreaView>
        
    );
};

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window'); 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    }, 
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    slide: {
        height: ScreenHeight * 0.75, 
        borderRadius: 0,
        overflow: 'hidden',
        backgroundColor: 'transparent',
         
         
        
        
    },
    image: {
        width: width,
        height: '98%', // Keeping the images square, but you can adjust as needed
        borderRadius: 5,
        
        
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: 'transparent',
        bottom: height * 0.03,
        paddingHorizontal: 40,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 10,
        backgroundColor: '#000', // Adjust as needed
    },
    buttonText: {
        fontSize: 16,
        color: '#FFF', // Adjust as needed
    },
    
});

export default ChangePictures;

