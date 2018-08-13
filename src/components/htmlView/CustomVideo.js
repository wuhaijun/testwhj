import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './template.less'
import CustomParse from './CustomParse'

class CustomVideo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let item = this.props.item;
        let body = item.map((item => {
            <CustomParse item={item}></CustomParse>
        }))
        return (<View>
            {body}
        </View >)
    }
}

export default CustomVideo