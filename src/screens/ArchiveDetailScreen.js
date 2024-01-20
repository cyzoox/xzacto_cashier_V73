import React, { useEffect } from "react";
import { Text, StyleSheet, View, TouchableOpacity,FlatList } from "react-native";
import AppHeader from "../components/AppHeader";
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import colors from "../themes/colors";
import { ListItem, Card } from 'react-native-elements'
import { useStore } from "../context/StoreContext";
import formatMoney from 'accounting-js/lib/formatMoney.js'
import moment from 'moment'

const ArchiveDetailsScreen = ({navigation, route}) => {
const { archive_info } = route.params;
const {getTRDetails,trdetails, archive } = useStore();


  const renderItem = ({ item }) => (
    <ListItem bottomDivider>
                <ListItem.Content style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Text>x{item.quantity}</Text>
                    <Text>{item.name}</Text>
                    <Text style={{color: colors.red}}>{formatMoney(item.quantity * item.sprice, { symbol: "₱", precision: 2 })}</Text>
                </ListItem.Content>
            </ListItem>
  )
  const calculateTotal = () => {
    let total = 0;
    archive.forEach(list => {
            total += list.quantity * list.sprice  
    });
   return total;
}

  return (
      <View>
          <AppHeader 
            centerText="Archive List Details"
            leftComponent={
                <TouchableOpacity onPress={()=> navigation.goBack()}>
                  <EvilIcons name={'arrow-left'} size={30} color={colors.white}/>
                </TouchableOpacity>
            } 
           
          />
          <Card containerStyle={{padding: 0}} >
            <View style={{flexDirection:'row', justifyContent:'space-between', padding: 15}}>
              <View>
               
                <Text style={{fontWeight:'bold'}}>Date :{moment.unix(archive_info.timeStamp).format("MMMM DD ,YYYY hh:mm:ss a")}</Text>
                
              </View>
              <View>
              <AntDesign name={'printer'} size={25} color={colors.red}/>
              </View>
            </View>
          
          <ListItem bottomDivider>
                <ListItem.Content style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Text style={{fontWeight:'bold'}}>Qty</Text>
                    <Text style={{fontWeight:'bold'}}>Product</Text>
                    <Text style={{fontWeight:'bold'}}>Total</Text>
                </ListItem.Content>
               
            </ListItem>
            <FlatList
                keyExtractor={(key) => key.name}
                data={archive}
                renderItem={renderItem}
                />
                <ListItem>
                  <ListItem.Content style={{flexDirection:'row', justifyContent:'space-between'}}>
                      <Text style={{fontWeight:'bold'}}>Total</Text>
                      <Text></Text>
                      <Text style={{fontWeight:'bold', color: colors.red}}>{formatMoney(calculateTotal(), { symbol: "₱", precision: 2 })}</Text>
                  </ListItem.Content>
                </ListItem>
            </Card>
      </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30
  }
});

export default ArchiveDetailsScreen;
