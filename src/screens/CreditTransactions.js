import React, { useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, FlatList, ScrollView, Dimensions } from "react-native";
import AppHeader from "../components/AppHeader";
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import colors from "../themes/colors";
import { ListItem, Avatar, Overlay , Button} from 'react-native-elements'
import moment from 'moment'
import { useStore } from "../context/StoreContext";
import formatMoney from 'accounting-js/lib/formatMoney.js'
import { ModalInputForm } from "../components/ModalInputForm";
import Feather from 'react-native-vector-icons/Feather'
import Spacer from "../components/Spacer";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const { width, height } = Dimensions.get('window');
const CreditTransaction = ({navigation, route}) => {
  const store_info = route.params.store_info;
    const { 
        stores,
        staffs,
        transactions,getCustomTransaction } = useStore();
        const [visible, setVisible] = useState(false);
        const [attendant, setAttendant] = useState('');
        const [attendant_info, setAttendantInfo] = useState([]);
        const [selectedValue, setselectedValue] = useState('Today');
   const keyExtractor = (item, index) => index.toString()

   const toggleOverlay = () => {
    setVisible(!visible);
  };
  
   const getFilteredTransactions=(filter)=>{

    setselectedValue(filter)
    toggleOverlay()
    let date = moment().unix()
    let today =  `${moment.unix(date).format('MMMM DD, YYYY')}`;
    let yesterday = `${moment.unix(date).subtract(1, 'day').format('MMMM DD, YYYY')}`;
    let thisweek = moment.unix(date).format('WW-YYYY');
    let lastweek = `${moment.unix(date).format('ww')-1}`;
    let thismonth = `${moment.unix(date).format('MMMM YYYY')}`;
    let lastmonth = `${moment.unix(date).subtract(1, 'month').format('MMMM YYYY')}`;
    let thisyear = `${moment.unix(date).format('YYYY')}`;
    let lastyear = `${moment.unix(date).subtract(1, 'year').format('YYYY')}`;
    let lastdays = `${moment.unix(date).subtract(30, 'day').startOf('day')/ 1000}`;
    let endwith = `${moment.unix(date)/1000}`;
  
    switch(filter) {
  
      case 'Today':
        getCustomTransaction('Today', {date : today}, attendant_info._id)
        break;
        case 'This week':
          getCustomTransaction('This week', {date: thisweek}, attendant_info._id)
        break;
  
      default:
        getCustomTransaction('Today', {date: today})
        break;
    
      }
  
  }
  

   const renderItem = ({ item }) => (
     item.payment_method === 'Credit' && stores[0].attendant_id === item.attendant_id ?
    <ListItem bottomDivider containerStyle={styles.list} onPress={()=> navigation.navigate('CreditTransactionDetailsScreen', {
      'transactions': item,
      store_info
    })}>
        <Avatar source={require('../../assets/credit.png')} />
        <ListItem.Content>
        <ListItem.Title style={{fontSize: 18}}>{item.customer_name}</ListItem.Title>
        <ListItem.Subtitle>{item.date}</ListItem.Subtitle>
        </ListItem.Content>
        <Text style={{color: colors.accent, fontWeight: '700', fontSize: 17}}> {formatMoney(item.total, { symbol: "₱", precision: 2 })}</Text>
    </ListItem> : null
    )
  return (
      <View>
          <AppHeader 
            centerText="Credit Transactions"
            leftComponent={
                <TouchableOpacity onPress={()=> navigation.goBack()}>
                  <EvilIcons name={'arrow-left'} size={35} color={colors.white}/>
                </TouchableOpacity>
            } 
            
          />
           <View style={{justifyContent:'center', alignItems:'center'}}>
          <TouchableOpacity style={styles.filterStyle}>
          <ModalInputForm
                displayComponent={
                    <View style={{flexDirection:"row"}}>
                       <Feather style={{textAlign:'center',paddingRight: 10}} name={'users'} size={20} color={colors.black}/>
                        <Text style={{paddingLeft:10, borderLeftWidth: 1,color: colors.black,  fontWeight:'700'}}>{attendant.length === 0 ? "Select Attendant": attendant}</Text>
                    </View>
                }
                title="Select Attendant"
                onSave={()=> getFilteredTransactions('Today')}
              >
                <ScrollView>
                  {
                    staffs.map((item, index) => 
                    item.status === 'Active' &&
                      <TouchableOpacity style={item.name === attendant ? [styles.storeList,{ borderColor:colors.accent}] : styles.storeList} onPress={()=> {setAttendant(item.name), setAttendantInfo(item)}}>
                        <Text style={{textAlign: 'center', fontWeight:'700', fontSize: 17, textTransform:'uppercase'}}>{item.name}</Text>
                     </TouchableOpacity>
                    )
                  }
                </ScrollView>
              </ModalInputForm>
              </TouchableOpacity>
          </View>

            <FlatList
                keyExtractor={keyExtractor}
                data={transactions}
                renderItem={renderItem}
            />
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
              <View style={{padding : 10,justifyContent:'center'}}>
                  <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                   
                    <TouchableOpacity onPress={toggleOverlay}>
                      <Ionicons name={'close-circle'} size={26} color={colors.red}/>
                    </TouchableOpacity>
                    <Text style={{textAlign:'center', fontSize: 20, fontWeight:'bold'}}>Select Filter</Text>
                    <View/>
                  </View>
                  <Spacer />
                  <Button 
                      title="Today" 
                      onPress={ ()=> getFilteredTransactions('Today')} 
                      buttonStyle={{
                        paddingHorizontal: windowWidth/ 4, 
                        borderRadius: 10, 
                        backgroundColor: colors.white, 
                        borderColor: colors.accent, 
                        borderWidth: 1
                        }}
            titleStyle={{color: colors.black, fontSize: 18, fontWeight:'600'}}
                  />
                  <Spacer />
                  <Button 
                      title="This week" 
                      onPress={()=>getFilteredTransactions('This week')}
                      buttonStyle={{
                        paddingHorizontal: windowWidth/ 4, 
                        borderRadius: 10, 
                        backgroundColor: colors.white, 
                        borderColor: colors.accent, 
                        borderWidth: 1
                        }}
                      titleStyle={{color: colors.black, fontSize: 18, fontWeight:'600'}}
                />
              </View>
            </Overlay>
      </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30
  },
  list: {
    margin: 5,
    borderRadius: 15,
    shadowColor: "#EBECF0",
    shadowOffset: {
      width: 0,
      height: 5,
     
    },
    shadowOpacity: 0.89,
    shadowRadius: 2,
    elevation: 3,
  },
  filterStyle: {
    backgroundColor:colors.white, 
    paddingVertical: 9, 
    width: '45%',
    borderRadius: 5,
    shadowColor: "#EBECF0",
    shadowOffset: {
      width: 0,
      height: 5,
     
    },
    shadowOpacity: 0.89,
    shadowRadius: 2,
    elevation: 5,
    borderColor: colors.white,
    borderWidth:  1
  },
  storeList: {
    flex: 1,
    borderColor: colors.boldGrey,
    borderWidth: 1,
    paddingVertical: 8,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: colors.white,
    shadowColor: "#EBECF0",
    shadowOffset: {
      width: 0,
      height: 2,
     
    },
    shadowOpacity: 0.89,
    shadowRadius: 2,
    elevation: 2,
  }

});

export default CreditTransaction;
