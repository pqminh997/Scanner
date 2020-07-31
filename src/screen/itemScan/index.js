import React from 'react';
import {
  View,
  Text,
  Dimensions,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  Clipboard,
  ToastAndroid,
} from 'react-native';
import ListData from '../../mobx/global';
import { observer } from 'mobx-react';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { NavigationEvents } from 'react-navigation';
import IconCopy from 'react-native-vector-icons/FontAwesome';
import IconWord from 'react-native-vector-icons/FontAwesome';
import IconImage from 'react-native-vector-icons/FontAwesome';
// import IconExcel from 'react-native-vector-icons/FontAwesome';
import IconEdit from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import i18next from '../../translate/i18n';
import { withNamespaces } from 'react-i18next';
// import XLSX from 'xlsx';

import Colors from '../../style/color';
import {
  check,
  PERMISSIONS,
  RESULTS,
  request,
  openSettings,
} from 'react-native-permissions';

const { width, height } = Dimensions.get('window');
const PATH_SCAN = '/storage/emulated/0/ScanFiles/';
const doc = new Document();

export default observer(
  withNamespaces()(
    class ItemScan extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          textScan: '',
          checked: false,
          // data: [["A", "B", "C"], [1, 2, 3], [4, 5, 6]],
        };
      }

      onChangeText = textScan => {
        this.setState({ textScan });
      };

      customView = () => {
        return (
          <View
            style={{ flex: 8, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={{ uri: ListData.url }} style={styles.image} />
          </View>
        );
      };

      defaultView = () => {
        return (
          <View style={{ flex: 8 }}>
            <ScrollView style={{ flex: 1 }}>
              <TextInput
                value={this.state.textScan}
                multiline={true}
                onChangeText={this.onChangeText}
              />
            </ScrollView>
          </View>
        );
      };

      customBottomImg = () => {
        return (
          <TouchableNativeFeedback
            style={styles.viewBottom}
            onPress={() => this.setState({ checked: !this.state.checked })}>
            <IconEdit name="edit" size={23} color={'white'} />
            <Text style={{ color: 'white' }}>{i18next.t('SCAN.EDIT')}</Text>
          </TouchableNativeFeedback>
        );
      };

      defaultBottomImg = () => {
        return (
          <TouchableNativeFeedback
            style={styles.viewBottom}
            onPress={() => this.setState({ checked: !this.state.checked })}>
            <IconImage name="image" size={23} color={'white'} />
            <Text style={{ color: 'white' }}>
              {i18next.t('SCAN.SHOW_PICTURE')}
            </Text>
          </TouchableNativeFeedback>
        );
      };

      createScanFile = () => {
        // tao thu muc Scanfiles trong android
        RNFS.mkdir('/storage/emulated/0/ScanFiles/')
          .then(() => {
          })
          .catch(err => {
            console.log(err)
          });
      };

      requestWritePermission = () => {
        if (Platform.OS === 'android') {
          check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE)
            .then(result => {
              switch (result) {
                case RESULTS.UNAVAILABLE:
                  Alert.alert(i18next.t('SCAN.PERMISSION_UNAVAILABLE'));
                  break;
                case RESULTS.DENIED:
                  request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then((result) => {
                    if (result === RESULTS.GRANTED) {
                      this.createScanFile();
                    }
                  });
                  break;
                case RESULTS.BLOCKED:
                  Alert.alert(
                    i18next.t('SCAN.WARNING_PERMISSION_BLOCK'),
                    i18next.t('SCAN.PERMISSION_BLOCK'),
                    [
                      { text: 'CANCEL' },
                      {
                        text: 'OK',
                        onPress: () => {
                          openSettings().catch(() => Alert.alert(i18next.t('SCAN.CATCH_PERMISSION_BLOCK')));
                        }
                      },
                    ],
                    {
                      cancelable: true,
                    },
                  );
                  break;
                case RESULTS.GRANTED:
                  this.exportWord();
                  break;
              }
            })
            .catch(error => {
              Alert.alert(error);
            });
        }
      };

      exportWord = () => {
        const id = Date.now();
        const path = PATH_SCAN + id.toString() + '.docx';
        doc.addSection({
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: this.state.textScan,
                }),
              ],
            }),
          ],
        });

        // Used to export the file into a .docx file
        Packer.toBase64String(doc).then(txt => {
          // write the file
          RNFS.writeFile(path, txt, 'base64')
            .then(() => {
              ListData.toggleLoading();
              Alert.alert(i18next.t('SCAN.WARNING'), i18next.t('SCAN.EXPORT_SUCCESS'));
            })
            .catch(err => {
              Alert.alert('Error!', err);
            }).finally(() => ListData.toggleLoading());
        });
      };

      copyToClipBoard = () => {
        Clipboard.setString(this.state.textScan);
        ToastAndroid.show(i18next.t('SCAN.TOAST_COPY'), ToastAndroid.SHORT);
      };

      // exportExcel = () => {

      //   const text = this.state.textScan.split('\n')

      //   console.log(text[0])

      // const workSheet = XLSX.utils.aoa_to_sheet(this.state.data);
      // const workBook = XLSX.utils.book_new();
      // XLSX.utils.book_append_sheet(workBook, workSheet, "SheetJS")

      // const wbout = XLSX.write(workBook, { type: 'binary', bookType: 'xlsx' });
      // const file = PATH_SCAN + "test.xlsx"

      // RNFS.writeFile(file, wbout, 'ascii')
      //   .then(() => {
      //     Alert.alert('Export excel file ok');
      //   })
      //   .catch(err => {
      //     console.log('action failed');
      //     Alert.alert('Lỗi! khởi động lại app?', err);
      //   });
      // }

      render() {
        return (
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <NavigationEvents
              onWillFocus={() =>
                this.setState({ textScan: ListData.textScan, checked: false })
              }
            />
            {this.state.checked ? this.customView() : this.defaultView()}
            <View style={styles.containerBottom}>
              {this.state.checked
                ? this.customBottomImg()
                : this.defaultBottomImg()}
              <TouchableNativeFeedback
                onPress={() => {
                  // ListData.toggleLoading()
                  // setTimeout(() => {
                  this.requestWritePermission();
                  // }, 1)
                }}
                style={styles.viewBottom}>
                <IconWord name="file-word-o" size={23} color={'white'} />
                <Text style={{ color: 'white' }}>Word</Text>
              </TouchableNativeFeedback>

              <TouchableNativeFeedback
                style={styles.viewBottom}
                onPress={this.copyToClipBoard}>
                <IconCopy name="copy" size={23} color={'white'} />
                <Text style={{ color: 'white' }}>{i18next.t('SCAN.COPY')}</Text>
              </TouchableNativeFeedback>

              {/* <TouchableNativeFeedback
                style={styles.viewBottom}
                onPress={this.exportExcel}>
                <IconExcel name="file-excel-o" size={23} color={'white'} />
                <Text style={{ color: 'white' }}>{i18next.t('SCAN.EXCEL')}</Text>
              </TouchableNativeFeedback> */}
            </View>
          </View>
        );
      }
    },
  ),
);

const styles = StyleSheet.create({
  viewBottom: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width / 3,
  },
  containerBottom: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
    flexDirection: 'row',
  },
  image: {
    width: width * 0.7,
    height: height * 0.7,
    resizeMode: 'contain',
  },
});
