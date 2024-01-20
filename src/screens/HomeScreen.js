import React, { useEffect, useState, useMemo } from "react";
import { Text, StyleSheet, View, TouchableOpacity,BackHandler, Alert as Alerts } from "react-native";
import Modal from 'react-native-modal';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AppHeader from "../components/AppHeader";
import List from "../components/List";
import Products from "../components/Products";
import colors from "../themes/colors";
import Spacer from "../components/Spacer";
import { Button, Avatar } from "react-native-elements";
import Alert from "../components/Alert";
import SubAlert from "../components/SubAlert";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import moment from 'moment'
import uuid from 'react-native-uuid';
import formatMoney from 'accounting-js/lib/formatMoney.js'
import BarcodeScanner from 'react-native-scan-barcode';
import RNBeep from 'react-native-a-beep';
import AlertwithChild from "../components/AlertwithChild";
import { TextInput } from "react-native-paper";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation, route }) => {
  const store_info = route.params.store_info;
  const {stores, products, createArchive, archiveInfo, deleteList, updateProductOnClear, editListQty,createList , loading, products_list } = useStore();
  const {user} = useAuth();
  const [search, toggleSearch] = useState(false);
  const [scan, toggleBcode] = useState(false);
  const [term, setTerm] = useState('');
  const [visible, setVisible] = useState(false)
  const [clear, setClear] = useState(false)
  const [notArchive, setNotArchive] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [alerts, alertVisible] = useState(false)
  const [subscription, setSubsciptionAlert] = useState(false)
  const [scanner, setScanner] = useState(false)
  const [discountVisible, setDiscountVisible] = useState(false)
  const [cameraType, setCameraType] = useState('back')
  const [torchMode, setTorchMode] = useState('off')
  const [switchStore, setSwitchStore] = useState(false)
  const [selected, setSelected] = useState(0)

 
  const [discount_name, setDiscountName] = useState('');
  const onCancel = () => {
    setVisible(!visible)
  }
  console.log('store info:', stores)

  const selectStoreStaff = () => {
    let store = []
    stores.forEach(item => {
      if(item._id === store_info._id){
       store = store.concat(item)
      }
    });
    return store;
  }

  const onSwitchStore = async() => {
    await AsyncStorage.removeItem('@store');
    await AsyncStorage.removeItem('@currency');

    navigation.goBack();
  }

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        Alerts.alert('Hold on!', 'Are you sure you want to go back?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'Switch Store?',
            onPress: () => onSwitchStore(),
    
          },
          {text: 'Exit App?', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      };
    
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
    
      return () => backHandler.remove();
    }, [])
  );
 




  const onClickPay = () => {

    if(stores[0].attendant === ""){
      alertVisible(true);
      return;
  }
    setModalVisible(false)
    navigation.navigate('Checkout')
  }

  const onClickArchive = () => {
    if(archiveInfo.length == 0){
      setVisible(true)
    }else{
      setNotArchive(true)
    }
  }

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
  
    createList(list, items)
    RNBeep.beep()
    return;
  }
 

  }

  const onProceed = () => {
    setVisible(!visible)
    onSaveArchive()
  }

  const calculateTotal = () => {
    let total = 0;
    products_list.forEach(list => {
            total += list.quantity * (list.sprice  + list.addon_price)
    });
   return total;
  }

const calculateQty = () => {
  let total = 0;
  products_list.forEach(list => {
          total += list.quantity  
  });
 return total;
}

 
const onSaveArchive = () => {
  const date = moment().unix()
  let archive = {
    partition: `project=${user.id}`,
    date: moment.unix(date).format('MMMM DD, YYYY'),
    id: uuid.v4(),
    store_name: store_info.name,
    store_id:store_info._id,
    total: calculateTotal(),
    timeStamp: moment().unix(),
  }

  createArchive(archive, products_list)
}

const onClear = () => {
  updateProductOnClear(products_list);
  setClear(false)
}

const onCancelClear = () => {
  setClear(false)
}





const onCancelArchive = () => {
  setNotArchive(false)
}

const onCancelCustomDisc = () => {
  setDiscountVisible(false)
}



  return(
      <View style={{flex: 1, backgroundColor:'white'}}>
        
     
        <Alert visible={alerts} onCancel={()=> alertVisible(false)} onProceed={()=> alertVisible(false)} title="No attendant" content="Please login first." confirmTitle="OK"/>
        <Alert visible={visible} onCancel={onCancel} onProceed={onProceed} title="Archive List?" content="Are you sure you want to archive current list?" confirmTitle="Proceed"/>
        <Alert visible={clear} onCancel={onCancelClear} onProceed={onClear} title="Clear List?" content="Are you sure you want to clear current list?" confirmTitle="Proceed"/>
        <Alert visible={notArchive} onCancel={onCancelArchive} onProceed={onCancelArchive} title="Existing Archive List!" content="There is an existing archive list, please delete the existing achive first before you proceed." confirmTitle="OK"/>
        <AlertwithChild visible={discountVisible} onCancel={onCancelCustomDisc} onProceed={onCancelCustomDisc} title="Choose Discount"  confirmTitle="S A V E">
        <View style={{flexDirection:'row',justifyContent:'space-evenly', marginVertical: 2, alignItems:'center'}}>
          <Text style={{textAlign:'center', fontSize: 14, fontWeight: '700'}}>Discount Name : </Text>
            <View style={{flexDirection:'row', marginVertical: 2, alignItems:'center'}}>
           
              <TextInput 
                mode="outlined"
                theme={{colors: {primary: colors.accent, underlineColor: 'transparent'}}}
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
            <TouchableOpacity onPress={()=> setSelected(20)} style={ selected === 20 ? styles.discountButton2 : styles.discountButton}>
              <Text style={ selected === 20 ?{color: colors.white}:{color: colors.black}}>20%</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> setSelected(50)} style={ selected === 50 ? styles.discountButton2 : styles.discountButton}>
              <Text style={ selected === 50 ?{color: colors.white}:{color: colors.black}}>50%</Text>
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
        <SubAlert visible={subscription} onCancel={()=> {}} onProceed={()=>{}} title="Extend your subscription" content="Your current subscription has ended. To continue using Xzacto please purchase a new plan or contact system administrator to continue your plan. " />
          <AppHeader 
            centerText={`${store_info.name}`}
            leftComponent={
                <TouchableOpacity onPress={()=> navigation.openDrawer()}>
                  <EvilIcons name={'navicon'} size={35} color={colors.white}/>
                </TouchableOpacity>
            } 
            rightComponent={
              <View style={{flexDirection:'row'}}>
                  <TouchableOpacity onPress={()=> navigation.navigate('BarcodePage',{store_info: store_info})}> 
                  <Ionicons name={'barcode-outline'} size={33} color={colors.white}/>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft: 15}} onPress={()=> toggleSearch(!search)}>
                  <Ionicons name={'search-outline'} size={33} color={colors.white}/>
                </TouchableOpacity>
                {/* <TouchableOpacity style={{flexDirection:'row'}} onPress={()=> navigation.navigate('Archive')}>
                 { archiveInfo.length != 0 ? 
                 <Avatar
                       size={20}
                      rounded
                      containerStyle={{position:'absolute', top: -2, right: -3, zIndex: 1,backgroundColor:colors.white}}
                      titleStyle={{color: colors.red, fontWeight:'700'}}
                      title={archiveInfo.length}
                      onPress={() => navigation.navigate('Archive')}
                      activeOpacity={0.7}
                    /> : null
                    }
                  <EvilIcons name={'archive'} size={35} color={colors.white}/>
                </TouchableOpacity> */}
              </View>
          } 
        />
    { /*   <View style={{backgroundColor: colors.accent}}>
          <Text style={{textAlign:'center', fontSize: 12, color: colors.black}}>Subscription Expiry Date : {moment.unix(customData.privilege_due).format('MMMM DD, YYYY hh:mm:ss A')}</Text>
        </View>*/}
      
      {
        scanner &&
    
    
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

      }
        
        <Products search={search} toggleSearch={toggleSearch} store_info={store_info} scan={scan} toggleBarcode={toggleBcode} />
        <View style={styles.bottomView}>
          <TouchableOpacity onPress={()=> setModalVisible(true)} style={styles.checkoutBtn}>
           <Text style={{fontSize: 18, fontWeight: '700', color: colors.white}}> Subtotal  {formatMoney(calculateTotal(), { symbol: "₱", precision: 2 })}</Text>
           <Text style={{fontSize: 18, fontWeight: '700', color: colors.white}}> Qty  {formatMoney(calculateQty(), { symbol: "", precision: 2 })}</Text>
          </TouchableOpacity>
        </View>
        <Modal 
        animationIn='slideInUp'
        animationInTiming={800}
        animationOutTiming={500}
        useNativeDriver={true} 
       
        onBackButtonPress={()=> setModalVisible(false)}
        onBackdropPress={()=> setModalVisible(false)}
        backdropOpacity={0.10}
        isVisible={modalVisible}

                     style={styles.modalView}
              > 
          <View style={styles.containerStyle}>
            <View style={styles.content}>
            <List  navigation={navigation} toggleScanner={setScanner} clearAll={setClear} archive={onClickArchive} discount_visible={setDiscountVisible} discount={selected} discount_name={discount_name}/>
              <Spacer>
          <View style={{flexDirection: 'row', justifyContent:'space-between', backgroundColor: 'white'}}>
           
            <View style={{flex: 1, marginLeft: 2}}>
              <TouchableOpacity style={products_list.length == 0 ? {backgroundColor: colors.charcoalGrey, marginRight: 2, borderRadius: 15, paddingVertical: 10}: {backgroundColor: colors.accent, marginRight: 2, borderRadius: 15, paddingVertical: 10}}  onPress={()=> products_list.length === 0 ? {} : onClickPay()}>
                <Text style={{textAlign:'center'}}>P A Y</Text>
              </TouchableOpacity>
            </View>
            
              </View>
            </Spacer>
            </View>
        </View>
           
        </Modal>
      </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30
  },
  iconStyle: {
    fontSize: 25,
    alignSelf: 'center',
    marginHorizontal: 15,
},
container: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
},
modalView: {
  margin: 0,
  justifyContent: 'flex-end'
},
containerStyle: {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-around',
   alignItems: 'flex-end'
},
content: {
  width: '100%',
  height: '50%',
  backgroundColor: 'white',
  overflow: 'hidden',
},
bottomView: {
  flex: 1,
  width: '100%',
  height: 50,
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute', //Here is the trick
  bottom: 20, //Here is the trick
  borderRadius:20
},
checkoutBtn: {  backgroundColor: colors.accent,  
                width: '80%',
                paddingVertical: 15, 
                flexDirection:'row', 
                justifyContent:'space-between', 
                paddingHorizontal: 10, 
                borderRadius: 30,
                shadowColor: "#EBECF0",
                shadowOffset: {
                  width: 0,
                  height: 5,
                 
                },
                shadowOpacity: 0.89,
                shadowRadius: 2,
                elevation: 1,
              },
discountButton: {paddingVertical: 4,paddingHorizontal: 10, borderWidth: 1, borderColor: colors.accent, borderRadius: 10},
discountButton2: {paddingVertical: 4,paddingHorizontal: 10, borderWidth: 1, borderColor: colors.primary, borderRadius: 10, backgroundColor: colors.primary}
});

export default HomeScreen;
