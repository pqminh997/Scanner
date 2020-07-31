import React from 'react';
import Root from './src/navigation/navigation';
import { Loading } from './src/component/loadingView';
import SplashScreen from 'react-native-splash-screen';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-community/async-storage';
import { View, StyleSheet, Text, Image, Dimensions, Alert } from 'react-native';
import {
  PERMISSIONS,
  request,
} from 'react-native-permissions';

const window = Dimensions.get('window');
const HEIGHT_IMAGE = window.width / 1.3;
const WIDTH_IMAGE = window.width / 1.3;

const slides = [
  {
    key: 'k1',
    title: 'Scanner',
    text: 'Giao diện đơn giản, dễ sử dụng',
    image: {
      uri: 'https://firebasestorage.googleapis.com/v0/b/scanapp-5608c.appspot.com/o/images%2Fintro_1.PNG?alt=media&token=28fc22b9-2797-433b-8a8c-3ded3a4b7510',
    },
    backgroundColor: '#F7BB64',

  },
  {
    key: 'k2',
    // title: 'title 1',
    text: 'Nhận dạng chữ từ hình ảnh',
    image: {
      uri: 'https://firebasestorage.googleapis.com/v0/b/scanapp-5608c.appspot.com/o/images%2Fintro_scan.png?alt=media&token=800f7aa1-e661-4794-9790-c95b762595c9',
    },
    backgroundColor: '#F4B1BA',
  },
  {
    key: 'k3',
    // title: 'Export Word',
    text: 'Xuất ra file word dễ dàng',
    image: {
      uri: 'https://firebasestorage.googleapis.com/v0/b/scanapp-5608c.appspot.com/o/images%2Fintro_word.png?alt=media&token=2c489d78-378b-4121-82dd-63b74cd3221d',
    },
    backgroundColor: '#4093D2',
  },
  {
    key: 'k4',
    // title: 'Export Word',
    text: 'Lưu trữ dữ liệu người dùng',
    image: {
      uri: 'https://firebasestorage.googleapis.com/v0/b/scanapp-5608c.appspot.com/o/images%2Fsave.png?alt=media&token=3811ed17-8260-48f4-8990-d2d72392efe8',
    },
    backgroundColor: '#04B486',
  },

];
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRealApp: false,
    };
  }

  storeData = async () => {
    try {
      await AsyncStorage.setItem('intro', 'remove');
    } catch (e) {
      console.log(e);
    }
  };

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

  on_Done_all_slides = () => {
    this.setState({ showRealApp: true });
  };
  on_Skip_slides = () => {
    this.setState({ showRealApp: true });
  };

  async componentDidMount() {
    if (await this.getData()) {
      this.setState({ showRealApp: true });
      return SplashScreen.hide();
    } else {
      await this.storeData();
    }
    SplashScreen.hide();
    request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).catch((err) => Alert.alert(err));
  }

  renderItem = ({ item }) => {
    return (
      <View
        style={[
          styles.slide,
          {
            backgroundColor: item.backgroundColor,
          },
        ]}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    )
  }

  render() {
    return (
      <Loading>
        {this.state.showRealApp ? (
          <Root />
        ) : (
            <AppIntroSlider
              slides={slides}
              onDone={this.on_Done_all_slides}
              showSkipButton={true}
              onSkip={this.on_Skip_slides}
              renderItem={this.renderItem}
            />
          )}
      </Loading>
    );
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: 'blue'
  },
  image: {
    width: WIDTH_IMAGE,
    height: HEIGHT_IMAGE,
    resizeMode: 'contain',
    marginVertical: 20,

  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,

  },
  title: {
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
  },
})
