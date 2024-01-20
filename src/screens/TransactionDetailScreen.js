import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import AppHeader from "../components/AppHeader";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import colors from "../themes/colors";
import { ListItem, Card, Overlay } from "react-native-elements";
import { useStore } from "../context/StoreContext";
import formatMoney from "accounting-js/lib/formatMoney.js";
import {
  BluetoothEscposPrinter,
  BluetoothManager,
  BluetoothTscPrinter,
} from "react-native-bluetooth-escpos-printer";
import SmoothPinCodeInput from "react-native-smooth-pincode-input";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";
import AlertwithChild from "../components/AlertwithChild";
import SearchInput, { createFilter } from "react-native-search-filter";

const KEYS_TO_FILTERS = ["tr_id"];
const TransactionSetailsScreen = ({ navigation, route }) => {
  const { transactions, store_info } = route.params;
  const {
    getTRDetails,
    trdetails,
    onVoidSingleTransaction,
    custom_trdetails,
    fontHeaderSize,
    fontBodySize,
  } = useStore();
  const [reason, setReason] = useState("");
  const [alerts, alertVisible] = useState(false);
  const [pinVisible, setPinVisible] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [items, setItem] = useState([]);

  const filteredTRDetails = custom_trdetails.filter(
    createFilter(transactions._id, KEYS_TO_FILTERS)
  );
  const onCancelAlert = () => {
    alertVisible(false);
  };
  const printReceipt = async () => {
    try {
      await BluetoothEscposPrinter.printerInit();
      await BluetoothEscposPrinter.printerLeftSpace(0);

      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER
      );
      await BluetoothEscposPrinter.setBlob(0);
      await BluetoothEscposPrinter.printText(`${store_info.name}\r\n`, {
        encoding: "CP437",
        codepage: 0,
        widthtimes: 0,
        heigthtimes: 1,
        fonttype: fontHeaderSize,
        fontSize: fontHeaderSize,
      });
      await BluetoothEscposPrinter.setBlob(0);
      await BluetoothEscposPrinter.printText(`${store_info.branch}\r\n\r\n`, {
        encoding: "CP437",
        codepage: 0,
        widthtimes: 1,
        heigthtimes: 0,
        fonttype: fontHeaderSize,
        fontSize: fontHeaderSize,
      });
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.LEFT
      );
      await BluetoothEscposPrinter.printText(
        `Receipt No :        ${transactions.timeStamp} \r\n`,
        {
          encoding: "CP437",
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: fontBodySize,
        }
      );
      await BluetoothEscposPrinter.printText(
        "Date / Time :       " +
          `${moment
            .unix(transactions.timeStamp)
            .format("DD MMM YYYY hh:mmA")}` +
          "\r\n",
        {
          encoding: "CP437",
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: fontBodySize,
        }
      );
      await BluetoothEscposPrinter.printText(
        `Attendant :         ${transactions.attendant_name}\r\n`,
        {
          encoding: "CP437",
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: fontBodySize,
        }
      );
      await BluetoothEscposPrinter.printText(
        "--------------------------------",
        {}
      );
      let columnWidths = [35, 8];
      await BluetoothEscposPrinter.printColumn(
        columnWidths,
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        ["Description", "Amount"],
        {
          encoding: "CP437",
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: fontBodySize,
        }
      );
      filteredTRDetails.map(async (item, index) => {
        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            `${item.name} - ${item.brand} ${
              item.quantity
            }x${formatMoney(item.sprice, { symbol: "₱", precision: 2 })}   `,
            `${formatMoney(item.quantity * item.sprice, {
              symbol: "₱",
              precision: 2,
            })}`,
          ],
          {
            encoding: "CP437",
            codepage: 0,
            widthtimes: 0,
            heigthtimes: 0,
            fonttype: fontBodySize,
          }
        );
        await BluetoothEscposPrinter.printText("\r\n", {});
      });

      await BluetoothEscposPrinter.printText(
        "--------------------------------",
        {}
      );
      let columnWidthss = [21, 6, 8, 8];
      await BluetoothEscposPrinter.printColumn(
        columnWidthss,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        [
          "Total",
          "",
          "",
          `${formatMoney(calculateTotal(), { symbol: "₱", precision: 2 })}`,
        ],
        {
          encoding: "Cp1254",
          encoding: "CP437",
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: fontBodySize,
        }
      );
      await BluetoothEscposPrinter.printColumn(
        columnWidthss,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        [
          "Discount",
          "",
          "",
          `${formatMoney(calculateTotal() * (transactions.discount / 100), {
            symbol: "₱",
            precision: 2,
          })}`,
        ],
        {
          encoding: "CP437",
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: fontBodySize,
        }
      );
      await BluetoothEscposPrinter.printColumn(
        columnWidthss,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        [
          "Total",
          "",
          " ",
          `${formatMoney(
            calculateTotal() - calculateTotal() * (transactions.discount / 100),
            { symbol: "₱", precision: 2 }
          )}`,
        ],
        {
          encoding: "CP437",
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: fontBodySize,
        }
      );
      await BluetoothEscposPrinter.printColumn(
        columnWidthss,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        [
          "Cash Received",
          "",
          " ",
          `${formatMoney(transactions.received, {
            symbol: "₱",
            precision: 0,
          })}`,
        ],
        {
          encoding: "CP437",
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: fontBodySize,
        }
      );
      await BluetoothEscposPrinter.printColumn(
        columnWidthss,
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        [
          "Change",
          "",
          " ",
          `${formatMoney(
            transactions.received -
              (calculateTotal() -
                calculateTotal() * (transactions.discount / 100)),
            {
              symbol: "₱",
              precision: 2,
            }
          )}`,
        ],
        {
          encoding: "CP437",
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: fontBodySize,
        }
      );

      await BluetoothEscposPrinter.printText("\r\n\r\n\r\n\r\n", {});
    } catch (e) {
      alert(e.message || "ERROR");
    }
  };

  const renderItem = ({ item }) =>
    item.status == "Completed" && (
      // <ListItem containerStyle={{height: 50}} bottomDivider>
      //            <Text>x{Math.round(item.quantity * 100) / 100}</Text>
      //             <ListItem.Content style={{flexDirection:'row', justifyContent:'space-between'}}>
      //                 <View>
      //                 <Text>{item.name}</Text>
      //                  <Text style={{color: colors.statusBarCoverDark}}>{formatMoney(item.quantity *( item.sprice + item.addon_price), { symbol: "₱", precision: 2 })}</Text>
      //                 </View>

      //                 <ListItem.Subtitle>
      //                 <Text>with {item.addon}, {item.option}</Text>

      //                 </ListItem.Subtitle>

      //             </ListItem.Content>

      //         </ListItem>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 10,
          marginVertical: 10,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text style={{ textAlign: "center", paddingRight: 30 }}>
            x{Math.round(item.quantity * 100) / 100}
          </Text>
          <View style={{ flexDirection: "column" }}>
            <Text>{item.name}</Text>
            <Text>
              with {item.addon}, {item.option}
            </Text>
          </View>
        </View>

        <Text style={{ color: colors.statusBarCoverDark, textAlign: "center" }}>
          {formatMoney(item.quantity * (item.sprice + item.addon_price), {
            symbol: "₱",
            precision: 2,
          })}
        </Text>
        {filteredTRDetails.length === 1 && item.quantity === 1 ? null : (
          <TouchableOpacity
            onPress={() => {
              alertVisible(true), setItem(item);
            }}
            style={{
              width: 50,
              backgroundColor: colors.red,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 5,
              borderRadius: 15,
              height: 30,
            }}
          >
            <Text style={{ fontSize: 10, color: colors.white }}>Void</Text>
          </TouchableOpacity>
        )}
      </View>
    );

  const calculateTotal = () => {
    let total = 0;
    filteredTRDetails.forEach((list) => {
      if (list.status == "Completed") {
        total += list.quantity * (list.sprice + list.addon_price);
      }
    });
    return total;
  };

  const onProceed = () => {
    onVoidSingleTransaction(items, reason);
    setPinVisible(false);
    alertVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <AlertwithChild
        visible={alerts}
        onCancel={onCancelAlert}
        onProceed={() => setPinVisible(true)}
        title="Void Item?"
        confirmTitle="PROCEED"
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-evenly",
            marginVertical: 2,
            alignItems: "center",
          }}
        >
          <Text>Please select reason: </Text>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <TouchableOpacity
              style={
                reason === "Return" ? styles.selectedBtn : styles.reasonBTn
              }
              onPress={() => setReason("Return")}
            >
              <Text
                style={
                  reason === "Return"
                    ? { fontSize: 13, color: colors.white, fontWeight: "bold" }
                    : { fontSize: 13, color: colors.black, fontWeight: "bold" }
                }
              >
                Return
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                reason === "Change Item" ? styles.selectedBtn : styles.reasonBTn
              }
              onPress={() => setReason("Change Item")}
            >
              <Text
                style={
                  reason === "Change Item"
                    ? { fontSize: 12, color: colors.white, fontWeight: "bold" }
                    : { fontSize: 12, color: colors.black, fontWeight: "bold" }
                }
              >
                Change Item
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                reason === "Refunded" ? styles.selectedBtn : styles.reasonBTn
              }
              onPress={() => setReason("Refunded")}
            >
              <Text
                style={
                  reason === "Refunded"
                    ? { fontSize: 13, color: colors.white, fontWeight: "bold" }
                    : { fontSize: 13, color: colors.black, fontWeight: "bold" }
                }
              >
                Refunded
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </AlertwithChild>
      <AlertwithChild
        visible={pinVisible}
        onCancel={() => setPinVisible(false)}
        onProceed={() => onProceed()}
        title="Enter your code"
        confirmTitle="PROCEED"
      >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-evenly",
            marginVertical: 2,
            alignItems: "center",
          }}
        >
          <View style={{ padding: 20 }}>
            <SmoothPinCodeInput
              password
              mask="﹡"
              cellStyle={{
                borderWidth: 1,
                borderColor: "gray",
                borderRadius: 15,
              }}
              cellSize={35}
              codeLength={6}
              value={code}
              onTextChange={(code) => setCode(code)}
            />

            {error.length !== 0 ? (
              <Text style={{ textAlign: "center", color: colors.red }}>
                {error}
              </Text>
            ) : null}
          </View>
        </View>
      </AlertwithChild>
      <AppHeader
        centerText="Transaction Details"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <EvilIcons name={"arrow-left"} size={35} color={colors.white} />
          </TouchableOpacity>
        }
      />

      <ScrollView style={{ padding: 15, backgroundColor: colors.white }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 15,
          }}
        >
          <View>
            <Text style={{ fontWeight: "500" }}>
              Customer :{" "}
              {transactions.customer_name ? transactions.customer_name : "None"}
            </Text>
            <Text style={{ fontWeight: "500" }}>
              Date : {transactions.date}
            </Text>
            <Text style={{ fontWeight: "500" }}>
              Receipt # : {transactions.timeStamp}
            </Text>
            <Text style={{ fontWeight: "500" }}>
              Status : {transactions.status}
            </Text>
            <Text style={{ fontWeight: "500" }}>
              Customer Name : {transactions.customer_name}
            </Text>
            <Text style={{ fontWeight: "500" }}>
              Cashier Name : {transactions.attendant_name}
            </Text>
          </View>
          <TouchableOpacity onPress={() => printReceipt()}>
            <AntDesign name={"printer"} size={25} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ListItem bottomDivider>
          <ListItem.Content
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "bold", paddingRight: 20 }}>Qty</Text>
              <Text style={{ fontWeight: "bold" }}>Product</Text>
            </View>

            <Text style={{ fontWeight: "bold" }}>Total</Text>
            <Text style={{ fontWeight: "bold" }}>Action</Text>
          </ListItem.Content>
        </ListItem>
        <FlatList
          keyExtractor={(key) => key.name}
          data={filteredTRDetails}
          renderItem={renderItem}
        />
        <ListItem>
          <ListItem.Content
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>Sub Total</Text>
            <Text></Text>
            <Text style={{ color: colors.statusBarCoverDark }}>
              {formatMoney(calculateTotal(), { symbol: "₱", precision: 2 })}
            </Text>
          </ListItem.Content>
        </ListItem>
        <ListItem style={{ marginTop: -20 }}>
          <ListItem.Content
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontWeight: "bold", color: colors.red }}>
              Discount
            </Text>
            <Text></Text>
            <Text style={{ fontWeight: "bold", color: colors.red }}>
              -
              {formatMoney(transactions.discount, {
                symbol: "₱",
                precision: 2,
              })}
            </Text>
          </ListItem.Content>
        </ListItem>
        <ListItem style={{ marginTop: -20 }}>
          <ListItem.Content
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{ fontWeight: "bold", fontSize: 18, color: colors.green }}
            >
              Total
            </Text>
            <Text></Text>
            <Text
              style={{ fontWeight: "bold", fontSize: 18, color: colors.green }}
            >
              {formatMoney(calculateTotal() - transactions.discount, {
                symbol: "₱",
                precision: 2,
              })}
            </Text>
          </ListItem.Content>
        </ListItem>
        <ListItem style={{ marginTop: -20 }}>
          <ListItem.Content
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>VAT Sales</Text>
            <Text></Text>
            <Text>
              {formatMoney(
                calculateTotal() -
                  (calculateTotal() - transactions.discount) * 0.12,
                { symbol: "₱", precision: 2 }
              )}
            </Text>
          </ListItem.Content>
        </ListItem>
        <ListItem style={{ marginTop: -20 }}>
          <ListItem.Content
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text>VAT Amount</Text>
            <Text></Text>
            <Text>
              {formatMoney((calculateTotal() - transactions.discount) * 0.12, {
                symbol: "₱",
                precision: 2,
              })}
            </Text>
          </ListItem.Content>
        </ListItem>
        <View style={{ margin: 15 }}>
          <Text style={{ textAlign: "center" }}>Voided Products</Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 10,
            }}
          >
            <Text style={{ flex: 2 }}>Item</Text>
            <Text style={{ flex: 1 }}>Total</Text>
            <Text>Reason</Text>
          </View>
          <View>
            {filteredTRDetails.map(
              (item) =>
                item.status == "Voided" && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginVertical: 10,
                    }}
                  >
                    <Text style={{ textAlign: "left", flex: 2 }}>
                      x{item.quantity} {item.name}
                    </Text>
                    <Text style={{ flex: 1, textAlign: "center" }}>
                      {formatMoney(
                        item.quantity * (item.sprice + item.addon_price),
                        { symbol: "₱", precision: 2 }
                      )}
                    </Text>
                    <Text style={{ flex: 1, textAlign: "center" }}>
                      {item.void_reason}
                    </Text>
                  </View>
                )
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
  },
  reasonBTn: {
    padding: 6,
    borderColor: colors.black,
    borderWidth: 1,
    backgroundColor: colors.white,
    borderRadius: 15,
    marginVertical: 10,
    marginHorizontal: 2,
  },
  selectedBtn: {
    padding: 6,
    borderColor: colors.primary,
    borderWidth: 1,
    backgroundColor: colors.primary,
    borderRadius: 15,
    marginVertical: 10,
    marginHorizontal: 2,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 8,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default TransactionSetailsScreen;
