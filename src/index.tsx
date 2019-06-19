import React, { Component } from 'react'
import ReactNative, { Image, PanResponder, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'

interface Props {
  readonly style?: ReactNative.ViewStyle
  readonly onPress: (event: ReactNative.GestureResponderEvent) => void
  /**
   * 球的尺寸
   */
  readonly ballSize?: number
}

const lastLeft = 0 // 球距离左边的距离
const lastTop = 0 // 球距离顶部的距离
let previousLeft = 0 // 球移动后距离左边的距离（lastLeft + gestureState.dx）
let previousTop = 0 // 球移动后距离顶部的距离（lastTop + gestureState.dy）

class FloatBall extends Component<Props, any> {
  public static defaultProps = {
    onPress: () => {},
    ballSize: 50,
  }

  public _panResponder!: ReactNative.PanResponderInstance

  // 参考 http://t.cn/AiNEEpAB，不要在 componentWillMount Hook 中注册响应器
  public constructor(props) {
    super(props)
    this._panResponder = PanResponder.create({
      // 用户开始触摸屏幕的时候，询问是否愿意成为响应者
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      // 在每一个触摸点开始移动的时候，再询问一次是否响应触摸交互
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      // 在每一个触摸点开始移动的时候，再询问一次是否响应触摸交互
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      // 设置父视图防止子视图在移动开始时成为响应器
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      // 其他的视图想成为响应器。这种视图应该释放应答吗？返回 true 就是允许释放
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
      // 默认返回true。目前暂时只支持android。
      onShouldBlockNativeResponder: (evt, gestureState) => true,
      // 开始手势操作，也可以说按下去。给用户一些视觉反馈，让他们知道发生了什么事情！（如：可以修改颜色）
      // gestureState.{x,y} 现在会被设置为0
      onPanResponderGrant: (evt, gestureState) => {
        console.info('[FloatBall]gestureState:', gestureState)
        const { x0, y0 } = gestureState
        console.info('[FloatBall]开始手势操作:', `x0: ${x0}`, `y0: ${y0}`)
      },

      // 最近一次的移动距离为gestureState.move{X,Y}
      // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
      onPanResponderMove: this._onPanResponderMove,
      // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
      // 一般来说这意味着一个手势操作已经成功完成。
      onPanResponderRelease: this._onPanResponderRelease,
    })
  }

  public _onPanResponderMove = (evt, gestureState) => {
    const { dx, dy, moveX, moveY } = gestureState
    console.info('[FloatBall]gestureState:', gestureState)
    console.info('[FloatBall]最近一次的移动距离:', `moveX: ${moveX}`, `moveY: ${moveY}`)
    console.info('[FloatBall]从成为响应者开始时的累计手势移动距离:', `dx: ${dx}`, `dy: ${dy}`)
    this._movingBall({ dx, dy })
  }

  public _onPanResponderRelease = (evt, gestureState) => {
    console.info('[FloatBall]gestureState:', gestureState)
    const { dx, dy, moveX, moveY } = gestureState
    console.warn('[FloatBall]手势操作成功')
    console.info('[FloatBall]最近一次的移动距离:', `moveX: ${moveX}`, `moveY: ${moveY}`)
    console.info('[FloatBall]从成为响应者开始时的累计手势移动距离:', `dx: ${dx}`, `dy: ${dy}`)
  }

  public _movingBall = ({ dx, dy }) => {
    const ballSize = this.props.ballSize!

    previousLeft = lastLeft + dx
    previousTop = lastTop + dy

    // 限制小球拖拽移动的时候不许出屏幕外部
    if (previousLeft <= 0) {
      previousLeft = 0
    }
    if (previousTop <= 0) {
      previousTop = 0
    }
    if (previousLeft >= Dimensions.get('window').width - ballSize!) {
      previousLeft = Dimensions.get('window').width - ballSize
    }
    if (previousTop >= Dimensions.get('window').height - ballSize) {
      previousTop = Dimensions.get('window').height - ballSize
    }

    // 实时更新
    this.setState({
      moveStyle: {
        backgroundColor: 'red',
        left: previousLeft,
        top: previousTop,
      },
    })
  }

  public render() {
    const { onPress, ballSize } = this.props
    const { moveStyle } = this.state

    return (
      <TouchableOpacity {...this._panResponder.panHandlers} onPress={onPress} style={[styles.container, moveStyle]}>
        <Image
          source={{ uri: 'https://i.loli.net/2019/03/21/5c9357d9d3119.png' }}
          style={[{ width: ballSize, height: ballSize, borderRadius: 25 }]}
          resizeMode="cover"
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
})

export default FloatBall
