import Taro, {Component} from '@tarojs/taro'
import { View, Text, Navigator } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { getUserInfo } from "../../actions/user";
import ThemeCard from '../../components/ThemeCard'
import './index.less'
import config from '../../config/default.json'


const imageHost = config.qiniu_imageHost;

let mapState = state => {
  return { themeList: state.themeList, userInfo: state.userInfo }
}

let mapDispatch = dispatch => ({
  onGetUserInfo() {
    dispatch(getUserInfo())
  }
})

@connect(mapState, mapDispatch)

class Theme extends Component {

  config = {
    navigationBarTitleText: '三千米🐬'
  }

  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
    }
  }

  componentWillMount() {
    this.props.onGetUserInfo();
    wx.hideShareMenu();
    }

  render () {
    const subscibeList = this.props.themeList.filter(item => item.isCollect);
    const scrollX = subscibeList.map((item,index) => {
      return (<View key={ index } class="my-greatest-view">
                  <Navigator class="theme-nav" hover-class="none" url={`/pages/theme/detail/index?_id=${ item._id }`}>
                    <View class="subscription-bgimage" style={`background-image: url(${ imageHost }theme/${ item._id }_m.jpg)`}>
                      <View class="mytheme">
                        <Text>{ item.name }</Text>
                      </View>
                    </View>
                  </Navigator>
              </View>)
    })
    let isMytheme;
    if (subscibeList.length != 0) {
        isMytheme =  
        <block>
            <View class="greatest">
              <Text>我的主题站</Text>
            </View>
            <View class="greatest-scroll">
              <scroll-View class="my-greatest" scroll-x="true" style="width: 100%;margin:0">
                { scrollX }
              </scroll-View>
            </View>
        </block> 
    }
    
    return (
      <View class='themehome'>
        {  isMytheme }
          <View class="greatest">
              <Text>主题站精选</Text>
          </View>
          <ThemeCard themeList={ this.props.themeList } userInfo={ this.props.userInfo }/>
      </View>
    )
  }
}
export default Theme
