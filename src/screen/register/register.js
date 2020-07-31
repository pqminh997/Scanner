import React from 'react';
import * as yup from 'yup';
import { Formik } from 'formik';
import {
  TextInput,
  Alert,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import { FirebaseConfig } from '../../firebase/config';
import i18next from '../../translate/i18n';

const window = Dimensions.get('window');
const height = window.width / 4;

export default class RegisterScreen extends React.Component {
  _showAlert = () => {
    Alert.alert(
      'lêu lêu',
      'sai tên đăng nhập hoặc mật khẩu',
      [
        {
          text: 'OK',
        },
      ],
      {
        cancelable: true,
      },
    );
  };
  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: 'white' }}>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={values => {
            FirebaseConfig.auth()
              .createUserWithEmailAndPassword(values.email, values.password)
              .then(() => {
                Alert.alert(
                  'Thông báo',
                  'đăng ký thành công: ' + values.email,
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        this.props.navigation.goback;
                      },
                    },
                  ],
                  {
                    cancelable: false,
                  },
                );
              })
              .catch(error => {
                // Handle Errors here.
                // const errorCode = error.code;
                // const errorMessage = error.message;
                Alert.alert(
                  'Thông báo',
                  'Email đã tồn tại, xin mời nhập lại email khác',
                  [
                    {
                      text: 'OK',
                    },
                    {
                      text: 'cancel',
                      onPress: () => {
                        NavigationService.back();
                      },
                    },
                  ],
                  {
                    cancelable: false,
                  },
                );
              });
          }}
          validationSchema={yup.object().shape({
            email: yup
              .string()
              .email('sai định dạng Email')
              .required('Email không được để trống'),
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
            isValid,
            handleSubmit,
          }) => (
              <View style={{
                marginHorizontal: 36,
                flex: 1,
                justifyContent: 'center',
              }}>
                <TextInput
                  style={styles.textInput}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={() => setFieldTouched('email')}
                  placeholder="E-mail"
                />
                {touched.email && errors.email && (
                  <Text style={{ fontSize: 13, color: 'red' }}>{errors.email}</Text>
                )}
                <TextInput
                  style={styles.textInput}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  placeholder="Password"
                  onBlur={() => setFieldTouched('password')}
                  secureTextEntry={true}
                />
                {touched.password && errors.password && (
                  <Text style={{ fontSize: 13, color: 'red' }}>
                    {errors.password}
                  </Text>
                )}

                <TouchableOpacity
                  activeOpacity={0.5}
                  style={styles.btnLogin}
                  onPress={() => handleSubmit()}>
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: 18,
                    }}>
                    {i18next.t('LOGIN.REGISTER')}
                  </Text>
                </TouchableOpacity>

              </View>
            )}
        </Formik>
        <View style={{ height }} />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  btnLogin: {
    marginTop: 20,
    height: 45,
    backgroundColor: '#35dbd0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  textInput: {
    marginBottom: 10,
    height: 45,
    borderRadius: 50,
    borderWidth: 2,
    // color: '#35dbd0',
    borderColor: '#35dbd0',
    fontSize: 18,
    paddingHorizontal: 18,
  },
});
