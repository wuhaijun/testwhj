import Taro, {Component} from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'
import collect from '../public/icon/icon_collect_pre.png'
import collected from '../public/icon/icon_collect_nor.png'
import share from '../public/icon/icon_share_nor.png'
import loadingsvg from '../public/icon/loading.svg'
import '../pages/projects/index.less'
import {connect} from '@tarojs/redux'
import { doProjectCollect } from '../actions/project';
let mapState = state => {
  return {
    projectList: state.projectList,
    themeMapping: state.themeMapping
  }
}

let mapDispatch = dispatch => ({
  onDoProjectCollect(id) {
    dispatch(doProjectCollect(id))
  }
})

@connect(mapState, mapDispatch)
class ArticleCards extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        }
    }
    onHandleDeatils = (e) => {
       let articleId = e.currentTarget.dataset.articleId;
        Taro.navigateTo({url: '/pages/projects/detail/index?id=' + articleId})
    }

    onHandleCollect = (e) => {
      let id = e.currentTarget.dataset.id;
      this.props.onDoProjectCollect(id)
    }

    onHandleTotheme = (e) => {
       let _id = e.currentTarget.dataset.id;
         Taro.navigateTo({
           url: '/pages/themes/deatils?id=' + _id
         })
    }
    onHandleShare = (e)=> {
        let dataShare  = e.currentTarget.dataset; 
        this.props.onHandleShare(true,dataShare);
    }

    render() {
        const themeMapping = this.props.themeMapping;
        const listItems = this.props.projectList
            .map((item, index) => {
                return (
                    <View key={index}>
                        <View class="information-article-each">
                            <View class="information-img" data-article-id="{{ item._id }}" onClick={this.onHandleDeatils}>
                                <View class="information-bgimg" style="background-Image: url({{ item.coverImg.url }})"></View>
                            </View>
                            <View class='information-title' onClick={this.onHandleDeatils} >{item.title}</View>
                            <View class="information-box">
                                <View class="information-headline">
                                    { this.props.isClick ?
                                    <Text onClick={ this.onHandleTotheme } data-id={ item.themeId } class='information-name'>{themeMapping[item.themeId].name}</Text> :
                                    <Text class='information-name information-name-un'>{themeMapping[item.themeId].name}</Text> }
                                    <Text class='information-time'>{item.datePublished}</Text>
                                </View>
                                <View class="information-icon">
                                    <Image src={item.isCollected ? collect : collected} data-id={ item._id } onClick={ this.onHandleCollect }></Image>
                                    <Text>{item.collectCount}</Text>
                                    <Image src={share} data-id={ item._id } data-title={ item.title } data-url={ item.coverImg.url } onClick={ this.onHandleShare }></Image>
                                    <Text>{item.shareCount}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )
            })
        return (
            <View>
                <View class="information-article">
                    <View>{listItems}</View>
                </View>
                { loading && <View class="load-content">
                    <Image class="loading-svg" src={ loadingsvg }></Image>
                </View> }
            </View>
        )
    }
}

export default ArticleCards
