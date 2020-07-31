import React from 'react';
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import IconDelete from 'react-native-vector-icons/MaterialIcons';
import IconAdd from 'react-native-vector-icons/FontAwesome';
import IconList from 'react-native-vector-icons/FontAwesome';
import IconSearch from 'react-native-vector-icons/Octicons';
import IconBack from 'react-native-vector-icons/MaterialIcons';
import IconEdit from 'react-native-vector-icons/AntDesign';

import Colors from '../../style/color';

const { width, height } = Dimensions.get('screen');

export const DefaultHeader = ({
  onPressDrawer,
  searchValue,
  searchChangeText,
  searchFocus,
  searchLanguages,
}) => {
  return (
    <View
      style={{
        backgroundColor: Colors.BACKGROUND,
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 10,
        flexDirection: 'row',
      }}>
      <IconList
        name="list"
        color='white'
        size={30}
        onPress={onPressDrawer}
      />
      <View
        style={{
          flex: 1,
          flexDirection: 'row-reverse',
        }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: 'white',
            alignItems: 'center',
            borderRadius: 100,
            width: width * 0.8,
            paddingHorizontal: 5,
          }}>
          <IconSearch name="search" color="rgb(75, 201, 208)" size={25} />
          <TextInput
            style={{ height: 40, width: width * 0.7 }}
            maxLength={15}
            placeholder={searchLanguages}
            value={searchValue}
            onChangeText={searchChangeText}
            onFocus={searchFocus}
          />
        </View>
      </View>
    </View>
  );
};

export const CustomHeader = ({
  onPressIconBack,
  counthecked,
  onPressSelectAll,
}) => {
  return (
    <View
      style={{
        backgroundColor: Colors.BACKGROUND,
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 10,
        flexDirection: 'row',
      }}>
      <IconBack
        onPress={onPressIconBack}
        size={30}
        name="arrow-back"
        color="white"
      />
      <Text style={{ color: 'white', fontSize: 16, marginLeft: 10 }}>
        {counthecked} item
      </Text>
      <View style={{ flexDirection: 'row-reverse', flex: 1 }}>
        <Text onPress={onPressSelectAll} style={{ color: 'white', fontSize: 16 }}>
          Chọn tất cả Item
        </Text>
      </View>
    </View>
  );
};

export const CustomBottom = ({
  onPressDeleteItems,
  counthecked,
  onPressEditItems,
}) => {
  return (
    <View
      style={{
        backgroundColor: Colors.BACKGROUND,
        flex: 1,
        flexDirection: 'row',
      }}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={onPressDeleteItems}
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <IconDelete name="delete" size={25} color="white" />
          <Text style={{ color: 'white' }}>Xóa</Text>
        </TouchableOpacity>
      </View>

      {counthecked <= 1 && (
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={onPressEditItems}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <IconEdit name="edit" size={25} color="white" />
            <Text style={{ color: 'white' }}>Sửa tên</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export const DefaultBottom = ({ onPressAddImage }) => {
  return (
    <View style={{ position: 'absolute', right: 15, bottom: 15 }}>
      <TouchableOpacity
        onPress={onPressAddImage}
        style={{
          backgroundColor: Colors.BACKGROUND,
          width: 60,
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 50,
        }}>
        <IconAdd color="white" size={30} name="camera" />
      </TouchableOpacity>
    </View>
  );
};
