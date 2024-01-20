import React, { useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity,FlatList , Image} from "react-native";
import AppHeader from "../components/AppHeader";
import { Segment,Card as ModalCard, CardItem,Button } from "native-base";
import colors from "../themes/colors";
import Ionicons from 'react-native-vector-icons/Ionicons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { useStore } from "../context/StoreContext";
import { ListItem, Avatar, Overlay , Button as OButton, Card} from 'react-native-elements'
import formatMoney from 'accounting-js/lib/formatMoney.js'

const ReturnScreen = () => {
  const {bos,returns} = useStore();
  const [selected , setSelected] = useState('BO');
  const [visible, setVisible] = useState(false);
  const [item , setItem] = useState([]);


   const toggleOverlay = (item) => {
    setVisible(!visible);
    setItem(item)
  };

  const keyExtractor = (item, index) => index.toString()

  const renderItem = ({ item }) => (
   <ListItem bottomDivider onPress={()=> toggleOverlay(item)}>
       <Avatar size="medium" title="B" source={'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg' && { uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg' }}/>
       <ListItem.Content>
       <ListItem.Title>Item : {item.product_name}</ListItem.Title>
       <ListItem.Subtitle>Date: {item.date}</ListItem.Subtitle>
       <ListItem.Subtitle>Amount: {formatMoney(item.total, { symbol: "₱", precision: 2 })}</ListItem.Subtitle>
       </ListItem.Content>
       <ListItem.Chevron />
   </ListItem>
   )

   

  return(
      <View style={{flex:1}}>
          <AppHeader
          leftComponent={
            <TouchableOpacity onPress={()=> navigation.goBack()}>
              <EvilIcons name={'arrow-left'} size={30} color={colors.white}/>
            </TouchableOpacity>
        } 
            centerText="Return Items"
            rightComponent={
              selected === "BO" ? 
                <TouchableOpacity onPress={()=> {}}>
                  <Ionicons name={'filter-outline'} size={26} color={colors.white}/>
                </TouchableOpacity> : 
                 <TouchableOpacity onPress={()=> {}}>
                 <EvilIcons name={'plus'} size={30} color={colors.white}/>
               </TouchableOpacity>
            }
          />
               <Segment style={{backgroundColor:'white'}}>
              <Button bordered first 
                style={selected == 'BO' ? {borderColor:colors.primary, paddingHorizontal: 30, backgroundColor:colors.primary, colors:colors.white, paddingVertical:10, borderBottomLeftRadius:5, borderTopLeftRadius:5}:
                        {borderColor:colors.primary, paddingHorizontal: 30, paddingVertical:10,borderBottomLeftRadius:5, borderTopLeftRadius:5} } onPress={()=> setSelected('BO')}>
                  {
                      selected == 'BO' ? 
                      <Text white bold>BOs</Text>:
                      <Text  bold>BOs</Text>
                  }
                  
            </Button>
              <Button bordered last  
                    style={selected == 'Returned' ? {borderColor:colors.primary, paddingHorizontal: 30, backgroundColor:colors.primary, paddingVertical:20, borderTopRightRadius:5, borderBottomRightRadius:5}:
                    {borderColor:colors.primary, paddingHorizontal: 30,  borderTopRightRadius:5, borderBottomRightRadius:5} } onPress={()=>  setSelected('Returned')}>
              {
                      selected == 'Returned' ? 
                      <Text white bold style={{paddingVertical: 20}}>Returned</Text>:
                      <Text  bold >Returned</Text>
                  }
                  
            </Button>
            </Segment>
            {
              selected === "BO" ?
              <FlatList
              keyExtractor={keyExtractor}
              data={bos}
              style={{marginTop: 10, marginHorizontal: 10, borderRadius:5}}
              renderItem={renderItem}
              />
              :
              <FlatList
              keyExtractor={keyExtractor}
              data={returns}
              style={{marginTop: 10, marginHorizontal: 10, borderRadius:5}}
              renderItem={renderItem}
              />

            }
           
            <Overlay isVisible={visible} onBackdropPress={()=> toggleOverlay([])}>
            
            <Card containerStyle={{padding: 0, borderWidth: 0, margin:0, elevation:0}} wrapperStyle={{paddingHorizontal: 30, paddingVertical: 23}}>
            <TouchableOpacity style={{position:'absolute', right:5, top: 5}} onPress={()=> toggleOverlay([])}>

                 <EvilIcons name={'close-o'} size={30} color={colors.red}/>
               </TouchableOpacity>
                <Card.Title>{selected === "BO" ? 'BO Details' : 'Returned Item Details'}</Card.Title>
                <Card.Divider/>
                    <View  style={styles.item}>
                      <Text>Item :</Text>
                      <Text style={styles.name}>{item.product_name}</Text>
                    </View>
                    <View  style={styles.item}>
                    <Text>Date :</Text>
                      <Text style={styles.name}>{item.date}</Text>
                    </View>
                    <View  style={styles.item}>
                    <Text>Quantity :</Text>
                      <Text style={styles.name}>{item.quantity}</Text>
                    </View>
                    <View  style={styles.item}>
                    <Text>Amount :</Text>
                      <Text style={styles.name}>{item.total}</Text>
                    </View>
                    <View  style={styles.item}>
                    <Text>Attendant :</Text>
                      <Text style={styles.name}>{item.attendant_name}</Text>
                    </View>
              </Card>
            </Overlay>
      </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30
  },
  item: {
    flexDirection: 'row',
    justifyContent:'space-between'
  }
});

export default ReturnScreen;
