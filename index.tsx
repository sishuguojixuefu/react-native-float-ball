import React, { Component } from 'react'
import {Animated, Modal, PanResponder, StyleSheet, Text, View} from 'react-native'

interface Props {
  img: string,
  style?: object
}

class FloatBall extends Component<Props, { }> {

  public state = {
    fadeAnim: new Animated.Value(0),
    modalVisible: false
  }

  public componentDidMount() {
    Animated.timing(                  // timing方法使动画值随时间变化
      this.state.fadeAnim,            // 要变化的动画值
      {
        toValue: 1,                   // 最终的动画值
        duration: 10000,              // 动画持续时间
        useNativeDriver: true         // 启用原生动画驱动
      }
    ).start()                        // 开始执行动画
  }

  public onRequestClose = () => {
    console.info('onRequestClose回调会在用户按下 Android 设备上的后退按键或是 Apple TV 上的菜单键时触发。请务必注意本属性在 Android 平台上为必填，且会在 modal 处于开启状态时阻止BackHandler事件。')
  }

  public render() {
    const {fadeAnim, modalVisible} = this.state
    const {style} = this.props
    return (
      <Animated.View // 使用专门的可动画化的View组件
        style={{
          ...style,
          opacity: fadeAnim,         // 将透明度指定为动画变量值
        }}
      >
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={this.onRequestClose}
        >
          <Text>I am the FloatBall component</Text>
        </Modal>
      </Animated.View>
    )
  }
}

export default FloatBall
