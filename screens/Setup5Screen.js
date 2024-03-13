import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, SafeAreaView, Dimensions, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import * as Font from 'expo-font';
import FastImage from 'react-native-fast-image';

import axios from 'axios';
import SetupContext from '../SetupContext';
import { API_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUserAvatar } from '../redux/actions/userActions'; // Adjust the path as necessary


const Setup5Screen = ({navigation}) => {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [images, setImages] = useState([null, null, null, null]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const { userId } = useContext(SetupContext);
  const dispatch = useDispatch();
  const [avatarUrl, setAvatarUrl] = useState(null);

  const { isReturningUser, setIsReturningUser } = useContext(SetupContext);
  const [showMessage, setShowMessage] = useState(isReturningUser);

  useEffect(() => {
    if (showMessage) {
      setShowMessage(true); 
      setIsReturningUser(false); 
    }
  }, [showMessage, setIsReturningUser]);

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


  const handleImageSelection = (index) => {
    setModalVisible(false);  // Close the modal

    setTimeout(() => {
        ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: true
        }).then(image => {
          console.log(image);
          uploadImage(image, index);
        });
    }, 1000);  // 1-second delay
  };

  const handleCameraSelection = (index) => {
    setModalVisible(false);  // Close the modal

    setTimeout(() => {
        ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: true
        }).then(image => {
          console.log(image);
          uploadImage(image, index);
        });
    }, 1000);  // 1-second delay
  };

  const openImageOptions = (index) => {
    console.log('Opening image options for index:', index);
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImageIndex(null);
  };

  const uploadImage = async (image, index) => {
    const timestamp = Date.now();
    const newFileName = `${timestamp}_${image.filename}`;
    console.log('Image path:', image.path); // Now this should log the correct path
  
    try {
      const uploadTask = storage().ref(`images/${newFileName}`).putFile(image.path);
  
      uploadTask.on(
        "state_changed",
        snapshot => {
          // You can use this section to show upload progress if needed
        },
        error => {
          console.log(error);
        },
        async () => {
          try {
            const url = await storage().ref('images').child(newFileName).getDownloadURL();
            console.log(`Download URL: ${url}`);
            // Check if the uploaded image is the first one (intended to be the avatar)

            if (index === 0) {
              // First image is the avatar
               setAvatarUrl(url);
               dispatch(setUserAvatar(userId, url)); // Update Redux store
            } else {
              // Other images are gallery images
              let newImages = [...images];
              newImages[index] = url;
              setImages(newImages);
            }
            

          } catch (error) {
            console.log(error);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetupCompletion = async () => {
    const validGalleryImages = images.filter((image, index) => image !== null && index !== 0);

    try {
      console.log({ userId, avatarUrl, validGalleryImages });  // Log the data being sent in the API request
      const response = await axios.post(`${API_URL}/setup5`, {
        userId, 
        avatarUrl: avatarUrl, // Send avatar URL separately
        galleryUrls: validGalleryImages, // Send only gallery images
        lastcompletedsetupstep: 5, 
      });
      console.log(response.data);

      await AsyncStorage.setItem('hasCompletedSetup', 'true');
      console.log("hasCompletedSetup set to true in AsyncStorage");
      // If the response indicates success, navigate to the next screen
      navigation.navigate('BottomTabNavigator', { justCompletedSetup: true }); 
    } catch (error) {
      console.error('Error during setup5:', error);
    }
  };
  

    
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
        {showMessage && (
           <Text style={styles.continueText}>
             Continue setting up your Gym Rats profile.
           </Text>
         )}
          <Text style={styles.textProfile}>Tap on the plus sign to add images</Text>
        </View>
        <View style={styles.middleContainer}>
            <View style={styles.rowContainer}>
                <TouchableOpacity style={[styles.imagePlaceholder, styles.profilePlaceholder]} onPress={() => openImageOptions(0)}>
                  {avatarUrl ? (<FastImage source={{ uri: avatarUrl }} style={[styles.imagePlaceholder, styles.image]} resizeMode="cover" /> 
                  ) : ( 
                    <>
                    <Icon name="add" size={40} color="black" />
                    <Text style={styles.placeholderText}>Profile Picture</Text>
                    </>
                )} 
                </TouchableOpacity>
                <TouchableOpacity style={styles.imagePlaceholder} onPress={() => openImageOptions(1)}>
                  {images[1] ? <FastImage source={{ uri: images[1] }} style={[styles.imagePlaceholder, styles.image]} resizeMode="cover" /> : <Icon name="add" size={40} color="black" />}
                </TouchableOpacity>
            </View>
            <View style={styles.rowContainer}>
                <TouchableOpacity style={styles.imagePlaceholder} onPress={() => openImageOptions(2)}>
                  {images[2] ? <FastImage source={{ uri: images[2] }} style={[styles.imagePlaceholder, styles.image]} resizeMode="cover" /> : <Icon name="add" size={40} color="black" />}
                </TouchableOpacity>
                <TouchableOpacity style={styles.imagePlaceholder} onPress={() => openImageOptions(3)}>
                  {images[3] ? <FastImage source={{ uri: images[3] }} style={[styles.imagePlaceholder, styles.image]} resizeMode="cover" /> : <Icon name="add" size={40} color="black" />}
                </TouchableOpacity>
            </View>
        </View>
        <View style={styles.bottomContainer}>
           <Pressable onPress={handleSetupCompletion} style={styles.buttonContainer}>
               <View style={styles.button}>
                 <Text style={styles.buttonText}>Next</Text>
               </View>
           </Pressable>
        </View>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
                    <TouchableOpacity onPress={() => {
                        setTimeout(() => {
                            handleImageSelection(selectedImageIndex);
                        }, 300);
                        closeModal();
                    }}>
                        <Text>Select Image from Gallery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        setTimeout(() => {
                            handleCameraSelection(selectedImageIndex);
                        }, 300);
                        closeModal();
                    }}>
                        <Text>Take a New Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={closeModal}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
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
  },
  continueText: {
    marginBottom: 10,
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 10,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  headerContainer: {
    flex: 0.7,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,

  },
  textProfile: {
    color: 'black',
    fontSize: 20,
    fontWeight: '400',
    fontStyle: 'normal',
    padding: 5,
    fontFamily: 'Urbanist-VariableFont'
  },
  middleContainer: {
    flex: 4,
    backgroundColor: 'white',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
  },
  imagePlaceholder: {
    width: 140,
    height: 140,
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20, 
  },
  profilePlaceholder: {
    borderColor: '#FF6A4D', // or any color that stands out
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  placeholderText: {
    position: 'absolute',
    bottom: 10,
    color: '#000',
    fontSize: 14,
    fontFamily: 'Arial'
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: '#FFBB56',
    borderRadius: 8,
    padding: 15,
    width: '80%',
    alignItems: 'center',
    
  },
  buttonText: {
    color: '#202244',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Urbanist-VariableFont',
  },

  
  // ... (the rest of your styles here, unchanged)
});

export default Setup5Screen;
