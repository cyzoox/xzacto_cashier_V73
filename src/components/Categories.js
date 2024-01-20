import React, { useEffect, useState } from "react";
import {Alert, 
    BackHandler, 
    FlatList, 
    StatusBar, 
    Text,
    View, 
    Dimensions, 
    StyleSheet, 
    ScrollView,
    Pressable,
    TouchableWithoutFeedback,
    TouchableOpacity
  } from 'react-native';
  import colors from '../themes/colors';
import { Store } from "../../schemas";
import { theme } from "../constants";
import { useStore } from "../context/StoreContext";
const { width, height } = Dimensions.get('window');

export function Categories({onTabChange, store_info}) {
  const { 
    category } = useStore();
  const [active, setActive] = useState(category.length === 0 ?  '': category[0].name);



  useEffect(() => {
    category.length === 0 ?
    onTabChange(''):
    onTabChange(category[0].name)
  },[]);

 const handleTab = tab => {
    setActive(tab.name);
    onTabChange(tab.name)
  }

  const   renderTab = (tab) => {
    const isActive = active === tab.name;

    return (
      <TouchableOpacity
        key={`tab-${tab.name}`}
        onPress={() => handleTab(tab)}
        style={[
          style.tab,
          isActive ? style.active : null
        ]}
      >
        <Text style={isActive ? {fontSize: 15, fontWeight:'bold', color: colors.accent}: {fontSize: 15, fontWeight:'bold', color: 'black'}}>
          {tab.name}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <>
    <View style={style.tabs}>
        <ScrollView  
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
            {category.map(tab =>
                tab.store_id === store_info._id &&
                renderTab(tab)
            )}
        </ScrollView> 
    </View>
    </>
  );
}


const style = StyleSheet.create({
    header: {
      paddingHorizontal: theme.sizes.base * 2,
    },
    avatar: {
      height: theme.sizes.base * 2.2,
      width: theme.sizes.base * 2.2,
    },
    tabs: {
      paddingVertical: 5,
      paddingHorizontal: theme.sizes.base,
    },
    content: {
      borderBottomColor: theme.colors.gray2,
      borderBottomWidth: StyleSheet.hairlineWidth,
      marginVertical: theme.sizes.base,
      marginHorizontal: theme.sizes.base * 2,
    },
    tab: {
      marginRight: theme.sizes.base * 2,
      paddingVertical: 7,
    },
    active: {
      backgroundColor: colors.white,

      paddingVertical: 7,  
      borderBottomWidth: 2
    },
    categories: {
      flexWrap: 'wrap',
      paddingHorizontal: theme.sizes.base,
      marginBottom: theme.sizes.base * 3.5,
    },
    category: {
      // this should be dynamic based on screen width
      minWidth: (width - (theme.sizes.padding * 5.5) - theme.sizes.base) / 2,
      maxWidth: (width - (theme.sizes.padding * 5.5) - theme.sizes.base) / 2,
      maxHeight: (width - (theme.sizes.padding * 5.5) - theme.sizes.base) / 2,
    },
    imageThumbnail: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 120,
      width: width / 3.5,
      backgroundColor: 'gray',
    },
    MainContainer: {
      paddingLeft: 10,
      paddingRight:10,
      paddingBottom:10,
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      overflow: 'visible',
      alignItems: 'center',
      justifyContent: 'center',
      height: height * 0.1,
      width,
      paddingBottom: theme.sizes.base * 4,
    }
  })