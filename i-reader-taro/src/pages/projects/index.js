import Taro, { Component } from '@tarojs/taro'
import { View, Button, Navigator, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { getProjectList } from '../../actions/project'
import ArticleCards from '../../components/ArticleCards'
import search from '../../public/icon/icon_search.png'
import './index.less'
import ShareBar from '../../components/ShareBar'
import { getThemeList } from '../../actions/theme';
import PosterCard from '../../components/PosterCard'
import { doProjectShare } from '../../actions/project';
import config from '../../config/default.json'



let mapState = state => {
  return {
    projectList: state.projectList,
    projectDetail: state.projectDetal,
    themeList: state.themeList,
    themeMapping: state.themeMapping
  }
}

let mapDispatch = dispatch => ({
  onGetProjectList(id, page) {
    dispatch(getProjectList(id, page))
  },
  doProjectShare(id,type) {
    dispatch(doProjectShare(id,type))
  },
  onGetThemeList() {
    dispatch(getThemeList())
  },
})

@connect(mapState, mapDispatch)
class Project extends Component {
  config = {
    navigationBarTitleText: '三千米🐬'
  }

  constructor(props) {
    super(props);
    this.state = {
      isRecommended: true,
      isSubscribed: false,
      page: 1,
      isClickShare: false,
      showPosterMask: false,
      shareImg: '',
      shareArticleId: '',
      shareContent: '',
      projectType: ''
    }
  }

  onHandleSearchClick() {
    Taro.navigateTo({ url: '/pages/projects/search' })
  }

  onHandleToggleSub = () => {
    this.setState(prevState => ({
      isRecommended: !prevState.isRecommended,
      isSubscribed: !prevState.isSubscribed,
      projectType: ''
    }));
    this.props.onGetProjectList('', 1);
  }
  onHandleToggleRec = () => {
    this.setState(prevState => ({
      isRecommended: !prevState.isRecommended,
      isSubscribed: !prevState.isSubscribed,
      projectType: 'subscribe'
    }));
    this.props.onGetProjectList('subscribe', 1);
  }

  componentWillMount() {
    this.props.onGetProjectList('', this.state.page);
    this.props.onGetThemeList();
  }

  loadmore = () => {
     let page = Math.ceil((this.props.projectList.length / 24));
     let nextPage = page + 1;
    this.props.onGetProjectList(this.state.projectType, nextPage);
  }

  onReachBottom = () => {
    this.loadmore();
  }

  onHandleShare = (isClickShare, dataShare) => {
    this.setState({
      isClickShare: isClickShare,
      shareImg: dataShare.url,
      shareArticleId: dataShare.id,
      shareContent: dataShare.title
    })
  }
  onHandHide = () => {
    this.props.doProjectShare(this.state.shareArticleId,"img");
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

  onMadePoster = () => {

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.setState({
            showPosterMask: true,
            isClickShare: false
          });
        } else {
          Taro.showModal({
            title: '用户未登录授权',
            content: '请先到用户中心登录授权。',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                Taro.switchTab({
                  url: '/pages/user/index'
                })
              }
            }
          })
        }
      }
    })
  }

  onShareAppMessage = (res) => {
    if (res.from === 'button') {
      return {
        title: this.state.shareContent,  
        path: '/pages/projects/detail/index?id=' + this.state.shareArticleId + "&sharedArticle=sharedArticle",
        imageUrl: this.state.shareImg,
        success: (res) => {
          if (res.errMsg == "shareAppMessage:ok") {
            this.props.doProjectShare(this.state.shareArticleId,"chat");
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
          this.setState({ showShareBar: false,isClickShare: false });
        }
      }
    }
    if (res.from === 'menu') {
      let nickName = '';
      let userInfo = wx.getStorageSync('user_info');
      if (userInfo) {
        nickName = userInfo.nickName;
      }
      return {
        title: nickName + "正在邀请你来"+config.appName,
        path: '/pages/projects/index',
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
          this.setState({ showShareBar: false, isClickShare: false });
        }
      }
    } 
  }




  render() {
    const asSubscribed = this.props.themeList.filter(item => item.isCollect);
    let status
    if (asSubscribed.length == 0) {
      status =
        <View class="myinformation-block">
          <View data-type='information' onClick={this.onHandleToggleSub} class="information-featured information-w">资讯站精选</View>
        </View>
    } else {
      status =
        <View class="myinformation-block">
          <View data-type='information' onClick={this.onHandleToggleSub} class={isSubscribed ? 'information-featured' : 'information-featured information-w'}>资讯站精选</View>
          <View data-type='myinformation' onClick={this.onHandleToggleRec} class={isRecommended ? 'information-featured' : 'information-featured information-w'}>我订阅的</View>
        </View>
    }
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
      posterCard = <PosterCard onHandHide={this.onHandHide}  coverImage={this.state.shareImg} shareArticleId={this.state.shareArticleId} title={this.state.shareContent} />
    } else {
      posterMask = null
      posterCard = null
    }

    return (
      <View class="information">
        <View class="information-news">
          {status}
          <Navigator class="theme-nav" hover-class="none" url='/pages/projects/search'>
            <View class="search-input">
              <Image class="search-img" src={search}></Image>
            </View>
          </Navigator>
        </View>
        <ArticleCards isClick={true} onHandleShare={this.onHandleShare} projectList={this.props.projectList} themeMapping={this.props.themeMapping} />
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

export default Project

