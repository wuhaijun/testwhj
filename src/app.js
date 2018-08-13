import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import { Provider } from '@tarojs/redux'
import config from './config/default.json'


import configStore from './store'

import './app.less'

const store = configStore()

import { connect } from '@tarojs/redux'
import { login } from './actions/login';

let mapStateToProps = state => {
  return {

  }
}

let mapDispatchToProps = dispatch =>({
  login() {
    dispatch(login())
  }
})

@connect(mapStateToProps,mapDispatchToProps)
class App extends Component {
  config = {
    pages: [
      'pages/projects/index',
      'pages/themes/index',
      'pages/themes/deatils',
      'pages/user/index',
      'pages/projects/search',
      'pages/projects/edit'
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "脑洞阅读",
      navigationBarTextStyle: "black",
      onReachBottomDistance: 100,
    },
    tabBar: {
      borderStyle: "white",
      position: "bottom",
      color: "#b8b8b8",
      selectedColor: "#ffda72",
      backgroundColor: "#000",
      list: [
        {
          pagePath: "pages/themes/index",
          text: "订阅",
          iconPath: './public/icon/toolbar_follow_nor.png',
          selectedIconPath: './public/icon/toolbar_follow_pre.png'
        },
        {
          pagePath: "pages/projects/index",
          text: "资讯",
          iconPath: './public/icon/toolbar_news_nor.png',
          selectedIconPath: './public/icon/toolbar_news_pre.png'
        },
        {
          pagePath: "pages/user/index",
          text: "个人",
          iconPath: './public/icon/toolbar_profile_nor.png',
          selectedIconPath: './public/icon/toolbar_profile_pre.png'
        }
      ]
    }
  }

  componentWillMount () {
    this.props.login();
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  render () {
    return (
      <Provider store={store}>
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
