import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import AppHeader from "../components/AppHeader";
import { ListItem, Avatar } from 'react-native-elements';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import colors from "../themes/colors";

const SettingsScreen = ({navigation}) => {
  return (
      <View>
         <AppHeader
            centerText="Settings"
            leftComponent={
                <TouchableOpacity onPress={()=> navigation.goBack()}>
                  <EvilIcons name={'arrow-left'} size={35} color={colors.white}/>
                </TouchableOpacity>
            } 
         />
         <View style={{marginHorizontal: 10}}>
         
        <ListItem bottomDivider containerStyle={styles.list} onPress={() => navigation.navigate('Printer')}>
            <Avatar source={require('../../assets/bluetooth.png')} />
            <ListItem.Content>
            <ListItem.Title>Connect to printer</ListItem.Title>
            <ListItem.Subtitle>Setup printer</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem>
        <ListItem bottomDivider containerStyle={styles.list} onPress={() => navigation.navigate('PrinterSettings')}>
            <Avatar source={require('../../assets/printer.png')} />
            <ListItem.Content>
            <ListItem.Title>Printer Settings</ListItem.Title>
            <ListItem.Subtitle>Header text, font size</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30
  },
  list: {
    margin: 5,
    borderRadius: 15,
    shadowColor: "#EBECF0",
    shadowOffset: {
      width: 0,
      height: 5,
     
    },
    shadowOpacity: 0.89,
    shadowRadius: 2,
    elevation: 3,
  }
});

export default SettingsScreen;
