import React, {memo, useState} from 'react';
import { TouchableOpacity, ImageBackground,StyleSheet, View, Text, Dimensions, Image, TouchableWithoutFeedback} from 'react-native';
import FastImage from 'react-native-fast-image'
import colors from '../themes/colors';
import moment from 'moment'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import formatMoney from 'accounting-js/lib/formatMoney.js'
import { useStore } from '../context/StoreContext';
import firestore from '@react-native-firebase/firestore';

const ProductCard = ({item, user, store_info}) => {
  const { onSaveList } = useStore();
    const [products_list, setProducts] = useState([])

    const onSaveLists = (items) => {
    
      let list = {
        _partition: `project=${user.id}`,
        _id: items._id,
        name: items.name,
        brand: items.brand,
        oprice: items.oprice,
        sprice: items.sprice,
        unit: items.unit,
        category: items.category,
        store_id: store_info._id,
        store: items.store,
        quantity: 1,
        uid: items.uid,
        timeStamp: moment().unix(),
    }
    onSaveList(list, user, store_info)
  }
        return (
            <TouchableWithoutFeedback onPress={()=> onSaveLists(item)} >
            <View style={styles.itemContainer}>
             <View >
             <FastImage
              style={styles.stretch}
             source={item.img === null || item.img === '' ? require('../../assets/noproduct.png') :{
                 uri:  item.img,
                 headers: { Authorization: 'auth-token' },
                 priority: FastImage.priority.normal,
             }}
             resizeMode={FastImage.resizeMode.stretch}
         />  
        {
         item.stock <= 0 ?
         <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
             <Text style={{color: colors.red, fontWeight:'bold'}}>Out of Stock</Text>
           </View>
          : null}
           
           </View>
               <View>
                 <Text style={{fontSize: 14, color: colors.primary, fontWeight: '500',textAlign:'center'}}>{formatMoney(item.sprice, { symbol: "₱", precision: 2 })}</Text>
                 <Text style={styles.itemName}>{item.name}</Text>
                 <Text style={{color: 'gray',textAlign:'center', fontSize: 13}}>{Math.round(item.stock * 100) / 100} {item.unit}</Text>
               </View>
               {
            products_list.map((items) => {
              
              return( <Text style={{color: colors.red, fontWeight:'bold'}}>{items.quantity}</Text>)
            
            })
           
           }
           </View>
          
       </TouchableWithoutFeedback>
        );
    };
    
 export default memo(ProductCard);

 
const styles = StyleSheet.create({

    itemContainer: {
      flex:1,
      marginTop: 5,
      backgroundColor: colors.white, 
      flexDirection: 'column',
      borderRadius: 15,
      shadowColor: "#EBECF0",
      shadowOffset: {
        width: 0,
        height: 5,
       
      },
      shadowOpacity: 0.89,
      shadowRadius: 2,
      elevation: 5,
   
    },
    itemName: {
      fontSize: 14,
      color: '#000',
      fontWeight: '400',
      textAlign:'center'
    },
    itemCode: {
      fontWeight: '600',
      fontSize: 12,
      color: '#fff',
    },
    stretch: {
      width: windowWidth /3 - 13,
      height: 100,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10
    },
    iconStyle: {
      fontSize: 25,
      alignSelf: 'center',
      marginHorizontal: 15,
  },
  });