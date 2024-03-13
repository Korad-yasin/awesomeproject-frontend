import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { useDispatch,useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import SettingIcon from '../assets/images/SettingIcon.js';
import ImageIcon from '../assets/images/ImageIcon.js';
import ImagePicker from 'react-native-image-crop-picker';
import { setUserAvatar } from '../redux/actions/userActions';
import storage from '@react-native-firebase/storage';
import axios from 'axios'; // Import axios
import { API_URL } from '../config';

const ProfileScreen = ({ navigation }) => {
  const loggedInUserId = useSelector(state => state.loggedInUser.pgId);
  const dispatch = useDispatch();
  const { avatarUrl } = useSelector(state => state.loggedInUser);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);


  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleEditPress = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7
    }).then(image => {
      console.log("selected image:", image);
      setSelectedImageUri(image.path); // Set the local URI
      uploadImage(image);
    }).catch(e => {
      console.log(e);
      // Handle any cancellation or error
    });
  };

  const uploadImage = async (image) => {
    const timestamp = Date.now();
    const newFileName = `${timestamp}_${image.filename}`;
    console.log('Image path:', image.path);
  
    try {
      const uploadTask = storage().ref(`images/${newFileName}`).putFile(image.path);
  
      uploadTask.on(
        "state_changed",
        snapshot => {
          // Optional: Show upload progress
        },
        error => {
          console.log(error);
        },
        async () => {
          try {
            const url = await storage().ref('images').child(newFileName).getDownloadURL();
            console.log(`Download URL: ${url}`);
            updateAvatarInDatabase(url); // Update avatar URL in the database
          } catch (error) {
            console.log(error);
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const updateAvatarInDatabase = async (url) => {
    try {
      const response = await axios.post(`${API_URL}/update-avatar`, { userId: loggedInUserId, newAvatarUrl: url });
      console.log(response.data.message);
      // Update Redux store with the new avatar URL
      dispatch(setUserAvatar(loggedInUserId, url));
    } catch (error) {
      console.error('Error updating avatar in database:', error);
    }
  };
   
  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  const navigateToChangePictures = () => {
    navigation.navigate('ChangePictures');
  };

  


  return (
      <View style={styles.container}>
      <TouchableOpacity style={styles.avatarContainer} onPress={toggleModal} >
        <View style={styles.avatarBackground} />
        {avatarUrl && (
          <FastImage 
            style={styles.avatar} 
            source={{ uri: avatarUrl, priority: FastImage.priority.normal }} 
          />
        )}
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Image 
              style={styles.expandedAvatar} 
              source={{ uri: selectedImageUri || avatarUrl }} 
            />
            <View style={styles.rowContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={handleEditPress} >
              <Text>Edit</Text>
            </TouchableOpacity> 
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text>Close</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <TouchableOpacity style={styles.settingsButton} onPress={navigateToSettings}>
        <SettingIcon />
      </TouchableOpacity>
      <Text style={styles.settingsText} onPress={navigateToSettings} >Settings</Text>
      <TouchableOpacity style={styles.picturesButton} onPress={navigateToChangePictures}>
        <ImageIcon />
      </TouchableOpacity>
      <Text style={styles.picturesText} onPress={navigateToChangePictures} >pictures</Text>
    </View>
    
  );
};

// stylesheet code

const { height } = Dimensions.get('window'); 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    
  },
  avatarContainer: {
    position: 'absolute',
    top: height * 0.1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  avatarBackground: {
    position: 'absolute',  
    width: 105,
    height: 105,
    backgroundColor: 'black',
    borderRadius: 150,
  },
  avatar: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 150,
  },
  settingsButton: {
    position: 'absolute',
    top: height * 0.28,
    left: '10%',
  },
  settingsText : {
    position: 'absolute',
    top: height * 0.29,
    left: '22%',
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: '400',


  },
  picturesButton: {
    position: 'absolute',
    top: height * 0.22,
    left: '10%',

  },
  picturesText: {
    position: 'absolute',
    top: height * 0.23,
    left: '22%',
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: '400',

  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  expandedAvatar: {
    width: 300, // Adjust size as needed
    height: 300, // Adjust size as needed
    borderRadius: 10, // Adjust to make it circular
  },
  closeButton: {
    margin: 7,
    backgroundColor: '#ddd',
    padding: 5,
    borderRadius: 5,

  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',


  },
 
  
  // ... add any other required styles
});

export default ProfileScreen;
