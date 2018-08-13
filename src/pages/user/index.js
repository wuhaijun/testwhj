import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image, Swiper, ScrollView, SwiperItem } from '@tarojs/components'
import {connect} from '@tarojs/redux'
import uesrImage from '../../public/Images/userInfo.png'
import share from '../../public/icon/icon_share_nor.png'
import empty from '../../public/icon/icon_empty.png'
import { getUserInfo, getProjectNotes, getProjectCollects} from '../../actions/user'
import { doProjectCollect } from '../../actions/project'
import { login } from '../../actions/login'
import ArticleSimpleCards from '../../components/ArticleSimpleCards'
import ThemeCard from '../../components/ThemeCard'
import './index.less'
import PosterCard from '../../components/PosterCard'
import ShareBar from '../../components/ShareBar'
import config from '../../config/default.json'





let mapState = state => {
  return { 
    userNote: state.userNotes,
    userInfo: state.userInfo,
    userCollect: state.userCollects,
    themeList: state.themeList,
    themeMapping: state.themeMapping
  }
}

let mapDispatch = dispatch => ({
  onGetUserInfo() {
    dispatch(getUserInfo())
  },
  onGetProjectNotes(page) {
    dispatch(getProjectNotes(page))
  },
  onGetProjectCollects(page) {
    dispatch(getProjectCollects(page))
  },
  async onDoProjectCollect(page) {
    dispatch(await doProjectCollect(page))
  },
  onLogin() {
    dispatch(login())
  }
})

@connect(mapState, mapDispatch)
class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
          currentTab: 0,
          hasUserInfo: false,
          iscancel: false,
          id: '',
          userInfoImage: '',
          hasMoreCollect : true,
          isClickShare: false,
          showPosterMask: false,
          shareArticleId: '',
          shareContent: ''
        }
    }
  config = {
    navigationBarTitleText: '三千米🐬'
  }
  onHandleToggle = (e) => {
    let current = e.target.dataset.current;
    this.setState({
      currentTab: current
    })
  }

   onHandleChange = (e) => {
     let current = e.detail.current;
     this.setState({
       currentTab: current
     });
   }

   onHandleCancel = (e) => {
     e.stopPropagation();
     this.setState({
       iscancel: false,
     })
   }
   onHandleLongPress = (on,id) => {
      this.setState({
        id: id,
        iscancel: on
      })
   }

   onHandleDelete() {
      this.props.onDoProjectCollect(this.state.id);
      this.props.userInfo.projectCollectCount--;
      this.setState(prevState => ({
       iscancel: false
     }));
    setTimeout(()=>{
      this.props.onGetProjectCollects(1);
    },200);

   }
   
   onHandleDeletTheme = (id) => {
    this.props.userInfo.themeCollectCount--;
   }

   onHandleGetUserInfo = (e) => {
     this.props.onGetUserInfo();
     this.props.onGetProjectNotes(1);
     this.props.onGetProjectCollects(1);
     if (e.detail.userInfo) {
       Taro.setStorage({
         key: 'user_info',
         data: e.detail.userInfo,
       })
       this.setState({
         userInfoImage: e.detail.userInfo,
         hasUserInfo: false
       })
     } else {
       this.setData({
         hasUserInfo: true
       })
     }

   }
   componentWillMount () {
     this.props.onGetProjectCollects(1);
     this.props.onGetProjectNotes(1);
     let userInfo = Taro.getStorageSync('user_info');
     if (userInfo) {
       this.setState({
         userInfoImage: userInfo,
         hasUserInfo: false
       });
     } else {
       this.setState({
         hasUserInfo: true
       });
     };
   }

  componentDidShow () { 
    this.props.onGetUserInfo();
    this.props.onGetProjectNotes(1);
    this.props.onGetProjectCollects(1);
  }

  onScrolltolower = () => {
     let notePage = Math.ceil((this.props.userNote.length / 24));
     let nextPage = notePage + 1;
    this.props.onGetProjectNotes(nextPage);
  }

  onCollectScrolltolower = () => {
      let currentPage = Math.ceil((this.props.userCollect.projectList.length / 24));
      let nextPage = currentPage + 1;
      this.props.onGetProjectCollects(nextPage);

  }

  onShareBox = (event) => {
    this.setState({
      isClickShare: true,
      shareArticleId: event.currentTarget.dataset.id,
      shareContent: event.currentTarget.dataset.note
    })
  }


 onMadePoster = () => {
  this.setState({
    showPosterMask: true,
    isClickShare: false
  });
}


  onHandHide = () => {
    this.setState({
      showPosterMask: false
    });
  }

  onClickMask = (e) => {
    this.setState({
      isClickShare: false
    })
  }
  
  onHidePoster = () => {
    this.setState({
      showPosterMask: false
    });
  }

  onShareAppMessage = (res) => {
      let nickName = '';
      let userInfo = wx.getStorageSync('user_info');
      if (userInfo) {
        nickName = userInfo.nickName;
      }
      return {
        title: nickName + "在"+config.appName+"上分享了一段文字",
        path: '/pages/projects/detail/index',
        success: (res) => {
          if (res.errMsg == "shareAppMessage:ok") {
            wx.showToast({
              title: '转发成功',
              icon: 'success',
              duration: 1500
            })
          }
        },
        fail: (res) => {
          if (res.errMsg == "shareAppMessage:fail cancel") {
            wx.showToast({
              title: '转发取消',
              duration: 1500
            })
          } else {
            wx.showToast({
              title: '转发失败',
              duration: 1500
            })
          }
        },
        complete: (res) => {
          this.setState({ showPosterMask: false, isClickShare: false });
        }
      }
  }


  render () {
    const collectLength = (this.props.userCollect.projectList || []).length;
    const themeCollectList = this.props.themeList.filter((item) => item.isCollect);
    const noteList = (this.props.userNote || []).map((item,index) => {
        return (<View class="note" key={ index }>
                      <View class="note-book">{ item.note }</View>
                      <View class="note-title">{ item.Text }</View>
                      <View class="article-title">---引自<Text class="note-text">{ item.projectTitle }</Text></View>
                      <View class="note-time">
                        <Text>{ item.notedDate }</Text>
                        <Image data-note={ item.note } data-Text={ item.Text } data-id={ item.pid } onClick={this.onShareBox} src={ share }></Image>
                      </View>
                </View>)
    });


    let shareBar
    let showShareBar
    let posterMask
    let posterCard
    if (this.state.isClickShare) {
      shareBar = <ShareBar onMadePoster={this.onMadePoster} />
      showShareBar = <View class="mask" onClick={this.onClickMask}>
      </View>
    } else {
      shareBar = null
      showShareBar = null
    }

    if (this.state.showPosterMask) {
      posterMask = <View class="mask" onClick={this.onHidePoster}></View>
      posterCard = <PosterCard onHandHide={this.onHandHide}  shareArticleId={this.state.shareArticleId} title={this.state.shareContent} />
    } else {
      posterMask = null
      posterCard = null
    }



    return (
      <View>
        { hasUserInfo ? <View class="empower">
          <Image class="empower-img" src={ uesrImage }></Image>
          <View class="empower-txt">登录之后就能看到个人了哦</View>
          <Button class="empower-btn" open-type="getUserInfo" onGetuserinfo={ this.onHandleGetUserInfo }> 登录 </Button>
        </View>:
        <block>
          <View class="userinfo">
            <Image class="userinfo-avatar" src={ this.state.userInfoImage.avatarUrl } background-size="cover"></Image>
            <Text class="userinfo-nickname">{ this.state.userInfoImage.nickName }</Text>
          </View>
          <View class="swiper-scroll">
            <View class="swiper-tab">
              <View class={ currentTab == 0 ? ' swiper-tab-list on' : 'swiper-tab-list' } data-current="0" onClick={ this.onHandleToggle }>
                收藏
                <Text data-current="0" onClick={ this.onHandleToggle }>{ this.props.userInfo.projectCollectCount }</Text>
                <Text class ={ currentTab == 0 ? 'collect-txt none' : 'collect-txt' } > </Text>
              </View>
              <View class={ currentTab==1 ? 'swiper-tab-list on' : 'swiper-tab-list' } data-current="1" onClick={ this.onHandleToggle }>
                笔记
                <Text data-current="1" onClick={ this.onHandleToggle }>{ this.props.userInfo.projectNoteCount }</Text>
                <Text class={ currentTab==1 ? 'collect-txt none' : 'collect-txt' }></Text>
              </View>
              <View class={ currentTab==2 ? 'swiper-tab-list on' : 'swiper-tab-list'} data-current="2" onClick={ this.onHandleToggle }>
                订阅
                <Text data-current="2" onClick={ this.onHandleToggle }>{ this.props.userInfo.themeCollectCount }</Text>
                <Text class={ currentTab==2 ? 'collect-txt none' : 'collect-txt' }></Text>
              </View>
            </View>
            <View class="swiper-toggle">
              <Swiper current={currentTab} style="100%" class="swiper-box" onChange={ this.onHandleChange }>
                <SwiperItem>
                  { collectLength !=0 ?
                  <ArticleSimpleCards 
                      onCollectScrolltolower = { this.onCollectScrolltolower } 
                      onHandleLongPress = { this.onHandleLongPress }  
                      projectList = { this.props.userCollect.projectList } 
                      themeMapping={this.props.themeMapping}/> :
                  <View else class="empty-view">
                    <Image class="empty-view-img" src={ empty }></Image>
                    <Text>你还没有相关记录哦</Text>
                  </View> }
                </SwiperItem>
                <SwiperItem>
                  { this.props.userNote.length !=0 ?
                  <ScrollView scroll-y style='height: 100%;box-sizing: border-box;maigin:0 32rpx;width: auto' onScrolltolower={ this.onScrolltolower }>
                    { noteList }
                  </ScrollView> :
                  <View else class="empty-view">
                    <Image class="empty-view-img" src={ empty }></Image>
                    <Text>你还没有相关记录哦</Text>
                  </View> }
                </SwiperItem>
                <SwiperItem>
                  { themeCollectList !=0 ?
                  <ThemeCard themeList={ themeCollectList } userInfo={ this.props.userInfo } onHandleDeletTheme = { this.onHandleDeletTheme }/> :
                  <View else class="empty-view">
                    <Image class="empty-view-img" src={ empty }></Image>
                    <Text>你还没有相关记录哦</Text>
                  </View> }
                </SwiperItem>
              </Swiper>
            </View>
          </View>
        </block> }
        { iscancel && <View class="showmodal" >
            <View class="modal">
              <View onClick={ this.onHandleCancel }>取消</View>
              <View onClick={ this.onHandleDelete.bind(this) }>删除</View>
            </View>
        </View> }

        <View>
          {shareBar}
          {showShareBar}
          {posterMask}
        </View>
        <View>
          {posterCard}
        </View>


      </View> 


    )
  }
}

export default User
