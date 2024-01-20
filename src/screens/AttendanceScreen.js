import React, { useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import AppHeader from "../components/AppHeader";
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import colors from "../themes/colors";
import { useStore } from "../context/StoreContext";
import { ListItem, Avatar, Button, Overlay } from "react-native-elements";
import { List } from 'react-native-paper';
import moment from 'moment'
import uuid from 'react-native-uuid';
import { useAuth } from "../context/AuthContext";
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import Alert from "../components/Alert";
const KEYS_TO_FILTERS = ['store_id'];
import SearchInput, { createFilter } from 'react-native-search-filter';

const AttendanceScreen = ({navigation, route}) => {
  const store_info = route.params.store_info;
  const {user} = useAuth();
  const {staffs,  createAttendanceLog, attendance_logs, onLogIn , onLogOut} = useStore();
  const [expanded, setExpanded] = useState(true);
  const [visible, setVisible] = useState(false);
  const [invisible, setInVisible] = useState(false);
  const [outvisible, setOutVisible] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState([]);
  const [code, setCode] = useState('');
  const [attendance, setAttendanceInfo] = useState(null);

  const handlePress = () => setExpanded(!expanded);
    
  const filteredStaffs = staffs.filter(createFilter(store_info._id, KEYS_TO_FILTERS))


  const onCreateLogs = () => {
    const date = moment().unix()
    let logs = {
      partition: `project=${user.id}`,
      store_name : store_info.name,
      store_id : store_info._id,
      id: uuid.v4(),
      date: moment.unix(date).format('MMMM DD, YYYY'),
      timeStamp: moment().unix(),
      attendant_id : info._id,
      attendant_name : info.name,
      year :moment.unix(date).format('YYYY'),
      year_month :moment.unix(date).format('MMMM-YYYY'),
      year_week :moment.unix(date).format('WW-YYYY'),
      inStamp : 0,
      outStamp : 0
    }

    createAttendanceLog(logs)
    setVisible(false)
    setInfo([])
  }


  const onClickIn = (attendant) => {
      setInVisible(true)
      setInfo(attendant)

  }


  const onCheckInPassword = () => {
   
    if(info.password === code){
        onLogIn(info, store_info)
        setCode('');
        setInfo([])
        setInVisible(false)
        setAttendanceInfo(null)
        navigation.goBack()
    }else{
      setCode('');
      setError('Wrong password!')
      setAttendanceInfo(null)
    }
  }




  const renderItem = ({ item }) => (
    <View>
    <ListItem onPress={()=> onClickIn(item)} containerStyle={{marginVertical: 5, marginHorizontal: 5, borderRadius: 30, paddingHorizontal: 20}} bottomDivider>
    <Avatar title={item.name[0]} avatarStyle={{borderRadius: 15}} source={{uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'}} />
        <ListItem.Content>
          <ListItem.Title>
            {item.name}
          </ListItem.Title>
        </ListItem.Content>
        <TouchableOpacity onPress={()=> onClickIn(item)}>
          {
            store_info.attendant_id === item._id ?
            <Ionicons name={'md-key'} size={25} color={colors.green}/>:
            <Ionicons name={'md-key'} size={25} color={colors.primary}/>
          }
           
        </TouchableOpacity>
        
      </ListItem>
    </View>
   
  );




  const onCancel = () => {
    setVisible(false)
  }

  const onProceed = () => {
    onCreateLogs()
  }

  return (
      <View>
        <Alert visible={visible} onCancel={onCancel} onProceed={onProceed} title="Create New Record?" content="Create new login/logout record?" confirmTitle="Proceed"/>
          <AppHeader 
            centerText="Switch Attendant"
            leftComponent={
                <TouchableOpacity onPress={()=> navigation.goBack()}>
                  <EvilIcons name={'arrow-left'} size={30} color={colors.white}/>
                </TouchableOpacity>
            } 
          />
           <FlatList
              data={filteredStaffs}
              renderItem={renderItem}
              keyExtractor={item => item._id}
            />
              <Overlay style={{padding: 20}} isVisible={invisible} onBackdropPress={setInVisible}>

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
                  <Button title="Check" buttonStyle={{marginVertical: 10, backgroundColor: colors.accent, borderRadius: 10, marginTop: 30}} onPress={()=> onCheckInPassword()}/>
                  {
                      error != '' ?
                      <Text>{error}</Text> : null
                  }
                   
                   </View>
        </Overlay>

        
      </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30
  }
});

export default AttendanceScreen;
