import Taro, { Component, hideToast } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import "./PosterCard.less"
import util from '../utils/util';
import config from '../config/default.json'
import { changeText } from '../../src/actions/common'
import { connect } from '@tarojs/redux'

let mapState = state => {
  return { textContent: state.textContent }
}

let mapDispatch = dispatch => ({

  changeText(textContent) {
    dispatch(changeText(textContent))
  }
})

@connect(mapState, mapDispatch)


class PosterCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appName: '',
      nickName: '',
      qrImage: '',
      arrDate: '',
      showTips: true,
      canvasWidth: 0,
      canvasHeight: 0,
      qrImagePath: '',
      coverImage: ''
    }
  }

  componentWillMount() {

  }
  componentDidMount() {

    this.props.changeText(this.props.title);

    let user_info = Taro.getStorageSync('user_info');
    let qrImage = config.server + '/api/common/weqr?scene=' + encodeURIComponent(this.props.shareArticleId) + "&page=" + encodeURIComponent("pages/article/detail/index");
    let coverImage = this.props.coverImage;
    if (coverImage && coverImage.indexOf("https") == -1) {
      coverImage = coverImage.replace("http", "https");
    }

    this.setState({
      appName: config.appName,
      nickName: user_info.nickName,
      qrImage: qrImage,
      arrDate: util.getDate(),
      coverImage: coverImage

    }, () => {

    })


    this.__getClientRect__().then((res) => {
      this.canvasWidth = res.width
      this.canvasHeight = res.height
      this.setState({ canvasWidth: this.canvasWidth, canvasHeight: this.canvasHeight });
    }).catch(() => {
      let systemInfo = wx.getSystemInfoSync();
      let canvasWidth = systemInfo.screenWidth
      let canvasHeight = systemInfo.screenHeight * 0.85
      this.setState({ canvasWidth: canvasWidth, canvasHeight: canvasHeight });
      console.log('Cannot get the component react info, get the screen width and height: ', this.canvasWidth, this.canvasHeight);
    })



    setTimeout(() => {
      this.setState({
        showTips: false,
      });
    }, 2500);

  }


  __getClientRect__ = () => {
    var that = this;
    return new Promise((resolve, reject) => {
      let query = wx.createSelectorQuery().in(that.$scope);
      let nodeRef = query.select('#modal-poster');
      nodeRef.boundingClientRect(res => {
        if (!res) {
          console.warn('Cannot get the client react for #modal-poster');
          reject();
        } else {
          resolve(res)
        }
      }).exec();
    })
  }


  componentWillReceiveProps(nextProps) { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onSavePoster = (e) => {
    this.__madeCanvas__();
    Taro.showLoading({
      title: '保存中',
    });
  }

  __madeCanvas__ = () => {
    Taro.getImageInfo({
      src: this.state.qrImage,
      success: (res) => {
        this.setState({
          qrImagePath: res.path
        }, () => {
          if (this.state.coverImage) {
            Taro.getImageInfo({
              src: this.state.coverImage,
              success: (res) => {
                let coverImagePath = res.path;
                this.drawCanvas(coverImagePath);
              },
              fail: (res) => {
              }
            })
          } else {
            this.drawCanvas();
          }
        })
      },
      fail: (res) => {
        console.warn("res", res.errMsg);
      }
    })
  }

  drawCanvas = (coverImagePath) => {

    let ctx = wx.createCanvasContext('posterImg', this.$scope);
    ctx.clearRect(0, 0, 0, 0);
    //定义整个canvas的宽高,是个矩形，填充背景为白色
    let widthCanvas = this.state.canvasWidth;
    let heightCanvas = this.state.canvasHeight;
    ctx.setFillStyle('white');
    ctx.fillRect(0, 0, widthCanvas, heightCanvas);
    ctx.fill();

    //规定内容距离左右的边距
    let spaceAround = 36 / 2;
    //内容居中的宽度
    let autoWidth = widthCanvas - spaceAround * 2;
    let blackColor = "#000000";
    let lightColor = "#8a8a8a";

    //画矩形 日期和斜边
    let dateRectWidth = 35;
    let dateRectHeigth = 35;
    ctx.setStrokeStyle(blackColor);
    ctx.strokeRect(spaceAround, spaceAround, dateRectWidth, dateRectHeigth);
    ctx.moveTo(spaceAround + 4, spaceAround + dateRectWidth - 4);
    ctx.lineTo(spaceAround + dateRectHeigth - 4, spaceAround + 4);
    ctx.setStrokeStyle(lightColor);
    ctx.setFontSize(12);
    ctx.setFillStyle(blackColor);
    ctx.fillText(this.state.arrDate[2], 24, 31, 50);
    ctx.fillText(this.state.arrDate[1], 36, 48, 50);

    //日期显示
    ctx.setFillStyle(lightColor);
    ctx.setFontSize(10);
    ctx.fillText(this.state.arrDate[2] + "/" + this.state.arrDate[1] + "/" + this.state.arrDate[0], 18 + 35 + 6, spaceAround + 10, 100);

    //昵称
    ctx.setFontSize(10);
    ctx.setFillStyle(blackColor);
    ctx.fillText(this.state.nickName, 18 + 35 + 6, spaceAround + 10 + 20);
    let nickNameWidth = ctx.measureText(this.state.nickName);
    ctx.setFontSize(10);
    ctx.setFillStyle(lightColor);
    let headText = '正在阅读这篇文章';
    if (!coverImagePath) {
      headText = "在" + config.appName + "上分享了一段文字";
    }

    ctx.fillText(headText, 18 + 35 + 6 + 10 + nickNameWidth.width, spaceAround + 10 + 20)
    //封面图片

    if (coverImagePath) {
      ctx.drawImage(coverImagePath, spaceAround, spaceAround + 35 + 27, autoWidth, autoWidth * 3 / 5);
    }
    //title文章标题
    let textTitle = this.props.textContent;
    if (coverImagePath) {
      textTitle = textTitle.substring(0, 50);
    } else {
      textTitle = textTitle.substring(0, 140);
    }
    let chr = textTitle.split("");

    let temp = "";
    let row = [];
    ctx.setFontSize(18);
    ctx.setFillStyle(blackColor);
    for (let i = 0; i < chr.length; i++) {
      if ((ctx.measureText(temp).width < autoWidth) && chr[i].charCodeAt() != 10) {
        temp += chr[i];
      } else {
        row.push(temp);
        temp = "";
        temp = chr[i];
      }
    }
    row.push(temp);

    let coverImageHeight;
    if (!coverImagePath) {
      coverImageHeight = 30 + 60 + spaceAround + 35 + 27;
    } else {
      coverImageHeight = 20 + 30 + autoWidth * 3 / 5 + spaceAround + 35 + 27;
    }
    for (let i = 0; i < row.length; i++) {
      ctx.setTextAlign('justify');
      ctx.fillText(row[i], spaceAround, i * 24 + coverImageHeight, autoWidth);
    }

    //底部区域带背景色 二维码区域
    ctx.setFillStyle('#fff');
    let footerHeight = 124 / 2;
    let footerWidth = widthCanvas;
    let footerRectY = heightCanvas - footerHeight;
    ctx.fillRect(0, footerRectY, footerWidth, footerHeight);

    ctx.setLineWidth(1);
    ctx.setStrokeStyle('#eaeaea');
    ctx.moveTo(spaceAround, footerRectY);
    ctx.lineTo(spaceAround + autoWidth, footerRectY);

    //底部二维码图片
    ctx.drawImage(this.state.qrImagePath, spaceAround, footerRectY + 6, 50, 50);

    ctx.setFillStyle(blackColor);
    ctx.setFontSize(10);
    ctx.fillText('长按小程序码', spaceAround + 50 + 18, footerRectY + 28);

    ctx.setFillStyle(blackColor);
    ctx.setFontSize(10);
    ctx.fillText("进入" + config.appName + ' 阅读全文', spaceAround + 50 + 18, footerRectY + 42);
    ctx.stroke();
    ctx.draw(false, setTimeout(() => {
      this.canvasToTempFilePath();
    }, 2500));
  }

  canvasToTempFilePath = () => {
    var that = this;

    wx.canvasToTempFilePath({
      quality: 1,
      canvasId: 'posterImg',
      success: function (res) {
        let posterUrl = res.tempFilePath;
        that.saveImageToPhoto(posterUrl);
      },
      fail: function (res) {
      },
      complete: function (res) {
        wx.hideLoading();
      }
    }, that.$scope);
  }

  saveImageToPhoto = (posterUrl) => {
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: posterUrl,
      success(res) {
        that.onHandHide();
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail(res) {
        if (res.errMsg == "saveImageToPhotosAlbum:fail auth deny") {
          that.authorizeFail();
        }
        if (res.errMsg == "saveImageToPhotosAlbum:fail cancel") {
          wx.showToast({
            title: '取消保存',
            icon: 'none',
            duration: 1500
          })
        }
      }

    })

  }

  authorizeFail = () => {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.writePhotosAlbum']) {

        } else {
          wx.showModal({
            title: '保存相册未授权',
            content: '如需正常使用小程序，请点击授权按钮，勾选保存到相册。',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                  }
                })
              }
            }
          })
        }
      }
    })
  }

  onEditTitle = (e) => {
    this.setState({
      showTips: false,
    });
    let titleContent = e.currentTarget.dataset.text;
    let textLimit = e.currentTarget.dataset.limit;
    Taro.navigateTo({
      url: '/pages/projects/edit?text=' + titleContent + "&textLimit=" + textLimit
    })

  }

  onHandHide = () => {
    this.props.onHandHide();
  }







  render() {
    let coverImage = this.props.coverImage;
    let title = this.props.title;
    let shareArticleId = this.props.shareArticleId;
    let showTips = this.state.showTips;
    let TextShow = null;
    let coverImageShow = null;
    let contentTitleShow = null;
    let styleObject = {
      width: this.state.canvasWidth + "px",
      height: this.state.canvasHeight + "px"
    }

    if (coverImage) {
      TextShow = <Text class="read-from">正在阅读这篇文章</Text>
      coverImageShow = <View class="cover-image"><Image src={coverImage}></Image></View>
      contentTitleShow = <View class="title-content" onClick={this.onEditTitle} data-text={this.state.textContent} data-limit="50">
        <Text decode={'true'} space={true} >{this.state.textContent}</Text>
        {showTips
          ? <View class="tips-box">
            <View class="tips">
              点击文字可进行编辑哦
                                                    </View>
            <View class="arrow"></View>
          </View>
          : null
        }

      </View>
    } else {
      TextShow = <Text class="read-from">在 {this.state.appName} 上分享了一段文字</Text>
      coverImageShow = null;
      contentTitleShow = <View class="note-content" catchtap='onEditTitle' data-text={this.state.textContent} data-limit="140">
        <Text decode={'true'} space={true} >{this.state.textContent}</Text>
        {showTips
          ? <View class="tips-box">
            <View class="tips">
              点击文字可进行编辑哦
                                                    </View>
            <View class="arrow"></View>
          </View>
          : null
        }

      </View>
    }

    return (
      <View>
        <View class="poster-mask">
          <View class="modal-poster" id='modal-poster'>
            <View class="modal-body-poster">
              <View class="header">
                <View class="box-date">
                  <Text class="day">{this.state.arrDate[2]}</Text>
                  <Text class="month">{this.state.arrDate[1]}</Text>
                  <View class="line"></View>
                </View>
                <View class="date-time">
                  <Text>{arrDate[2]}/{arrDate[1]}/{arrDate[0]}</Text>
                </View>
                <View class="header-text">
                  <Text class="nickname">{this.state.nickName}</Text>
                  {TextShow}
                </View>
                {coverImageShow}
                {contentTitleShow}
              </View>
            </View>

            <View class="modal-footer-poster">
              <Image class="qrcode-image" src={this.state.qrImage}></Image>
              <Text class="text-top">长按小程序码</Text>
              <Text class="name-top">进入{this.state.appName} 阅读全文</Text>
            </View>
          </View>

          <View class="modal-save">
            <View class="save-btn" onClick={this.onSavePoster}>保存相册，分享到朋友圈</View>
          </View>
        </View>
        <canvas canvas-id="posterImg" style={styleObject}></canvas>
      </View>

    )
  }
}

export default PosterCard
