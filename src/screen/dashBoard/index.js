import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  YellowBox,
  Dimensions,
  Button,
  TextInput,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import { FirebaseConfig } from '../../firebase/config';
import RNTesseractOcr from 'react-native-tesseract-ocr';
import ListData from '../../mobx/global';
import { uploadImage, time } from './handle';
import { DefaultHeader, CustomHeader, CustomBottom, DefaultBottom } from './view';
import Modal from 'react-native-modal';
import i18next from 'i18next';
import { observer } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import AsyncStorage from '@react-native-community/async-storage';

import Colors from '../../style/color';
import {
  check,
  PERMISSIONS,
  RESULTS,
  request,
  openSettings,
} from 'react-native-permissions';

const options = {
  title: 'Chọn ảnh',
  // customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
  takePhotoButtonTitle: 'Chọn ảnh từ Camera',
  chooseFromLibraryButtonTitle: 'Chọn ảnh từ Thư viện',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const tessOptions = {
  whitelist: null,
  blacklist: null,
};

const { width, height } = Dimensions.get('screen');

export default observer(
  withNamespaces()(
    class ListScreen extends React.Component {
      constructor(props) {
        super(props);
        YellowBox.ignoreWarnings(['Setting a timer']);
        this.itemRef = FirebaseConfig.database();
        this.storage = FirebaseConfig.storage();
        this.dataHolder = [];
        this.state = {
          count: 0,
          list: [],
          checked: false,
          countChecked: 0,
          searchText: '',
          ocrResult: null,
          isModalVisible: false,
          nameItem: 'Tài Liệu',
          checkedAll: false,
        };
      }

      async componentDidMount() {
        const value = await AsyncStorage.getItem('login');
        ListData.setUidUser(value);
        this.listenForItem();
      }

      componentWillUnmount() {
        this.itemRef.ref('users/' + ListData.uidUser + '/item').off();
      }

      isChecked = index => {
        const newdata = this.state.list;
        const { countChecked } = this.state;
        newdata[index].checked = !newdata[index].checked;
        this.setState({ list: newdata });
        newdata[index].checked
          ? this.setState({ countChecked: countChecked + 1 })
          : this.setState({ countChecked: countChecked - 1 });
      };

      //render flatlist
      renderItem = ({ item, index }) => {
        return (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor: '#DDDDDD',
              padding: 10,
              backgroundColor: 'white',
            }}
            onPress={() => {
              const { checked } = this.state;
              if (checked) {
                this.isChecked(index);
              } else {
                ListData.setTextScan(item.textScan);
                ListData.setUrl(item.url);
                this.props.navigation.navigate('ScanScreen');
              }
            }}
            onLongPress={() => {
              this.setState({ checked: true });
              this.isChecked(index);
            }}>
            <Image
              source={{
                uri: item.url,
              }}
              style={{ width: 100, height: 100, resizeMode: 'contain' }}
            />
            <View style={{ justifyContent: 'center', marginLeft: 20 }}>
              <Text numberOfLines={1} style={{ fontSize: 18, width: width / 2.5, color: '#404040' }}>{item.name}</Text>
              <Text numberOfLines={1} style={{ fontSize: 15, width: width / 2.5, marginTop: 10 }}>
                {item.content}
              </Text>
            </View>

            {this.state.checked && (
              <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                <CheckBox
                  iconType="feather"
                  checkedIcon="check-square"
                  uncheckedIcon="square"
                  checkedColor="rgb(75, 201, 208)"
                  uncheckedColor="rgb(75, 201, 208)"
                  checked={item.checked}
                  onPress={() => {
                    this.isChecked(index);
                  }}
                />
              </View>


            )}
          </TouchableOpacity>
        );
      };

      detectText = resource => {
        return new Promise((resolver, reject) => {

          RNTesseractOcr.recognize(resource, 'LANG_VIETNAMESE', tessOptions)
            .then(result => {
              this.setState({ ocrResult: result + ' ' });
              console.log('OCR Result: ', result);
              resolver();
            })
            .catch(err => {
              console.log('OCR Error: ', err);
              reject();
            })
            .finally(() => {

            })
        })

      };

      requestCameraPermission = () => {
        if (Platform.OS === 'android') {
          check(PERMISSIONS.ANDROID.CAMERA)
            .then(result => {
              switch (result) {
                case RESULTS.UNAVAILABLE:
                  Alert.alert('thiết bị của bạn không hỗ trợ camera');
                  break;
                case RESULTS.DENIED:
                  request(PERMISSIONS.ANDROID.CAMERA);
                  break;
                case RESULTS.BLOCKED:
                  Alert.alert(
                    'Chưa cấp quyền!',
                    'Mở setting để cấp quyền sử dụng camera?',
                    [
                      {
                        text: 'CANCEL',
                      },
                      {
                        text: 'OK',
                        onPress: () => {
                          openSettings().catch(() => Alert.alert('Không thể mở setting để xin quyền'));
                        }
                      },

                    ],
                    {
                      cancelable: true,
                    },
                  );
                  break;
                case RESULTS.GRANTED:
                  this.addImage();
                  break;
              }
            })
            .catch(error => {
              Alert.alert(error);
            });
        }
      };

      //up url img len firebase realtime
      addImage = () => {
        ListData.toggleLoading();
        ImagePicker.showImagePicker(options, async (response) => {
          if (response.didCancel) {
            ListData.toggleLoading();
          } else if (response.error) {
          } else if (response.customButton) {
          } else {

            await this.detectText(response.path);
            await uploadImage(response.path)
              .then(url =>
                this.itemRef.ref('users/' + ListData.uidUser + '/item').push({
                  name: this.state.nameItem,
                  content: time(),
                  url,
                  checked: false,
                  textScan: this.state.ocrResult,
                  idImg: ListData.idImg,
                }),
              )
              .catch(error => console.log('ERR:' + error)).finally(() => {
                ListData.toggleLoading();
              });

          }
        });
      };

      deleteItems = () => {
        if (this.state.countChecked == 0) {
          return Alert.alert('không có gì để xóa');
        }
        Alert.alert(
          i18next.t('SCAN.WARNING'),
          i18next.t('DASHBOARD.DELETE'),
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: () => {
                this.setState({ countChecked: 0 });
                this.state.list.forEach(element => {
                  if (element.checked) {
                    this.itemRef
                      .ref('users/' + ListData.uidUser + '/item')
                      .child(element.databaseId)
                      .remove().then(() => {
                        this.storage
                          .ref('images')
                          .child(element.idImg)
                          .delete();
                      })
                  }
                });
              },
            },
          ],
          { cancelable: false },
        );
      };

      onPressEditItems = () => {
        this.state.list.find(element => {
          if (element.checked) {
            this.setState({ nameItem: element.name });
          }
        });
        this.toggleModal();
      };

      //load data firebase khi chay app
      listenForItem = () => {
        this.itemRef
          .ref('users/' + ListData.uidUser + '/item')
          .on('value', dataSnapshot => {
            const snap = dataSnapshot.val();
            let newArray = [];
            if (snap) {
              newArray = Object.keys(snap).map(key => {
                return { databaseId: key, ...snap[key] };
              });
            }
            this.setState({ list: newArray });
            this.dataHolder = newArray;
          });
      };

      onPressIconBack = () => {
        const tempList = this.state.list;
        for (let i = 0; i < tempList.length; i++) {
          tempList[i].checked = false;
        }
        this.setState({
          list: tempList,
          checked: false,
          countChecked: 0,
        });
      };

      onPressSelectAll = () => {
        const tempList = this.state.list;
        const l = tempList.length;
        for (let i = 0; i < l; i++) {
          if (tempList[i].checked == false) {
            tempList[i].checked = true;
          }
        }

        this.setState({ list: tempList });
      };

      toggleModal = () => {
        if (this.state.countChecked == 0) {
          return Alert.alert(i18next.t('DASHBOARD.NO_ITEM_SELECTED'));
        }

        this.setState({ isModalVisible: !this.state.isModalVisible });
      };

      handleSearch = text => {
        const newData = this.dataHolder.filter(item => {
          const itemData = item.name.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        this.setState({ list: newData });
      };

      render() {
        return (
          <View style={{ flex: 1 }}>
            {this.state.checked ? (
              <CustomHeader
                onPressIconBack={this.onPressIconBack}
                counthecked={this.state.countChecked}
                onPressSelectAll={this.onPressSelectAll}
              />
            ) : (
                <DefaultHeader
                  onPressDrawer={() => {
                    this.props.navigation.toggleDrawer();
                  }}
                  searchValue={this.state.searchText}
                  searchChangeText={text => {
                    this.setState({ searchText: text });
                    this.handleSearch(text);
                  }}
                  searchLanguages={i18next.t('DASHBOARD.SEARCH')}
                />
              )}

            {/* model */}
            <Modal
              style={{
                justifyContent: 'center',
              }}
              isVisible={this.state.isModalVisible}
              onBackdropPress={this.toggleModal}
              backdropTransitionOutTiming={100}
              backdropTransitionInTiming={100}>
              <View
                style={{
                  backgroundColor: 'white',
                  height: height * 0.25,
                  justifyContent: 'center',
                }}>
                <View style={{ position: 'absolute', top: 15, left: 15 }}>
                  <Text style={{ fontSize: 20 }}>Thay đổi tên</Text>
                </View>
                <View style={{ paddingHorizontal: 15 }}>
                  <TextInput
                    style={{
                      borderBottomColor: 'rgb(75, 201, 208)',
                      borderBottomWidth: 1,
                    }}
                    value={this.state.nameItem}
                    onChangeText={text => this.setState({ nameItem: text })}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    bottom: 0,
                    position: 'absolute',
                  }}>
                  <View style={{ flex: 1 }}>
                    <Button
                      title="OK"
                      color={Colors.BACKGROUND}
                      onPress={() => {
                        this.state.list.find(element => {
                          if (element.checked) {
                            this.itemRef
                              .ref('users/' + ListData.uidUser + '/item')
                              .child(element.databaseId)
                              .update({
                                name: this.state.nameItem,
                              });
                          }
                        });
                        this.setState({ countChecked: 0, nameItem: 'Tài Liệu' });
                        this.toggleModal();
                      }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button
                      title="Cancel"
                      color={Colors.BACKGROUND}
                      onPress={() => {
                        this.toggleModal();
                      }}
                    />
                  </View>
                </View>
              </View>
            </Modal>

            {/* flatlist */}
            <View style={{ flex: 9, marginTop: 5 }}>
              <FlatList
                data={this.state.list}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => item.idImg.toString()}
                extraData={Date.now()}
              />
            </View>
            {this.state.checked ? (
              <CustomBottom
                onPressDeleteItems={this.deleteItems}
                counthecked={this.state.countChecked}
                onPressEditItems={this.onPressEditItems}
              />
            ) : (
                <DefaultBottom onPressAddImage={this.requestCameraPermission} />
              )}
          </View>
        );
      }
    },
  ),
);
