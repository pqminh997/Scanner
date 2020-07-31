import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  AsyncStorage,

} from 'react-native';
import ListData from '../../mobx/global';
import { observer } from 'mobx-react';
import i18next from '../../translate/i18n';
import IconDown from 'react-native-vector-icons/AntDesign';
import IconAdd from 'react-native-vector-icons/FontAwesome';
import IconOut from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-picker';
import { uploadImage } from '../dashBoard/handle';
import { FirebaseConfig } from '../../firebase/config';
import LanguageVI from '../../translate/languages/vi';

const options = {
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export default observer(
  class ItemDrawer extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        languagesText: 'Tiếng Việt',
        selectLanguage: false,
        selectImage: false,
        urlImage: 'https://firebasestorage.googleapis.com/v0/b/scanapp-5608c.appspot.com/o/user%2Favatar_default.jpg?alt=media&token=b338d5ea-76f6-4cd1-a885-8e7a953e6f9e',
        txtEmail: '',
      };
    }

    getStorageMail = async () => {
      try {
        const value = await AsyncStorage.getItem('email');
        this.setState({ txtEmail: value })
      } catch (error) {
        console.log('storage err =>', error);
      }
    }

    async componentDidMount() {
      await this.getStorageMail()
      this.callImageFromFirebase()
    }

    changeLanguagesEN = () => {
      if (this.state.languagesText != 'English') {
        i18next.changeLanguage('en');
        this.setState({ languagesText: 'English' });
      }
    };
    changeLanguagesVN = () => {
      if (this.state.languagesText != 'Tiếng Việt') {
        i18next.changeLanguage('vi');
        this.setState({
          languagesText: 'Tiếng Việt',
        });
      }
    };

    selectLanguage = () => {
      this.setState({ selectLanguage: !this.state.selectLanguage });
    };

    callImageFromFirebase = () => {
      const imageRef = FirebaseConfig.storage().ref('user').child(ListData.uidUser)
      imageRef.getDownloadURL().then((url) => {
        this.setState({ selectImage: true, urlImage: url, })

      }).catch((error) => {
        console.log('err call Img =>', error)
      });
    }

    changeAvatar = () => {
      ListData.toggleLoading();
      ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
          ListData.toggleLoading();
        } else if (response.error) {
          ListData.toggleLoading();
          Alert.alert('Err', response.error);
        } else if (response.customButton) {
        } else {
          uploadImage(response.path, 'user', ListData.uidUser)
            .then(
              url => {
                this.setState({ selectImage: true })
                this.callImageFromFirebase()
              })
            .catch(err => console.log('Err changeAvatar => ' + err))
            .finally(() => ListData.toggleLoading());
        }
      });
    };

    logOut = async () => {
      await AsyncStorage.removeItem('login');
      await AsyncStorage.removeItem('email');
      this.props.navigation.navigate('Login');
    }

    render() {
      return (
        <View
          style={{
            padding: 10,
            flex: 1,
            backgroundColor: 'white',
          }}>
          <View
            style={{
              flex: 2,
              alignItems: 'center',
              borderBottomColor: '#DDDDDD',
              borderBottomWidth: 1,
            }}>
            <TouchableOpacity
              style={{
                width: 150,
                height: 150,
                backgroundColor: 'rgb(75, 201, 208)',
                borderRadius: 200,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={this.changeAvatar}>
              {this.state.selectImage ? (
                <Image
                  source={{ uri: this.state.urlImage }}
                  style={{ width: '100%', height: '100%', borderRadius: 200 }}
                />
              ) : (
                  <IconAdd color="white" size={45} name="camera" />
                )}
            </TouchableOpacity>
            <Text
              style={{ textAlign: 'center', color: '#222222', fontSize: 15 }}>
              {/* {ListData.emailUser} */}
              {this.state.txtEmail}
            </Text>
          </View>

          <View style={{ flex: 3 }}>
            <TouchableOpacity
              onPress={this.selectLanguage}
              style={styles.itemDrawer}>
              <Text style={{ color: '#222222' }}>
                {i18next.t('DRAWER.SELECT_LANGUAGES')}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: '#222222' }}>
                  {this.state.languagesText}
                </Text>
                <IconDown name="down" size={18} color={'#222222'} />
              </View>
            </TouchableOpacity>

            {this.state.selectLanguage && (
              <View>
                <TouchableOpacity
                  onPress={this.changeLanguagesVN}
                  style={[
                    styles.childItem,
                    { backgroundColor: '#FFFFFF' },
                  ]}>
                  <Text style={{ color: '#222222' }}>
                    {i18next.t('DRAWER.LANGUAGES_VIETNAM')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={this.changeLanguagesEN}
                  style={styles.childItem}>
                  <Text style={{ color: '#222222' }}>
                    {i18next.t('DRAWER.LANGUAGES_ENGLISH')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity onPress={this.logOut} style={styles.itemDrawer}>
              <Text style={{ color: '#222222' }}>
                {i18next.t('DRAWER.LOG_OUT')}
              </Text>
              <IconOut
                name={'logout'}
                size={25}
                color={'#222222'}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  },
);

const styles = StyleSheet.create({
  itemDrawer: {
    height: 50,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomColor: '#DDDDDD',
    borderBottomWidth: 1,
  },
  childItem: {
    height: 45,
    marginBottom: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
    justifyContent: 'center',
    borderBottomColor: '#DDDDDD',
    borderBottomWidth: 1,
  },
});
