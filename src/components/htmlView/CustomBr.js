import Taro, { Component } from '@tarojs/taro'
import { Text} from '@tarojs/components'
import './template.less'

class CustomBr extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<Text>\n</Text>)
    }
}

export default CustomBr