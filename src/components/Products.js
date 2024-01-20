import React, {useState} from 'react';
import {
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import {Button, Input, Overlay} from 'react-native-elements';
import {useAuth} from '../context/AuthContext';
import {useStore} from '../context/StoreContext';
import colors from '../themes/colors';
import moment from 'moment';
import formatMoney from 'accounting-js/lib/formatMoney.js';
import {Categories} from './Categories';
import Alert from './Alert';
import SearchInput, {createFilter} from 'react-native-search-filter';
import {TextInput} from 'react-native-paper';
import SearchBar from './SearchBar';
import Feather from 'react-native-vector-icons/Feather';
import FastImage from 'react-native-fast-image';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const KEYS_TO_FILTERSs = ['store_id'];
const KEYS_TO_FILTERS = ['name', 'category'];
import BigList from 'react-native-big-list';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
export default function Products({
  navigation,
  search,
  toggleSearch,
  store_info,
  scan,
  toggleBarcode,
}) {
  const {user} = useAuth();

  const {
    stores,
    products,
    createList,
    onSaveList,
    products_list,
    inventory,
    option,
    addon,
  } = useStore();

  const [overlay, overlayVisible] = useState(false);
  const [item, setItems] = useState([]);
  const [term, setTerm] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [alerts, alertVisible] = useState(false);
  const [alerts2, alertVisible2] = useState(false);
  const [product_info, setProductInfo] = useState([]);
  const [additionals, setWithAdditional] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState({
    name: '',
    price: 0,
    cost: 0,
  });
  const [selectedAddon, setSelectedAddon] = useState({
    name: '',
    price: 0,
    cost: 0,
  });
  const [selectedOption, setSelectedOption] = useState([]);
  const [total, setTotal] = useState(0);
  const [aqty, setAqty] = useState(1);
  const [bcode, setBarcode] = useState('');

  const setVariables = itemss => {
    setItems(itemss);
    if (stores[0].attendant === '') {
      alertVisible(true);
      setItems([]);
      return;
    }
    if (itemss.unit === 'Kilo' || itemss.unit === 'Gram') {
      overlayVisible(true);
      return;
    }
    onSaveList(itemss);
  };

  const onCancelAlert = () => {
    alertVisible(false);
  };

  const onSaveList2 = () => {
    let list = {
      partition: `project=${user.id}`,
      id: item._id,
      name: item.name,
      brand: item.brand,
      oprice: item.oprice,
      sprice: item.sprice,
      unit: item.unit,
      category: item.category,
      store_id: store_info._id,
      store: item.store,
      quantity: parseFloat(quantity),
      uid: item.uid,
      timeStamp: moment().unix(),
    };

    createList(list, item);
    overlayVisible(false);
  };

  const calculateTotal = () => {
    let total = 0;
    products_list.forEach(list => {
      total += list.quantity * list.sprice;
    });
    return total;
  };

  const calculateQty = () => {
    let total = 0;
    products_list.forEach(list => {
      total += list.quantity;
    });
    return total;
  };

  const filteredProducts = products.filter(
    createFilter(store_info._id, KEYS_TO_FILTERSs),
  );
  const filteredProductss = filteredProducts.filter(
    createFilter(term, KEYS_TO_FILTERS),
  );

  const onTabChange = sterm => {
    setTerm(sterm);
  };

  const handleInput = () => {
    if (
      isNaN(quantity) ||
      quantity === '.' ||
      quantity === ',' ||
      quantity === 0 ||
      quantity < 0
    ) {
      alertVisible2(true);
      return;
    }

    onSaveList2();
  };

  const onSaveLists = item => {
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
      addon: '',
      addon_price: 0,
      addon_cost: 0,
      option: '',
      withAddtional: false,
    };
    onSaveList(list, user, store_info);
  };
  const onSaveWithAddon = () => {
    let list = {
      _partition: `project=${user.id}`,
      _id: product_info._id,
      name: product_info.name + `, ${selectedVariant.name}`,
      brand: product_info.brand,
      oprice: selectedVariant.cost,
      sprice: selectedVariant.price,
      unit: product_info.unit,
      category: product_info.category,
      store_id: store_info._id,
      store: product_info.store,
      quantity: aqty,
      uid: product_info.pr_id,
      timeStamp: moment().unix(),
      addon: selectedAddon.name,
      addon_price: selectedAddon.price,
      addon_cost: selectedAddon.cost,
      option: selectedOption.option,
      withAddtional: true,
    };
    onSaveList(list, user, store_info);
    setWithAdditional(false);
    setAqty(1), setSelectedAddon({name: '', price: 0, cost: 0});
    setSelectedVariant({name: '', price: 0, cost: 0});
    setSelectedOption({opton: ''});
  };

  const withAddtional = item => {
    setWithAdditional(true);
    setProductInfo(item);
  };

  const onselectVariant = item => {
    if (item._id === selectedVariant._id) {
      setSelectedVariant({name: '', price: 0, cost: 0});
      return;
    }
    setSelectedVariant(item);
  };

  const onselectAddon = item => {
    if (item._id === selectedAddon._id) {
      setSelectedAddon({name: '', price: 0, cost: 0});
      return;
    }
    setSelectedAddon(item);
  };

  const onselectOption = item => {
    if (item._id === selectedOption._id) {
      setSelectedOption({opton: ''});
      return;
    }
    setSelectedOption(item);
  };
  const _renderitem = ({item}) => (
    <TouchableWithoutFeedback
      onPress={() =>
        item.withAddons == true ||
        item.withOptions == true ||
        item.withVariants == true
          ? withAddtional(item)
          : onSaveLists(item)
      }>
      <View style={styles.itemContainer}>
        <View>
          <FastImage
            style={styles.stretch}
            source={
              item.img === null || item.img === ''
                ? require('../../assets/noproduct.png')
                : {
                    uri: item.img,
                    headers: {Authorization: 'auth-token'},
                    priority: FastImage.priority.high,
                  }
            }
            resizeMode={FastImage.resizeMode.contain}
          />
          {/* {
   item.stock <= 0 ?
   <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
       <Text style={{color: colors.red, fontWeight:'bold'}}>Out of Stock</Text>
     </View>
    : null} */}
        </View>
        <View>
          <Text
            style={{
              fontSize: 14,
              color: colors.primary,
              fontWeight: '500',
              textAlign: 'center',
            }}>
            {formatMoney(item.sprice, {symbol: '₱', precision: 2})}
          </Text>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={{color: 'gray', textAlign: 'center', fontSize: 13}}>
            {item.stock} {item.unit}
          </Text>
        </View>

        {products_list.map(items => {
          return (
            items._id === item._id && (
              <View
                style={{
                  position: 'absolute',
                  top: 5,
                  left: 5,
                  bottom: 0,
                  color: colors.white,
                  backgroundColor: colors.accent,
                  height: 35,
                  width: 35,
                  borderRadius: 25,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: colors.white,
                  }}>
                  {items.quantity}
                </Text>
              </View>
            )
          );
        })}
        {item.stock <= 10 ? (
          <View style={styles.container}>
            <View style={[styles.label, {height: 20}]}>
              <Text
                style={{
                  color: colors.white,
                  fontSize: 11,
                  fontWeight: 'bold',
                }}>
                Low stock
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );

  const onCancel = () => {
    alertVisible2(!alerts2);
  };

  return (
    <View style={{flex: 1, marginBottom: 80}}>
      <Alert
        visible={alerts}
        onCancel={onCancelAlert}
        onProceed={onCancelAlert}
        title="No Logged In Attendant"
        content="Please logged in first before you proceed."
        confirmTitle="OK"
      />

      <Alert
        visible={alerts2}
        onCancel={onCancel}
        onProceed={onCancel}
        title="Invalid Input"
        content="Input must be a number."
        confirmTitle="OK"
      />
      <Alert
        visible={alerts2}
        onCancel={onCancel}
        onProceed={onCancel}
        title="Invalid INput"
        content="Input value must be equal or lesser than the number of stocks."
        confirmTitle="OK"
      />
      {search && (
        <SearchBar term={term} onTermChange={setTerm}>
          <TouchableOpacity
            style={styles.iconStyle}
            onPress={() => toggleSearch(false)}>
            <Feather name={'x-circle'} size={20} color={colors.black} />
          </TouchableOpacity>
        </SearchBar>
      )}
      {scan && (
        <View style={styles.textInputContainer}>
          <TextInput
            value={bcode}
            onChangeText={text => {
              setBarcode(text);
            }}
            onFocus={() => {
              toggleBarcode(true); // Show the clear button on focus
            }}
            autoFocus
            onBlur={() => {
              // Hide the clear button after a delay (500ms in this example)
              setTimeout(() => {
                toggleBarcode(false);
                setBarcode('');
                toggleBarcode(true);
              }, 300);
            }}
            style={styles.textInput}
          />
          {bcode !== '' && (
            <TouchableOpacity
              style={styles.iconStyle}
              onPress={() => setBarcode('')}>
              <Feather name={'x-circle'} size={20} color={colors.black} />
            </TouchableOpacity>
          )}
        </View>
      )}
      <Categories onTabChange={onTabChange} store_info={store_info} />
      <BigList
        data={filteredProductss}
        numColumns={3} // Set the number of columns
        renderItem={_renderitem}
        keyExtractor={item => item._id}
        itemHeight={180}
        headerHeight={90}
        footerHeight={100}
        style={{backgroundColor: 'red'}}
      />

      <Overlay
        fullScreen
        isVisible={additionals}
        onBackdropPress={() => setWithAdditional(false)}>
        <View style={styles.header}>
          <ImageBackground
            blurRadius={1}
            style={styles.stretch2}
            source={
              product_info.img === null || item.img === ''
                ? require('../../assets/noproduct.png')
                : {uri: product_info.img}
            }>
            <FastImage
              style={styles.stretch2}
              source={
                product_info.img === null || item.img === ''
                  ? require('../../assets/noproduct.png')
                  : {
                      uri: product_info.img,
                      headers: {Authorization: 'auth-token'},
                      priority: FastImage.priority.high,
                    }
              }
              resizeMode={FastImage.resizeMode.contain}
            />
          </ImageBackground>
          <View style={{position: 'absolute', left: 20, top: 20, zIndex: 1}}>
            <TouchableOpacity onPress={() => setWithAdditional(false)}>
              <EvilIcons name={'arrow-left'} size={45} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flex: 3}}>
            <Text style={{fontSize: 20, marginLeft: 15}}>
              {product_info.name}
            </Text>
            <Text style={{fontSize: 15, marginLeft: 15}}>
              {product_info.brand}
            </Text>
          </View>
          <View style={{marginRight: 30, flex: 1, height: 70}}>
            <View style={{flexDirection: 'row', flex: 1}}>
              {aqty > 1 ? (
                <TouchableOpacity style={styles.plusBtn}>
                  <EvilIcons
                    onPress={() => setAqty(aqty - 1)}
                    name={'minus'}
                    size={20}
                    color={colors.white}
                  />
                </TouchableOpacity>
              ) : null}
              <Text
                style={{
                  fontSize: 20,
                  textAlign: 'center',
                  paddingHorizontal: 15,
                }}>
                {aqty}
              </Text>
              <TouchableOpacity
                onPress={() => setAqty(aqty + 1)}
                style={styles.plusBtn}>
                <EvilIcons name={'plus'} size={20} color={colors.white} />
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, marginLeft: 10}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: colors.primary,
                }}>
                {' '}
                {formatMoney(
                  (total + selectedVariant.price + selectedAddon.price) * aqty,
                  {symbol: '₱', precision: 2},
                )}
              </Text>
            </View>
          </View>
        </View>
        <ScrollView style={{marginBottom: 50}}>
          <ScrollView horizontal>
            {product_info.withVariants && (
              <View>
                <Text style={{fontSize: 20, marginLeft: 15, marginTop: 20}}>
                  Variants
                </Text>
                <View style={{flexDirection: 'row'}}>
                  {inventory.map(item =>
                    product_info._id === item.product_id ? (
                      <TouchableOpacity
                        onPress={() => onselectVariant(item)}
                        style={
                          selectedVariant._id === item._id
                            ? [
                                styles.additionalCard,
                                {
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  padding: 15,
                                  width: windowWidth / 3 - 20,
                                  borderWidth: 1,
                                  borderColor: colors.primary,
                                },
                              ]
                            : [
                                styles.additionalCard,
                                {
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  padding: 15,
                                  width: windowWidth / 3 - 20,
                                },
                              ]
                        }>
                        {selectedVariant._id === item._id ? (
                          <Ionicons
                            name={'checkmark-circle'}
                            size={20}
                            color={colors.primary}
                            style={{position: 'absolute', top: 5, right: 5}}
                          />
                        ) : null}
                        <Text>{item.name}</Text>
                        <Text
                          style={{
                            color: colors.accent,
                            fontWeight: 'bold',
                            marginTop: 5,
                          }}>
                          {formatMoney(item.price, {
                            symbol: '₱',
                            precision: 2,
                          })}
                        </Text>
                      </TouchableOpacity>
                    ) : null,
                  )}
                </View>
              </View>
            )}
          </ScrollView>
          <ScrollView horizontal>
            {product_info.withAddons && (
              <View>
                <Text style={{fontSize: 20, marginLeft: 15, marginTop: 15}}>
                  Addons
                </Text>
                <View style={{flexDirection: 'row'}}>
                  {addon.map(item =>
                    product_info._id === item.product_id ? (
                      <TouchableOpacity
                        onPress={() => onselectAddon(item)}
                        style={
                          selectedAddon._id === item._id
                            ? [
                                styles.additionalCard,
                                {
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  padding: 15,
                                  width: windowWidth / 3 - 20,
                                  borderWidth: 1,
                                  borderColor: colors.primary,
                                },
                              ]
                            : [
                                styles.additionalCard,
                                {
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  padding: 15,
                                  width: windowWidth / 3 - 20,
                                },
                              ]
                        }>
                        <Text>{item.name}</Text>
                        <Text
                          style={{
                            color: colors.accent,
                            fontWeight: 'bold',
                            marginTop: 5,
                          }}>
                          {formatMoney(item.price, {
                            symbol: '₱',
                            precision: 2,
                          })}
                        </Text>
                        {selectedAddon._id === item._id ? (
                          <Ionicons
                            name={'checkmark-circle'}
                            size={20}
                            color={colors.primary}
                            style={{position: 'absolute', top: 5, right: 5}}
                          />
                        ) : null}
                      </TouchableOpacity>
                    ) : null,
                  )}
                </View>
              </View>
            )}
          </ScrollView>

          <ScrollView horizontal>
            {product_info.withOptions && (
              <View>
                <Text style={{fontSize: 20, marginLeft: 15, marginTop: 15}}>
                  Options
                </Text>
                <View style={{flexDirection: 'row'}}>
                  {option.map(item =>
                    product_info._id === item.product_id ? (
                      <TouchableOpacity
                        onPress={() => onselectOption(item)}
                        style={
                          selectedOption._id === item._id
                            ? [
                                styles.additionalCard,
                                {
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  padding: 15,
                                  width: windowWidth / 3 - 20,
                                  borderWidth: 1,
                                  borderColor: colors.primary,
                                },
                              ]
                            : [
                                styles.additionalCard,
                                {
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  padding: 15,
                                  width: windowWidth / 3 - 20,
                                },
                              ]
                        }>
                        {selectedOption._id === item._id ? (
                          <Ionicons
                            name={'checkmark-circle'}
                            size={20}
                            color={colors.primary}
                            style={{position: 'absolute', top: 5, right: 5}}
                          />
                        ) : null}
                        <Text>{item.option}</Text>
                      </TouchableOpacity>
                    ) : null,
                  )}
                </View>
              </View>
            )}
          </ScrollView>
        </ScrollView>
        <View
          style={{
            flex: 1,
            marginBottom: 16,
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            style={{
              height: 50,
              borderRadius: 12,
              width: windowWidth * 0.9,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.primary,
              shadowRadius: 12,
              shadowOpacity: 0.5,
              shadowColor: '#805bfa',
              shadowOffset: {
                width: 0,
                height: 3,
              },
            }}
            onPress={() => onSaveWithAddon()}>
            <Text style={{color: '#fff', fontFamily: 'Roboto-Bold'}}>
              Add to Cart
            </Text>
          </TouchableOpacity>
        </View>
      </Overlay>

      <Overlay
        overlayStyle={{width: '80%', borderRadius: 10, padding: 20}}
        isVisible={overlay}
        onBackdropPress={overlayVisible}>
        <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>
          Quantity of {item.name}{' '}
        </Text>
        <View style={{marginHorizontal: 20}}>
          <TextInput
            mode="outlined"
            onChangeText={text => setQuantity(text)}
            keyboardType="decimal-pad"
            defaultValue="1"
            style={{margin: 20, textAlign: 'center', marginHorizontal: 70}}
            theme={{
              colors: {primary: colors.accent, underlineColor: 'transparent'},
            }}
          />
        </View>
        <View
          style={{
            margin: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Button
            buttonStyle={{
              backgroundColor: colors.red,
              borderRadius: 5,
              paddingHorizontal: 20,
            }}
            title="  Cancel  "
            onPress={() => overlayVisible(false)}
          />
          <Button
            buttonStyle={{
              backgroundColor: colors.accent,
              borderRadius: 5,
              paddingHorizontal: 20,
            }}
            title="  Save  "
            onPress={() => handleInput()}
          />
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          {/* <View style={{flex: 2,  margin: 5}}>
          <Button buttonStyle={{backgroundColor: colors.red}} title="Add B.O" onPress={()=> onCreateBO()}/>
          </View>
          <View style={{flex: 2,  margin: 5}}>
          <Button buttonStyle={{backgroundColor: colors.red}} title="Add to Return" onPress={()=> onCreateReturn()}/>
          </View>*/}
        </View>
      </Overlay>
    </View>
  );
}

const styles = StyleSheet.create({
  plusBtn: {
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    height: 30,
    width: 30,
    shadowColor: '#EBECF0',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.89,
    shadowRadius: 2,
    elevation: 5,
  },
  minusBtn: {
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    height: 45,
    width: 45,
    shadowColor: '#EBECF0',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.89,
    shadowRadius: 2,
    elevation: 5,
  },
  header: {
    backgroundColor: colors.white,
    shadowColor: '#EBECF0',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.89,
    shadowRadius: 2,
    elevation: 5,
    borderRadius: 10,
    zIndex: 0,
  },
  itemContainer: {
    marginTop: 5,
    marginHorizontal: 5,
    backgroundColor: colors.white,
    flexDirection: 'column',
    borderRadius: 7,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.89,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  additionalCard: {
    flex: 1,
    marginTop: 5,
    marginHorizontal: 5,
    backgroundColor: colors.white,
    flexDirection: 'column',
    borderRadius: 15,
    shadowColor: '#EBECF0',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.89,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
    textAlign: 'center',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
  stretch: {
    width: windowWidth / 3 - 10,

    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  stretch2: {
    width: windowWidth - 15,
    height: windowHeight / 3 - 20,
    borderRadius: 10,
  },
  iconStyle: {
    fontSize: 25,
    alignSelf: 'center',
    marginHorizontal: 15,
  },
  text: {
    fontSize: 30,
  },
  iconStyle: {
    fontSize: 25,
    alignSelf: 'center',
    marginHorizontal: 15,
  },
  container: {
    position: 'absolute',
    transform: [{rotate: '40deg'}],
    right: -25,
    top: 13,
    backgroundColor: 'red',
    width: 100,
  },
  modalView: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
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
    borderWidth: 1,
  },
  label: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  iconStyle: {
    padding: 4,
  },
  discountButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 10,
  },
  discountButton2: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
});
