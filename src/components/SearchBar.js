import React from "react";
import { Text, StyleSheet, View, TextInput } from "react-native";
import Feather from 'react-native-vector-icons/Feather'

const SearchBar = ({term , onTermChange, onTermSubmit, children}) => {
  return (
      <View style={styles.backgroundStyle}>
          <Feather name="search" style={styles.iconStyle}/>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.inputStyle}
            placeholder="Search"
            value={term}
            onChangeText={onTermChange}
  
          />
          {children}
      </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30
  },
  backgroundStyle: {
      backgroundColor: '#dddddd',
      height: 45,
      borderRadius: 20,
      marginHorizontal: 15,
      flexDirection: 'row',
      marginTop: 10,
      marginBottom: 10
  },
  inputStyle: {
      flex: 1,
      fontSize: 18
  },
  iconStyle: {
      fontSize: 25,
      alignSelf: 'center',
      marginHorizontal: 15
  }
});

export default SearchBar;
