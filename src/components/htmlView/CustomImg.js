import Taro, { Component } from '@tarojs/taro'
import { Image } from '@tarojs/components'
import './template.less'

class CustomImg extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let item = this.props.item;
        return (<Image class="{{item.classStr}} wxParse-{{item.tag}}" data-from="{{item.from}}"
            data-src="{{item.attr.src}}"
            data-idx="{{item.imgIndex}}"
            src="{{item.attr.src}}"
            mode="aspectFit"
            bindload="wxParseImgLoad"
            bindtap="wxParseImgTap" mode="widthFix"
            style="width:{{item.width || item.attr && item.attr.width}}px;height:{{item.height}}px"
        />)
    }
}

export default CustomImg