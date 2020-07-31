import React from 'react';
import {
  Alert,
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  Keyboard,
  Animated,
} from 'react-native';
import { Formik } from 'formik';
import { FirebaseConfig } from '../../firebase/config';
import * as yup from 'yup';
import ListData from '../../mobx/global';
import i18next from '../../translate/i18n';
import { observer } from 'mobx-react';
import AsyncStorage from '@react-native-community/async-storage';

const window = Dimensions.get('window');
const IMAGE_HEIGHT = window.width / 4;
const IMAGE_SMALL = window.width / 7;

export default observer(
  class LoginScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        imageHeight: new Animated.Value(IMAGE_HEIGHT),
        viewImageFlex: new Animated.Value(2),
        textScanSize: new Animated.Value(26),
      }
    }

    async UNSAFE_componentWillMount() {
      if (await this.getData()) {
        this.props.navigation.navigate('DashBoard');
      }
      Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
      Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    }

    componentWillUnmount() {
      Keyboard.removeListener('keyboardDidShow', this.keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', this.keyboardDidHide);
    }

    keyboardDidShow = () => {
      this.setState({ hideTextScanner: true })
      const anim1 = Animated.timing(this.state.imageHeight, {
        toValue: IMAGE_SMALL,
        duration: 300,
      });

      const anim2 = Animated.timing(this.state.viewImageFlex, {
        toValue: 1,
        duration: 300,
      });

      const anim3 = Animated.timing(this.state.textScanSize, {
        toValue: 0,
        duration: 300,
      });

      const finalAnim = Animated.parallel([anim1, anim2, anim3])
      finalAnim.start();

    };

    keyboardDidHide = () => {
      this.setState({ hideTextScanner: false })
      const anim1 = Animated.timing(this.state.imageHeight, {
        toValue: IMAGE_HEIGHT,
        duration: 300,
      });

      const anim2 = Animated.timing(this.state.viewImageFlex, {
        toValue: 2,
        duration: 300,
      });

      const anim3 = Animated.timing(this.state.textScanSize, {
        toValue: 26,
        duration: 300,
      });

      const finalAnim = Animated.parallel([anim1, anim2, anim3])
      finalAnim.start();

    };

    handleRegister = () => {
      this.props.navigation.navigate('Register');
    };


    getData = async () => {
      try {
        const value = await AsyncStorage.getItem('login');
        if (value !== null) {
          return true;
        }
      } catch (e) {
        console.log(e);
      }
      return false;
    };

    storeToken = async user => {
      try {
        await AsyncStorage.setItem('login', user);
      } catch (e) {
        console.log('err StoreData:', e);
      }
    };

    storeEmail = async email => {
      try {
        await AsyncStorage.setItem('email', email);
      } catch (e) {
        console.log('err StoreData:', e);
      }
    };

    render() {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          style={{ flex: 1, backgroundColor: '#35dbd0' }}>
          <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={values => {
              ListData.toggleLoading();
              FirebaseConfig.auth()
                .signInWithEmailAndPassword(values.email, values.password)
                .then(res => {
                  FirebaseConfig.auth().onAuthStateChanged(async user => {
                    if (user) {
                      await this.storeToken(res.user.uid);
                      await this.storeEmail(values.email);
                      this.props.navigation.navigate('DashBoard');
                    }
                  });
                })
                .catch(() => {
                  Alert.alert(
                    'Thông báo!',
                    'Sai tên tài khoản hoặc mật khẩu',
                    [
                      {
                        text: 'OK',
                      },
                    ],
                    {
                      cancelable: true,
                    },
                  );
                })
                .finally(() => {
                  ListData.toggleLoading();
                });
            }}
            validationSchema={yup.object().shape({
              email: yup
                .string()
                .email('sai định dạng email')
                .required('email không được để trống'),
              password: yup
                .string()
                .min(6, 'mật khẩu ít nhất 6 ký tự')
                .required('mật khẩu không được để trống'),
            })}>
            {({
              values,
              handleChange,
              errors,
              setFieldTouched,
              touched,
              handleSubmit,
            }) => (

                <View style={{ marginHorizontal: 36, flex: 1 }}>
                  <Animated.View style={{ flex: this.state.viewImageFlex, justifyContent: 'center' }}>
                    <Animated.Image
                      style={{ height: this.state.imageHeight, resizeMode: 'contain', alignSelf: 'center' }}
                      source={require('../../img/logo.png')} />
                    <Animated.Text style={{ color: 'white', fontSize: this.state.textScanSize, alignSelf: 'center' }}>Scanner</Animated.Text>
                  </Animated.View>

                  <View style={{ flex: 3 }}>
                    <TextInput
                      style={styles.textInput}
                      placeholderTextColor={'#ECF8E0'}
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={() => setFieldTouched('email')}
                      placeholder="E-mail"
                    />
                    {touched.email && errors.email && (
                      <Text style={{ fontSize: 15, color: 'red' }}>
                        {errors.email}
                      </Text>
                    )}
                    <TextInput
                      style={styles.textInput}
                      placeholderTextColor={'#ECF8E0'}
                      value={values.password}
                      onChangeText={handleChange('password')}
                      placeholder="Password"
                      onBlur={() => setFieldTouched('password')}
                      secureTextEntry={true}
                    />
                    {touched.password && errors.password && (
                      <Text style={{ fontSize: 15, color: 'red' }}>
                        {errors.password}
                      </Text>
                    )}

                    <TouchableOpacity
                      activeOpacity={0.5}
                      style={{
                        marginBottom: 5,
                        height: 45,
                        borderRadius: 50,
                        borderWidth: 2,
                        backgroundColor: '#ECF8E0',
                        borderColor: '#ECF8E0',
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 20,
                      }}
                      onPress={() => {
                        handleSubmit();
                      }}>
                      <Text
                        style={{
                          color: '#35dbd0',
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          fontSize: 18
                        }}>
                        {i18next.t('LOGIN.LOGIN')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{
                        marginBottom: 10,
                        height: 30,
                        borderRadius: 50,
                        borderWidth: 2,
                        backgroundColor: 'transparent',
                        borderColor: 'transparent',
                        marginHorizontal: 70,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => this.handleRegister()}>
                      <Text
                        style={{
                          color: '#ECF8E0',
                          fontStyle: 'normal',
                          fontWeight: 'bold',
                          textDecorationLine: 'underline',
                          fontSize: 16
                        }}>
                        {i18next.t('LOGIN.REGISTER')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

              )}
          </Formik>

        </KeyboardAvoidingView>
      );
    }
  },
);

const styles = StyleSheet.create({
  textInput: {
    marginBottom: 10,
    height: 45,
    borderRadius: 50,
    borderWidth: 2,
    color: 'white',
    borderColor: '#ECF8E0',
    fontSize: 18,
    paddingHorizontal: 18
  },
});
