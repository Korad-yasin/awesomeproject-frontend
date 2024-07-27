// ReturnMessage.js
import React from 'react';
import { StyleSheet, Text, View, Modal, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ReturnMessage = ({ modalVisible, onClose }) => {

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Icon name="hand-peace" size={36} color="#FF6347" />
                    <Text style={styles.text}>Hey trybe. Finish setup! </Text>
                    <Button title="OK"  onPress={onClose} />
                </View>
            </View>
        </Modal>
    );

}

// stylesheet


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  
    },
    modalView: {
        flex: 0.2,
        width: '80%',
        backgroundColor: "white",
        borderRadius: 20,
        padding: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        justifyContent: 'space-between'
    },
    text :{
        fontSize: 20,

    },
});

export default ReturnMessage;
