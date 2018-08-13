import React, { Component } from 'react';
import { connect } from 'react-redux';
import { accountList, handleStep, save } from '../../actions/guide.js';
import { SubscribeCard, Cards } from 'react-components-cce';
import Spinner from './../common/Spinner.jsx';


const nopic_feed_path = 'http://boom-static.static.cceato.com/boom/imgs/nopic_feed/';
const nopicNum = 31;

const __hash__ = _id => {
    let hash = 0;
    _id = _id.slice(-4);
    for (let i = 0; i < _id.length; i++) {
        hash += _id[i].charCodeAt() * Math.pow(31, _id.length - i - 1);
    }
    return hash;
};

class ModalContent2 extends Component {
    constructor(props) {
        super(props);
        this.state = { pageSize: 6, offset: 0 };
    }

    componentDidMount() {
        let categoryIds = this.props.selectedInterests.map(it => it._id);
        this.props.onAccountList(categoryIds);
    }

    onBtnClick = feed => {
        return () => {
            this.props.onSelectedFeed(feed);
        };
    };

    goBack = () => {
        this.props.onStep(0);
    };

    page = feeds => {
        let count = feeds.length;
        let pageSize = this.state.pageSize;
        let offset = this.state.offset;

        if (count <= pageSize) {
            return feeds;
        }

        let end = offset + pageSize;
        if (end > count) {
            return feeds.slice(offset, count).concat(feeds.slice(0, end - count));
        } else {
            return feeds.slice(offset, end);
        }
    };


    nextPage = () => {
        let count = this.props.feeds.length;
        //let offset = this.state.offset + this.state.pageSize;
        //if (offset > count - this.state.pageSize) {
        //    offset = Math.floor(Math.random() * (count - this.state.pageSize + 1));
        //}
        let offset = (this.state.offset + this.state.pageSize) % count;
        this.setState({ offset: offset })
    };

    handleSubmit = isSkip => {
        return () => {
            this.props.onSubmit(isSkip);
        };
    };

    render() {
        const { feeds, selectedFeeds } = this.props;
        if (!feeds || feeds.length == 0) {
            return <Spinner />
        }

        let subscribeComps = [];
        let currentFeeds = this.page(feeds);

        currentFeeds.map(feed => {
            let index = selectedFeeds.findIndex(it => it._id == feed._id);
            let btnTitle = index != -1 ? '取消订阅' : '订阅';
            let operatorSytle = index != -1 ? { color: 'lightgrey', borderColor: 'lightgrey' } : {};

            let operator = <a style={operatorSytle} id={feed._id} onClick={this.onBtnClick(feed)}><span id={feed._id}>{btnTitle}</span></a>;
            subscribeComps.push(
                <SubscribeCard
                    onClick={this.onBtnClick(feed)}
                    key={feed._id}
                    cover={feed.iconUrl || nopic_feed_path + (__hash__(feed._id) % nopicNum + 1) + '.png'}
                    author={feed.name}
                    animated={false}
                    transitionDuration="300ms"
                    desc={feed.desc}>
                    {operator}
                </SubscribeCard>
            )
        });

        return (
            <div>
                <h1 className="guide-title">请选取你想订阅的账号</h1>
                <div className="guide-body guide-feeds-content">
                    <div className="guide-item">
                        <Cards>
                            {subscribeComps}
                        </Cards>
                        <div className="exchange"><span onClick={this.nextPage}>换一批</span></div>
                    </div>

                    <div className="guide-option">
                        <button type="button" onClick={this.goBack} className="btn guide-option-btn guide-btn-back">返回</button>
                        <button type="button" onClick={this.handleSubmit(false)} className="btn btn-primary guide-option-btn">完成</button>
                        <button type="button" onClick={this.handleSubmit(true)} className="btn guide-btn-skip">跳过</button>
                    </div>

                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.loading,
        feeds: state.guide.feeds
    }
};

const mapDispatchToProps = {
    onAccountList: accountList,
    onStep: handleStep
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalContent2);