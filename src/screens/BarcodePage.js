import React, { useState, useRef, useEffect } from "react";
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
  TextInput,
  Button,
  Keyboard,
} from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SearchInput, { createFilter } from "react-native-search-filter";
import moment from "moment";
import {} from "react-native-paper";
import colors from "../themes/colors";
import AutoFocusClearTextInput from "../components/AutoFocusClearTextInput";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import formatMoney from "accounting-js/lib/formatMoney.js";
import AppHeader from "../components/AppHeader";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
const KEYS_TO_FILTERSs = ["sku"];
const KEYS_TO_INPUT_FILTERS = ["name"];

export default function BarcodePage({ navigation, route }) {
  const { store_info } = route.params;
  const { user } = useAuth();
  const {
    products,
    onSaveList,
    products_list,
    updateProductOnClear,
    deleteItem,
  } = useStore();

  const [scan, toggleBcode] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [scanned, setScanned] = useState([]);
  const [no_product, setNoProduct] = useState(false);
  const [total, setTotal] = useState(0);
  const [kboardToggled, setKeyboardToggled] = useState(true);
  const [inputtedBarcode, setInputtedBarcode] = useState("");

  const filteredInputtedProduct = products.filter(
    createFilter(inputtedBarcode, KEYS_TO_INPUT_FILTERS)
  );

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused.
      toggleBcode(true);
      return () => {
        // Do something when the screen is unfocused
        toggleBcode(false);
      };
    }, [])
  );

  const calculateTotal = () => {
    let total = 0;
    products_list.forEach((item) => {
      total += item.sprice * item.quantity;
    });
    return total;
  };

  const toggleKeyboard = () => {
    if (kboardToggled) {
      setKeyboardToggled(false);
    } else {
      setKeyboardToggled(true);
    }
  };

  const handleOnClickInputtedProduct = (iproduct) => {
    const inputtedProduct = {
      _partition: `project=${user.id}`,
      _id: iproduct._id,
      name: iproduct.name,
      brand: iproduct.brand,
      oprice: iproduct.oprice,
      sprice: iproduct.sprice,
      unit: iproduct.unit,
      category: iproduct.category,
      store_id: store_info._id,
      store: iproduct.store,
      quantity: 1,
      uid: iproduct.pr_id,
      timeStamp: moment().unix(),
      addon: "",
      sku: iproduct.sku,
      addon_price: 0,
      addon_cost: 0,
      option: "",
      withAddtional: false,
    };
    onSaveList(inputtedProduct, user, store_info);
  };

  const handleScannedBarcode = (code) => {
    const filteredProducts = products.filter(
      createFilter(code, KEYS_TO_FILTERSs)
    );

    if (filteredProducts.length > 0) {
      const scannedProduct = scanned.find((item) => item.sku === code);

      if (scannedProduct) {
        const newScannedProduct = {
          _partition: `project=${user.id}`,
          _id: filteredProducts[0]._id,
          name: filteredProducts[0].name,
          brand: filteredProducts[0].brand,
          oprice: filteredProducts[0].oprice,
          sprice: filteredProducts[0].sprice,
          unit: filteredProducts[0].unit,
          category: filteredProducts[0].category,
          store_id: store_info._id,
          store: filteredProducts[0].store,
          quantity: 1,
          uid: filteredProducts[0].pr_id,
          timeStamp: moment().unix(),
          addon: "",
          sku: filteredProducts[0].sku,
          addon_price: 0,
          addon_cost: 0,
          option: "",
          withAddtional: false,
        };

        onSaveList(newScannedProduct, user, store_info);
        setNoProduct(false);
      } else {
        // If no product with the same SKU exists, add the scanned product to the array
        const newScannedProduct = {
          _partition: `project=${user.id}`,
          _id: filteredProducts[0]._id,
          name: filteredProducts[0].name,
          brand: filteredProducts[0].brand,
          oprice: filteredProducts[0].oprice,
          sprice: filteredProducts[0].sprice,
          unit: filteredProducts[0].unit,
          category: filteredProducts[0].category,
          store_id: store_info._id,
          store: filteredProducts[0].store,
          quantity: 1,
          uid: filteredProducts[0].pr_id,
          timeStamp: moment().unix(),
          addon: "",
          sku: filteredProducts[0].sku,
          addon_price: 0,
          addon_cost: 0,
          option: "",
          withAddtional: false,
        };

        onSaveList(newScannedProduct, user, store_info);
        setNoProduct(false);
      }
    } else {
      // Handle the case where no matching product is found
      setNoProduct(true);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        centerText="BARCODE MODE"
        leftComponent={
          <TouchableOpacity
            onPress={() => {
              toggleBcode(false), navigation.goBack();
            }}
          >
            <EvilIcons name={"arrow-left"} size={30} color={colors.white} />
          </TouchableOpacity>
        }
      />

      <View style={{ marginHorizontal: 20, flexDirection: "row" }}>
        {kboardToggled ? (
          <AutoFocusClearTextInput
            scan={scan}
            toggleBarcode={toggleBcode}
            setBCode={handleScannedBarcode}
          />
        ) : (
          <View style={styles.textInputContainer}>
            <TextInput
              value={inputtedBarcode}
              onChangeText={(t) => setInputtedBarcode(t)}
              style={styles.textInput}
            />
          </View>
        )}

        <TouchableOpacity
          style={{ justifyContent: "center", paddingHorizontal: 10 }}
          onPress={toggleKeyboard}
        >
          <FontAwesome
            name={"keyboard-o"}
            size={35}
            color={!kboardToggled ? colors.red : colors.black}
          />
        </TouchableOpacity>
      </View>
      {kboardToggled == false && (
        <ScrollView style={{ height: 150 }}>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            {filteredInputtedProduct.map((element, index) => (
              <TouchableOpacity
                style={{
                  marginTop: 5,
                  marginHorizontal: 20,
                  marginRight: 80,
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  paddingVertical: 10,
                  borderRadius: 10,
                  shadowColor: "#EBECF0",
                  backgroundColor: colors.boldGrey,
                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },
                  shadowOpacity: 0.89,
                  shadowRadius: 2,
                  elevation: 5,
                }}
                onPress={() => handleOnClickInputtedProduct(element)}
              >
                <Text
                  style={{
                    textAlign: "left",
                    fontSize: 18,
                    color: colors.white,
                  }}
                  key={index}
                >
                  {element.name} - {element.brand}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
      <Text
        style={{
          textAlign: "center",
          paddingVertical: 5,
          fontSize: 18,
          fontWeight: "bold",
          color: colors.red,
        }}
      >
        {no_product ?? "No product found."}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          paddingVertical: 20,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 15,
            flex: 1,
            textAlign: "center",
          }}
        >
          Product
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 15,
            flex: 1,
            textAlign: "center",
          }}
        >
          Quantity
        </Text>

        <Text style={{ fontWeight: "bold", fontSize: 15, flex: 1 }}>Total</Text>
        {!kboardToggled && (
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15,
              flex: 1,
              textAlign: "center",
            }}
          >
            Action
          </Text>
        )}
      </View>
      <ScrollView>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          {products_list.map((element, index) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                paddingVertical: 10,
              }}
            >
              <Text style={{ textAlign: "center", flex: 1 }} key={index}>
                {element.name}
              </Text>
              <Text style={{ textAlign: "center", flex: 1 }} key={index}>
                x{element.quantity}
              </Text>
              <Text style={{ textAlign: "left", flex: 1 }} key={index}>
                {formatMoney(element.quantity * element.sprice, {
                  symbol: "₱",
                  precision: 2,
                })}
              </Text>
              {!kboardToggled && (
                <TouchableOpacity
                  style={{
                    flex: 1,

                    alignItems: "center",
                  }}
                  onPress={() => deleteItem(element)}
                >
                  <EvilIcons name={"trash"} size={30} color={colors.red} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      <View
        style={{
          padding: 20,

          borderTopWidth: 1,
          borderTopColor: "gray",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>Total</Text>
        <Text style={{ fontSize: 18 }}>
          {formatMoney(calculateTotal(), { symbol: "₱", precision: 2 })}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "white",
        }}
      >
        <View style={{ flex: 1, margin: 10, flexDirection: "row" }}>
          <TouchableOpacity
            style={
              products_list.length == 0
                ? {
                    backgroundColor: colors.charcoalGrey,
                    marginRight: 2,
                    borderRadius: 15,
                    paddingVertical: 10,
                    flex: 1,
                  }
                : {
                    backgroundColor: colors.accent,
                    marginRight: 2,
                    borderRadius: 15,
                    paddingVertical: 10,
                    flex: 1,
                  }
            }
            onPress={() => {
              products_list.length === 0 ? {} : navigation.navigate("Checkout"),
                toggleBcode(false);
            }}
          >
            <Text style={{ textAlign: "center" }}>P A Y</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: colors.accent,
              width: 100,
              borderRadius: 15,
              justifyContent: "center",
            }}
            onPress={() => updateProductOnClear(products_list)}
          >
            <Text
              style={{
                textAlign: "center",
                color: colors.white,
                fontWeight: "bold",
              }}
            >
              Clear All
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    padding: 8,
    flex: 1,
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
