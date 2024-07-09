// CollegeDropdown.js
import React, {useState} from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

const CollegeDropdown = ({ data, selectedValue, onSelect, placeholder, isFocus, setIsFocus, multiple = false, renderSelectedItem}) => {

    const commonProps = {
        data,
        labelField: 'label',
        valueField: 'value',
        placeholder,
        value: selectedValue,
        onChange: onSelect,
        onFocus: () => isFocus(true),
        onBlur: () => setIsFocus(false),
        maxHeight: 300,
        search: true,
        searchPlaceholder: "Search...", // Add search placeholder text
        placeholderStyle: styles.placeholderStyle,
        selectedTextStyle: styles.selectedTextStyle,
        inputSearchStyle: styles.inputSearchStyle,
        iconStyle: styles.iconStyle,
        style: [styles.dropdown, isFocus && { borderColor: 'blue' }],
    };

    const defaultRenderSelectedItem = (item, unSelect) => (
        <View style={styles.selectedItemContainer}>
            <Text style={styles.selectedItemText}>{item.label}</Text>
            <TouchableOpacity onPress={() => unSelect(item)} style={styles.deleteButton}>
                <AntDesign name="delete" size={17} color="black" />
            </TouchableOpacity>
        </View>
    );


    return (
        <View style={styles.container}>
            {multiple ? (
                <MultiSelect
                     {...commonProps} 
                     renderSelectedItem={(item, unSelect) => renderSelectedItem ? renderSelectedItem(item, unSelect) : defaultRenderSelectedItem(item, unSelect)}
                     />
            ) : (
                <Dropdown {...commonProps} 
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 25,

    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 10,

    },
    placeholderStyle: {
        fontSize: 16,

    },
    selectedTextStyle: { 
        fontSize: 16,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        
    },
    selectedItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 15,
        marginTop: 10,
        marginRight: 12,
        paddingHorizontal: 10,
        paddingVertical: 8,
        elevation: 2,
        backgroundColor: '#FFBB56',
        shadowColor: '#787878',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        borderColor: 'transparent'
    },
    selectedItemText: {
        fontSize: 16,
    },
    deleteButton: {
        padding: 4,
    },
});

export default CollegeDropdown;
