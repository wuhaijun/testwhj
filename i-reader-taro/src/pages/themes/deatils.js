import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { getProjectList } from '../../actions/project';
import { doThemeCollect } from '../../actions/theme'
import ArticleCards from '../../components/ArticleCards'
import config from '../../config/default.json'
import arrow from '../../public/icon/icon_arrow.png'
import './deatils.less'
import ShareBar from '../../components/ShareBar'
import PosterCard from '../../components/PosterCard'
import { doProjectShare } from '../../actions/project';


const imageHost = config.qiniu_imageHost;

let mapState = state => {
    return { projectList: state.projectList, themeMapping: state.themeMapping }
}

let mapDispatch = dispatch => ({
    onGetProjectList(id, page) {
        dispatch(getProjectList(id, page))
    },
    onDoThemeCollect(id) {
        dispatch(doThemeCollect(id))
    },
    doProjectShare(id, type) {
        dispatch(doProjectShare(id, type))
    }
})

@connect(mapState, mapDispatch)
class Details extends Component {
    config = {
        navigationBarTitleText: '三千米🐬',
        navigationStyle: 'custom'
    }

    constructor(props) {
        super(props);
        this.state = {
            scroll: false,
            id: this.$router.params.id,
            isClickShare: false,
            showPosterMask: false,
            shareImg: '',
            shareArticleId: '',
            shareContent: '',
            loadCompleted: false

        }
    }
    componentWillMount() {
        let id = this.$router.params.id;
        this.props.onGetProjectList(id, 1);
        this.setState({
            id,
            page: 2
        })
    }

    onPageScroll = () => {
        this.setState({
            scroll: true,
        });
    }

    onHandleSubscribe = (e) => {
        let _id = e.currentTarget.dataset._id;
        this.props.doThemeCollect(_id);
    }


    loadmore = () => {
        let id = this.state.id;
        let page = Math.ceil((this.props.projectList.length / 24));
        let nextPage = page + 1;
        this.props.onGetProjectList(id, nextPage);
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
        this.props.doProjectShare(this.state.shareArticleId, "img");
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
              this.setState({ showPosterMask: false,isClickShare: false });
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
              this.setState({ showPosterMask: false, isClickShare: false });
            }
          }
        } 
    }








    render() {
        let id = this.state.id;
        if (!id || this.props.projectList.length == 0) return ""
        let theme = this.props.themeMapping[id] || {};


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
            posterCard = <PosterCard onHandHide={this.onHandHide} coverImage={this.state.shareImg} shareArticleId={this.state.shareArticleId} title={this.state.shareContent} />
        } else {
            posterMask = null
            posterCard = null
        }



        return (
            <View class="theme-articles">
                <View class={scroll ? 'articles-img articles-img-scroll' : 'articles-img'} style={`background-Image: url(${imageHost}theme/${id}_l.jpg)`}>
                    <View class={scroll ? 'articles-img-scroll-view' : ''}>{theme.desc}</View>
                </View>
                <View class={scroll ? 'articles articles-scroll' : 'articles'}>
                    <View class={scroll ? 'articles-title articles-title-scroll' : 'articles-title'}>
                        <View>
                            <Text class="articles-txt">{theme.name}</Text>
                            <Text class="articles-desc">{theme.count}人订阅</Text>
                        </View>
                        <View data-_id={theme._id} class={theme.isCollect ? 'subscribe no' : 'subscribe'} onClick={this.onHandleSubscribe}>
                            {theme.isCollect ?
                                <View>
                                    <Text>已订阅</Text>
                                </View> :
                                <View>
                                    <Image src="/public/icon/icon_follow.png"></Image>
                                    <Text>订阅</Text>
                                </View>}
                        </View>
                    </View>
                </View>
                <View class={scroll ? 'articles-arrow articles-img-scroll-view' : 'articles-arrow'}>
                    <Image src={arrow}></Image>
                </View>
                <View class="information">
                    <View class="information-news">
                        <View class="myinformation-block">
                            <View data-type='information' class="information-txt">精选推荐</View>
                        </View>
                    </View>
                    <ArticleCards  onHandleShare={this.onHandleShare} isClick={false} projectList={this.props.projectList} themeMapping={this.props.themeMapping} />
                </View>

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

export default Details
