import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';

import LoginScreen from '../screen/login/login';
import RegisterScreen from '../screen/register/register';
import ListScreen from '../screen/dashBoard/index';
import ItemDrawer from '../screen/drawer/index';
import ItemScan from '../screen/itemScan/index';
import SplashScreenView from '../screen/splash/splash';
// import drawer from '../screen/drawer/index';

const LoginStack = createStackNavigator(
  {
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    Register: {
      screen: RegisterScreen,
      navigationOptions: {
        title: "Đăng ký",
        headerTitleAlign: 'center',
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#35dbd0',
        }
      },
    },
  },
);

const RootDrawer = createDrawerNavigator(
  {
    DashBoard: ListScreen,
  },
  {
    initialRouteName: 'DashBoard',
    contentComponent: ItemDrawer,
  }
);

const ItemStack = createStackNavigator({
  DashBoard: {
    screen: RootDrawer,
    navigationOptions: {
      headerShown: false,
    },
  },
  ScanScreen: {
    screen: ItemScan,
    navigationOptions: {
      title: "Scan",
      headerTitleAlign: 'center',
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#35dbd0',
      }
    },
  },
});

const RootSwitch = createSwitchNavigator(
  {
    Splash: SplashScreenView,
    Login: LoginStack,
    DashBoard: ItemStack,
  },
  {
    initialRouteName: 'Splash',
  },
);
export default Root = createAppContainer(RootSwitch);
