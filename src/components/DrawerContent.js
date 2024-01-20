import React, { useState } from 'react';
import { View, StyleSheet , Image} from 'react-native';
import {
  DrawerItem,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import colors from '../themes/colors';
import { TouchableOpacity } from 'react-native';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import Alert from './Alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import app from "../../getRealmApp";
import moment from 'moment'
import { StackActions } from '@react-navigation/native';

export function DrawerContent(props) {
console.log(props.initialParams)
 const store_info = props.initialParams;
  const { user, signUp, signIn, signOut, projectData  } = useAuth();
  // const {stores, store_info} = useStore();
  const [alerts, setAlert] = useState(false)
  const [switch_alerts, setSwitchAlert] = useState(false)
  const [switchStore, setSwitchStore] = useState(false)
  const onSwitch = async() => {
    await AsyncStorage.removeItem('@store');
    await AsyncStorage.removeItem('@currency');
    props.navigation.goBack();

  }

  const logout = async() => {
    await AsyncStorage.removeItem('@store');
    await AsyncStorage.removeItem('@currency');
    
    signOut()
    
  }

  const onCancelAlert = () => {
    setAlert(false)
  }

  const onCancelSwitchAlert = () => {
    setSwitchAlert(false)
  }
  return (
    <DrawerContentScrollView {...props}>
       <Alert visible={alerts} onCancel={onCancelAlert} onProceed={logout} title="Log Out?" content="Do you really want to log out?" confirmTitle="Yes"/>
       <Alert visible={switch_alerts} onCancel={onCancelSwitchAlert} onProceed={onSwitch} title="Switch Store?" content="Do you really want to switch store?" confirmTitle="Yes"/>
      <View
        style={
          styles.drawerContent
        }
      >
        <View style={styles.userInfoSection}>
        <View style={{justifyContent:'center', alignItems:'center', marginBottom:20}}>
          <Title style={styles.title}>{store_info.store_info.name}</Title>
          <Title style={styles.branch_title}>{store_info.store_info.branch} Branch</Title>
        </View>
         <View style={{borderTopWidth: 2, borderColor: colors.primary, marginRight: 15, marginBottom: 10}}/>
          <View >
          <TouchableOpacity style={{flex: 1,
                                    justifyContent:'center', 
                                    alignItems:'center', 
                                    flexDirection:'row',
                                    borderRadius: 10,
                                    paddingLeft: 20,
                                    paddingVertical: 5,
                                    marginRight: 20,
                                    }} onPress={()=> props.navigation.navigate('Attendance')}>
                                    <Image source={require('../../assets/cashier.png')} style={{width:45, height:45}}/>
              <View>
              <Caption style={styles.caption}>{store_info.store_info.attendant === "" ? "No Attendant" : store_info.store_info.attendant}</Caption>
              <Text style={{textAlign:'center', fontSize:10, fontStyle:'italic'}}>Tap to Change</Text>
              </View>
           
             
          </TouchableOpacity>
      
          </View>
        </View>
        <Drawer.Section style={styles.drawerSection}>
          
  {/* <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="account-outline"
                color={colors.accent}
                size={size}
                style={{backgroundColor: colors.white, borderRadius: 5}}
               
              />
            
            )}
            onPress={()=> props.navigation.navigate('Customer')}
            label="Customers"
            labelStyle={{color: colors.white, fontSize: 16, fontWeight:'700'}}
            
            style={{backgroundColor: colors.accent}}
          /> */}
         
         <DrawerItem
            icon={({ color, size }) => (
              <Image source={require('../../assets/payment.png')} style={{width:30, height:35}}/>
            )}
          
            labelStyle={{color: colors.statusBarCoverDark, fontSize: 16, fontWeight:'700'}}
            onPress={()=> props.navigation.navigate('Customer')}
            label="Customers"
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Image source={require('../../assets/payment.png')} style={{width:30, height:35}}/>
            )}
            label="Credit Transactions"
            labelStyle={{color: colors.statusBarCoverDark, fontSize: 16, fontWeight:'700'}}
            onPress={() => {props.navigation.navigate('Credits')}}

          />
          <DrawerItem
            icon={({ color, size }) => (
              <Image source={require('../../assets/expenses.png')} style={{width:30, height:30}}/>
            )}
            label="Expenses"
            labelStyle={{color: colors.statusBarCoverDark, fontSize: 16, fontWeight:'700'}}
            onPress={() => {props.navigation.navigate('Expenses')}}
        
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Image source={require('../../assets/fintech.png')} style={{width:30, height:30}}/>
            )}
            label="Transactions"
            labelStyle={{color: colors.statusBarCoverDark, fontSize: 16, fontWeight:'700'}}
            onPress={() => props.navigation.navigate('Transactions')}

          />
            <DrawerItem
            icon={({ color, size }) => (
              <Image source={require('../../assets/fintech.png')} style={{width:30, height:30}}/>
            )}
            label="Delivery Request"
            labelStyle={{color: colors.statusBarCoverDark, fontSize: 16, fontWeight:'700'}}
            onPress={() => props.navigation.navigate('DeliveryRequest')}

          />
             {/* <DrawerItem
            icon={({ color, size }) => (
              <Image source={require('../../assets/sale-report.png')} style={{width:30, height:30}}/>
            )}
            label="Z Read Report"
            labelStyle={{color: colors.statusBarCoverDark, fontSize: 16, fontWeight:'700'}}
            onPress={() => props.navigation.navigate('ZReadReport')}
      
          /> */}
            <DrawerItem
            icon={({ color, size }) => (
              <Image source={require('../../assets/settings.png')} style={{width:30, height:30}}/>
            )}
            label="Settings"
            labelStyle={{color: colors.statusBarCoverDark, fontSize: 16, fontWeight:'700'}}
            onPress={() => props.navigation.navigate('Settings')}
      
          />
          {/*  <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="bookmark-outline"
                color={colors.accent}
                size={size}
                style={{backgroundColor: colors.white, borderRadius: 5}}
              />
            )}
            label="Return"
            onPress={() => props.navigation.navigate('Return')}
            labelStyle={{color: colors.white, fontSize: 16, fontWeight:'700'}}
            style={{backgroundColor: colors.accent}}
          />*/}
         
        </Drawer.Section>
      {/*  <View style={{backgroundColor: colors.accent, paddingVertical: 15, marginHorizontal: 10, borderRadius: 10, flexDirection:'column'}}>
          <Text style={{textAlign:'center'}}>Subscription Expiry Date:</Text>
          <Text style={{textAlign:'center', fontSize: 17, fontWeight:'700'}}>{moment.unix(customData.privilege_due).format('MMMM DD, YYYY hh:mm:ss A')}</Text>
            </View>*/}
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 15,
  },
  title: {
    marginTop: 15,
    fontSize: 30,
    fontWeight: '700',
  },
  branch_title: {

    fontSize: 15,
    fontWeight: '700',
  },
  caption: {
    fontSize: 20,
    marginLeft:10,
    fontWeight:'700',
    textAlign:'center',
    marginTop: 6,
    lineHeight: 20,
    flex:1
  },
  row: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});