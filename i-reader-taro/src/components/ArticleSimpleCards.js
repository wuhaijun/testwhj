import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import "./ArticleSimpleCards.less"

class ArticleSimpleCards extends Component {
    constructor(props) {
        super(props);
    }
    onHandleDeatils = (id) => {
            Taro.navigateTo({ url: '/pages/projects/detail/index?id=' + id })
    }
    onHandleLongpress = (e) => {
        let articleId = e.currentTarget.dataset.eOnhandledeatilsAA;
        this.props.onHandleLongPress(true, articleId);
    }
    onScrolltolower = () => {
        this.props.onCollectScrolltolower();
    }
   
    render() {
        const themeMapping = this.props.themeMapping;
        const listItems = (this.props.projectList || []).map((item, index) => {
            return (
                <View key={index} data-id={ item.id } class="theme theme-nav" onClick={this.onHandleDeatils.bind(this,item._id)} onLongpress={this.onHandleLongpress}>
                    <View class="theme-each">
                        <Image class="theme-img" src={item.coverImg.url}></Image>
                        <View class="theme-name">
                            <View class="theme-txt">
                                <Text>{item.title}</Text>
                            </View>
                            <View class="theme-title">
                                <View data-theme-list="{themeList}" data-theme="{item.themeId}" onClick={this.onHandleNavigateTotheme}>{themeMapping[item.themeId].name}</View>
                                <View>{item.datePublished}</View>
                            </View>
                        </View>
                    </View>
                </View>
            )
        })
        return (
            <ScrollView scroll-y style='height: 100%;box-sizing: border-box;margin: 0 32rpx;width: auto' onScrolltolower= { this.onScrolltolower }>
                { listItems }
            </ScrollView>
        )
    }
}

export default ArticleSimpleCards