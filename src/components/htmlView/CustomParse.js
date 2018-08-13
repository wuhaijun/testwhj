import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import './template.less'
import CustomTextView from './CustomTextView'
import CustomVideo from './CustomVideo'
import CustomBr from './CustomBr'
import CustomImg from './CustomImg'

class CustomParse extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let item = this.props.item;
        let body;
        if (item.node === 'element') {
            if (item.tag === 'button') {
                body = <Button type="default" size="mini">
                    {item.nodes.map((item) => {
                        <CustomParse item={item}></CustomParse>
                    })}
                </Button>

            }
            else if (item.tag === 'li') {
                body = <View class="{{item.classStr}} wxParse-li" style="{{item.styleStr}}">
                    <View class="{{item.classStr}} wxParse-li-inner">
                        <View class="{{item.classStr}} wxParse-li-text">
                            <View class="{{item.classStr}} wxParse-li-circle"></View>
                        </View>
                        <View class="{{item.classStr}} wxParse-li-text">
                            {
                                item.nodes.map((item) => {
                                    <CustomParse item={item}></CustomParse>
                                })
                            }
                        </View>
                    </View>
                </View >
            }
            else if (item.tag === 'video') {
                body = <CustomVideo item={item}></CustomVideo>
            }
            else if (item.tag === 'img') {
                body = <CustomImg item={item}></CustomImg>
            }
            else if (item.tag === 'a') {
                body = <View bindtap="wxParseTagATap" class="wxParse-inline {{item.classStr}} wxParse-{{item.tag}}" data-src="{{item.attr.href}}" style="{{item.styleStr}}">
                    {
                        item.nodes.map((item) => {
                            <CustomParse item={item}></CustomParse>
                        })
                    }
                </View >
            }
            else if (item.tag === 'table') {
                body = <View class="{{item.classStr}} wxParse-{{item.tag}}" style="{{item.styleStr}}">
                    {
                        item.nodes.map((item) => {
                            <CustomParse item={item}></CustomParse>
                        })
                    }
                </View>
            }
            else if (item.tag === 'br') {
                body = <CustomBr item={item}></CustomBr>
            }
            else if (item.tagType === 'block') {
                body = <View bindtap="wxParseTagATap" class="wxParse-inline {{item.classStr}} wxParse-{{item.tag}}" data-src="{{item.attr.href}}" style="{{item.styleStr}}">
                    {
                        item.nodes.map((item) => {
                            <CustomParse item={item}></CustomParse>
                        })
                    }
                </View >
            }
            else {
                body = <View bindtap="wxParseTagATap" class="wxParse-inline {{item.classStr}} wxParse-{{item.tag}}" data-src="{{item.attr.href}}" style="{{item.styleStr}}">
                    {
                        item.nodes.map((item) => {
                            <CustomParse item={item}></CustomParse>
                        })
                    }
                </View >
            }
        } else if (item.node === 'text') {
            body = <CustomTextView item={item}></CustomTextView>
        }
        return (<View>
            {body}
        </View>)
    }
}

export default CustomParse