import React, { useState } from "react";
import { Text, StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import AppHeader from "../components/AppHeader";
import { ListItem, Avatar } from 'react-native-elements'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import colors from "../themes/colors";
import { useStore } from "../context/StoreContext";
import moment from 'moment'
import formatMoney from 'accounting-js/lib/formatMoney.js'
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";

const ArchiveScreen = ({navigation, route}) => {
  const store_info = route.params.store_info;
  const { user } = useAuth();
    const {archive ,archiveInfo, updateArchiveOnClear, reListArchive} = useStore();
    const [ondelete, setDelete] = useState(false);
    const [relist, setRelist] = useState(false);

      
      const keyExtractor = (item, index) => index.toString()
      
      const renderItem = ({ item }) => (
        <ListItem containerStyle={styles.listStyle} bottomDivider onPress={()=> navigation.navigate('ArchiveInfo',{archive_info : item})}>
          <ListItem.Content>
            <ListItem.Title style={{fontWeight:'700'}}>{moment.unix(item.timeStamp).format("MMMM DD ,YYYY hh:mm:ss a")}</ListItem.Title>
            <ListItem.Subtitle>{formatMoney(item.total, { symbol: "₱", precision: 2 })}</ListItem.Subtitle>
          </ListItem.Content>
          <TouchableOpacity onPress={()=> setDelete(true)}>
            <EvilIcons name={'trash'} size={30} color={colors.primary}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setRelist(true)}>
            <EvilIcons name={'redo'} size={30} color={colors.boldGrey}/>
          </TouchableOpacity>
        </ListItem>
      )

      const onCancelDelete = () => {
          setDelete(false)
      }

      const onCancelRelist = () => {
        setRelist(false)
        setDelete(false)
      }

      const onProceedDelete = () => {
        updateArchiveOnClear( store_info);
        setDelete(false);
        navigation.goBack();
 
      }

      const onProceedRelist = () => {
        reListArchive(archive,user, store_info )
        setRelist(false)
      }

      
  return (
      <View>
        <Alert visible={ondelete} onCancel={onCancelDelete} onProceed={onProceedDelete} title="Delete this archive?" content="Are you sure you want to delete this archive?" confirmTitle="Proceed"/>
        <Alert visible={relist} onCancel={onCancelRelist} onProceed={onProceedRelist} title="Re-List archive?" content="Are you sure you want to re-list this archive?" confirmTitle="Proceed"/>
          <AppHeader
            centerText='Archive'
            leftComponent={
                <TouchableOpacity onPress={()=> navigation.goBack()}>
                  <EvilIcons name={'arrow-left'} size={35} color={colors.white}/>
                </TouchableOpacity>
            } 
          />
           <FlatList
            keyExtractor={keyExtractor}
            data={archiveInfo}
            renderItem={renderItem}
            />
      </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30
  },
  listStyle: {
    flex:1,
    height: 75,
    backgroundColor: colors.white, 
    marginHorizontal: 15,
    paddingHorizontal: 15, 
    marginBottom: 10,
    marginTop: 10, 
    borderRadius: 15, 
    flexDirection:'row', 
    justifyContent:'space-between', 
    paddingHorizontal: 10, 
    alignItems:'center',
    shadowColor: "#EBECF0",
    shadowOffset: {
      width: 0,
      height: 5,
     
    },
    shadowOpacity: 0.89,
    shadowRadius: 2,
    elevation: 5,
  }
});

export default ArchiveScreen;
