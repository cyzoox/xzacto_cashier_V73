import React, { useEffect, useState, useCallback } from "react";
import { Text, StyleSheet, View, TouchableOpacity, FlatList, TouchableWithoutFeedback , Dimensions, RefreshControl, Alert as Alerts, BackHandler,TouchableHighlight} from "react-native";
import AppHeader from "../components/AppHeader";
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import colors from "../themes/colors";
import { useStore } from "../context/StoreContext";
import { ListItem, Avatar, Overlay } from "react-native-elements";
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { useAuth } from "../context/AuthContext";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import CurrencyPicker from "react-native-currency-picker"
import Alert from "../components/Alert";
import Loader from "../components/Loader";
import { FlatGrid } from 'react-native-super-grid';
import Feather from 'react-native-vector-icons/Feather'
import FastImage from 'react-native-fast-image'

const windowWidth = Dimensions.get('window').width;
const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}


const StoreLogin = ({navigation}) => {
  
let currencyPickerRef = undefined;

  const {user} = useAuth();
    const {stores, getCustomStore} = useStore();
    const [selectedLanguage, setSelectedLanguage] = useState();
    const [visible, setVisible] = useState(false);
    const [code, setCode] = useState('');
    const [info, setInfo] = useState([]);
    const [error, setError] = useState('');
    const [currency, setCurrency] = useState(null);
    const [alert, setAlert] = useState(false);
    const [text, setText] = useState('');
    const hasUnsavedChanges = Boolean(text);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
      setRefreshing(true);
      getCustomStore()
      wait(2000).then(() => setRefreshing(false));
    }, []);

    const [demo, setDemo] = useState([]);

    const readItemFromStorage = async () => {
        const item =  await AsyncStorage.getItem('@store')
       
        if(item != null){
       
            navigation.navigate("Storeboard", {
              name: "My Project",
              projectPartition: `project=${user.id}` ,
              store_info : JSON.parse(item),
          
            });
        
          }
      };

      useFocusEffect(
        React.useCallback(() => {
          readItemFromStorage();
          const backAction = () => {
            Alerts.alert('Hold on!', 'Are you sure you want to go back?', [
              {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
              },
              {
                text: 'Logout',
                onPress: () =>{ navigation.goBack(),  user.logOut();},
  
              },
              {text: 'Exit App', onPress: () => BackHandler.exitApp()},
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


    const onClickStore = (item) => {
        setVisible(true)
        setInfo(item)
    }



    const onCheckPassword = async() => {
      
        if(info.password === code){
            let infos = {
                _id : info._id,
                _partition: info._partition,
                branch: info.branch,
                name: info.name,
                owner: info.owner,
                password: info.password,
                attendant: info.attendant,
                attendant_id: info.attendant_id,
                store_type: info.store_type
            }
            
         

              const storeValue = JSON.stringify(infos)
    

              await AsyncStorage.setItem('@store', storeValue)
      

              setVisible(false)

                navigation.navigate("Storeboard", {
                  name: "My Project",
                  projectPartition: `project=${user.id}` ,
                  store_info : JSON.parse(storeValue),
          
                });
           
             

            
      
        }else{
            setCode('')
            setError('Incorrect password, please try again!')
        }
    }

    const renderItem = ({ item }) => (
     {/*   <ListItem bottomDivider underlayColor="gray" containerStyle={{ margin: 5, borderRadius: 5}} onPress={()=> onClickStore(item)}>
          <Avatar title={item.name[0]} source={'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg' && { uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg' }}/>
          <ListItem.Content>
            <ListItem.Title>{item.name}</ListItem.Title>
            <ListItem.Subtitle>{item.branch}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
    </ListItem> */}
   
      )

     const onCancel = () => {
        setAlert(false)
      }

  return (
    <View style={styles.Container}>
       {/* <Loader loading={loading}/> */}
        <Alert visible={alert} onCancel={onCancel} onProceed={onCancel} title="No currency selected." content="Please select currency." confirmTitle="OK"/>
         <AppHeader 
            centerText="Select Store"
            leftComponent={
                <TouchableOpacity onPress={()=> navigation.goBack()}>
                  <EvilIcons name={'arrow-left'} size={30} color={colors.white}/>
                </TouchableOpacity>
            } 
        
        />
          <FlatGrid
      itemDimension={100}
      refreshControl={
        <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      }
      data={stores}
      // staticDimension={300}
      // fixed
      style={{marginBottom: 50}}
      keyExtractor={item => item._id}
      spacing={10}
      renderItem={({ item }) => (
     
        <TouchableWithoutFeedback onPress={()=> onClickStore(item)} >
       <View style={styles.itemContainer}>
        <View >
        <FastImage
         style={styles.stretch}
        source={require('../../assets/shop2.png')}
        resizeMode={FastImage.resizeMode.stretch}
    />  
        </View>
      
       
          <View style={{marginBottom: 10}}>
           
            <Text style={[styles.itemName,{fontSize: 16}]}>{item.name}</Text>
            <Text style={[styles.itemName,{fontWeight:'400'}]}>{item.branch}</Text>
          </View>
      </View>
  </TouchableWithoutFeedback>
      )}
    />
        {/* <Overlay isVisible={visible} onBackdropPress={setVisible}>
            <Text style={{textAlign:'center', fontSize: 18, fontWeight:'bold', marginVertical: 10}}>Enter Password</Text>
            <View style={{padding: 20}}>
            <SmoothPinCodeInput password mask="﹡"
              cellStyle={{
                borderWidth: 1,
                borderColor: 'gray',
                borderRadius: 15
              }}
              cellSize={45}
            codeLength={6}
            value={code}
            onTextChange={code => setCode(code)}/>
            <Button  title="Login" buttonStyle={{marginVertical: 10, backgroundColor: colors.accent, borderRadius: 10, marginTop: 30}} onPress={()=> onCheckPassword()}/>
            {
                error &&
                <Text style={{textAlign:'center', color: colors.red}}>{error}</Text>
            }
            </View>
        </Overlay> */}
        <Overlay  overlayStyle={{borderRadius: 25, margin: 30, width: '75%'}} isVisible={visible} onBackdropPress={setVisible}>
            <Text style={{textAlign:'center', fontSize: 18, fontWeight:'bold', marginVertical: 10}}>Enter store PIN</Text>
            <View style={{padding: 20}}>
            <SmoothPinCodeInput password mask="﹡"
              cellStyle={{
                borderWidth: 1,
                borderColor: 'gray',
                borderRadius: 15
              }}
              cellSize={35}
            codeLength={6}
            value={code}
            onTextChange={code => setCode(code)}/>
               <TouchableHighlight
                    style={{ ...styles.openButton, backgroundColor: colors.primary, marginVertical: 20 }}

                    onPress={()=> onCheckPassword()}
                    >
                    <Text style={styles.textStyle}>Proceed </Text>
                    </TouchableHighlight>
                    {
                error.length !== 0?
                <Text style={{textAlign:'center', color: colors.red}}>{error}</Text> : null
            }
            </View>
            
        </Overlay>
  </View>
  );
};

const styles = StyleSheet.create({
    Container: {
    flex: 1
  },
  stretch: {
    width: windowWidth /3.2 - 25,
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: -50
  }, itemContainer: {
  
    justifyContent:'center',
    alignItems:'center',
    marginTop: 50,
    backgroundColor: colors.grey, 
    flexDirection: 'column',
    borderRadius: 5,
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
    fontSize: 13,
    color: colors.primary,
    fontWeight: 'bold',
    textAlign:'center'
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 8,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});

export default StoreLogin;
