import React, { Component } from 'react'
import ReactNative, {
  Image,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  View,
} from 'react-native'

interface Props {
  readonly style?: ReactNative.ViewStyle
  readonly onPress: (event?: ReactNative.GestureResponderEvent | any) => void
  readonly onLongPress?: (event?: ReactNative.GestureResponderEvent | any) => void
  readonly onDoublePress?: (event?: ReactNative.GestureResponderEvent | any) => void
  /**
   * 球的尺寸
   */
  readonly ballSize?: number
  /**
   * 默认距离左边的距离，默认 0
   */
  readonly left?: number
  /**
   * 默认距离顶部的距离，默认 100
   */
  readonly top?: number
  /**
   * 是否靠边，默认true
   */
  readonly keepToTheSide?: boolean
  /**
   * 自定义图片
   */
  readonly customBall?: any
}

class FloatBall extends Component<Props, any> {
  public static defaultProps = {
    onPress: () => {},
    ballSize: 50,
    left: 0,
    top: 100,
    keepToTheSide: true,
  }

  private _panResponder!: ReactNative.PanResponderInstance
  private lastLeft: number // 球距离左边的距离
  private lastTop: number // 球距离顶部的距离
  private previousLeft: number // 球移动后距离左边的距离（lastLeft + gestureState.dx）
  private previousTop: number // 球移动后距离顶部的距离（lastTop + gestureState.dy）
  private pressCount: number = 0

  // 参考 http://t.cn/AiNEEpAB，不要在 componentWillMount Hook 中注册响应器
  public constructor(props) {
    super(props)
    this.lastLeft = props.left
    this.lastTop = props.top
    this.previousLeft = 0
    this.previousTop = 0

    this.state = {
      ballStyle: { backgroundColor: 'white', top: props.top, left: props.left },
    }
    this._panResponder = PanResponder.create({
      // 用户开始触摸屏幕的时候，询问是否愿意成为响应者
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      // 返回false，允许内部触摸事件发生，http://t.cn/AiNminWr
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      // 在每一个触摸点开始移动的时候，再询问一次是否响应触摸交互
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dx, dy } = gestureState
        return Math.abs(dx) > 2 && Math.abs(dy) > 2
      },
      // 设置父视图防止子视图在移动开始时成为响应器
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      // 其他的视图想成为响应器。这种视图应该释放应答吗？返回 true 就是允许释放
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
      // 默认返回true。目前暂时只支持android。
      onShouldBlockNativeResponder: (evt, gestureState) => true,
      // 最近一次的移动距离为gestureState.move{X,Y}
      // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
      onPanResponderMove: this._onPanResponderMove,
      // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
      // 一般来说这意味着一个手势操作已经成功完成。
      onPanResponderRelease: this._onPanResponderRelease,
    })
  }

  private _onPanResponderMove = (evt, gestureState) => {
    const { dx, dy } = gestureState
    const ballSize = this.props.ballSize!

    this.previousLeft = this.lastLeft + dx
    this.previousTop = this.lastTop + dy

    // 限制小球拖拽移动的时候不许出屏幕外部
    const statusBarHeight = Platform.OS === 'android' ? 25 : 20
    if (this.previousLeft <= 0) {
      this.previousLeft = 0
    }
    if (this.previousTop <= 0) {
      this.previousTop = 0
    }
    if (this.previousLeft >= Dimensions.get('window').width - ballSize!) {
      this.previousLeft = Dimensions.get('window').width - ballSize
    }
    if (this.previousTop >= Dimensions.get('window').height - ballSize - statusBarHeight) {
      this.previousTop = Dimensions.get('window').height - ballSize - statusBarHeight
    }

    const { ballStyle } = this.state
    // 实时更新
    this.setState({
      ballStyle: {
        ...ballStyle,
        left: this.previousLeft || ballStyle.left,
        top: this.previousTop || ballStyle.top,
      },
    })
  }

  private _onPanResponderRelease = (evt, gestureState) => {
    const { dx, dy } = gestureState
    const { ballStyle } = this.state
    if (dx === 0 && dy === 0 && this.pressCount === 0) {
      this.props.onPress()
    }
    if (ballStyle.left !== this.props.left) {
      this.lastLeft = this.previousLeft
    }
    if (ballStyle.top !== this.props.top) {
      this.lastTop = this.previousTop
    }
    if (this.props.keepToTheSide) {
      this._keepToTheSide()
    }
  }

  private _keepToTheSide = () => {
    const { ballStyle } = this.state
    const { ballSize } = this.props

    if (ballStyle.left <= Dimensions.get('window').width / 2) {
      this.lastLeft = 0
    } else {
      this.lastLeft = Dimensions.get('window').width - ballSize!
    }
    this.setState({
      ballStyle: {
        ...ballStyle,
        left: this.lastLeft,
      },
    })
  }

  // http://t.cn/AiNBFPIf
  private _onPress = () => {
    if (this.props.onDoublePress) {
      this.pressCount += 1
      setTimeout(() => {
        if (this.pressCount === 1) {
          this.props.onPress()
        } else if (this.pressCount === 2) {
          this.props.onDoublePress!()
        }
        this.pressCount = 0
      }, 300)
    } else {
      this.props.onPress()
    }
  }

  public render() {
    const { ballSize, onLongPress, customBall } = this.props
    const { ballStyle } = this.state
    return (
      <View {...this._panResponder.panHandlers} style={[styles.container, { borderRadius: ballSize! / 2 }, ballStyle]}>
        <TouchableOpacity onPress={this._onPress} onLongPress={onLongPress}>
          <Image
            source={customBall || require('./ball.png')}
            style={[{ width: ballSize, height: ballSize, borderRadius: 25, zIndex: 9999 }]}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
})

export default FloatBall
