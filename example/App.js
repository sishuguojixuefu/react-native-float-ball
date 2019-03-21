import React, {Component} from 'react';
import {Platform, Text, View} from 'react-native';
import FloatBall from 'react-native-floatBall'

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <FloatBall />
      </View>
    );
  }
}
