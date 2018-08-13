import Taro, {Component} from '@tarojs/taro'
import {View, Text, Image, Navigator, ScrollView } from '@tarojs/components'
import follow from '../public/icon/icon_follow.png'
import config from '../config/default.json'
import {connect} from '@tarojs/redux'
import {doThemeCollect} from '../actions/theme'
import './ThemeCard.less'

const imageHost = config.qiniu_imageHost;

let mapState = state => {
  return {
  }
}

let mapDispatch = dispatch => ({
  onDoThemeCollect(id) {
    dispatch(doThemeCollect(id))
  }
})

@connect(mapState, mapDispatch)
class ThemeCard extends Component {
    constructor(props) {
      console.log(props);
        super(props);
        this.state = {
          themeList: [],
          themeCollectCount: ''
          }
    } 
    
    onHandleSubscribe = (e) => {
      let _id = e.currentTarget.dataset.id;
      let themeList = this.props.themeList;
      this.props.onDoThemeCollect(_id);
      let index = this.props.themeList.findIndex((item) => item._id ==_id);
        if (themeList[index].isCollect) {
          this.props.onHandleDeletTheme(_id)
      }
    }

    render() {
        const listItems = (this.props.themeList || []).map((item,index) => {
                return (
                    <View class="theme" key={ index }>
                      <Navigator class="theme-nav" hover-class="none" url= {`/pages/themes/deatils?id=${ item._id }`}>
                        <View class="theme-each">
                          <Image class="theme-img" src={`${ imageHost }theme/${ item._id }_m.jpg`}></Image>
                          <View class="theme-txt">
                            <Text>{ item.name }</Text>
                            <Text class="theme-count">{ item.count }人订阅</Text>
                          </View>
                        </View>
                      </Navigator>
                    <View data-index={ index }  data-id={ item._id } class={item.isCollect ? 'subscribe no' : 'subscribe'} onClick={ this.onHandleSubscribe }>
                      { !item.isCollect ?
                      <View>
                        <Image src={ follow }></Image>
                        <Text>订阅</Text>
                      </View> :
                      <View >
                        <Text>已订阅</Text>
                      </View> }
                    </View>
                  </View>
                  
                )
            })
        return (
            <ScrollView scroll-y style='height: 100%;box-sizing: border-box;margin: 0 32rpx;width: auto'>
               { listItems }
            </ScrollView>
        )
    }
}

export default ThemeCard