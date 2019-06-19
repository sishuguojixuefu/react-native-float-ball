# react-native-float-ball

## 安装

```sh
$ yarn add @sishuguojixuefu/react-native-float-ball
```

## 基本使用

```
import FloatBall from '@sishuguojixuefu/react-native-float-ball'
<FloatBall
  onPress={() => {
    alert('点击了球')
  }}
/>
```

## Props

| prop          | 描述                         |
| ------------- | ---------------------------- |
| onPress       | 球的点击事件                 |
| onLongPress   | 球的长按事件                 |
| onDoublePress | 球的双击事件                 |
| ballSize      | 球的尺寸，默认 50            |
| left          | 球初始距离左边的位置，默认 0 |
| top           | 球初始距离顶部的位置，默认 0 |
| keepToTheSide | 是否靠边，默认 true          |
| customBall    | 自定义球                     |

## 参考链接

- [PanResponder](https://reactnative.cn/docs/panresponder/)
- [React-Native PanResponder 的学习与使用](http://t.cn/AiNz29NE)
- [react-native 的 PanResponder 详解研究](http://t.cn/AiNmWcqR)
- [TouchableOpacity with parent PanResponder](http://t.cn/AiNminWr)
- [UNSAFE_componentWillMount()](http://t.cn/AiNEEpAB)
