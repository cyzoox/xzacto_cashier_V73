import React, { useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { Col, Grid, Row } from "react-native-easy-grid";
import { Button, Card , Slider,Overlay,Icon } from "react-native-elements";
import AmountKeys from "../components/AmountKeys";
import Alert from "../components/Alert";
import AppHeader from "../components/AppHeader";
import List from "../components/List";
import Spacer from "../components/Spacer";
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import colors from "../themes/colors";
import CustomerScreen from "./CustomerScreen";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import moment from 'moment'
import uuid from 'react-native-uuid';
import AlertwithChild from "../components/AlertwithChild";
import { TextInput, Checkbox } from "react-native-paper";
import BarcodeScanner from 'react-native-scan-barcode';
import Camera from 'react-native-camera';
import RNBeep from 'react-native-a-beep';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import formatMoney from 'accounting-js/lib/formatMoney.js'
const CheckoutScreen = ({ navigation, route }) => {
  const store_info = route.params.store_info;

  const { user } = useAuth();
  const { 
    stores,
    products,
    createList,
    createTransaction,
    createCreditLogs,
    products_list,

  } = useStore();
    
  const selectStoreStaff = () => {
    let store = []
    stores.forEach(item => {
      if(item._id === store_info._id){
       store = store.concat(item)
      }
    });
    return store;
  }


  
  const [id, setCusId]= useState('');
  const [name, setCusName]= useState('');
  
  const [creditVisible, setCreditVisible]= useState(false);
  const [alerts, setAlert]= useState(false);
  const [nocustomer, AlertNoCustomer]= useState(false);
  const [received, setReceive]= useState(0);
  const [change, setChange]= useState(0);
  const [discounts, setDiscount] = useState(0)
  const [value, setValue] = useState(0);
  const [vertValue, setVertValue] = useState(0);
  const [custom_discount, setCustomDiscount] = useState(false);
  const [discountVisible, setDiscountVisible] = useState(false)
  const [selected, setSelected] = useState(0)
  const [scanner, setScanner] = useState(false)
  const [cameraType, setCameraType] = useState('back')
  const [torchMode, setTorchMode] = useState('off')
  const [discount_name, setDiscountName] = useState('');
  const [autoPrint, setAutoPrint] = useState(false);
  const [checked, setChecked] = useState(false);
  const [custom_customer, setCustomCustomer] = useState('')

  const barcodeReceived = (e) => {

    const items = products.find(o => o.sku === e.data);
    if(items){
      let list = {
        partition: `project=${user.id}`,
        id: items._id,
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
    
      createList(products_list, items)
      RNBeep.beep()
      return;
    }
   
  
    }

  const onSetDiscount = (discount) => {
    if(discount === 'custom'){
      setCustomDiscount(true)
    }else{
      setDiscount(discount)
    }
  }

  const onSaveCustomDiscount = () => {
    setDiscount(value/100)
    setCustomDiscount(false)
  }

  const customer = (item) => {

    setCusId(item._id)
    setCusName(item.name)
  }

  const calculateTotal = () => {
    let total = 0;
    products_list.forEach(list => {
            total += list.quantity *( list.sprice + list.addon_price)
    });
   return total;
}

const calculateTotalItems = () => {
  let total = 0;
  products_list.forEach(list => {
          total += list.quantity;
  });
 return total;
}
const calculateTotalProfit = () => {
  let total = 0;
  products_list.forEach(list => {
          total += (list.sprice-list.oprice)*list.quantity;
  });
 return total;
}

    const onSaveCreditTransaction = () => {
      if(store_info.attendant === ""){
        setAlert(true);
        return;
      }
    
      const date = moment().unix()
        let details = {
          id : uuid.v4(),
          partition:  `project=${user.id}`,
          store_name : store_info.name,
          store_id : store_info._id,
          date: moment.unix(date).format('MMMM DD, YYYY'),
          timeStamp: moment().unix(),
          customer_name: name.length === 0 ? custom_customer : name,
          customer_id: id,
          total: calculateTotal()-(calculateTotal()*(selected/100)),
          year :moment.unix(date).format('YYYY'),
          year_month :moment.unix(date).format('MMMM-YYYY'),
          year_week :moment.unix(date).format('WW-YYYY'),
          attendant_name: selectStoreStaff()[0].attendant,
          attendant_id: selectStoreStaff()[0].attendant_id,
          

        }
        createCreditLogs(products_list, details)
        onSaveTransaction('Credit');
        setCustomCustomer('')
    }
 

  const onSaveTransaction = (pm) => {
  
    const date = moment().unix()
    let transaction = {
      store_name : store_info.name,
      store_id : store_info._id,
      partition: `project=${user.id}`,
      date: moment.unix(date).format('MMMM DD, YYYY'),
      timeStamp: moment().unix(),
      customer_name: name.length === 0 ? custom_customer : name,
      customer_id: id,
      total:calculateTotal()-(calculateTotal()*(selected/100)),
      id: uuid.v4(),
      year :moment.unix(date).format('YYYY'),
      year_month :moment.unix(date).format('MMMM-YYYY'),
      year_week :moment.unix(date).format('WW-YYYY'),
      attendant_name: selectStoreStaff()[0].attendant,
      attendant_id: selectStoreStaff()[0].attendant_id,
      payment_method: pm,
      status: 'Completed',
      total_items: calculateTotalItems(),
      discount: calculateTotal()*(selected/100),
      discount_name: discount_name,
      vat: 12,
      profit: calculateTotalProfit(),
      received: received,
      change:change,
      void_reason: ''
    }


    createTransaction(products_list,transaction)

    setDiscount(0)

    setSelected(0)
    setCusId('')
    setCusName('')
    setCustomCustomer('')
    navigation.goBack();
  } 

  const onCancel = () => {
    setVisible(false)
  }

  const onCancelCredit = () => {
    setCreditVisible(false)
  }
  const onCancelAlert = () => {
    setAlert(false)
  }

  const onCancelNoCus = () => {
    AlertNoCustomer(false)
  }

  const onProceedNoCus = () => {
    AlertNoCustomer(false)
  }

  

  const onProceedCredit = () => {
    setCreditVisible(false)
    if(!name){
      AlertNoCustomer(true);
      return;
    }
    onSaveCreditTransaction();
   
  }

  const onCancelCustomDisc = () => {
    setDiscountVisible(false)
    setSelected(0)
  }


  return (
      <View style={{flex: 1}}>
         <Alert visible={nocustomer} onCancel={onCancelNoCus} onProceed={onProceedNoCus} title="No selected customer" content="For Credit transactions you need to select customer." confirmTitle="OK"/>
         <Alert visible={creditVisible} onCancel={onCancelCredit} onProceed={onProceedCredit} title="Proceed credit payment?" content="Are you sure you want to proceed with credit payment?" confirmTitle="Proceed"/>
         <Alert visible={alerts} onCancel={onCancelAlert} onProceed={onCancelAlert} title="Insufficient Payment" content="Cash receive is lesser than the total amount." confirmTitle="OK"/>
         <AlertwithChild visible={discountVisible} onCancel={onCancelCustomDisc} onProceed={()=> setDiscountVisible(false)} title="Choose Discount"  confirmTitle="S A V E">
         <View style={{flexDirection:'row',justifyContent:'space-evenly', marginVertical: 2, alignItems:'center'}}>
          <Text style={{textAlign:'center', fontSize: 14, fontWeight: '700'}}>Discount Name : </Text>
            <View style={{flexDirection:'row', marginVertical: 2, alignItems:'center'}}>
           
              <TextInput 
                mode="outlined"
                theme={{colors: {primary: colors.accent, underlineColor: 'transparent'}}}
                value={discount_name}
                onChangeText={(text)=> setDiscountName(text)}
                style={{height: 25, width: 100, borderColor: colors.accent}}
              />
                       <Text style={{textAlign:'center', fontSize: 18, fontWeight: '700'}}></Text>
            </View>
            
   
          </View>
          <View style={{flexDirection:'row', justifyContent:'space-evenly', marginVertical: 10}}>
            <TouchableOpacity onPress={()=> setSelected(5)} style={ selected === 5 ? styles.discountButton2 : styles.discountButton}>
              <Text  style={ selected === 5 ?{color: colors.white}:{color: colors.black}}> 5% </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> setSelected(10)} style={ selected === 10 ? styles.discountButton2 : styles.discountButton}>
              <Text style={ selected === 10 ?{color: colors.white}:{color: colors.black}}>10%</Text>
            </TouchableOpacity>
        
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-evenly', marginVertical: 2, alignItems:'center'}}>
          <Text style={{textAlign:'center', fontSize: 16, fontWeight: '700'}}>Custom : </Text>
            <View style={{flexDirection:'row', marginVertical: 2, alignItems:'center'}}>
           
              <TextInput 
                mode="outlined"
                theme={{colors: {primary: colors.accent, underlineColor: 'transparent'}}}
                onChangeText={(text)=> setSelected(parseFloat(text))}
                style={{height: 25, width: 60, borderColor: colors.accent}}
              />
                       <Text style={{textAlign:'center', fontSize: 18, fontWeight: '700'}}>%</Text>
            </View>
            
   
          </View>
        </AlertwithChild>
        <AlertwithChild visible={autoPrint} onCancel={()=>setAutoPrint(false)} onProceed={()=>setAutoPrint(false)} title="Set Auto Printing"  confirmTitle="S A V E">
           
            
          <View style={{flexDirection:"row", justifyContent:'center', alignItems:"center"}}>
            <Text>Enable Auto Printing</Text>
          <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => {
                setChecked(!checked);
              }}
            />
          </View>
        </AlertwithChild>
      
          <AppHeader
            centerText="Checkout"
            leftComponent={
              <TouchableOpacity onPress={()=>{setDiscount(0), navigation.goBack()}}>
                <EvilIcons name={'arrow-left'} size={35} color={colors.white}/>
              </TouchableOpacity>
          } 
          rightComponent={
           <CustomerScreen selectedCustomer={customer}/>
        } 
          />
          {
            name ?
            <Card containerStyle={{marginTop:0, marginLeft: 2, marginRight: 2, marginBottom: 2, paddingTop:5, paddingBottom: 5, backgroundColor: colors.statusBarCoverDark, justifyContent:'space-between'}}>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{color:colors.accent, fontSize: 17, fontWeight: '700'}}>Customer:</Text>
                <Text style={{color:colors.accent, fontSize: 17, fontWeight: '700'}}>{name}</Text>
                <TouchableOpacity onPress={()=> {setCusId('',setCusName(''))}}>
                <EvilIcons name={'close-o'} size={25} color={colors.white} style={{fontWeight:'700'}}/>
                </TouchableOpacity>
              </View>
            </Card> : 
            
            <View>
               <TextInput 
              mode="outlined"
              label="Customer name"
              value={custom_customer}
              onChangeText={(text)=> setCustomCustomer(text)}
             
              style={{ textAlign:'center',borderRadius: 10,  height: 30, margin:5}}
              theme={{colors: {primary: colors.accent, underlineColor: 'transparent'}}}
            />
            </View>
          }
         
          {
        scanner ?
        <Grid>
        <Row >
        <BarcodeScanner
        onBarCodeRead={barcodeReceived}
        style={{ flex: 1 }}
        torchMode={torchMode}
        cameraType={cameraType}
        viewFinderHeight={100}
        viewFinderWidth={250}
        viewFinderBorderColor={colors.statusBarCoverLight}
      >
        <View style={{flexDirection:'row', justifyContent:'space-between', marginTop:10, marginHorizontal: 10}}>
          <TouchableOpacity onPress={()=> torchMode === 'off' ? setTorchMode('on'): setTorchMode('off')}>
          <FontAwesome name={'flash'} size={25} color={colors.white}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> scanner ? setScanner(false): setScanner(true)}>
          <FontAwesome name={'close'} size={25} color={colors.white}/>
          </TouchableOpacity>
     
        </View>
       
      </BarcodeScanner>
      </Row>
      <Row size={1.5}>
        <List  toggleScanner={setScanner} screen={route.name} discount_visible={setDiscountVisible} discount={selected} autoPrint_visible={setAutoPrint}/>
      </Row>
      </Grid> :
       <Grid>
                  <Row size={1.5}>
                 <List  toggleScanner={setScanner} screen={route.name} discount_visible={setDiscountVisible} discount={selected} autoPrint_visible={setAutoPrint}/>
              </Row>
              <Row >
                <AmountKeys  cashReceive={setReceive} Change={setChange} discount={selected}  setCreditVisible={setCreditVisible} onSaveTransaction={onSaveTransaction}/>
              </Row>
          </Grid>
      }
     
     
      
      </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30
  },
  discountButton: {paddingVertical: 4,paddingHorizontal: 20, borderWidth: 1, borderColor: colors.accent, borderRadius: 10},
discountButton2: {paddingVertical: 4,paddingHorizontal: 20, borderWidth: 1, borderColor: colors.primary, borderRadius: 10, backgroundColor: colors.primary}
});

export default CheckoutScreen;
