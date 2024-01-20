import React from 'react';
// import LoaderKit from 'react-native-loader-kit';
import {Text, StyleSheet, View, SafeAreaView} from 'react-native';

const LoadingScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* <LoaderKit
                style={{ width: 50, height: 50 }}
                name={'BallPulse'} // Optional: see list of animations below
                size={50} // Required on iOS
                color={'red'} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
                /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ed5565',
    flexDirection: 'row',
    flexWrap: 'wrap',

    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;
