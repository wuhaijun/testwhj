import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import './template.less'

class CustomTextView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let item = this.props.item;
        let body = item.map(textArrayItem => {
            if (textArrayItem.node === 'text') {
                return <Text>{textArrayItem.text}</Text>
            } else if (textArrayItem.node === 'element') {
                return <Image>{textArrayItem.text}</Image>
            }
        })

        return (<View>
            {body}
        </View>)
    }
}

export default CustomTextView