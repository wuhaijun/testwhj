import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import "./ShareBar.less"
import icon_haibao from '../public/icon/icon_haibao.png'
import icon_wechat from '../public/icon/icon_wechat.png'


class ShareBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        }
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }
    
    onMadePoster = (e)=> {
        this.props.onMadePoster();
    }
    render() {

        return (
            <View>
                <View class="share-bar">
                    <View class="li-bar-share" onClick={ this.onMadePoster }>
                        <View class="image-wrap">
                            <Image src={ icon_haibao }></Image>
                        </View>
                        <p>生成海报</p>
                    </View>
                    <View class="li-bar-share">

                        <Button class="share-button" plain="true" open-type="share">
                            <View class="image-wrap">
                                <Image src={ icon_wechat }></Image>
                            </View>
                            发送给朋友</Button>
                    </View>
                </View>
            </View>
        )
    }
}

export default ShareBar
