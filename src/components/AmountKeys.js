import React,{useState} from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { Col, Grid } from "react-native-easy-grid";

import { FlatGrid } from 'react-native-super-grid';
import formatMoney from 'accounting-js/lib/formatMoney.js'
import colors from '../themes/colors';
import { Card, Overlay, Input, Button } from "react-native-elements";
import { useStore } from "../context/StoreContext";
import Spacer from "./Spacer";
import AlertwithChild from "./AlertwithChild";
import { TextInput } from "react-native-paper";

const AmountKeys = ({cashReceive, Change, discount, setCreditVisible, onSaveTransaction}) => {
  const { 
  products_list } = useStore();
    const [items, setItems] = useState([
        { name: 1000, code: '#1abc9c' },
        { name: 500, code: '#2ecc71' },
        { name: 200, code: '#3498db' },
        { name: 100, code: '#9b59b6' },
        { name: 50, code: '#34495e' },
        { name: 20, code: '#16a085' },
        { name: 10, code: '#27ae60' },
        { name: 5, code: '#2980b9' },
        { name: 'Custom', code: '#8e44ad' },
        { name: 'Clear', code: '#8e44ad' },
      ]);

      const [received, setCash] = useState(0);
      const [custom, setCustom] = useState(false);
      const [custom_cash, setCustomeCash] = useState(0);
      const [visible, setVisible]= useState(false);

      const getCashReceived = (cash)=>{
        let total = 0;
        if(cash === "Clear"){
          setCustomeCash(0)
        }else if(cash === "Custom"){
          setCustom(true)
        }else{
          setCustomeCash(custom_cash + cash)
         
        }
        
        Change(calculateChange())
    }

    const onProceed = () => {
      onSaveTransaction('Cash');
      setCustomeCash(0)
      setVisible(false)
    }

    const calculateTotal = () => {
      let total = 0;
      products_list.forEach(list => {
              total += list.quantity * (list.sprice + list.addon_price)
      });
     return total;
  }

  const calculateChange = () => {
    let total = 0;
    cashReceive(custom_cash)
    total = custom_cash - calculateTotal();
   return total;
}



const onSaveCustomCash = () => {
  getCashReceived("Custom"), 
  setCustom(false)
}

  return(
      <View >
          <AlertwithChild visible={visible} onCancel={()=>setVisible(false)} onProceed={()=> onProceed()} title="Proceed Checkout?"  confirmTitle="CHECKOUT">
        <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                <Text style={{fontSize: 15, marginVertical:10, fontWeight:'700', color: colors.primary}}>RECEIVED:</Text>
                <Text style={{fontSize: 15, marginVertical:10, fontWeight:'700', color: colors.primary}}>{formatMoney(custom_cash, { symbol: "₱", precision: 2 })}</Text>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                <Text style={{fontSize: 15, marginVertical:10, fontWeight:'700', color: colors.primary}}>PAYABLE:</Text>
                <Text style={{fontSize: 15, marginVertical:10, fontWeight:'700', color: colors.primary}}>{formatMoney(calculateTotal()-(calculateTotal()*(discount/100)), { symbol: "₱", precision: 2 })}</Text>
            </View>
        <View style={{flexDirection:'row', justifyContent:'space-evenly', marginVertical:10, borderWidth:1, borderColor: colors.red, padding:5, marginHorizontal:15}}>
                <Text style={{fontSize: 20, color: colors.red, fontWeight:'700'}}>CHANGE:</Text>
                <Text style={{fontSize: 20, color: colors.red, fontWeight:'700'}}>{formatMoney(custom_cash-(calculateTotal()-(calculateTotal()*(discount/100))), { symbol: "₱", precision: 2 })}</Text>
            </View>
        </AlertwithChild>
        <AlertwithChild  visible={custom} onCancel={()=> setCustom(false)}  onProceed={()=> onSaveCustomCash()}   title="Custom Input"  confirmTitle="Save">
       <View style={{padding: 20, borderRadius: 20, justifyContent:'center', alignItems:'center'}}>
       
        <TextInput 
                mode="outlined"
                theme={{colors: {primary: colors.accent, underlineColor: 'transparent'}}}
                value={custom_cash}
                keyboardType="numeric"
                onChangeText={(text)=>setCustomeCash(parseFloat(text))}
                style={{height: 50, width: 180, borderColor: colors.accent}}
              />
       </View>
     
        </AlertwithChild>
      <View style={styles.board}>
        <View style={{flex: 1, flexDirection:'row', justifyContent:'space-around', marginTop: -20, marginBottom:10}}>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 16, fontWeight: '700', color: colors.statusBarCoverDark}}>Cash Received:</Text>
            </View>
            <View>
              <Text style={{textAlign:'center', marginBottom: 10, color: colors.statusBarCoverDark, fontWeight: '700',}}>{formatMoney(custom_cash, { symbol: "₱", precision: 2 })}</Text>
            </View>  
        </View>
       <View style={{flex: 1, flexDirection:'row', justifyContent:'space-around',marginTop:10}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 17, fontWeight: '400', color: colors.red, fontWeight: '700',}}>Change:</Text>
          </View>
          <View>
            {
              custom_cash <= 0 ? 
              <Text style={{textAlign:'center', marginBottom: 10, color: colors.red, fontWeight: '700',fontSize: 17, }}>{formatMoney(0, { symbol: "₱", precision: 2 })}</Text>
              :
              <Text style={{textAlign:'center', marginBottom: 10, color: colors.red, fontWeight: '700',fontSize: 17, }}>{formatMoney(calculateChange()+(calculateTotal()*(discount/100)), { symbol: "₱", precision: 2 })}</Text>
            }
            
          </View>   
       </View>
       
    </View>
      <FlatGrid
      itemDimension={70}
      showsVerticalScrollIndicator={false}
      data={items}
      // staticDimension={300}
      // fixed
      spacing={5}
      renderItem={({ item }) => (
        <TouchableOpacity  style={[styles.itemContainer, { backgroundColor: colors.white }]} onPress={()=> getCashReceived(item.name)}>
          <Text style={styles.itemName}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />

<Spacer>
            <View style={{flexDirection:'row', justifyContent:'space-evenly', marginBottom: 20}}>
              {
                custom_cash < calculateTotal() ?
                <Button titleStyle={{color: colors.coverDark}} buttonStyle={{paddingVertical: 15, paddingHorizontal: 20,borderColor: colors.coverDark, borderWidth: 1, borderRadius:10}} type="outline"  title="Pay using Cash"  onPress={()=>{}}/>:
                <Button titleStyle={{color: colors.primary}} buttonStyle={{paddingVertical: 15, paddingHorizontal: 20,borderColor: colors.accent, borderWidth: 1, borderRadius:10}} type="outline"  title="Pay using Cash" onPress={()=> setVisible(true)}/>
              }
     
          
                <Button titleStyle={{color: colors.primary}} buttonStyle={{paddingVertical: 15, paddingHorizontal: 20,borderColor: colors.accent, borderWidth: 1, borderRadius:10}} type="outline"  title="EPay / Card" onPress={()=>{}}/>
          
            </View>
          </Spacer>
     

      </View>

  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems:'center',
    borderRadius: 5,
    padding: 5,
    height: 40,
    shadowColor: "#EBECF0",
shadowOffset: {
	width: 1,
	height: 1,
},
shadowOpacity: 0.10,
shadowRadius: 5,
elevation: 2,
  },
  itemName : {
    color: colors.statusBarCoverDark,
    fontSize: 15,
    fontWeight:'700'
  },
  board: {
    paddingVertical:25,
    backgroundColor:colors.white, 
    flex: 1, 
    alignItems: 'flex-start', 
   
    marginBottom: 16,
    justifyContent:'center', 
    paddingHorizontal: 10,
 
  }
});

export default AmountKeys;
