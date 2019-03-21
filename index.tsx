import React, { Component } from 'react'
import { Image, PanResponder, StyleSheet, TouchableOpacity, View } from 'react-native'

interface Props {
  readonly style?: object,
  readonly children: React.ReactNode
  readonly onPress: ((event: any) => void) | undefined
}

class FloatBall extends Component<Props, {}> {

  public render() {
    const { onPress, children } = this.props

    return (
      <View style={{ position: 'absolute' }}>
        <TouchableOpacity
          onPress={onPress}
          style={{ position: 'absolute' }}
        >
          <Image
            source={{ uri: 'https://i.loli.net/2019/03/21/5c9357d9d3119.png' }}
            style={{ width: 50, height: 50, borderRadius: 25 }}
            resizeMode="cover"
          />
        </TouchableOpacity>
        {children}
      </View>
    )
  }
}

export default FloatBall
