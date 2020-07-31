import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import ListData from '../mobx/global';
import {observer} from 'mobx-react';

export const Loading = observer(class LoadingView extends React.Component {
  render() {
    return (
      <View style={{flex: 1}}>
        {ListData.isLoading && (
          <View style={styles.container}>
            <ActivityIndicator size="large" />
          </View>
        )}
        {this.props.children}
      </View>
    );
  }
})

const styles = StyleSheet.create({
  container: {
    // top: 0, left: 0, right: 0, bottom: 0,
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
});
