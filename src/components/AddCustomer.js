import React, { useState } from "react";
import { Overlay, Input, Button } from "react-native-elements";
import {TouchableOpacity, View, Text} from 'react-native';
import styles from "../../stylesheet";
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import colors from "../themes/colors";
import { useAuth } from "../context/AuthContext";

import uuid from 'react-native-uuid';
import { TextInput } from "react-native-paper";

// The AddTask is a button for adding tasks. When the button is pressed, an
// overlay shows up to request user input for the new task name. When the
// "Create" button on the overlay is pressed, the overlay closes and the new
// task is created in the realm.
export function AddCustomer({ createCustomer, store }) {
  const { user } = useAuth();
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [credit_balance, setBalance] = useState(0);
  const [mobile, setMobile] = useState("");
  const [errors, setError] = useState("");
  const [name_errors, setNameError] = useState("");

  const onSave = () => {
    if(isNaN(credit_balance)){
      setError('Credit balance must be a number.')
      return
    }
    if(name.length === 0){
      setNameError('Name is required.')
      return
    }

    
    let customer = {
      id: uuid.v4(),
      partition: `project=${user.id}`,
      name: name,
      address: address,
      credit_balance: parseFloat(credit_balance),
      mobile_no: mobile,
      store_id: store._id,
      store: store.name
      
    }
    createCustomer(customer)
    setOverlayVisible(false);
  }

  return (
    <>
      <Overlay
        isVisible={overlayVisible}
        overlayStyle={{ width: "80%", padding: 20 }}
        onBackdropPress={() => setOverlayVisible(false)}
      >
        <>
          <Text style={{fontSize: 19, textAlign:'center', marginBottom: 10, marginTop: 5}}>Add Customer</Text>
          <TextInput
            placeholder="Name"
            mode="outlined"
            onChangeText={(text) => setName(text)}
          autoFocus={true}
            theme={{ colors: { primary: colors.accent,underlineColor:'transparent',}}}
          />
           {name_errors.length !== 0 ? <Text style={{textAlign:"center", color: colors.red, marginVertical: 5}}>{name_errors}</Text>: null}
          <TextInput
            placeholder="Address"
            mode="outlined"
            onChangeText={(text) => setAddress(text)}
          
            theme={{ colors: { primary: colors.accent,underlineColor:'transparent',}}}
          />
          <TextInput
            placeholder="Mobile #"
            mode="outlined"
            onChangeText={(text) => setMobile(text)}
           
            theme={{ colors: { primary: colors.accent,underlineColor:'transparent',}}}
          />
          <TextInput
            placeholder="Credit Balance (optional)"
            mode="outlined"
            onChangeText={(text) => setBalance(text)}
       
            theme={{ colors: { primary: colors.accent,underlineColor:'transparent',}}}
          />
          {errors.length !== 0 ? <Text style={{textAlign:"center", color: colors.red, marginVertical: 5}}>{errors}</Text>: null}
          <View style={{flexDirection:'row', justifyContent:'space-evenly', marginVertical: 15}}>
            <View  style={{flex: 1, marginHorizontal: 15}} >
                <Button buttonStyle={{backgroundColor: colors.red, paddingVertical: 15}} title="Cancel" onPress={()=> {
              setOverlayVisible(false);
            
            }}/>
            </View>
            <View  style={{flex: 1, marginHorizontal: 15}} >
             <Button buttonStyle={{backgroundColor: colors.green, paddingVertical: 15}}  title="Save" onPress={()=> {
              onSave()
            }}/>
            </View>
        </View>
     

         
        </>
      </Overlay>
      <TouchableOpacity onPress={()=>setOverlayVisible(true)}>
            <EvilIcons  name={'plus'} size={30} color={colors.white}/>
      </TouchableOpacity>
    </>
  );
}
