import Taro, { Component } from '@tarojs/taro'
import { View, Button, Textarea, Navigator, Image } from '@tarojs/components'
import './edit.less'
import { changeText } from '../../actions/common'
import { connect } from '@tarojs/redux'




let mapState = state => {
  return {}
}

let mapDispatch = dispatch => ({
  changeText(textContent) {
    dispatch(changeText(textContent))
  }
})

@connect(mapState, mapDispatch)

class Edit extends Component {
  config = {
    navigationBarTitleText: '三千米🐬'
  }

  constructor(props) {
    super(props);
    this.state = {
      textContent: '',
      textCountLength: 0,
      save: true,
      disabled: false,
      limitLength: 0
    }
  }


  componentDidMount() {
    if (this.$router.params.text) {
      let textContent = this.$router.params.text;
      let textCountLength = textContent.length;
      this.setState({
        textCountLength: textCountLength,
        textContent: textContent
      });


    }
    let textLimit = this.$router.params.textLimit;
    this.setState({ limitLength: textLimit });


  }



  componentWillUnmount() {
    if (this.state.save) {

      this.props.changeText(this.state.textContent);
    }

  }

  onChangeText = function (event) {
    let newText = event.detail.value;
    this.setState({
      textCountLength: newText.length,
      textContent: newText
    });
  }

  onCancel = function () {
    this.setState({
      save: false
    });
    wx.navigateBack();

  }

  onSave = function () {
    wx.navigateBack();
  }




  render() {
    return (
      <View class="editor-title">
        <View class="text-area">
          {this.state.textxxx}
          <Textarea maxlength={this.state.limitLength} value={this.state.textContent} onInput={this.onChangeText} class="content" showConfirmBar="false" autoFocus />
          <View class="count">
            <Text>{this.state.textCountLength}</Text><span>/</span><Text>{this.state.limitLength}</Text>
          </View>
        </View>

        <View class="footer">
          <View onClick={this.onCancel} class="cancel common-btn" plain="true">取消</View>
          <View onClick={this.onSave} class="save common-btn">保存</View>
        </View>

      </View >

    )
  }

}

export default Edit

