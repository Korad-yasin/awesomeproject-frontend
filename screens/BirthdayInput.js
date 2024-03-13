import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";

const BirthdayInput = ({ onDateChange }) => {
  const [date, setDate] = useState("");

  const handleDateChange = (event) => {
    const newDate = event.nativeEvent.text;
    setDate(newDate);
    onDateChange(newDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Birthday</Text>
      <TextInput
        style={styles.input}
        placeholder="MM/DD/YYYY"
        onChange={handleDateChange}
        value={date}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
  },
});

export default BirthdayInput;
