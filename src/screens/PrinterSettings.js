import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Picker,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import {
  BluetoothEscposPrinter,
  BluetoothManager,
  BluetoothTscPrinter,
} from "react-native-bluetooth-escpos-printer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStore } from "../context/StoreContext";
import AppHeader from "../components/AppHeader";
import { colors } from "../constants/theme";
import { TextInput } from "react-native-paper";
import { CheckBox } from "react-native-elements";

const PrintingSettings = ({ navigation }) => {
  const {
    fontType,
    fontHeaderSize,
    fontBodySize,
    updateFontSettings,
  } = useStore(); // Update this line to use the correct context
  const [selectedFont, setSelectedFont] = useState(fontType);
  const [selectedHeaderFontSize, setSelectedHeaderFontSize] = useState(
    fontHeaderSize
  );
  const [selectedBodyFontSize, setSelectedBodyFontSize] = useState(
    fontBodySize
  );
  const [textToPrint, setTextToPrint] = useState("Hello, world!");
  const [header, setTextToPrintHeader] = useState("Hello, world!");
  const [bussName, setBussinessName] = useState("");
  const [address, setAddress] = useState("");
  const [showInReceiptBName, setShowInReceiptBName] = useState(false);
  const [showInReceiptBAdd, setShowInReceiptBAdd] = useState(false);
  const handlePrint = async () => {
    await BluetoothEscposPrinter.printerInit();
    await BluetoothEscposPrinter.printerLeftSpace(0);

    await BluetoothEscposPrinter.printerAlign(
      BluetoothEscposPrinter.ALIGN.CENTER
    );
    await BluetoothEscposPrinter.setBlob(0);
    await BluetoothEscposPrinter.printText(`${header}\r\n`, {
      encoding: "CP437",
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 1,
      fonttype: selectedHeaderFontSize,
      fontSize: selectedHeaderFontSize,
    });
    await BluetoothEscposPrinter.setBlob(0);
    await BluetoothEscposPrinter.printText(textToPrint, {
      encoding: "CP437",
      codepage: 0,
      widthtimes: 0,
      heigthtimes: 0,
      fonttype: selectedBodyFontSize,
      fontSize: selectedBodyFontSize, // Use fontsize instead of fonttype
    });
  };

  const handleHeaderSizeTypeChange = async (newHeaderFontSize) => {
    setSelectedHeaderFontSize(parseInt(newHeaderFontSize));
    await updateFontSettings(selectedBodyFontSize, newHeaderFontSize);
  };

  const handleBodyFontSizeChange = async (newBodyFontSize) => {
    setSelectedBodyFontSize(parseInt(newBodyFontSize));
    await updateFontSettings(newBodyFontSize, selectedHeaderFontSize);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <AppHeader
        centerText="Printing Settings"
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <EvilIcons name={"arrow-left"} size={35} color={colors.white} />
          </TouchableOpacity>
        }
      />
      <CheckBox
        right
        title="Show in receipt"
        containerStyle={{
          backgroundColor: colors,
          marginBottom: -10,
          height: 20,
          borderWidth: 0,
        }}
        checked={showInReceiptBName}
        onPress={() => setShowInReceiptBName(!showInReceiptBName)}
      />
      <TextInput
        label="Bussiness Name"
        value={bussName}
        multiline
        numberOfLines={2}
        style={{ padding: 10 }}
        mode="outlined"
        onChangeText={setBussinessName}
      />
      <CheckBox
        right
        title="Show in receipt"
        containerStyle={{
          backgroundColor: colors,
          marginBottom: -10,
          height: 20,
          borderWidth: 0,
        }}
        checked={showInReceiptBAdd}
        onPress={() => setShowInReceiptBAdd(!showInReceiptBAdd)}
      />
      <TextInput
        label="Business Address"
        value={address}
        multiline
        numberOfLines={3}
        style={{ padding: 10 }}
        mode="outlined"
        onChangeText={setAddress}
      />
      <ScrollView>
        <View
          style={{ borderWidth: 1, margin: 10, borderRadius: 5, padding: 10 }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>
            Header Font Size
          </Text>
          <Picker
            selectedValue={selectedHeaderFontSize.toString()} // Convert to string
            onValueChange={handleHeaderSizeTypeChange}
          >
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
          </Picker>
        </View>
        <View
          style={{ borderWidth: 1, margin: 10, borderRadius: 5, padding: 10 }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>
            Body Font Size
          </Text>
          <Picker
            selectedValue={selectedBodyFontSize.toString()} // Convert to string
            onValueChange={handleBodyFontSizeChange}
          >
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
          </Picker>
        </View>
        <TextInput
          label="Enter sample text header"
          value={header}
          style={{ padding: 10 }}
          mode="outlined"
          onChangeText={setTextToPrintHeader}
        />
        <TextInput
          label="Enter sample text body"
          value={textToPrint}
          multiline
          numberOfLines={6}
          style={{ padding: 10 }}
          mode="outlined"
          onChangeText={setTextToPrint}
        />
        <TouchableOpacity
          style={{
            backgroundColor: colors.accent,
            padding: 15,
            margin: 10,
            borderRadius: 10,
          }}
          onPress={handlePrint}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 15,
              fontWeight: "bold",
              color: colors.white,
            }}
          >
            Test Print
          </Text>
        </TouchableOpacity>
        <Text style={{ textAlign: "center", marginBottom: 10 }}>
          Note: Make sure you're connected with bluetooth printer
        </Text>
      </ScrollView>
    </View>
  );
};

export default PrintingSettings;
