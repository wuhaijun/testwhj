import Taro, { Component } from '@tarojs/taro'
import { View, Button, Navigator, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { getProjectSearchList } from '../../actions/project';
import ArticleSimpleCards from '../../components/ArticleSimpleCards'
import search_icon from '../../public/icon/icon_search.png'
import search_empty from '../../public/icon/icon_search_empty.png'
import loading_icon from '../../public/icon/loading.svg'
import { getThemeList } from '../../actions/theme';
import './search.less'

let mapState = state => ({
    searchList: state.projectSearchList,
    themeMapping: state.themeMapping,
    loading: state.loading
})

let mapDispatch = dispatch => ({
    onGetProjectSearchList(keyword, page) {
        dispatch(getProjectSearchList(keyword, page))
    },
    onGetThemeList() {
        dispatch(getThemeList())
    }
})

@connect(mapState, mapDispatch)
class Search extends Component {
    config = {
        navigationBarTitleText: 'search'
    }

    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            keywords: [],
            search: false,
            loading: false,
            page: 2,
            loadCompleted: false
        }
    }

    componentDidMount() {
        Taro.getStorage({ key: 'history' })
            .then(res => {
                this.setState({
                    keywords: res.data
                })
            })
    }

    componentWillMount() {
        this.props.onGetThemeList();
    }

    onHandleConfirm = (e) => {
        let keyword = e.detail.value || e.target.dataset.keyword || "";
        if (!keyword || !keyword.trim()) { return }
        this.props.onGetProjectSearchList(keyword, 1)
        let keywords = [...this.state.keywords];
        let index = keywords.findIndex(it => it == keyword);
        if (index != -1) keywords.splice(index, 1);
        keywords.unshift(keyword);
        if (this.props.searchList.length == 0){
            this.setState({
                search: true,
                loading: false
            })
        }
        this.setState({ keywords: keywords.slice(0, 10), search: true, keyword:keyword, loading: true, page: 2 })
        Taro.setStorage({
            key: 'history',
            data: keywords,
        });
    }

    onHandleClear = () => {
        Taro.removeStorageSync('history')
        this.setState({ keywords: [] })
    }

     loadmore = () => {
        let page = Math.ceil((this.props.searchList.length / 24));
        let nextPage = page + 1;
        let keyword = this.state.keyword;
        this.props.onGetProjectSearchList(keyword, nextPage)
     }

     onReachBottom = () => {
       this.loadmore();
     }
     


    render() {
        let historyList = this.state.keywords.map((item, index) => {

            return <View key={index} onClick={ this.onHandleConfirm } data-keyword={item} class="history-list">{item}</View>
        })
        return (
            <View class="search">
                <View class="search-input">
                    <Image class="search-img" src={search_icon}></Image>
                    <Input type='Text' placeholder="搜索主题或者关键字" value={this.state.keyword} onConfirm={this.onHandleConfirm} focus confirmType="完成" adjustPosition="false"></Input>
                </View>
                {!this.state.search ? <View class="search-history-box">
                    <View class="search-history">
                        <Text>历史搜索记录</Text>
                        <Text onClick={this.onHandleClear}>清空</Text>
                    </View>
                    <View class="record">
                        <block>
                            {historyList}
                        </block>
                    </View>
                </View> : ""}
                {this.props.searchList.length == 0 && !this.props.loading && this.state.search? <View>
                    <View class="search-empty-view"><Image class="search-empty" src={search_empty}></Image></View>
                    <Text class="search-empty-text">抱歉，没有找到相关内容</Text>
                </View> :
                    <View>
                        <ArticleSimpleCards projectList={this.props.searchList} themeMapping={this.props.themeMapping} />

                        {this.props.loading && <View class="load-content">
                            <Image class="loading-svg" src={loading_icon}></Image>
                        </View>}
                    </View>}
            </View>
        )
    }
}

export default Search
