import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View, TouchableOpacity, FlatList, Dimensions, ScrollView } from "react-native";
import AppHeader from "../components/AppHeader";
import Spacer from "../components/Spacer";
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Ionicons from 'react-native-vector-icons/Ionicons'
import colors from "../themes/colors";
import { Button, Overlay, Input, Divider } from 'react-native-elements';
import { useStore } from "../context/StoreContext";
import moment from 'moment'
import uuid from 'react-native-uuid';
import { useAuth } from "../context/AuthContext";
import formatMoney from 'accounting-js/lib/formatMoney.js'
import { Card, TextInput } from "react-native-paper";
import Feather from 'react-native-vector-icons/Feather'
import { ModalInputForm } from "../components/ModalInputForm";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ExpensesScreen = ({navigation, route}) => {
  const store_info = route.params.store_info;
  const {user} = useAuth();
  const {
    createExpenses,
    expenses,
    staffs,
    getCustomExpense,
    stores
  } = useStore();

  const [visible, setVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [dateVisible, setDateVisible] = useState(false);
  const [p_Visible, setPVisible] = useState(false);
  const [selectedstaff, setSelectedStaff] = useState(staffs[0]);
  const [selectedValue, setselectedValue] = useState('Today')
  const [attendant, setAttendant] = useState('');
  const [attendant_info, setAttendantInfo] = useState([]);
        const toggleOverlay = () => {
          setDateVisible(!dateVisible);
        };

        const togglePOverlay = () => {
          setPVisible(!p_Visible);
        };
  
  console.log(expenses)

 const onSaveExpenses = () => {
    const date = moment().unix()
    let expense = {
      description : description,
      partition: `project=${user.id}`,
      store_id : store_info._id,
      category : 'None',
      date: moment.unix(date).format('MMMM DD, YYYY'),
      attendant : selectStoreStaff()[0].attendant,
      attendant_id : selectStoreStaff()[0].attendant_id,
      amount : parseFloat(amount),
      id: uuid.v4(),
      timeStamp: moment().unix(),
      year :moment.unix(date).format('YYYY'),
      year_month :moment.unix(date).format('MMMM-YYYY'),
      year_week :moment.unix(date).format('WW-YYYY')
    }
    createExpenses(expense)
    setVisible(false)
  }
  
  const calculateTotal = () => {
    let total = 0;
    expenses.forEach(list => {
      if(list.attendant_id === stores[0].attendant_id){
        total += list.amount 
      }
           
    });
   return total;
}

const onSelectPersonnel = (item) => {
 
  setSelectedStaff(item)
  getFilteredTransactions(selectedValue)
  togglePOverlay()
}

useEffect(() => {
  let date = moment().unix()
  let today =  `${moment.unix(date).format('MMMM DD, YYYY')}`;

},[]);
       
const getFilteredTransactions=(filter)=>{

  setselectedValue(filter)

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
      getCustomExpense('Today', {date : today}, attendant_info._id)
      break;
      case 'This week':
        getCustomExpense('This week', {date: thisweek}, attendant_info._id)
      break;

    default:
      getCustomExpense('Today', {date: today}, attendant_info._id)
      break;
  
    }

}

const selectStoreStaff = () => {
  let store = []
  stores.forEach(item => {
    if(item._id === store_info._id){
     store = store.concat(item)
    }
  });
  return store;
}
  
  const renderItem = ({ item }) => {
    return (
      item.attendant_id === selectStoreStaff()[0].attendant_id ?
        <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'row', backgroundColor:colors.white }}>
        <View style={styles.cellContainer}>
        <Text style={styles.cellStyle}> {item.description}</Text>
        </View>
        <View style={styles.cellContainer}>
        <Text style={styles.cellStyle}>{item.attendant}</Text>
        </View>
        <View style={styles.cellContainer}>
        <Text style={styles.cellStyle}>{formatMoney(item.amount, { symbol: "₱", precision: 2 })}</Text>
        </View> 
       
    </View>: null
    );
}

  return (
      <View>
          <AppHeader 
            centerText="Expenses"
            leftComponent={
                <TouchableOpacity onPress={()=> navigation.goBack()}>
                  <EvilIcons name={'arrow-left'} size={35} color={colors.white}/>
                </TouchableOpacity>
            } 
            rightComponent={
              <TouchableOpacity onPress={()=> setVisible(true)}>
                <EvilIcons name={'plus'} size={35} color={colors.white}/>
              </TouchableOpacity>
            }
           
          />
          {/*
 <View style={styles.upperContainer}>
              <Text style={{textAlign:'center', color:colors.primary}}>{selectedValue} - {selectedstaff.name}</Text>
            </View>
          <View style={styles.backgroundStyle}>
            <View style={styles.barContainer}>
              <TouchableOpacity style={styles.barStyle}onPress={()=> setVisible(true)}>
                <EvilIcons name={'plus'} size={30} color={colors.primary}/>
              </TouchableOpacity>
              <Text style={{color:colors.primary, fontWeight:'600', textTransform: 'uppercase'}}>Add</Text>
            </View>
            <View style={styles.barContainer}>
              <TouchableOpacity style={styles.barStyle} onPress={toggleOverlay}>
              <Fontisto name={'date'} size={20} color={colors.primary}/>
              </TouchableOpacity>
              <Text style={{color:colors.primary, fontWeight:'600', textTransform: 'uppercase'}}>Date</Text>
            </View>
            <View style={styles.barContainer}>
              <TouchableOpacity style={styles.barStyle} onPress={togglePOverlay}>
              <Fontisto name={'persons'} size={20} color={colors.primary}/>
              </TouchableOpacity>
              <Text style={{color:colors.primary, fontWeight:'600', textTransform: 'uppercase'}}>Personnel</Text>
            </View>
          </View>
          */}
           <View style={{justifyContent:'center', alignItems:'center', marginVertical: 10}}>
          <TouchableOpacity style={styles.filterStyle}>
      
                    <View style={{flexDirection:"row", justifyContent:"center", alignItems:'center'}}>
                       <Feather style={{textAlign:'center',paddingRight: 10}} name={'calendar'} size={20} color={colors.black}/>
                        <Text style={{paddingLeft:10, borderLeftWidth: 1,color: colors.black,  fontWeight:'700'}}>Today</Text>
                    </View>
              </TouchableOpacity>
          </View>
           <View style={styles.cellHeaderContainer}>
                <View style={styles.cellContainer}>
                <Text style={styles.cellHeaderStyle}>Description</Text>
                </View>
                <View style={styles.cellContainer}>
                <Text style={styles.cellHeaderStyle}>Attendant</Text>
                </View>
                <View style={styles.cellContainer}>
                <Text style={styles.cellHeaderStyle}>Amount</Text>
                </View>     
            </View> 
          <FlatList
            data={expenses}
            
            renderItem={renderItem}
            keyExtractor={item => item._id}
            ListFooterComponentStyle={{flex:1, justifyContent: 'flex-end'}}
            ListFooterComponent={ <View style={[styles.cellHeaderContainer]}>
            <View style={[styles.cellContainer]}>
                  <Text style={styles.cellHeaderStyle}>Total</Text>
            </View>
            <View style={styles.cellContainer}>
              <Text style={styles.cellHeaderStyle}></Text>
            </View>
            <View style={styles.cellContainer}>
              <Text style={styles.cellHeaderStyle}></Text>
            </View>
            <View style={styles.cellContainer}>
              <Text style={styles.cellHeaderStyle}>{formatMoney(calculateTotal(), { symbol: "₱", precision: 2 })}</Text>
            </View>
        </View> }
          />
            
          <Overlay isVisible={visible}  overlayStyle={{ width: "85%" }} onBackdropPress={setVisible}>
            <View style={{padding: 20}}>
              <Text style={{paddingBottom: 10, fontWeight:'700', textAlign:'center', fontSize:18}}>Add Expenses</Text>
     
              <TextInput
                  label="Amount"
                 
                  mode="outlined"
                 onChangeText={value => setAmount(value)}
                 keyboardType="numeric"
              />
               <TextInput
                label="Description"
                mode="outlined"
                 onChangeText={value => setDescription(value)}
                
              />
              <View style={{flexDirection:'row', justifyContent:'center'}}>
                <View style={{flex: 1, marginHorizontal: 5}}>
                <Button buttonStyle={{marginTop: 10, width: '100%', backgroundColor: colors.boldGrey}} title="Cancel" onPress={()=> setVisible(false)}/>
                </View>
                <View style={{flex: 1, marginHorizontal: 5}}>
                <Button buttonStyle={{marginTop: 10, width: '100%', backgroundColor: colors.primary}} title="Save" onPress={()=> onSaveExpenses()}/>
                </View>
              
              </View>
            
              </View>
          </Overlay>
          <Overlay isVisible={dateVisible} onBackdropPress={toggleOverlay}>
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
            <Overlay isVisible={p_Visible} onBackdropPress={togglePOverlay}>
              <View style={{padding : 10,justifyContent:'center'}}>
                  <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                    <View/>
                    <Text style={{textAlign:'center', fontSize: 18, fontWeight:'bold'}}>Select Personnel</Text>
                    <TouchableOpacity onPress={togglePOverlay}>
                      <Ionicons name={'close-circle'} size={26} color={colors.red}/>
                    </TouchableOpacity>
                  </View>
                  <Spacer/>
                  <ScrollView>
                  {
                    staffs.map((item, key) => {
                      return(
                        <View>
                          <Button title={item.name} onPress={ ()=> onSelectPersonnel(item)} buttonStyle={{paddingHorizontal: windowWidth/ 4}}/>
                          <Spacer/>
                        </View>
                        
                      )
                    })
                  }
              </ScrollView>
              </View>
            </Overlay>
       
      </View>
  );
};


const styles = StyleSheet.create({

  itemContainer: {
    justifyContent: 'center',
    alignItems:'center',
    borderRadius: 5,
    padding: 15,
    height: 150,
  },
  itemName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
  cellHeaderStyle : {
    textAlign:'center',
    paddingVertical: 5,
    color: colors.white,
    fontWeight:'700'
},
  cellStyle : {
      textAlign:'center',
      paddingVertical: 5,
      fontSize: 15,
      color: colors.black
  },
  cellContainer: {
    flex: 1, 
    alignSelf: 'stretch',
  },
  cellHeaderContainer: {
    
    flexDirection: 'row' ,
    backgroundColor: colors.coverDark ,
    marginHorizontal: 10
  },
  cellFooterStyle:{
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent:'space-between',
    marginHorizontal: 10,
    backgroundColor:colors.boldGrey,
    padding: 3
  }, 
  footerTextStyle : {
    fontSize: 15,
    fontWeight:'bold'
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
},
backTextWhite: {
    color: '#FFF',
},
rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
},
rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
},
backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
},
backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
},
backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
},
backgroundStyle: {
  flexDirection:'row',
  justifyContent:'space-around',
  backgroundColor: colors.white,
  height: 55,
  borderRadius: 5,
  marginHorizontal: 20,
  margin: 10,
  shadowColor: "#EBECF0",
  shadowOffset: {
    width: 0,
    height: 5,
    
  },
  shadowOpacity: 0.89,
  shadowRadius: 2,
  elevation: 5,
  paddingBottom: 10
},
barContainer : {
  flexDirection:'column',
  justifyContent:'space-between',
  alignItems:'center',

},
barStyle: {
  justifyContent:'center',
  backgroundColor:colors.white,
  width: 30,
  height: 30,
  alignItems:'center',
  borderRadius: 50,
  marginTop: 5
},
upperContainer: {
  borderRadius: 5,
  paddingVertical: 10, 
  justifyContent:'center', 
  backgroundColor: colors.white, 
  marginHorizontal: 10,
  shadowColor: "#EBECF0",
  shadowOffset: {
    width: 0,
    height: 5,
   
  },
  shadowOpacity: 0.89,
  shadowRadius: 2,
  elevation: 5,
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
export default ExpensesScreen;
