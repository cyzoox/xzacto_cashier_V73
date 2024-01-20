import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  TouchableOpacity,
  Image,
  TextInput,
  ImageBackground,
} from 'react-native';
import AuthForm from '../components/AuthForm';
import NavLink from '../components/NavLink';
import {useAuth} from '../context/AuthContext';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';
// import AnimatedSplash from "react-native-animated-splash";
import colors from '../themes/colors';

import {RNCamera} from 'react-native-camera';

const SignupScreen = ({navigation}) => {
  const {user, signUp, signIn, projectData} = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const readItemFromStorage = async () => {
    const item = await AsyncStorage.getItem('@store');
    const currency = await AsyncStorage.getItem('@currency');

    if (item !== null && currency !== null) {
      navigation.navigate('Dashboard', {
        name: 'My Project',
        projectPartition: `project=${user.id}`,
        store_info: JSON.parse(item),
        currency: JSON.parse(currency),
      });
    } else {
      navigation.navigate('StoreSelect', {
        name: 'My Project',
        projectPartition: `project=${user.id}`,
      });
    }
  };

  useEffect(() => {
    // If there is a user logged in, go to the Projects page.

    // AnimatedSplash.hide()
    if (user != null) {
      readItemFromStorage();
    } else {
    }
  }, [user]);

  // The onPressSignIn method calls AuthProvider.signIn with the
  // email/password in state.
  const onPressSignIn = async () => {
    try {
      await signUp(email, password);
      setLoading(false);
    } catch (error) {
      Alert.alert(`Failed to sign in: ${error.message}`);
      setLoading(false);
    }
  };

  // The onPressSignUp method calls AuthProvider.signUp with the
  // email/password in state and then signs in.
  const onPressSignUp = async () => {
    try {
      await signUp(email, password);
      signUp(email, password);
    } catch (error) {
      Alert.alert(`Failed to sign up: ${error.message}`);
    }
  };

  return (
    <View style={styles.background}>
      <Loader loading={loading} />
      <ImageBackground
        source={require('../../assets/splashbg.png')}
        resizeMode="cover"
        imageStyle={{}}
        style={styles.header}>
        <View
          style={{
            width: '90%',
            marginTop: 10,
            marginHorizontal: 20,
            marginBottom: 50,
            marginTop: 50,
          }}>
          <Text style={{color: colors.white, fontSize: 16, fontWeight: '400'}}>
            Existing User ?
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SigninScreen')}
            style={[styles.button, {backgroundColor: colors.white}]}>
            <Text style={[styles.buttonText, {color: colors.green}]}>
              LOGIN
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.header2}>
          <View style={styles.subview}>
            <Text
              style={{color: colors.green, fontSize: 17, fontWeight: '400'}}>
              Sign up with
            </Text>
            <Text
              style={{color: colors.green, fontSize: 25, fontWeight: 'bold'}}>
              XZacto
            </Text>
            <TextInput
              style={styles.input}
              placeholderTextColor="#CBCBCB"
              onChangeText={setEmail}
              placeholder="Enter email"
            />
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              placeholderTextColor="#CBCBCB"
              placeholder="Enter password"
            />
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              placeholderTextColor="#CBCBCB"
              placeholder="Re-enter password"
            />
            <TextInput
              style={styles.input}
              placeholderTextColor="#CBCBCB"
              onChangeText={setEmail}
              placeholder="Enter company name"
            />
            <TouchableOpacity onPress={onPressSignIn} style={styles.button}>
              <Text style={styles.buttonText}>SIGN UP</Text>
            </TouchableOpacity>
          </View>
        </View>

        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={({barcodes}) => {}}
        />
      </ImageBackground>
    </View>
  );
};

SignupScreen.navigationOptions = () => {
  return {
    headerShown: false,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.primary,
    width: '100%',
    alignItems: 'center',

    flex: 1,

    overflow: 'hidden',
  },
  header2: {
    backgroundColor: colors.white,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 500,
    borderTopEndRadius: 85,
  },
  background: {
    backgroundColor: '#FFF',
    flex: 1,
    alignItems: 'center',
    // justifyContent:"center"
  },
  subview: {
    width: '90%',
    alignItems: 'flex-start',
    marginBottom: 100,
  },
  text: {
    marginTop: 10,
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderColor: colors.green,
    borderWidth: 1,
    width: '100%',
    fontSize: 14,
    marginTop: 15,
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  button: {
    width: '100%',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.green,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  button2: {
    width: 180,
    marginTop: 40,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#33C1B2',
  },
  background2: {
    flex: 1,
    alignItems: 'center',
    // justifyContent:"center"
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default SignupScreen;
