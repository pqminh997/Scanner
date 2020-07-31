import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class SplashScreenView extends React.Component {
  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('intro');
      const valueLogin = await AsyncStorage.getItem('login');
      if (value !== null && valueLogin !== null) {
        return true;
      }
    } catch (e) {
      // error reading value
    }
    return false;
  };

  async componentDidMount() {
    if (await this.getData()) {
      this.props.navigation.navigate('DashBoard');
    } else {
      this.props.navigation.navigate('Login');
    }
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: 'rgb(75, 201, 208)',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        <Text style={{ fontSize: 40, color: 'white' }}>Scanner</Text>
        <ActivityIndicator
          style={{ position: 'absolute', bottom: 10 }}
          size={'large'}
        />
      </View>
    );
  }
}
