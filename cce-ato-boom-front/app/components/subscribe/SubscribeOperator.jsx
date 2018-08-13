'use strict';
import React, { Component, PropTypes } from 'react';

export default class SubscribeOperator extends Component {

    constructor(props) {
        super(props);
        this.state = { unFollowing: false };
    }

    handleUnFollow() {
        this.setState({ unFollowing: true });
        this.props.onUnFollow();
        setTimeout(() => {
            this.setState({ unFollowing: false });
        }, 5000)
    }
    render() {
        const { feed, isShow } = this.props;
        let operator;
        if (this.props.isFollowed) {
            if (this.state.unFollowing) {
                operator = (
                    <i className="fa fa-spinner fa-pulse fa-2x fa-fw" />
                );
            } else {
                operator = (
                    <a onClick={ this.handleUnFollow.bind(this) } className="unSubscribe">
                        <span>取消订阅</span>
                    </a>
                );
            }
        } else {
            operator = (
                <a data-toggle="modal" data-target="#subscribeFollowModal" data-feed={ JSON.stringify(feed) }>
                    <span>订阅</span>
                    {!isShow&&<div className="subscribe-tips">订阅看所有文章</div>}
                </a>
            );
        }

        return (
            <div className="subscribe-operator">
                { operator }
            </div>
        );
    }
}

SubscribeOperator.propTypes = {
    feed: PropTypes.object.isRequired,
    isFollowed: PropTypes.bool.isRequired,
    onUnFollow: PropTypes.func
};