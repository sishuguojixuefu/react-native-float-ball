import React, { Component } from 'react'
import { Button, Image, Modal, PanResponder, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface Props {
  readonly style?: object,
  readonly ball?: string,
  readonly ballStyle?: object
}

class FloatBall extends Component<Props, {}> {

  public state = {
    modalVisible: false
  }

  public setModalVisible = () => {
    const { modalVisible } = this.state
    this.setState({ modalVisible: !modalVisible })
  }

  public onRequestClose = () => {
    console.info('onRequestClose回调会在用户按下 Android 设备上的后退按键或是 Apple TV 上的菜单键时触发。请务必注意本属性在 Android 平台上为必填，且会在 modal 处于开启状态时阻止BackHandler事件。')
  }

  public renderBall = () => {
    return (
      <TouchableOpacity
        onPress={this.setModalVisible}
        style={{position: 'absolute'}}
      >
        <Image
          source={{ uri: 'https://i.loli.net/2019/03/21/5c9357d9d3119.png' }}
          style={{ width: 50, height: 50, borderRadius: 25 }}
          resizeMode="cover"
        />
      </TouchableOpacity>
    )
  }
  public render() {
    const { modalVisible } = this.state
    return (
      <View style={{ position: 'absolute', top: 50, left: 50 }}>
        {this.renderBall()}
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={this.onRequestClose}
        >
          <ScrollView
            automaticallyAdjustContentInsets={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <Button
              onPress={this.setModalVisible}
              title="Learn More"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
          </ScrollView>
        </Modal>
      </View>
    )
  }
}

// const styles = StyleSheet.create({
//   floatBall: {
//     position: 'absolute',
//     backgroundColor: '#ffffff',
//   }
// })

export default FloatBall
