'use strict';
import React, { Component, PropTypes } from 'react';
import { withRouter, browserHistory, Link } from 'react-router';

import CardList from './CardList.jsx';
import { SubscribeCard, Cards, Tips, Tip } from 'react-components-cce';

const nopic_feed_path = 'http://boom-static.static.cceato.com/boom/imgs/nopic_feed/';
const nopicNum = 31;
const { event, CATEGORYS, ACTIONS } = require('../../../common/TrackUtils');

export default class Subscribes extends Component {

    __hash__ = _id => {
        let hash = 0;
        _id = _id.slice(-4);
        for (let i = 0; i < _id.length; i++) {
            hash += _id[i].charCodeAt() * Math.pow(31, _id.length - i - 1);
        }
        return hash;
    };

    handleUnFollow = (topicId, feed) => {
        return () => {
            this.props.onUnTopicSubscribe(topicId, feed._id);
        };
    };

    feedback() {
        event(CATEGORYS.BUTTONS, ACTIONS.FEEDBACK, 'footer right');
    }

    render() {
        let { topics, feeds, animated } = this.props;
        let feedTopicMap = {};
        topics.forEach(t => {
            (t.subList || []).forEach(s => {
                feedTopicMap[s._id] = t._id;
            });
        });
        let subscribeComps = []
        subscribeComps = feeds.map((feed, index) => {
            let subscribed = feedTopicMap[feed._id] ? true : false;
            let operator = subscribed ?
                <a href="javascript:;" onClick={this.handleUnFollow(feedTopicMap[feed._id], feed)} style={{ color: 'rgb(194, 194, 194)', border: '1px solid rgb(194, 194, 194)' }}><span>取消订阅</span></a> :
                <a data-toggle="modal" data-target="#subscribeFollowModal" data-feed={JSON.stringify(feed)} ><span>订阅</span></a>;

            let TipsComponent = (
                <Tips gap="4px">
                    <Tip className="fa fa-eye" tip={feed.readNum} style={{ fontSize: "12px" }} />
                    <Tip className="fa fa-heart" tip={feed.likeNum} style={{ fontSize: "12px" }} />
                    <Tip className="fa fa-file-text-o" tip={feed.articleNum} style={{ fontSize: "12px" }} />
                </Tips>
            );
            let path = {
                pathname:'/subscribe/follow/' + feed._id,
                state:{keyword:this.props.keyword,type:this.props.type}
          
            }

            return (
                <SubscribeCard key={index}
                    cover={feed.iconUrl || nopic_feed_path + (this.__hash__(feed._id) % nopicNum + 1) + '.png'}
                    author={feed.name}
                    desc={feed.desc}
                    TipsComponent={TipsComponent}
                    animated={animated}
                    transitionDuration="300ms"
                    onClick={() => { browserHistory.push(path) }}>

                    {operator}
                </SubscribeCard>
            );
        });
        let cards = (<div>找不到相关订阅？请点击右下角
            <strong><a className="to-feedback" onClick={this.feedback} href="/feedback/brainboom" target="_blank">反馈</a></strong>给我们。例如：公众号，xxx
            </div>)
        if (subscribeComps.length > 0) {
            cards = <Cards rowCols="auto">
                {subscribeComps}
            </Cards>
        }

        return (
            <div>
                {cards}
            </div>
        )
    }
}

Subscribes.propTypes = {
    feeds: PropTypes.array,
    topics: PropTypes.array,
    animated: PropTypes.bool,
    onUnTopicSubscribe: PropTypes.func.isRequired
};