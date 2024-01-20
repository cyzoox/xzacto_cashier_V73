import React from "react";
import {  StyleSheet, ScrollView, FlatList, View, Dimensions } from "react-native";
import { Grid, Col, Row } from "react-native-easy-grid";
import { Text } from 'react-native-elements';
import colors from "../themes/colors";
import Spacer from "./Spacer";
import formatMoney from 'accounting-js/lib/formatMoney.js'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const DataTable = ({ alignment, headerTitles, children, total, ototal }) => {
  return (
    <View style={{flex :1}}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Spacer>
                <Grid>
                    <Row style={{height: 30,  backgroundColor: colors.coverDark}}>
                        {
                            headerTitles.map((rowData) => (      
                                <Col key={rowData} style={[styles.ColStyle,{alignItems: alignment}]}>
                                    <Text  style={styles.textColor}>{rowData}</Text>
                                </Col>      
                            ))
                        }
                    </Row>
                    {children}
                </Grid>    
      </Spacer>
    </ScrollView>
    <View style={{height: 40}}>
               <View style={{flexDirection:'row', justifyContent:'space-between', backgroundColor:colors.coverDark,marginHorizontal:5, padding: 7}}>
                  <Text style={{textAlign:'center',color:colors.white, fontWeight:'bold'}}>Total</Text>
                  <Text style={{textAlign:'center',color:colors.white, fontWeight:'bold'}}>{formatMoney(total, { symbol: "₱", precision: 2 })}</Text>
               </View>
            </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textColor: {
    fontSize: 14,
    color: colors.white,
    fontWeight:'600',
    textAlign:'center'
  },
  ColStyle: {
      width: windowWidth / 4.5 - 2,
      justifyContent: 'center',
      paddingBottom: 5,
  },
  footerBar: {
      color: colors.white,
      fontWeight: 'bold'
  },
  footerContainer: {
      flexDirection:'row', 
      justifyContent:'space-between', 
      margin: 10, backgroundColor:colors.statusBarCoverDark, 
      padding: 5,
      paddingHorizontal: 5
    }
});

export default DataTable;
