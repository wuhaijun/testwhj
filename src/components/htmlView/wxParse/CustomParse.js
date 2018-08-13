import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, RichText ,Button} from '@tarojs/components'
import './custom-parse.less'

class CustomParse extends Component {
    constructor(props) {
        super(props);
    }
    
    componentWillMount() {

    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) { 

    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
       console.log("+++++this.props.nodes",this.props.nodes);
       let item = this.props.nodes;
/*        let a1Button;
       if(item.node == 'element'){
           if(item.tag == 'button'){
 
                a1Button = <Button type="default" size="mini">
                {  item.nodes.map((list,index)=>{
                     console.log("list",list);
                        return (<CustomParse nodes = { list } key={ index }></CustomParse>) 
                    })   } 
                </Button>

           }

       }else{

       } */
     

        return (
            <View>
                { a1Button }
                <RichText nodes={ item.node }></RichText>
            </View >
        )
    }
}

export default CustomParse



// const listItems = this.props.projectList
// .map((item, index) => {
//     return (
//         <View key={index}>
//             <View class="information-article-each">
//                 <View class="information-img" data-article-id="{{ item._id }}" onClick={this.handleDeatils}>
//                     <View class="information-bgimg" style="background-Image: url({{ item.coverImg.url }})"></View>
//                 </View>
//                 <View class='information-title' catchtap="onArticleTap">{item.title}</View>
//                 <View class="information-box">
//                     <View class="information-headline">
//                         <Text catchtap='navigateTotheme' class='information-name'>{themeMapping[item.themeId].name}</Text>
//                         {/* <Text class='information-name information-name-un'>{ themeList[item.themeId].name }</Text> */}
//                         <Text class='information-time'>{item.datePublished}</Text>
//                     </View>
//                     <View class="information-icon">
//                         <Image src={item.isCollected ? collect : collected} data-id={ item._id } onClick={ this.handleCollect }></Image>
//                         <Text>{item.collectCount}</Text>
//                         <Image src={share}></Image>
//                         <Text>{item.shareCount}</Text>
//                     </View>
//                 </View>
//             </View>
//         </View>
//     )
// })





/* 

<block wx:if="{{item.node == 'element'}}">
    <block wx:if="{{item.tag == 'button'}}">
      <button type="default" size="mini">
        <block wx:for="{{item.nodes}}" wx:for-item="item" wx:key="">
          <custom-parse item="{{item}}" notes="{{notes}}"></custom-parse>
        </block>
      </button>
    </block>
    <!--li类型-->
    <block wx:elif="{{item.tag == 'li'}}">
      <view class="{{item.classStr}} wxParse-li" style="{{item.styleStr}}">
        <view class="{{item.classStr}} wxParse-li-inner">
          <view class="{{item.classStr}} wxParse-li-text">
            <view class="{{item.classStr}} wxParse-li-circle"></view>
          </view>
          <view class="{{item.classStr}} wxParse-li-text">
            <block wx:for="{{item.nodes}}" wx:for-item="item" wx:key="">
               <custom-parse item="{{item}}" notes="{{notes}}"></custom-parse>
            </block>
          </view>
        </view>
      </view>
    </block>

    <!--video类型-->
    <block wx:elif="{{item.tag == 'video'}}">
      <custom-parse-video item="{{item}}"></custom-parse-video>
    </block>

    <!--img类型-->
    <block wx:elif="{{item.tag == 'img'}}">
      <custom-parse-img item="{{item}}"></custom-parse-img>
    </block>

    <!--a类型-->
    <block wx:elif="{{item.tag == 'a'}}">
      <view bindtap="wxParseTagATap" class="wxParse-inline {{item.classStr}} wxParse-{{item.tag}}" data-src="{{item.attr.href}}" style="{{item.styleStr}}">
        <block wx:for="{{item.nodes}}" wx:for-item="item" wx:key="">
           <custom-parse item="{{item}}" notes="{{notes}}"></custom-parse>
        </block>
      </view>
    </block>
    <block wx:elif="{{item.tag == 'table'}}">
      <view class="{{item.classStr}} wxParse-{{item.tag}}" style="{{item.styleStr}}">
        <block wx:for="{{item.nodes}}" wx:for-item="item" wx:key="">
           <custom-parse item="{{item}}" notes="{{notes}}"></custom-parse>
        </block>
      </view>
    </block>

    <block wx:elif="{{item.tag == 'br'}}">
      <custom-parse-br item="{{item}}"></custom-parse-br>
    </block>
    <!--其他块级标签-->
    <block wx:elif="{{item.tagType == 'block'}}">
      <view class="{{item.classStr}} wxParse-{{item.tag}}" style="{{item.styleStr}}">
        <block wx:for="{{item.nodes}}" wx:for-item="item" wx:key="">
           <custom-parse item="{{item}}" notes="{{notes}}"></custom-parse>
        </block>
      </view>
    </block>

    <!--内联标签-->
    <view wx:else class="{{item.classStr}} wxParse-{{item.tag}} wxParse-{{item.tagType}}" style="{{item.styleStr}}">
      <block wx:for="{{item.nodes}}" wx:for-item="item" wx:key="">
         <custom-parse item="{{item}}" notes="{{notes}}"></custom-parse>
      </block>
    </view>

  </block>

  <!--判断是否是文本节点-->
  <block wx:elif="{{item.node == 'text'}}">
    <!--如果是，直接进行-->
    <custom-emoji-view item="{{item}}" bind:onMark="onMark" notes="{{notes}}"></custom-emoji-view>
  </block>



 */