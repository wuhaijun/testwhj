import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Navigator, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { getProjectDetail } from '../../actions/project'
import { generatorNodes } from '../../actions/common'
import './details.less'

import util from '../../utils/util'
import HtmlTemplate from '../../components/htmlView/HtmlTemplate'


let mapState = state => {
  return { projectDetail: state.projectDetail, nodes: state.nodes }
}

let mapDispatch = dispatch => ({
  getProjectDetail(projectId) {
    dispatch(getProjectDetail(projectId))
  },
  generatorNodes(type, text, target) {
    dispatch(generatorNodes(type, text, target))
  }
})

@connect(mapState, mapDispatch)
class Details extends Component {
  config = {
    navigationBarTitleText: 'project'
  }

  constructor(props) {
    super(props);
    this.state = {
      showFooter: true,
      loading: true,
      showShareBar: false,
      notes: {}, //notes用来记录原始标注的信息，即从数据库中获取的标注信息
      showPosterMask: false,
      article: {},
      editorTitle: "",
      hasContent: true,
      shareImg: "",
      shareContent: "",
      shareArticleId: "",
      showBackHome: false,
      showBackHomeSmall: false,
      projectId: '',
      projectDetail: {}
    }
  }

  handleClick() {

  }

  componentWillMount() {
    let projectId = this.$router.params.id;
    this.props.getProjectDetail(projectId);

  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextProps.projectDetail) return false;
    return true;
  }

  render() {
    let projectDetail = this.props.projectDetail;
    let title = util.replaceHtmlChar(projectDetail.title);
    let biz_name = projectDetail.biz_name || '脑洞资讯平台';
    let datePublished = util.formatDate(new Date(projectDetail.datePublished));
    let text = projectDetail.text;

    return (
      <View class="article-detail">
        <View class="title">
          <Text selectable="true">{title}</Text>
        </View>
        <Text class="from">{biz_name}.{datePublished}</Text>
        <HtmlTemplate nodes={this.props.nodes}/>
      </View>
    )
  }
}

export default Details
