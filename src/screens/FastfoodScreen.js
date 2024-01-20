import React, { useEffect, useState, useMemo } from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import Modal from 'react-native-modal';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import AppHeader from "../components/AppHeader";
import List from "../components/List";
import Products from "../components/Products";
import colors from "../themes/colors";
import { Grid, Col, Row } from "react-native-easy-grid";
import Spacer from "../components/Spacer";
import { Button, Avatar } from "react-native-elements";
import SearchBar from "../components/SearchBar";
import Alert from "../components/Alert";
import SubAlert from "../components/SubAlert";
import { Categories } from "../components/Categories";
import Draggable from 'react-native-draggable';
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import moment from 'moment'
import uuid from 'react-native-uuid';
import formatMoney from 'accounting-js/lib/formatMoney.js'
import BarcodeScanner from 'react-native-scan-barcode';
import Camera from 'react-native-camera';
import RNBeep from 'react-native-a-beep';
import AlertwithChild from "../components/AlertwithChild";
import { TextInput } from "react-native-paper";
import Loader from "../components/Loader";
import { RNCamera } from 'react-native-camera';
import app from "../../getRealmApp";

const Fastfood = ({ navigation }) => {
  const customData = app.currentUser.customData;
  const {stores, products, list,store_info, createArchive, archiveInfo, deleteList, updateProductOnClear, editListQty,createList , loading } = useStore();
  const {user} = useAuth();
  const [search, toggleSearch] = useState(false);
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
  const [selected, setSelected] = useState(0)
  const [discount_name, setDiscountName] = useState('');
  const onCancel = () => {
    setVisible(!visible)
  }
 

  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
      return
  })
    const date = moment().unix()

    if(moment().unix() > parseInt(user.customData.privilege_due)){
      setSubsciptionAlert(true)
    }
  });


  const onProceed = () => {
    setVisible(!visible)
    onSaveArchive()
  }

  const calculateTotal = () => {
    let total = 0;
    list.forEach(list => {
            total += list.quantity * list.sprice  
    });
   return total;
  }

const calculateQty = () => {
  let total = 0;
  list.forEach(list => {
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

    createArchive(archive, list)
  }

  const onClear = () => {
    updateProductOnClear(list);
    setClear(false)
  }

  const onCancelClear = () => {
    setClear(false)
  }

  const onCancelAlert = () => {
    alertVisible(false)
  }

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

  const onCancelArchive = () => {
    setNotArchive(false)
  }

  const onCancelCustomDisc = () => {
    setDiscountVisible(false)
  }

  return(
      <View style={{flex: 1, backgroundColor:'white'}}>
        
        <Loader loading={loading}/>
        <Alert visible={alerts} onCancel={onCancelAlert} onProceed={onCancelAlert} title="No Logged In Attendant" content="Please logged in first before you proceed." confirmTitle="OK"/>
        <SubAlert visible={subscription} onCancel={()=> {}} onProceed={()=>{}} title="Extend your subscription" content="Your current subscription has ended. To continue using Xzacto please purchase a new plan or contact system administrator to continue your plan. " />
        <Alert visible={visible} onCancel={onCancel} onProceed={onProceed} title="Archive List?" content="Are you sure you want to archive current list?" confirmTitle="Proceed"/>
        <Alert visible={clear} onCancel={onCancelClear} onProceed={onClear} title="Archive List?" content="Are you sure you want to archive current list?" confirmTitle="Proceed"/>
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
          <AppHeader 
            centerText="Fastfood"
            leftComponent={
                <TouchableOpacity onPress={()=> navigation.openDrawer()}>
                  <EvilIcons name={'navicon'} size={35} color={colors.white}/>
                </TouchableOpacity>
            } 
            rightComponent={
              <View style={{flexDirection:'row'}}>
                <TouchableOpacity onPress={()=> toggleSearch(!search)}>
                  <EvilIcons name={'search'} size={35} color={colors.white}/>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row'}} onPress={()=> navigation.navigate('Archive')}>
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
                </TouchableOpacity>
              </View>
          } 
        />
    { /*   <View style={{backgroundColor: colors.accent}}>
          <Text style={{textAlign:'center', fontSize: 12, color: colors.black}}>Subscription Expiry Date : {moment.unix(customData.privilege_due).format('MMMM DD, YYYY hh:mm:ss A')}</Text>
        </View>*/}
   
        
        <Products search={search} toggleSearch={toggleSearch}/>
        <View style={styles.bottomView}>
          <TouchableOpacity onPress={()=> setModalVisible(true)} style={{backgroundColor: colors.accent,  width: '100%',paddingVertical: 15, flexDirection:'row', justifyContent:'space-between', paddingHorizontal: 10}}>
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
              <TouchableOpacity style={list.length == 0 ? {backgroundColor: colors.charcoalGrey, marginRight: 2, borderRadius: 15, paddingVertical: 10}: {backgroundColor: colors.accent, marginRight: 2, borderRadius: 15, paddingVertical: 10}}  onPress={()=> list.length === 0 ? {} : onClickPay()}>
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
  bottom: 0, //Here is the trick
  borderTopColor: colors.primary,
  borderWidth: 1
},
discountButton: {paddingVertical: 4,paddingHorizontal: 10, borderWidth: 1, borderColor: colors.accent, borderRadius: 10},
discountButton2: {paddingVertical: 4,paddingHorizontal: 10, borderWidth: 1, borderColor: colors.primary, borderRadius: 10, backgroundColor: colors.primary}
});

export default Fastfood;
