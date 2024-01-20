import React, { useState } from "react";
import { Text, StyleSheet, View, TouchableOpacity, ScrollView , Dimensions, TouchableWithoutFeedback, FlatList} from "react-native";
import formatMoney from 'accounting-js/lib/formatMoney.js'
import colors from "../themes/colors";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import moment from 'moment'
import { FlatGrid } from "react-native-super-grid";
import FastImage from 'react-native-fast-image'
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import { useEffect } from "react";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const HomeScreenII = () => {

  const getWindowWidth=()=> {
    // To deal with precision issues on android
    return Math.round(Dimensions.get('window').width * 1000) / 1000 - 6; //Adjustment for margin given to RLV;
  }
  const getLayoutProvider =(type) =>{
    switch (type) {
      case 1:
        return new LayoutProvider(
          () => {
            return 'VSEL';
          },
          (type, dim) => {
            switch (type) {
              case 'VSEL':
                dim.width = SCREEN_WIDTH / 2 - 8;
                dim.height = 280;
                break;
              default:
                dim.width = 0;
                dim.heigh = 0;
            }
          }
        );
      default:
        return new LayoutProvider(
          () => {
            return 'VSEL';
          },
          (type, dim) => {
            switch (type) {
              case 'VSEL':
                dim.width = (Math.round(Dimensions.get('window').width * 1000) / 1000)/2 - 6;
                dim.height = 250;
                break;
              default:
                dim.width = 0;
                dim.heigh = 0;
            }
          }
        );
    }
  }

  const {user} = useAuth()
  const {products, store_info} = useStore();
  const [products_list, setProducts] = useState([])
  const [dataProvider, setDataProvider] = useState(new DataProvider((r1, r2) => {return r1 !== r2;}))
  const [layoutProvider,setlayoutProvider] = useState(getLayoutProvider(0))

 

  useEffect(() => {
   setDataProvider(dataProvider.cloneWithRows(...products))
  },[]);

const calculateTotal = () => {
  let total = 0;
  products_list.forEach(list => {
          total += list.quantity * list.sprice  
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

const onAddtoList = (item) => {
 let index = products_list.findIndex(x => x._id === item._id);
 if(index === -1){
  let list = {
    _partition: `project=${user.id}`,
    _id: item._id,
    name: item.name,
    brand: item.brand,
    oprice: item.oprice,
    sprice: item.sprice,
    unit: item.unit,
    category: item.category,
    store_id: store_info._id,
    store: item.store,
    quantity: 1,
    uid: item.pr_id,
    timeStamp: moment().unix(),
  }
  setProducts([...products_list, list])

 }else{
  setProducts(
    products_list.map((x) => {
      if (x._id === item._id)
        return {
          ...x,
          quantity: x.quantity + 1,
        };
      return x;
    })
  );
 }


}

const _renderitem = (type, data) =>   <TouchableWithoutFeedback onPress={()=> onAddtoList(item)} >
<View style={styles.itemContainer}>
 <View >
 <FastImage
  style={styles.stretch}
 source={data.img === null || data.img === '' ? require('../../assets/noproduct.png') :{
     uri:  data.img,
     headers: { Authorization: 'auth-token' },
     priority: FastImage.priority.normal,
 }}
 resizeMode={FastImage.resizeMode.stretch}
/>  
{
data.stock <= 0 ?
<View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
 <Text style={{color: colors.red, fontWeight:'bold'}}>Out of Stock</Text>
</View>
: null}

</View>
   <View>
     <Text style={{fontSize: 14, color: colors.primary, fontWeight: '500',textAlign:'center'}}>{formatMoney(data.sprice, { symbol: "₱", precision: 2 })}</Text>
     <Text style={styles.itemName}>{data.name}</Text>
     <Text style={{color: 'gray',textAlign:'center', fontSize: 13}}>{Math.round(data.stock * 100) / 100} {data.unit}</Text>
   </View>
   {
products_list.map((items) => {
  
  return(items._id === data._id && <Text style={{color: colors.red, fontWeight:'bold'}}>{items.quantity}</Text>)

})

}
</View>

</TouchableWithoutFeedback>

  return (
    <View style={{flex: 1}}>
  
      
      <RecyclerListView
          style={{flex: 1, marginHorizontal: 5}}
          rowRenderer={_renderitem}
          dataProvider={dataProvider}
          layoutProvider={layoutProvider}
          
        />
        <View style={styles.bottomView}>
          <TouchableOpacity onPress={()=> {}} style={{backgroundColor: colors.accent,  width: '100%',paddingVertical: 15, flexDirection:'row', justifyContent:'space-between', paddingHorizontal: 10}}>
           <Text style={{fontSize: 18, fontWeight: '700', color: colors.white}}> Subtotal  {formatMoney(calculateTotal(), { symbol: "₱", precision: 2 })}</Text>
           <Text style={{fontSize: 18, fontWeight: '700', color: colors.white}}> Qty  {formatMoney(calculateQty(), { symbol: "", precision: 2 })}</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  itemContainer: {
    flex:1,
    marginTop: 5,
    backgroundColor: colors.white, 
    flexDirection: 'column',
    borderRadius: 15,
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
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
    textAlign:'center'
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
  stretch: {
    width: windowWidth /3 - 13,
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  iconStyle: {
    fontSize: 25,
    alignSelf: 'center',
    marginHorizontal: 15,
},
});

export default HomeScreenII;
